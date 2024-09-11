const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const keysFilePath = path.join(__dirname, '../data/keys.json');

// Fungsi untuk memuat API keys dari file JSON
const loadKeys = () => {
  try {
    const data = fs.readFileSync(keysFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error loading keys:', err);
    return [];
  }
};

// Fungsi untuk menyimpan API keys ke file JSON
const saveKeys = (keys) => {
  try {
    fs.writeFileSync(keysFilePath, JSON.stringify(keys, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving keys:', err);
  }
};

// Route handler untuk membuat API key baru
const generateApiKey = (req, res) => {
  const newApiKey = uuidv4();
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + 30); // Berlaku 30 hari

  const keys = loadKeys();
  keys.push({ apiKey: newApiKey, createdAt: new Date().toISOString(), expiresAt: expirationDate.toISOString() });
  saveKeys(keys);

  res.json({ apiKey: newApiKey, expiresAt: expirationDate });
};

module.exports = generateApiKey;
