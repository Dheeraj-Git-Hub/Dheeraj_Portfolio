import { useState, useEffect } from "react";
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar        from './Components/Navbar';
import About         from './Components/About';
import Skills        from './Components/Skills';
import Projects      from './Components/Projects';
import Experience    from './Components/Experience';
import Certifications from './Components/Certifications';
import Contact       from './Components/Contact';
import Footer        from './Components/Footer';
import AdminPanel    from "./pages/AdminPanel";

const NAV_LINKS = ["About", "Skills", "Projects", "Experience", "Contact"];

/* ── Main portfolio page ── */
function Portfolio() {
  const [activeSection, setActiveSection] = useState("About");
  const [mousePos, setMousePos]           = useState({ x: 0, y: 0 });

  /* mouse-follow ambient light */
  useEffect(() => {
    const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  /* active-section tracker */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(
              entry.target.id.charAt(0).toUpperCase() + entry.target.id.slice(1)
            );
          }
        });
      },
      { threshold: 0.4 }
    );
    NAV_LINKS.forEach((link) => {
      const el = document.getElementById(link.toLowerCase());
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  /* smooth scroll helper */
  const scrollTo = (id) => {
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="app-root">
      {/* Ambient cursor light */}
      <div
        className="ambient-cursor"
        style={{ transform: `translate(${mousePos.x - 250}px, ${mousePos.y - 250}px)` }}
      />

      {/* Grid background */}
      <div className="grid-bg" />

      <Navbar        activeSection={activeSection} scrollTo={scrollTo} />
      <About         scrollTo={scrollTo} />
      <Skills        />
      <Projects      />
      <Experience    />
      <Certifications />
      <Contact       />
      <Footer        />
    </div>
  );
}

/* ── Root with Router ── */
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"      element={<Portfolio />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </BrowserRouter>
  );
}