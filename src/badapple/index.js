import { App } from "../app/App.js";
import { TitleState } from "./TitleState.js";
import { LoadState } from "./LoadState.js";
import { PlayState } from "./PlayState.js";

export class BadAppleApp extends App {
  constructor(canvas, options, { sourceFps = 30, targetFps = 15 } = {}) {
    super(canvas, options);
    this._register("title", new TitleState());
    this._register("load", new LoadState());
    this._register("play", new PlayState(sourceFps, targetFps));
  }

  async start() {
    this.canvas.setSyncOptions({
      batchSize: 10,
      silent: false,
    });
    await this.setState("title");
  }
}
