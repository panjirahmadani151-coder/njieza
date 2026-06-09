const cartKey = 'njieza-cart';
const wishlistKey = 'njieza-wishlist';
const ordersKey = 'njieza-orders';
const membersKey = 'njieza-members';
const customProductsKey = 'njieza-custom-products';
const adminAuthKey = 'njieza-admin-auth';

const products = [
  {
    id: 'cooling-tee',
    name: 'Men’s Cooling T-Shirt',
    price: 29,
    category: 'tops',
    fabric: 'cooling',
    badge: 'Cooling Tech',
    description: 'Soft stretch jersey with advanced airflow and moisture-management for all-day comfort.',
    image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80',
    colors: ['cooling', 'black', 'steel'],
    stock: 24
  },
  {
    id: 'thermal-crew',
    name: 'Thermal Crewneck',
    price: 34,
    category: 'tops',
    fabric: 'thermal',
    badge: 'Thermal',
    description: 'Insulated knit designed to trap warmth without adding bulk.',
    image: 'https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=1200&q=80',
    colors: ['cooling', 'black'],
    stock: 18
  },
  {
    id: 'lounge-pant',
    name: 'Relaxed Lounge Pants',
    price: 38,
    category: 'loungewear',
    fabric: 'cotton',
    badge: 'Lounge',
    description: 'Soft stretch lounge pants built for living room comfort and easy movement.',
    image: 'https://images.unsplash.com/photo-1521334884684-d80222895322?auto=format&fit=crop&w=1200&q=80',
    colors: ['steel', 'black'],
    stock: 12
  },
  {
    id: 'ut-tee',
    name: 'Graphic UT Tee',
    price: 24,
    category: 'tops',
    fabric: 'cotton',
    badge: 'Everyday',
    description: 'Statement tee with soft cotton feel and modern graphic finish.',
    image: 'https://images.unsplash.com/photo-1530845649455-077f371e88d9?auto=format&fit=crop&w=1200&q=80',
    colors: ['cooling', 'black', 'steel'],
    stock: 30
  }
];

const defaultMember = {
  id: 'NJZ-1001',
  name: 'Guest Shopper',
  email: 'member@njieza.com',
  points: 120,
  joined: '2026-04-01'
};

function getStorage(key, defaultValue = []) {
  try {
    return JSON.parse(localStorage.getItem(key)) || defaultValue;
  } catch {
    return defaultValue;
  }
}

function setStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getCart() {
  return getStorage(cartKey, []);
}

function setCart(items) {
  setStorage(cartKey, items);
}

function getWishlist() {
  return getStorage(wishlistKey, []);
}

function setWishlist(items) {
  setStorage(wishlistKey, items);
}

function getOrders() {
  return getStorage(ordersKey, []);
}

function setOrders(orders) {
  setStorage(ordersKey, orders);
}

function getMembers() {
  return getStorage(membersKey, [defaultMember]);
}

function setMembers(members) {
  setStorage(membersKey, members);
}

function getCustomProducts() {
  return getStorage(customProductsKey, []);
}

function setCustomProducts(products) {
  setStorage(customProductsKey, products);
}

const defaultShippingRates = { nearby: 3.0, regional: 6.0, long: 12.0, remote: 20.0 };

function getShippingRates() {
  return getStorage('njieza-shipping-rates', defaultShippingRates);
}

function setShippingRates(rates) {
  setStorage('njieza-shipping-rates', rates);
}

function isAdminAuthenticated() {
  return localStorage.getItem(adminAuthKey) === 'true';
}

function setAdminAuthenticated(state) {
  localStorage.setItem(adminAuthKey, state ? 'true' : 'false');
}

function updateCartCount() {
  const count = getCart().reduce((sum, item) => sum + item.quantity, 0);
  document.querySelectorAll('.cart-count').forEach((element) => {
    element.textContent = count;
  });
}

function renderCartDrawer(itemsId, totalId) {
  const container = document.getElementById(itemsId);
  const totalLabel = document.getElementById(totalId);
  if (!container || !totalLabel) return;

  const items = getCart();
  container.innerHTML = '';
  if (items.length === 0) {
    container.innerHTML = '<p class="drawer-empty">Your cart is empty.</p>';
    totalLabel.textContent = '$0.00';
    return;
  }

  let total = 0;
  items.forEach((item) => {
    const row = document.createElement('div');
    row.className = 'drawer-item';
    row.innerHTML = `<div><strong>${item.name}</strong><p>${item.variant}</p></div><div>$${(item.price * item.quantity).toFixed(2)}</div>`;
    container.appendChild(row);
    total += item.price * item.quantity;
  });
  totalLabel.textContent = `$${total.toFixed(2)}`;
}

