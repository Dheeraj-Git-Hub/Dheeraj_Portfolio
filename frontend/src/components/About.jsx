import indiaFlag from "../assets/india.svg";
import photo from "../assets/dheeraj.png";

export default function About({ scrollTo }) {
  return (
    <section id="about">
      <div className="hero-inner">

        {/* Left column */}
        <div className="fade-in">
          <div className="hero-badge">
            <div className="hero-badge-dot" />
            <span className="hero-badge-text">Open to Opportunities</span>
          </div>

          <h1 className="hero-title">
            Hi, I'm{" "}
            <span className="hero-title-name">Dheeraj Kumar</span>
          </h1>

          <div className="hero-roles">
            <span className="hero-role-badge role-ds">Data Scientist</span>
            <span className="hero-role-badge role-de">Data Engineer</span>
            <span className="hero-role-badge role-da">Data Analyst</span>
          </div>

          <p className="hero-desc">
            B.Tech 3rd Year Data Science student with a passion for turning raw
            data into meaningful insights. Currently exploring the intersection
            of <strong>Machine Learning</strong>, <strong>Data Engineering</strong>,
            and <strong>Analytics</strong> — finding my path at the crossroads.
          </p>

          <div className="hero-cta-group">
            <button className="glow-btn" onClick={() => scrollTo("Projects")}>
              View Projects
            </button>

            <button className="outline-btn" onClick={() => scrollTo("Contact")}>
              Contact Me
            </button>
          </div>
        </div>

        {/* Right column - Photo */}
        <div className="hero-photo-col">
          <div className="hero-photo-wrapper">
            <div className="hero-photo-ring" />

            <div className="hero-photo-frame">
              <img
                src={photo}
                alt="Dheeraj Kumar"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.parentElement.innerHTML =
                    `<div class="hero-photo-initials">DK</div>`;
                }}
              />
            </div>

            {/* Floating badges */}
            {[
              { label: "Python Expert", color: "#00f5c4", style: { top: "10%", right: "-20%" } },
              { label: "ML Engineer", color: "#0ea5e9", style: { bottom: "20%", left: "-25%" } },
              { label: "3rd Year B.Tech", color: "#a78bfa", style: { bottom: "5%", right: "-10%" } },
            ].map((badge) => (
              <div
                key={badge.label}
                className="hero-float-badge"
                style={{
                  ...badge.style,
                  color: badge.color,
                  border: `1px solid ${badge.color}44`,
                  boxShadow: `0 4px 20px ${badge.color}22`,
                }}
              >
                {badge.label}
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}