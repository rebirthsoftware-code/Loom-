# LOOMÉ — Lüks Ev Tekstili E-Ticaret Sitesi

Doğal liflerden, el dokuması ev tekstili markası **LOOMÉ** için tasarlanmış; hızlı, zarif ve tamamen duyarlı (responsive) bir e-ticaret vitrini.

## Özellikler

- **Marka kimliğine özel tasarım** — Logodaki bronz/fildişi palet, zarif serif tipografi (Cormorant Garamond + Jost) ve yaprak motifi tüm sitede işlendi
- **Tam alışveriş akışı** — Ürün listeleme, filtreleme/sıralama, ürün detay, sepet çekmecesi, sepet sayfası, indirim kodu, ödeme formu ve sipariş onayı
- **Canlı arama** — Yazdıkça sonuç gösteren tam ekran arama katmanı
- **Favoriler** — Kalp simgesiyle kaydedilen ürünler için ayrı sayfa
- **Ücretsiz kargo çubuğu** — Sepette 1.500 ₺ hedefine ilerleme göstergesi
- **Kalıcı sepet** — Sepet ve favoriler tarayıcının yerel depolamasında saklanır
- **Erişilebilirlik** — Klavye odak halkaları, aria etiketleri, `prefers-reduced-motion` desteği
- **Bağımlılık yok** — Framework/kütüphane gerektirmez; saf HTML + CSS + JS

## Sayfalar

| Dosya | Açıklama |
|---|---|
| `index.html` | Ana sayfa (hero, koleksiyonlar, öne çıkanlar, hikaye, yorumlar, bülten) |
| `urunler.html` | Koleksiyon — kategori filtreli ürün listesi (`?kategori=banyo` vb.) |
| `urun.html` | Ürün detay (`?id=<urun-id>`) — galeri, beden/renk, akordeonlar, benzer ürünler |
| `sepet.html` | Sepet — adet güncelleme, indirim kodu (`LOOME10`, `HOSGELDIN`) |
| `odeme.html` | Ödeme formu (demo — gerçek ödeme alınmaz) |
| `tesekkurler.html` | Sipariş onay sayfası |
| `favoriler.html` | Favori ürünler |
| `hakkimizda.html`, `iletisim.html`, `yasal.html`, `404.html` | Kurumsal sayfalar |

## Çalıştırma

Statik bir sitedir; herhangi bir sunucuya atmanız yeterli. Yerelde denemek için:

```bash
cd Loom-
python3 -m http.server 8080
# http://localhost:8080
```

GitHub Pages, Netlify veya Vercel'e sürükle-bırak ile yayınlanabilir.

## Ürün ekleme / düzenleme

Tüm katalog tek dosyada: **`assets/js/data.js`**. Yeni ürün için listeye bir nesne ekleyin, görselini `assets/img/products/` klasörüne koyun:

```js
{
  id: 'benzersiz-slug',        // URL'de kullanılır
  name: 'Ürün Adı',
  subtitle: 'Kısa açıklama',
  cat: 'banyo',                // banyo | yatak | giyim | yasam
  price: 1250,                 // TL, tam sayı
  oldPrice: 1500,              // isteğe bağlı (indirim gösterimi)
  img: 'assets/img/products/gorsel.jpg',
  alt: '...',                  // isteğe bağlı ikinci görsel (hover)
  badge: 'Yeni',               // isteğe bağlı rozet
  rating: 4.8, reviews: 12,
  featured: true,              // ana sayfada göster
  desc: '...', details: ['...'], care: '...',
  sizes: ['S','M'], colors: ['#D8CBB6'],  // isteğe bağlı
}
```

Kargo eşiği, kargo ücreti ve indirim kodları da aynı dosyanın `config` bölümünde.

## Yayına almadan önce

- [ ] **Ödeme altyapısı** — `odeme.html` bir tasarım önizlemesidir; iyzico / PayTR / Stripe gibi bir sağlayıcı entegre edilmelidir (kart bilgisi hiçbir yere gönderilmez)
- [ ] **Yasal metinler** — `yasal.html` içeriği taslaktır, hukuk danışmanınızca hazırlanmalıdır
- [ ] **İçerik** — Müşteri yorumları, istatistikler ve iletişim bilgileri örnek/yer tutucudur; gerçekleriyle değiştirin
- [ ] **Görseller** — Fotoğraflar Pexels'ten alınmıştır (ticari kullanıma uygun, atıf gerektirmez); kendi ürün çekimlerinizle değiştirmeniz önerilir
- [ ] **Sosyal medya** — Footer'daki sosyal medya bağlantılarını gerçek hesaplarınıza yönlendirin
