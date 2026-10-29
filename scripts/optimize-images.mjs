import sharp from "sharp";
import { createHash } from "node:crypto";
import { readFile, writeFile, mkdir, rm } from "node:fs/promises";
import path from "node:path";

const media = JSON.parse(await readFile("src/content/media.json", "utf8"));
const output = "public/assets/optimized";
await mkdir(output, { recursive: true });
const manifest = {};
for (const asset of Object.values(media)) {
  if (!asset || !asset.src.startsWith("/assets/")) continue;
  const input = await readFile(path.join("public", asset.src));
  const hash = createHash("sha256").update(input).digest("hex").slice(0, 12);
  const base = path.parse(asset.src).name;
  const sizes = [
    ...new Set(
      [
        64,
        96,
        128,
        256,
        320,
        480,
        640,
        768,
        960,
        1122,
        1440,
        asset.width,
      ].filter((width) => width <= asset.width),
    ),
  ].sort((a, b) => a - b);
  const variants = [];
  for (const width of sizes) {
    const file = `${base}.${hash}.${width}.webp`;
    const bytes = await sharp(input)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 79, effort: 6 })
      .toBuffer();
    await writeFile(path.join(output, file), bytes);
    variants.push({
      width,
      src: `/assets/optimized/${file}`,
      bytes: bytes.length,
    });
  }
  manifest[asset.src] = { width: asset.width, height: asset.height, variants };
}
await mkdir("src/lib/media", { recursive: true });
await writeFile(
  "src/lib/media/image-manifest.json",
  JSON.stringify(manifest, null, 2) + "\n",
);
console.log(
  `Optimized ${Object.keys(manifest).length} images into responsive WebP variants.`,
);
