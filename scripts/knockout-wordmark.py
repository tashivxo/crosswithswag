from pathlib import Path
from PIL import Image

src = Path("marcus-assets/figma-aug-2026/wordmark-group-53.png")
img = Image.open(src).convert("RGBA")
# Sand #D6D1C4 — scale luma so the fill is fully opaque and edges keep anti-alias.
sand_luma = 0.2126 * 214 + 0.7152 * 209 + 0.0722 * 196
out_pixels = []
for r, g, b, _a in img.get_flattened_data():
    luma = 0.2126 * r + 0.7152 * g + 0.0722 * b
    alpha = min(255, int(round(luma * 255 / sand_luma)))
    out_pixels.append((255, 255, 255, alpha))
img.putdata(out_pixels)
dest = Path("public/assets/SWAG_mark_fill.png")
img.save(dest)
print(src.name, "->", dest, img.size, "aspect", img.size[0] / img.size[1])
