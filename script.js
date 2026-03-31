// STATE MANAGEMENT
const State = {
  cart: JSON.parse(localStorage.getItem('stallcart_cart')) || [],
  orders: JSON.parse(localStorage.getItem('stallcart_orders')) || [],
  user: JSON.parse(localStorage.getItem('stallcart_user')) || null,

  save: function() {
    localStorage.setItem('stallcart_cart', JSON.stringify(this.cart));
    localStorage.setItem('stallcart_orders', JSON.stringify(this.orders));
    localStorage.setItem('stallcart_user', JSON.stringify(this.user));
    updateNavCounts();
  },
  
  addToCart: function(product, qty = 1) {
    const existing = this.cart.find(x => x.id === product.id);
    if(existing) {
      existing.qty += parseInt(qty);
    } else {
      this.cart.push({...product, qty: parseInt(qty)});
    }
    this.save();
    showToast("Added to Cart!");
  },

  updateQty: function(id, qty) {
    if(qty <= 0) {
      this.cart = this.cart.filter(x => x.id !== id);
    } else {
      const item = this.cart.find(x => x.id === id);
      if(item) item.qty = parseInt(qty);
    }
    this.save();
    if(location.hash === '#cart') renderCart();
    if(location.hash === '#checkout') renderCheckout();
  },
  
  getCartTotal: function() {
    return this.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  },

  clearCart: function() {
    this.cart = [];
    this.save();
  }
};

// UTILS
function showToast(msg) {
  const container = document.getElementById('toast-container');
  const t = document.createElement('div');
  t.className = 'toast';
  t.innerText = msg;
  container.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}

function updateNavCounts() {
  document.getElementById('nav-cart-count').innerText = State.cart.reduce((s, x) => s + x.qty, 0);
  const authLink = document.getElementById('nav-auth-link');
  if(State.user) {
    authLink.innerHTML = `<i class="fa-regular fa-user user-icon-accent"></i><span class="action-text">${State.user.name}</span>`;
  } else {
    authLink.innerHTML = `<i class="fa-regular fa-user"></i><span class="action-text">Sign In</span>`;
  }
}

function renderProductCard(p) {
  return `
    <div class="product-card" onclick="location.hash='#product/${p.id}'" style="cursor:pointer">
      <img src="${p.image}" alt="${p.title}">
      <h3>${p.title}</h3>
      <div class="price">₹${p.price.toLocaleString('en-IN')}</div>
      <button class="btn btn-orange" onclick="event.stopPropagation(); State.addToCart(DB.getProductById(${p.id}))">Add to Cart</button>
    </div>
  `;
}

// VIEWS
const app = document.getElementById('app-content');

