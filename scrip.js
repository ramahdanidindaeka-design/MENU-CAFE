// Fungsi untuk memfilter menu berdasarkan kategori
function filterMenu(category) {
  const container = document.getElementById("menu-container");
  container.innerHTML = "";

  // Ubah status tombol aktif
  const buttons = document.querySelectorAll(".btn-filter");
  buttons.forEach(btn => btn.classList.remove("active"));
  event.target.classList.add("active");

  // Saring data menu
  const filteredMenus = category === "semua" 
    ? menus 
    : menus.filter(menu => menu.category === category);

  filteredMenus.forEach(menu => {
    const card = document.createElement("div");
    card.className = "menu-card";
    card.innerHTML = `
      <div class="menu-info">
        <h3>${menu.name}</h3>
        <p>Rp ${menu.price.toLocaleString("id-ID")}</p>
      </div>
      <button class="btn-add" onclick="addToCart(${menu.id})">+ Tambah</button>
    `;
    container.appendChild(card);
  });
}
