// Generates app/favicon.ico from public/images/logo-mark.png.
// Produces a 32x32 (and 16x16) square icon with transparent letterbox padding,
// wrapped in an ICO container that embeds PNG-encoded images.
const fs = require("fs");
const path = require("path");
const { PNG } = require("pngjs");

const SRC = path.join(__dirname, "..", "public", "images", "logo-mark.png");
const OUT = path.join(__dirname, "..", "app", "favicon.ico");

function loadPng(file) {
  return PNG.sync.read(fs.readFileSync(file));
}

// Bilinear resize of source into a `size`x`size` canvas, preserving aspect
// ratio and centering with transparent padding.
function resizeSquare(src, size) {
  const scale = Math.min(size / src.width, size / src.height);
  const dw = Math.max(1, Math.round(src.width * scale));
  const dh = Math.max(1, Math.round(src.height * scale));
  const offX = Math.floor((size - dw) / 2);
  const offY = Math.floor((size - dh) / 2);

  const out = new PNG({ width: size, height: size });
  out.data.fill(0); // fully transparent

  for (let y = 0; y < dh; y++) {
    const sy = ((y + 0.5) / scale) - 0.5;
    const y0 = Math.max(0, Math.floor(sy));
    const y1 = Math.min(src.height - 1, y0 + 1);
    const wy = Math.min(1, Math.max(0, sy - y0));
    for (let x = 0; x < dw; x++) {
      const sx = ((x + 0.5) / scale) - 0.5;
      const x0 = Math.max(0, Math.floor(sx));
      const x1 = Math.min(src.width - 1, x0 + 1);
      const wx = Math.min(1, Math.max(0, sx - x0));

      const px = (xx, yy) => (yy * src.width + xx) * 4;
      const p00 = px(x0, y0), p10 = px(x1, y0), p01 = px(x0, y1), p11 = px(x1, y1);

      const di = ((y + offY) * size + (x + offX)) * 4;
      for (let c = 0; c < 4; c++) {
        const top = src.data[p00 + c] * (1 - wx) + src.data[p10 + c] * wx;
        const bot = src.data[p01 + c] * (1 - wx) + src.data[p11 + c] * wx;
        out.data[di + c] = Math.round(top * (1 - wy) + bot * wy);
      }
    }
  }
  return out;
}

function pngBuffer(png) {
  return PNG.sync.write(png, { colorType: 6 });
}

function buildIco(images) {
  const count = images.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(count, 4);

  const dir = Buffer.alloc(16 * count);
  let offset = 6 + 16 * count;
  const bodies = [];
  images.forEach((img, i) => {
    const base = i * 16;
    dir.writeUInt8(img.size >= 256 ? 0 : img.size, base + 0); // width
    dir.writeUInt8(img.size >= 256 ? 0 : img.size, base + 1); // height
    dir.writeUInt8(0, base + 2); // palette
    dir.writeUInt8(0, base + 3); // reserved
    dir.writeUInt16LE(1, base + 4); // color planes
    dir.writeUInt16LE(32, base + 6); // bits per pixel
    dir.writeUInt32LE(img.data.length, base + 8); // size of image data
    dir.writeUInt32LE(offset, base + 12); // offset
    offset += img.data.length;
    bodies.push(img.data);
  });

  return Buffer.concat([header, dir, ...bodies]);
}

const src = loadPng(SRC);
const sizes = [16, 32, 48];
const images = sizes.map((size) => ({ size, data: pngBuffer(resizeSquare(src, size)) }));
fs.writeFileSync(OUT, buildIco(images));
console.log("Wrote", OUT, "with sizes", sizes.join(", "));