function openCart(button) {
  const root = button?.closest('.site-shell');
  const drawer = root?.querySelector('.mini-cart-drawer');
  drawer?.classList.remove('hidden');
}

function bindCartButtons() {
  document.querySelectorAll('.cart-button').forEach((button) => {
    button.addEventListener('click', () => openCart(button));
  });
  document.querySelectorAll('.drawer-close').forEach((button) => {
    button.addEventListener('click', () => {
      const parent = button.closest('.mini-cart-drawer');
      parent?.classList.add('hidden');
    });
  });
}

function bindSearchToggle() {
  document.querySelectorAll('.search-toggle').forEach((button) => {
    button.addEventListener('click', () => {
      const panel = button.closest('header')?.querySelector('.search-bar-panel');
      panel?.classList.toggle('hidden');
    });
  });
}

function getCatalog() {
  return [...products, ...getCustomProducts()];
}

function saveCustomProduct(product) {
  const customProducts = getCustomProducts();
  setCustomProducts([...customProducts, product]);
}

function findProduct(id) {
  return getCatalog().find((product) => product.id === id);
}

function addToCartItem(product, variant, quantity = 1) {
  const cart = getCart();
  const existing = cart.find((item) => item.id === product.id && item.variant === variant);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ id: product.id, name: product.name, price: product.price, variant, quantity });
  }
  setCart(cart);
  updateCartCount();
}

function toggleWishlist(productId) {
  const wishlist = getWishlist();
  const index = wishlist.indexOf(productId);
  if (index >= 0) {
    wishlist.splice(index, 1);
  } else {
    wishlist.push(productId);
  }
  setWishlist(wishlist);
  renderAccountPage();
  renderShopPage();
}

function formatCurrency(value) {
  return `$${value.toFixed(2)}`;
}

function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function luhnCheck(num) {
  const arr = (num + '').split('').reverse().map((x) => parseInt(x, 10));
  const sum = arr.reduce((acc, val, idx) => {
    if (idx % 2 === 1) {
      const dbl = val * 2;
      return acc + (dbl > 9 ? dbl - 9 : dbl);
    }
    return acc + val;
  }, 0);
  return sum % 10 === 0;
}

function detectCardBrand(number) {
  if (/^4/.test(number)) return 'Visa';
  if (/^5[1-5]/.test(number) || /^2(2[2-9]|[3-6]|7[01])/.test(number)) return 'Mastercard';
  if (/^3[47]/.test(number)) return 'AMEX';
  return 'Card';
}

function processPaymentMock(cardNumber, expiry, cvc, name) {
  const digits = (cardNumber || '').replace(/\s+/g, '');
  if (!/^[0-9]{13,19}$/.test(digits) || !luhnCheck(digits)) {
    return { success: false, error: 'Invalid card number' };
  }
  if (!/^[0-9]{3,4}$/.test((cvc || '').trim())) return { success: false, error: 'Invalid CVC' };
  const brand = detectCardBrand(digits);
  return { success: true, last4: digits.slice(-4), brand };
}

function calculateShippingCost(postal) {
  // Zone-based shipping using admin-configurable rates
  const rates = getShippingRates();
  const storePrefix = 100;
  const digits = (postal || '').toString().replace(/\D/g, '');
  if (!digits) return rates.remote;
  const prefix = parseInt(digits.slice(0, 3) || '0', 10);
  const diff = Math.abs(prefix - storePrefix);
  if (isNaN(prefix)) return rates.remote;
  if (diff <= 10) return Number(rates.nearby);
  if (diff <= 50) return Number(rates.regional);
  if (diff <= 150) return Number(rates.long);
  return Number(rates.remote);
}

function generateTrackingNumber() {
  return 'NJZ' + Math.random().toString(36).substring(2, 9).toUpperCase();
}

