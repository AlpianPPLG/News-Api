const express = require("express");
const apiKeyMiddleware = require("./middlewares/apiKeyMiddleware");
const rateLimiter = require("./middlewares/rateLimiter");
const generateApiKey = require("./middlewares/expirationMiddleware");

// Inisialisasi express
const app = express();
const PORT = 3000;

// Middleware untuk pembatasan laju permintaan
app.use(rateLimiter);
app.use(express.json()); // Middleware untuk mengurai JSON

// Data berita dengan penambahan accessCount dan language
let newsData = [
  {
    id: 6,
    title: "Pemerintah Umumkan Kebijakan Baru untuk Mengatasi Perubahan Iklim",
    content:
      "Pemerintah mengumumkan serangkaian kebijakan baru untuk mengurangi emisi karbon dan berkomitmen mencapai net zero emissions pada tahun 2050.",
    category: "Lingkungan",
    publishedAt: "2024-09-15",
    author: "Rina Wijaya",
    accessCount: 0,
    language: "id", // Bahasa
  },
  {
    id: 7,
    title:
      "Samsung Luncurkan Galaxy Z Fold 6 dengan Fitur Kamera Under-Display",
    content:
      "Samsung memperkenalkan Galaxy Z Fold 6 yang dilengkapi dengan teknologi kamera di bawah layar.",
    category: "Teknologi",
    publishedAt: "2024-09-14",
    author: "Alex Kim",
    accessCount: 0,
    language: "id", // Bahasa
  },
  {
    id: 8,
    title: "Festival Budaya Nusantara Menarik Ribuan Wisatawan Mancanegara",
    content:
      "Festival Budaya Nusantara berhasil menarik ribuan wisatawan dari berbagai negara.",
    category: "Budaya",
    publishedAt: "2024-09-13",
    author: "Dewi Lestari",
    accessCount: 0,
    language: "id", // Bahasa
  },
  {
    id: 9,
    title: "Tesla Meluncurkan Fitur Pengemudian Otomatis Generasi Ketiga",
    content:
      "Tesla mengumumkan fitur pengemudian otomatis generasi ketiga yang dirancang untuk memungkinkan mobil bergerak sepenuhnya tanpa pengawasan pengemudi.",
    category: "Otomotif",
    publishedAt: "2024-09-12",
    author: "Chris Brown",
    accessCount: 0,
    language: "id", // Bahasa
  },
  {
    id: 10,
    title: "Pariwisata Bali Meningkat Pasca Pandemi",
    content:
      "Industri pariwisata di Bali mengalami peningkatan signifikan pasca pandemi COVID-19.",
    category: "Pariwisata",
    publishedAt: "2024-09-11",
    author: "Anita Sari",
    accessCount: 0,
    language: "id", // Bahasa
  },
  {
    id: 11,
    title:
      "Penelitian Menunjukkan Konsumsi Kopi Mampu Meningkatkan Produktivitas",
    content:
      "Studi terbaru menunjukkan bahwa konsumsi kopi dapat membantu meningkatkan produktivitas.",
    category: "Kesehatan",
    publishedAt: "2024-09-10",
    author: "Michael Tan",
    accessCount: 0,
    language: "id", // Bahasa
  },
  {
    id: 12,
    title: "Teknologi 6G Diharapkan Hadir pada Tahun 2030",
    content:
      "Para peneliti teknologi memprediksi jaringan 6G akan tersedia pada tahun 2030.",
    category: "Teknologi",
    publishedAt: "2024-09-09",
    author: "Liam Zhang",
    accessCount: 0,
    language: "id", // Bahasa
  },
  {
    id: 13,
    title: "Bursa Saham Global Mengalami Penurunan Drastis",
    content:
      "Bursa saham global mengalami penurunan tajam akibat kekhawatiran terhadap ketidakstabilan ekonomi global.",
    category: "Ekonomi",
    publishedAt: "2024-09-08",
    author: "Sarah Johnson",
    accessCount: 0,
    language: "id", // Bahasa
  },
  {
    id: 14,
    title: "Startup Lokal Meraih Pendanaan 10 Juta Dolar",
    content:
      "Sebuah startup teknologi asal Indonesia berhasil meraih pendanaan sebesar 10 juta dolar.",
    category: "Bisnis",
    publishedAt: "2024-09-07",
    author: "Yosef Santoso",
    accessCount: 0,
    language: "id", // Bahasa
  },
  {
    id: 15,
    title: "Inovasi Baru dalam Teknologi Energi Terbarukan",
    content:
      "Teknologi energi terbarukan semakin berkembang dengan inovasi terbaru yang dapat meningkatkan efisiensi panel surya.",
    category: "Energi",
    publishedAt: "2024-09-20",
    author: "Diana Putri",
    accessCount: 0,
    language: "id", // Bahasa
  },
  {
    id: 16,
    title: "Pendidikan Digital Meningkat di Seluruh Dunia",
    content:
      "Pendidikan digital semakin populer dengan banyaknya platform pembelajaran online yang tersedia.",
    category: "Pendidikan",
    publishedAt: "2024-09-21",
    author: "Budi Santoso",
    accessCount: 0,
    language: "id", // Bahasa
  },
  {
    id: 17,
    title: "Pameran Seni Kontemporer Menarik Minat Pengunjung",
    content:
      "Pameran seni kontemporer yang diadakan di Jakarta berhasil menarik banyak pengunjung dari berbagai kalangan.",
    category: "Seni",
    publishedAt: "2024-09-22",
    author: "Siti Nurhaliza",
    accessCount: 0,
    language: "id", // Bahasa
  },
  {
    id: 18,
    title: "Perkembangan Teknologi AI dalam Kehidupan Sehari-hari",
    content:
      "Kecerdasan buatan semakin berperan penting dalam kehidupan sehari-hari, dari asisten virtual hingga otomatisasi industri.",
    category: "Teknologi",
    publishedAt: "2024-09-23",
    author: "Rudi Hartono",
    accessCount: 0,
    language: "id", // Bahasa
  },
  {
    id: 19,
    title: "Kampanye Lingkungan Hidup Mendorong Kesadaran Publik",
    content:
      "Kampanye lingkungan hidup yang digelar di berbagai kota berhasil meningkatkan kesadaran masyarakat tentang pentingnya pelestarian alam.",
    category: "Lingkungan",
    publishedAt: "2024-09-24",
    author: "Nina Larasati",
    accessCount: 0,
    language: "id", // Bahasa
  },
  {
    id: 20,
    title: "E-Sports Menjadi Tren di Kalangan Generasi Muda",
    content:
      "E-sports semakin populer di kalangan generasi muda, dengan banyaknya turnamen dan tim profesional yang bermunculan.",
    category: "Olahraga",
    publishedAt: "2024-09-25",
    author: "Farhan Malik",
    accessCount: 0,
    language: "id", // Bahasa
  },
  {
    id: 21,
    title: "Krisis Air Bersih di Beberapa Wilayah Indonesia",
    content:
      "Beberapa daerah di Indonesia mengalami krisis air bersih yang berdampak pada kesehatan masyarakat.",
    category: "Lingkungan",
    publishedAt: "2024-09-26",
    author: "Rina Wijaya",
    accessCount: 0,
    language: "id", // Bahasa
  },
  {
    id: 22,
    title: "Perkembangan Olahraga Berkelanjutan di Indonesia",
    content:
      "Olahraga berkelanjutan semakin diperhatikan dengan berbagai program untuk mempromosikan gaya hidup sehat.",
    category: "Olahraga",
    publishedAt: "2024-09-27",
    author: "Anita Sari",
    accessCount: 0,
    language: "id", // Bahasa
  },
  {
    id: 23,
    title: "Penggunaan Teknologi Blockchain dalam Bisnis",
    content:
      "Blockchain semakin banyak digunakan dalam berbagai sektor bisnis untuk meningkatkan transparansi dan keamanan.",
    category: "Bisnis",
    publishedAt: "2024-09-28",
    author: "Michael Tan",
    accessCount: 0,
    language: "id", // Bahasa
  },
  {
    id: 24,
    title: "Festival Film Internasional Menjadi Sorotan Dunia",
    content:
      "Festival film internasional yang diadakan di Bali menarik perhatian banyak sineas dan pecinta film dari seluruh dunia.",
    category: "Seni",
    publishedAt: "2024-09-29",
    author: "Dewi Lestari",
    accessCount: 0,
    language: "id", // Bahasa
  },
  {
    id: 25,
    title: "Inisiatif Pemerintah untuk Mendorong Kewirausahaan",
    content:
      "Pemerintah meluncurkan berbagai program untuk mendukung kewirausahaan di kalangan anak muda.",
    category: "Bisnis",
    publishedAt: "2024-09-30",
    author: "Liam Zhang",
    accessCount: 0,
    language: "id", // Bahasa
  },
  {
    id: 26,
    title: "Pandemi Memicu Perubahan dalam Industri Kesehatan",
    content:
      "Pandemi COVID-19 telah memicu perubahan signifikan dalam pendekatan industri kesehatan terhadap perawatan pasien.",
    category: "Kesehatan",
    publishedAt: "2024-10-01",
    author: "Chris Brown",
    accessCount: 0,
    language: "id", // Bahasa
  },
  {
    id: 27,
    title: "Kemajuan Teknologi Mobil Listrik di Indonesia",
    content:
      "Teknologi mobil listrik terus berkembang di Indonesia dengan semakin banyaknya produsen yang memasuki pasar.",
    category: "Otomotif",
    publishedAt: "2024-10-02",
    author: "Alex Kim",
    accessCount: 0,
    language: "id", // Bahasa
  },
  {
    id: 28,
    title: "Kebangkitan Ekonomi Kreatif di Masa Pandemi",
    content:
      "Ekonomi kreatif menunjukkan tanda-tanda kebangkitan dengan banyaknya inovasi yang muncul selama masa pandemi.",
    category: "Ekonomi",
    publishedAt: "2024-10-03",
    author: "Farhan Malik",
    accessCount: 0,
    language: "id", // Bahasa
  },
  {
    id: 29,
    title: "Peran Media Sosial dalam Perubahan Sosial",
    content:
      "Media sosial memainkan peran penting dalam mendorong perubahan sosial dan kesadaran masyarakat.",
    category: "Sosial",
    publishedAt: "2024-10-04",
    author: "Nina Larasati",
    accessCount: 0,
    language: "id", // Bahasa
  },
  {
    id: 30,
    title: "Tantangan dan Peluang dalam Investasi Berkelanjutan",
    content:
      "Investasi berkelanjutan semakin menarik perhatian, namun juga menghadapi berbagai tantangan yang perlu diatasi.",
    category: "Bisnis",
    publishedAt: "2024-10-05",
    author: "Diana Putri",
    accessCount: 0,
    language: "id", // Bahasa
  },
  {
    id: 31,
    title: "Inovasi dalam Teknologi Pertanian Berkelanjutan",
    content:
      "Teknologi pertanian berkelanjutan semakin berkembang untuk mendukung ketahanan pangan global.",
    category: "Pertanian",
    publishedAt: "2024-10-06",
    author: "Rudi Hartono",
    accessCount: 0,
    language: "id", // Bahasa
  },
  {
    id: 32,
    title: "Fenomena Perubahan Iklim dan Dampaknya",
    content:
      "Perubahan iklim menjadi isu global yang berdampak besar pada lingkungan dan kehidupan manusia.",
    category: "Lingkungan",
    publishedAt: "2024-10-07",
    author: "Siti Nurhaliza",
    accessCount: 0,
    language: "id", // Bahasa
  },
  {
    id: 33,
    title: "Perkembangan E-Commerce di Indonesia",
    content:
      "E-commerce terus berkembang pesat di Indonesia, dengan semakin banyaknya platform yang bermunculan.",
    category: "Bisnis",
    publishedAt: "2024-10-08",
    author: "Michael Tan",
    accessCount: 0,
    language: "id", // Bahasa
  },
  {
    id: 34,
    title: "Kegiatan Sosial Masyarakat dalam Menghadapi Krisis",
    content:
      "Masyarakat berkolaborasi dalam berbagai kegiatan sosial untuk membantu mereka yang terdampak krisis.",
    category: "Sosial",
    publishedAt: "2024-10-09",
    author: "Dewi Lestari",
    accessCount: 0,
    language: "id", // Bahasa
  },
  {
    id: 35,
    title: "Pengaruh Teknologi terhadap Pendidikan di Era Digital",
    content:
      "Teknologi berperan penting dalam transformasi pendidikan, memudahkan akses belajar di seluruh dunia.",
    category: "Pendidikan",
    publishedAt: "2024-10-10",
    author: "Budi Santoso",
    accessCount: 0,
    language: "id", // Bahasa
  },
  {
    id: 36,
    title: "Makanan Sehat Menjadi Tren di Kalangan Masyarakat",
    content:
      "Masyarakat semakin sadar akan pentingnya makanan sehat untuk mendukung gaya hidup yang lebih baik.",
    category: "Kesehatan",
    publishedAt: "2024-10-11",
    author: "Anita Sari",
    accessCount: 0,
    language: "id", // Bahasa
  },
  {
    id: 37,
    title: "Keamanan Siber: Tantangan di Era Digital",
    content:
      "Keamanan siber menjadi isu penting yang perlu diatasi seiring dengan meningkatnya penggunaan teknologi.",
    category: "Teknologi",
    publishedAt: "2024-10-12",
    author: "Chris Brown",
    accessCount: 0,
    language: "id", // Bahasa
  },
  {
    id: 38,
    title: "Kegiatan Olahraga untuk Meningkatkan Kesehatan Mental",
    content:
      "Olahraga terbukti efektif dalam meningkatkan kesehatan mental dan mengurangi stres.",
    category: "Kesehatan",
    publishedAt: "2024-10-13",
    author: "Nina Larasati",
    accessCount: 0,
    language: "id", // Bahasa
  },
  {
    id: 39,
    title: "Perkembangan Teknologi Keuangan di Indonesia",
    content:
      "Teknologi keuangan atau fintech semakin menjadi tren di Indonesia, menawarkan solusi keuangan yang lebih mudah.",
    category: "Bisnis",
    publishedAt: "2024-10-14",
    author: "Liam Zhang",
    accessCount: 0,
    language: "id", // Bahasa
  },
  {
    id: 40,
    title: "Kampanye Lingkungan Hidup di Sekolah",
    content:
      "Sekolah-sekolah di Indonesia mulai mengadakan kampanye lingkungan hidup untuk meningkatkan kesadaran siswa.",
    category: "Lingkungan",
    publishedAt: "2024-10-15",
    author: "Diana Putri",
    accessCount: 0,
    language: "id", // Bahasa
  },
];

