import { useState } from "react";

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



export default function Symptoms({ goChat }) {
  const [data, setData] = useState(
    Object.keys(symptomsList).reduce((a, k) => ({ ...a, [k]: 0 }), {})
  );

  const [result, setResult] = useState("");

  const toggle = (k) => {
    setData({ ...data, [k]: data[k] ? 0 : 1 });
  };

  const submit = async () => {
    const res = await fetch("http://127.0.0.1:5000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    const r = await res.json();
    setResult(r.disease);
  };

  return (
    <div className="card">
      <h2>Select Your Symptoms</h2>

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
        <div className="resultBox">
          <h3>🩺 Possible Disease</h3>
          <p><b>{result}</b></p>
<p>{diseaseInfo[result]?.desc}</p>
<p><b>Doctor Advice:</b> {diseaseInfo[result]?.advice}</p>

          <button onClick={() => goChat(result)}>
            🤖 Talk to AI Doctor
          </button>
        </div>
      )}
    </div>
  );
}
