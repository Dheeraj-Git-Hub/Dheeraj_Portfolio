const express    = require("express");
const mongoose   = require("mongoose");
const nodemailer = require("nodemailer");
const cors       = require("cors");
const jwt        = require("jsonwebtoken");
require("dotenv").config();

const app = express();
app.use(cors({
  origin: "https://dheeraj-portfolio-lyart.vercel.app/"
}));
app.use(express.json());

// ─────────────────────────────────────────
//  MongoDB Connection
// ─────────────────────────────────────────
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// ─────────────────────────────────────────
//  Schemas
// ─────────────────────────────────────────
const contactSchema = new mongoose.Schema({
  name:      { type: String, required: true },
  email:     { type: String, required: true },
  message:   { type: String, required: true },
  read:      { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const projectSchema = new mongoose.Schema({
  title:  { type: String, required: true },
  type:   { type: String, required: true },
  desc:   { type: String, required: true },
  tags:   [String],
  color:  { type: String, default: "#00f5c4" },
  icon:   { type: String, default: "🚀" },
  order:  { type: Number, default: 0 },
});

const experienceSchema = new mongoose.Schema({
  year:   { type: String, required: true },
  title:  { type: String, required: true },
  org:    { type: String, required: true },
  desc:   { type: String, required: true },
  icon:   { type: String, default: "💼" },
  order:  { type: Number, default: 0 },
});

const certSchema = new mongoose.Schema({
  title:  { type: String, required: true },
  issuer: { type: String, required: true },
  date:   { type: String, required: true },
  link:   { type: String, default: "#" },
  tags:   [String],
  order:  { type: Number, default: 0 },
});

const skillSchema = new mongoose.Schema({
  category: { type: String, required: true },
  name:     { type: String, required: true },
  level:    { type: Number, required: true, min: 0, max: 100 },
  order:    { type: Number, default: 0 },
});

const Contact    = mongoose.model("Contact",    contactSchema);
const Project    = mongoose.model("Project",    projectSchema);
const Experience = mongoose.model("Experience", experienceSchema);
const Cert       = mongoose.model("Cert",       certSchema);
const Skill      = mongoose.model("Skill",      skillSchema);

// ─────────────────────────────────────────
//  Nodemailer
// ─────────────────────────────────────────
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

// ─────────────────────────────────────────
//  Auth Middleware
// ─────────────────────────────────────────
const auth = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer "))
    return res.status(401).json({ error: "Unauthorized" });
  try {
    jwt.verify(header.split(" ")[1], process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};

// ─────────────────────────────────────────
//  Helper: seed default data if collection empty
// ─────────────────────────────────────────
async function seedIfEmpty(Model, data) {
  const count = await Model.countDocuments();
  if (count === 0) await Model.insertMany(data);
}

mongoose.connection.once("open", async () => {
  await seedIfEmpty(Project, [
    { title: "Customer Churn Predictor", type: "Machine Learning", desc: "Built an end-to-end ML pipeline using XGBoost and Random Forest to predict telecom customer churn with 91% accuracy.", tags: ["Python", "XGBoost", "Flask", "Pandas"], color: "#00f5c4", icon: "🧠", order: 0 },
    { title: "Real-Time Sales Dashboard", type: "Data Analytics", desc: "Designed an interactive analytics dashboard using Power BI connected to a MongoDB data warehouse.", tags: ["Power BI", "MongoDB", "SQL", "Python"], color: "#f5a623", icon: "📊", order: 1 },
    { title: "Twitter Sentiment Analyzer", type: "NLP / Data Science", desc: "NLP pipeline leveraging BERT transformers to analyze 10,000+ tweets in real-time.", tags: ["BERT", "NLP", "Python", "Transformers"], color: "#a78bfa", icon: "🔍", order: 2 },
    { title: "ETL Data Pipeline", type: "Data Engineering", desc: "Architected a scalable ETL pipeline using Apache Spark and Kafka.", tags: ["Apache Spark", "Kafka", "Python", "AWS S3"], color: "#fb7185", icon: "⚙️", order: 3 },
    { title: "Stock Price Forecasting", type: "Time Series", desc: "Developed LSTM neural network model for multi-step stock price prediction.", tags: ["LSTM", "TensorFlow", "Python", "Finance"], color: "#38bdf8", icon: "📈", order: 4 },
    { title: "HR Analytics Platform", type: "Data Analytics", desc: "Full-stack MERN analytics platform for HR insights — attrition prediction and employee clustering.", tags: ["MERN", "ML", "MongoDB", "React"], color: "#4ade80", icon: "👥", order: 5 },
  ]);

  await seedIfEmpty(Experience, [
    { year: "2024–Present", title: "B.Tech 3rd Year — Specialization", org: "Data Science Department", desc: "Deep-diving into advanced ML, NLP, and big data systems.", icon: "🚀", order: 0 },
    { year: "Feb 2024 - Mar 2024 • 2 Months", title: "Campus Ambassador", org: "TRYST, IIT Delhi . Internship", desc: "Boosted student engagement by implementing a social media strategy.", icon: "🎓", order: 1 },
    { year: "May 2025 • 1 Month", title: "Data Analyst", org: "SKY Technosoft Pvt. Ltd. . Internship", desc: "Worked on customer segmentation and built predictive models.", icon: "💼", order: 2 },
    { year: "Oct 2025 - Present", title: "Full-Stack Developer", org: "ABS Softtech Pvt. Ltd. . Internship", desc: "Designing and developing websites using MERN stack.", icon: "🏆", order: 3 },
    { year: "Feb 2026 - Present", title: "Information Technology Intern", org: "Indore Municipal Corporation . Internship", desc: "Working on IT infrastructure and data management.", icon: "⚡", order: 4 },
  ]);

  await seedIfEmpty(Cert, [
    { title: "Google Data Analytics", issuer: "Google", date: "Nov 2024", link: "https://www.coursera.org/account/accomplishments/specialization/E5D2B9QWHZCO", tags: ["Data Analysis", "SQL", "Tableau", "Python"], order: 0 },
    { title: "CS'50", issuer: "Harvard University", date: "Jul 2025", link: "https://certificates.cs50.io/f5398d6d-cd58-4ba6-86eb-a8cd905eb0ac.pdf", tags: ["Computer Science", "Algorithms", "Python"], order: 1 },
    { title: "OCI AI Foundations Associate", issuer: "Oracle", date: "Aug 2025", link: "https://catalog-education.oracle.com", tags: ["OCI Cloud AI services"], order: 2 },
  ]);

  await seedIfEmpty(Skill, [
    { category: "Data Science", name: "Python", level: 90, order: 0 },
    { category: "Data Science", name: "Machine Learning", level: 82, order: 1 },
    { category: "Data Science", name: "Deep Learning", level: 70, order: 2 },
    { category: "Data Science", name: "Statistics & Probability", level: 85, order: 3 },
    { category: "Data Science", name: "Data Visualization", level: 88, order: 4 },
    { category: "Data Engineering", name: "SQL & NoSQL", level: 80, order: 0 },
    { category: "Data Engineering", name: "Apache Spark", level: 65, order: 1 },
    { category: "Data Engineering", name: "ETL Pipelines", level: 72, order: 2 },
    { category: "Data Engineering", name: "MongoDB", level: 78, order: 3 },
    { category: "Data Engineering", name: "Apache Kafka", level: 60, order: 4 },
    { category: "Data Analytics", name: "Pandas & NumPy", level: 92, order: 0 },
    { category: "Data Analytics", name: "Power BI / Tableau", level: 75, order: 1 },
    { category: "Data Analytics", name: "Excel & Google Sheets", level: 85, order: 2 },
    { category: "Data Analytics", name: "A/B Testing", level: 70, order: 3 },
    { category: "Data Analytics", name: "Business Intelligence", level: 72, order: 4 },
    { category: "Development", name: "React.js", level: 74, order: 0 },
    { category: "Development", name: "Node.js", level: 70, order: 1 },
    { category: "Development", name: "Express.js", level: 68, order: 2 },
    { category: "Development", name: "Git & GitHub", level: 83, order: 3 },
    { category: "Development", name: "REST APIs", level: 76, order: 4 },
  ]);

  console.log("✅ Default data seeded");
});

// ═══════════════════════════════════════════
//  PUBLIC ROUTES (portfolio frontend reads)
// ═══════════════════════════════════════════

app.get("/api/projects",    async (_, res) => res.json(await Project.find().sort({ order: 1 })));
app.get("/api/experience",  async (_, res) => res.json(await Experience.find().sort({ order: 1 })));
app.get("/api/certs",       async (_, res) => res.json(await Cert.find().sort({ order: 1 })));
app.get("/api/skills",      async (_, res) => res.json(await Skill.find().sort({ order: 1 })));

// ─────────────────────────────────────────
//  PUBLIC: POST /api/contact
// ─────────────────────────────────────────
app.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message)
    return res.status(400).json({ error: "All fields required." });
  try {
    await Contact.create({ name, email, message });
    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: `📬 New message from ${name}`,
      html: `<h2>New Contact</h2><p><b>Name:</b> ${name}</p><p><b>Email:</b> ${email}</p><p><b>Message:</b><br/>${message.replace(/\n/g, "<br/>")}</p>`,
    });
    res.json({ success: true });
  } catch (err) {
    console.error("❌", err);
    res.status(500).json({ error: err.message });
  }
});

