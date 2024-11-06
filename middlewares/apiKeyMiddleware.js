const fs = require("fs");
const path = require("path");

// Data berita dengan penambahan accessCount
const keysFilePath = path.join(__dirname, "../data/keys.json");

// Fungsi untuk memuat API keys dari file JSON
const loadKeys = () => {
  try {
    const data = fs.readFileSync(keysFilePath, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error loading keys:", err);
    return [];
  }
};

// Middleware untuk memvalidasi API key dan masa berlakunya
const apiKeyMiddleware = (req, res, next) => {
  const apiKey = req.headers["x-api-key"];
  if (!apiKey) {
    return res.status(401).json({ error: "API key is required" });
  }

  const keys = loadKeys();
  const validKey = keys.find((key) => key.apiKey === apiKey);

  if (!validKey) {
    return res.status(403).json({ error: "Invalid API key" });
  }

  // Periksa apakah API key telah kedaluwarsa
  if (new Date(validKey.expiresAt) < new Date()) {
    return res.status(403).json({ error: "API key has expired" });
  }

  next();
};

module.exports = apiKeyMiddleware;