function renderShopPage() {
  const container = document.getElementById('shop-products');
  if (!container) return;

  const searchValue = document.getElementById('shop-search')?.value.toLowerCase() || '';
  const categoryValue = document.getElementById('filter-category')?.value || 'all';
  const fabricValue = document.getElementById('filter-fabric')?.value || 'all';
  const priceValue = document.getElementById('filter-price')?.value || 'all';
  const wishlist = getWishlist();

  const productsList = getCatalog().filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchValue) || product.badge.toLowerCase().includes(searchValue);
    const matchesCategory = categoryValue === 'all' || product.category === categoryValue;
    const matchesFabric = fabricValue === 'all' || product.fabric === fabricValue;
    const matchesPrice =
      priceValue === 'all' ||
      (priceValue === '0-30' && product.price <= 30) ||
      (priceValue === '30-60' && product.price > 30 && product.price <= 60) ||
      (priceValue === '60-100' && product.price > 60 && product.price <= 100);
    return matchesSearch && matchesCategory && matchesFabric && matchesPrice;
  });

  container.innerHTML = '';
  if (productsList.length === 0) {
    container.innerHTML = '<p class="empty-state">No products match your filters.</p>';
    return;
  }

  productsList.forEach((product) => {
    const card = document.createElement('article');
    card.className = 'product-card';
    card.innerHTML = `
      <img class="product-card-image" src="${product.image}" alt="${product.name}" />
      <div class="product-card-body">
        <span>${product.name}</span>
        <strong>${formatCurrency(product.price)}</strong>
        <span class="badge">${product.badge}</span>
        <div class="product-actions">
          <button class="button button-ghost product-view" data-id="${product.id}">View</button>
          <button class="button button-secondary wishlist-button" data-id="${product.id}">${wishlist.includes(product.id) ? 'Remove' : 'Save'}</button>
        </div>
      </div>
    `;
    container.appendChild(card);
  });

  container.querySelectorAll('.product-view').forEach((button) => {
    button.addEventListener('click', () => {
      window.location.href = `product.html?id=${button.dataset.id}`;
    });
  });

  container.querySelectorAll('.wishlist-button').forEach((button) => {
    button.addEventListener('click', () => {
      toggleWishlist(button.dataset.id);
    });
  });
}

function setupShopPage() {
  if (!document.getElementById('shop-page')) return;

  ['shop-search', 'filter-category', 'filter-fabric', 'filter-price'].forEach((id) => {
    document.getElementById(id)?.addEventListener('input', renderShopPage);
    document.getElementById(id)?.addEventListener('change', renderShopPage);
  });

  renderShopPage();
}

function renderAccountPage() {
  const page = document.getElementById('account-page');
  if (!page) return;

  const member = getMembers()[0] || defaultMember;
  document.getElementById('membership-id').textContent = member.id;

  const wishlistItems = document.getElementById('wishlist-items');
  const orderHistory = document.getElementById('order-history');
  const reorderBasics = document.getElementById('reorder-basics');

  const wishlist = getWishlist().map((id) => findProduct(id)).filter(Boolean);
  wishlistItems.innerHTML = wishlist.length
    ? wishlist
        .map(
          (product) => `<div class="wishlist-row"><span>${product.name}</span><button class="button button-secondary wishlist-remove" data-id="${product.id}">Remove</button></div>`
        )
        .join('')
    : '<p class="empty-state">No items saved yet.</p>';

  const orders = getOrders();
  orderHistory.innerHTML = orders.length
    ? orders
        .map(
          (order) => `
            <div class="history-card">
              <div>
                <strong>${order.id}</strong>
                <p>${order.delivery?.method === 'pickup' ? order.delivery.store : order.delivery?.postal} • ${order.status}</p>
                <p>Tracking: <a href="track.html?tracking=${order.tracking}">${order.tracking}</a></p>
              </div>
              <div>
                <span>${formatCurrency(order.total)}</span>
                <button class="button button-ghost reorder-button" data-id="${order.id}">Reorder</button>
              </div>
            </div>`
        )
        .join('')
    : '<p class="empty-state">No purchases yet.</p>';

  const basicItems = orders
    .flatMap((order) => order.items)
    .reduce((unique, item) => {
      if (!unique.find((entry) => entry.id === item.id)) unique.push(item);
      return unique;
    }, []);

  reorderBasics.innerHTML = basicItems.length
    ? basicItems
        .map(
          (item) => `<div class="reorder-row"><span>${item.name}</span><button class="button button-secondary reorder-basic" data-id="${item.id}">Add again</button></div>`
        )
        .join('')
    : '<p class="empty-state">No reorder suggestions yet.</p>';

  page.querySelectorAll('.wishlist-remove').forEach((button) => {
    button.addEventListener('click', () => toggleWishlist(button.dataset.id));
  });

  page.querySelectorAll('.reorder-button, .reorder-basic').forEach((button) => {
    button.addEventListener('click', () => {
      const product = findProduct(button.dataset.id);
      if (!product) return;
      addToCartItem(product, 'Default', 1);
      renderCartDrawer('drawer-items-account', 'drawer-total-account');
      updateCartCount();
    });
  });
}

