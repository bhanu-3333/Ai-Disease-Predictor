import { useState } from "react";
import { useNavigate } from "react-router-dom";

const symptomsList = {
  fever: "Fever",
  cough: "Cough",
  headache: "Headache",
  fatigue: "Tiredness",
  nausea: "Nausea",
  vomiting: "Vomiting",
  stomach_pain: "Stomach Pain",
  diarrhea: "Loose Motion",
  sore_throat: "Sore Throat",
  runny_nose: "Runny Nose",
  body_pain: "Body Pain",
  dizziness: "Dizziness",
  chest_pain: "Chest Pain",
  breathing_problem: "Breathing Difficulty",
  loss_of_taste: "Loss of Taste",
  loss_of_smell: "Loss of Smell",
  chills: "Chills",
  rash: "Skin Rash",
  eye_pain: "Eye Pain",
  dehydration: "Dehydration",
  joint_pain: "Joint Pain",
  back_pain: "Back Pain",
  sweating: "Excess Sweating",
  weight_loss: "Weight Loss",
  night_sweats: "Night Sweats",
  blurred_vision: "Blurred Vision",
  frequent_urination: "Frequent Urination",
  thirst: "Extreme Thirst",
  abdominal_swelling: "Abdominal Swelling",
  bleeding: "Bleeding"
};

const diseaseInfo = {
  "Flu": {
    desc: "Flu is a viral infection causing fever, cough, body pain and weakness.",
    advice: "Take rest, drink warm fluids and take fever medicine."
  },
  "COVID-19": {
    desc: "COVID-19 is a contagious virus affecting breathing and senses.",
    advice: "Isolate, drink fluids and monitor oxygen level."
  },
  "Food Poisoning": {
    desc: "Food poisoning happens when contaminated food is eaten.",
    advice: "Drink ORS, avoid solid food and stay hydrated."
  },
  "Typhoid": {
    desc: "Typhoid is a bacterial infection causing prolonged fever.",
    advice: "Visit doctor for antibiotics and drink plenty of water."
  },
  "Migraine": {
    desc: "Migraine is a severe headache disorder with nausea.",
    advice: "Rest in dark room and take prescribed pain medicine."
  },
  "Dengue": {
    desc: "Dengue is a mosquito-borne viral fever causing body pain and rash.",
    advice: "Drink fluids and avoid painkillers like aspirin."
  },
  "Common Cold": {
    desc: "Common cold causes runny nose, cough and sore throat.",
    advice: "Drink warm fluids and rest well."
  },
  "Stomach Infection": {
    desc: "Stomach infection affects digestion and causes pain and diarrhea.",
    advice: "Drink ORS and eat light food."
  },
  "Malaria": {
    desc: "Malaria is a mosquito-borne disease causing fever and chills.",
    advice: "Visit hospital and take antimalarial medicines."
  },
  "Pneumonia": {
    desc: "Pneumonia is an infection in lungs causing breathing difficulty.",
    advice: "Seek medical care and take antibiotics if prescribed."
  },
  "Bronchitis": {
    desc: "Bronchitis causes chest congestion and cough.",
    advice: "Avoid smoke and drink warm fluids."
  },
  "Asthma": {
    desc: "Asthma is a condition that makes breathing difficult.",
    advice: "Use inhaler and avoid dust and smoke."
  },
  "Tuberculosis": {
    desc: "TB is a serious lung infection causing cough and weight loss.",
    advice: "Complete full TB treatment under doctor care."
  },
  "Diabetes": {
    desc: "Diabetes causes high blood sugar.",
    advice: "Avoid sugar and check blood glucose regularly."
  },
  "Hypertension": {
    desc: "High blood pressure increases heart risk.",
    advice: "Reduce salt and manage stress."
  },
  "Anemia": {
    desc: "Anemia means low red blood cells causing weakness and dizziness.",
    advice: "Eat iron rich foods like spinach and dates."
  },
  "Hepatitis": {
    desc: "Hepatitis is liver infection causing swelling and fatigue.",
    advice: "Avoid alcohol and take doctor treatment."
  },
  "Kidney Infection": {
    desc: "Kidney infection causes fever and back pain.",
    advice: "Drink water and see doctor for antibiotics."
  },
  "Urinary Tract Infection": {
    desc: "UTI causes burning and frequent urination.",
    advice: "Drink water and take prescribed antibiotics."
  },
  "Gastritis": {
    desc: "Gastritis is inflammation of stomach lining.",
    advice: "Avoid spicy food and take antacids."
  }
};

const doctorMap = {
  "Flu": "General Physician",
  "COVID-19": "Pulmonologist",
  "Food Poisoning": "General Physician",
  "Typhoid": "General Physician",
  "Migraine": "Neurologist",
  "Dengue": "General Physician",
  "Common Cold": "General Physician",
  "Stomach Infection": "Gastroenterologist",
  "Malaria": "General Physician",
  "Pneumonia": "Pulmonologist",
  "Bronchitis": "Pulmonologist",
  "Asthma": "Pulmonologist",
  "Tuberculosis": "Pulmonologist",
  "Diabetes": "Endocrinologist",
  "Hypertension": "Cardiologist",
  "Anemia": "General Physician",
  "Hepatitis": "Hepatologist",
  "Kidney Infection": "Nephrologist",
  "Urinary Tract Infection": "Urologist",
  "Gastritis": "Gastroenterologist"
};

