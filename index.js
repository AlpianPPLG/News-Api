const express = require("express");
const apiKeyMiddleware = require("./middlewares/apiKeyMiddleware");
const rateLimiter = require("./middlewares/rateLimiter");
const generateApiKey = require("./middlewares/expirationMiddleware");

// Inisialisasi express
const app = express();
const PORT = 3000;

// Middleware untuk pembatasan laju permintaan
app.use(rateLimiter);

// Data berita dengan penambahan accessCount
let newsData = [
  {
    id: 6,
    title: "Pemerintah Umumkan Kebijakan Baru untuk Mengatasi Perubahan Iklim",
    content:
      "Pemerintah mengumumkan serangkaian kebijakan baru untuk mengurangi emisi karbon dan berkomitmen mencapai net zero emissions pada tahun 2050. Langkah-langkah termasuk insentif untuk energi terbarukan dan peraturan ketat bagi industri berat.",
    category: "Lingkungan",
    publishedAt: "2024-09-15",
    author: "Rina Wijaya",
    accessCount: 0,
  },
  {
    id: 7,
    title:
      "Samsung Luncurkan Galaxy Z Fold 6 dengan Fitur Kamera Under-Display",
    content:
      "Samsung memperkenalkan Galaxy Z Fold 6 yang dilengkapi dengan teknologi kamera di bawah layar, memberikan tampilan layar penuh tanpa gangguan. Perangkat ini juga membawa peningkatan dalam daya tahan lipatan dan kualitas kamera.",
    category: "Teknologi",
    publishedAt: "2024-09-14",
    author: "Alex Kim",
    accessCount: 0,
  },
  {
    id: 8,
    title: "Festival Budaya Nusantara Menarik Ribuan Wisatawan Mancanegara",
    content:
      "Festival Budaya Nusantara berhasil menarik ribuan wisatawan dari berbagai negara. Acara ini menampilkan beragam tarian tradisional, kuliner khas daerah, dan pameran kerajinan tangan yang memperkenalkan budaya Indonesia ke dunia.",
    category: "Budaya",
    publishedAt: "2024-09-13",
    author: "Dewi Lestari",
    accessCount: 0,
  },
  {
    id: 9,
    title: "Tesla Meluncurkan Fitur Pengemudian Otomatis Generasi Ketiga",
    content:
      "Tesla mengumumkan fitur pengemudian otomatis generasi ketiga yang dirancang untuk memungkinkan mobil bergerak sepenuhnya tanpa pengawasan pengemudi di jalan raya tertentu. Peningkatan ini diharapkan meningkatkan keamanan dan efisiensi perjalanan.",
    category: "Otomotif",
    publishedAt: "2024-09-12",
    author: "Chris Brown",
    accessCount: 0,
  },
  {
    id: 10,
    title: "Pariwisata Bali Meningkat Pasca Pandemi",
    content:
      "Industri pariwisata di Bali mengalami peningkatan signifikan pasca pandemi COVID-19. Banyak wisatawan domestik dan internasional kembali menikmati keindahan pulau dewata, meningkatkan perekonomian lokal dan sektor pariwisata.",
    category: "Pariwisata",
    publishedAt: "2024-09-11",
    author: "Anita Sari",
    accessCount: 0,
  },
  {
    id: 11,
    title:
      "Penelitian Menunjukkan Konsumsi Kopi Mampu Meningkatkan Produktivitas",
    content:
      "Studi terbaru menunjukkan bahwa konsumsi kopi dapat membantu meningkatkan produktivitas dan fokus kerja. Namun, para ahli juga mengingatkan agar konsumsi kopi tetap dalam batas wajar untuk menghindari efek samping negatif.",
    category: "Kesehatan",
    publishedAt: "2024-09-10",
    author: "Michael Tan",
    accessCount: 0,
  },
  {
    id: 12,
    title: "Teknologi 6G Diharapkan Hadir pada Tahun 2030",
    content:
      "Para peneliti teknologi memprediksi jaringan 6G akan tersedia pada tahun 2030, menawarkan kecepatan yang jauh lebih tinggi dan koneksi yang lebih stabil dibandingkan teknologi 5G. Teknologi ini diharapkan dapat mendukung berbagai industri.",
    category: "Teknologi",
    publishedAt: "2024-09-09",
    author: "Liam Zhang",
    accessCount: 0,
  },
  {
    id: 13,
    title: "Bursa Saham Global Mengalami Penurunan Drastis",
    content:
      "Bursa saham global mengalami penurunan tajam akibat kekhawatiran investor terhadap ketidakstabilan ekonomi global. Indeks utama seperti S&P 500 dan Nikkei mengalami penurunan yang signifikan.",
    category: "Ekonomi",
    publishedAt: "2024-09-08",
    author: "Sarah Johnson",
    accessCount: 0,
  },
  {
    id: 14,
    title: "Startup Lokal Meraih Pendanaan 10 Juta Dolar",
    content:
      "Sebuah startup teknologi asal Indonesia berhasil meraih pendanaan sebesar 10 juta dolar dalam putaran seri B untuk mengembangkan teknologi kecerdasan buatan yang mendukung sektor kesehatan.",
    category: "Bisnis",
    publishedAt: "2024-09-07",
    author: "Yosef Santoso",
    accessCount: 0,
  },
];