function renderAdminDashboard() {
  const dashboard = document.getElementById('admin-dashboard');
  if (!dashboard) return;

  const catalog = getCatalog();
  const orders = getOrders();
  const members = getMembers();

  document.getElementById('metric-products').textContent = catalog.length;
  document.getElementById('metric-orders').textContent = orders.filter((order) => order.status !== 'Delivered').length;
  document.getElementById('metric-revenue').textContent = formatCurrency(orders.reduce((sum, order) => sum + order.total, 0));
  document.getElementById('metric-members').textContent = members.length;

  const productContainer = document.getElementById('admin-products');
  productContainer.innerHTML = catalog
    .map(
      (product) => `
      <div class="table-row">
        <span>${product.name}</span>
        <span>${product.category}</span>
        <span>${product.badge}</span>
        <span>${formatCurrency(product.price)}</span>
        <span>${product.stock ?? '—'}</span>
      </div>`
    )
    .join('');

  const orderContainer = document.getElementById('admin-orders');
  orderContainer.innerHTML = orders.length
    ? orders
        .map(
          (order) => `
          <div class="table-row order-row">
            <div>
              <strong>${order.id}</strong>
              <p>Tracking: ${order.tracking}</p>
              <p>${order.delivery?.method === 'pickup' ? order.delivery.store : order.delivery?.postal}</p>
            </div>
            <div>${order.status}</div>
            <div>${formatCurrency(order.total)}</div>
            <div>
              <button class="button button-secondary order-action" data-id="${order.id}">Advance status</button>
            </div>
          </div>`
        )
        .join('')
    : '<p class="empty-state">No orders yet.</p>';

  const inventoryContainer = document.getElementById('inventory-list');
  inventoryContainer.innerHTML = catalog
    .map(
      (product) => `
      <div class="inventory-row">
        <span>${product.name}</span>
        <span>Stock: ${product.stock ?? '—'}</span>
      </div>`
    )
    .join('');

  const memberContainer = document.getElementById('admin-members');
  memberContainer.innerHTML = members
    .map(
      (member) => `
      <div class="member-row">
        <div>
          <strong>${member.id}</strong>
          <p>${member.email}</p>
        </div>
        <div>${member.points} pts</div>
      </div>`
    )
    .join('');

  dashboard.querySelectorAll('.order-action').forEach((button) => {
    button.addEventListener('click', () => {
      const orderId = button.dataset.id;
      const orders = getOrders();
      const order = orders.find((item) => item.id === orderId);
      if (!order) return;
      const sequence = ['Processing', 'Shipped', 'In Transit', 'Out for Delivery', 'Delivered'];
      const currentIdx = sequence.indexOf(order.status);
      const nextStatus = sequence[Math.min(sequence.length - 1, currentIdx + 1)];
      if (nextStatus && nextStatus !== order.status) {
        order.status = nextStatus;
        order.timeline = order.timeline || [];
        order.timeline.push({ status: nextStatus, date: new Date().toLocaleString() });
        setOrders(orders);
        renderAdminDashboard();
      }
    });
  });
}

