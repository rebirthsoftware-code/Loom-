# Instagram Reklam Seti — Berbere Web Sitesi + Online Randevu

Berber / erkek kuaförü işletmelerine **web sitesi + online randevu sistemi** satmak için
hazırlanmış görsel seti. Referans iş: **endamsince1979.com** (Endamsince Erkek Kuaför,
Zonguldak). Görseller o sitenin kendi renk ve tipografi dilinden türetildi — kömür siyahı
zemin, kor turuncusu vurgu, film greni ve tarama çizgileri.

Tasarım felsefesi: [`TASARIM-FELSEFESI.md`](./TASARIM-FELSEFESI.md)

---

## Video

| Dosya | Ölçü | Süre |
|---|---|---|
| `out/reels-film.mp4` | 1080×1920, H.264, 30 fps | 22 sn |

Reels'e doğrudan yüklenecek film. Kurgu altı bölümden oluşuyor:

| Sn | Bölüm | Ne oluyor |
|---|---|---|
| 0.0 – 3.4 | **Kanca** | `23:40` saati. "Müşterin randevu istedi. Sen uyuyordun." |
| 3.4 – 7.0 | **Problem** | Gelen DM balonu → "Görüldü 09:15" → "Müşteri gitmişti." |
| 7.0 – 9.3 | **Dönüş** | "Peki ya senin siten olsaydı?" — telefon aşağıdan yükselir |
| 9.3 – 15.1 | **Ürün** | Site kayar, **randevu ekranı** açılır, saat seçilir, onay butonu atar. Yanında sırayla 4 madde |
| 15.1 – 18.7 | **Teklif** | 10.000 ₺ üstü çizilir, 8.000 ₺ ekrana çakılır |
| 18.7 – 22.0 | **Çağrı** | "DM'den «SİTE» yaz" + örnek çalışma adresi |

En ikna edici an 11–14. saniyeler: telefonun içinde gerçekten hizmet seçilip, tarih ve saat
tıklanıp randevu oluşturuluyor. Karşındaki berber "bu sistem gerçekten çalışıyor" diye
düşünsün diye o bölüm yavaş ve okunaklı tutuldu.

**Ses:** dosyada sessiz bir ses kanalı var. Yükledikten sonra Instagram içinden trend bir
müzik ekle — hem eksik ses hissi kalmaz hem de erişime yardımcı olur. Sakin, ritmi orta
tempolu bir parça seç; kesmeler 3.4 / 7.0 / 15.1 / 18.7. saniyelerde.

**Kapak:** `out/reels-kapak.png` dosyasını kapak olarak seç (Instagram yükleme ekranında
"Kapağı düzenle" → "Galeriden ekle"). Profil ızgarasında o görünür.

## Görseller

| Dosya | Ölçü | Nerede kullanılır |
|---|---|---|
| `out/story-1.png` | 1080×1920 (9:16) | **Story** — ana teklif. Telefon maketi + 4 madde + fiyat + CTA |
| `out/story-2.png` | 1080×1920 (9:16) | **Story** — pakette ne var. story-1'den hemen sonra paylaş |
| `out/reels-kapak.png` | 1080×1920 (9:16) | **Reels kapağı.** Videonun kapak karesi olarak kullan |
| `out/feed-4x5.png` | 1080×1350 (4:5) | **Feed** gönderisi. Akışta en çok yer kaplayan oran |

Hepsi 2x çözünürlükte render alınıp Lanczos ile indirgendi — telefonda kenarlar net çıkar.

---

## Instagram güvenli alanları

Görseller bu kurallara göre kurgulandı, ama paylaşırken bilmekte fayda var:

**Story** — üstteki profil satırı ilk ~250 px'i, alttaki "mesaj gönder" çubuğu son
~230 px'i kapatır. Bu setteki tüm kritik içerik (başlık, fiyat, CTA) 250–1700 px arasında.
Story'ye **sticker veya link eklerken CTA butonunun üstünü kapatma** — link sticker'ı
görselin en üstüne veya CTA'nın hemen altına koy.

**Reels** — sağdaki buton kolonu (beğeni/yorum/paylaş) sağ ~180 px'i, alttaki açıklama +
müzik satırı son ~400 px'i kapatır. `reels-kapak.png` ve `reels-film.mp4` içeriği bu yüzden
1450 px'in üstünde bitiyor; alt bölge bilinçli olarak boş.

---

## Hazır metinler

### Feed / Reels açıklaması (caption)

> Berberim, hâlâ randevuları DM'den mi alıyorsun? 💈
>
> Müşterin gece 02:00'de aklına geldiğinde randevusunu kendi sitenden alsın —
> sen sabah uyandığında takvimin dolu olsun.
>
> Salonuna özel web sitesi + online randevu sistemi:
> ◆ Hazır şablon değil, sana özel tasarım
> ◆ 7/24 açık randevu takvimi, çakışma yok
> ◆ Randevuları tek ekrandan yönettiğin panel
> ◆ Telefon, tablet, masaüstünde kusursuz görünüm
> ◆ Google'da bulunma (SEO) kurulumu
> ◆ Alan adı + hosting 1 yıl dahil
>
> 7 günde teslim. Kurulum ücreti yok.
>
> ~~10.000 ₺~~ → Kampanya fiyatı 8.000 ₺ (%20 indirim)
> Ayda yalnızca 5 işletme alıyoruz.
>
> Örnek çalışma 👉 endamsince1979.com
> Fiyat ve detay için DM'den "SİTE" yaz.
>
> #berber #erkekkuaförü #barbershop #kuaför #randevusistemi #websitesi #zonguldak

