# Context

## Glossary

| Term                    | Meaning                                                                                                                          |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Tulisan                 | Entri artikel terbit yang `draft`-nya false dan tersedia di UI, RSS, sitemap, pencarian, serta API.                              |
| Artikel                 | Satu-satunya tipe tulisan, dengan `type: article`, dirender dari MDX untuk dibaca secara fokus.                                  |
| Kompatibilitas API      | Parameter legacy `type=curation` tetap diterima dan menghasilkan respons 200 dengan data kosong; kurasi bukan tipe konten aktif. |
| Draft                   | Tulisan dengan `draft: true` yang tidak masuk ke permukaan publik.                                                               |
| Tulisan utama           | Artikel terbit terbaru yang menjadi entri prioritas tertinggi di beranda, atau keadaan kosong jika belum ada artikel.            |
| Bacaan berikutnya       | Artikel yang direkomendasikan setelah tulisan aktif, diurutkan berdasarkan kategori, tag bersama, dan tanggal.                   |
| Kategori                | Taksonomi topik utama. Satu tulisan memiliki satu kategori dan rute kategori adalah jalur jelajah utama.                         |
| Antrian artikel         | Daftar rencana artikel berurutan; entri `pending` pertama adalah satu-satunya kandidat publikasi berikutnya.                  |
| Status publikasi        | `pending` berarti belum ada artikel di `main`; `published` berarti artikel dan transisi antriannya telah masuk dalam commit yang sama. |
| Sumber tersimpan        | URL yang tervalidasi beserta catatan fakta editorial di antrian; generator memakai catatan tersebut tanpa mengambil URL.     |
| Artikel terotomasi      | Artikel yang memperoleh metadata dari antrian dan hanya memperoleh excerpt serta isi dari model.                            |
| Tag                     | Taksonomi sekunder lintas topik. Satu tulisan dapat memiliki banyak tag untuk penemuan yang lebih sempit.                        |
| Baca dengan sengaja     | Hasil produk ketika pembaca memahami nilai tulisan, mencapai isi penting, lalu mendapat bacaan relevan berikutnya.               |
| Salinan antarmuka       | Teks antarmuka, navigasi, filter, kosong, error, loading, dan sistem yang menggunakan bahasa Indonesia sebagai default.          |
| Konten penulis          | Judul, isi, dan bahasa editorial yang diberikan penulis, dipertahankan tanpa lokalisasi.                                         |
| Catatan Bengkel Digital | Nama dunia visual blog yang gelap, bertumpu pada tipografi dan kode.                                                             |

## Content Rules

- Published-only selections copy their input before sorting or filtering.
- Deterministic date ordering is descending by date, then ascending by slug for ties.
- Semua permukaan publik hanya mengekspos artikel terbit.
- API mempertahankan field `type` untuk kompatibilitas; `type=article` berisi artikel dan `type=curation` mengembalikan data kosong.
- URL publik lama untuk tulisan curation yang sudah dipensiunkan melakukan permanent redirect ke `/`.
