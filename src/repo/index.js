import { App } from "../app/App.js";
import { QRState } from "./QRState.js";

export class RepoApp extends App {
  constructor(canvas, options) {
    super(canvas, options);
    const deps = { canvas: this.canvas };
    this._register("qr", new QRState(deps));
  }

  async start() {
    this.canvas.setSyncOptions({
      batchSize: 10,
      silent: false,
    });
    await this.setState("qr");
  }
}
