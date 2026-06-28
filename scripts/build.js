const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const ROOT = path.join(__dirname, "..");
const PUBLIC = path.join(ROOT, "public");
const IMAGES = path.join(PUBLIC, "images");

const IMAGE_NUMBERS = fs
  .readdirSync(ROOT)
  .filter((file) => /^\d+\.jpg$/i.test(file))
  .map((file) => Number.parseInt(file, 10))
  .sort((a, b) => a - b);

async function build() {
  fs.mkdirSync(IMAGES, { recursive: true });

  console.log("Optimizing images for web deployment...");
  for (const n of IMAGE_NUMBERS) {
    const src = path.join(ROOT, `${n}.jpg`);
    const dest = path.join(IMAGES, `${n}.jpg`);

    if (!fs.existsSync(src)) {
      throw new Error(`Missing source image: ${src}`);
    }

    await sharp(src)
      .resize(2400, 2400, { fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 80 })
      .toFile(dest);

    console.log(`  ✓ ${n}.jpg`);
  }

  const gallery = fs.readFileSync(path.join(ROOT, "gallery.html"), "utf8");
  const index = gallery.replace(/src="(\d+)\.jpg"/g, 'src="images/$1.jpg"');
  fs.writeFileSync(path.join(PUBLIC, "index.html"), index);

  console.log("\nBuild complete → public/");
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
