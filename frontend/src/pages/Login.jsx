import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    const res = await fetch("http://127.0.0.1:5000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

  if (data.token) {
  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify({
    name: data.name,
    age: data.age,
    gender: data.gender
  }));
  nav("/home");
    } else {
      alert(data.error || "Login failed");
    }
  };

  return (
    <div className="auth">
      <h1>MediScan Login</h1>

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

      <button onClick={login}>Login</button>


      <p>
        New user? <Link to="/signup">Create Account</Link>
      </p>
    </div>
  );
}