export default function Symptoms({ goChat }) {

  const navigate = useNavigate();

  const [data, setData] = useState(
    Object.keys(symptomsList).reduce((a, k) => ({ ...a, [k]: 0 }), {})
  );

  const [result, setResult] = useState("");

  const downloadReport = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    const res = await fetch("https://ai-disease-predictor-4.onrender.com/report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: user.name,
        age: user.age,
        gender: user.gender,
        disease: result,
        symptoms: Object.keys(data).filter(k => data[k]).join(", "),
        doctor: doctorMap[result],
        advice: diseaseInfo[result]?.advice
      })
    });

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "MediScan_Report.pdf";
    a.click();
  };

  const toggle = (k) => {
    setData({ ...data, [k]: data[k] ? 0 : 1 });
  };

  const submit = async () => {
    const res = await fetch("https://ai-disease-predictor-4.onrender.com/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    const r = await res.json();
    setResult(r.disease);
  };

  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: "Inter", sans-serif;
          background: #fdfbf6;
          color: #1b1b1b;
        }

        .symptomsContainer {
          min-height: 100vh;
          background: #fdfbf6;
          padding: 60px 80px;
        }

        .card {
          background: #f5f1e9;
          border-radius: 20px;
          padding: 40px;
          max-width: 1200px;
          margin: 0 auto;
          box-shadow: 0 8px 24px rgba(0,0,0,0.04);
        }

        .card h2 {
          font-size: 36px;
          margin-bottom: 30px;
          color: #1b1b1b;
          text-align: center;
          font-weight: 600;
          position: relative;
        }

        .floatingImage {
          position: absolute;
          width: 200px;
          top: -125px;
          right: 40px;
          opacity: 0.85;
          pointer-events: none;
        }

        .symptomGrid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 16px;
          margin-bottom: 30px;
        }

        .symptom {
          background: #ffffff;
          padding: 18px 24px;
          border-radius: 14px;
          text-align: center;
          cursor: pointer;
          border: 2px solid transparent;
          transition: all 0.3s ease;
          font-weight: 500;
          color: #444;
        }

        .symptom:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 16px rgba(0,0,0,0.08);
        }

        .symptom.on {
          background: #1fa46b;
          color: white;
          border-color: #1fa46b;
          box-shadow: 0 8px 20px rgba(31,164,107,0.3);
        }

        button {
          padding: 14px 30px;
          border-radius: 50px;
          font-weight: 600;
          border: 2px solid #1fa46b;
          background: #1fa46b;
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 16px;
          display: block;
          margin: 20px auto;
        }

        button:hover {
          background: #0f7c5b;
          border-color: #0f7c5b;
          box-shadow: 0 8px 20px rgba(31,164,107,0.3);
          transform: translateY(-2px);
        }

        .resultSection {
          background: #e9f7f1;
          padding: 30px;
          border-radius: 18px;
          margin-top: 30px;
        }

        .resultSection p {
          margin-bottom: 16px;
          line-height: 1.7;
          color: #333;
          font-size: 16px;
        }

        .resultSection p:first-child {
          font-size: 28px;
          font-weight: 600;
          color: #1fa46b;
          margin-bottom: 20px;
        }

        .resultSection b {
          color: #1fa46b;
          font-weight: 600;
        }

        .buttonGroup {
          display: flex;
          gap: 18px;
          justify-content: center;
          margin-top: 24px;
        }

        .buttonGroup button {
          margin: 0;
        }

        .iconBtn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .btnIcon {
          width: 24px;
          height: 24px;
          object-fit: contain;
        }

        @media (max-width: 768px) {
          .symptomsContainer {
            padding: 30px 20px;
          }

          .card {
            padding: 24px;
          }

          .card h2 {
            font-size: 28px;
          }

          .symptomGrid {
            grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
            gap: 12px;
          }

          .buttonGroup {
            flex-direction: column;
          }

          .buttonGroup button {
            width: 100%;
          }
        }
      `}</style>

      <div className="symptomsContainer">
        <div className="card">
          <h2>
            Select Your Symptoms
            <img src="/images/medical.png" alt="Doctor" className="floatingImage" />
          </h2>

          <div className="symptomGrid">
            {Object.keys(symptomsList).map((k) => (
              <div
                key={k}
                className={`symptom ${data[k] ? "on" : ""}`}
                onClick={() => toggle(k)}
              >
                {symptomsList[k]}
              </div>
            ))}
          </div>

          <button onClick={submit}>Predict Disease</button>

          {result && (
            <div className="resultSection">
              <p>{result}</p>
              <p>{diseaseInfo[result]?.desc}</p>
              <p><b>Doctor Advice:</b> {diseaseInfo[result]?.advice}</p>
              <p><b>Recommended Doctor:</b> {doctorMap[result]}</p>

              <div className="buttonGroup">
                <button onClick={downloadReport} className="iconBtn">
                  <img src="/images/pdf.png" alt="PDF" className="btnIcon" />
                  Download Medical Report
                </button>
              <button
  onClick={() => {
    goChat(result);     // save disease in App state
    navigate("/chat"); // 🔥 go to chat page
  }}
  className="iconBtn"
>
  <img src="/images/ai.png" alt="AI Doctor" className="btnIcon" />
  Talk to AI Doctor
</button>


              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}