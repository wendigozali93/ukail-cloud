import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(express.json());

  // Lazy initialize Gemini client to prevent crashing on startup if key is missing
  let aiClient: GoogleGenAI | null = null;

  function getAiClient(): GoogleGenAI {
    if (!aiClient) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
        throw new Error("GEMINI_API_KEY is not configured. Please set your API key in the Settings > Secrets menu in AI Studio.");
      }
      aiClient = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
    return aiClient;
  }

  // API Route for AI assistance (Generasi Deskripsi Raport & Rencana Belajar)
  app.post("/api/ai/generate", async (req, res) => {
    try {
      const { prompt, type } = req.body;

      if (!prompt) {
        return res.status(400).json({ error: "Prompt is required." });
      }

      const client = getAiClient();

      let systemInstruction = "Anda adalah asisten cerdas guru sekolah dasar (SD) di Indonesia.";
      if (type === "raport") {
        systemInstruction = `Anda adalah asisten guru sekolah dasar di Indonesia yang bertugas menyusun deskripsi kompetensi raport siswa yang profesional, obyektif, dan memotivasi.
Berdasarkan nilai siswa, nama siswa, dan materi subjek yang diberikan, buatlah deskripsi laporan perkembangan belajar siswa sebanyak 2-3 kalimat yang mendalam dan ramah sesuai dengan Kurikulum Merdeka.
Jelaskan kelebihan siswa dan berikan rekomendasi perbaikan/motivasi belajar yang spesifik secara ramah dan profesional.`;
      } else if (type === "lesson") {
        systemInstruction = "Anda adalah pakar kurikulum SD (Kurikulum Merdeka) di Indonesia. Buatlah rencana pembelajaran singkat, interaktif, dan mudah diaplikasikan berdasarkan subjek dan topik yang diberikan oleh guru.";
      }

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        },
      });

      const text = response.text || "Gagal menghasilkan konten dari AI.";
      res.json({ text });
    } catch (error: any) {
      console.error("AI Error:", error.message);
      res.status(500).json({ 
        error: error.message || "Terjadi kesalahan internal pada layanan AI."
      });
    }
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "UKAIL Backend is active." });
  });

  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in DEVELOPMENT mode...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in PRODUCTION mode...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`UKAIL Teacher Assistant running at http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start UKAIL server:", err);
});