// Route untuk menghasilkan API key baru
app.post("/generate-api-key", generateApiKey);

// Cache untuk berita populer
let popularCache = null;
let popularCacheTimestamp = 0;
const POPULAR_CACHE_DURATION = 60 * 1000; // Durasi cache dalam milidetik (1 menit)

// Endpoint untuk berita populer
app.get("/news/popular", apiKeyMiddleware, (req, res) => {
  const now = Date.now();

  if (popularCache && now - popularCacheTimestamp < POPULAR_CACHE_DURATION) {
    return res.json({ popularNews: popularCache });
  }

  const popularNews = newsData
    .sort((a, b) => b.accessCount - a.accessCount)
    .slice(0, 5);

  popularCache = popularNews;
  popularCacheTimestamp = now;

  res.json({ popularNews });
});

// Endpoint untuk memberikan cuplikan berita
app.get("/news/:id/summary", apiKeyMiddleware, (req, res) => {
  const newsId = parseInt(req.params.id);
  const newsItem = newsData.find((news) => news.id === newsId);
  if (newsItem) {
    const summary = {
      title: newsItem.title,
      summary: newsItem.content.slice(0, 100) + "...", // Cuplikan 100 karakter
    };
    res.json(summary);
  } else {
    res.status(404).json({ error: "Berita tidak ditemukan" });
  }
});

