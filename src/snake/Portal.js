import { GameObject } from "../scene/GameObject.js";

const PORTAL_COLOR = 10; // turquoise

export class Portal extends GameObject {
  #pair = null;

  setPortals(pair) {
    this.#pair = pair;
  }

  clear() {
    this.#pair = null;
  }

  at({ x, y }) {
    return (
      this.#pair !== null && this.#pair.some((p) => p.x === x && p.y === y)
    );
  }

  getOther({ x, y }) {
    if (!this.#pair) return null;
    const other = this.#pair.find((p) => !(p.x === x && p.y === y));
    return other ?? null;
  }

  getPair() {
    return this.#pair;
  }

  draw(buf, width) {
    if (!this.#pair) return;
    for (const { x, y } of this.#pair)
      if (x >= 0 && x < width && y >= 0 && y < width)
        buf[y * width + x] = PORTAL_COLOR;
  }
}
