import { PNG } from "pngjs";
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const imagesDir = join(__dirname, "..", "public", "images");

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const smoothstep = (edge0, edge1, x) => {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
};

/**
 * Builds an alpha mask that keeps the logo and drops the (dark) background.
 * - mode "gold": keeps saturated (gold) pixels, removes the grey glow halo.
 * - mode "white": keeps bright pixels via luminance, removes dark background.
 * Then it clears the corner sparkle artifact and crops to the logo bounds.
 */
function processLogo(inputName, outputName, mode) {
  const src = PNG.sync.read(readFileSync(join(imagesDir, inputName)));
  const { width, height, data } = src;

  for (let idx = 0; idx < data.length; idx += 4) {
    const R = data[idx];
    const G = data[idx + 1];
    const B = data[idx + 2];

    const max = Math.max(R, G, B);
    const min = Math.min(R, G, B);
    const sat = max === 0 ? 0 : (max - min) / max;
    const lum = 0.299 * R + 0.587 * G + 0.114 * B;

    let alpha;
    if (mode === "gold") {
      // Keep gold (saturated + reasonably bright), drop grey glow and dark bg.
      const satFactor = smoothstep(0.18, 0.34, sat);
      const lumFactor = smoothstep(45, 90, lum);
      alpha = 255 * satFactor * lumFactor;
    } else {
      // Keep bright (white) strokes, drop dark background.
      alpha = 255 * smoothstep(70, 165, lum);
    }
    data[idx + 3] = Math.round(clamp(alpha, 0, 255));
  }

  // Clear the sparkle artifact sitting in the bottom-right corner.
  const cx0 = Math.floor(width * 0.86);
  const cy0 = Math.floor(height * 0.82);
  for (let y = cy0; y < height; y++) {
    for (let x = cx0; x < width; x++) {
      data[((width * y + x) << 2) + 3] = 0;
    }
  }

  // Compute bounding box of visible pixels to crop tightly.
  let minX = width;
  let minY = height;
  let maxX = 0;
  let maxY = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (data[((width * y + x) << 2) + 3] > 30) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  const pad = Math.round(width * 0.03);
  minX = clamp(minX - pad, 0, width);
  minY = clamp(minY - pad, 0, height);
  maxX = clamp(maxX + pad, 0, width - 1);
  maxY = clamp(maxY + pad, 0, height - 1);

  const outW = maxX - minX + 1;
  const outH = maxY - minY + 1;
  const out = new PNG({ width: outW, height: outH });
  for (let y = 0; y < outH; y++) {
    for (let x = 0; x < outW; x++) {
      const si = (width * (y + minY) + (x + minX)) << 2;
      const di = (outW * y + x) << 2;
      out.data[di] = data[si];
      out.data[di + 1] = data[si + 1];
      out.data[di + 2] = data[si + 2];
      out.data[di + 3] = data[si + 3];
    }
  }

  writeFileSync(join(imagesDir, outputName), PNG.sync.write(out));
  console.log(`${outputName}: ${outW}x${outH} (cropped from ${width}x${height})`);
  return out;
}

/**
 * Extracts the icon-only mark (top cluster) from a cropped transparent logo
 * by detecting the vertical gap between the icon and the "TimeTravel" text.
 */
function extractMark(cropped, outputName) {
  const { width, height, data } = cropped;
  const rowHasContent = new Array(height).fill(0);
  for (let y = 0; y < height; y++) {
    let count = 0;
    for (let x = 0; x < width; x++) {
      if (data[((width * y + x) << 2) + 3] > 40) count++;
    }
    rowHasContent[y] = count;
  }

  // Walk down through the first content block, then find the gap before text.
  let y = 0;
  while (y < height && rowHasContent[y] < 3) y++; // skip top padding
  const gapNeeded = Math.round(height * 0.03);
  let gapStart = -1;
  let gap = 0;
  for (; y < height; y++) {
    if (rowHasContent[y] < 3) {
      if (gap === 0) gapStart = y;
      gap++;
      if (gap >= gapNeeded) break;
    } else {
      gap = 0;
      gapStart = -1;
    }
  }
  const splitY = gapStart > 0 ? gapStart : Math.round(height * 0.58);

  // Horizontal bounds within the icon region.
  let minX = width;
  let maxX = 0;
  let minY = height;
  let maxY = 0;
  for (let yy = 0; yy < splitY; yy++) {
    for (let x = 0; x < width; x++) {
      if (data[((width * yy + x) << 2) + 3] > 40) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (yy < minY) minY = yy;
        if (yy > maxY) maxY = yy;
      }
    }
  }
  const pad = Math.round(width * 0.02);
  minX = clamp(minX - pad, 0, width);
  minY = clamp(minY - pad, 0, height);
  maxX = clamp(maxX + pad, 0, width - 1);
  maxY = clamp(maxY + pad, 0, height - 1);

  const outW = maxX - minX + 1;
  const outH = maxY - minY + 1;
  const out = new PNG({ width: outW, height: outH });
  for (let yy = 0; yy < outH; yy++) {
    for (let x = 0; x < outW; x++) {
      const si = (width * (yy + minY) + (x + minX)) << 2;
      const di = (outW * yy + x) << 2;
      out.data[di] = data[si];
      out.data[di + 1] = data[si + 1];
      out.data[di + 2] = data[si + 2];
      out.data[di + 3] = data[si + 3];
    }
  }
  writeFileSync(join(imagesDir, outputName), PNG.sync.write(out));
  console.log(`${outputName}: ${outW}x${outH} (icon mark, split at y=${splitY})`);
}

const gold = processLogo("logo-dore.png", "logo-dore-transparent.png", "gold");
processLogo("logo.png", "logo-transparent.png", "white");
extractMark(gold, "logo-mark.png");
