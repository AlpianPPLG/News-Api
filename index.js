const express = require('express');
const apiKeyMiddleware = require('./middlewares/apiKeyMiddleware');
const rateLimiter = require('./middlewares/rateLimiter');
const generateApiKey = require('./middlewares/expirationMiddleware');

const app = express();
const PORT = 3000;

// Middleware untuk pembatasan laju permintaan
app.use(rateLimiter);

// Route untuk menghasilkan API key baru
app.post('/generate-api-key', generateApiKey);

// Route untuk endpoint berita dengan validasi API key
app.get('/news', apiKeyMiddleware, (req, res) => {
  res.json({
    news: [
      {
        id: 1,
        title: 'Peluncuran iPhone 15: Fitur Terbaru dan Harga',
        content:
          'Apple baru saja meluncurkan iPhone 15 dengan sejumlah fitur terbaru, termasuk layar ProMotion 120Hz, chip A17 Bionic, dan kamera 48MP yang ditingkatkan. Harga iPhone 15 mulai dari $999 di pasar internasional.',
        category: 'Teknologi',
        publishedAt: '2024-09-11',
        author: 'John Doe'
      },
      {
        id: 2,
        title: 'Ekonomi Indonesia Tumbuh 5,2% pada Kuartal Ketiga 2024',
        content:
          'Badan Pusat Statistik (BPS) melaporkan bahwa pertumbuhan ekonomi Indonesia mencapai 5,2% pada kuartal ketiga 2024. Peningkatan ini didorong oleh konsumsi rumah tangga dan ekspor yang lebih tinggi dari perkiraan.',
        category: 'Ekonomi',
        publishedAt: '2024-09-10',
        author: 'Jane Smith'
      },
      {
        id: 3,
        title: 'Timnas Indonesia Lolos ke Final Piala AFF 2024',
        content:
          'Tim nasional sepak bola Indonesia berhasil melaju ke final Piala AFF 2024 setelah mengalahkan Thailand dengan skor 3-1 pada pertandingan semifinal. Ini adalah pencapaian luar biasa bagi timnas Indonesia setelah 8 tahun.',
        category: 'Olahraga',
        publishedAt: '2024-09-09',
        author: 'Ahmad Taufik'
      },
      {
        id: 4,
        title: 'NASA Berhasil Mendaratkan Rover Terbaru di Mars',
        content:
          'NASA mengumumkan keberhasilan pendaratan rover Mars terbaru mereka, "Perseverance II", di permukaan planet merah. Rover ini akan menjalankan misi untuk mencari tanda-tanda kehidupan mikroba purba.',
        category: 'Sains',
        publishedAt: '2024-09-08',
        author: 'Emily Zhang'
      },
      {
        id: 5,
        title: 'Rupiah Menguat Terhadap Dolar AS, Menjadi Rp 14.200/USD',
        content:
          'Nilai tukar rupiah terhadap dolar Amerika Serikat (AS) menguat menjadi Rp 14.200 per USD pada perdagangan hari ini. Penguatan ini didorong oleh masuknya aliran modal asing dan kestabilan pasar domestik.',
        category: 'Keuangan',
        publishedAt: '2024-09-07',
        author: 'Budi Hartono'
      }
    ],
  });
});

// Jalankan server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
