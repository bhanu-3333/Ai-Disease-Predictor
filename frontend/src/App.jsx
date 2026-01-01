import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Symptoms from "./pages/Symptoms";
import Chat from "./pages/Chat";

import "./App.css";

export default function App() {
  const [disease, setDisease] = useState("");

  return (
    <Routes>

      {/* AUTH */}
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* MAIN APP */}
      <Route path="/home" element={<Home />} />

      <Route
        path="/symptoms"
        element={<Symptoms goChat={(d) => setDisease(d)} />}
      />

      <Route
        path="/chat"
        element={<Chat disease={disease} />}
      />

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/" />} />

    </Routes>
  );
}
