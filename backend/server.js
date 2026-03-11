const express    = require("express");
const mongoose   = require("mongoose");
const nodemailer = require("nodemailer");
const cors       = require("cors");
const jwt        = require("jsonwebtoken");
require("dotenv").config();

const app = express();

// Update: Specific origin for your Vercel frontend
app.use(cors({
  origin: "https://dheeraj-portfolio-lyart.vercel.app",
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
}));
app.use(express.json());

// ─────────────────────────────────────────
//  Nodemailer Configuration (Corrected)
// ─────────────────────────────────────────
const transporter = nodemailer.createTransport({
  service: "gmail", 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Use 16-character App Password here
  },
});

// Test the transporter on startup
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Email Transporter Error:", error);
  } else {
    console.log("✅ Email Server is ready to take messages");
  }
});

// ─────────────────────────────────────────
//  MongoDB Connection
// ─────────────────────────────────────────
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// ... (Schemas and Seed Logic remain the same as your code) ...

// ─────────────────────────────────────────
//  PUBLIC: POST /api/contact
// ─────────────────────────────────────────
app.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body;
  
  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields required." });
  }

  try {
    // 1. Save to MongoDB
    await Contact.create({ name, email, message });

    // 2. Prepare Email
    const mailOptions = {
      from: `"Portfolio" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Sends the message to YOU
      replyTo: email,             // Clicking 'reply' in your mail goes to the sender
      subject: `📬 New Portfolio Message from ${name}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee;">
          <h2 style="color: #333;">New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <div style="background: #f9f9f9; padding: 15px; border-radius: 5px;">
            ${message.replace(/\n/g, "<br/>")}
          </div>
        </div>
      `,
    };

    // 3. Send Email
    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: "Message sent and emailed successfully!" });
  } catch (err) {
    console.error("❌ Server Error:", err);
    res.status(500).json({ error: "Failed to process request." });
  }
});

// ... (Rest of your Auth and Admin routes remain the same) ...

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server on http://localhost:${PORT}`));