import { App } from "../app/App.js";
import { SCREEN_SIZE } from "../canvas.js";
import { TitleState } from "./TitleState.js";
import { DrawState } from "./DrawState.js";
import { SimulateState } from "./SimulateState.js";

export class LifeApp extends App {
  grid = new Array(SCREEN_SIZE * SCREEN_SIZE).fill(false);

  constructor(canvas, options) {
    super(canvas, options);
    const deps = { canvas: this.canvas };
    this._register("title", new TitleState(deps));
    this._register("draw", new DrawState(deps));
    this._register("simulate", new SimulateState(deps));
  }

  async start() {
    this.canvas.setSyncOptions({
      batchSize: 10,
      silent: false,
    });

    await this.setState("title");
  }
}
