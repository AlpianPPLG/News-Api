const rateLimit = require('express-rate-limit');

// Konfigurasi pembatasan laju permintaan
const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 menit
  max: 100, // Maksimal 100 permintaan per menit per API key
  message: { error: 'Terlalu banyak permintaan dari API key ini, coba lagi nanti.' }
});

module.exports = apiLimiter;
