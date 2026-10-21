// ========================================== */
// 1. PENGELOLAAN NOMOR MEJA                   */
// ========================================== */
const urlParams = new URLSearchParams(window.location.search);
let nomorMeja = urlParams.get('meja');

if (!nomorMeja) {
  nomorMeja = prompt("Masukkan Nomor Meja Anda (Contoh: 5):") || "Takeaway / Belum diatur";
}
document.getElementById('tableIndicator').textContent = `Nomor Meja: ${nomorMeja}`;

function ubahNomorMeja() {
  const mejaBaru = prompt("Masukkan ulang nomor meja Anda:", nomorMeja);
  if (mejaBaru) {
    nomorMeja = mejaBaru;
    document.getElementById('tableIndicator').textContent = `Nomor Meja: ${nomorMeja}`;
  }
}

// ========================================== */
// 2. SISTEM KERANJANG & TOTAL PEMESANAN      */
// ========================================== */
let keranjang = [];
let diskonPersen = 0;
let namaKodePromo = "";

function tambahKeKeranjang(namaMenu, harga) {
  const itemAda = keranjang.find(item => item.nama === namaMenu);
  
  if (itemAda) {
    itemAda.jumlah += 1;
  } else {
    keranjang.push({ nama: namaMenu, harga: harga, jumlah: 1 });
  }

  updateTampilanKeranjang();
}

function terapkanPromo() {
  const kodeInput = document.getElementById('promoInput').value.trim().toUpperCase();
  const promoMsg = document.getElementById('promoMessage');

  if (kodeInput === "HEMAT10") {
    diskonPersen = 10;
    namaKodePromo = "HEMAT10 (10%)";
    promoMsg.textContent = "🎉 Diskon 10% berhasil diterapkan!";
    promoMsg.style.color = "#2a9d8f";
  } else if (kodeInput === "KOPI2026") {
    diskonPersen = 20;
    namaKodePromo = "KOPI2026 (20%)";
    promoMsg.textContent = "🔥 Diskon Spesial 20% berhasil diterapkan!";
    promoMsg.style.color = "#2a9d8f";
  } else {
    diskonPersen = 0;
    namaKodePromo = "";
    promoMsg.textContent = "❌ Kode promo tidak berlaku.";
    promoMsg.style.color = "#e63946";
  }

  updateTampilanKeranjang();
}

function updateTampilanKeranjang() {
  const cartItemsList = document.getElementById('cartItemsList');
  const subtotalRow = document.getElementById('subtotalRow');
  const discountRow = document.getElementById('discountRow');
  const subtotalPriceEl = document.getElementById('subtotalPrice');
  const discountPriceEl = document.getElementById('discountPrice');
  const totalPriceEl = document.getElementById('totalPrice');
  const checkoutBtn = document.getElementById('checkoutBtn');

  if (keranjang.length === 0) {
    cartItemsList.innerHTML = 'Belum ada menu yang dipilih.';
    cartItemsList.className = 'cart-items-empty';
    subtotalRow.style.display = 'none';
    discountRow.style.display = 'none';
    totalPriceEl.textContent = 'Rp 0';
    checkoutBtn.disabled = true;
    return;
  }

  cartItemsList.className = 'cart-items-active';
  cartItemsList.innerHTML = '';
  
  let subtotal = 0;

  keranjang.forEach((item) => {
    const totalItem = item.harga * item.jumlah;
    subtotal += totalItem;

    const row = document.createElement('div');
    row.className = 'cart-item-row';
    row.innerHTML = `
      <div class="cart-item-info">
        <span class="cart-item-name">${item.nama}</span>
        <span class="cart-item-qty">${item.jumlah}x @ Rp ${item.harga.toLocaleString('id-ID')}</span>
      </div>
      <span class="cart-item-price">Rp ${totalItem.toLocaleString('id-ID')}</span>
    `;
    cartItemsList.appendChild(row);
  });

  const jumlahDiskon = (subtotal * diskonPersen) / 100;
  const totalTagihan = subtotal - jumlahDiskon;

  if (diskonPersen > 0) {
    subtotalRow.style.display = 'flex';
    discountRow.style.display = 'flex';
    subtotalPriceEl.textContent = `Rp ${subtotal.toLocaleString('id-ID')}`;
    discountPriceEl.textContent = `- Rp ${jumlahDiskon.toLocaleString('id-ID')} (${namaKodePromo})`;
  } else {
    subtotalRow.style.display = 'none';
    discountRow.style.display = 'none';
  }

  totalPriceEl.textContent = `Rp ${totalTagihan.toLocaleString('id-ID')}`;
  checkoutBtn.disabled = false;
}

// ========================================== */
// 3. PROSES & KIRIM PEMESANAN VIA WHATSAPP    */
// ========================================== */
function kirimPesananWhatsApp() {
  const nomorAdminWhatsApp = "6281234567890"; // Ganti nomor kasir

  let rincianPesanan = "";
  let subtotal = 0;

  keranjang.forEach((item, index) => {
    const totalItem = item.harga * item.jumlah;
    subtotal += totalItem;
    rincianPesanan += `${index + 1}. ${item.nama} (${item.jumlah}x) - Rp ${totalItem.toLocaleString('id-ID')}\n`;
  });

  const jumlahDiskon = (subtotal * diskonPersen) / 100;
  const totalTagihan = subtotal - jumlahDiskon;

  let infoPromoText = diskonPersen > 0 ? `🎟️ *Promo Digunakan:* ${namaKodePromo}\n📉 *Diskon:* -Rp ${jumlahDiskon.toLocaleString('id-ID')}\n` : "";

  const pesan = `Halo Kak, saya ingin memesan makanan/minuman:\n\n` +
                `📍 *Nomor Meja:* ${nomorMeja}\n\n` +
                `📋 *Daftar Pemesanan:*\n${rincianPesanan}\n` +
                infoPromoText +
                `💰 *Total Pemesanan:* *Rp ${totalTagihan.toLocaleString('id-ID')}*\n\n` +
                `Mohon segera diproses ya, terima kasih!`;

  const urlWhatsApp = `https://wa.me/${nomorAdminWhatsApp}?text=${encodeURIComponent(pesan)}`;
  window.open(urlWhatsApp, '_blank');
}

// ========================================== */
// 4. FITUR PENCARIAN CEPAT & FILTER          */
// ========================================== */
const searchInput = document.getElementById('searchInput');
const categoryButtons = document.querySelectorAll('.category-btn');
const menuCards = document.querySelectorAll('.menu-card');

// Pencarian cepat yang memeriksa judul, deskripsi, dan kategori
searchInput.addEventListener('input', (e) => {
  const keyword = e.target.value.toLowerCase().trim();

  menuCards.forEach((card) => {
    const title = card.querySelector('.menu-title').textContent.toLowerCase();
    const desc = card.querySelector('.menu-desc').textContent.toLowerCase();
    const category = card.getAttribute('data-category').toLowerCase();

    if (title.includes(keyword) || desc.includes(keyword) || category.includes(keyword)) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none';
    }
  });
});

categoryButtons.forEach((button) => {
  button.addEventListener('click', () => {
    categoryButtons.forEach((btn) => btn.classList.remove('active'));
    button.classList.add('active');

    const selectedCategory = button.getAttribute('data-category');
    menuCards.forEach((card) => {
      const cardCategory = card.getAttribute('data-category');
      if (selectedCategory === 'semua' || cardCategory.includes(selectedCategory)) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
    searchInput.value = '';
  });
});
