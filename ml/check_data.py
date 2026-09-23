import pandas as pd

file = r"C:\Users\Sravani\Downloads\AqSolDB-master\AqSolDB-master\data\combined_AqSolDB.csv"

df = pd.read_csv(file)

print("DATASET SIZE")
print(df.shape)

print("\nSOLUBILITY VALUES")
print(df["Solubility"].describe())

print("\nFIRST 10 ROWS")
print(df.head(10))

print("\nDATA TYPES")
print(df.dtypes)