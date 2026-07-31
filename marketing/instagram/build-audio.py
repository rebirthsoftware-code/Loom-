#!/usr/bin/env python3
"""
Ses kurgusu — seslendirme + efektleri karıştırır ve videoya gömer.

    python3 build-audio.py            → out/reels-film-sesli.mp4

Girdi:  out/reels-film.mp4  (sessiz kurgu, render-video.mjs üretir)
        ses/vo/v1..v7.wav   (seslendirme, ses/tts-uret.py üretir)

Efektler burada ffmpeg ile sentezlenir — dışarıdan ses dosyası gerekmez.
CUE tablosundaki saniyeler reels-film.html içindeki zaman çizelgesiyle
birebir eşleşir; birini değiştirirsen diğerini de değiştir.
"""
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

HERE = Path(__file__).parent
VIDEO = HERE / "out" / "reels-film.mp4"
VO = HERE / "ses" / "vo"
DEST = HERE / "out" / "reels-film-sesli.mp4"

FFMPEG = "/usr/local/lib/python3.11/dist-packages/imageio_ffmpeg/binaries/ffmpeg-linux-x86_64-v7.0.2"
if not Path(FFMPEG).exists():
    FFMPEG = shutil.which("ffmpeg") or "ffmpeg"

SURE = 29.6          # kurgunun toplam süresi (reels-film.html içindeki DUR)
SR = 48000

# --------------------------------------------------------------------------
# CUE — ne, kaçıncı saniyede
# --------------------------------------------------------------------------
KONUSMA = [
    ("v1.wav",  0.45),   # "Gece yarısı. Müşterin randevu istedi, sen uyuyordun."
    ("v2.wav",  6.35),   # "Sabah gördüğünde o müşteri çoktan gitmişti."
    ("v3.wav",  9.55),   # "Peki ya senin siten olsaydı?"
    ("v4.wav", 12.30),   # "Müşterin siteye girer, boş saati kendisi seçer. Çakışma yok."
    ("v5.wav", 17.40),   # "Salonuna özel site ve online randevu sistemi."
    ("v6.wav", 21.60),   # "Normalde on bin lira. Bu ay sekiz bin."
    ("v7.wav", 26.70),   # "Şimdi bize site yaz."
]

EFEKT = [
    ("zemin",  0.00),                                        # sürekli dip doku
    ("savur",  5.02), ("savur", 9.32),                       # sahne kesmeleri
    ("savur", 21.22), ("savur", 26.12),
    ("vurus",  2.92),                                        # "SEN UYUYORDUN."
    ("vurus", 23.82),                                        # 8.000 ₺ ekrana çakılır
    ("kaydir", 13.58),                                       # site randevu ekranına kayar
    ("tik",   14.70),                                        # saate dokunuş
    ("onay",  16.18),                                        # "Randevu alındı"
]