### Story üstüne eklenecek kısa metin (sticker)

- Slide 1: `Site + randevu sistemi — 8.000 ₺` · anket sticker'ı: **"İster misin?" / Evet · Fiyat?**
- Slide 2: link sticker → `endamsince1979.com`
- Soru sticker'ı: `Salonunun adı ne? Sana özel demo hazırlayayım`

### DM'e ilk cevap şablonu

> Merhaba! 👋 Salonuna özel web sitesi + online randevu sistemi kuruyoruz.
> Örnek: endamsince1979.com
>
> Pakette: özel tasarım, 7/24 online randevu, yönetim paneli, mobil uyum,
> Google/SEO kurulumu, alan adı + hosting 1 yıl. 7 günde teslim.
>
> Normal 10.000 ₺ — bu ay kampanyalı 8.000 ₺.
> Salonunun adını yazarsan sana özel bir ön tasarım çıkarayım, ücretsiz.

---

## Düzenleme

Kaynak dosyalar `src/` altında, düz HTML + CSS. Değiştirip yeniden basmak yeterli.

```
src/
  base.css        ortak görsel sistem (renk, tipografi, zemin katmanları, telefon maketi)
  story-1.html    story — ana teklif
  story-2.html    story — paket içeriği
  reels-kapak.html reels kapağı
  reels-film.html  22 sn'lik reels filmi (zaman çizelgesi dosyanın sonundaki script'te)
  feed-4x5.html   feed gönderisi
  fonts/          Big Shoulders · Gloock · IBM Plex Mono · Work Sans (hepsi OFL)
  assets/         endamsince1979.com'dan alınan logo ve dükkân fotoğrafı
```

**Sık değişecek yerler:**

- **Fiyat** → her dosyada `10.000 ₺` ve `8.000 ₺` metinlerini değiştir. İndirim oranını
  da güncellemeyi unutma (`%20 İndirim`).
- **Çağrı** → `DM'den «SİTE» yaz` metni. Telefon numarası koyacaksan CTA'yı
  `0555 000 00 00` gibi değiştir.
- **Aciliyet** → story-1'deki `Sınırlı süre — Ayda yalnızca 5 işletme` satırı.
- **Referans iş** → başka bir berbere sattıkça `assets/` içindeki fotoğrafı ve telefon
  maketindeki metinleri (`site-h1`, `site-stats`) o salona göre değiştir; en güçlü ikna
  aracı, karşındaki berberin tanıdığı bir salonun sitesini göstermek.
- **Ajans adı** → `REBIRTH SOFTWARE` geçen satırlar.

> **Türkçe büyük harf uyarısı:** CSS `text-transform: uppercase` + `lang="tr"` kombinasyonu
> `i` harfini `İ` yapar. `Rebirth` → `REBİRTH`, `endamsince` → `ENDAMSİNCE` olur. Marka
> adları ve alan adları bu yüzden HTML'de doğrudan büyük harfle (`REBIRTH SOFTWARE`,
> `ENDAMSINCE1979.COM`) yazılı — bunlara dokunurken aynı şekilde bırak.

## Yeniden basma

```bash
cd marketing/instagram

node render.mjs                    # 4 görsel (hepsi)
node render.mjs story-1            # tek görsel

node render-video.mjs --preview    # filmden kilit kareler → out/preview/
node render-video.mjs              # 22 sn'lik MP4 (~4 dk sürer)
```

Görseller: Chromium ile 2x render alınıp Pillow ile indirgenir.
Video: `reels-film.html` içindeki `window.__seek(t)` fonksiyonu kare kare çağrılır,
660 kare doğrudan ffmpeg'e boru ile aktarılır (diske geçici kare yazılmaz).
Zamanlama gerçek zamana değil `t` değerine bağlı olduğu için render ne kadar yavaş
olursa olsun sonuç birebir aynı çıkar.

Gerekenler: Node + Playwright, Python + Pillow, libx264 destekli ffmpeg
(`pip install imageio-ffmpeg` ile gelen sürüm kullanılıyor). Yollar bu ortama göre
sabit yazılmış — başka makinede `import { chromium } from 'playwright'` ve
`FFMPEG = 'ffmpeg'` olarak değiştir.

**Kurguyu değiştirmek:** `reels-film.html` sonundaki script'te `S` nesnesi sahne
sınırlarını, `LABELS` dizisi 4 maddeyi, `CUTS` dizisi kesme anlarını tutar. Süreyi
`DUR` belirler. Bir sahneyi uzatırsan sonraki sahnelerin başlangıcını ve `DUR`'u da
kaydır.

## Lisanslar

Fontların tamamı SIL Open Font License altında; lisans metinleri `src/fonts/*-OFL.txt`
içinde. Logo ve dükkân fotoğrafı Endamsince'e ait — yalnızca bu iş için referans olarak
kullanılıyor, yeni müşteri görsellerinde kendi referansınla değiştir.