function setupTrackingPage() {
  const hasTrack = Boolean(document.getElementById('track-page'));
  if (!hasTrack) return;

  const trackingInput = document.getElementById('track-input');
  const trackButton = document.getElementById('track-button');
  const resultArea = document.getElementById('track-result');

  function renderTrack(tracking) {
    const orders = getOrders();
    const order = orders.find((o) => o.tracking === tracking || o.id === tracking);
    if (!order) {
      resultArea.innerHTML = '<p class="empty-state">Order not found.</p>';
      return;
    }
    resultArea.innerHTML = `
      <h3>${order.id}</h3>
      <p>Status: <strong>${order.status}</strong></p>
      <p>Tracking: <strong>${order.tracking}</strong></p>
      <p>Total: <strong>${formatCurrency(order.total)}</strong></p>
      <div class="timeline">
        ${((order.timeline || [])
          .map((t) => `<div class="timeline-row"><span>${t.date}</span><span>${t.status}</span></div>`)
          .join(''))}
      </div>
    `;
  }

  const preset = getQueryParam('tracking') || getQueryParam('id');
  if (preset) renderTrack(preset);

  trackButton?.addEventListener('click', () => {
    const val = trackingInput?.value?.trim();
    if (!val) return;
    renderTrack(val);
  });
}

function setupAdminPage() {
  const page = document.getElementById('admin-page');
  if (!page) return;

  const loginPanel = document.getElementById('admin-login-panel');
  const dashboard = document.getElementById('admin-dashboard');
  const loginButton = document.getElementById('admin-login-button');
  const passwordInput = document.getElementById('admin-password');

  function showDashboard() {
    loginPanel.classList.add('hidden');
    dashboard.classList.remove('hidden');
    renderAdminDashboard();
    // populate shipping rate inputs if present
    const rates = getShippingRates();
    document.getElementById('rate-nearby') && (document.getElementById('rate-nearby').value = rates.nearby);
    document.getElementById('rate-regional') && (document.getElementById('rate-regional').value = rates.regional);
    document.getElementById('rate-long') && (document.getElementById('rate-long').value = rates.long);
    document.getElementById('rate-remote') && (document.getElementById('rate-remote').value = rates.remote);
    document.getElementById('save-shipping-rates')?.addEventListener('click', () => {
      const nearby = parseFloat(document.getElementById('rate-nearby')?.value) || rates.nearby;
      const regional = parseFloat(document.getElementById('rate-regional')?.value) || rates.regional;
      const long = parseFloat(document.getElementById('rate-long')?.value) || rates.long;
      const remote = parseFloat(document.getElementById('rate-remote')?.value) || rates.remote;
      setShippingRates({ nearby, regional, long, remote });
      renderAdminDashboard();
      alert('Shipping rates saved');
    });
  }

  if (isAdminAuthenticated()) {
    showDashboard();
  }

  loginButton?.addEventListener('click', () => {
    if (passwordInput?.value === 'admin123') {
      setAdminAuthenticated(true);
      showDashboard();
    } else {
      passwordInput?.classList.add('invalid');
    }
  });

  document.getElementById('add-product-button')?.addEventListener('click', () => {
    const name = document.getElementById('new-product-name')?.value.trim();
    const category = document.getElementById('new-product-category')?.value;
    const fabric = document.getElementById('new-product-fabric')?.value;
    const price = Number(document.getElementById('new-product-price')?.value);
    const stock = Number(document.getElementById('new-product-stock')?.value);
    if (!name || !category || !fabric || !price || !stock) return;

    const id = `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`;
    saveCustomProduct({ id, name, price, category, fabric, badge: fabric.charAt(0).toUpperCase() + fabric.slice(1), colors: ['cooling', 'black'], stock });
    renderAdminDashboard();
    renderShopPage();
    renderAccountPage();
  });
}