// ═══════════════════════════════════════════
//  ADMIN AUTH
// ═══════════════════════════════════════════
app.post("/api/admin/login", (req, res) => {
  if (req.body.password !== process.env.ADMIN_PASSWORD)
    return res.status(401).json({ error: "Wrong password." });
  const token = jwt.sign({ admin: true }, process.env.JWT_SECRET, { expiresIn: "7d" });
  res.json({ token });
});

// ═══════════════════════════════════════════
//  ADMIN: MESSAGES
// ═══════════════════════════════════════════
app.get("/api/admin/messages",           auth, async (_, res) => res.json(await Contact.find().sort({ createdAt: -1 })));
app.patch("/api/admin/messages/:id/read",auth, async (req, res) => { await Contact.findByIdAndUpdate(req.params.id, { read: true }); res.json({ success: true }); });
app.delete("/api/admin/messages/:id",    auth, async (req, res) => { await Contact.findByIdAndDelete(req.params.id); res.json({ success: true }); });

// ═══════════════════════════════════════════
//  ADMIN CRUD FACTORY
//  Creates GET all / POST / PUT /:id / DELETE /:id / PATCH reorder
// ═══════════════════════════════════════════
function crudRoutes(router, path, Model) {
  // reorder MUST come before /:id or Express treats "reorder" as an id param
  router.patch(`${path}/reorder`, auth, async (req, res) => {
    try {
      await Promise.all(req.body.map(({ id, order }) => Model.findByIdAndUpdate(id, { order })));
      res.json({ success: true });
    } catch (e) { res.status(400).json({ error: e.message }); }
  });
  router.get(path,             auth, async (_, res) => res.json(await Model.find().sort({ order: 1 })));
  router.post(path,            auth, async (req, res) => { try { const doc = await Model.create(req.body); res.json(doc); } catch (e) { res.status(400).json({ error: e.message }); } });
  router.put(`${path}/:id`,    auth, async (req, res) => { try { const doc = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true }); res.json(doc); } catch (e) { res.status(400).json({ error: e.message }); } });
  router.delete(`${path}/:id`, auth, async (req, res) => { await Model.findByIdAndDelete(req.params.id); res.json({ success: true }); });
}

crudRoutes(app, "/api/admin/projects",    Project);
crudRoutes(app, "/api/admin/experience",  Experience);
crudRoutes(app, "/api/admin/certs",       Cert);
crudRoutes(app, "/api/admin/skills",      Skill);

// ─────────────────────────────────────────
app.get("/", (_, res) => res.send("✅ Portfolio backend running"));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server on http://localhost:${PORT}`));