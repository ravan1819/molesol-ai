MoleSol AI


Molecular Solubility Prediction and Virtual Screening Platform

Problem Statement

AI-Based Molecular Solubility Prediction and Virtual Screening System

Determining the aqueous solubility of a chemical compound is an important step in drug discovery and pharmaceutical research. Experimentally measuring solubility for a large number of molecules can be time-consuming, expensive, and resource-intensive. In addition, researchers need efficient methods to identify and prioritize molecules with desirable solubility characteristics from large molecular libraries.

Therefore, there is a need for an intelligent computational system that can predict molecular aqueous solubility from molecular structure and efficiently screen multiple molecules before experimental testing.

MoleSol AI aims to address this problem by using machine learning and molecular descriptors generated from SMILES representations to predict aqueous solubility, provide interpretable molecular insights, and perform virtual screening and ranking of multiple candidate molecules. The system will provide a user-friendly web interface through which users can enter individual molecules or upload molecular datasets and obtain AI-based predictions.

The proposed system will help demonstrate how machine learning can support early-stage molecular research by reducing computational screening time and prioritizing promising compounds for further experimental investigation.

Main objectives
Predict aqueous molecular solubility (LogS) from SMILES.
Generate relevant molecular features using RDKit.
Train and optimize a machine-learning model such as XGBoost.
Evaluate the model using appropriate regression metrics.
Provide individual molecule predictions through a web interface.
Perform virtual screening on multiple molecules.
Rank molecules based on predicted solubility.
Provide model-performance and molecular-feature insights.
Deploy the system as a web application.


1. Project Overview

MoleSol AI is a personal project developed to predict molecular solubility from SMILES representations using machine learning and cheminformatics techniques.

The application takes a molecular SMILES string as input, validates the molecule using RDKit, calculates molecular descriptors, and uses a trained Random Forest regression model to predict the LogS value.

The application also provides a virtual screening feature that allows multiple molecules to be uploaded through a CSV file and processed in batch.

The project includes a complete web application with a Next.js frontend, FastAPI backend, MySQL database, PubChem integration, and cloud deployment.

2. Project Objective

The main objective of the project is to develop a web-based application that can:

Accept molecular SMILES as input.
Validate molecular structures.
Generate molecular descriptors using RDKit.
Predict molecular solubility using a machine learning model.
Convert the predicted LogS value into a solubility category.
Automatically identify molecules using PubChem.
Perform batch prediction for multiple molecules.
Store prediction results in a MySQL database.
Provide an accessible web interface for users.

3. Technologies Used
Frontend
Next.js
TypeScript
Tailwind CSS
Backend
Python
FastAPI
Uvicorn
Machine Learning
Python
Pandas
NumPy
Scikit-learn
Random Forest Regressor
Joblib
Cheminformatics
RDKit
Database
MySQL
SQLAlchemy
PyMySQL
Aiven MySQL
External API
PubChem API
Deployment
GitHub
Vercel
Render
Aiven
4. Project Development Process
Step 1: Project Setup

I first created the project structure and separated the application into three main parts:

AI-Molecular-Solubility-Prediction
│
├── backend
├── frontend
└── ml

The ml folder contains the machine learning workflow and model.

The backend folder contains the FastAPI application and database connection.

The frontend folder contains the Next.js web application.

5. Dataset and Data Preparation

The molecular dataset was prepared for machine learning by identifying the molecular SMILES and the corresponding solubility value.

The target variable used for prediction is LogS.

The data preparation process included checking the dataset, preparing the molecular structures, and ensuring that the required values could be processed by RDKit.

The machine learning workflow was organized into separate Python scripts for preprocessing, feature engineering, and model building.

Files created for this process include:

01_preprocessing.py
02_feature_engineering.py
03_model_building.py
check_data.py
combine_datasets.py
6. Molecular Structure Processing

The input molecule is represented using SMILES.

For example:

CCO

represents ethanol.

RDKit was used to validate the SMILES and convert the molecular structure into numerical molecular descriptors.

The workflow is:

SMILES
   |
   v
RDKit
   |
   v
Molecular Structure
   |
   v
Molecular Descriptors
7. Feature Engineering

I generated molecular descriptors from the SMILES representation using RDKit.

The final model uses the following 12 descriptors:

Descriptor	Description
MolWt	Molecular weight
ExactMolWt	Exact molecular weight
LogP	Lipophilicity-related descriptor
TPSA	Topological polar surface area
NumHDonors	Number of hydrogen bond donors
NumHAcceptors	Number of hydrogen bond acceptors
NumRotatableBonds	Number of rotatable bonds
RingCount	Number of rings
HeavyAtomCount	Number of heavy atoms
FractionCSP3	Fraction of sp3-hybridized carbon atoms
AromaticRingCount	Number of aromatic rings
ValenceElectrons	Number of valence electrons

