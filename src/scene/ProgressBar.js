import { GameObject } from "./GameObject.js";

export class ProgressBar extends GameObject {
  progress = 1.0;
  onComplete = null;

  #x;
  #y;
  #w;
  #h;
  #color;
  #bgColor;

  constructor(x, y, w, h = 1, color = 0, bgColor = null) {
    super();
    this.#x = x;
    this.#y = y;
    this.#w = w;
    this.#h = h;
    this.#color = color;
    this.#bgColor = bgColor;
  }

  hitTest(x, y) {
    return (
      x >= this.#x && x < this.#x + this.#w &&
      y >= this.#y && y < this.#y + this.#h
    );
  }

  onClick() {
    this.onComplete?.();
  }

  draw(buf, width) {
    const filled = Math.round(this.#w * Math.max(0, Math.min(1, this.progress)));
    for (let dy = 0; dy < this.#h; dy++) {
      for (let dx = 0; dx < this.#w; dx++) {
        const c = dx < filled ? this.#color : this.#bgColor;
        if (c === null) continue;
        const bx = this.#x + dx;
        const by = this.#y + dy;
        if (bx < 0 || bx >= width || by < 0 || by >= width) continue;
        buf[by * width + bx] = c;
      }
    }
  }
}
