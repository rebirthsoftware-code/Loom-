/* ============================================================
   LOOMÉ — Uygulama mantığı
   Header/footer bileşenleri, sepet, favoriler, arama,
   ürün sayfaları ve ödeme akışı tek dosyada toplanmıştır.
   ============================================================ */

(function () {
  'use strict';

  const DATA = window.LOOME;
  const CFG = DATA.config;
  const $ = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));
  const PAGE = document.body.dataset.page || '';

  const fmt = (n) => n.toLocaleString('tr-TR') + ' ' + CFG.currency;
  const trLower = (s) => (s || '').toLocaleLowerCase('tr-TR');
  const getProduct = (id) => DATA.products.find((p) => p.id === id);

  /* ---------- Depolama ---------- */
  const store = {
    get(key, fallback) {
      try {
        const raw = localStorage.getItem(key);
        return raw === null ? fallback : JSON.parse(raw);
      } catch (e) { return fallback; }
    },
    set(key, val) {
      try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) { /* sessiz */ }
    },
    del(key) {
      try { localStorage.removeItem(key); } catch (e) { /* sessiz */ }
    },
  };

  let cart = store.get('loome_cart', []);
  let wishlist = store.get('loome_wishlist', []);
  let promo = store.get('loome_promo', null);

  /* ---------- İkon kütüphanesi ---------- */
  const ICONS = {
    bag: '<path d="M6 8h12l1.2 12.2a1.5 1.5 0 0 1-1.5 1.8H6.3a1.5 1.5 0 0 1-1.5-1.8L6 8Z"/><path d="M9 10V6a3 3 0 0 1 6 0v4"/>',
    heart: '<path d="M12 20.5C7 16.5 3.5 13.3 3.5 9.6 3.5 7 5.6 5 8.1 5c1.5 0 3 .7 3.9 2 .9-1.3 2.4-2 3.9-2 2.5 0 4.6 2 4.6 4.6 0 3.7-3.5 6.9-8.5 10.9Z"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.8-3.8"/>',
    menu: '<path d="M3 7h18M3 12h18M3 17h18"/>',
    close: '<path d="M6 6l12 12M18 6 6 18"/>',
    'arrow-right': '<path d="M4 12h16m0 0-6-6m6 6-6 6"/>',
    minus: '<path d="M5 12h14"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
    star: '<path d="m12 3 2.7 5.6 6.3.8-4.6 4.3 1.2 6.1L12 16.9 6.4 19.8l1.2-6.1L3 9.4l6.3-.8L12 3Z"/>',
    leaf: '<path d="M5 19C5 10 11 4 20 4c0 9-6 15-15 15Z"/><path d="M5 19c3-5 7-9 11-11"/>',
    truck: '<path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z"/><circle cx="7" cy="18" r="1.6"/><circle cx="17" cy="18" r="1.6"/>',
    shield: '<path d="M12 3 5 6v5c0 4.5 3 8.4 7 10 4-1.6 7-5.5 7-10V6l-7-3Z"/><path d="m9 12 2 2 4-4"/>',
    refresh: '<path d="M20 11A8 8 0 0 0 6.3 6.3L4 8.5M4 13a8 8 0 0 0 13.7 4.7l2.3-2.2"/><path d="M4 4v4.5h4.5M20 20v-4.5h-4.5"/>',
    instagram: '<rect x="3.5" y="3.5" width="17" height="17" rx="4.5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r=".9" fill="currentColor" stroke="none"/>',
    facebook: '<path d="M14.5 8.5H17V5h-2.5A4.5 4.5 0 0 0 10 9.5V12H7.5v3.5H10V21h3.5v-5.5H16l.8-3.5h-3.3V9.7c0-.7.5-1.2 1-1.2Z"/>',
    pinterest: '<path d="M12 3a9 9 0 0 0-3.4 17.3c-.1-.8-.2-2 0-2.9l1.2-5s-.3-.6-.3-1.5c0-1.4.8-2.5 1.9-2.5.9 0 1.3.7 1.3 1.5 0 .9-.6 2.2-.9 3.5-.2 1 .5 1.9 1.6 1.9 1.9 0 3.3-2 3.3-4.8 0-2.5-1.8-4.3-4.4-4.3a4.6 4.6 0 0 0-4.8 4.6c0 .9.4 1.9.8 2.4l-.3 1.2c-.1.4-.3.5-.7.3-1.3-.6-2-2.4-2-3.9 0-3.2 2.3-6.2 6.7-6.2 3.5 0 6.3 2.5 6.3 5.9 0 3.5-2.2 6.3-5.3 6.3-1 0-2-.5-2.4-1.2l-.6 2.4c-.2.9-.8 1.9-1.3 2.6A9 9 0 1 0 12 3Z"/>',
    check: '<path d="m4 12.5 5.5 5.5L20 6.5"/>',
    phone: '<path d="M5 4h4l1.5 4.5-2 1.5a12 12 0 0 0 5.5 5.5l1.5-2L20 15v4a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2Z"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 7 8.5 6 8.5-6"/>',
    pin: '<path d="M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11Z"/><circle cx="12" cy="10" r="2.5"/>',
    lock: '<rect x="5" y="11" width="14" height="9" rx="1.5"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
    sparkle: '<path d="M12 4c.6 3.8 2.2 5.4 6 6-3.8.6-5.4 2.2-6 6-.6-3.8-2.2-5.4-6-6 3.8-.6 5.4-2.2 6-6Z"/><path d="M19 14c.3 1.9 1.1 2.7 3 3-1.9.3-2.7 1.1-3 3-.3-1.9-1.1-2.7-3-3 1.9-.3 2.7-1.1 3-3Z"/>',
  };

  const icon = (name, cls) =>
    '<svg class="' + (cls || '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    (ICONS[name] || '') + '</svg>';

  /* ---------- Görsel yedeği (eksik dosyalara zarif yer tutucu) ---------- */
  const PLACEHOLDER =
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="760" viewBox="0 0 600 760">' +
      '<rect width="600" height="760" fill="#EDE6D8"/>' +
      '<text x="300" y="380" font-family="Georgia,serif" font-size="44" letter-spacing="10" fill="#9C7A4E" text-anchor="middle">LOOMÉ</text>' +
      '<path d="M240 420 Q300 445 360 420" stroke="#9C7A4E" stroke-width="3" fill="none" stroke-linecap="round"/></svg>'
    );

  window.addEventListener('error', function (e) {
    const t = e.target;
    if (t && t.tagName === 'IMG' && t.src !== PLACEHOLDER) {
      t.src = PLACEHOLDER;
    }
  }, true);

  /* ---------- Logo bileşeni ---------- */
  const logoHTML = (extraCls) =>
    '<a class="logo ' + (extraCls || '') + '" href="index.html" aria-label="LOOMÉ ana sayfa">' +
      '<span class="logo-word">LOOM<span class="logo-e">E' +
        '<svg class="logo-leaf" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4 20C4 10.5 10.5 4 20 4c0 9.5-6.5 16-16 16Z"/><path d="M4 20C7.5 14 12 9.5 17.5 6.5" stroke="#FBF9F4" stroke-width="1.4" fill="none" stroke-linecap="round"/></svg>' +
      '</span></span>' +
      '<svg class="logo-smile" viewBox="0 0 100 12" fill="none" aria-hidden="true"><path d="M4 2c14 8.5 78 8.5 92 0" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></svg>' +
    '</a>';

  /* ---------- Site iskeleti (header + footer + katmanlar) ---------- */
  const NAV_LINKS = [
    { href: 'urun.html?id=yuzen-kupa', label: 'Yüzen Kupa', match: ['urun'] },
    { href: 'urunler.html', label: 'Mağaza', match: ['urunler'] },
    { href: 'hakkimizda.html', label: 'Hikayemiz', match: ['hakkimizda'] },
    { href: 'iletisim.html', label: 'İletişim', match: ['iletisim'] },
  ];

  function navHTML() {
    return NAV_LINKS.map((l) => {
      const current = (l.match || []).includes(PAGE) ? ' aria-current="page"' : '';
      return '<a href="' + l.href + '"' + current + '>' + l.label + '</a>';
    }).join('');
  }

  function buildFrame() {
    const top =
      '<a class="skip-link" href="#icerik">İçeriğe geç</a>' +
      '<div class="announce"><strong>' + fmt(CFG.freeShippingThreshold) + '</strong> üzeri siparişlerde ücretsiz kargo · <strong>HOSGELDIN</strong> koduyla ilk siparişte %15 indirim</div>' +
      '<header class="site-header" id="siteHeader">' +
        '<div class="container header-inner">' +
          '<button class="icon-btn burger" id="burgerBtn" aria-label="Menüyü aç">' + icon('menu') + '</button>' +
          '<nav class="main-nav" aria-label="Ana menü">' + navHTML() + '</nav>' +
          '<div class="logo-slot">' + logoHTML() + '</div>' +
          '<div class="header-actions">' +
            '<button class="icon-btn" id="searchBtn" aria-label="Ara">' + icon('search') + '</button>' +
            '<a class="icon-btn" href="favoriler.html" aria-label="Favoriler">' + icon('heart') + '<span class="count-badge" id="wishCount"></span></a>' +
            '<button class="icon-btn" id="cartBtn" aria-label="Sepet">' + icon('bag') + '<span class="count-badge" id="cartCount"></span></button>' +
          '</div>' +
        '</div>' +
      '</header>' +
      '<div class="mobile-menu" id="mobileMenu" aria-hidden="true">' +
        '<div class="mobile-menu-top">' + logoHTML() +
          '<button class="icon-btn" id="mobileClose" aria-label="Menüyü kapat">' + icon('close') + '</button>' +
        '</div>' +
        '<nav aria-label="Mobil menü">' +
          NAV_LINKS.map((l) => '<a href="' + l.href + '">' + l.label + icon('arrow-right') + '</a>').join('') +
        '</nav>' +
        '<div class="mobile-menu-foot">destek@loome.com.tr · +90 (212) 000 00 00</div>' +
      '</div>';

    document.body.insertAdjacentHTML('afterbegin', top);

    const bottom =
      '<footer class="site-footer">' +
        '<div class="container">' +
          '<div class="footer-main">' +
            '<div class="footer-brand">' + logoHTML('logo--footer') +
              '<p>Sıradan anları küçük sahnelere dönüştüren, el işçiliğiyle üretilen dekoratif objeler.</p>' +
              '<div class="footer-social">' +
                '<a href="#" aria-label="Instagram">' + icon('instagram') + '</a>' +
                '<a href="#" aria-label="Facebook">' + icon('facebook') + '</a>' +
                '<a href="#" aria-label="Pinterest">' + icon('pinterest') + '</a>' +
              '</div>' +
            '</div>' +
            '<div class="footer-col"><h4>Mağaza</h4><ul>' +
              '<li><a href="urun.html?id=yuzen-kupa">Yüzen Kupa</a></li>' +
              '<li><a href="urunler.html">Tüm Ürünler</a></li>' +
              '<li><a href="sepet.html">Sepetim</a></li>' +
              '<li><a href="favoriler.html">Favorilerim</a></li>' +
            '</ul></div>' +
            '<div class="footer-col"><h4>Kurumsal</h4><ul>' +
              '<li><a href="hakkimizda.html">Hikayemiz</a></li>' +
              '<li><a href="iletisim.html">İletişim</a></li>' +
              '<li><a href="iletisim.html#sss">Sıkça Sorulan Sorular</a></li>' +
              '<li><a href="yasal.html">KVKK &amp; Gizlilik</a></li>' +
              '<li><a href="yasal.html#iade">İade &amp; Değişim</a></li>' +
            '</ul></div>' +
            '<div class="footer-col"><h4>Bize Ulaşın</h4><ul class="footer-contact">' +
              '<li>' + icon('pin') + '<span>Tasarım Atölyesi<br>İstanbul</span></li>' +
              '<li>' + icon('mail') + '<span>destek@loome.com.tr</span></li>' +
              '<li>' + icon('phone') + '<span>+90 (212) 000 00 00<br>Hafta içi 09.00 – 18.00</span></li>' +
            '</ul></div>' +
          '</div>' +
          '<div class="footer-bottom">' +
            '<span>© 2026 LOOMÉ. Tüm hakları saklıdır.</span>' +
            '<div class="payment-badges"><span>Visa</span><span>Mastercard</span><span>Troy</span><span>Havale/EFT</span></div>' +
          '</div>' +
        '</div>' +
      '</footer>' +

      '<div class="drawer-backdrop" id="drawerBackdrop"></div>' +

      '<aside class="cart-drawer" id="cartDrawer" aria-label="Sepet" aria-hidden="true">' +
        '<div class="drawer-head"><h3>Sepetiniz</h3>' +
          '<button class="icon-btn" id="drawerClose" aria-label="Sepeti kapat">' + icon('close') + '</button>' +
        '</div>' +
        '<div class="shipping-bar" id="shippingBar"></div>' +
        '<div class="drawer-items" id="drawerItems"></div>' +
        '<div class="drawer-foot" id="drawerFoot"></div>' +
      '</aside>' +

      '<div class="search-overlay" id="searchOverlay" aria-hidden="true">' +
        '<div class="container">' +
          '<div class="search-top">' +
            '<div class="search-field">' + icon('search') +
              '<input type="search" id="searchInput" placeholder="Ne aramıştınız?" aria-label="Ürün ara">' +
            '</div>' +
            '<button class="icon-btn" id="searchClose" aria-label="Aramayı kapat">' + icon('close') + '</button>' +
          '</div>' +
          '<div class="search-hint">Popüler: ' +
            ['Kupa', 'Kahve', 'Dekor', 'Hediye'].map((t) => '<button type="button" data-term="' + t + '">' + t + '</button>').join('') +
          '</div>' +
          '<div class="search-results" id="searchResults"></div>' +
        '</div>' +
      '</div>' +

      '<div class="toast-wrap" id="toastWrap"></div>';

    document.body.insertAdjacentHTML('beforeend', bottom);
  }

  /* ---------- Toast ---------- */
  function toast(msg, iconName) {
    const wrap = $('#toastWrap');
    const el = document.createElement('div');
    el.className = 'toast';
    el.innerHTML = icon(iconName || 'check') + '<span>' + msg + '</span>';
    wrap.appendChild(el);
    setTimeout(() => el.remove(), 3400);
  }

  /* ---------- Sepet ---------- */
  const cartTotalQty = () => cart.reduce((s, i) => s + i.qty, 0);
  const cartSubtotal = () => cart.reduce((s, i) => {
    const p = getProduct(i.id);
    return p ? s + p.price * i.qty : s;
  }, 0);

  function discountAmount(subtotal) {
    if (!promo || !CFG.promoCodes[promo]) return 0;
    return Math.round(subtotal * CFG.promoCodes[promo]);
  }

  function saveCart() { store.set('loome_cart', cart); }

  function addToCart(id, qty, size) {
    const p = getProduct(id);
    if (!p) return;
    qty = qty || 1;
    size = size || (p.sizes ? p.sizes[0] : null);
    const existing = cart.find((i) => i.id === id && i.size === size);
    if (existing) existing.qty += qty;
    else cart.push({ id: id, qty: qty, size: size });
    saveCart();
    renderCartUI();
    openDrawer();
  }

  function setQty(id, size, qty) {
    const item = cart.find((i) => i.id === id && i.size === size);
    if (!item) return;
    item.qty = Math.max(1, Math.min(99, qty));
    saveCart();
    renderCartUI();
    if (PAGE === 'sepet') renderCartPage();
  }

  function removeFromCart(id, size) {
    cart = cart.filter((i) => !(i.id === id && i.size === size));
    saveCart();
    renderCartUI();
    if (PAGE === 'sepet') renderCartPage();
  }

  function renderCounts() {
    const cc = $('#cartCount');
    const wc = $('#wishCount');
    const q = cartTotalQty();
    if (cc) { cc.textContent = q; cc.classList.toggle('show', q > 0); }
    if (wc) { wc.textContent = wishlist.length; wc.classList.toggle('show', wishlist.length > 0); }
  }

  function renderShippingBar() {
    const bar = $('#shippingBar');
    if (!bar) return;
    if (!cart.length) { bar.innerHTML = ''; return; }
    const sub = cartSubtotal() - discountAmount(cartSubtotal());
    const remain = CFG.freeShippingThreshold - sub;
    const pct = Math.min(100, Math.round((sub / CFG.freeShippingThreshold) * 100));
    bar.innerHTML =
      '<p>' + (remain > 0
        ? 'Ücretsiz kargoya <b>' + fmt(remain) + '</b> kaldı'
        : '<b>Tebrikler!</b> Kargonuz ücretsiz 🎉') + '</p>' +
      '<div class="shipping-track"><div class="shipping-fill" style="width:' + pct + '%"></div></div>';
  }

  function cartItemHTML(item) {
    const p = getProduct(item.id);
    if (!p) return '';
    return (
      '<div class="cart-item" data-id="' + p.id + '" data-size="' + (item.size || '') + '">' +
        '<a class="cart-item-img" href="urun.html?id=' + p.id + '"><img src="' + p.img + '" alt="' + p.name + '"></a>' +
        '<div class="cart-item-body">' +
          '<div class="ci-name">' + p.name + '</div>' +
          '<div class="ci-variant">' + p.subtitle + (item.size ? ' · ' + item.size : '') + '</div>' +
          '<div class="ci-price">' + fmt(p.price) + '</div>' +
          '<div class="cart-item-foot">' +
            '<div class="qty-stepper">' +
              '<button data-act="dec" aria-label="Azalt">' + icon('minus') + '</button>' +
              '<span class="qty-val">' + item.qty + '</span>' +
              '<button data-act="inc" aria-label="Artır">' + icon('plus') + '</button>' +
            '</div>' +
            '<button class="ci-remove" data-act="remove" aria-label="Sepetten çıkar">' + icon('trash') + '</button>' +
          '</div>' +
        '</div>' +
      '</div>'
    );
  }

  function renderDrawer() {
    const items = $('#drawerItems');
    const foot = $('#drawerFoot');
    if (!items || !foot) return;

    if (!cart.length) {
      items.innerHTML =
        '<div class="drawer-empty">' + icon('bag') +
          '<p>Sepetiniz henüz boş.<br>Sizi gülümsetecek parçalara göz atın.</p>' +
          '<a class="btn btn--dark" href="urunler.html">Alışverişe Başla</a>' +
        '</div>';
      foot.innerHTML = '';
      return;
    }

    items.innerHTML = cart.map(cartItemHTML).join('');
    const sub = cartSubtotal();
    foot.innerHTML =
      '<div class="drawer-subtotal"><span>Ara Toplam</span><b>' + fmt(sub - discountAmount(sub)) + '</b></div>' +
      '<p class="hint">Kargo ve indirimler ödeme adımında hesaplanır.</p>' +
      '<a class="btn btn--dark btn--block" href="odeme.html">Ödemeye Geç</a>' +
      '<a class="btn btn--outline btn--block" href="sepet.html">Sepeti Görüntüle</a>';
  }

  function renderCartUI() {
    renderCounts();
    renderShippingBar();
    renderDrawer();
  }

  /* ---------- Çekmece & katman kontrolü ---------- */
  let drawerOpen = false;
  let searchOpen = false;

  function openDrawer() {
    drawerOpen = true;
    $('#cartDrawer').classList.add('open');
    $('#cartDrawer').setAttribute('aria-hidden', 'false');
    $('#drawerBackdrop').classList.add('show');
    document.body.classList.add('no-scroll');
  }
  function closeDrawer() {
    drawerOpen = false;
    $('#cartDrawer').classList.remove('open');
    $('#cartDrawer').setAttribute('aria-hidden', 'true');
    $('#drawerBackdrop').classList.remove('show');
    document.body.classList.remove('no-scroll');
  }
  function openSearch() {
    searchOpen = true;
    $('#searchOverlay').classList.add('open');
    $('#searchOverlay').setAttribute('aria-hidden', 'false');
    $('#drawerBackdrop').classList.add('show');
    setTimeout(() => $('#searchInput').focus(), 250);
  }
  function closeSearch() {
    searchOpen = false;
    $('#searchOverlay').classList.remove('open');
    $('#searchOverlay').setAttribute('aria-hidden', 'true');
    if (!drawerOpen) $('#drawerBackdrop').classList.remove('show');
  }

  /* ---------- Favoriler ---------- */
  function toggleWish(id) {
    const p = getProduct(id);
    if (!p) return;
    if (wishlist.includes(id)) {
      wishlist = wishlist.filter((w) => w !== id);
      toast(p.name + ' favorilerden çıkarıldı', 'heart');
    } else {
      wishlist.push(id);
      toast(p.name + ' favorilere eklendi', 'heart');
    }
    store.set('loome_wishlist', wishlist);
    renderCounts();
    $$('.wish-btn[data-id="' + id + '"], .pdp-wish[data-id="' + id + '"]').forEach((b) =>
      b.classList.toggle('active', wishlist.includes(id))
    );
    if (PAGE === 'favoriler') renderWishlistPage();
  }

  /* ---------- Ürün kartı ---------- */
  function ratingStars(rating) {
    let out = '';
    for (let i = 0; i < 5; i++) out += icon('star');
    return out;
  }

  function productCardHTML(p, delayIndex) {
    const wished = wishlist.includes(p.id) ? ' active' : '';
    const badge = p.badge
      ? '<span class="product-badge' + (p.badge === 'İndirim' ? ' product-badge--sale' : '') + '">' + p.badge + '</span>'
      : '';
    const altImg = p.alt
      ? '<img class="img-alt" src="' + p.alt + '" alt="" loading="lazy">'
      : '';
    const price = p.oldPrice
      ? '<del>' + fmt(p.oldPrice) + '</del>' + fmt(p.price)
      : fmt(p.price);
    return (
      '<article class="product-card reveal" style="--d:' + ((delayIndex % 4) * 0.08) + 's">' +
        '<a class="product-media" href="urun.html?id=' + p.id + '" aria-label="' + p.name + ' — ' + p.subtitle + '">' +
          badge + altImg +
          '<img class="img-main" src="' + p.img + '" alt="' + p.name + ' — ' + p.subtitle + '" loading="lazy">' +
        '</a>' +
        '<button class="wish-btn' + wished + '" data-id="' + p.id + '" aria-label="Favorilere ekle">' + icon('heart') + '</button>' +
        '<button class="quick-add" data-id="' + p.id + '">Sepete Ekle — ' + fmt(p.price) + '</button>' +
        '<div class="product-info">' +
          '<h3 class="p-name"><a href="urun.html?id=' + p.id + '">' + p.name + '</a></h3>' +
          '<div class="p-sub">' + p.subtitle + '</div>' +
          '<div class="p-price">' + price + '</div>' +
        '</div>' +
      '</article>'
    );
  }

  function bindProductCards(scope) {
    $$('.quick-add', scope).forEach((btn) => {
      btn.addEventListener('click', () => addToCart(btn.dataset.id, 1));
    });
    $$('.wish-btn', scope).forEach((btn) => {
      btn.addEventListener('click', () => toggleWish(btn.dataset.id));
    });
  }

  function renderProductGrid(el, products) {
    el.innerHTML = products.map((p, i) => productCardHTML(p, i)).join('');
    bindProductCards(el);
    observeReveals(el);
  }

  /* ---------- Arama ---------- */
  function runSearch(term) {
    const box = $('#searchResults');
    const q = trLower(term.trim());
    if (!q) { box.innerHTML = ''; return; }
    const hits = DATA.products.filter((p) =>
      trLower(p.name + ' ' + p.subtitle + ' ' + p.cat + ' ' + p.desc).includes(q)
    ).slice(0, 8);
    box.innerHTML = hits.length
      ? hits.map((p) =>
          '<a class="search-result" href="urun.html?id=' + p.id + '">' +
            '<img src="' + p.img + '" alt="' + p.name + '">' +
            '<div><div class="sr-name">' + p.name + '</div>' +
            '<div class="sr-price">' + p.subtitle + ' · ' + fmt(p.price) + '</div></div>' +
          '</a>'
        ).join('')
      : '<div class="search-empty">"' + term + '" için sonuç bulamadık. Farklı bir kelime deneyin.</div>';
  }

  /* ---------- Reveal animasyonları ---------- */
  let revealObserver = null;
  function observeReveals(scope) {
    if (!('IntersectionObserver' in window)) {
      $$('.reveal', scope).forEach((el) => el.classList.add('in'));
      return;
    }
    if (!revealObserver) {
      revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add('in');
            revealObserver.unobserve(en.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    }
    $$('.reveal', scope).forEach((el) => {
      if (!el.classList.contains('in')) revealObserver.observe(el);
    });
  }

  /* ---------- Akordeon ---------- */
  function initAccordions(scope) {
    $$('.accordion-item', scope).forEach((item) => {
      const trigger = $('.accordion-trigger', item);
      const panel = $('.accordion-panel', item);
      if (!trigger || !panel) return;
      trigger.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        item.classList.toggle('open', !isOpen);
        trigger.setAttribute('aria-expanded', String(!isOpen));
        panel.style.maxHeight = isOpen ? '0' : panel.scrollHeight + 'px';
      });
    });
  }

  /* ==========================================================
     SAYFALAR
     ========================================================== */

  /* ---------- Ana sayfa ---------- */
  function initHome() {
    // Yorumlar
    const track = $('#testimonialTrack');
    const dots = $('#testimonialDots');
    if (track && dots) {
      track.innerHTML = DATA.testimonials.map((t, i) =>
        '<div class="testimonial' + (i === 0 ? ' active' : '') + '">' +
          '<div class="stars">' + ratingStars(5) + '</div>' +
          '<blockquote>“' + t.quote + '”</blockquote>' +
          '<cite><b>' + t.name + '</b> — ' + t.title + '</cite>' +
        '</div>'
      ).join('');
      dots.innerHTML = DATA.testimonials.map((t, i) =>
        '<button' + (i === 0 ? ' class="active"' : '') + ' aria-label="Yorum ' + (i + 1) + '"></button>'
      ).join('');
      let idx = 0;
      let timer = setInterval(next, 6000);
      function show(n) {
        idx = (n + DATA.testimonials.length) % DATA.testimonials.length;
        $$('.testimonial', track).forEach((el, i) => el.classList.toggle('active', i === idx));
        $$('button', dots).forEach((el, i) => el.classList.toggle('active', i === idx));
      }
      function next() { show(idx + 1); }
      $$('button', dots).forEach((b, i) => b.addEventListener('click', () => {
        clearInterval(timer);
        timer = setInterval(next, 6000);
        show(i);
      }));
    }

  }

  /* ---------- Mağaza / Ürünler ---------- */
  function initShop() {
    const grid = $('#shopGrid');
    const pills = $('#filterPills');
    const count = $('#resultCount');
    const sortSel = $('#sortSelect');
    const heading = $('#shopHeading');
    const tagline = $('#shopTagline');
    if (!grid) return;

    const params = new URLSearchParams(location.search);
    let activeCat = params.get('kategori') || 'hepsi';
    let term = params.get('arama') || '';
    let sort = 'featured';

    const CATS = [{ id: 'hepsi', name: 'Tümü' }].concat(
      DATA.collections.map((c) => ({ id: c.id, name: c.name }))
    );

    function apply() {
      let list = DATA.products.slice();
      if (activeCat !== 'hepsi') list = list.filter((p) => p.cat === activeCat);
      if (term) {
        const q = trLower(term);
        list = list.filter((p) => trLower(p.name + ' ' + p.subtitle + ' ' + p.desc).includes(q));
      }
      if (sort === 'price-asc') list.sort((a, b) => a.price - b.price);
      else if (sort === 'price-desc') list.sort((a, b) => b.price - a.price);
      else if (sort === 'rating') list.sort((a, b) => b.rating - a.rating);
      else list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));

      if (count) count.textContent = list.length + ' ürün';
      if (list.length) {
        renderProductGrid(grid, list);
        $('#shopEmpty').hidden = true;
      } else {
        grid.innerHTML = '';
        $('#shopEmpty').hidden = false;
      }

      const col = DATA.collections.find((c) => c.id === activeCat);
      if (heading) heading.textContent = term ? '“' + term + '”' : (col ? col.name : 'Mağaza');
      if (tagline) tagline.textContent = term
        ? 'Arama sonuçları'
        : (col ? col.tagline : 'Şimdilik tek bir yıldızımız var — yakında yeni parçalar geliyor.');
      document.title = (col ? col.name : 'Mağaza') + ' — LOOMÉ';
    }

    if (pills && CATS.length <= 2) {
      // Tek kategori varken filtreye gerek yok
      pills.hidden = true;
    } else if (pills) {
      pills.innerHTML = CATS.map((c) =>
        '<button class="filter-pill' + (c.id === activeCat ? ' active' : '') + '" data-cat="' + c.id + '">' + c.name + '</button>'
      ).join('');
      $$('.filter-pill', pills).forEach((b) => b.addEventListener('click', () => {
        activeCat = b.dataset.cat;
        term = '';
        $$('.filter-pill', pills).forEach((x) => x.classList.toggle('active', x === b));
        const url = activeCat === 'hepsi' ? 'urunler.html' : 'urunler.html?kategori=' + activeCat;
        history.replaceState(null, '', url);
        apply();
      }));
    }

    if (sortSel) sortSel.addEventListener('change', () => { sort = sortSel.value; apply(); });
    apply();
  }

  /* ---------- Ürün detay ---------- */
  function initProduct() {
    const params = new URLSearchParams(location.search);
    const p = getProduct(params.get('id'));
    const wrap = $('#pdpWrap');
    if (!wrap) return;
    if (!p) { location.replace('404.html'); return; }

    document.title = p.name + ' — ' + p.subtitle + ' | LOOMÉ';
    let qty = 1;
    let size = p.sizes ? p.sizes[0] : null;

    const catName = (DATA.collections.find((c) => c.id === p.cat) || {}).name || '';
    const images = p.gallery && p.gallery.length
      ? p.gallery
      : [p.img].concat(p.alt ? [p.alt] : []);

    wrap.innerHTML =
      '<nav class="breadcrumb" style="justify-content:flex-start; margin-bottom:28px;" aria-label="Sayfa yolu">' +
        '<a href="index.html">Ana Sayfa</a><span><a href="urunler.html">Mağaza</a></span>' +
        '<span><a href="urunler.html?kategori=' + p.cat + '">' + catName + '</a></span><span>' + p.name + '</span>' +
      '</nav>' +
      '<div class="pdp">' +
        '<div class="pdp-gallery">' +
          '<div class="pdp-main-img"><img id="pdpMainImg" src="' + images[0] + '" alt="' + p.name + ' — ' + p.subtitle + '"></div>' +
          (images.length > 1
            ? '<div class="pdp-thumbs">' + images.map((src, i) =>
                '<button data-src="' + src + '"' + (i === 0 ? ' class="active"' : '') + ' aria-label="Görsel ' + (i + 1) + '"><img src="' + src + '" alt=""></button>'
              ).join('') + '</div>'
            : '') +
        '</div>' +
        '<div class="pdp-info">' +
          '<span class="p-sub">' + catName + '</span>' +
          '<h1>' + p.name + '</h1>' +
          '<div class="pdp-subtitle">' + p.subtitle + '</div>' +
          '<div class="pdp-rating"><span class="stars">' + ratingStars(p.rating) + '</span><span>' + p.rating.toFixed(1) + ' · ' + p.reviews + ' değerlendirme</span></div>' +
          '<div class="pdp-price">' + (p.oldPrice ? '<del>' + fmt(p.oldPrice) + '</del>' : '') + fmt(p.price) + '</div>' +
          '<div class="pdp-tax">KDV dahildir. ' + fmt(CFG.freeShippingThreshold) + ' üzeri ücretsiz kargo.</div>' +
          '<p class="pdp-desc">' + p.desc + '</p>' +

          (p.colors ? '<div class="pdp-option"><span>Renk</span><div class="color-dots">' +
            p.colors.map((c, i) => '<button class="color-dot' + (i === 0 ? ' active' : '') + '" style="background:' + c + '" aria-label="Renk seçeneği ' + (i + 1) + '"></button>').join('') +
          '</div></div>' : '') +

          (p.sizes ? '<div class="pdp-option"><span>Beden / Boyut</span><div class="size-pills" id="sizePills">' +
            p.sizes.map((s, i) => '<button class="size-pill' + (i === 0 ? ' active' : '') + '" data-size="' + s + '">' + s + '</button>').join('') +
          '</div></div>' : '') +

          '<div class="pdp-actions">' +
            '<div class="qty-stepper">' +
              '<button id="qtyDec" aria-label="Azalt">' + icon('minus') + '</button>' +
              '<span class="qty-val" id="qtyVal">1</span>' +
              '<button id="qtyInc" aria-label="Artır">' + icon('plus') + '</button>' +
            '</div>' +
            '<button class="btn btn--dark" id="pdpAdd">Sepete Ekle — <span id="pdpAddPrice">' + fmt(p.price) + '</span></button>' +
            '<button class="pdp-wish' + (wishlist.includes(p.id) ? ' active' : '') + '" data-id="' + p.id + '" aria-label="Favorilere ekle">' + icon('heart') + '</button>' +
          '</div>' +

          '<ul class="pdp-perks">' +
            '<li>' + icon('truck') + 'Bugün sipariş verin, <b>&nbsp;2–4 iş günü&nbsp;</b> içinde kapınızda</li>' +
            '<li>' + icon('refresh') + '30 gün içinde koşulsuz iade &amp; değişim</li>' +
            '<li>' + icon('leaf') + 'Plastiksiz, geri dönüştürülebilir hediye paketi</li>' +
          '</ul>' +

          '<div class="accordion">' +
            '<div class="accordion-item open"><button class="accordion-trigger" aria-expanded="true">Ürün Detayları' + icon('plus') + '</button>' +
              '<div class="accordion-panel"><div class="accordion-panel-inner"><ul>' +
                p.details.map((d) => '<li>' + d + '</li>').join('') +
              '</ul></div></div></div>' +
            '<div class="accordion-item"><button class="accordion-trigger" aria-expanded="false">Bakım Önerileri' + icon('plus') + '</button>' +
              '<div class="accordion-panel"><div class="accordion-panel-inner"><p>' + p.care + '</p></div></div></div>' +
            '<div class="accordion-item"><button class="accordion-trigger" aria-expanded="false">Kargo &amp; İade' + icon('plus') + '</button>' +
              '<div class="accordion-panel"><div class="accordion-panel-inner"><p>Siparişleriniz 24 saat içinde özenle paketlenir ve anlaşmalı kargo ile 2–4 iş gününde teslim edilir. ' + fmt(CFG.freeShippingThreshold) + ' üzeri siparişlerde kargo ücretsizdir. Kullanılmamış ürünlerinizi 30 gün içinde ücretsiz iade edebilirsiniz.</p></div></div></div>' +
          '</div>' +
        '</div>' +
      '</div>';

    // Galeri
    $$('.pdp-thumbs button', wrap).forEach((b) => b.addEventListener('click', () => {
      $('#pdpMainImg').src = b.dataset.src;
      $$('.pdp-thumbs button', wrap).forEach((x) => x.classList.toggle('active', x === b));
    }));

    // Adet
    const qtyVal = $('#qtyVal');
    const priceEl = $('#pdpAddPrice');
    function syncQty() {
      qtyVal.textContent = qty;
      priceEl.textContent = fmt(p.price * qty);
    }
    $('#qtyDec').addEventListener('click', () => { qty = Math.max(1, qty - 1); syncQty(); });
    $('#qtyInc').addEventListener('click', () => { qty = Math.min(99, qty + 1); syncQty(); });

    // Beden
    $$('#sizePills .size-pill', wrap).forEach((b) => b.addEventListener('click', () => {
      size = b.dataset.size;
      $$('#sizePills .size-pill', wrap).forEach((x) => x.classList.toggle('active', x === b));
    }));

    // Renk (görsel amaçlı)
    $$('.color-dot', wrap).forEach((b) => b.addEventListener('click', () => {
      $$('.color-dot', wrap).forEach((x) => x.classList.toggle('active', x === b));
    }));

    $('#pdpAdd').addEventListener('click', () => addToCart(p.id, qty, size));
    $('.pdp-wish', wrap).addEventListener('click', () => toggleWish(p.id));

    initAccordions(wrap);
    const firstPanel = $('.accordion-item.open .accordion-panel', wrap);
    if (firstPanel) firstPanel.style.maxHeight = firstPanel.scrollHeight + 'px';

    // Benzer ürünler (hiç yoksa bölümü tamamen gizle)
    const relGrid = $('#relatedGrid');
    if (relGrid) {
      let rel = DATA.products.filter((x) => x.cat === p.cat && x.id !== p.id);
      if (rel.length < 4) {
        rel = rel.concat(DATA.products.filter((x) => x.cat !== p.cat && x.id !== p.id));
      }
      rel = rel.slice(0, 4);
      const relSection = $('#relatedSection');
      if (!rel.length) {
        if (relSection) relSection.hidden = true;
      } else {
        renderProductGrid(relGrid, rel);
      }
    }
  }

  /* ---------- Sepet sayfası ---------- */
  function renderCartPage() {
    const wrap = $('#cartPageWrap');
    if (!wrap) return;

    if (!cart.length) {
      wrap.innerHTML =
        '<div class="cart-empty">' + icon('bag') +
          '<h2>Sepetiniz boş</h2>' +
          '<p>Evinize zarafet katacak parçalar sizi bekliyor.</p>' +
          '<a class="btn btn--dark" href="urunler.html">Koleksiyonu Keşfet</a>' +
        '</div>';
      return;
    }

    const sub = cartSubtotal();
    const disc = discountAmount(sub);
    const shipping = (sub - disc) >= CFG.freeShippingThreshold ? 0 : CFG.shippingFee;
    const total = sub - disc + shipping;

    wrap.innerHTML =
      '<div class="cart-layout">' +
        '<div>' +
          '<div class="cart-table-head"><span>Ürün</span><span>Adet</span><span>Tutar</span><span></span></div>' +
          cart.map((item) => {
            const p = getProduct(item.id);
            if (!p) return '';
            return (
              '<div class="cart-row" data-id="' + p.id + '" data-size="' + (item.size || '') + '">' +
                '<div class="cart-item">' +
                  '<a class="cart-item-img" href="urun.html?id=' + p.id + '"><img src="' + p.img + '" alt="' + p.name + '"></a>' +
                  '<div class="cart-item-body"><div class="ci-name">' + p.name + '</div>' +
                  '<div class="ci-variant">' + p.subtitle + (item.size ? ' · ' + item.size : '') + '</div>' +
                  '<div class="ci-price">' + fmt(p.price) + '</div></div>' +
                '</div>' +
                '<div class="row-controls"><div class="qty-stepper">' +
                  '<button data-act="dec" aria-label="Azalt">' + icon('minus') + '</button>' +
                  '<span class="qty-val">' + item.qty + '</span>' +
                  '<button data-act="inc" aria-label="Artır">' + icon('plus') + '</button>' +
                '</div></div>' +
                '<div class="ci-line-price">' + fmt(p.price * item.qty) + '</div>' +
                '<button class="ci-remove" data-act="remove" aria-label="Sepetten çıkar">' + icon('trash') + '</button>' +
              '</div>'
            );
          }).join('') +
        '</div>' +
        '<aside class="summary-card">' +
          '<h3>Sipariş Özeti</h3>' +
          '<div class="summary-row"><span>Ara Toplam</span><span>' + fmt(sub) + '</span></div>' +
          (disc ? '<div class="summary-row discount"><span>İndirim (' + promo + ')</span><span>−' + fmt(disc) + '</span></div>' : '') +
          '<div class="summary-row"><span>Kargo</span><span>' + (shipping === 0 ? 'Ücretsiz' : fmt(shipping)) + '</span></div>' +
          '<div class="summary-row total"><span>Toplam</span><b>' + fmt(total) + '</b></div>' +
          '<form class="promo-form" id="promoForm">' +
            '<input type="text" id="promoInput" placeholder="İndirim kodu" aria-label="İndirim kodu" value="' + (promo || '') + '">' +
            '<button type="submit">Uygula</button>' +
          '</form>' +
          '<div class="promo-msg" id="promoMsg"></div>' +
          '<a class="btn btn--dark btn--block" href="odeme.html">Güvenli Ödemeye Geç</a>' +
          '<div class="secure-note">' + icon('lock') + '256-bit SSL ile şifrelenmiş güvenli ödeme</div>' +
        '</aside>' +
      '</div>';

    // Adet / silme olayları
    $$('.cart-row', wrap).forEach((row) => {
      const id = row.dataset.id;
      const size = row.dataset.size || null;
      const item = cart.find((i) => i.id === id && (i.size || null) === size);
      if (!item) return;
      row.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-act]');
        if (!btn) return;
        if (btn.dataset.act === 'inc') setQty(id, size, item.qty + 1);
        if (btn.dataset.act === 'dec') setQty(id, size, item.qty - 1);
        if (btn.dataset.act === 'remove') removeFromCart(id, size);
      });
    });

    // Promosyon kodu
    const form = $('#promoForm');
    const msg = $('#promoMsg');
    if (form) form.addEventListener('submit', (e) => {
      e.preventDefault();
      const code = $('#promoInput').value.trim().toUpperCase();
      if (!code) {
        promo = null;
        store.del('loome_promo');
        renderCartPage(); renderCartUI();
        return;
      }
      if (CFG.promoCodes[code]) {
        promo = code;
        store.set('loome_promo', promo);
        renderCartPage(); renderCartUI();
        const m = $('#promoMsg');
        if (m) { m.textContent = '%' + Math.round(CFG.promoCodes[code] * 100) + ' indirim uygulandı.'; m.className = 'promo-msg ok'; }
      } else {
        msg.textContent = 'Geçersiz kod. Lütfen kontrol edin.';
        msg.className = 'promo-msg err';
      }
    });
  }

  /* ---------- Ödeme ---------- */
  function initCheckout() {
    const wrap = $('#checkoutWrap');
    if (!wrap) return;

    if (!cart.length) {
      wrap.innerHTML =
        '<div class="cart-empty">' + icon('bag') +
          '<h2>Sepetiniz boş</h2><p>Ödeme adımına geçmek için önce sepetinize ürün ekleyin.</p>' +
          '<a class="btn btn--dark" href="urunler.html">Koleksiyonu Keşfet</a></div>';
      return;
    }

    const sub = cartSubtotal();
    const disc = discountAmount(sub);
    const shipping = (sub - disc) >= CFG.freeShippingThreshold ? 0 : CFG.shippingFee;
    const total = sub - disc + shipping;

    $('#checkoutItems').innerHTML = cart.map((item) => {
      const p = getProduct(item.id);
      if (!p) return '';
      return (
        '<div class="checkout-item">' +
          '<div class="co-img"><img src="' + p.img + '" alt="' + p.name + '"><span class="co-qty">' + item.qty + '</span></div>' +
          '<div><div class="co-name">' + p.name + '</div><div class="co-sub">' + p.subtitle + (item.size ? ' · ' + item.size : '') + '</div></div>' +
          '<div class="co-price">' + fmt(p.price * item.qty) + '</div>' +
        '</div>'
      );
    }).join('');

    $('#checkoutTotals').innerHTML =
      '<div class="summary-row"><span>Ara Toplam</span><span>' + fmt(sub) + '</span></div>' +
      (disc ? '<div class="summary-row discount"><span>İndirim (' + promo + ')</span><span>−' + fmt(disc) + '</span></div>' : '') +
      '<div class="summary-row"><span>Kargo</span><span>' + (shipping === 0 ? 'Ücretsiz' : fmt(shipping)) + '</span></div>' +
      '<div class="summary-row total"><span>Toplam</span><b>' + fmt(total) + '</b></div>';

    // Kart girdi maskeleri
    const cardNo = $('#cardNo');
    const cardExp = $('#cardExp');
    const cardCvc = $('#cardCvc');
    if (cardNo) cardNo.addEventListener('input', () => {
      cardNo.value = cardNo.value.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ');
    });
    if (cardExp) cardExp.addEventListener('input', () => {
      let v = cardExp.value.replace(/\D/g, '').slice(0, 4);
      if (v.length > 2) v = v.slice(0, 2) + '/' + v.slice(2);
      cardExp.value = v;
    });
    if (cardCvc) cardCvc.addEventListener('input', () => {
      cardCvc.value = cardCvc.value.replace(/\D/g, '').slice(0, 3);
    });

    const form = $('#checkoutForm');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      $$('#checkoutForm [required]').forEach((inp) => {
        const empty = !inp.value.trim();
        inp.classList.toggle('invalid', empty);
        if (empty) valid = false;
      });

      const email = $('#coEmail');
      if (email && email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        email.classList.add('invalid'); valid = false;
      }
      if (cardNo && cardNo.value.replace(/\s/g, '').length !== 16) {
        cardNo.classList.add('invalid'); valid = false;
      }
      if (cardExp && !/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardExp.value)) {
        cardExp.classList.add('invalid'); valid = false;
      }
      if (cardCvc && cardCvc.value.length !== 3) {
        cardCvc.classList.add('invalid'); valid = false;
      }

      if (!valid) {
        toast('Lütfen işaretli alanları kontrol edin', 'close');
        const firstInvalid = $('#checkoutForm .invalid');
        if (firstInvalid) firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      const orderNo = 'LM' + String(Math.floor(100000 + Math.random() * 900000));
      try { sessionStorage.setItem('loome_order', orderNo); } catch (err) { /* sessiz */ }
      cart = [];
      promo = null;
      saveCart();
      store.del('loome_promo');
      location.href = 'tesekkurler.html';
    });
  }

  /* ---------- Teşekkürler ---------- */
  function initThanks() {
    const el = $('#orderNo');
    if (!el) return;
    let no = null;
    try { no = sessionStorage.getItem('loome_order'); } catch (e) { /* sessiz */ }
    el.textContent = 'Sipariş No: ' + (no || 'LM000000');
  }

  /* ---------- Favoriler ---------- */
  function renderWishlistPage() {
    const grid = $('#wishGrid');
    const empty = $('#wishEmpty');
    if (!grid) return;
    const items = wishlist.map(getProduct).filter(Boolean);
    if (!items.length) {
      grid.innerHTML = '';
      if (empty) empty.hidden = false;
      return;
    }
    if (empty) empty.hidden = true;
    renderProductGrid(grid, items);
  }

  /* ---------- İletişim ---------- */
  function initContact() {
    const form = $('#contactForm');
    if (form) form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;
      $$('#contactForm [required]').forEach((inp) => {
        const empty = !inp.value.trim();
        inp.classList.toggle('invalid', empty);
        if (empty) valid = false;
      });
      if (!valid) return;
      form.reset();
      toast('Mesajınız alındı. En kısa sürede döneceğiz.', 'check');
    });
  }

  /* ---------- Bülten ---------- */
  function initNewsletter() {
    $$('.newsletter-form').forEach((form) => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = $('input', form);
        if (!input.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
          input.focus();
          return;
        }
        input.value = '';
        toast('Aramıza hoş geldiniz! İlk sürprizimiz e-postanızda.', 'sparkle');
      });
    });
  }

  /* ---------- Genel olaylar ---------- */
  function bindGlobal() {
    $('#cartBtn').addEventListener('click', openDrawer);
    $('#drawerClose').addEventListener('click', closeDrawer);
    $('#drawerBackdrop').addEventListener('click', () => { closeDrawer(); closeSearch(); });

    $('#searchBtn').addEventListener('click', openSearch);
    $('#searchClose').addEventListener('click', closeSearch);
    $('#searchInput').addEventListener('input', (e) => runSearch(e.target.value));
    $$('.search-hint button').forEach((b) => b.addEventListener('click', () => {
      $('#searchInput').value = b.dataset.term;
      runSearch(b.dataset.term);
    }));

    const burger = $('#burgerBtn');
    const mobileMenu = $('#mobileMenu');
    if (burger) burger.addEventListener('click', () => {
      mobileMenu.classList.add('open');
      mobileMenu.setAttribute('aria-hidden', 'false');
      document.body.classList.add('no-scroll');
    });
    $('#mobileClose').addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      mobileMenu.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('no-scroll');
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (drawerOpen) closeDrawer();
        if (searchOpen) closeSearch();
        mobileMenu.classList.remove('open');
        document.body.classList.remove('no-scroll');
      }
    });

    // Çekmece içi adet/silme — olay delegasyonu
    $('#drawerItems').addEventListener('click', (e) => {
      const btn = e.target.closest('[data-act]');
      if (!btn) return;
      const row = btn.closest('.cart-item');
      const id = row.dataset.id;
      const size = row.dataset.size || null;
      const item = cart.find((i) => i.id === id && (i.size || null) === size);
      if (!item) return;
      if (btn.dataset.act === 'inc') setQty(id, size, item.qty + 1);
      if (btn.dataset.act === 'dec') setQty(id, size, item.qty - 1);
      if (btn.dataset.act === 'remove') removeFromCart(id, size);
    });

    // Hızlı satın alma butonları (ana sayfa vb.)
    $$('[data-add]').forEach((b) => b.addEventListener('click', () => addToCart(b.dataset.add, 1)));

    // Header gölgesi
    const header = $('#siteHeader');
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 30);
    }, { passive: true });
  }

  /* ---------- Başlat ---------- */
  buildFrame();
  bindGlobal();
  renderCartUI();
  initNewsletter();

  const routes = {
    home: initHome,
    urunler: initShop,
    urun: initProduct,
    sepet: renderCartPage,
    odeme: initCheckout,
    tesekkurler: initThanks,
    favoriler: renderWishlistPage,
    iletisim: initContact,
  };
  if (routes[PAGE]) routes[PAGE]();

  initAccordions(document);
  observeReveals(document);
})();
