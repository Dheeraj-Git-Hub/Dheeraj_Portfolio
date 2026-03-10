import { useState, useEffect, useRef } from "react";
import SkillOrbit from "./SkillOrbit";

const API = "http://localhost:5000";

function SkillBar({ name, level, delay }) {
  const [animated, setAnimated] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setAnimated(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="skill-bar-row">
      <div className="skill-bar-header">
        <span className="skill-bar-name">{name}</span>
        <span className="skill-bar-level">{level}%</span>
      </div>
      <div className="skill-bar-track">
        <div
          className="skill-bar-fill"
          style={{
            width: animated ? `${level}%` : "0%",
            background: `linear-gradient(90deg, #00f5c488, #00f5c4)`,
            boxShadow: `0 0 10px #00f5c466`,
            transitionDelay: `${delay}s`,
          }}
        />
      </div>
    </div>
  );
}

export default function Skills() {
  const [skillsData,    setSkillsData]    = useState({});
  const [activeTab,     setActiveTab]     = useState("");
  const [loading,       setLoading]       = useState(true);

  useEffect(() => {
    fetch(`${API}/api/skills`)
      .then(r => r.json())
      .then(data => {
        // Group by category
        const grouped = data.reduce((acc, skill) => {
          if (!acc[skill.category]) acc[skill.category] = [];
          acc[skill.category].push(skill);
          return acc;
        }, {});
        setSkillsData(grouped);
        setActiveTab(Object.keys(grouped)[0] || "");
      })
      .catch(() => setSkillsData({}))
      .finally(() => setLoading(false));
  }, []);

  const categories = Object.keys(skillsData);

  return (
    <section id="skills">
      <div className="skills-inner">
        <p className="section-label">// what i know</p>
        <h2 className="section-title">Skills &amp; Expertise</h2>
        <div className="accent-line" />

        {loading ? (
          <div style={{ color: "#64748b", textAlign: "center", padding: "40px" }}>Loading...</div>
        ) : (
          <>
            <div className="skill-tabs">
              {categories.map((tab) => (
                <button
                  key={tab}
                  className={`skill-tab ${activeTab === tab ? "active" : "inactive"}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="skills-grid">
              <div>
                {(skillsData[activeTab] || []).map((skill, i) => (
                  <SkillBar key={skill._id} name={skill.name} level={skill.level} delay={i * 0.1} />
                ))}
              </div>
              <div className="skill-orbit-col">
                <SkillOrbit />
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}