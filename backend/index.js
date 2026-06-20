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
   IN-MEMORY VERIFICATION STORE
   (Admin sees all user submissions)
   =============================== */
let verificationStore = [];
let verificationCounter = 0;

function getStatus(fraudScore) {
  if (fraudScore < 20) return "Safe";
  if (fraudScore < 50) return "Risky";
  return "Fraud";
}

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
    const ocrResponse = await fetch("http://127.0.0.1:8080/ocr", {
      method: "POST",
      body: formData,
    });

    const data = await ocrResponse.json();
    console.log("📄 OCR Response:", data);

    // Get user info from request body (sent by frontend)
    const userName = req.body?.userName || "Unknown User";
    const userEmail = req.body?.userEmail || "unknown@test.com";

    // Determine status from fraud score
    const fraudScore = data.fraud_score ?? 0;
    const status = getStatus(fraudScore);

    // Create verification record
    verificationCounter++;
    const record = {
      id: `VER-${String(verificationCounter).padStart(3, "0")}`,
      userName,
      userEmail,
      docType: data.card_type || "UNKNOWN",
      status,
      fraudScore,
      fraudFlags: data.fraud_flags ?? [],
      extracted: data.extracted ?? {},
      rawText: data.raw_text ?? "",
      cleanedText: data.clean_text ?? "",
      date: new Date().toISOString().replace("T", " ").slice(0, 16),
      timestamp: Date.now(),
    };

    // Store for admin dashboard
    verificationStore.unshift(record); // newest first

    console.log(`✅ Stored verification ${record.id} for ${userName}`);

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
   ADMIN API — GET ALL VERIFICATIONS
   =============================== */
app.get("/api/verifications", (req, res) => {
  console.log("📊 /api/verifications HIT");
  return res.json({ verifications: verificationStore });
});

/* ===============================
   ADMIN API — GET DASHBOARD STATS
   =============================== */
app.get("/api/stats", (req, res) => {
  console.log("📈 /api/stats HIT");

  const total = verificationStore.length;
  const safe = verificationStore.filter((v) => v.status === "Safe").length;
  const risky = verificationStore.filter((v) => v.status === "Risky").length;
  const fraud = verificationStore.filter((v) => v.status === "Fraud").length;

  // Document type counts
  const aadhaarCount = verificationStore.filter((v) => v.docType === "AADHAAR").length;
  const panCount = verificationStore.filter((v) => v.docType === "PAN").length;
  const dlCount = verificationStore.filter((v) => v.docType === "DL").length;
  const unknownCount = verificationStore.filter((v) => v.docType === "UNKNOWN").length;

  // Fraud alerts (score >= 50)
  const fraudAlerts = verificationStore
    .filter((v) => v.fraudScore >= 50)
    .map((v) => ({
      id: v.id,
      user: v.userName,
      docType: v.docType,
      reason: v.fraudFlags.length > 0
        ? v.fraudFlags.join(", ").replace(/_/g, " ")
        : "High fraud score detected",
      severity: v.fraudScore >= 80 ? "Critical" : v.fraudScore >= 50 ? "High" : "Medium",
      fraudScore: v.fraudScore,
      time: v.date,
    }));

  return res.json({
    total,
    safe,
    risky,
    fraud,
    riskDistribution: [
      { risk: "Safe", count: safe },
      { risk: "Risky", count: risky },
      { risk: "Fraud", count: fraud },
    ],
    docTypeDistribution: [
      { name: "Aadhaar", value: aadhaarCount },
      { name: "PAN", value: panCount },
      { name: "DL", value: dlCount },
      ...(unknownCount > 0 ? [{ name: "Unknown", value: unknownCount }] : []),
    ],
    fraudAlerts,
  });
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
