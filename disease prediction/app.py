from flask import Flask, request, jsonify, send_file
from flask_cors import cross_origin

from flask_cors import CORS
import joblib
import pandas as pd
import os
from dotenv import load_dotenv
from groq import Groq
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import create_access_token, JWTManager
from models import db, User
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.colors import black, HexColor
from flask_cors import CORS
from reportlab.platypus import Table, TableStyle
from reportlab.lib import colors

# Load .env
load_dotenv()

GROQ_KEY = os.getenv("GROQ_API_KEY")

if not GROQ_KEY:
    print("❌ GROQ_API_KEY not found in .env")

client = Groq(api_key=GROQ_KEY)

app = Flask(__name__)
CORS(app)

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
    try:
        data = request.json

        if not data.get("email") or not data.get("password"):
            return jsonify({"error": "Missing fields"}), 400

        if User.query.filter_by(email=data["email"]).first():
            return jsonify({"error": "User already exists"}), 400

        user = User(
            name=data["name"],
            age=data["age"],
            gender=data["gender"],
            email=data["email"],
            password=data["password"]
        )

        db.session.add(user)
        db.session.commit()

        return jsonify({"msg": "Account created"})

    except Exception as e:
        print("Signup error:", e)
        return jsonify({"error": str(e)}), 500


@app.route("/login", methods=["POST"])
def login():
    data = request.json

    user = User.query.filter_by(
        email=data["email"],
        password=data["password"]
    ).first()

    if not user:
        return jsonify({"error": "Invalid credentials"}), 401

    token = create_access_token(identity=user.id)

    return jsonify({
        "token": token,
        "name": user.name,
        "age": user.age,
        "gender": user.gender
    })

@app.route("/report", methods=["POST"])
def report():
    try:
        data = request.json or {}

        name = str(data.get("name", "Unknown"))
        age = str(data.get("age", "N/A"))
        gender = str(data.get("gender", "N/A"))
        disease = str(data.get("disease", "Unknown"))
        symptoms = str(data.get("symptoms", ""))
        doctor = str(data.get("doctor", "General Physician"))
        advice = str(data.get("advice", ""))

        doc = SimpleDocTemplate("medical_report.pdf")
        styles = getSampleStyleSheet()
        story = []

        story.append(Paragraph("MediScan AI Medical Report", styles["Title"]))
        story.append(Spacer(1, 12))

        table_data = [
            ["Patient Name", name],
            ["Age", age],
            ["Gender", gender],
            ["Disease", disease],
            ["Symptoms", symptoms],
            ["Recommended Doctor", doctor],
            ["Medical Advice", advice]
        ]

        table = Table(table_data, colWidths=[160, 300])
        table.setStyle(TableStyle([
            ("GRID", (0,0), (-1,-1), 1, colors.black),
            ("BACKGROUND", (0,0), (0,-1), colors.lightgrey),
            ("VALIGN", (0,0), (-1,-1), "TOP"),
            ("FONTNAME", (0,0), (0,-1), "Helvetica-Bold")
        ]))

        story.append(table)
        doc.build(story)

        return send_file("medical_report.pdf", as_attachment=True)

    except Exception as e:
        print("PDF ERROR:", e)
        return jsonify({"error": str(e)}), 500


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
