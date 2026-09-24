from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import os
import joblib
import requests

from concurrent.futures import ThreadPoolExecutor, as_completed

from rdkit import Chem
from rdkit.Chem import Descriptors

from sqlalchemy.orm import Session

from database import get_db
from models import PredictionHistory


# ==========================================
# FASTAPI APP
# ==========================================

app = FastAPI(
    title="MoleSol AI API",
    description="Molecular Solubility Prediction API",
    version="1.0.0"
)


# ==========================================
# CORS
# ==========================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==========================================
# MODEL PATH
# ==========================================

BASE_DIR = os.path.dirname(
    os.path.dirname(
        os.path.abspath(__file__)
    )
)

MODEL_PATH = os.path.join(
    BASE_DIR,
    "ml",
    "models",
    "best_model.pkl"
)


# ==========================================
# LOAD MODEL
# ==========================================

try:

    model = joblib.load(MODEL_PATH)

    print("========================================")
    print("ML model loaded successfully.")
    print("========================================")

except Exception as e:

    model = None

    print("========================================")
    print("Error loading ML model:")
    print(e)
    print("========================================")


# ==========================================
# REQUEST MODELS
# ==========================================

class PredictionRequest(BaseModel):
    smiles: str


class BatchPredictionRequest(BaseModel):
    smiles: list[str]


# ==========================================
# SOLUBILITY CATEGORY
# ==========================================

def get_solubility_category(logS: float):

    if logS >= 0:
        return "Highly Soluble"

    elif logS >= -2:
        return "Soluble"

    elif logS >= -4:
        return "Moderately Soluble"

    else:
        return "Low Solubility"


# ==========================================
# MOLECULAR DESCRIPTORS
# ==========================================

def calculate_descriptors(smiles: str):

    mol = Chem.MolFromSmiles(smiles)

    if mol is None:
        raise ValueError("Invalid SMILES string.")

    descriptors = [
        Descriptors.MolWt(mol),
        Descriptors.ExactMolWt(mol),
        Descriptors.MolLogP(mol),
        Descriptors.TPSA(mol),
        Descriptors.NumHDonors(mol),
        Descriptors.NumHAcceptors(mol),
        Descriptors.NumRotatableBonds(mol),
        Descriptors.RingCount(mol),
        Descriptors.HeavyAtomCount(mol),
        Descriptors.FractionCSP3(mol),
        Descriptors.NumAromaticRings(mol),
        Descriptors.NumValenceElectrons(mol),
    ]

    return descriptors


# ==========================================
# PUBCHEM NAME LOOKUP
# ==========================================

def get_molecule_name(smiles: str):

    try:

        encoded_smiles = requests.utils.quote(
            smiles.strip(),
            safe=""
        )

        url = (
            "https://pubchem.ncbi.nlm.nih.gov"
            "/rest/pug/compound/smiles/"
            f"{encoded_smiles}/property/"
            "Title,IUPACName/JSON"
        )

        response = requests.get(
            url,
            headers={
                "User-Agent": "MoleSol-AI/1.0"
            },
            timeout=20
        )

        print(
            f"PubChem response for {smiles}: "
            f"{response.status_code}"
        )

        if response.status_code == 200:

            data = response.json()

            properties = (
                data
                .get("PropertyTable", {})
                .get("Properties", [])
            )

            if properties:

                compound = properties[0]

                title = compound.get("Title")

                if title:
                    print(
                        f"Name found for {smiles}: {title}"
                    )
                    return title

                iupac_name = compound.get(
                    "IUPACName"
                )

                if iupac_name:
                    print(
                        f"IUPAC name found for {smiles}: "
                        f"{iupac_name}"
                    )
                    return iupac_name

        synonym_url = (
            "https://pubchem.ncbi.nlm.nih.gov"
            "/rest/pug/compound/smiles/"
            f"{encoded_smiles}/synonyms/JSON"
        )

        synonym_response = requests.get(
            synonym_url,
            headers={
                "User-Agent": "MoleSol-AI/1.0"
            },
            timeout=20
        )

        print(
            f"PubChem synonym response for {smiles}: "
            f"{synonym_response.status_code}"
        )

        if synonym_response.status_code == 200:

            synonym_data = synonym_response.json()

            information = (
                synonym_data
                .get("InformationList", {})
                .get("Information", [])
            )

            if information:

                synonyms = information[0].get(
                    "Synonym",
                    []
                )

                if synonyms:
                    print(
                        f"Synonym found for {smiles}: "
                        f"{synonyms[0]}"
                    )
                    return synonyms[0]

        print(
            f"No PubChem name found for {smiles}"
        )

        return "Unknown"

    except Exception as e:

        print(
            f"PubChem lookup failed for "
            f"{smiles}: {repr(e)}"
        )

        return "Unknown"


