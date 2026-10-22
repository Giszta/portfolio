// Generates raster icons from the single source of truth: src/app/icon.svg.
// Run: npm run icons
import { readFile, writeFile } from "node:fs/promises";
import sharp from "sharp";

const SOURCE = new URL("../src/app/icon.svg", import.meta.url);
const APPLE = new URL("../src/app/apple-icon.png", import.meta.url);
const ICO = new URL("../src/app/favicon.ico", import.meta.url);
const ICO_SIZES = [16, 32, 48];

const svg = await readFile(SOURCE);
const render = (size) =>
  sharp(svg, { density: 384 }).resize(size, size).png({ compressionLevel: 9 }).toBuffer();

// Apple touch icon: 180 px.
await writeFile(APPLE, await render(180));

// ICO container with PNG-compressed images (supported by all modern browsers).
const images = await Promise.all(ICO_SIZES.map(render));
const header = Buffer.alloc(6);
header.writeUInt16LE(1, 2); // type: icon
header.writeUInt16LE(images.length, 4);
let offset = header.length + 16 * images.length;
const entries = images.map((png, i) => {
  const e = Buffer.alloc(16);
  const size = ICO_SIZES[i];
  e.writeUInt8(size, 0);
  e.writeUInt8(size, 1);
  e.writeUInt16LE(1, 4); // planes
  e.writeUInt16LE(32, 6); // bits per pixel
  e.writeUInt32LE(png.length, 8);
  e.writeUInt32LE(offset, 12);
  offset += png.length;
  return e;
});
await writeFile(ICO, Buffer.concat([header, ...entries, ...images]));
console.log("icons generated");
