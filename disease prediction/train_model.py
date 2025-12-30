import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import joblib

print("Loading dataset...")
data = pd.read_csv("dataset.csv")


# Features (30 symptoms)
X = data.drop("disease", axis=1)

# Labels (diseases)
y = data["disease"]

print("Training model...")
model = RandomForestClassifier(
    n_estimators=200,
    random_state=42
)

model.fit(X, y)

# Save model
joblib.dump(model, "disease_model.pkl")

print("Model trained successfully")
print("Number of symptoms:", X.shape[1])
print("Number of diseases:", y.nunique())
