// --- 1. DATA MENU (Bisa ditambah atau diubah sesuai menu kafe asli) ---
const dataMenu = [
    {
        id: 1,
        nama: "Kopi Susu Gula Aren",
        kategori: "minuman",
        harga: 18000,
        gambar: "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=500&q=80",
        badge: "Best Seller",
        isAvailable: true
    },
    {
        id: 2,
        nama: "Matcha Latte",
        kategori: "minuman",
        harga: 22000,
        gambar: "https://images.unsplash.com/photo-1536256263959-770b48d82b08?auto=format&fit=crop&w=500&q=80",
        badge: "Favorite",
        isAvailable: true
    },
    {
        id: 3,
        nama: "French Fries",
        kategori: "makanan",
        harga: 15000,
        gambar: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=500&q=80",
        badge: "",
        isAvailable: true
    },
    {
        id: 4,
        nama: "Croissant Cokelat",
        kategori: "dessert",
        harga: 20000,
        gambar: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=500&q=80",
        badge: "New",
        isAvailable: true
    },
    {
        id: 5,
        nama: "Nasi Goreng Spesial",
        kategori: "makanan",
        harga: 25000,
        gambar: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=500&q=80",
        badge: "Chef Pick",
        isAvailable: true
    },
    {
        id: 6,
        nama: "Es Lemon Tea",
        kategori: "minuman",
        harga: 12000,
        gambar: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=500&q=80",
        badge: "",
        isAvailable: false // Contoh menu yang sedang habis
    }
];

// --- 2. STATE / STATUS APLIKASI ---
let keranjang = {}; // Menyimpan item yang dipilih: { idMenu: jumlah }
let kategoriAktif = "semua";
let keywordPencarian = "";

// --- 3. SELEKTOR ELEMEN HTML ---
const menuGrid = document.getElementById("menuGrid");
const searchInput = document.getElementById("searchInput");
const filterButtons = document.querySelectorAll(".btn-filter");
const cartBar = document.getElementById("cartBar");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const btnViewCart = document.getElementById("btnViewCart");
const cartModal = document.getElementById("cartModal");
const btnCloseModal = document.getElementById("btnCloseModal");
const cartItemsList = document.getElementById("cartItemsList");
const modalTotal = document.getElementById("modalTotal");
const btnOrderWA = document.getElementById("btnOrderWA");

// --- 4. FUNGSI MENAMPILKAN MENU (RENDER) ---
function renderMenu() {
    menuGrid.innerHTML = "";

    // Filter data berdasarkan kategori dan pencarian
    const menuSaring = dataMenu.filter(item => {
        const sesuaiKategori = kategoriAktif === "semua" || item.kategori === kategoriAktif;
        const sesuaiPencarian = item.nama.toLowerCase().includes(keywordPencarian.toLowerCase());
        return sesuaiKategori && sesuaiPencarian;
    });

    if (menuSaring.length === 0) {
        menuGrid.innerHTML = `<p style="grid-column: span 2; text-align: center; color: #777; padding: 20px;">Menu tidak ditemukan.</p>`;
        return;
    }

    // Buat elemen kartu untuk setiap menu
    menuSaring.forEach(item => {
        const card = document.createElement("div");
        card.className = "menu-card";
        
        card.innerHTML = `
            <div class="menu-img-container">
                <img src="${item.gambar}" alt="${item.nama}" loading="lazy">
                ${item.badge ? `<span class="menu-badge">${item.badge}</span>` : ''}
            </div>
            <div class="menu-info">
                <div>
                    <h3 class="menu-name">${item.nama}</h3>
                    <p class="menu-price">Rp ${item.harga.toLocaleString('id-ID')}</p>
                </div>
                <button class="btn-add" data-id="${item.id}" ${!item.isAvailable ? 'disabled' : ''}>
                    ${item.isAvailable ? '+ Tambah' : 'Habis'}
                </button>
            </div>
        `;
        menuGrid.appendChild(card);
    });

    // Pasang ulang event listener untuk tombol tambah di setiap kartu
    document.querySelectorAll(".btn-add").forEach(button => {
        button.addEventListener("click", (e) => {
            const id = parseInt(e.target.getAttribute("data-id"));
            tambahKeKeranjang(id);
        });
    });
}

