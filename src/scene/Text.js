import { GameObject } from "./GameObject.js";
import { Canvas } from "../canvas.js";

const CHAR_W = 3;
const CHAR_H = 5;
const CHAR_GAP = 1;
const BLINK_INTERVAL = 500;
const CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ";
const SPACE_IDX = CHARSET.length - 1;

let fontColors = null;
let fontWidth = 0;

async function loadFont() {
  if (fontColors) return;
  const { width, pixels } = await Canvas.load_png("sprites/font.png");
  fontWidth = width;
  fontColors = pixels.map((hex) =>
    hex === null ? null : Canvas.nearest_palette(hex),
  );
}

function charIndex(ch) {
  const c = ch.toUpperCase();
  if (c >= "A" && c <= "Z") return c.charCodeAt(0) - 65;
  if (c >= "0" && c <= "9") return 26 + (c.charCodeAt(0) - 48);
  return SPACE_IDX;
}

function indexToChar(i) {
  return CHARSET[i];
}

export class Text extends GameObject {
  #x;
  #y;
  #chars;
  #color;

  cursorPos = undefined;
  #blinkOn = true;
  #blinkAccumulator = 0;

  constructor(x, y, text = "", color = 0) {
    super();
    this.#x = x;
    this.#y = y;
    this.#chars = [...text];
    this.#color = color;
  }

  setText(text) {
    this.#chars = [...text];
  }

  getString() {
    return this.#chars.join("");
  }

  cursorUp() {
    if (this.cursorPos === undefined || this.cursorPos < 0) return;
    const idx = charIndex(this.#chars[this.cursorPos] ?? " ");
    this.#chars[this.cursorPos] = indexToChar(
      (idx - 1 + CHARSET.length) % CHARSET.length,
    );
  }

  cursorDown() {
    if (this.cursorPos === undefined || this.cursorPos < 0) return;
    const idx = charIndex(this.#chars[this.cursorPos] ?? " ");
    this.#chars[this.cursorPos] = indexToChar((idx + 1) % CHARSET.length);
  }

  static async preload() {
    await loadFont();
  }

  onUpdate(dt) {
    if (this.cursorPos === undefined) return;
    this.#blinkAccumulator += dt;
    if (this.#blinkAccumulator >= BLINK_INTERVAL) {
      this.#blinkAccumulator = 0;
      this.#blinkOn = !this.#blinkOn;
    }
  }

  #charX(pos) {
    return this.#x + pos * (CHAR_W + CHAR_GAP);
  }

  hitTest(x, y) {
    if (this.cursorPos === undefined) return false;
    return (
      x >= this.#x &&
      x < this.#charX(this.#chars.length) &&
      y >= this.#y - 8 &&
      y < this.#y + CHAR_H + 8
    );
  }

  onClick(x, y) {
    if (this.cursorPos === undefined) return;

    if (y < this.#y) {
      this.cursorUp();
      return;
    }
    if (y >= this.#y + CHAR_H) {
      this.cursorDown();
      return;
    }

    for (let i = 0; i < this.#chars.length; i++) {
      const cx = this.#charX(i);
      if (x >= cx && x < cx + CHAR_W) {
        this.cursorPos = i;
        return;
      }
    }
  }

  draw(buf, width) {
    if (!fontColors) return;

    for (let i = 0; i < this.#chars.length; i++) {
      const cx = this.#charX(i);
      const isCursor = this.cursorPos !== undefined && i === this.cursorPos;
      const idx = charIndex(this.#chars[i]);

      if (idx !== SPACE_IDX) {
        const srcX = idx * CHAR_W;
        for (let dy = 0; dy < CHAR_H; dy++) {
          for (let dx = 0; dx < CHAR_W; dx++) {
            const fc = fontColors[dy * fontWidth + srcX + dx];
            if (fc === null) continue;
            const bx = cx + dx;
            const by = this.#y + dy;
            if (bx < 0 || bx >= width || by < 0 || by >= width) continue;
            buf[by * width + bx] = this.#color;
          }
        }
      }

      if (isCursor && this.#blinkOn) {
        const by = this.#y + CHAR_H + 1;
        for (let dx = 0; dx < CHAR_W; dx++) {
          const bx = cx + dx;
          if (bx < 0 || bx >= width || by < 0 || by >= width) continue;
          buf[by * width + bx] = this.#color;
        }
      }
    }
  }
}
