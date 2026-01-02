import { useState } from "react";

export default function Chat({ disease = "unknown" }) {
  const [msg, setMsg] = useState("");
  const [chat, setChat] = useState([]);

  const send = async () => {
    if (!msg.trim()) return;
    
    const res = await fetch("https://ai-disease-predictor-4.onrender.com/chat", {
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

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      send();
    }
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

        .chatContainer {
          min-height: 100vh;
          background: #fdfbf6;
          padding: 60px 80px;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .card {
          background: #f5f1e9;
          border-radius: 20px;
          padding: 40px;
          max-width: 900px;
          width: 100%;
          box-shadow: 0 8px 24px rgba(0,0,0,0.04);
          display: flex;
          flex-direction: column;
          height: 700px;
        }

        .card h2 {
          font-size: 32px;
          margin-bottom: 24px;
          color: #1fa46b;
          text-align: center;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
        }

        .chatbox {
          flex: 1;
          background: #ffffff;
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 20px;
          overflow-y: auto;
          box-shadow: inset 0 2px 8px rgba(0,0,0,0.05);
        }

        .chatbox::-webkit-scrollbar {
          width: 8px;
        }

        .chatbox::-webkit-scrollbar-track {
          background: #f5f1e9;
          border-radius: 10px;
        }

        .chatbox::-webkit-scrollbar-thumb {
          background: #1fa46b;
          border-radius: 10px;
        }

        .chatMessage {
          margin-bottom: 20px;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .userMessage {
          background: #e9f7f1;
          padding: 12px 16px;
          border-radius: 12px;
          margin-bottom: 8px;
          border-left: 4px solid #1fa46b;
        }

        .doctorMessage {
          background: #f8f6ef;
          padding: 12px 16px;
          border-radius: 12px;
          margin-bottom: 8px;
          border-left: 4px solid #0f7c5b;
        }

        .messageLabel {
          font-weight: 600;
          color: #1fa46b;
          margin-bottom: 4px;
          font-size: 14px;
        }

        .doctorMessage .messageLabel {
          color: #0f7c5b;
        }

        .messageText {
          color: #333;
          line-height: 1.6;
          font-size: 15px;
        }

        .inputSection {
          display: flex;
          gap: 12px;
          align-items: center;
          position: relative;
        }

        .robotImage {
          width: 260px;
          height: 260px;
          object-fit: contain;
          flex-shrink: 0;
        }

        .inputWrapper {
          flex: 1;
          display: flex;
          gap: 12px;
        }

        input {
          flex: 1;
          padding: 14px 20px;
          border-radius: 50px;
          border: 2px solid #e0ddd5;
          background: #ffffff;
          font-size: 15px;
          font-family: "Inter", sans-serif;
          transition: all 0.3s ease;
          outline: none;
          position:relative;
          right:30px;
        }

        input:focus {
          border-color: #1fa46b;
          box-shadow: 0 0 0 3px rgba(31,164,107,0.1);
        }

        input::placeholder {
          color: #999;
        }

        button {
          padding: 14px 32px;
          border-radius: 50px;
          font-weight: 600;
          border: 2px solid #1fa46b;
          background: #1fa46b;
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 16px;
          white-space: nowrap;
        }

        button:hover {
          background: #0f7c5b;
          border-color: #0f7c5b;
          box-shadow: 0 8px 20px rgba(31,164,107,0.3);
          transform: translateY(-2px);
        }

        button:active {
          transform: translateY(0);
        }

        .emptyState {
          text-align: center;
          color: #999;
          padding: 40px 20px;
          font-style: italic;
        }

        @media (max-width: 768px) {
          .chatContainer {
            padding: 20px;
          }

          .card {
            padding: 24px;
            height: 600px;
          }

          .card h2 {
            font-size: 24px;
          }

          .robotImage {
            width: 50px;
            height: 50px;
          }

          .inputWrapper {
            flex-direction: column;
          }

          button {
            width: 100%;
          }
        }
      `}</style>

      <div className="chatContainer">
        <div className="card">
          <h2>
            <span>AI Doctor Chat</span>
          </h2>

          <div className="chatbox">
            {chat.length === 0 ? (
              <div className="emptyState">
                Start chatting with your AI doctor about "{disease}"
              </div>
            ) : (
              chat.map((c, i) => (
                <div key={i} className="chatMessage">
                  <div className="userMessage">
                    <div className="messageLabel">You</div>
                    <div className="messageText">{c.u}</div>
                  </div>
                  <div className="doctorMessage">
                    <div className="messageLabel">AI Doctor</div>
                    <div className="messageText">{c.a}</div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="inputSection">
            <img src="/images/ai-robot.png" alt="AI Robot" className="robotImage" />
            <div className="inputWrapper">
              <input 
                value={msg} 
                onChange={(e) => setMsg(e.target.value)} 
                onKeyPress={handleKeyPress}
                placeholder="Type your health question..." 
              />
              <button onClick={send}>Send</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}