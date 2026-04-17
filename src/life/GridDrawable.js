import { GameObject } from "../scene/GameObject.js";
import { SCREEN_SIZE } from "../canvas.js";

export class GridDrawable extends GameObject {
  #grid;

  constructor(grid) {
    super();
    this.#grid = grid;
  }

  draw(buf, width) {
    for (let i = 0; i < SCREEN_SIZE * SCREEN_SIZE; i++)
      buf[i] = this.#grid[i] ? 0 : 9;
  }
}
