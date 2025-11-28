
# Deteksi-Wajah-Tangan

Website interaktif untuk mendeteksi tangan dan wajah secara real-time menggunakan teknologi TensorFlow.js dan MediaPipe. Dilengkapi dengan Text-to-Speech (TTS) yang akan mengumumkan jumlah jari yang terdeteksi!

![Demo](https://img.shields.io/badge/Demo-Live-brightgreen)
![TensorFlow](https://img.shields.io/badge/TensorFlow.js-FF6F00?logo=tensorflow&logoColor=white)
![MediaPipe](https://img.shields.io/badge/MediaPipe-4285F4?logo=google&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)

## Demo Live
**Link Demo:** [https://hand-fasedetection.vercel.app/](https://hand-fasedetection.vercel.app/)

![Preview](https://files.catbox.moe/hc28kh.png)

## Fitur Utama

### Deteksi Tangan Real-time
- Hand tracking dengan 21 landmark points
- Penghitungan jari otomatis (0-5 jari)
- Pengenalan gestur: Peace Sign, Thumbs Up, Kepalan Tangan
- Multi-hand support - hingga 2 tangan sekaligus
- Visualisasi bounding box merah dan landmarks

### Deteksi Wajah
- Face detection dengan bounding box hijau
- Multi-face support - beberapa wajah sekaligus
- Landmarks wajah untuk analisis detail
- Real-time tracking

### Text-to-Speech (TTS)
- Voice feedback dalam Bahasa Indonesia
- Mengumumkan jumlah jari: "satu jari", "dua jari", dll
- Gestur khusus: "Jempol baik", "Peace sign", "Telapak tangan terbuka"
- Responsif terhadap perubahan deteksi

### Kontrol Interaktif
- Start/Stop Detection - kontrol deteksi
- Switch Camera - ganti kamera depan/belakang
- Real-time Statistics - panel hasil deteksi
- Loading Indicator - status pemuatan model

## Teknologi

| Teknologi | Fungsi |
|-----------|--------|
| TensorFlow.js | Machine learning di browser |
| MediaPipe Hands | Deteksi tangan & jari |
| BlazeFace | Deteksi wajah real-time |
| Web Speech API | Text-to-Speech |
| HTML5 Canvas | Visualisasi real-time |
| CSS3 | Styling & animasi |

## Struktur Project

```

Deteksi-Wajah-Tangan/
├──index.html          # Struktur utama website
├──style.css           # Styling & animasi
├──script.js           # Logic & deteksi
└──README.md           # Dokumentasi ini

```

## Cara Menggunakan

1. **Buka Website** - Akses [demo link](https://hand-fasedetection.vercel.app/)
2. **Izinkan Kamera** - Klik "Izinkan" saat diminta akses kamera
3. **Mulai Deteksi** - Klik tombol "Mulai Deteksi"
4. **Interaksi** - Tunjukkan tangan dan wajah ke kamera
5. **Dengarkan** - Sistem akan mengucapkan jumlah jari terdeteksi

## Instalasi & Development

### Menjalankan Lokal
```bash
# Clone atau download project
# Buka index.html di browser modern
# Atau gunakan live server:
npx live-server
```

### Fitur Deteksi
```
Komponen Status Visual Suara
Wajah ✅ Kotak hijau -
Tangan ✅ Kotak merah + landmarks -
Jari 0 ✅ Kepalan tangan "kepalan tangan"
Jari 1 ✅ Satu jari "satu jari"
Jari 2 ✅ Dua jari / Peace "dua jari" / "Peace sign"
Jari 3 ✅ Tiga jari "tiga jari"
Jari 4 ✅ Empat jari "empat jari"
Jari 5 ✅ Telapak tangan "lima jari" / "Telapak tangan terbuka"
Thumbs Up ✅ Jempol "Jempol baik"
```

### UI/UX Features
```
· Modern Design - Gradient background & glassmorphism
· Responsive - Mobile & desktop friendly
· Real-time Feedback - Live statistics panel
· Smooth Animations - Hover effects & transitions
· Intuitive Controls - Clear button labels dengan icons
```

##### License
---
Distributed under MIT License. See LICENSE for more information.

### Dibuat menggunakan:
```
· TensorFlow.js
· MediaPipe
· Web Speech API
```
---
### Jika project ini membantu, jangan lupa beri star!

