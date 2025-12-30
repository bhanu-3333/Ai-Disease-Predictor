import { Link, Outlet } from "react-router-dom";

export default function Dashboard() {
  return (
    <div className="layout">
      <aside className="sidebar">
        <h2>MediScan</h2>
        <Link to="/dashboard">Home</Link>
        <Link to="/dashboard/symptoms">Find Disease</Link>
        <Link to="/dashboard/chat">AI Doctor</Link>
        <Link to="/">Logout</Link>
      </aside>


      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
