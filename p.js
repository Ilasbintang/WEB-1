// 1. DATA PRODUK (Update dengan varian berat)
const products = [
    { 
        id: 1, 
        name: "Beras SPHP", 
        img: "Cuplikan layar 2026-04-24 160553.png", // Pastikan file gambar ada
        variants: [
            { size: "5kg", price: 62000 }
        
        ]
    },
    { 
        id: 3, 
        name: "Beras Santap", 
        img: "Cuplikan layar 2026-04-24 160258.png", 
        variants: [
            { size: "5kg", price: 85000 },
            { size: "10kg", price: 170000 },
            { size: "25kg", price: 400000 }
        ]
    },
    { 
        id: 2, 
        name: "Rahma 35", 
        img: "Cuplikan layar 2026-04-24 165736.png", 
        variants: [
            { size: "5kg", price: 80000 },
            { size: "10kg", price: 155000 },
            { size: "25kg", price: 380000 }
        ]
    },
    { 
        id: 4, 
        name: "Melon", 
        img: "Cuplikan layar 2026-04-24 170142.png", 
        variants: [
            { size: "5kg", price: 80000 },
            { size: "10kg", price: 155000 },
            { size: "25kg", price: 380000 }
        ]
    }
];

let cart = [];

// 2. MENAMPILKAN PRODUK KE HALAMAN
function displayProducts() {
    const productList = document.getElementById('product-list');
    if(!productList) return; // Mencegah error jika di halaman index.html (Beranda)

    productList.innerHTML = products.map(p => `
        <div class="product-card">
            <img src="${p.img}" alt="${p.name}">
            <div class="product-info">
                <h3>${p.name}</h3>
                <label>Pilih Berat:</label>
                <select id="size-${p.id}" onchange="updatePriceDisplay(${p.id})">
                    ${p.variants.map(v => `<option value="${v.size}">${v.size}</option>`).join('')}
                </select>
                <p class="product-price" id="price-${p.id}">Rp ${p.variants[0].price.toLocaleString()}</p>
                <button class="btn-add" onclick="addToCartWithVariant(${p.id})">Tambah ke Keranjang</button>
            </div>
        </div>
    `).join('');
}

// 3. UPDATE HARGA SAAT PILIH BERAT
function updatePriceDisplay(id) {
    const product = products.find(p => p.id === id);
    const selectedSize = document.getElementById(`size-${id}`).value;
    const variant = product.variants.find(v => v.size === selectedSize);
    document.getElementById(`price-${id}`).innerText = `Rp ${variant.price.toLocaleString()}`;
}

// 4. LOGIKA KERANJANG
function addToCartWithVariant(id) {
    const product = products.find(p => p.id === id);
    const selectedSize = document.getElementById(`size-${id}`).value;
    const variant = product.variants.find(v => v.size === selectedSize);
    const cartId = `${id}-${selectedSize}`;

    const inCart = cart.find(item => item.cartId === cartId);
    if (inCart) {
        inCart.quantity++;
    } else {
        cart.push({
            cartId: cartId,
            name: product.name,
            size: selectedSize,
            price: variant.price,
            quantity: 1
        });
    }
    updateCartUI();
    showNotification(`${product.name} ${selectedSize}`);
}

function updateCartUI() {
    const cartItems = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const totalPrice = document.getElementById('total-price');
    
    cartCount.innerText = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div>
                <h4>${item.name}</h4>
                <small>${item.size} - Rp ${item.price.toLocaleString()}</small>
            </div>
            <div class="cart-item-controls">
                <button onclick="changeQty('${item.cartId}', -1)">-</button>
                <span>${item.quantity}</span>
                <button onclick="changeQty('${item.cartId}', 1)">+</button>
            </div>
        </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    totalPrice.innerText = `Rp ${total.toLocaleString()}`;
}

function changeQty(cartId, delta) {
    const item = cart.find(p => p.cartId === cartId);
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) cart = cart.filter(i => i.cartId !== cartId);
    }
    updateCartUI();
}

// 5. FITUR PENDUKUNG (Navigasi & Notif)
function toggleCart() {
    document.getElementById('cart-sidebar').classList.toggle('active');
}

function showNotification(msg) {
    const notif = document.getElementById('notification');
    document.getElementById('notif-message').innerText = msg + " masuk keranjang!";
    notif.classList.add('show');
    setTimeout(() => notif.classList.remove('show'), 3000);
}

function checkoutWhatsApp() {
    if (cart.length === 0) return alert("Keranjang kosong!");
    let msg = "Halo Kios Pangan Harapan, saya mau pesan:%0A";
    cart.forEach(i => msg += `- ${i.name} ${i.size} (x${i.quantity})%0A`);
    window.open(`https://wa.me/628123456789?text=${msg}`, '_blank');
}

displayProducts();