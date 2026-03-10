import { useState, useEffect } from "react";

const API = "http://localhost:5000";

export default function Certifications() {
  const [certs,   setCerts]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/certs`)
      .then(r => r.json())
      .then(setCerts)
      .catch(() => setCerts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="certifications">
      <div className="experience-inner">
        <p className="section-label">// credentials</p>
        <h2 className="section-title">Licenses &amp; Certifications</h2>
        <div className="accent-line" />

        {loading ? (
          <div style={{ color: "#64748b", textAlign: "center", padding: "40px" }}>Loading...</div>
        ) : (
          <div className="cert-grid">
            {certs.map((cert) => (
              <div key={cert._id} className="cert-card">
                <div className="cert-content">
                  <div className="cert-header">
                    <span className="cert-date">{cert.date}</span>
                    <h3 className="cert-title">{cert.title}</h3>
                    <p className="cert-issuer">{cert.issuer}</p>
                  </div>
                  <div className="cert-tags">
                    {(cert.tags || []).map((tag, i) => (
                      <span key={i} className="cert-tag">{tag}</span>
                    ))}
                  </div>
                  <a href={cert.link} target="_blank" rel="noopener noreferrer" className="cert-link">
                    View Credential
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                      <polyline points="15 3 21 3 21 9"/>
                      <line x1="10" y1="14" x2="21" y2="3"/>
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}