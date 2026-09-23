import pandas as pd
from rdkit import Chem
from rdkit.Chem import Descriptors
import os

# ==============================
# File Paths
# ==============================

input_file = "data/cleaned_AqSolDB.csv"

output_file = "data/feature_engineered_AqSolDB.csv"

# ==============================
# Load Dataset
# ==============================

print("Loading cleaned dataset...")

df = pd.read_csv(input_file)

print("Original shape:", df.shape)

# ==============================
# Molecular Descriptor Function
# ==============================

def calculate_descriptors(smiles):

    mol = Chem.MolFromSmiles(smiles)

    if mol is None:
        return [None] * 12

    return [
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
        Descriptors.NumValenceElectrons(mol)
    ]

# ==============================
# Descriptor Names
# ==============================

descriptor_columns = [

    "MolWt",
    "ExactMolWt",
    "LogP",
    "TPSA",
    "NumHDonors",
    "NumHAcceptors",
    "NumRotatableBonds",
    "RingCount",
    "HeavyAtomCount",
    "FractionCSP3",
    "AromaticRingCount",
    "ValenceElectrons"

]

# ==============================
# Generate Descriptors
# ==============================

print("\nGenerating molecular descriptors...")

df[descriptor_columns] = df["SMILES"].apply(
    calculate_descriptors
).apply(pd.Series)

# ==============================
# Check Invalid Molecules
# ==============================

invalid_count = df[descriptor_columns].isnull().any(axis=1).sum()

print("\nInvalid SMILES:", invalid_count)

# ==============================
# Remove Invalid Molecules
# ==============================

df = df.dropna(
    subset=descriptor_columns
).reset_index(drop=True)

print("Shape after removing invalid molecules:", df.shape)

# ==============================
# Save Feature Engineered Dataset
# ==============================

df.to_csv(
    output_file,
    index=False
)

print("\nFeature engineering completed!")

print("Saved to:")
print(output_file)

print("\nFinal columns:")

for column in df.columns:
    print("-", column)