# ==========================================
# ROOT
# ==========================================

@app.get("/")
def root():

    return {
        "message": "MoleSol AI API is running",
        "model_loaded": model is not None,
        "database": "MySQL"
    }


# ==========================================
# HEALTH
# ==========================================

@app.get("/health")
def health():

    return {
        "status": "healthy",
        "model_loaded": model is not None,
        "database": "MySQL"
    }


# ==========================================
# SINGLE PREDICTION
# ==========================================

@app.post("/predict")
def predict(
    request: PredictionRequest,
    db: Session = Depends(get_db)
):

    # --------------------------------------
    # Clean SMILES
    # --------------------------------------

    smiles = request.smiles.strip()

    if not smiles:

        raise HTTPException(
            status_code=400,
            detail="SMILES cannot be empty."
        )


    # --------------------------------------
    # Check model
    # --------------------------------------

    if model is None:

        raise HTTPException(
            status_code=500,
            detail="Machine learning model is not loaded."
        )


    # --------------------------------------
    # Validate SMILES
    # --------------------------------------

    mol = Chem.MolFromSmiles(smiles)

    if mol is None:

        raise HTTPException(
            status_code=400,
            detail="Invalid SMILES string."
        )


    try:

        # ----------------------------------
        # Calculate descriptors
        # ----------------------------------

        features = [
            calculate_descriptors(smiles)
        ]


        # ----------------------------------
        # Prediction
        # ----------------------------------

        prediction = model.predict(features)[0]

        prediction = round(
            float(prediction),
            4
        )


        # ----------------------------------
        # Molecule name
        # ----------------------------------

        molecule_name = get_molecule_name(smiles)


        # ----------------------------------
        # Category
        # ----------------------------------

        category = get_solubility_category(
            prediction
        )


        # ----------------------------------
        # Save to MySQL
        # ----------------------------------

        prediction_record = PredictionHistory(

            molecule_name=molecule_name,

            smiles=smiles,

            predicted_solubility=prediction,

            category=category,

            prediction_type="single"
        )


        db.add(prediction_record)

        db.commit()

        db.refresh(prediction_record)


        # ----------------------------------
        # Response
        # ----------------------------------

        return {

            "success": True,

            "id": prediction_record.id,

            "name": molecule_name,

            "smiles": smiles,

            "predicted_solubility": prediction,

            "category": category,

            "prediction_type": "single",

            "message": "Prediction completed and saved successfully."

        }


    except Exception as e:

        db.rollback()

        print(
            "Prediction error:",
            e
        )

        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {str(e)}"
        )


# ==========================================
# BATCH PREDICTION
# ==========================================

