import os
import time
import joblib
import pandas as pd

from sklearn.model_selection import (
    train_test_split,
    KFold,
    cross_val_score,
    GridSearchCV
)

from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor

from sklearn.metrics import (
    mean_absolute_error,
    mean_squared_error,
    r2_score
)

from xgboost import XGBRegressor


# ==========================================
# Create Model Folder
# ==========================================

os.makedirs("models", exist_ok=True)


# ==========================================
# Load Feature Engineered Dataset
# ==========================================

print("Loading feature engineered dataset...")

df = pd.read_csv(
    "data/feature_engineered_AqSolDB.csv"
)

print("Dataset shape:", df.shape)


# ==========================================
# Select Features
# ==========================================

features = [
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

X = df[features]

y = df["Solubility"]


print("\nFeature matrix:", X.shape)
print("Target:", y.shape)


# ==========================================
# Train-Test Split
# ==========================================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42
)

print("\nTraining samples:", len(X_train))
print("Testing samples:", len(X_test))


# ==========================================
# XGBoost Hyperparameter Tuning
# ==========================================

print("\nTuning XGBoost...")


param_grid = {
    "n_estimators": [100, 200],
    "max_depth": [3, 5, 6],
    "learning_rate": [0.05, 0.10]
}


grid_search = GridSearchCV(
    estimator=XGBRegressor(
        random_state=42
    ),
    param_grid=param_grid,
    scoring="r2",
    cv=5,
    n_jobs=-1
)


grid_search.fit(
    X_train,
    y_train
)


best_xgb = grid_search.best_estimator_


print("\nBest XGBoost parameters:")
print(grid_search.best_params_)


# ==========================================
# Create Models
# ==========================================

models = {

    "Linear Regression":
        LinearRegression(),

    "Random Forest":
        RandomForestRegressor(
            n_estimators=200,
            random_state=42
        ),

    "Tuned XGBoost":
        best_xgb
}


# ==========================================
# Train and Evaluate Models
# ==========================================

results = {}

best_model = None
best_score = float("-inf")


print("\n==============================")
print("MODEL PERFORMANCE")
print("==============================")


start_time = time.time()


for name, model in models.items():

    print("\nTraining:", name)

    model.fit(
        X_train,
        y_train
    )

    predictions = model.predict(
        X_test
    )

    mae = mean_absolute_error(
        y_test,
        predictions
    )

    rmse = mean_squared_error(
        y_test,
        predictions
    ) ** 0.5

    r2 = r2_score(
        y_test,
        predictions
    )


    results[name] = {
        "MAE": mae,
        "RMSE": rmse,
        "R2": r2
    }


    print("MAE :", round(mae, 4))
    print("RMSE:", round(rmse, 4))
    print("R2  :", round(r2, 4))


    if r2 > best_score:

        best_score = r2
        best_model = model


# ==========================================
# Five-Fold Cross Validation
# ==========================================

print("\n==============================")
print("5-FOLD CROSS VALIDATION")
print("==============================")


kfold = KFold(
    n_splits=5,
    shuffle=True,
    random_state=42
)


cv_results = []


for name, model in models.items():

    scores = cross_val_score(
        model,
        X,
        y,
        cv=kfold,
        scoring="r2",
        n_jobs=-1
    )

    print("\n", name)

    print(
        "Fold scores:",
        scores
    )

    print(
        "Average R2:",
        round(scores.mean(), 4)
    )

    print(
        "Std Dev:",
        round(scores.std(), 4)
    )


    cv_results.append({

        "Model": name,
        "Average_R2": scores.mean(),
        "Std_Dev": scores.std()

    })


# ==========================================
# Save Cross Validation Results
# ==========================================

cv_df = pd.DataFrame(
    cv_results
)

cv_df.to_csv(
    "models/cross_validation_results.csv",
    index=False
)


# ==========================================
# Save Model Comparison
# ==========================================

results_df = pd.DataFrame(
    results
).T


print("\n==============================")
print("MODEL COMPARISON")
print("==============================")

print(results_df)


results_df.to_csv(
    "models/model_comparison.csv"
)


# ==========================================
# Identify Best Model
# ==========================================

best_model_name = max(
    results,
    key=lambda x: results[x]["R2"]
)


print("\n==============================")
print("BEST MODEL")
print("==============================")

print("Model:", best_model_name)

print(
    "MAE:",
    round(
        results[best_model_name]["MAE"],
        4
    )
)

print(
    "RMSE:",
    round(
        results[best_model_name]["RMSE"],
        4
    )
)

print(
    "R2:",
    round(
        results[best_model_name]["R2"],
        4
    )
)


# ==========================================
# Save Best Model
# ==========================================

joblib.dump(
    best_model,
    "models/best_model.pkl"
)


print("\nBest model saved:")
print("models/best_model.pkl")


# ==========================================
# Training Time
# ==========================================

end_time = time.time()

print(
    "\nTraining time:",
    round(end_time - start_time, 2),
    "seconds"
)


print("\nML MODEL BUILDING COMPLETED!")