# Context

## Glossary

| Term | Meaning |
| --- | --- |
| Tulisan | Entri terbit yang `draft`-nya false dan tersedia di UI, RSS, sitemap, pencarian, serta API. |
| Artikel | Tulisan panjang dengan `type: article`, dirender dari MDX untuk dibaca secara fokus. |
| Kurasi | Ringkasan tautan dengan `type: curation`, berisi item eksternal dan insight editorial opsional. |
| Draft | Tulisan dengan `draft: true` yang tidak masuk ke permukaan publik. |
| Tulisan utama | Entri prioritas tertinggi di beranda: artikel terbit terbaru, atau kurasi terbaru jika belum ada artikel. |
| Bacaan berikutnya | Tulisan yang direkomendasikan setelah tulisan aktif, diurutkan berdasarkan kategori, tag bersama, tipe, dan tanggal. |
| Kategori | Taksonomi topik utama. Satu tulisan memiliki satu kategori dan rute kategori adalah jalur jelajah utama. |
| Tag | Taksonomi sekunder lintas topik. Satu tulisan dapat memiliki banyak tag untuk penemuan yang lebih sempit. |
| Baca dengan sengaja | Hasil produk ketika pembaca memahami nilai tulisan, mencapai isi penting, lalu mendapat bacaan relevan berikutnya. |
| Salinan antarmuka | Teks antarmuka, navigasi, filter, kosong, error, loading, dan sistem yang menggunakan bahasa Indonesia sebagai default. |
| Konten penulis | Judul, isi, dan bahasa editorial yang diberikan penulis, dipertahankan tanpa lokalisasi. |
| Catatan Bengkel Digital | Nama dunia visual blog yang gelap, bertumpu pada tipografi dan kode. |

## Content Rules

- Published-only selections copy their input before sorting or filtering.
- Deterministic date ordering is descending by date, then ascending by slug for ties.
- Articles lead over curations in home-page editorial selection.
