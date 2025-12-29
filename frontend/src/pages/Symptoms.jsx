import { useState } from "react";

export default function Symptoms({ goChat }) {
  const [data, setData] = useState({
    fever:0, cough:0, headache:0, fatigue:0, nausea:0
  });

  const toggle = k => setData({...data, [k]: data[k]?0:1});

  const submit = async () => {
    const res = await fetch("http://127.0.0.1:5000/predict", {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify(data)
    });
    const r = await res.json();
    goChat(r.disease);
  };

  return (
    <div className="card">
      <h2>Select Symptoms</h2>
      {Object.keys(data).map(s=>(
        <div key={s} className={`symptom ${data[s]?"on":""}`} onClick={()=>toggle(s)}>{s}</div>
      ))}
      <button onClick={submit}>Continue</button>
    </div>
  );
}
