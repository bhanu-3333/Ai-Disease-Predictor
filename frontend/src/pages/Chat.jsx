import { useState } from "react";

export default function Chat({ disease = "unknown" }) {
  const [msg, setMsg] = useState("");
  const [chat, setChat] = useState([]);

  const send = async () => {
    const res = await fetch("http://127.0.0.1:5000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
  disease: disease,
  message: msg
})

    });
    const r = await res.json();
    setChat([...chat, { u: msg, a: r.reply }]);
    setMsg("");
  };

  
  return (
    <div className="card">
      <h2>🤖 AI Doctor</h2>
      <div className="chatbox">
        {chat.map((c, i) => (
          <div key={i}>
            <b>You:</b> {c.u}<br />
            <b>Doctor:</b> {c.a}<br /><br />
          </div>
        ))}
      </div>
      <input value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="Type your health question..." />
      <button onClick={send}>Send</button>
    </div>
  );
}
