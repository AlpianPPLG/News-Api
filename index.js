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
    id: 1,
    title: "Peluncuran iPhone 15: Fitur Terbaru dan Harga",
    content:
      "Apple baru saja meluncurkan iPhone 15 dengan sejumlah fitur terbaru, termasuk layar ProMotion 120Hz, chip A17 Bionic, dan kamera 48MP yang ditingkatkan. Harga iPhone 15 mulai dari $999 di pasar internasional.",
    category: "Teknologi",
    publishedAt: "2024-09-11",
    author: "John Doe",
    accessCount: 0, // Tambahkan access count
  },
  {
    id: 2,
    title: "Ekonomi Indonesia Tumbuh 5,2% pada Kuartal Ketiga 2024",
    content:
      "Badan Pusat Statistik (BPS) melaporkan bahwa pertumbuhan ekonomi Indonesia mencapai 5,2% pada kuartal ketiga 2024. Peningkatan ini didorong oleh konsumsi rumah tangga dan ekspor yang lebih tinggi dari perkiraan.",
    category: "Ekonomi",
    publishedAt: "2024-09-10",
    author: "Jane Smith",
    accessCount: 0,
  },
  {
    id: 3,
    title: "Timnas Indonesia Lolos ke Final Piala AFF 2024",
    content:
      "Tim nasional sepak bola Indonesia berhasil melaju ke final Piala AFF 2024 setelah mengalahkan Thailand dengan skor 3-1 pada pertandingan semifinal. Ini adalah pencapaian luar biasa bagi timnas Indonesia setelah 8 tahun.",
    category: "Olahraga",
    publishedAt: "2024-09-09",
    author: "Ahmad Taufik",
    accessCount: 0,
  },
  {
    id: 4,
    title: "NASA Berhasil Mendaratkan Rover Terbaru di Mars",
    content:
      'NASA mengumumkan keberhasilan pendaratan rover Mars terbaru mereka, "Perseverance II", di permukaan planet merah. Rover ini akan menjalankan misi untuk mencari tanda-tanda kehidupan mikroba purba.',
    category: "Sains",
    publishedAt: "2024-09-08",
    author: "Emily Zhang",
    accessCount: 0,
  },
  {
    id: 5,
    title: "Rupiah Menguat Terhadap Dolar AS, Menjadi Rp 14.200/USD",
    content:
      "Nilai tukar rupiah terhadap dolar Amerika Serikat (AS) menguat menjadi Rp 14.200 per USD pada perdagangan hari ini. Penguatan ini didorong oleh masuknya aliran modal asing dan kestabilan pasar domestik.",
    category: "Keuangan",
    publishedAt: "2024-09-07",
    author: "Budi Hartono",
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

// Jalankan server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