# --------------------------------------------------------------------------
# Efekt sentezi
# --------------------------------------------------------------------------
def uret(ad: str, klasor: Path) -> Path:
    """Efekti ffmpeg ile sentezleyip wav olarak yazar."""
    hedef = klasor / f"{ad}.wav"

    if ad == "zemin":
        # derin uğultu + çok hafif 55 Hz temel — filme ağırlık verir, duyulmaz
        cmd = [
            "-f", "lavfi", "-i", f"anoisesrc=color=brown:duration={SURE}:sample_rate={SR}:amplitude=0.9",
            "-f", "lavfi", "-i", f"sine=frequency=55:duration={SURE}:sample_rate={SR}",
            "-filter_complex",
            "[0]lowpass=f=190,volume=0.55[n];[1]volume=0.10[s];"
            "[n][s]amix=inputs=2:normalize=0,tremolo=f=0.15:d=0.30,"
            f"afade=t=in:d=1.8,afade=t=out:st={SURE - 1.6:.2f}:d=1.6,volume=0.30[o]",
            "-map", "[o]",
        ]
    elif ad == "savur":
        # kesme savurması — bant geçiren gürültü, hızlı sönüm
        cmd = [
            "-f", "lavfi", "-i", f"anoisesrc=color=white:duration=0.55:sample_rate={SR}:amplitude=0.9",
            "-af", "bandpass=f=1100:width_type=o:w=3,afade=t=in:d=0.10:curve=qsin,"
                   "afade=t=out:st=0.12:d=0.43:curve=exp,volume=0.50",
        ]
    elif ad == "vurus":
        # alt bas vuruş
        cmd = [
            "-f", "lavfi", "-i", f"sine=frequency=46:duration=1.0:sample_rate={SR}",
            "-af", "afade=t=out:st=0.03:d=0.97:curve=exp,volume=0.80",
        ]
    elif ad == "kaydir":
        # sayfa kayma sesi
        cmd = [
            "-f", "lavfi", "-i", f"anoisesrc=color=pink:duration=0.45:sample_rate={SR}:amplitude=0.9",
            "-af", "highpass=f=1400,afade=t=in:d=0.06:curve=qsin,"
                   "afade=t=out:st=0.08:d=0.37:curve=exp,volume=0.18",
        ]
    elif ad == "tik":
        # dokunuş tıkı
        cmd = [
            "-f", "lavfi", "-i", f"sine=frequency=1500:duration=0.07:sample_rate={SR}",
            "-af", "afade=t=out:st=0.004:d=0.066:curve=exp,volume=0.28",
        ]
    elif ad == "onay":
        # onay çıngırağı — iki nota
        cmd = [
            "-f", "lavfi", "-i", f"sine=frequency=1046:duration=0.6:sample_rate={SR}",
            "-f", "lavfi", "-i", f"sine=frequency=1568:duration=0.6:sample_rate={SR}",
            "-filter_complex",
            "[0]volume=0.6[a];[1]volume=0.4[b];[a][b]amix=inputs=2:normalize=0,"
            "afade=t=out:st=0.02:d=0.58:curve=exp,volume=0.26[o]",
            "-map", "[o]",
        ]
    else:
        raise ValueError(ad)

    subprocess.run([FFMPEG, "-y", "-hide_banner", "-loglevel", "error", *cmd,
                    "-ar", str(SR), "-ac", "1", str(hedef)], check=True)
    return hedef


def main() -> None:
    if not VIDEO.exists():
        sys.exit(f"önce videoyu bas: node render-video.mjs  ({VIDEO} yok)")
    eksik = [f for f, _ in KONUSMA if not (VO / f).exists()]
    if eksik:
        sys.exit(f"seslendirme eksik: {', '.join(eksik)} — python3 ses/tts-uret.py")

    with tempfile.TemporaryDirectory() as td:
        klasor = Path(td)
        parca = []  # (dosya_yolu, başlangıç_saniye)

        for dosya, t in KONUSMA:
            parca.append((VO / dosya, t))
        onbellek: dict[str, Path] = {}
        for ad, t in EFEKT:
            if ad not in onbellek:
                onbellek[ad] = uret(ad, klasor)
            parca.append((onbellek[ad], t))

        girdi, zincir, etiket = [], [], []
        for i, (yol, t) in enumerate(parca, start=1):
            girdi += ["-i", str(yol)]
            zincir.append(f"[{i}:a]adelay={int(round(t * 1000))}:all=1[a{i}]")
            etiket.append(f"[a{i}]")

        graf = (
            ";".join(zincir)
            + ";" + "".join(etiket)
            + f"amix=inputs={len(parca)}:normalize=0:dropout_transition=0[mx];"
            + "[mx]alimiter=level_in=1:level_out=1:limit=0.95:attack=5:release=60,"
              "loudnorm=I=-14:TP=-1.0:LRA=11,"
              f"atrim=0:{SURE},asetpts=N/SR/TB,"
              "aformat=sample_fmts=fltp:sample_rates=48000:channel_layouts=stereo[out]"
        )

        subprocess.run(
            [FFMPEG, "-y", "-hide_banner", "-loglevel", "error",
             "-i", str(VIDEO), *girdi,
             "-filter_complex", graf,
             "-map", "0:v", "-map", "[out]",
             "-c:v", "copy", "-c:a", "aac", "-b:a", "192k",
             "-movflags", "+faststart", "-shortest", str(DEST)],
            check=True,
        )

    mb = DEST.stat().st_size / 1048576
    print(f"✓ {DEST.name}  {len(KONUSMA)} replik + {len(EFEKT)} efekt  {mb:.1f} MB")


if __name__ == "__main__":
    main()
