# -*- coding: utf-8 -*-
"""Color grading de las fotos de archivo (Pexels) al lenguaje "Wireframe":
blancos limpios, azules del logo, un toque de amarillo de anotacion.
No genera imagenes: solo corrige las descargadas. Reejecutable."""
from PIL import Image, ImageEnhance, ImageOps
import os, sys

SRC = "assets/img"
# id -> (nombre, ancho destino, recorte relativo (l,t,r,b) o None)
JOBS = {
    "7120865":  ("mesa-trabajo",      1800, (0.02, 0.06, 0.98, 0.94)),
    "11780441": ("movil-responsive",  1600, (0.04, 0.02, 0.98, 0.96)),
    "196645":   ("wireframe-papel",   1600, None),
    "5474290":  ("portatil-manos",    1500, (0.02, 0.10, 0.98, 0.94)),
}

def grade(im):
    im = im.convert("RGB")
    # 1. Blancos limpios: estirar el canal hasta el percentil alto real.
    im = ImageOps.autocontrast(im, cutoff=(0.5, 1.2))
    # 2. Enfriar ligeramente hacia el azul del logo, conservando piel.
    r, g, b = im.split()
    r = r.point(lambda v: min(255, int(v * 0.985)))
    b = b.point(lambda v: min(255, int(v * 1.045)))
    im = Image.merge("RGB", (r, g, b))
    # 3. Toque amarillo en los medios-altos (la nota del boceto).
    r, g, b = im.split()
    def warm_hi(v):
        if v < 150:
            return v
        k = (v - 150) / 105.0
        return min(255, int(v + 7 * k))
    r = r.point(warm_hi); g = g.point(warm_hi)
    im = Image.merge("RGB", (r, g, b))
    # 4. Bajar saturacion general: la web ya pone el color.
    im = ImageEnhance.Color(im).enhance(0.86)
    im = ImageEnhance.Brightness(im).enhance(1.03)
    return im

def main():
    for pid, (name, width, crop) in JOBS.items():
        src = os.path.join(SRC, "raw-%s.jpg" % pid)
        if not os.path.exists(src):
            print("FALTA", src); continue
        im = Image.open(src)
        if crop:
            w, h = im.size
            im = im.crop((int(crop[0]*w), int(crop[1]*h), int(crop[2]*w), int(crop[3]*h)))
        if im.width > width:
            im = im.resize((width, int(im.height * width / im.width)), Image.LANCZOS)
        out = grade(im)
        dst = os.path.join(SRC, name + ".jpg")
        out.save(dst, "JPEG", quality=82, optimize=True, progressive=True)
        # variante estrecha para movil
        sm = out.copy(); sm.thumbnail((820, 820), Image.LANCZOS)
        sm.save(os.path.join(SRC, name + "-sm.jpg"), "JPEG", quality=80, optimize=True, progressive=True)
        print("%-18s %sx%s  %d KB" % (name, out.width, out.height, os.path.getsize(dst)//1024))

if __name__ == "__main__":
    main()
