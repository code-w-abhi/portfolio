#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PUBLIC="$ROOT/public"
IMAGES="$PUBLIC/images"
SOURCE="$ROOT"

mkdir -p "$IMAGES"

IMAGE_NUMBERS=(1 2 3 4 5 6 7 8 9 10 11 12 15 16 17 18 19 20 21 22 23 24 25 26 27 28)

echo "Optimizing images for web deployment..."
for n in "${IMAGE_NUMBERS[@]}"; do
  src="$SOURCE/${n}.jpg"
  dest="$IMAGES/${n}.jpg"

  if [[ ! -f "$src" ]]; then
    echo "Missing source image: $src"
    exit 1
  fi

  cp "$src" "$dest"
  sips -Z 2400 -s format jpeg -s formatOptions 80 "$dest" >/dev/null
  echo "  ✓ ${n}.jpg"
done

# Use optimized images in the deployed HTML (portable sed for macOS + Linux).
sed 's|src="\([0-9][0-9]*\)\.jpg"|src="images/\1.jpg"|g' "$ROOT/gallery.html" > "$PUBLIC/index.html"

echo ""
echo "Build complete → public/ ($(du -sh "$PUBLIC" | cut -f1))"
