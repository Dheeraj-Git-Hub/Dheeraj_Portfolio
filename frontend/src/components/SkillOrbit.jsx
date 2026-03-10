import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  SiMongodb, SiExpress, SiReact, SiNodedotjs,
  SiGit, SiMysql, SiPandas, SiNumpy, SiScikitlearn,
  SiPython, SiDatabricks,
} from "react-icons/si";
import { FaMicrosoft } from "react-icons/fa";

/* ── Ring 1 — MERN ── */
const ring1 = [
  { name: "MongoDB", color: "#47A248", icon: <SiMongodb /> },
  { name: "Express", color: "#ffffff", icon: <SiExpress /> },
  { name: "React",   color: "#61DAFB", icon: <SiReact /> },
  { name: "Node.js", color: "#339933", icon: <SiNodedotjs /> },
];

/* ── Ring 2 — Data Science ── */
const ring2 = [
  { name: "Pandas",       color: "#e0aaff", icon: <SiPandas /> },
  { name: "NumPy",        color: "#4DABCF", icon: <SiNumpy /> },
  { name: "Scikit-learn", color: "#F7931E", icon: <SiScikitlearn /> },
  { name: "MySQL",        color: "#4479A1", icon: <SiMysql /> },
];

/* ── Ring 3 — Tools ── */
const ring3 = [
  { name: "Python",     color: "#3776AB", icon: <SiPython /> },
  { name: "Git",        color: "#F05032", icon: <SiGit /> },
  { name: "Power BI",   color: "#F2C811", icon: <FaMicrosoft /> },
  { name: "Databricks", color: "#FF3621", icon: <SiDatabricks /> },
];

/* ── Orbit Layer ── */
const OrbitLayer = ({ skills, radius, size, duration, reverse, activeSkill, setActiveSkill }) => {
  const S = 40;
  return (
    <motion.div
      animate={{ rotate: activeSkill ? 0 : reverse ? -360 : 360 }}
      transition={{ duration, repeat: activeSkill ? 0 : Infinity, ease: "linear" }}
      className="absolute pointer-events-none"
      style={{ width: size, height: size }}
    >
      {skills.map((skill, i) => {
        const angle = (i / skills.length) * 2 * Math.PI;
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);
        return (
          <motion.div
            key={skill.name}
            className="absolute rounded-xl flex items-center justify-center border border-white/10 cursor-pointer pointer-events-auto"
            style={{
              width: S, height: S,
              left: `calc(50% + ${x}px - ${S / 2}px)`,
              top:  `calc(50% + ${y}px - ${S / 2}px)`,
              backgroundColor: "rgba(12,12,12,0.92)",
            }}
            whileHover={{ scale: 1.4, borderColor: skill.color, boxShadow: `0 0 22px ${skill.color}88` }}
            onHoverStart={() => setActiveSkill(skill)}
            onHoverEnd={() => setActiveSkill(null)}
          >
            <div style={{ color: skill.color, fontSize: "30px" }}>{skill.icon}</div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

/* ── Main ── */
const SkillOrbit = () => {
  const [activeSkill, setActiveSkill] = useState(null);
  return (
    <div className="relative w-[420px] h-[420px] flex items-center justify-center">

      <div className="absolute w-[150px] h-[150px] border border-white/10 rounded-full" />
      <div className="absolute w-[270px] h-[270px] border border-white/10 rounded-full" />
      <div className="absolute w-[390px] h-[390px] border border-white/10 rounded-full" />

      <div className="absolute text-center z-10" style={{ width: 120 }}>
        {activeSkill ? (
          <motion.div
            key={activeSkill.name}
            initial={{ opacity: 0, scale: 0.75 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-2"
          >
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl"
              style={{ backgroundColor: activeSkill.color, color: "#000" }}
            >
              {activeSkill.icon}
            </div>
            <h3 className="text-white text-sm font-bold">{activeSkill.name}</h3>
          </motion.div>
        ) : (
          <h3 className="text-white text-xl font-bold">My Skills</h3>
        )}
      </div>

      <OrbitLayer skills={ring1} radius={75}  size={150} duration={22}
        activeSkill={activeSkill} setActiveSkill={setActiveSkill} />
      <OrbitLayer skills={ring2} radius={135} size={270} duration={34} reverse
        activeSkill={activeSkill} setActiveSkill={setActiveSkill} />
      <OrbitLayer skills={ring3} radius={195} size={390} duration={46}
        activeSkill={activeSkill} setActiveSkill={setActiveSkill} />
    </div>
  );
};

export default SkillOrbit;