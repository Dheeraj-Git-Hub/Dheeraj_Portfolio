import { useState } from "react";
import { FaGithub, FaLinkedin, FaKaggle } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

const SOCIAL_LINKS = [
  { label: "GitHub",   icon: <FaGithub />,  href: "https://github.com/Dheeraj-Git-Hub",        color: "#ffffff" },
  { label: "LinkedIn", icon: <FaLinkedin />, href: "https://www.linkedin.com/in/dhee28raj/",     color: "#0A66C2" },
  { label: "Kaggle",   icon: <FaKaggle />,   href: "https://www.kaggle.com/dhee28raj",           color: "#20BEFF" },
  { label: "Email",    icon: <MdEmail />,    href: "mailto:dheerajies1998@email.com",            color: "#EA4335" },
];

// ✅ Change this to your deployed backend URL when you go live
// e.g. "https://your-app.onrender.com"
const API_URL = "http://localhost:5000";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to send message.");
      }

      setSubmitted(true);
      setFormData({ name: "", email: "", message: "" });
      setTimeout(() => setSubmitted(false), 4000);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact">
      <div className="contact-inner">
        <p className="section-label">// get in touch</p>
        <h2 className="section-title">Contact Me</h2>
        <div className="accent-line" />

        <p className="contact-intro">
          Whether you have an internship opportunity, a project collaboration, or just want to chat about
          data — I'm always open to connect. Let's build something great together.
        </p>

        {submitted ? (
          <div className="contact-success">
            <div className="contact-success-icon">✅</div>
            <p className="contact-success-title">Message sent successfully!</p>
            <p className="contact-success-sub">I'll get back to you within 24 hours.</p>
          </div>
        ) : (
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="contact-form-row">
              <div className="form-group">
                <label>Your Name</label>
                <input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.com"
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label>Message</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Hi Dheeraj, I'd love to connect about..."
                required
              />
            </div>

            {/* Error message */}
            {error && (
              <p style={{ color: "#f87171", fontSize: "0.875rem", margin: "0" }}>
                ⚠️ {error}
              </p>
            )}

            <button
              type="submit"
              className="glow-btn"
              style={{ alignSelf: "flex-start", opacity: loading ? 0.7 : 1 }}
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Message →"}
            </button>
          </form>
        )}

        {/* Social links */}
        <div className="social-links">
          {SOCIAL_LINKS.map(({ label, icon, href, color }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              className="social-link"
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = color;
                e.currentTarget.style.color = color;
                e.currentTarget.style.boxShadow = `0 0 15px ${color}55`;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                e.currentTarget.style.color = "#94a3b8";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <span className="social-link-icon">{icon}</span>
              {label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}