// Endpoint untuk rekomendasi berita
app.get("/news/:id/recommendations", apiKeyMiddleware, (req, res) => {
  const newsId = parseInt(req.params.id);
  const newsItem = newsData.find((news) => news.id === newsId);
  if (newsItem) {
    const recommendedNews = newsData.filter(
      (news) => news.category === newsItem.category && news.id !== newsId
    );
    res.json({ recommendedNews: recommendedNews.slice(0, 5) }); // Rekomendasi 5 berita
  } else {
    res.status(404).json({ error: "Berita tidak ditemukan" });
  }
});

// Endpoint untuk memberikan rating pada berita
app.post("/news/:id/rating", apiKeyMiddleware, (req, res) => {
  const newsId = parseInt(req.params.id);
  const rating = parseInt(req.body.rating);

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ error: "Rating harus antara 1 dan 5" });
  }

  const newsItem = newsData.find((news) => news.id === newsId);
  if (newsItem) {
    newsItem.rating = rating;
    res.json({ message: "Rating berhasil diberikan", newsItem });
  } else {
    res.status(404).json({ error: "Berita tidak ditemukan" });
  }
});

// Endpoint untuk mengambil berita dengan rating tertinggi
app.get("/news/top-rated", apiKeyMiddleware, (req, res) => {
  const topRatedNews = newsData.sort((a, b) => b.rating - a.rating).slice(0, 5);
  res.json({ topRatedNews });
});

