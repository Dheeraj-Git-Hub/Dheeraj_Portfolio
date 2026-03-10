import { useState, useEffect } from "react";

const API = "http://localhost:5000";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    fetch(`${API}/api/projects`)
      .then(r => r.json())
      .then(setProjects)
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="projects">
      <div className="projects-inner">
        <p className="section-label">// things i've built</p>
        <h2 className="section-title">Projects</h2>
        <div className="accent-line" />

        {loading ? (
          <div style={{ color: "#64748b", textAlign: "center", padding: "40px" }}>Loading...</div>
        ) : (
          <div className="projects-grid">
            {projects.map((project) => (
              <div key={project._id} className="project-card">
                <div
                  className="project-card-top-bar"
                  style={{ background: `linear-gradient(90deg, ${project.color}44, ${project.color})` }}
                />
                <div className="project-card-header">
                  <span className="project-card-icon">{project.icon}</span>
                  <span
                    className="project-card-type"
                    style={{ color: project.color, background: `${project.color}15`, border: `1px solid ${project.color}30` }}
                  >
                    {project.type}
                  </span>
                </div>
                <h3 className="project-card-title">{project.title}</h3>
                <p className="project-card-desc">{project.desc}</p>
                <div className="project-tags">
                  {(project.tags || []).map((tag) => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}