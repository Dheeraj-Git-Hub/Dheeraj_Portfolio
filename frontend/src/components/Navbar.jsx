import { useRef } from "react";

const NAV_LINKS = ["About", "Skills", "Projects", "Experience", "Certifications", "Contact"];

export default function Navbar({ activeSection, scrollTo }) {

  const scrollRef = useRef(null);
  let isDown = false;
  let startX;
  let scrollLeft;

  // Mouse drag to scroll
  const onMouseDown = (e) => {
    isDown = true;
    startX = e.pageX - scrollRef.current.offsetLeft;
    scrollLeft = scrollRef.current.scrollLeft;
  };
  const onMouseLeave = () => { isDown = false; };
  const onMouseUp = () => { isDown = false; };
  const onMouseMove = (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="nav-logo">DK<span>.</span></div>

      {/* Desktop nav */}
      <div className="desktop-nav">
        {NAV_LINKS.map((link) => (
          <span
            key={link}
            className={`nav-link ${activeSection === link ? "active" : ""}`}
            onClick={() => scrollTo(link)}
          >
            {link}
          </span>
        ))}
      </div>

      {/* Mobile swipe nav */}
      <div
        className="mobile-swipe-nav"
        ref={scrollRef}
        onMouseDown={onMouseDown}
        onMouseLeave={onMouseLeave}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
      >
        {NAV_LINKS.map((link) => (
          <span
            key={link}
            className={`nav-link ${activeSection === link ? "active" : ""}`}
            onClick={() => scrollTo(link)}
          >
            {link}
          </span>
        ))}
      </div>

      {/* Hire Me — desktop only */}
      <a href="mailto:dheerajies1998@gmail.com" className="glow-btn hire-btn desktop-hire">
        Hire Me
      </a>
    </nav>
  );
}