import path from "path";
import { fileURLToPath } from "url";
import { createServer } from "./index";
import express from "express";

const app = createServer();
const port = process.env.PORT || 3000;

// __dirname ES modules-safe
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path vers le dossier SPA build
const distPath = path.join(__dirname, "../spa");

// Serve les fichiers statiques (JS, CSS, images…)
app.use(express.static(distPath));

/**
 * IMPORTANT :
 * Fallback React Router sans utiliser "*" ou "/*"
 * Express 5 interdit les wildcards.
 */
app.use((req, res, next) => {
  // Si la route commence par /api ou /health → c’est du backend
  if (req.path.startsWith("/api/") || req.path.startsWith("/health")) {
    return next();
  }

  // Sinon → renvoyer index.html pour React Router
  res.sendFile(path.join(distPath, "index.html"));
});

// Lancement du serveur
app.listen(port, () => {
  console.log(`🚀 Fusion Starter server running on port ${port}`);
  console.log(`📱 Frontend: http://localhost:${port}`);
  console.log(`🔧 API: http://localhost:${port}/api`);
});

// Arrêts propres
process.on("SIGTERM", () => {
  console.log("🛑 Received SIGTERM, shutting down gracefully");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("🛑 Received SIGINT, shutting down gracefully");
  process.exit(0);
});
