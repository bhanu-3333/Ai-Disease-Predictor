import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signup = async () => {
    const res = await fetch("http://127.0.0.1:5000/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (res.ok) {
      alert("Account created. Please login.");
      nav("/");
    } else {
      alert(data.error);
    }
  };

  return (
    <div className="auth">
      <h1>Create Account</h1>

      <input
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />

      <button onClick={signup}>Signup</button>

      <p>
        Already have account? <Link to="/">Login</Link>
      </p>
    </div>
  );
}
