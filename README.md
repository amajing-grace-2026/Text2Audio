# 🎙️ Suara Kata — Text to Speech Bahasa Indonesia

Aplikasi web sederhana untuk mengubah teks menjadi suara **Bahasa Indonesia**, dengan **20 karakter suara** (10 pria, 10 wanita) dan tombol **unduh MP3**.

Tanpa server, tanpa build — cukup HTML, CSS, dan JavaScript. Bisa langsung di-hosting gratis di **GitHub Pages**.

## ✨ Fitur

- 20 karakter suara siap pakai untuk berbagai kebutuhan:

  | Kategori | Pria | Wanita |
  |---|---|---|
  | Narator | Bima | Sekar |
  | Storytelling | Arya | Laras |
  | Berita | Dimas | Nadia |
  | Iklan | Rizky | Citra |
  | Edukasi | Pak Hadi | Bu Rina |
  | Anak-anak | Kancil | Peri |
  | Puisi | Yoga | Maya |
  | Lainnya | Gatot (trailer/horor), Fajar (podcast), Raka (gaming) | Ayu (customer service), Dewi (meditasi), Tari (vlog) |

- **Dua mesin suara**
  - ☁ **Suara AI Google** (Google Cloud Text-to-Speech, Chirp 3 HD & WaveNet) — Bahasa Indonesia natural, **bisa diunduh MP3**. Perlu API key milik Anda sendiri.
  - 🖥 **Suara Browser** — gratis tanpa key, hanya putar (tidak bisa diunduh), memakai suara yang terpasang di perangkat.
- Atur kecepatan, nada, dan volume
- Tombol ▶ contoh suara di setiap karakter
- Teks panjang otomatis dipecah lalu digabung menjadi satu file MP3
- Tema terang/gelap, tampilan responsif (HP & desktop)
- Teks, pilihan suara, dan pengaturan tersimpan otomatis di browser

## 🚀 Cara menjalankan

Buka `index.html` langsung di browser — selesai.

## 🌐 Upload ke GitHub & aktifkan GitHub Pages

**Lewat website GitHub (tanpa Git):**

1. Buat repository baru di <https://github.com/new> (misalnya `suara-kata`), pilih **Public**.
2. Klik **uploading an existing file**, lalu seret (drag & drop) semua file di folder ini:
   `index.html`, `style.css`, `app.js`, `README.md`, `LICENSE`, `.gitignore`, `.nojekyll`
3. Klik **Commit changes**.
4. Buka **Settings → Pages**, pada *Build and deployment* pilih **Deploy from a branch**, branch **main**, folder **/ (root)**, lalu **Save**.
5. Dalam 1–2 menit aplikasi aktif di `https://<username>.github.io/suara-kata/`.

**Lewat Git (terminal):**

```bash
git init -b main
git add .
git commit -m "Suara Kata: text to speech Bahasa Indonesia"
git remote add origin https://github.com/<username>/suara-kata.git
git push -u origin main
```

## 🔑 API key (untuk suara AI + MP3)

Aplikasi otomatis mendeteksi jenis key yang Anda tempel.

### Opsi A — Gemini API / Google AI Studio (paling mudah, ada kuota gratis)

1. Buka <https://aistudio.google.com/apikey> → **Create API key**.
2. Salin key (biasanya berawalan `AQ.` atau `AIza`), tempel di aplikasi → **Simpan & Tes**.

Memakai model Gemini TTS (30 suara, mendukung Bahasa Indonesia). Tiap karakter punya suara dan arahan gaya bicara sendiri. Audio dikonversi menjadi MP3 langsung di browser. Kuota gratis dibatasi per menit dan per hari; jika tercapai, aplikasi menunggu lalu melanjutkan otomatis.

### Opsi B — Google Cloud Text-to-Speech (suara Chirp 3 HD & WaveNet)

1. Buka <https://console.cloud.google.com/> dan buat project.
2. Aktifkan **Cloud Text-to-Speech API** (perlu akun billing; ada kuota gratis bulanan — cek harga terbaru di <https://cloud.google.com/text-to-speech/pricing>).
3. **APIs & Services → Credentials → Create credentials → API key**.
4. **Wajib dibatasi** agar aman:
   - *API restrictions* → hanya **Cloud Text-to-Speech API**
   - *Website restrictions* → `https://<username>.github.io/*` (tambahkan juga `http://localhost/*` jika perlu)
5. Tempel key di aplikasi → **Simpan & Tes**.

> 🔒 **Keamanan:** API key **tidak** disimpan di kode. Key hanya disimpan di `localStorage` browser masing-masing pengguna dan hanya dikirim ke `texttospeech.googleapis.com`. Jangan pernah meng-commit API key ke repository.

## 🗣️ Suara Browser tanpa Bahasa Indonesia?

Jika perangkat tidak punya suara Indonesia, gunakan salah satu:

- Mode **Suara AI Google** (disarankan), atau
- Buka di **Microsoft Edge** (punya suara online "Ardi" & "Gadis"), atau
- Windows: **Settings → Time & language → Language & region → Add a language → Indonesia**, centang **Speech**, lalu muat ulang halaman.

## 📁 Struktur

```
├── index.html   # tampilan
├── style.css    # gaya
├── app.js       # logika: karakter suara, Google TTS, Web Speech, unduh MP3
├── .nojekyll    # agar GitHub Pages menyajikan file apa adanya
└── LICENSE
```

## 📄 Lisensi

MIT — bebas dipakai dan dimodifikasi.
