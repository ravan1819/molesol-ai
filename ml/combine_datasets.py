import pandas as pd
import os

# AqSolDB dataset folder
data_folder = r"C:\Users\Sravani\Downloads\AqSolDB-master\AqSolDB-master\data"

# Find dataset-A to dataset-I
files = []

for file in os.listdir(data_folder):
    if file.startswith("dataset-") and file.endswith(".csv"):
        files.append(os.path.join(data_folder, file))

print("Datasets selected:")

for file in files:
    print("-", os.path.basename(file))

if not files:
    print("NO DATASETS FOUND!")
    exit()

# Read all datasets
dataframes = []

for file in files:

    print("\nReading:", os.path.basename(file))

    df = pd.read_csv(file)

    print("Rows:", len(df))
    print("Columns:", len(df.columns))

    dataframes.append(df)

# Combine datasets
combined_df = pd.concat(
    dataframes,
    ignore_index=True
)

print("\n" + "=" * 60)
print("COMBINED DATASET")
print("=" * 60)

print("Total rows:", len(combined_df))
print("Total columns:", len(combined_df.columns))

# Clean column names
combined_df.columns = combined_df.columns.str.strip()

# Check duplicates
duplicates = combined_df.duplicated().sum()

print("\nDuplicate rows:", duplicates)

# Remove duplicates
combined_df = combined_df.drop_duplicates()

print("Rows after removing duplicates:", len(combined_df))

# Check missing values
print("\nMissing values:")
print(combined_df.isnull().sum())

# Display column names
print("\nColumn names:")

for column in combined_df.columns:
    print("-", column)

# Save combined dataset
output_file = os.path.join(
    data_folder,
    "combined_AqSolDB.csv"
)

combined_df.to_csv(
    output_file,
    index=False
)

print("\n" + "=" * 60)
print("SUCCESS")
print("=" * 60)

print("Combined dataset saved at:")
print(output_file)