These descriptors convert the molecular structure into numerical features that can be provided to the machine learning model.

8. Machine Learning Model

After feature engineering, the molecular descriptors were used as input features for machine learning.

The final deployed model is a Random Forest Regressor.

The target variable is:

LogS

The trained model was saved using Joblib.

The model file is:

ml/models/best_model.pkl

The backend loads this model when the application starts.

The prediction process is:

SMILES
   |
   v
RDKit
   |
   v
12 Molecular Descriptors
   |
   v
Random Forest Regressor
   |
   v
Predicted LogS
9. Solubility Classification

After obtaining the predicted LogS value, the application assigns a solubility category.

The current classification used in the application is:

LogS >= 0
Highly Soluble

-2 <= LogS < 0
Soluble

-4 <= LogS < -2
Moderately Soluble

LogS < -4
Low Solubility

This allows users to understand the predicted value more easily.

10. Backend Development

I developed the backend using FastAPI.

The backend is responsible for:

Receiving SMILES input.
Validating molecular structures.
Generating molecular descriptors.
Loading the machine learning model.
Generating predictions.
Determining the solubility category.
Communicating with PubChem.
Saving prediction results to MySQL.
Processing batch predictions.

The main backend file is:

backend/main.py

The database connection is handled through:

backend/database.py

The database models are defined in:

backend/models.py
11. Single Molecule Prediction

I created a /predict API endpoint for single molecule prediction.

The frontend sends a request containing the SMILES.

Example:

{
    "smiles": "CCO"
}

The backend processes the request and returns information including:

Molecule name
SMILES
Predicted LogS
Solubility category
Prediction ID
Prediction type

The complete process is:

User Input
   |
   v
Next.js Frontend
   |
   v
FastAPI /predict
   |
   v
RDKit
   |
   v
Molecular Descriptors
   |
   v
Random Forest Model
   |
   v
Prediction
   |
   v
MySQL
   |
   v
Frontend Result
12. PubChem Integration

I integrated the PubChem API to automatically obtain molecule names from SMILES.

This allows the user to enter a SMILES representation without manually providing the molecule name.

For example:

CCO

can be identified as:

Ethanol

The backend sends the molecular information to PubChem and retrieves the available molecule name.

13. MySQL Database Integration

I added MySQL to store prediction history.

The database contains a table called:

prediction_history

The table stores information such as:

id
molecule_name
smiles
predicted_solubility
category
prediction_type
created_at

The database is hosted using Aiven MySQL.

SQLAlchemy and PyMySQL are used to connect the FastAPI backend with MySQL.

14. Virtual Screening

I added a virtual screening feature to process multiple molecules at once.

The user can upload a CSV file containing molecular SMILES.

Example:

smiles
CCO
CO
CC(=O)O
c1ccccc1

The system processes the molecules in batch.

The workflow is:

CSV File
   |
   v
Extract SMILES
   |
   v
Validate Molecules
   |
   v
Generate Descriptors
   |
   v
Batch Prediction
   |
   v
PubChem Name Lookup
   |
   v
Display Results
   |
   v
Save to MySQL

The backend endpoint used for this process is:

/predict-batch

Batch processing was implemented so that multiple molecules can be processed through a single API request rather than sending separate requests for every molecule.

15. Frontend Development

The frontend was developed using Next.js, TypeScript, and Tailwind CSS.

The application contains the following main pages:

Home
Predict
Virtual Screening
Model Insights
About

The Predict page allows users to enter a SMILES string and obtain a prediction.

The Virtual Screening page allows users to upload a CSV file and process multiple molecules.

16. Frontend and Backend Integration

Initially, the application was tested locally.

The frontend communicated with the local FastAPI server:

http://127.0.0.1:8000

After deployment, the frontend needed to communicate with the production backend.

I therefore configured the frontend using the environment variable:

NEXT_PUBLIC_API_URL

The production backend URL is:

https://molesol-ai.onrender.com

The production architecture became:

Next.js Frontend
        |
        v
Vercel
        |
        v
FastAPI Backend
        |
        v
Render
17. CORS Configuration

When the frontend and backend were deployed separately, cross-origin requests needed to be configured.

I configured CORS in FastAPI so that the deployed Next.js application could communicate with the backend.

This allowed the production frontend to successfully call the FastAPI APIs.

18. GitHub Integration

I used Git and GitHub for source-code management and deployment.

The project repository is:

https://github.com/ravan1819/molesol-ai

The basic Git workflow used during development was:

Project Changes
       |
       v
git add .
       |
       v
git commit
       |
       v
git push
       |
       v
GitHub

GitHub was also connected to Vercel and Render for deployment.

19. Large Machine Learning Model Issue

During the GitHub upload, the original machine learning model was approximately 154 MB.

