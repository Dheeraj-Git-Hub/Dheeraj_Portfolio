import { useState, useEffect } from "react";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";
import "./admin.css";

export default function AdminPanel() {
  const [token, setToken] = useState(() => localStorage.getItem("admin_token"));
``
  const handleLogin = (t) => setToken(t);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    setToken(null);
  };

  return token ? (
    <AdminDashboard token={token} onLogout={handleLogout} />
  ) : (
    <AdminLogin onLogin={handleLogin} />
  );
}