function renderHome() {
  const featProducts = [...DB.getProducts().filter(p => p.isFeatured)].slice(0, 8); // Grab top 8 featured

  app.innerHTML = `
    <div class="hero-modern">
      <h1>Trends. Deals, Everything.</h1>
      <div class="hero-buttons">
        <button class="btn btn-orange" onclick="location.hash='#cat/women'">Shop Now</button>
        <button class="btn btn-outline" style="background:white" onclick="location.hash='#cat/men'">Explore Products</button>
      </div>
      <div class="hero-image-container">
        <!-- Modern clear shopping image -->
        <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80" alt="Shopping Trends">
      </div>
    </div>

    <div class="container">
      <h2 class="section-title">Shop by Categories</h2>
      <div class="categories-grid">
        <div class="cat-pill" onclick="location.hash='#cat/women'">
          <img src="https://images.unsplash.com/photo-1543163521-1bf539c55dd2?ixlib=rb-4.0.3&w=200" alt="Fashion">
          <span>Fashion</span>
        </div>
        <div class="cat-pill" onclick="location.hash='#cat/electronics'">
          <img src="https://images.unsplash.com/photo-1498049794561-7780e7231661?ixlib=rb-4.0.3&w=200" alt="Electronics">
          <span>Electronics</span>
        </div>
        <div class="cat-pill" onclick="location.hash='#cat/home'">
          <img src="https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?ixlib=rb-4.0.3&w=200" alt="Home">
          <span>Home & Kitchen</span>
        </div>
        <div class="cat-pill" onclick="location.hash='#cat/beauty'">
          <img src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?ixlib=rb-4.0.3&w=200" alt="Beauty">
          <span>Beauty</span>
        </div>
        <div class="cat-pill" onclick="location.hash='#cat/accessories'">
          <img src="https://images.unsplash.com/photo-1620843437120-13f57ab02cbd?ixlib=rb-4.0.3&w=200" alt="Accessories">
          <span>Accessories</span>
        </div>
      </div>

      <h2 class="section-title">Trending Now</h2>
      <div class="trending-tabs">
        <span class="active">Best Deals</span> | <span>Top Rated</span> | <span>New Arrivals</span>
      </div>
      
      <div class="product-grid">
        ${featProducts.map(p => renderProductCard(p)).join('')}
      </div>

      <h2 class="section-title" style="margin-top:80px">Why Shop With Us?</h2>
      <div class="features-strip">
        <div class="feature-item">
          <div class="icon-circle"><i class="fa-solid fa-box-open"></i></div>
          <span>Wide Range of Products</span>
        </div>
        <div class="feature-item">
          <div class="icon-circle"><i class="fa-solid fa-tags"></i></div>
          <span>Affordable Prices</span>
        </div>
        <div class="feature-item">
          <div class="icon-circle"><i class="fa-solid fa-truck-fast"></i></div>
          <span>Fast & Safe Delivery</span>
        </div>
        <div class="feature-item">
          <div class="icon-circle"><i class="fa-solid fa-rotate-left"></i></div>
          <span>Easy Returns</span>
        </div>
      </div>

      <div class="newsletter-section">
        <h2>About StallCart</h2>
        <p>Your one-stop destination for the latest trends, amazing deals, and everything you need. Subscribe to our newsletter to receive the best offers directly in your inbox.</p>
        <div class="newsletter-form">
          <input type="email" placeholder="Enter your email">
          <button class="btn btn-blue" onclick="showToast('Subscribed Successfully!')">Subscribe</button>
        </div>
      </div>
    </div>
  `;
}

function renderCategory(cat) {
  let products = DB.getProducts();
  let title = "All Products";
  if(cat === 'women') { products = products.filter(p => p.category === 'women'); title = "Women's Fashion"; }
  if(cat === 'men') { products = products.filter(p => p.category === 'men'); title = "Men's Fashion"; }
  if(cat === 'electronics') { products = products.filter(p => p.category === 'electronics'); title = "Electronics"; }

  app.innerHTML = `
    <div class="container page-container">
      <h2 class="section-title" style="margin-top:0">${title}</h2>
      <p style="text-align:center; color:var(--text-light); margin-bottom:40px;">Showing ${products.length} products</p>
      <div class="product-grid" style="margin-bottom:40px">
        ${products.length ? products.map(p => renderProductCard(p)).join('') : '<p style="text-align:center;width:100%">No products found.</p>'}
      </div>
    </div>
  `;
}

function renderSearch(q) {
  const query = decodeURIComponent(q);
  const products = DB.search(query);
  app.innerHTML = `
    <div class="container page-container">
      <h2 class="section-title" style="margin-top:0">Search results for "${query}"</h2>
      <p style="text-align:center; color:var(--text-light); margin-bottom:40px;">Found ${products.length} products</p>
      <div class="product-grid" style="margin-bottom:40px">
        ${products.length ? products.map(p => renderProductCard(p)).join('') : '<p style="text-align:center;width:100%">No products found.</p>'}
      </div>
    </div>
  `;
}

