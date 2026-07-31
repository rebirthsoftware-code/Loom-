#!/usr/bin/env python3
"""
Seslendirme üretici — Microsoft Edge nöral TTS (tr-TR-AhmetNeural).

    pip install edge-tts
    python3 ses/tts-uret.py

Her replik ayrı dosyaya basılır (ses/vo/v1..v7.wav), baş/son sessizliği
kırpılır, sıkıştırılır ve -16 LUFS'a eşitlenir. Kırpma önemli: edge-tts
her dosyanın başına ve sonuna ~0.5 sn sessizlik koyuyor, kırpmazsan
kurgudaki yerleşim kayar.

Metinleri değiştirdiysen çalıştırdıktan sonra yeni süreleri not al ve
build-audio.py içindeki CUE tablosunu ona göre güncelle.
"""
import asyncio
import ssl
import subprocess
import sys
from pathlib import Path

import edge_tts
import edge_tts.communicate as _c
import edge_tts.voices as _v

HERE = Path(__file__).parent
OUT = HERE / "vo"
FFMPEG = "ffmpeg"          # imageio-ffmpeg kullanıyorsan tam yolu yaz

VOICE = "tr-TR-AhmetNeural"   # erkek, sakin. Kadın için: tr-TR-EmelNeural
RATE = "+10%"                 # reklam temposu; +0% daha ağır, +20% aceleci

# Kurumsal ortamda TLS araya giriyorsa CA paketini buraya ver, yoksa None bırak.
CA_BUNDLE = "/root/.ccr/ca-bundle.crt"

REPLIKLER = [
    (1, "Gece yarısı. Müşterin randevu istedi, sen uyuyordun."),
    (2, "Sabah gördüğünde o müşteri çoktan gitmişti."),
    (3, "Peki ya senin siten olsaydı?"),
    (4, "Müşterin siteye girer, boş saati kendisi seçer. Çakışma yok."),
    (5, "Salonuna özel site ve online randevu sistemi."),
    (6, "Normalde on bin lira. Bu ay sekiz bin."),
    (7, "Şimdi bize site yaz."),
]

TEMIZLE = (
    "silenceremove=start_periods=1:start_threshold=-48dB:start_silence=0.03,"
    "areverse,"
    "silenceremove=start_periods=1:start_threshold=-48dB:start_silence=0.03,"
    "areverse,"
    "highpass=f=90,"
    "acompressor=threshold=-20dB:ratio=3:attack=8:release=180,"
    "loudnorm=I=-16:TP=-1.5:LRA=9"
)


def sure(dosya: Path) -> float:
    çıktı = subprocess.run(
        [FFMPEG, "-hide_banner", "-i", str(dosya)], capture_output=True, text=True
    ).stderr
    ham = [s for s in çıktı.splitlines() if "Duration" in s][0]
    saat, dakika, saniye = ham.split("Duration:")[1].split(",")[0].strip().split(":")
    return int(saat) * 3600 + int(dakika) * 60 + float(saniye)


async def main() -> None:
    if CA_BUNDLE and Path(CA_BUNDLE).exists():
        ctx = ssl.create_default_context(cafile=CA_BUNDLE)
        _c._SSL_CTX = ctx
        _v._SSL_CTX = ctx

    OUT.mkdir(parents=True, exist_ok=True)
    toplam = 0.0

    for no, metin in REPLIKLER:
        ham = OUT / f"_ham{no}.mp3"
        son = OUT / f"v{no}.wav"
        await edge_tts.Communicate(metin, VOICE, rate=RATE).save(str(ham))
        subprocess.run(
            [FFMPEG, "-y", "-hide_banner", "-loglevel", "error", "-i", str(ham),
             "-af", TEMIZLE, "-ar", "48000", "-ac", "1", str(son)],
            check=True,
        )
        ham.unlink()
        d = sure(son)
        toplam += d
        print(f"v{no}  {d:5.2f}s   {metin}")

    print(f"\ntoplam konuşma: {toplam:.2f}s")
    print("Süreler değiştiyse build-audio.py içindeki CUE tablosunu güncelle.")


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except Exception as e:  # ağ / TLS sorunları burada patlar
        print(f"hata: {e}", file=sys.stderr)
        sys.exit(1)
