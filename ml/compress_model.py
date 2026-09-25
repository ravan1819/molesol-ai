import joblib

input_path = "ml/models/best_model.pkl"
output_path = "ml/models/best_model_compressed.pkl"

print("Loading model...")

model = joblib.load(input_path)

print("Saving compressed model...")

joblib.dump(
    model,
    output_path,
    compress=3
)

print("Done!")
print(output_path)