function setupProductPage() {
  const hasProductPage = Boolean(document.getElementById('product-page') || document.getElementById('product-image'));
  if (!hasProductPage) return;

  const productId = getQueryParam('id') || 'cooling-tee';
  const product = findProduct(productId) || findProduct('cooling-tee');
  if (!product) return;

  const colorButtons = document.querySelectorAll('#color-swatches .swatch, .thumbnail');
  const sizeButtons = document.querySelectorAll('#size-options .size-chip');
  const imageElement = document.getElementById('product-image');
  const titleElement = document.getElementById('product-title');
  const priceElement = document.getElementById('product-price');
  const descriptionElement = document.getElementById('product-description');
  const badgeElement = document.getElementById('product-badge');
  const recommendation = document.getElementById('size-recommendation');
  const recommendedSize = document.getElementById('recommended-size');
  const addToCartButton = document.getElementById('add-to-cart');

  let selectedColor = product.colors[0] || 'cooling';
  let selectedSize = 'M';

  function updateProductVisual() {
    if (!imageElement) return;
    imageElement.src = product.image;
    imageElement.alt = product.name;
  }

  titleElement.textContent = product.name;
  document.title = `${product.name} — Njieza`;
  priceElement.textContent = formatCurrency(product.price);
  descriptionElement.textContent = product.description;
  badgeElement.textContent = product.badge;
  updateProductVisual();

  colorButtons.forEach((button) => {
    const color = button.dataset.color;
    if (color === selectedColor) button.classList.add('selected');
    button.addEventListener('click', () => {
      if (!color) return;
      selectedColor = color;
      document.querySelectorAll('.swatch, .thumbnail').forEach((btn) => btn.classList.remove('selected'));
      button.classList.add('selected');
    });
  });

  sizeButtons.forEach((button) => {
    button.addEventListener('click', () => {
      if (button.classList.contains('unavailable')) return;
      selectedSize = button.dataset.size;
      sizeButtons.forEach((btn) => btn.classList.remove('selected'));
      button.classList.add('selected');
    });
  });

  document.getElementById('size-submit')?.addEventListener('click', () => {
    const height = Number(document.getElementById('height-input')?.value);
    const weight = Number(document.getElementById('weight-input')?.value);
    const fit = document.getElementById('fit-input')?.value;
    if (!height || !weight) return;

    let size = 'M';
    if (height < 170 && weight < 65) size = 'S';
    else if (height > 185 || weight > 90) size = 'L';
    else size = 'M';

    if (fit === 'tight') {
      if (size === 'M') size = 'S';
      if (size === 'L') size = 'M';
    }
    if (fit === 'loose') {
      if (size === 'S') size = 'M';
      if (size === 'M') size = 'L';
    }

    selectedSize = size;
    recommendedSize.textContent = size;
    recommendation?.classList.remove('hidden');
    sizeButtons.forEach((btn) => btn.classList.toggle('selected', btn.dataset.size === size));
  });

  addToCartButton?.addEventListener('click', () => {
    addToCartItem(product, `${selectedColor} / ${selectedSize}`);
    renderCartDrawer('drawer-items-2', 'drawer-total-2');
    updateCartCount();
  });
}

function renderCheckoutSummary() {
  const summaryContainer = document.getElementById('checkout-cart-summary');
  const totalContainer = document.getElementById('checkout-total');
  const orderRows = document.getElementById('checkout-order-rows');
  if (!summaryContainer || !totalContainer || !orderRows) return;

  const cart = getCart();
  if (cart.length === 0) {
    summaryContainer.innerHTML = '<p class="empty-state">Your cart is empty.</p>';
    orderRows.innerHTML = '<div class="order-row total"><strong>Total</strong><strong>$0.00</strong></div>';
    return;
  }

  summaryContainer.innerHTML = cart
    .map(
      (item) => `<div class="checkout-item"><span>${item.name}</span><strong>${formatCurrency(item.price * item.quantity)}</strong></div>`
    )
    .join('');

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const postal = document.getElementById('checkout-postal')?.value || '';
  const shippingCost = calculateShippingCost(postal);
  orderRows.innerHTML = `
    ${cart
      .map((item) => `<div class="order-row"><span>${item.name}</span><span>${formatCurrency(item.price * item.quantity)}</span></div>`)
      .join('')}
    <div class="order-row"><span>Shipping</span><span id="checkout-shipping-row">${formatCurrency(shippingCost)}</span></div>
    <div class="order-row total"><strong>Total</strong><strong>${formatCurrency(subtotal + shippingCost)}</strong></div>
  `;
  document.getElementById('checkout-shipping') && (document.getElementById('checkout-shipping').textContent = formatCurrency(shippingCost));
  totalContainer.textContent = formatCurrency(subtotal + shippingCost);
}

