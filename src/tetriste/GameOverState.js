import { Canvas } from "../canvas.js";
import { AppState } from "../app/AppState.js";
import { Sprite } from "../scene/Sprite.js";

export class GameOverState extends AppState {
  async onEnter({ score }) {
    this.add(
      new Sprite(0, 0, await Canvas.load_png("sprites/tetriste/game-over.png")),
    );
    await this.render();
    await Canvas.wait(3000);
    await this.setState("score", { app: "tetriste", score });
  }
}
