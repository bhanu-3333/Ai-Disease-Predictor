import { useState } from "react";
import Home from "./pages/Home";
import Symptoms from "./pages/Symptoms";
import Chat from "./pages/Chat";
import "./App.css";

export default function App() {
  const [page, setPage] = useState("home");
  const [disease, setDisease] = useState("");

  return (
    <>
      {page === "home" && <Home go={() => setPage("symptoms")} />}
      {page === "symptoms" && (
        <Symptoms goChat={(d) => { setDisease(d); setPage("chat"); }} />
      )}
      {page === "chat" && <Chat disease={disease} />}
      <button className="chatBtn" onClick={() => setPage("chat")}>
  🤖 AI Doctor
</button>

    </>
  );
}