function setupCheckoutPage() {
  const hasCheckout = Boolean(document.querySelector('.checkout-page'));
  if (!hasCheckout) return;

  const deliveryRadios = document.querySelectorAll('input[name="delivery"]');
  const pickupPanel = document.getElementById('pickup-panel');
  const shippingPanel = document.getElementById('shipping-panel');
  const stores = document.querySelectorAll('#checkout-stores .store-card');
  const placeOrder = document.getElementById('place-order');
  const dialog = document.getElementById('order-dialog');
  const continueButton = document.getElementById('continue-shopping');
  const postalInput = document.getElementById('checkout-postal');

  deliveryRadios.forEach((radio) => {
    radio.addEventListener('change', () => {
      if (radio.value === 'pickup' && radio.checked) {
        pickupPanel?.classList.remove('hidden');
        shippingPanel?.classList.add('hidden');
      }
      if (radio.value === 'shipping' && radio.checked) {
        shippingPanel?.classList.remove('hidden');
        pickupPanel?.classList.add('hidden');
      }
    });
  });

  stores.forEach((card) => {
    card.addEventListener('click', () => {
      stores.forEach((item) => item.classList.remove('selected'));
      card.classList.add('selected');
    });
  });

  placeOrder?.addEventListener('click', () => {
    const cart = getCart();
    if (!cart.length) return;
    const deliveryMethod = document.querySelector('input[name="delivery"]:checked')?.value || 'pickup';
    const selectedStore = document.querySelector('#checkout-stores .store-card.selected')?.textContent || 'Central Store';
    const postal = document.getElementById('checkout-postal')?.value || '';
    const shippingCost = deliveryMethod === 'pickup' ? 0 : calculateShippingCost(postal);

    // Payment fields
    const cardNumber = document.getElementById('card-number')?.value || '';
    const cardExpiry = document.getElementById('card-expiry')?.value || '';
    const cardCvc = document.getElementById('card-cvc')?.value || '';
    const payerName = document.getElementById('shipping-name')?.value || 'Guest';

    const pay = processPaymentMock(cardNumber, cardExpiry, cardCvc, payerName);
    if (!pay.success) {
      alert('Payment failed: ' + (pay.error || 'Unknown'));
      return;
    }

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const total = subtotal + shippingCost;
    const orderId = `NJZ-${Date.now()}`;
    const tracking = generateTrackingNumber();
    const orders = getOrders();
    const order = {
      id: orderId,
      items: cart,
      subtotal,
      shipping: shippingCost,
      total,
      status: 'Processing',
      tracking,
      payment: { last4: pay.last4, brand: pay.brand, method: 'card' },
      delivery: { method: deliveryMethod, store: selectedStore, postal },
      timeline: [{ status: 'Processing', date: new Date().toLocaleString() }],
      created: new Date().toLocaleString()
    };
    orders.unshift(order);
    setOrders(orders);
    setCart([]);
    updateCartCount();
    renderCartDrawer('drawer-items-3', 'drawer-total-3');
    renderCheckoutSummary();
    // show dialog with tracking
    dialog?.classList.remove('hidden');
    const dialogCard = document.querySelector('#order-dialog .order-dialog-card');
    if (dialogCard) {
      dialogCard.innerHTML = `<h2>Order confirmed</h2><p>Your order <strong>${order.id}</strong> is placed.</p><p>Tracking: <strong>${tracking}</strong></p><p>Total: <strong>${formatCurrency(total)}</strong></p><a class="button button-primary" href="track.html?tracking=${tracking}">Track order</a> <button class="button button-secondary" id="continue-shopping">Continue shopping</button>`;
    }
  });

  continueButton?.addEventListener('click', () => {
    window.location.href = 'index.html';
  });

  postalInput?.addEventListener('input', () => {
    if (postalInput.value.trim().length >= 3) {
      document.querySelectorAll('#checkout-stores .store-card').forEach((card, index) => {
        card.textContent = index === 0 ? 'Central Store • In stock' : `Store ${index + 1} • 2 available`;
      });
    }
  });

  renderCheckoutSummary();
}

function setupCartFromStorage() {
  updateCartCount();
  renderCartDrawer('drawer-items', 'drawer-total');
  renderCartDrawer('drawer-items-2', 'drawer-total-2');
  renderCartDrawer('drawer-items-3', 'drawer-total-3');
}

function setupStoreCards() {
  document.querySelectorAll('.store-card').forEach((card) => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.store-card').forEach((item) => item.classList.remove('selected'));
      card.classList.add('selected');
    });
  });
}

function init() {
  if (!localStorage.getItem(membersKey)) {
    setMembers([defaultMember]);
  }
  bindSearchToggle();
  bindCartButtons();
  setupCartFromStorage();
  setupStoreCards();
  setupShopPage();
  renderAccountPage();
  setupAdminPage();
  setupProductPage();
  setupCheckoutPage();
  setupTrackingPage();
}

window.addEventListener('DOMContentLoaded', init);
