import pandas as pd
import os

# ==============================
# File Paths
# ==============================

input_file = r"C:\Users\Sravani\Downloads\AqSolDB-master\AqSolDB-master\data\combined_AqSolDB.csv"

output_folder = "data"

os.makedirs(output_folder, exist_ok=True)

output_file = os.path.join(
    output_folder,
    "cleaned_AqSolDB.csv"
)

# ==============================
# Load Dataset
# ==============================

print("Loading AqSolDB dataset...")

df = pd.read_csv(input_file)

print("Original shape:", df.shape)

# ==============================
# Clean Column Names
# ==============================

df.columns = df.columns.str.strip()

# ==============================
# Check Missing Values
# ==============================

print("\nMissing values:")
print(df.isnull().sum())

# ==============================
# Remove Duplicate Rows
# ==============================

print("\nDuplicate rows:", df.duplicated().sum())

df = df.drop_duplicates()

# ==============================
# Remove Rows Without SMILES
# ==============================

df = df.dropna(
    subset=["SMILES", "Solubility"]
)

# ==============================
# Convert Solubility to Numeric
# ==============================

df["Solubility"] = pd.to_numeric(
    df["Solubility"],
    errors="coerce"
)

# Remove invalid solubility values
df = df.dropna(
    subset=["Solubility"]
)

# ==============================
# Reset Index
# ==============================

df = df.reset_index(drop=True)

# ==============================
# Display Final Dataset
# ==============================

print("\nFinal dataset shape:", df.shape)

print("\nFinal columns:")
print(df.columns.tolist())

print("\nSolubility statistics:")
print(df["Solubility"].describe())

# ==============================
# Save Clean Dataset
# ==============================

df.to_csv(
    output_file,
    index=False
)

print("\nCleaned dataset saved successfully:")
print(output_file)