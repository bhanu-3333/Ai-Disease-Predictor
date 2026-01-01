import { Link } from "react-router-dom";
import "./Home.css";

export default function Home() {
  return (
    <div className="home">

      {/* NAVBAR */}
      <nav className="nav">
        <div className="logo">💚 CURA AI</div>
        <div className="navLinks">
          <Link to="/">Home</Link>
          <Link to="/symptoms">Check Symptoms</Link>
          <Link to="/chat">AI Doctor</Link>
          <Link to="/login" className="btn">Login</Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="heroText">
          <h1>We bring the <span>clinic</span> to your <i>home</i></h1>
          <p>
            CURA AI helps you detect diseases early and consult an AI doctor instantly.
          </p>

          <div className="heroBtns">
            <Link to="/symptoms" className="primaryBtn">Check Symptoms</Link>
            <Link to="/chat" className="secondaryBtn">Talk to AI Doctor</Link>
          </div>
        </div>

        <div className="heroImg">
          <img src="/icons/doctor.png" alt="doctor"/>
        </div>
      </section>

      {/* FEATURE CARDS */}
      <section className="features">
        <div className="featureCard">
          <img src="/icons/protection.png"/>
          <h3>AI Diagnosis</h3>
          <p>Machine learning based disease prediction.</p>
        </div>

        <div className="featureCard">
          <img src="/icons/stethoscope.png"/>
          <h3>AI Doctor</h3>
          <p>Chat with an intelligent medical assistant.</p>
        </div>

        <div className="featureCard">
          <img src="/icons/report.png"/>
          <h3>Medical Reports</h3>
          <p>Download professional health reports.</p>
        </div>

        <div className="featureCard">
          <img src="/icons/security.png"/>
          <h3>Secure & Private</h3>
          <p>Your health data is protected.</p>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how">
        <h2>How CURA AI Works</h2>
        <div className="steps">
          <div>1️⃣ Select your symptoms</div>
          <div>2️⃣ Get AI disease prediction</div>
          <div>3️⃣ Chat with AI doctor</div>
          <div>4️⃣ Download medical report</div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <h2>Healthcare made simple.</h2>
        <Link to="/signup" className="primaryBtn">Get Started</Link>
      </section>

      {/* FOOTER */}
      <footer>
        <p>© 2026 CURA AI — AI Powered Healthcare</p>
      </footer>

    </div>
  );
}
