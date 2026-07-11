import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: Generate Report using Gemini
  app.post("/api/generate-report", async (req, res) => {
    try {
      const { sector, dividendAmount, agency, formatType, additionalNotes } = req.body;

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(400).json({ 
          error: "GEMINI_API_KEY is not configured on the server. Please define it in your Secrets / Environment Variables." 
        });
      }

      // Lazy initialization of Gemini client to prevent crashes if key is missing on startup
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const prompt = `
        You are the automated agent of the Universalis Real System (HeavenzFire Overhaul).
        You are drafting a professional, legally structured, and highly detailed Whistleblower and Manifestation Report under Phase 6: The Public Exposure.
        This report is designed for submission to the FinCEN Whistleblower Portal, Mirror Manifest (immutable records), and the Global Repository of Maat.

        Target Sector: ${sector}
        Target Agency/entity: ${agency}
        Resource Reallocation (Hunger Dividend): $${dividendAmount} Billion USD
        Additional Audit Context: ${additionalNotes || "None provided"}
        Format Style requested: ${formatType}

        Please write a highly polished, comprehensive, and authentic-looking document in Markdown format. 
        It must contain:
        1. A formal header with timestamp (Year 2026, as the local time is 2026), protocol IDs, and routing headers.
        2. EXPOSURE: A detailed narrative auditing budget discrepancies, systemic reallocation crimes, and diversion of vital human resource funds in the sector.
        3. REDISTRIBUTION PROTOCOLS: A structured layout outlining the exact mathematical redistribution of the $${dividendAmount}B Hunger Dividend to direct food, education, and humanitarian channels.
        4. LEGAL BASIS & PROTECTIONS: Explicitly mention FinCEN Whistleblower Program protections, whistleblowing incentives, and humanitarian data transparency metrics.
        5. CALL TO ACTION: A section detailing forkable instructions for other "Architects" to deploy this layout on GitHub (OpenGovOS) and Mirror.

        Keep the tone formal, sovereign, resolute, and highly articulate. Avoid generic prose, make it read like an official, historic, and technically rigorous protocol document.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
      });

      res.json({ report: response.text });
    } catch (error: any) {
      console.error("Error generating report:", error);
      res.status(500).json({ error: error.message || "Failed to generate report" });
    }
  });

  // Serve static assets in production, and use Vite middleware in development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
