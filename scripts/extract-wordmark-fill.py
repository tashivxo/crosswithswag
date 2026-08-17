from pathlib import Path

src = Path("marcus-assets/svg/Frame_6_clean.svg").read_text(encoding="utf-8")
start = src.index('d="') + 3
end = src.index('"', start)
d = src[start:end]
cut = d.find("ZM1906.5")
if cut < 0:
    raise SystemExit("micro-text split marker not found")

word = d[:cut].rstrip()
out = (
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9088 6968" '
    'fill="none" aria-hidden="true">\n'
    f'<path d="{word}" fill="white"/>\n'
    "</svg>\n"
)
for dest in (
    Path("public/assets/SWAG_mark_fill.svg"),
    Path("marcus-assets/svg/SWAG_mark_fill.svg"),
):
    dest.write_text(out, encoding="utf-8")
    print("wrote", dest, "chars", len(out), "aspect", round(9088 / 6968, 6))
