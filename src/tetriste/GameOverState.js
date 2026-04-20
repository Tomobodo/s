import { Canvas } from "../canvas.js";
import { AppState } from "../app/AppState.js";
import { Sprite } from "../scene/Sprite.js";

export class GameOverState extends AppState {
  async onEnter({ score }) {
    this.add(await Sprite.load(0, 0, "sprites/tetriste/game-over.png"));
    await this.render();
    await Canvas.wait(3000);
    await this.setState("score", { app: "tetriste", score });
  }
}
