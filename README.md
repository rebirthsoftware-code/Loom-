# LOOMÉ — Yüzen Kupa E-Ticaret Sitesi

**LOOMÉ** markasının tek ürün odaklı, lüks ve zarif e-ticaret vitrini. Şu an satışta tek ürün var: **Yüzen Kupa** (dökülen kahve dekoratif objesi). Site, yeni ürünler eklendikçe büyüyecek şekilde tasarlandı.

## Özellikler

- **Tek ürün lansman tasarımı** — Ana sayfa; fiyat, hızlı "Sepete Ekle", galeri, "nasıl havada duruyor?" anlatımı, yorumlar ve SSS ile ürünü sahneler
- **Marka kimliğine özel tasarım** — Logodaki bronz/fildişi palet, zarif serif tipografi (Cormorant Garamond + Jost) ve yaprak motifi
- **Tam alışveriş akışı** — Sepet çekmecesi, sepet sayfası, indirim kodu (`LOOME10`, `HOSGELDIN`), ödeme formu, sipariş onayı
- **Canlı arama + favoriler** — Yazdıkça sonuç gösteren arama katmanı, kalıcı favori listesi
- **Kalıcı sepet** — Sepet ve favoriler tarayıcının yerel depolamasında saklanır
- **Kendinden barındırılan fontlar** — Google Fonts bağımlılığı yok (hız + KVKK)
- **Bağımlılık yok** — Framework gerektirmez; saf HTML + CSS + JS. Her sunucuda çalışır.

## Sayfalar

| Dosya | Açıklama |
|---|---|
| `index.html` | Ana sayfa — Yüzen Kupa lansman vitrini |
| `urun.html?id=yuzen-kupa` | Ürün detay — galeri, akordeonlar, sepete ekleme |
| `urunler.html` | Mağaza — tüm ürünler (şimdilik 1) |
| `sepet.html`, `odeme.html`, `tesekkurler.html` | Sepet → ödeme → onay akışı |
| `favoriler.html` | Favori ürünler |
| `hakkimizda.html`, `iletisim.html`, `yasal.html`, `404.html` | Kurumsal sayfalar |

## Çalıştırma

Statik bir sitedir; herhangi bir barındırmaya yüklemeniz yeterli. Yerelde denemek için:

```bash
python3 -m http.server 8080
# http://localhost:8080
```

GitHub Pages, Netlify veya Vercel'e sürükle-bırak ile yayınlanabilir.

## Ürün fotoğraflarını değiştirme (önemli!)

Şu anki ürün görselleri **markaya uygun çizilmiş illüstrasyonlardır** (yer tutucu). Gerçek ürün fotoğraflarınızı çektiğinizde aynı adlarla üzerine yazmanız yeterli:

```
assets/img/products/yuzen-kupa.png        → ana görsel (dikey, ~900×1200 önerilir)
assets/img/products/yuzen-kupa-detay.png  → yakın çekim / detay
assets/img/products/yuzen-kupa-sahne.png  → masa üzerinde yaşam karesi
```

## Fiyat ve içerik düzenleme

Tüm ürün bilgisi tek dosyada: **`assets/js/data.js`** — fiyat (`price`), üstü çizili eski fiyat (`oldPrice`), açıklama, özellik listesi ve müşteri yorumları buradan güncellenir. Kargo eşiği ve indirim kodları da aynı dosyanın `config` bölümünde.

Yeni ürün eklemek için `products` listesine yeni bir nesne ekleyin; mağaza, arama, sepet ve "benzer ürünler" bölümleri otomatik uyum sağlar. Birden fazla kategori olduğunda mağaza sayfasındaki filtreler kendiliğinden görünür.

## Yayına almadan önce

- [ ] **Ödeme altyapısı** — `odeme.html` bir tasarım önizlemesidir; iyzico / PayTR / Stripe gibi bir sağlayıcı entegre edilmelidir (kart bilgisi hiçbir yere gönderilmez)
- [ ] **Ürün fotoğrafları** — İllüstrasyonları gerçek çekimlerle değiştirin (yukarıdaki bölüme bakın)
- [ ] **Yasal metinler** — `yasal.html` içeriği taslaktır, hukuk danışmanınızca hazırlanmalıdır
- [ ] **İçerik** — Müşteri yorumları, puanlar ve iletişim bilgileri örnek/yer tutucudur; gerçekleriyle değiştirin
- [ ] **Sosyal medya** — Footer'daki bağlantıları gerçek hesaplarınıza yönlendirin