// Route untuk menghasilkan API key baru
app.post("/generate-api-key", generateApiKey);

// Endpoint untuk trending news
app.get("/news/trending", apiKeyMiddleware, (req, res) => {
  // Mengurutkan berita berdasarkan accessCount
  const trendingNews = newsData
    .sort((a, b) => b.accessCount - a.accessCount) // Urutkan berdasarkan jumlah akses
    .slice(0, 5); // Ambil 5 berita teratas

  res.json({ trendingNews });
});

// Endpoint untuk memberikan rating pada berita
app.post("/news/:id/rating", apiKeyMiddleware, (req, res) => {
  const newsId = parseInt(req.params.id);
  const rating = parseInt(req.body.rating); // Rating dari pengguna

  // Validasi rating (hanya menerima nilai antara 1-5)
  if (rating < 1 || rating > 5) {
    return res.status(400).json({ error: "Rating harus antara 1 dan 5" });
  }

  // Cari berita berdasarkan ID
  const newsItem = newsData.find((news) => news.id === newsId);

  if (newsItem) {
    newsItem.rating = rating; // Update rating berita
    res.json({ message: "Rating berhasil diberikan", newsItem });
  } else {
    res.status(404).json({ error: "Berita tidak ditemukan" });
  }
});

// Endpoint untuk mengambil berita dengan rating tertinggi
app.get("/news/top-rated", apiKeyMiddleware, (req, res) => {
  // Mengurutkan berita berdasarkan rating tertinggi
  const topRatedNews = newsData.sort((a, b) => b.rating - a.rating).slice(0, 5); // Ambil 5 berita dengan rating tertinggi

  res.json({ topRatedNews });
});

// Endpoint berita dengan pagination
app.get("/news", apiKeyMiddleware, (req, res) => {
  const page = parseInt(req.query.page) || 1; // Halaman default 1
  const limit = parseInt(req.query.limit) || 10; // Limit default 10
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  // Menyaring berita berdasarkan halaman dan limit
  const paginatedNews = newsData.slice(startIndex, endIndex);
  const totalPages = Math.ceil(newsData.length / limit);

  res.json({
    totalPages,
    currentPage: page,
    news: paginatedNews,
  });
});

// Menambah count akses berita setiap kali diakses
app.get("/news/:id", apiKeyMiddleware, (req, res) => {
  const newsId = parseInt(req.params.id);
  const newsItem = newsData.find((news) => news.id === newsId);

  // Jika berita ditemukan
  if (newsItem) {
    newsItem.accessCount++; // Tambah akses
    res.json(newsItem);
  } else {
    res.status(404).json({ error: "Berita tidak ditemukan" });
  }
});

// Endpoint untuk cek masa berlaku API key
app.get("/api-key/check-expiry", apiKeyMiddleware, (req, res) => {
  const apiKey = req.headers["x-api-key"];
  const keys = loadKeys();
  const validKey = keys.find((key) => key.apiKey === apiKey);

  // Periksa masa berlaku API key
  if (validKey) {
    const expiresIn = new Date(validKey.expiresAt) - new Date();
    const daysLeft = Math.ceil(expiresIn / (1000 * 60 * 60 * 24));

    // Jika lebih dari 7 hari
    if (daysLeft <= 7) {
      // Jika kurang dari 7 hari
      return res.json({
        message: "API key is expiring soon.",
        daysLeft,
      });
    } else {
      return res.json({
        message: "API key is valid.",
        daysLeft,
      });
    }
  } else {
    return res.status(403).json({ error: "Invalid API key" });
  }
});

// Menambahkan API Health Check Endpoint**
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "API is running smoothly.",
    timestamp: new Date().toISOString(), // Menampilkan waktu server saat ini
  });
});

// Middleware untuk penanganan error umum
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: "error",
    message: "Terjadi kesalahan pada server. Silakan coba lagi nanti.",
  });
});

// Penanganan route yang tidak ditemukan
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Endpoint tidak ditemukan",
  });
});

// Endpoint untuk statistik
app.get("/stats", (req, res) => {
  const totalNews = newsData.length;
  const totalHits = newsData.reduce((acc, news) => acc + news.accessCount, 0);
  const categories = [...new Set(newsData.map((news) => news.category))];
  const categoryCount = categories.length;

  res.json({
    totalNews,
    totalHits,
    categoryCount,
    categories,
  });
});

// Cache untuk endpoint trending news
let trendingCache = null;
let trendingCacheTimestamp = 0;
const CACHE_DURATION = 60 * 1000; // Durasi cache dalam milidetik (1 menit)

app.get("/news/trending", apiKeyMiddleware, (req, res) => {
  const now = Date.now();

  // Jika cache masih valid, gunakan data cache
  if (trendingCache && now - trendingCacheTimestamp < CACHE_DURATION) {
    return res.json({ trendingNews: trendingCache });
  }

  // Jika cache kadaluarsa, perbarui cache
  const trendingNews = newsData
    .sort((a, b) => b.accessCount - a.accessCount)
    .slice(0, 5);

  trendingCache = trendingNews;
  trendingCacheTimestamp = now;

  res.json({ trendingNews });
});

// Jalankan server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
