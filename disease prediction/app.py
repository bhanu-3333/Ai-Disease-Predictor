from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import os
from dotenv import load_dotenv
from groq import Groq
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import create_access_token, JWTManager
from models import db, User

# Load .env
load_dotenv()

GROQ_KEY = os.getenv("GROQ_API_KEY")

if not GROQ_KEY:
    print("❌ GROQ_API_KEY not found in .env")

client = Groq(api_key=GROQ_KEY)

app = Flask(__name__)
CORS(app, supports_credentials=True)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///database.db"
app.config["JWT_SECRET_KEY"] = "2fe32ce2da63ea98d8300cfb4984cb15cea979f7ce375de7063a65e74c438f7f"

db.init_app(app)
jwt = JWTManager(app)

with app.app_context():
    db.create_all()

# Load ML model
model = joblib.load("disease_model.pkl")

# ---------------- Disease Prediction ----------------
@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json
        df = pd.DataFrame([data])
        disease = model.predict(df)[0]
        return jsonify({"disease": disease})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
@app.route("/signup", methods=["POST"])
def signup():
    data = request.json

    if not data or not data.get("email") or not data.get("password"):
        return jsonify({"error": "Missing email or password"}), 400

    if User.query.filter_by(email=data["email"]).first():
        return jsonify({"error": "User already exists"}), 400

    user = User(email=data["email"], password=data["password"])
    db.session.add(user)
    db.session.commit()

    return jsonify({"msg": "Account created"})

@app.route("/login", methods=["POST"])
def login():
    data = request.json
    user = User.query.filter_by(email=data["email"], password=data["password"]).first()

    if not user:
        return jsonify({"error": "Invalid credentials"}), 401

    token = create_access_token(identity=user.id)
    return jsonify({"token": token})

# ---------------- Real AI Doctor ----------------
@app.route("/chat", methods=["POST"])
def chat():
    try:
        data = request.json
        disease = data.get("disease", "unknown")
        user_message = data.get("message", "")

        system_prompt = f"""
You are a medical AI assistant.
The patient is diagnosed with {disease}.
Give safe, friendly medical advice.
Do NOT give harmful instructions.
"""

        completion = client.chat.completions.create(
           model="llama-3.1-8b-instant",

            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message}
            ],
            temperature=0.4
        )

        reply = completion.choices[0].message.content

        return jsonify({"reply": reply})

    except Exception as e:
        print("❌ Chat error:", e)
        return jsonify({"reply": "AI Doctor is not responding. Check backend logs."}), 500

if __name__ == "__main__":
    app.run(debug=True)
