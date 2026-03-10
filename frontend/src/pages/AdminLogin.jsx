import { useState } from "react";
import { motion } from "framer-motion";

export default function AdminLogin({ onLogin }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:5000/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("admin_token", data.token);
        onLogin(data.token);
      } else {
        setError(data.error || "Wrong password.");
      }
    } catch {
      setError("Cannot reach server. Is it running?");
    }
    setLoading(false);
  };

  return (
    <div className="admin-login-bg">
      <div className="admin-grid-overlay" />
      <motion.div
        className="admin-login-card"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="admin-login-icon">⚙️</div>
        <h1 className="admin-login-title">Admin Access</h1>
        <p className="admin-login-sub">Dheeraj's Portfolio Dashboard</p>

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="admin-input-wrap">
            <span className="admin-input-icon">🔑</span>
            <input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="admin-input"
              required
              autoFocus
            />
          </div>
          {error && (
            <motion.p
              className="admin-error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              ⚠️ {error}
            </motion.p>
          )}
          <button type="submit" className="admin-login-btn" disabled={loading}>
            {loading ? "Verifying..." : "Enter Dashboard →"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}