function renderProduct(id) {
  const p = DB.getProductById(id);
  if(!p) { app.innerHTML = `<div class="container page-container"><h1>Product not found</h1></div>`; return; }
  
  app.innerHTML = `
    <div class="container page-container">
      <div class="dp-flex">
        <div class="dp-image">
          <img src="${p.image}" alt="${p.title}">
        </div>
        <div class="dp-info">
          <h1>${p.title}</h1>
          <div style="font-size:32px; color:var(--primary-orange); font-weight:bold; margin-bottom:20px;">
            ₹${p.price.toLocaleString('en-IN')}
          </div>
          <p style="color:var(--text-light); margin-bottom:30px; font-size:16px;">${p.description}</p>
          
          <div style="display:flex; gap:15px; margin-bottom:30px;">
            <select id="quick-qty" style="padding:10px; border-radius:8px; border:1px solid #ccc; outline:none; font-size:16px;">
              <option value="1">Qty: 1</option><option value="2">Qty: 2</option><option value="3">Qty: 3</option>
            </select>
            <button class="btn btn-orange" style="flex:1" onclick="State.addToCart(DB.getProductById(${p.id}), document.getElementById('quick-qty').value.replace('Qty: ',''))">Add to Cart</button>
          </div>
          
          <div style="background:#f8fafc; padding:20px; border-radius:8px;">
            <p style="margin-bottom:10px;"><i class="fa-solid fa-truck" style="color:var(--secondary-blue); width:25px;"></i> Free, Fast Delivery</p>
            <p><i class="fa-solid fa-shield-halved" style="color:var(--secondary-blue); width:25px;"></i> Safe & Secure Payments</p>
          </div>
        </div>
      </div>
      
      <h2 class="section-title">Similar Items</h2>
      <div class="product-grid" style="margin-bottom:40px">
        ${DB.getRelatedProducts(p.category, 4).map(rp => renderProductCard(rp)).join('')}
      </div>
    </div>
  `;
}

function renderCart() {
  if(State.cart.length === 0) {
    app.innerHTML = `
      <div class="container page-container" style="text-align:center">
        <img src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png" style="width:150px; opacity:0.5; margin-bottom:20px;">
        <h2 style="color:var(--secondary-blue); margin-bottom:15px;">Your Cart is Empty!</h2>
        <p style="color:var(--text-light); margin-bottom:30px;">Seems like you haven't added anything to your cart yet.</p>
        <button class="btn btn-orange" onclick="location.hash='#home'">Start Shopping</button>
      </div>`;
    return;
  }

  const itemsHtml = State.cart.map(item => `
    <div class="cart-row">
      <img src="${item.image}" alt="${item.title}" onclick="location.hash='#product/${item.id}'" style="cursor:pointer">
      <div class="cart-row-details">
        <h3 onclick="location.hash='#product/${item.id}'" style="cursor:pointer; font-size:18px;">${item.title}</h3>
        <p style="color:var(--primary-orange); font-size:20px; font-weight:bold; margin-bottom:15px;">₹${(item.price * item.qty).toLocaleString('en-IN')}</p>
        <div style="display:flex; align-items:center; gap:15px;">
          <select style="padding:5px 10px; border-radius:6px; border:1px solid #ccc; outline:none;" onchange="State.updateQty(${item.id}, this.value)">
            ${[0,1,2,3,4,5,6,7,8,9,10].map(n => `<option value="${n}" ${item.qty == n ? 'selected' : ''}>${n===0?'0 (Remove)':n}</option>`).join('')}
          </select>
          <button class="btn btn-outline" style="padding:5px 15px; font-size:13px;" onclick="State.updateQty(${item.id}, 0)">Remove</button>
        </div>
      </div>
    </div>
  `).join('');

  app.innerHTML = `
    <div class="container page-container">
      <h2 class="section-title" style="margin-top:0">Shopping Cart</h2>
      <div class="checkout-grid">
        <div class="cart-items-wrapper">
          ${itemsHtml}
        </div>
        <div class="cart-sidebar">
          <h3 style="color:var(--secondary-blue); margin-bottom:20px; font-size:22px;">Order Summary</h3>
          <div style="display:flex; justify-content:space-between; margin-bottom:15px; font-size:16px;">
            <span>Subtotal (${State.cart.reduce((s,x)=>s+x.qty,0)} items)</span>
            <span style="font-weight:bold;">₹${State.getCartTotal().toLocaleString('en-IN')}</span>
          </div>
          <div style="display:flex; justify-content:space-between; margin-bottom:20px; font-size:16px; padding-bottom:20px; border-bottom:1px solid #ddd;">
            <span>Delivery Charges</span>
            <span style="color:green; font-weight:bold;">FREE</span>
          </div>
          <div style="display:flex; justify-content:space-between; margin-bottom:30px; font-size:20px; font-weight:bold; color:var(--primary-orange);">
            <span>Total Value</span>
            <span>₹${State.getCartTotal().toLocaleString('en-IN')}</span>
          </div>
          <button class="btn btn-orange" style="width:100%; font-size:18px; padding:15px;" onclick="location.hash='#checkout'">Proceed to Checkout</button>
        </div>
      </div>
    </div>
  `;
}

