import { App } from "../app/App.js";
import { SCREEN_SIZE } from "../canvas.js";
import { TitleState } from "./TitleState.js";
import { PlayState } from "./PlayState.js";
import { GameOverState } from "./GameOverState.js";
import { ScoreState } from "../ScoreState.js";

export class TetristeApp extends App {
  grid = new Array(SCREEN_SIZE * SCREEN_SIZE).fill(false);

  constructor(canvas, options) {
    super(canvas, options);
    this._register("title", new TitleState());
    this._register("play", new PlayState());
    this._register("gameover", new GameOverState());
    this._register("score", new ScoreState());
  }

  async start() {
    await this.setState("title");
  }
}