GitHub's regular repository file limit prevented the original model from being pushed.

To solve this problem, I compressed the model using Joblib compression.

The original model size was approximately:

154 MB

After compression:

Approximately 44 MB

The compressed model was tested locally to make sure it could still be loaded successfully.

The final model remained:

best_model.pkl
20. Deployment

The project was deployed using separate services for the frontend, backend, and database.

Frontend

The Next.js frontend was deployed using Vercel.

GitHub
   |
   v
Vercel
   |
   v
Next.js Application
Backend

The FastAPI backend was deployed using Render.

GitHub
   |
   v
Render
   |
   v
FastAPI Application
Database

The MySQL database was hosted using Aiven.

FastAPI
   |
   v
Aiven MySQL
21. Production Environment

The final application architecture is:

User
 |
 v
Next.js
 |
 v
Vercel
 |
 v
FastAPI
 |
 v
Render
 |
 +-------------------+
 |                   |
 v                   v
RDKit              MySQL
 |                 Aiven
 v
Random Forest
 |
 v
LogS Prediction
 |
 v
PubChem
22. Testing

I tested the application at different stages of development.

Backend Testing

The FastAPI Swagger interface was used to test the API endpoints.

/predict
/predict-batch
/health
Database Testing

Prediction results were checked to verify that they were successfully stored in MySQL.

Frontend Testing

The following features were tested:

Single molecule prediction
CSV upload
Virtual screening
Result display
API communication
Production Testing

The deployed application was tested independently of the local VS Code environment.

The final application successfully performs:

Single molecule prediction
Batch virtual screening
Molecule name lookup
Database storage
23. Problems Faced During Development

Several practical problems were encountered during development.

Problem 1: Large Model File

The machine learning model was too large for the normal GitHub file limit.

Solution:

The model was compressed using Joblib and the compressed model was tested before deployment.

Problem 2: Localhost API in Production

The deployed frontend initially attempted to communicate with the local backend.

Solution:

The frontend was changed to use the production backend URL through NEXT_PUBLIC_API_URL.

Problem 3: CORS

The frontend and backend were deployed on different domains.

Solution:

CORS was configured in FastAPI.

Problem 4: Virtual Screening API

The initial virtual screening implementation was using the single prediction endpoint and the local backend URL.

Solution:

The implementation was changed to use the production backend and /predict-batch.

Problem 5: Database Availability

The backend could not connect when the Aiven MySQL service was unavailable.

Solution:

The database service was started and the connection was tested again.

24. Project Structure
AI-Molecular-Solubility-Prediction
│
├── backend
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   ├── test_database.py
│   └── requirements.txt
│
├── ml
│   ├── data
│   ├── models
│   │   └── best_model.pkl
│   ├── 01_preprocessing.py
│   ├── 02_feature_engineering.py
│   ├── 03_model_building.py
│   ├── check_data.py
│   ├── combine_datasets.py
│   └── compress_model.py
│
├── frontend
│   ├── app
│   │   ├── about
│   │   ├── model-insights
│   │   ├── predict
│   │   ├── virtual-screening
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components
│   └── public
│
├── .gitignore
└── README.md
25. Learning Outcomes

Through this project, I gained practical experience in:

Data Science
Data preprocessing
Feature engineering
Exploratory analysis
Molecular descriptor generation
Machine learning
Machine Learning
Regression
Random Forest
Model serialization
Model deployment
Python
Pandas
NumPy
Scikit-learn
RDKit
Joblib
Backend Development
FastAPI
REST APIs
Request validation
CORS
API integration
Frontend Development
Next.js
TypeScript
Tailwind CSS
API integration
CSV file processing
Database
MySQL
SQLAlchemy
PyMySQL
Database integration
Deployment
Git
GitHub
Vercel
Render
Aiven
Environment variables
Production debugging
26. Limitations

MoleSol AI provides computational predictions of molecular solubility.

The predicted values are machine learning estimates and should not be considered a replacement for experimental laboratory measurements.

The application is intended for computational analysis, machine learning experimentation, and demonstration of an end-to-end cheminformatics application.

27. Future Improvements

Future versions of the application can include:

Prediction history dashboard.
Advanced filtering and sorting for virtual screening.
Molecular structure visualization.
Additional molecular properties.
Comparison of multiple machine learning models.
Interactive prediction charts.
User authentication.
Expanded database analytics.
Additional screening criteria.
Improved model evaluation and validation.
28. Project Developer

Ramadugu Sravani

Project Type: Personal Project

Live Application:
https://molesol-aii.vercel.app/

GitHub Repository:
https://github.com/ravan1819/molesol-ai

29. Disclaimer

MoleSol AI is a personal machine learning and cheminformatics project.

The predictions generated by the system are computational estimates and require experimental validation before being used for scientific, pharmaceutical, or other real-world decision-making.