function renderCheckout() {
  if(State.cart.length === 0) { location.hash = '#cart'; return; }
  if(!State.user) { location.hash = '#account'; showToast("Please login before checkout!"); return; }

  app.innerHTML = `
    <div class="container page-container">
      <h2 class="section-title" style="margin-top:0">Secure Checkout</h2>
      
      <form id="checkout-form" onsubmit="handleCheckout(event)">
        <div class="checkout-grid">
          <div>
            <div style="background:#f8fafc; padding:30px; border-radius:var(--radius); margin-bottom:30px;">
              <h3 style="color:var(--secondary-blue); margin-bottom:20px; font-size:20px;">1. Shipping Address</h3>
              <div class="form-group">
                <label>Full Name</label>
                <input type="text" value="${State.user.name}" required>
              </div>
              <div style="display:flex; gap:20px;">
                <div class="form-group" style="flex:1">
                  <label>Pincode</label>
                  <input type="text" required placeholder="6 digits">
                </div>
                <div class="form-group" style="flex:1">
                  <label>City</label>
                  <input type="text" required>
                </div>
              </div>
              <div class="form-group">
                <label>Full Address</label>
                <input type="text" required>
              </div>
            </div>

            <div style="background:#f8fafc; padding:30px; border-radius:var(--radius);">
              <h3 style="color:var(--secondary-blue); margin-bottom:20px; font-size:20px;">2. Payment Method</h3>
              <div class="form-group">
                <label style="display:flex; align-items:center; gap:10px; cursor:pointer; background:white; padding:15px; border-radius:8px; border:1px solid var(--border-color); font-weight:normal;">
                  <input type="radio" name="payment" value="cod" checked style="width:auto"> Cash on Delivery (COD)
                </label>
              </div>
              <div class="form-group">
                <label style="display:flex; align-items:center; gap:10px; cursor:pointer; background:white; padding:15px; border-radius:8px; border:1px solid var(--border-color); font-weight:normal;">
                  <input type="radio" name="payment" value="upi" style="width:auto"> UPI (GPay, PhonePe)
                </label>
              </div>
            </div>
          </div>

          <div class="cart-sidebar" style="margin-top:0;">
            <h3 style="color:var(--secondary-blue); margin-bottom:20px; font-size:20px;">Order Summary</h3>
            ${State.cart.map(item => `
              <div style="display:flex; justify-content:space-between; margin-bottom:10px; font-size:14px;">
                <span style="color:var(--text-light); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; max-width:70%;">${item.qty}x ${item.title}</span>
                <span style="font-weight:500;">₹${(item.price*item.qty).toLocaleString('en-IN')}</span>
              </div>
            `).join('')}
            <div style="border-top:1px solid #ddd; margin:20px 0;"></div>
            <div style="display:flex; justify-content:space-between; margin-bottom:30px; font-size:22px; font-weight:bold; color:var(--primary-orange);">
              <span>Total to Pay</span>
              <span>₹${State.getCartTotal().toLocaleString('en-IN')}</span>
            </div>
            <button type="submit" class="btn btn-orange" style="width:100%; font-size:18px; padding:15px;">Place Order Securely</button>
          </div>
        </div>
      </form>
    </div>
  `;
}

