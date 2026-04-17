import { Canvas } from "../canvas.js";
import { AppState } from "../app/AppState.js";
import { QRCode } from "../scene/QRCode.js";

export class ShowQrState extends AppState {
  async onEnter() {
    this.add(new QRCode("t.ly/XhonS", { centered: true }));
    await this.render();
    await Canvas.wait(3000);
    await this.setState("title");
  }
}
