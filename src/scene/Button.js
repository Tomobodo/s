import { Sprite } from "./Sprite.js";
import { Canvas } from "../canvas.js";

export class Button extends Sprite {
  #onClick;

  constructor(x, y, img, onClick) {
    super(x, y, img);
    this.#onClick = onClick;
  }

  static async load(x, y, path, onClick) {
    return new Button(x, y, await Canvas.load_png(path), onClick);
  }

  hitTest(x, y) {
    return x >= this.ox && x < this.ox + this.width &&
           y >= this.oy && y < this.oy + this.height;
  }

  onClick(x, y, v, sid) {
    this.#onClick(sid, x, y, v);
  }
}