window.handleCheckout = function(e) {
  e.preventDefault();
  const trackId = 'STC-' + Math.floor(Math.random() * 90000000 + 10000000);
  const d = new Date();
  d.setDate(d.getDate() + 3);
  
  State.orders.push({
    id: trackId,
    date: new Date().toLocaleDateString(),
    total: State.getCartTotal(),
    items: [...State.cart],
    delivery: d.toLocaleDateString()
  });
  
  State.clearCart();
  
  app.innerHTML = `
    <div class="container page-container" style="text-align:center;">
      <i class="fa-solid fa-circle-check" style="font-size:80px; color:#10b981; margin-bottom:30px;"></i>
      <h1 style="color:var(--secondary-blue); margin-bottom:20px;">Order Placed Successfully!</h1>
      <p style="font-size:18px; margin-bottom:10px; color:var(--text-light);">Thank you for shopping with StallCart.</p>
      <div style="background:#f8fafc; padding:30px; border-radius:12px; display:inline-block; text-align:left; margin:30px 0;">
        <p style="font-size:16px; margin-bottom:10px;"><strong>Order ID:</strong> ${trackId}</p>
        <p style="font-size:16px;"><strong>Estimated Delivery:</strong> ${d.toLocaleDateString()}</p>
      </div>
      <br>
      <button class="btn btn-orange" onclick="location.hash='#account/orders'">Track Your Order</button>
    </div>
  `;
}

function renderAccount() {
  if(!State.user) {
    app.innerHTML = `
      <div class="auth-box">
        <h1>Welcome Back</h1>
        <p style="color:var(--text-light); margin-bottom:30px;">Sign in to access your orders and account.</p>
        <form onsubmit="handleLogin(event)">
          <div class="form-group" style="text-align:left;">
            <label>Email Address</label>
            <input type="email" id="login-email" required placeholder="you@example.com">
          </div>
          <div class="form-group" style="text-align:left; margin-bottom:30px;">
            <label>Password</label>
            <input type="password" id="login-pwd" required placeholder="••••••••">
          </div>
          <button type="submit" class="btn btn-orange" style="width:100%; font-size:16px; padding:12px;">Sign In</button>
        </form>
        <p style="font-size:14px; margin-top:30px; color:var(--text-light);">New to StallCart? <a href="#" onclick="alert('Mocked: Just sign in with anything!');" style="font-weight:bold;">Create an account</a></p>
      </div>
    `;
    return;
  }

  app.innerHTML = `
    <div class="container page-container">
      <h2 class="section-title" style="margin-top:0">My Account</h2>
      <p style="text-align:center; font-size:18px; margin-bottom:40px;">Hello, <strong>${State.user.name}</strong>!</p>
      
      <div style="display:flex; gap:30px; justify-content:center; flex-wrap:wrap;">
        <div style="background:#f8fafc; padding:30px; border-radius:var(--radius); width:300px; text-align:center; cursor:pointer; border:1px solid var(--border-color); transition:all 0.2s;" onclick="location.hash='#account/orders'" onmouseover="this.style.borderColor='var(--primary-orange)'" onmouseout="this.style.borderColor='var(--border-color)'">
          <i class="fa-solid fa-box-open" style="font-size:40px; color:var(--secondary-blue); margin-bottom:20px;"></i>
          <h3 style="color:var(--secondary-blue); margin-bottom:10px;">My Orders</h3>
          <p style="color:var(--text-light); font-size:14px;">Track packages, return items, or buy again.</p>
        </div>
        <div style="background:#f8fafc; padding:30px; border-radius:var(--radius); width:300px; text-align:center; cursor:pointer; border:1px solid var(--border-color); transition:all 0.2s;" onclick="State.user=null; State.save(); location.hash='#home'" onmouseover="this.style.borderColor='red'" onmouseout="this.style.borderColor='var(--border-color)'">
          <i class="fa-solid fa-arrow-right-from-bracket" style="font-size:40px; color:#e3342f; margin-bottom:20px;"></i>
          <h3 style="color:#e3342f; margin-bottom:10px;">Sign Out</h3>
          <p style="color:var(--text-light); font-size:14px;">Log out safely from your account.</p>
        </div>
      </div>
    </div>
  `;
}

