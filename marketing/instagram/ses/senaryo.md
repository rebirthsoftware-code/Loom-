# Seslendirme senaryosu — Reels filmi

**Ses:** `tr-TR-AhmetNeural` (Microsoft Edge nöral TTS), hız `+10%`
**Ton:** sakin, emin, satış yapmaya çalışmayan. Bağırmıyor — anlatıyor.
**Toplam konuşma:** 19.8 sn · **film süresi:** 30.4 sn

Konuşmanın filme oranı bilinçli olarak düşük tutuldu. Sessizlik bırakılan yerler
görüntünün konuştuğu yerler: telefonda randevu alınırken ses susuyor, izleyici
ekranda ne olduğuna bakıyor.

---

## Replikler ve yerleşim

| # | Sn | Replik | Ekranda ne var |
|---|---|---|---|
| 1 | 0.45 | *"Gece yarısı. Müşterin randevu istedi, sen uyuyordun."* | `23:40` kutusu → "MÜŞTERİN / RANDEVU İSTEDİ." → "SEN UYUYORDUN." |
| 2 | 6.95 | *"Sabah gördüğünde o müşteri çoktan gitmişti."* | DM balonu, "Görüldü 09:15", "MÜŞTERİ GİTMİŞTİ." |
| 3 | 10.10 | *"Peki ya senin siten olsaydı?"* | "SENİN SİTEN OLSAYDI?" — telefon yükselmeye başlar |
| 4 | 12.85 | *"Müşterin siteye girer, boş saati kendisi seçer. Çakışma yok."* | Site kayar, 14:30'a dokunulur, dolu saatler üstü çizili |
| 5 | 18.00 | *"Salonuna özel site ve online randevu sistemi."* | "YÖNETİM PANELİ" maddesi + endamsince1979.com damgası |
| 6 | 22.35 | *"Normalde on bin lira. Bu ay sekiz bin."* | 10.000 ₺ çizilir → 8.000 ₺ çakılır |
| 7 | 27.35 | *"Şimdi bize site yaz."* | "DM'DEN «SİTE» YAZ" |

### Kelime–görüntü eşlemeleri

Kurgunun bel kemiği bu. Zamanlar tahminle değil, her ses dosyasının içindeki
konuşma öbekleri ölçülerek konuldu (`ffmpeg` ile 50 ms'lik pencerelerde RMS
taranıp -38 dB eşiğiyle öbek sınırları çıkarıldı). Repliklerin içinde 1–1.2 sn'lik
doğal duraklamalar var; görüntü olayları o duraklamalara değil, kelimelerin
söylendiği ana oturuyor.

| Söz | Sn | Görüntü | Sn |
|---|---|---|---|
| "Gece yarısı" | 0.45 | `23:40` kutusu belirir | 0.40 |
| "Müşterin randevu istedi" | 2.40 | "MÜŞTERİN" satırı girer | 1.95 |
| "sen uyuyordun" | 3.80 | Turuncu satır + alt bas vuruş | 3.55 |
| "boş saati" | 14.20 | Site randevu ekranına kayar | 14.15 |
| "kendisi seçer" | ~15.0 | Parmak 14:30'a dokunur, kutu turuncuya döner | 15.18 / 15.42 |
| "Çakışma yok" | 16.60 | Üstü çizili dolu saatler ekranda | — |
| (söz biter) | 17.25 | Buton "✓ RANDEVU ALINDI" olur + çıngırak | 17.35 |
| "Normalde on bin lira" | 22.35 | 10.000 ₺ belirir | 22.35 |
| (söz biter) | 23.50 | Üstü turuncu çizgiyle çizilir | 23.60 |
| **"sekiz bin"** | **25.05** | **8.000 ₺ ekrana çakılır + alt bas vuruş** | **25.05** |

---

## Ses efektleri

Hepsi ffmpeg ile sentezleniyor, dışarıdan dosya yok (`build-audio.py`).

| Efekt | Sn | Ne işe yarıyor |
|---|---|---|
| zemin uğultusu | 0.0 – 30.4 | Sürekli, duyulmayacak kadar kısık. Filmin "boş" hissetmesini engeller |
| savurma | 5.47 · 9.87 · 21.82 · 26.87 | Sahne kesmeleri — jilet çizgisiyle aynı anda |
| alt bas vuruş | 3.50 · 25.02 | "Sen uyuyordun." ve 8.000 ₺ çakılması |
| kaydırma | 14.13 | Site randevu ekranına kayarken |
| tık | 15.18 | Saate dokunuş |
| onay çıngırağı | 17.33 | "Randevu alındı" |

Miks -14 LUFS'a eşitlendi (Instagram'ın normalleştirme hedefi), tepe -1.0 dBTP.
Yani platformda ne kısılır ne de bozulur.

---

## Müzik

Filmde bilerek melodi yok — seslendirmenin önüne geçmesin diye. İki seçenek:

1. **Olduğu gibi yükle.** Seslendirme + efektler kendi başına yeterli, temiz durur.
2. **Instagram'dan müzik ekle.** Yükleme ekranında "Ses" → trend bir parça seç ve
   parça sesini **%15–20'ye** düşür (orijinal ses %100 kalsın). Kesmeler
   5.55 / 9.95 / 21.90 / 26.95. saniyelerde — orta tempolu, vurgulu bir parça oturur.

İkinci seçenek erişime yardım eder ama seslendirmeyi bastırmamaya dikkat et.

---

## Yeniden üretme

```bash
pip install edge-tts
python3 ses/tts-uret.py      # replikleri yeniden bas, süreleri yazdırır
python3 build-audio.py       # miksle ve videoya göm
```

Metni değiştirdiysen `tts-uret.py` yeni süreleri yazdırır; `build-audio.py`
içindeki `KONUSMA` tablosunda başlangıç saniyelerini, gerekirse
`src/reels-film.html` içindeki sahne sınırlarını ona göre kaydır.

Kadın ses istersen `tts-uret.py` içinde `VOICE = "tr-TR-EmelNeural"` yap.
Kendi sesinle okumak istersen replikleri aynı isimlerle (`ses/vo/v1.wav` …)
48 kHz mono kaydet — `build-audio.py` hiçbir değişiklik istemeden çalışır.
