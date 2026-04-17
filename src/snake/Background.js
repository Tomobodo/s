import { GameObject } from "../scene/GameObject.js";
import { SCREEN_SIZE } from "../canvas.js";

export class Background extends GameObject {
  getColor(x, y) {
    return 9;
  }

  draw(buf, width) {
    for (let y = 0; y < SCREEN_SIZE; y++)
      for (let x = 0; x < SCREEN_SIZE; x++) buf[y * width + x] = 9;
  }
}
