import { GameObject } from "./GameObject.js";
import { SCREEN_SIZE } from "../canvas.js";

export class Fill extends GameObject {
  #color;

  constructor(color) {
    super();
    this.#color = color;
  }

  draw(buf, width) {
    for (let i = 0; i < SCREEN_SIZE * SCREEN_SIZE; i++)
      buf[i] = this.#color;
  }
}