// Endpoint berita dengan pagination
app.get("/news", apiKeyMiddleware, (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
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
  if (newsItem) {
    newsItem.accessCount++;
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

  if (validKey) {
    const expiresIn = new Date(validKey.expiresAt) - new Date();
    const daysLeft = Math.ceil(expiresIn / (1000 * 60 * 60 * 24));

    if (daysLeft <= 7) {
      return res.json({ message: "API key is expiring soon.", daysLeft });
    } else {
      return res.json({ message: "API key is valid.", daysLeft });
    }
  } else {
    return res.status(403).json({ error: "Invalid API key" });
  }
});

// Menambahkan API Health Check Endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "API is running smoothly.",
    timestamp: new Date().toISOString(),
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

// Endpoint untuk filter berdasarkan kategori
app.get("/news/category/:category", apiKeyMiddleware, (req, res) => {
  const category = req.params.category;
  const filteredNews = newsData.filter(
    (news) => news.category.toLowerCase() === category.toLowerCase()
  );
  res.json({ results: filteredNews });
});

// Endpoint untuk mendapatkan berita terkait
app.get("/news/:id/related", apiKeyMiddleware, (req, res) => {
  const newsId = parseInt(req.params.id);
  const newsItem = newsData.find((news) => news.id === newsId);
  if (newsItem) {
    const relatedNews = newsData.filter(
      (news) => news.category === newsItem.category && news.id !== newsId
    );
    res.json({ relatedNews });
  } else {
    res.status(404).json({ error: "Berita tidak ditemukan" });
  }
});

// Endpoint untuk mengambil berita berdasarkan bahasa
app.get("/news/language/:language", apiKeyMiddleware, (req, res) => {
  const language = req.params.language;
  const filteredNews = newsData.filter((news) => news.language === language);
  res.json({ results: filteredNews });
});

// Jalankan server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
