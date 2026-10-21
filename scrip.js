/* ========================================== */
/* 1. SELEKSI ELEMEN DOM (DOM Elements)       */
/* ========================================== */
// Mengambil elemen-elemen penting dari HTML untuk dikontrol oleh JavaScript
const searchInput = document.getElementById('searchInput');
const categoryButtons = document.querySelectorAll('.category-btn');
const menuCards = document.querySelectorAll('.menu-card');

/* ========================================== */
/* 2. FITUR PENCARIAN MENU (Real-time Search) */
/* ========================================== */
// Menjalankan fungsi setiap kali pengguna mengetik di kolom pencarian
searchInput.addEventListener('input', (e) => {
  // Ambil teks yang diketik pengguna dan ubah ke huruf kecil (lowercase)
  // Ini agar pencarian tidak sensitif huruf besar/kecil (misal: "Burger" sama dengan "burger")
  const keyword = e.target.value.toLowerCase();

  // Periksa setiap kartu menu satu per satu
  menuCards.forEach((card) => {
    const title = card.querySelector('.menu-title').textContent.toLowerCase();
    const desc = card.querySelector('.menu-desc').textContent.toLowerCase();

    // Jika judul atau deskripsi mengandung kata kunci yang diketik, tampilkan kartu; jika tidak, sembunyikan
    if (title.includes(keyword) || desc.includes(keyword)) {
      card.style.display = 'flex'; // Tampilkan kembali kartu
    } else {
      card.style.display = 'none'; // Sembunyikan kartu
    }
  });
});

/* ========================================== */
/* 3. FITUR FILTER KATEGORI (Category Filter) */
/* ========================================== */
// Menambahkan event click ke setiap tombol kategori
categoryButtons.forEach((button) => {
  button.addEventListener('click', () => {
    
    // A. Ubah status tombol aktif (warna tombol yang diklik)
    categoryButtons.forEach((btn) => btn.classList.remove('active')); // Hapus kelas active dari semua tombol
    button.classList.add('active'); // Tambahkan kelas active ke tombol yang dipilih

    // B. Ambil nama kategori dari atribut 'data-category' tombol
    const selectedCategory = button.getAttribute('data-category');

    // C. Saring kartu menu berdasarkan kategori
    menuCards.forEach((card) => {
      const cardCategory = card.getAttribute('data-category');

      // Jika tombol "Semua" diklik ATAU kategori kartu cocok dengan tombol yang diklik
      if (selectedCategory === 'semua' || cardCategory === selectedCategory) {
        card.style.display = 'flex'; // Tampilkan kartu
      } else {
        card.style.display = 'none'; // Sembunyikan kartu
      }
    });

    // D. Kosongkan kotak pencarian setiap kali kategori diganti agar filter bekerja optimal
    searchInput.value = '';
  });
});
