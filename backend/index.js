import express from "express";
import cors from "cors";
import multer from "multer";
import dotenv from "dotenv";
import fetch from "node-fetch";
import FormData from "form-data";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Multer → store upload in memory
const upload = multer({ storage: multer.memoryStorage() });

/* ===============================
   SEVA AGENT AI FUNCTION
   =============================== */
import { askSevaAgent } from "./sevaAgent.js";


/* ===============================
   OCR + FRAUD VERIFICATION API
   =============================== */
app.post("/verify", upload.single("file"), async (req, res) => {
  console.log("🔥 /verify HIT");

  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Build FormData for FastAPI
    const formData = new FormData();
    formData.append("file", req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    // Send the image file to FastAPI OCR
    const ocrResponse = await fetch("http://127.0.0.1:8000/ocr", {
      method: "POST",
      body: formData,
    });

    const data = await ocrResponse.json();
    console.log("📄 OCR Response:", data);

    // Frontend response
    return res.json({
      cardType: data.card_type || "UNKNOWN",
      fraudScore: data.fraud_score ?? 0,
      fraudFlags: data.fraud_flags ?? [],
      extracted: data.extracted ?? {},
      rawText: data.raw_text ?? "",
      cleanedText: data.clean_text ?? "",
    });

  } catch (err) {
    console.error("❌ Server /verify error:", err);
    return res.status(500).json({
      error: "Internal server error",
      details: err.message,
    });
  }
});

/* ===============================
   SEVA AGENT CHAT API
   =============================== */
app.post("/api/seva-agent", async (req, res) => {
  console.log("🧠 /api/seva-agent HIT");

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const reply = await askSevaAgent(message);
    res.json({ reply });

  } catch (err) {
    console.error("❌ Seva Agent error:", err);
    res.status(500).json({ error: "Seva Agent failed" });
  }
});



/* ===============================
   HEALTH CHECK
   =============================== */
app.get("/", (req, res) => {
  res.send("Backend running ✔");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
});