@app.post("/predict-batch")
def predict_batch(
    request: BatchPredictionRequest,
    db: Session = Depends(get_db)
):

    # --------------------------------------
    # Check model
    # --------------------------------------

    if model is None:

        raise HTTPException(
            status_code=500,
            detail="Machine learning model is not loaded."
        )


    # --------------------------------------
    # Clean input
    # --------------------------------------

    smiles_list = [
        smiles.strip()
        for smiles in request.smiles
        if smiles.strip()
    ]


    if not smiles_list:

        raise HTTPException(
            status_code=400,
            detail="No SMILES strings provided."
        )


    print(
        f"Batch prediction started for "
        f"{len(smiles_list)} molecules."
    )


    # --------------------------------------
    # Validate + calculate descriptors
    # --------------------------------------

    valid_items = []

    results = []


    for index, smiles in enumerate(smiles_list):

        try:

            mol = Chem.MolFromSmiles(smiles)

            if mol is None:

                results.append({

                    "index": index,

                    "smiles": smiles,

                    "name": "Unknown",

                    "predicted_solubility": None,

                    "category": None,

                    "error": "Invalid SMILES string."

                })

                continue


            features = calculate_descriptors(
                smiles
            )


            valid_items.append({

                "index": index,

                "smiles": smiles,

                "features": features

            })


        except Exception as e:

            results.append({

                "index": index,

                "smiles": smiles,

                "name": "Unknown",

                "predicted_solubility": None,

                "category": None,

                "error": str(e)

            })


    # --------------------------------------
    # Batch ML prediction
    # --------------------------------------

    predictions = []

    if valid_items:

        valid_features = [
            item["features"]
            for item in valid_items
        ]

        predictions = model.predict(
            valid_features
        )


    # --------------------------------------
    # Parallel PubChem lookup
    # --------------------------------------

    names = {}


    if valid_items:

        with ThreadPoolExecutor(
            max_workers=10
        ) as executor:

            future_to_smiles = {

                executor.submit(
                    get_molecule_name,
                    item["smiles"]
                ): item["smiles"]

                for item in valid_items
            }


            for future in as_completed(
                future_to_smiles
            ):

                smiles = future_to_smiles[
                    future
                ]

                try:

                    names[smiles] = (
                        future.result()
                    )

                except Exception:

                    names[smiles] = "Unknown"


    # --------------------------------------
    # Combine predictions
    # --------------------------------------

    try:

        for prediction_number, item in enumerate(
            valid_items
        ):

            prediction = round(
                float(
                    predictions[prediction_number]
                ),
                4
            )


            smiles = item["smiles"]


            molecule_name = names.get(
                smiles,
                "Unknown"
            )


            category = get_solubility_category(
                prediction
            )


            # ------------------------------
            # Save batch prediction
            # ------------------------------

            prediction_record = PredictionHistory(

                molecule_name=molecule_name,

                smiles=smiles,

                predicted_solubility=prediction,

                category=category,

                prediction_type="virtual_screening"
            )


            db.add(prediction_record)


            # ------------------------------
            # Result
            # ------------------------------

            results.append({

                "index": item["index"],

                "id": None,

                "smiles": smiles,

                "name": molecule_name,

                "predicted_solubility": prediction,

                "category": category,

                "error": None

            })


        # ----------------------------------
        # Save all batch records
        # ----------------------------------

        db.commit()


        # ----------------------------------
        # Get inserted IDs
        # ----------------------------------

        saved_records = []

        for item in valid_items:

            record = (
                db.query(PredictionHistory)
                .filter(
                    PredictionHistory.smiles
                    == item["smiles"]
                )
                .order_by(
                    PredictionHistory.id.desc()
                )
                .first()
            )

            if record:

                saved_records.append(
                    (
                        item["index"],
                        record.id
                    )
                )


        # Add IDs to results
        for result in results:

            for index, record_id in saved_records:

                if result["index"] == index:

                    result["id"] = record_id

                    break


    except Exception as e:

        db.rollback()

        print(
            "Batch database error:",
            e
        )

        raise HTTPException(
            status_code=500,
            detail=f"Batch prediction failed: {str(e)}"
        )


    # --------------------------------------
    # Restore original order
    # --------------------------------------

    results.sort(
        key=lambda x: x["index"]
    )


    # --------------------------------------
    # Remove internal index
    # --------------------------------------

    for result in results:

        result.pop(
            "index",
            None
        )


    print(
        f"Batch prediction completed: "
        f"{len(results)} molecules."
    )


    # --------------------------------------
    # Return response
    # --------------------------------------

    return {

        "success": True,

        "count": len(results),

        "results": results,

        "message": (
            "Batch prediction completed "
            "and results saved to MySQL."
        )

    }