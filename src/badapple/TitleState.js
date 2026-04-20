import { AppState } from "../app/AppState.js";
import { Button } from "../scene/Button.js";
import { Sprite } from "../scene/Sprite.js";

export class TitleState extends AppState {
  async onEnter() {
    this.add(await Sprite.load(0, 0, "sprites/badapple/title.png"));

    this.add(
      await Button.load(6, 23, "sprites/play-btn.png", async () => {
        this.setState("load");
      }),
    );

    this.add(
      await Button.load(0, 22, "sprites/prev.png", () => this.prevApp()),
    );

    this.add(
      await Button.load(27, 22, "sprites/next.png", () => this.nextApp()),
    );
  }
}
