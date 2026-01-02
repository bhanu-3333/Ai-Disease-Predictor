from flask import Flask, request, jsonify, send_file
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
from reportlab.lib.colors import HexColor
from datetime import datetime
import tempfile



# Load .env
load_dotenv()

GROQ_KEY = os.getenv("GROQ_API_KEY")

if not GROQ_KEY:
    print("❌ GROQ_API_KEY not found in .env")

client = Groq(api_key=GROQ_KEY)

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})


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
        data = request.json

        name = data.get("name", "Unknown")
        age = data.get("age", "N/A")
        gender = data.get("gender", "N/A")
        disease = data.get("disease", "N/A")
        symptoms = data.get("symptoms", "N/A")
        advice = data.get("advice", "N/A")
        doctor = data.get("doctor", "General Physician")

        date = datetime.now().strftime("%d %b %Y")

        file_path = tempfile.NamedTemporaryFile(delete=False, suffix=".pdf").name

        styles = getSampleStyleSheet()
        doc = SimpleDocTemplate(file_path, pagesize=A4)
        elements = []

        # ---------------- TITLE ----------------
        title_style = styles["Title"]
        title_style.alignment = 1
        elements.append(Paragraph("CURA AI Medical Report", title_style))
        elements.append(Spacer(1, 20))

        # ---------------- USER INFO ----------------
        user_table = Table([
            [f"Patient Name: {name}", f"Gender: {gender}"],
            [f"Age: {age}", f"Date: {date}"]
        ], colWidths=[260, 260])

        user_table.setStyle(TableStyle([
            ('ALIGN', (0,0), (0,-1), 'LEFT'),
            ('ALIGN', (1,0), (1,-1), 'RIGHT'),
            ('BOTTOMPADDING', (0,0), (-1,-1), 12),
            ('FONT', (0,0), (-1,-1), 'Helvetica')
        ]))

        elements.append(user_table)
        elements.append(Spacer(1, 25))

        # ---------------- MEDICAL TABLE ----------------
        table_data = [
            ["Field", "Details"],
            ["Disease", disease],
            ["Symptoms", symptoms],
            ["Recommended Doctor", doctor],
            ["Medical Advice", advice],
        ]

        table = Table(table_data, colWidths=[180, 350])
        table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), HexColor("#dff5ec")),
            ('GRID', (0,0), (-1,-1), 1, HexColor("#1FA46B")),
            ('FONT', (0,0), (-1,0), 'Helvetica-Bold'),
            ('ALIGN', (0,0), (-1,0), 'CENTER'),
            ('BACKGROUND', (0,1), (0,-1), HexColor("#eefaf5")),
            ('LEFTPADDING', (0,0), (-1,-1), 10),
            ('RIGHTPADDING', (0,0), (-1,-1), 10),
            ('TOPPADDING', (0,0), (-1,-1), 8),
            ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ]))

        elements.append(table)
        elements.append(Spacer(1, 25))

        # ---------------- DISCLAIMER ----------------
        elements.append(Paragraph(
            "<b>Disclaimer:</b> This report is generated by CURA AI and is not a substitute for professional medical diagnosis. Please consult a qualified doctor before taking any medication.",
            styles["Italic"]
        ))

        doc.build(elements)

        return send_file(file_path, as_attachment=True, download_name="CURA_AI_Report.pdf")

    except Exception as e:
        print("❌ PDF ERROR:", e)
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
