// --- DATA ---
const products = [
    {
        id: 101,
        title: "Valorant Account + Skin Pack",
        game: "Valorant",
        type: "bundle",
        serviceType: "account",
        price: 189.99,
        image: "https://placehold.co/600x400/312e81/818cf8?text=VALORANT+BUNDLE",
        features: ["Diamond Rank Account", "Reaver Collection", "Battlepass Completed"],
        desc: "Ultimate starter bundle. Get a Diamond Rank account pre-loaded with the full Reaver collection skin set.",
        badges: ["🔥 Best Value", "Instant Delivery"],
        seller: { name: "GAMERX Official", rating: 5.0, sales: 50, verified: true }
    },
    {
        id: 1,
        title: "Valorant Account • Diamond Rank • Rare Skins",
        game: "Valorant",
        type: "valorant",
        serviceType: "account",
        price: 149.99,
        image: "https://placehold.co/600x400/0f172a/38bdf8?text=Diamond+Rank",
        features: ["Rank: Diamond", "Skins: 12 Premium", "Email Access", "Region: NA"],
        desc: "High-end Valorant account ready for competitive play. Features verified email access and no ban history.",
        badges: ["Instant Delivery"],
        seller: { name: "ProGamerStore", rating: 4.9, sales: 1200, verified: true }
    },
    {
        id: 2,
        title: "Fortnite Account • 120 Skins • OG Skull",
        game: "Fortnite",
        type: "fortnite",
        serviceType: "account",
        price: 39.99,
        image: "https://placehold.co/600x400/0f172a/f472b6?text=120+Skins",
        features: ["120 Skins", "Full Access", "PSN/Xbox Linkable"],
        desc: "Stacked Fortnite account with rare Chapter 1 skins. Full email access provided immediately.",
        badges: ["Buyer Protected"],
        seller: { name: "EpicTrader", rating: 4.8, sales: 850, verified: true }
    },
    {
        id: 3,
        title: "PUBG Mobile • 10k UC Top-up",
        game: "PUBG Mobile",
        type: "pubgm",
        serviceType: "topup",
        price: 99.00,
        image: "https://placehold.co/600x400/451a03/f59e0b?text=10k+UC",
        features: ["Global ID", "Safe Transfer", "No Login Needed"],
        desc: "10,000 UC transferred directly to your Player ID. Fast and secure.",
        badges: ["Instant Delivery"],
        seller: { name: "UC_King", rating: 5.0, sales: 3400, verified: true }
    },
    {
        id: 4,
        title: "Clash of Clans • TH16 Maxed",
        game: "Clash of Clans",
        type: "coc",
        serviceType: "account",
        price: 249.50,
        image: "https://placehold.co/600x400/3f3f46/d4d4d8?text=TH16+Max",
        features: ["Max Heroes", "Supercell ID", "Name Change"],
        desc: "Ready for Legend League. Fully maxed TH16 with all pets and heroes.",
        badges: ["Verified Listing"],
        seller: { name: "ClashMaster", rating: 4.9, sales: 210, verified: true }
    }
];

let cart = [];
let orders = []; // Simulated DB
let currentOrderId = null; // To track customer's active order
let currentGameFilter = 'all';
let currentServiceFilter = 'all';

// --- NAVIGATION ---
function navigateTo(viewId, productId = null) {
    trackEvent('page_view', { page_path: viewId });
    
    document.querySelectorAll('.view-section').forEach(el => el.classList.remove('active'));
    const mobileBar = document.getElementById('mobile-buy-bar');
    if (mobileBar) mobileBar.style.display = 'none';
    const mainNav = document.getElementById('main-nav');

    // Handle Landing Page Logic
    if(viewId === 'landing') {
        if(document.getElementById('view-landing')) {
            document.getElementById('view-landing').classList.add('active');
            if(mainNav) mainNav.style.display = 'none';
            window.scrollTo(0,0);
            return;
        }
        viewId = 'home';
    }
    
    if(mainNav) mainNav.style.display = 'block';

    // Route Logic
    if (viewId === 'home') {
        document.getElementById('view-home').classList.add('active');
    } else if (viewId === 'product' && productId) {
        renderProductDetail(productId);
        document.getElementById('view-product').classList.add('active');
        trackEvent('view_item', { item_id: productId });
    } else if (viewId === 'cart') {
        renderCartPage();
        document.getElementById('view-cart').classList.add('active');
    } else if (viewId === 'checkout') {
        renderCheckoutPage();
        document.getElementById('view-checkout').classList.add('active');
    } else if (viewId === 'tracking') {
        renderOrderStatus();
        document.getElementById('view-order-tracking').classList.add('active');
    } else if (viewId === 'support') {
        document.getElementById('view-support').classList.add('active');
    } else if (viewId === 'admin') {
        renderAdminOrders();
        document.getElementById('view-admin').classList.add('active');
    }
    window.scrollTo(0,0);
}

