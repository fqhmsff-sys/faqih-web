FAQIH PERSONAL WEBSITE V7

Struktur:
- index.html          halaman utama
- projects.html       halaman Projects
- words.html          halaman Words
- word-editor.html    editor lokal untuk Words
- moments.html        halaman Moments
- style.css           styling utama
- app.js              logika Words
- data.js             data public + bundle private terenkripsi
- images/             foto Moments

MENGELOLA WORDS
1. Buka word-editor.html dari website atau secara lokal.
2. Masukkan sandi Words.
3. Edit tulisan, tambah tulisan dengan + ADD WORD, dan pilih PUBLIC / PRIVATE.
4. Tekan EXPORT data.js.
5. Ganti file data.js lama di folder website dengan file data.js hasil export.
6. Upload/commit perubahan ke GitHub.

Catatan: editor memproses sandi di browser. Website tetap merupakan static site; GitHub Pages tidak menyediakan database/admin backend.

MOMENTS
 Versi -enhanced.jpg adalah versi presentasi dengan sedikit peningkatan contrast/color/sharpness dan resolusi, tanpa mengubah isi/ File JPG asli tetap disimpan.


PASSWORD SYSTEM
All password-protected areas use the same password. The password is not stored as plaintext in the website source; Words uses the existing encrypted AES-GCM bundle, and Site Manager verifies against that same encrypted bundle.

SOCIAL
Instagram and Threads links are included in the premium footer and homepage hero.


SECURITY NOTE (V13)
The Words private bundle uses PBKDF2-SHA256 (600,000 iterations) + AES-GCM and is unlocked only in a secure HTTPS context. Site Manager and Word Editor use the same encrypted verifier. This is client-side protection: GitHub Pages cannot provide server-side authentication, so anyone who can edit the repository can change the site. Do not treat this static-site lock as equivalent to server authentication.
