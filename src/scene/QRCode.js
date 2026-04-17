import QRCodeLib from "qrcode";
import { GameObject } from "./GameObject.js";
import { SCREEN_SIZE } from "../canvas.js";

export class QRCode extends GameObject {
  #text;
  #ox;
  #oy;

  constructor(text, { x = 0, y = 0, centered = false } = {}) {
    super();
    this.#text = text;
    if (centered) {
      const { size } = QRCodeLib.create(text, { errorCorrectionLevel: "L" }).modules;
      this.#ox = Math.floor((SCREEN_SIZE - size) / 2);
      this.#oy = Math.floor((SCREEN_SIZE - size) / 2);
    } else {
      this.#ox = x;
      this.#oy = y;
    }
  }

  draw(buf, width) {
    const qr = QRCodeLib.create(this.#text, { errorCorrectionLevel: "L" });
    const { data, size } = qr.modules;
    for (let dy = 0; dy < size; dy++) {
      for (let dx = 0; dx < size; dx++) {
        const bx = this.#ox + dx;
        const by = this.#oy + dy;
        if (bx < 0 || bx >= width || by < 0 || by >= width) continue;
        buf[by * width + bx] = data[dy * size + dx] ? 9 : 0;
      }
    }
  }
}
