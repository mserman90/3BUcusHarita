import express from "express";
import cors from "cors";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());

  // Proxy endpoint for ADSB
  app.get("/api/adsb", async (req, res) => {
    try {
      const { lat, lon, dist } = req.query;
      if (!lat || !lon || !dist) {
        return res.status(400).json({ error: "Missing lat, lon, or dist" });
      }
      
      const url = `https://api.adsb.lol/v2/lat/${lat}/lon/${lon}/dist/${dist}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch ADSB: ${response.status}`);
      }
      
      const data = await response.json();
      res.json(data);
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Note: ensure dist path is correct
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
