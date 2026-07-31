# Seslendirme senaryosu — Reels filmi

**Ses:** `tr-TR-AhmetNeural` (Microsoft Edge nöral TTS), hız `+10%`
**Ton:** sakin, emin, satış yapmaya çalışmayan. Bağırmıyor — anlatıyor.
**Toplam konuşma:** 19.8 sn · **film süresi:** 29.6 sn

Konuşmanın filme oranı bilinçli olarak düşük tutuldu. Sessizlik bırakılan yerler
görüntünün konuştuğu yerler: telefonda randevu alınırken ses susuyor, izleyici
ekranda ne olduğuna bakıyor.

---

## Replikler ve yerleşim

| # | Sn | Replik | Ekranda ne var |
|---|---|---|---|
| 1 | 0.45 | *"Gece yarısı. Müşterin randevu istedi, sen uyuyordun."* | `23:40` kutusu → "MÜŞTERİN / RANDEVU İSTEDİ." → "SEN UYUYORDUN." |
| 2 | 6.35 | *"Sabah gördüğünde o müşteri çoktan gitmişti."* | DM balonu, "Görüldü 09:15", "MÜŞTERİ GİTMİŞTİ." |
| 3 | 9.55 | *"Peki ya senin siten olsaydı?"* | "SENİN SİTEN OLSAYDI?" — telefon yükselmeye başlar |
| 4 | 12.30 | *"Müşterin siteye girer, boş saati kendisi seçer. Çakışma yok."* | Site kayar, 14:30'a dokunulur, dolu saatler üstü çizili |
| 5 | 17.40 | *"Salonuna özel site ve online randevu sistemi."* | "YÖNETİM PANELİ" maddesi + endamsince1979.com damgası |
| 6 | 21.60 | *"Normalde on bin lira. Bu ay sekiz bin."* | 10.000 ₺ çizilir → 8.000 ₺ çakılır |
| 7 | 26.70 | *"Şimdi bize site yaz."* | "DM'DEN «SİTE» YAZ" |

**Kelime–görüntü eşlemeleri** (kurgunun bel kemiği, bozmadan oynatma):

- `"sen uyuyordun"` ile turuncu satırın belirmesi aynı ana denk gelir (2.95)
- `"kendisi seçer"` derken parmak 14:30'a dokunur ve kutu turuncuya döner (14.95)
- `"Çakışma yok"` derken üstü çizili dolu saatler ekranda, hemen ardından
  buton "✓ RANDEVU ALINDI" olur (16.20)
- `"sekiz bin"` derken 8.000 ₺ ekrana çakılır (23.85)

---

## Ses efektleri

Hepsi ffmpeg ile sentezleniyor, dışarıdan dosya yok (`build-audio.py`).

| Efekt | Sn | Ne işe yarıyor |
|---|---|---|
| zemin uğultusu | 0.0 – 29.6 | Sürekli, duyulmayacak kadar kısık. Filmin "boş" hissetmesini engeller |
| savurma | 5.02 · 9.32 · 21.22 · 26.12 | Sahne kesmeleri — jilet çizgisiyle aynı anda |
| alt bas vuruş | 2.92 · 23.82 | "Sen uyuyordun." ve 8.000 ₺ çakılması |
| kaydırma | 13.58 | Site randevu ekranına kayarken |
| tık | 14.70 | Saate dokunuş |
| onay çıngırağı | 16.18 | "Randevu alındı" |

Miks -14 LUFS'a eşitlendi (Instagram'ın normalleştirme hedefi), tepe -1.0 dBTP.
Yani platformda ne kısılır ne de bozulur.

---

## Müzik

Filmde bilerek melodi yok — seslendirmenin önüne geçmesin diye. İki seçenek:

1. **Olduğu gibi yükle.** Seslendirme + efektler kendi başına yeterli, temiz durur.
2. **Instagram'dan müzik ekle.** Yükleme ekranında "Ses" → trend bir parça seç ve
   parça sesini **%15–20'ye** düşür (orijinal ses %100 kalsın). Kesmeler
   5.0 / 9.4 / 21.3 / 26.2. saniyelerde — orta tempolu, vurgulu bir parça oturur.

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
