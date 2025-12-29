import pandas as pd
from sklearn.naive_bayes import BernoulliNB
import joblib

# Load dataset
data = pd.read_csv("dataset.csv")

X = data.drop("disease", axis=1)
y = data["disease"]

# Train Naive Bayes model (best for symptoms)
model = BernoulliNB()
model.fit(X, y)

# Save model
joblib.dump(model, "disease_model.pkl")

print("Model trained successfully with Naive Bayes!")
