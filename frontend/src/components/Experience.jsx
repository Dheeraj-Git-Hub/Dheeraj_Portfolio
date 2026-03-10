import { useState, useEffect } from "react";

const API = "https://dheeraj-portfolio-ajti.onrender.com";

export default function Experience() {
  const [timeline, setTimeline] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    fetch(`${API}/api/experience`)
      .then(r => r.json())
      .then(setTimeline)
      .catch(() => setTimeline([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="experience">
      <div className="experience-inner">
        <p className="section-label">// my journey</p>
        <h2 className="section-title">Experience &amp; Education</h2>
        <div className="accent-line" />

        {loading ? (
          <div style={{ color: "#64748b", textAlign: "center", padding: "40px" }}>Loading...</div>
        ) : (
          timeline.map((item) => (
            <div key={item._id} className="timeline-item">
              <div className="timeline-icon">{item.icon}</div>
              <div className="timeline-card">
                <div className="timeline-card-header">
                  <h3 className="timeline-card-title">{item.title}</h3>
                  <span className="timeline-card-year">{item.year}</span>
                </div>
                <p className="timeline-card-org">{item.org}</p>
                <p className="timeline-card-desc">{item.desc}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}