function toggleMobileMenu() {
    document.getElementById('mobile-menu').classList.toggle('hidden');
}

// --- RENDER PRODUCTS & FILTERS ---
function renderProducts() {
    const container = document.getElementById('product-container');
    container.innerHTML = '';
    
    const filtered = products.filter(p => {
        const gameMatch = currentGameFilter === 'all' || p.type === currentGameFilter || (currentGameFilter === 'bundle' && p.type === 'bundle');
        const serviceMatch = currentServiceFilter === 'all' || p.serviceType === currentServiceFilter;
        return gameMatch && serviceMatch;
    });

    filtered.forEach(product => {
        const card = document.createElement('div');
        card.className = 'bg-dark-800 rounded-xl overflow-hidden shadow-lg border border-gray-800 card-hover flex flex-col h-full cursor-pointer group relative';
        card.onclick = (e) => {
            if(e.target.tagName === 'BUTTON') return;
            navigateTo('product', product.id);
        };
        
        const badge = product.badges && product.badges[0] ? product.badges[0] : 'Instant Delivery';
        const badgeColor = badge.includes('Value') ? 'bg-purple-600' : 'bg-success-500/90';

        card.innerHTML = `
            <div class="relative h-48">
                <img src="${product.image}" alt="${product.title}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105">
                <div class="absolute top-2 left-2 ${badgeColor} backdrop-blur text-white text-[10px] font-bold px-2 py-1 rounded flex items-center shadow-md uppercase tracking-wider">
                    ${badge}
                </div>
            </div>
            <div class="p-4 flex flex-col gap-2 flex-grow">
                <h3 class="font-bold text-white text-base leading-tight line-clamp-2 h-10">${product.title}</h3>
                <div class="mt-1">
                     <span class="text-xl font-extrabold text-white">$${product.price.toFixed(2)}</span>
                </div>
                <div class="flex items-center text-xs text-green-400 font-medium mb-3">
                    ✔ Verified & tested
                </div>
                <div class="mt-auto pt-2 border-t border-gray-700/50">
                    <button onclick="addToCart(${product.id}); event.stopPropagation()" class="w-full bg-brand-600 hover:bg-brand-500 text-white text-sm font-bold px-4 py-3 rounded-lg transition-colors shadow-lg shadow-brand-500/20">
                        Buy Now
                    </button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

function setGameFilter(category) {
    currentGameFilter = category;
    updateFilterStyles('.game-filter-btn', category);
    renderProducts();
}

function setServiceFilter(type) {
    currentServiceFilter = type;
    updateFilterStyles('.service-filter-btn', type);
    renderProducts();
}

function updateFilterStyles(selector, activeValue) {
    document.querySelectorAll(selector).forEach(btn => {
        const isActive = btn.getAttribute('onclick').includes(`'${activeValue}'`);
        btn.className = selector.replace('.', '') + ' px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-sm whitespace-nowrap transition-colors font-medium';
        if (isActive) {
            btn.classList.add('bg-brand-600', 'text-white', 'font-bold', 'shadow-md', 'active');
        } else {
            btn.classList.add('bg-dark-800', 'text-gray-400', 'hover:text-white', 'hover:bg-dark-700');
        }
    });
}

// --- PRODUCT DETAILS ---
function renderProductDetail(id) {
    const product = products.find(p => p.id === id);
    const container = document.getElementById('product-detail-container');
    const mobileBar = document.getElementById('mobile-buy-bar');
    
    if(!product) return;

    const seoDesc = `This ${product.game} account includes ${product.features[0]}. Delivered instantly with full access and buyer protection.`;

    mobileBar.style.display = 'block';
    mobileBar.innerHTML = `
        <div class="max-w-7xl mx-auto">
            <button onclick="addToCart(${product.id})" class="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold py-3.5 rounded-xl shadow-lg flex items-center justify-center gap-2 text-lg">
                <span>🔒</span> Buy Now — $${product.price.toFixed(2)}
            </button>
        </div>
    `;

    container.innerHTML = `
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div class="lg:col-span-2">
                <div class="bg-dark-800 rounded-2xl overflow-hidden border border-gray-800 shadow-2xl mb-6">
                    <img src="${product.image}" class="w-full h-auto object-cover max-h-[500px]">
                </div>
                <p class="text-[0px]">${seoDesc}</p>
            </div>

            <div class="lg:col-span-1 space-y-6">
                <div>
                    <h1 class="text-2xl lg:text-3xl font-extrabold text-white mb-2 leading-tight">${product.title}</h1>
                    <div class="text-3xl font-extrabold text-brand-400 mb-4">$${product.price.toFixed(2)}</div>
                    <div class="flex flex-col gap-2 mb-6 text-sm text-gray-300">
                        <div class="flex items-center"><svg class="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"></path></svg> Instant Delivery</div>
                        <div class="flex items-center"><svg class="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg> Buyer Protection</div>
                    </div>
                </div>

                <div class="bg-dark-900 rounded-xl p-6 border-2 border-gray-700 shadow-xl relative">
                    <div class="flex justify-between items-center mb-4">
                        <span class="text-2xl font-extrabold text-white">$${product.price.toFixed(2)}</span>
                    </div>
                    <div class="text-sm text-gray-400 mb-4"><strong>Delivery:</strong> Instant (within minutes)</div>
                    <button onclick="addToCart(${product.id})" class="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold py-4 rounded-xl text-lg mb-2 shadow-lg shadow-brand-500/25 transition-all">
                        Buy Now — Secure Checkout
                    </button>
                    <p class="text-[10px] text-gray-500 text-center flex items-center justify-center gap-1">🔒 Secure checkout • Full buyer protection</p>
                </div>

                <div class="bg-brand-900/10 border border-brand-800 rounded-xl p-4">
                    <h4 class="font-bold text-white mb-3 text-sm">Recommended Add-ons</h4>
                    <div class="space-y-2">
                        <label class="flex items-center gap-2 cursor-pointer p-2 hover:bg-dark-800 rounded">
                            <input type="checkbox" class="w-4 h-4 text-brand-500 rounded bg-dark-900 border-gray-600">
                            <span class="text-xs text-gray-300">Priority Support (+ $4.99)</span>
                        </label>
                        <label class="flex items-center gap-2 cursor-pointer p-2 hover:bg-dark-800 rounded">
                            <input type="checkbox" class="w-4 h-4 text-brand-500 rounded bg-dark-900 border-gray-600">
                            <span class="text-xs text-gray-300">Warranty Extension (+ $6.99)</span>
                        </label>
                    </div>
                </div>

                <div class="border-t border-gray-800 pt-6">
                    <h3 class="text-lg font-bold text-white mb-3">What You Get</h3>
                    <ul class="space-y-2 text-sm text-gray-400">
                        ${product.features.map(f => `<li class="flex items-start"><span class="text-green-500 mr-2">✔</span> ${f}</li>`).join('')}
                    </ul>
                </div>
                
                <!-- FAQ Accordion -->
                <div class="border-t border-gray-800 pt-6">
                    <h3 class="text-lg font-bold text-white mb-3">Frequently Asked Questions</h3>
                    <div class="space-y-3">
                        <details class="group bg-dark-800 rounded-lg p-3 cursor-pointer">
                            <summary class="flex justify-between items-center font-medium text-sm text-gray-200 list-none">
                                Is this account safe to use?
                                <span class="transition group-open:rotate-180"><svg fill="none" height="24" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg></span>
                            </summary>
                            <p class="text-xs text-gray-400 mt-2 leading-relaxed">Yes. All accounts are verified, tested, and checked before delivery.</p>
                        </details>
                        <details class="group bg-dark-800 rounded-lg p-3 cursor-pointer">
                            <summary class="flex justify-between items-center font-medium text-sm text-gray-200 list-none">
                                How do I receive the account?
                                <span class="transition group-open:rotate-180"><svg fill="none" height="24" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg></span>
                            </summary>
                            <p class="text-xs text-gray-400 mt-2 leading-relaxed">Login details are delivered instantly after purchase.</p>
                        </details>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// --- CART & CHECKOUT ---
function addToCart(id) {
    const product = products.find(p => p.id === id);
    cart.push(product);
    trackEvent('add_to_cart', { currency: "USD", value: product.price, items: [product] });
    updateCartCount();
    showToast(`Added "${product.title}" to cart`);
}

function updateCartCount() {
    document.getElementById('cart-count').textContent = cart.length;
}

function renderCartPage() {
    const wrapper = document.getElementById('cart-content-wrapper');
    if (cart.length === 0) {
        wrapper.innerHTML = `<div class="text-center py-12"><p class="text-gray-400">Cart empty</p><button onclick="navigateTo('home')" class="text-brand-400">Browse Shop</button></div>`;
        return;
    }
    
    let total = cart.reduce((acc, item) => acc + item.price, 0);
    
    wrapper.innerHTML = `
        <div class="space-y-4">
            ${cart.map((item, index) => `
                <div class="flex items-center gap-4 bg-dark-800 p-4 rounded-lg border border-gray-700/50">
                    <img src="${item.image}" class="w-16 h-16 rounded-md object-cover">
                    <div class="flex-grow">
                        <h4 class="font-bold text-white text-sm line-clamp-1">${item.title}</h4>
                        <p class="text-xs text-gray-500">${item.game}</p>
                    </div>
                    <p class="font-bold text-white">$${item.price.toFixed(2)}</p>
                    <button onclick="cart.splice(${index},1); renderCartPage(); updateCartCount()" class="text-red-400 text-xs">Remove</button>
                </div>
            `).join('')}
        </div>
        <div class="mt-8 bg-dark-900 p-6 rounded-xl border border-gray-800">
            <div class="flex justify-between items-center mb-6">
                <span class="text-gray-400">Total</span>
                <span class="text-3xl font-bold text-white">$${total.toFixed(2)}</span>
            </div>
            <button onclick="navigateTo('checkout')" class="w-full bg-brand-600 hover:bg-brand-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-brand-500/25">
                Place Order & Get Bank Payment Instructions
            </button>
        </div>
    `;
}

function renderCheckoutPage() {
    if (cart.length === 0) { navigateTo('cart'); return; }
    
    const summaryContainer = document.getElementById('checkout-summary-items');
    const totalEl = document.getElementById('checkout-total-price');
    let total = 0;

    summaryContainer.innerHTML = cart.map(item => {
        total += item.price;
        return `<div class="flex justify-between"><span>${item.title}</span><span>$${item.price.toFixed(2)}</span></div>`;
    }).join('');
    
    totalEl.innerText = `$${total.toFixed(2)}`;
}

function submitOrder() {
    const email = document.getElementById('customer-email').value;
    const file = document.getElementById('payment-proof').files[0];
    
    if(!email || !file) {
        showToast("⚠️ Email and Payment Proof are REQUIRED.");
        return;
    }

    const newOrder = {
        id: Math.floor(Math.random() * 90000) + 10000,
        items: [...cart],
        total: document.getElementById('checkout-total-price').innerText,
        email: email,
        proof: URL.createObjectURL(file), // Fake local URL
        status: 'pending',
        date: new Date().toLocaleTimeString(),
        delivery: { user: '', pass: '', notes: '' }
    };

    orders.unshift(newOrder);
    currentOrderId = newOrder.id; 
    cart = [];
    updateCartCount();
    
    showToast("Order Submitted for Verification!");
    navigateTo('tracking'); 
}

// --- ORDER STATUS ---
function renderOrderStatus() {
    const container = document.getElementById('status-container');
    const emptyState = document.getElementById('status-empty');
    const activeState = document.getElementById('status-active');
    
    if (!currentOrderId) {
        emptyState.style.display = 'block';
        activeState.style.display = 'none';
        return;
    }

    const order = orders.find(o => o.id === currentOrderId);
    if(!order) return;

    emptyState.style.display = 'none';
    activeState.style.display = 'block';
    
    document.getElementById('status-id').innerText = `#${order.id}`;
    const badge = document.getElementById('status-badge');
    const title = document.getElementById('status-title');
    const desc = document.getElementById('status-desc');
    const box = document.getElementById('status-message-box');
    const delBox = document.getElementById('status-delivery');

    if (order.status === 'pending') {
        badge.className = "px-3 py-1 rounded-full text-xs font-bold uppercase bg-yellow-500/20 text-yellow-400 border border-yellow-500/30";
        badge.innerText = "Pending Verification";
        
        box.className = "bg-yellow-900/20 border border-yellow-500/30 p-4 rounded-lg mb-8 text-center";
        title.className = "text-lg font-bold text-yellow-400 mb-2";
        title.innerText = "🟡 Pending Verification";
        desc.innerText = "Your payment is under review. Verification usually takes 5–30 minutes.";
        
        delBox.classList.add('hidden');
    } 
    else if (order.status === 'completed') {
        badge.className = "px-3 py-1 rounded-full text-xs font-bold uppercase bg-green-500/20 text-green-400 border border-green-500/30";
        badge.innerText = "Completed";

        box.className = "bg-green-900/20 border border-green-500/30 p-4 rounded-lg mb-8 text-center";
        title.className = "text-lg font-bold text-green-400 mb-2";
        title.innerText = "🟢 Completed";
        desc.innerText = "Payment verified successfully. Your account details have been delivered below.";

        delBox.classList.remove('hidden');
        document.getElementById('del-user').innerText = order.delivery.user;
        document.getElementById('del-pass').innerText = order.delivery.pass;
        document.getElementById('del-notes').innerText = order.delivery.notes;
    }
    else if (order.status === 'rejected') {
        badge.className = "px-3 py-1 rounded-full text-xs font-bold uppercase bg-red-500/20 text-red-400 border border-red-500/30";
        badge.innerText = "Rejected";

        box.className = "bg-red-900/20 border border-red-500/30 p-4 rounded-lg mb-8 text-center";
        title.className = "text-lg font-bold text-red-400 mb-2";
        title.innerText = "🔴 Rejected";
        desc.innerText = "Payment could not be verified. Please contact support or re-upload proof.";
        delBox.classList.add('hidden');
    }
}

// --- ADMIN ---
function renderAdminOrders() {
    const tbody = document.getElementById('admin-orders-body');
    if(orders.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="px-6 py-8 text-center text-gray-500">No orders yet. Go buy something to test!</td></tr>`;
        return;
    }

    tbody.innerHTML = orders.map(order => `
        <tr class="hover:bg-dark-800 transition-colors">
            <td class="px-6 py-4 font-mono text-xs">#${order.id}</td>
            <td class="px-6 py-4">
                <div class="font-bold text-white">${order.total}</div>
                <div class="text-xs text-gray-500">${order.items.length} items</div>
            </td>
            <td class="px-6 py-4">
                <a href="${order.proof}" target="_blank" class="text-brand-400 hover:underline text-xs">View Proof</a>
            </td>
            <td class="px-6 py-4">
                <span class="px-2 py-1 rounded text-[10px] font-bold uppercase ${
                    order.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' :
                    order.status === 'completed' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                }">${order.status}</span>
            </td>
            <td class="px-6 py-4">
                ${order.status === 'pending' ? `
                    <div class="flex gap-2">
                        <button onclick="updateOrderStatus(${order.id}, 'completed')" class="bg-green-600 text-white px-2 py-1 rounded text-xs">Approve & Deliver</button>
                        <button onclick="updateOrderStatus(${order.id}, 'rejected')" class="bg-red-600 text-white px-2 py-1 rounded text-xs">Reject</button>
                    </div>
                ` : order.status === 'completed' ? `
                    <span class="text-xs text-gray-500">Delivered</span>
                ` : `<span class="text-xs text-gray-500">Rejected</span>`}
            </td>
        </tr>
    `).join('');
}

function updateOrderStatus(id, status) {
    const order = orders.find(o => o.id === id);
    if (status === 'completed') {
        const user = prompt("Enter Account Username:");
        const pass = prompt("Enter Account Password:");
        const notes = prompt("Enter Notes (optional):");
        
        if(!user || !pass) { alert("Delivery details required!"); return; }
        
        order.delivery = { user, pass, notes };
        order.status = 'completed';
        showToast(`Order #${id} Approved & Delivered`);
    } else {
        order.status = 'rejected';
        showToast(`Order #${id} Rejected`);
    }
    renderAdminOrders();
}

// --- UTILS ---
function showToast(message) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast-enter bg-dark-800 border-l-4 border-brand-500 text-white px-4 py-3 rounded shadow-lg flex items-center gap-3 min-w-[300px] border border-gray-700';
    toast.innerHTML = `<span class="text-sm font-medium">${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => { toast.classList.remove('toast-enter'); toast.classList.add('toast-exit'); setTimeout(() => toast.remove(), 300); }, 3000);
}

function handlePostItem(e) {
    e.preventDefault();
    showToast('New item posted (Demo)');
    e.target.reset();
    navigateTo('home');
}

// Init
renderProducts();
document.getElementById('mobile-menu-btn').addEventListener('click', toggleMobileMenu);