import { GameObject } from "../scene/GameObject.js";

const BONUS_COLOR = 8; // violet

export class Bonus extends GameObject {
  #position = null;

  setPosition(pos) {
    this.#position = pos;
  }

  clear() {
    this.#position = null;
  }

  at({ x, y }) {
    return this.#position !== null &&
           this.#position.x === x &&
           this.#position.y === y;
  }

  getPosition() {
    return this.#position;
  }

  draw(buf, width) {
    if (!this.#position) return;
    const { x, y } = this.#position;
    if (x >= 0 && x < width && y >= 0 && y < width)
      buf[y * width + x] = BONUS_COLOR;
  }
}
