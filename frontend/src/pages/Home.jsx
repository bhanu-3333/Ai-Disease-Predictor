import { motion } from "framer-motion";

export default function Home({ go }) {
  return (
    <motion.div className="center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1>🩺 MediScan AI</h1>
      <p>Your Personal AI Doctor</p>
      <button onClick={go}>Start Health Check</button>
    </motion.div>
  );
}