// --- 5. FUNGSI KERANJANG BELANJA ---
function tambahKeKeranjang(id) {
    if (keranjang[id]) {
        keranjang[id] += 1;
    } else {
        keranjang[id] = 1;
    }
    updateUIKeranjang();
}

function updateUIKeranjang() {
    let totalItem = 0;
    let totalHarga = 0;

    for (let id in keranjang) {
        const jumlah = keranjang[id];
        const item = dataMenu.find(m => m.id === parseInt(id));
        if (item) {
            totalItem += jumlah;
            totalHarga += item.harga * jumlah;
        }
    }

    if (totalItem > 0) {
        cartBar.classList.remove("hidden");
        cartCount.textContent = `${totalItem} Pilihan Menu`;
        cartTotal.textContent = `Rp ${totalHarga.toLocaleString('id-ID')}`;
    } else {
        cartBar.classList.add("hidden");
    }
}

// --- 6. FUNGSI MODAL & KIRIM KE WHATSAPP ---
function tampilkanModalKeranjang() {
    cartItemsList.innerHTML = "";
    let totalHarga = 0;

    for (let id in keranjang) {
        const jumlah = keranjang[id];
        const item = dataMenu.find(m => m.id === parseInt(id));
        if (item && jumlah > 0) {
            const subtotal = item.harga * jumlah;
            totalHarga += subtotal;

            const row = document.createElement("div");
            row.className = "cart-item-row";
            row.innerHTML = `
                <div>
                    <strong>${item.nama}</strong><br>
                    <small>${jumlah}x @ Rp ${item.harga.toLocaleString('id-ID')}</small>
                </div>
                <span>Rp ${subtotal.toLocaleString('id-ID')}</span>
            `;
            cartItemsList.appendChild(row);
        }
    }

    modalTotal.textContent = `Rp ${totalHarga.toLocaleString('id-ID')}`;
    cartModal.classList.remove("hidden");
}

function kirimKeWhatsApp() {
    let pesan = "Halo Kak, saya ingin memesan menu berikut:\n\n";
    let totalHarga = 0;

    for (let id in keranjang) {
        const jumlah = keranjang[id];
        const item = dataMenu.find(m => m.id === parseInt(id));
        if (item && jumlah > 0) {
            const subtotal = item.harga * jumlah;
            totalHarga += subtotal;
            pesan += `- ${item.nama} (${jumlah}x) = Rp ${subtotal.toLocaleString('id-ID')}\n`;
        }
    }

    pesan += `\n*Total Keseluruhan: Rp ${totalHarga.toLocaleString('id-ID')}*`;
    pesan += `\n\n*(Mohon segera diproses, Terima kasih!)*`;

    // Ganti nomor di bawah dengan nomor WhatsApp kasir kafe (format internasional, misal 628xxxxxxxxxx)
    const nomorWhatsApp = "6281234567890"; 
    const urlWA = `https://wa.me/${nomorWhatsApp}?text=${encodeURIComponent(pesan)}`;
    
    window.open(urlWA, "_blank");
}

// --- 7. EVENT LISTENERS UTAMA ---

// A. Filter Kategori
filterButtons.forEach(button => {
    button.addEventListener("click", (e) => {
        filterButtons.forEach(btn => btn.classList.remove("active"));
        e.target.classList.add("active");
        kategoriAktif = e.target.getAttribute("data-category");
        renderMenu();
    });
});

// B. Pencarian Menu
searchInput.addEventListener("input", (e) => {
    keywordPencarian = e.target.value;
    renderMenu();
});

// C. Interaksi Modal
btnViewCart.addEventListener("click", tampilkanModalKeranjang);
btnCloseModal.addEventListener("click", () => cartModal.classList.add("hidden"));
window.addEventListener("click", (e) => {
    if (e.target === cartModal) cartModal.classList.add("hidden");
});

// D. Tombol Pesan WhatsApp
btnOrderWA.addEventListener("click", kirimKeWhatsApp);

// --- 8. INISIALISASI PERTAMA KALI ---
renderMenu();
