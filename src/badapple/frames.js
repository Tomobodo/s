import { readdir } from "fs/promises";
import { resolve as r, dirname } from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";
import { SCREEN_SIZE } from "../canvas.js";

const ROOT = r(dirname(fileURLToPath(import.meta.url)), "../..");
const FRAMES_DIR = r(ROOT, "sprites/badapple/frames");

export const PIXELS = SCREEN_SIZE * SCREEN_SIZE;

function ditherFrame(raw) {
  const W = SCREEN_SIZE;
  const buf = new Float32Array(PIXELS);
  for (let i = 0; i < PIXELS; i++) buf[i] = raw[i];
  const result = new Uint8Array(PIXELS);

  for (let y = 0; y < W; y++) {
    for (let x = 0; x < W; x++) {
      const idx = y * W + x;
      const old = buf[idx];
      const nw = old < 128 ? 0 : 255;
      result[idx] = nw === 0 ? 9 : 0;
      const err = old - nw;
      if (x + 1 < W) buf[idx + 1] += (err * 7) / 16;
      if (y + 1 < W) {
        if (x > 0) buf[idx + W - 1] += (err * 3) / 16;
        buf[idx + W] += (err * 5) / 16;
        if (x + 1 < W) buf[idx + W + 1] += (err * 1) / 16;
      }
    }
  }
  return result;
}

export async function loadFrames(frameStep = 2) {
  const files = (await readdir(FRAMES_DIR))
    .filter((f) => /\.(png|jpg|jpeg)$/i.test(f))
    .sort()
    .filter((_, i) => i % frameStep === 0);

  return Promise.all(
    files.map(async (file) => {
      const raw = await sharp(r(FRAMES_DIR, file)).grayscale().resize(SCREEN_SIZE, SCREEN_SIZE).raw().toBuffer();
      return ditherFrame(raw);
    }),
  );
}
