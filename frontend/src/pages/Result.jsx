export default function Result({ disease, goBack }) {
  const doctor = {
    "Food Poisoning": "You have food poisoning. Drink ORS, eat rice, curd, and avoid spicy food. If vomiting continues, visit a doctor.",
    Flu: "You may have Flu. Take rest, drink warm fluids, and avoid cold drinks.",
    Migraine: "You may have Migraine. Avoid bright light, rest well, and take pain relief.",
    Typhoid: "This looks serious. You should consult a doctor immediately.",
    "Stomach Infection": "Drink water, eat light food, and avoid oily food."
  };

  return (
    <div className="card">
      <h2>AI Diagnosis</h2>
      <p className="result">🩺 {disease}</p>
      <p className="ai">🤖 AI Doctor: {doctor[disease]}</p>
      <button onClick={goBack}>Check Again</button>
    </div>
  );
}