function renderOrders() {
  if(!State.user) { location.hash = '#account'; return; }
  
  const ordersHtml = State.orders.length ? State.orders.map(o => `
    <div style="background:white; border:1px solid var(--border-color); border-radius:var(--radius); margin-bottom:30px; overflow:hidden; box-shadow:var(--shadow-sm);">
      <div style="background:#f8fafc; padding:20px; display:flex; justify-content:space-between; flex-wrap:wrap; gap:20px; border-bottom:1px solid var(--border-color);">
        <div><span style="color:var(--text-light); font-size:12px; display:block;">ORDER PLACED</span><strong>${o.date}</strong></div>
        <div><span style="color:var(--text-light); font-size:12px; display:block;">TOTAL</span><strong>₹${o.total.toLocaleString('en-IN')}</strong></div>
        <div><span style="color:var(--text-light); font-size:12px; display:block;">ORDER #</span><strong>${o.id}</strong></div>
      </div>
      <div style="padding:30px;">
        <h3 style="color:#10b981; margin-bottom:20px;"><i class="fa-solid fa-truck-fast"></i> Arriving on ${o.delivery}</h3>
        ${o.items.map(item => `
          <div style="display:flex; gap:20px; margin-bottom:20px; align-items:center;">
            <img src="${item.image}" style="width:80px; height:80px; object-fit:contain; border-radius:8px; border:1px solid #eee; padding:5px;" alt="">
            <div style="flex:1;">
              <a href="#product/${item.id}" style="color:var(--secondary-blue); font-weight:600; font-size:16px;">${item.title}</a>
              <p style="color:var(--text-light); font-size:14px; margin-top:5px;">Qty: ${item.qty}</p>
            </div>
            <div>
              <button class="btn btn-outline">Track Item</button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('') : '<div style="text-align:center; padding:60px 0;"><i class="fa-solid fa-box-open" style="font-size:60px; color:#ccc; margin-bottom:20px;"></i><h3 style="color:var(--secondary-blue);">No Orders Yet</h3><p style="color:var(--text-light); margin-top:10px;">Looks like you haven\'t made your choice yet.</p></div>';

  app.innerHTML = `
    <div class="container page-container">
      <div style="display:flex; align-items:center; gap:10px; margin-bottom:30px; font-size:14px;">
        <a href="#account" style="color:var(--text-light)">My Account</a> 
        <i class="fa-solid fa-chevron-right" style="color:#ccc; font-size:10px;"></i> 
        <span style="color:var(--primary-orange); font-weight:500;">Your Orders</span>
      </div>
      <h2 class="section-title" style="margin-top:0;">Your Orders</h2>
      <div style="max-width:1000px; margin:0 auto;">
        ${ordersHtml}
      </div>
    </div>
  `;
}

window.handleLogin = function(e) {
  e.preventDefault();
  const em = document.getElementById('login-email').value;
  State.user = { email: em, name: em.split('@')[0] };
  State.save();
  location.hash = '#home';
}

// ROUTER
function router() {
  const hash = window.location.hash.substring(1) || 'home';
  window.scrollTo(0,0);
  
  if(hash === 'home') renderHome();
  else if(hash === 'cart') renderCart();
  else if(hash === 'checkout') renderCheckout();
  else if(hash === 'account') renderAccount();
  else if(hash === 'account/orders') renderOrders();
  else if(hash.startsWith('cat/')) {
    const cat = hash.split('/')[1];
    renderCategory(cat);
  }
  else if(hash.startsWith('product/')) {
    renderProduct(hash.split('/')[1]);
  }
  else if(hash.startsWith('search?q=')) {
    renderSearch(hash.split('=')[1]);
  }
}

// INIT
window.addEventListener('hashchange', router);
document.getElementById('search-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const q = document.getElementById('search-input').value;
  if(q) location.hash = `#search?q=${encodeURIComponent(q)}`;
});

updateNavCounts();
router();
