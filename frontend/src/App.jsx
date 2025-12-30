import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Symptoms from "./pages/Symptoms";
import Chat from "./pages/Chat";

import "./App.css";

export default function App() {
  const [disease, setDisease] = useState("");

  return (
    <Routes>

      {/* Auth */}
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Dashboard Layout */}
      <Route path="/dashboard" element={<Dashboard />}>
        <Route
          index
          element={<Home go={() => window.location.href="/dashboard/symptoms"} />}
        />

        <Route
          path="symptoms"
          element={
            <Symptoms goChat={(d) => {
              setDisease(d);
              window.location.href = "/dashboard/chat";
            }} />
          }
        />

        <Route path="chat" element={<Chat disease={disease} />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />

    </Routes>
  );
}
