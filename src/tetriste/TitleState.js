import { AppState } from "../app/AppState.js";
import { Sprite } from "../scene/Sprite.js";
import { Button } from "../scene/Button.js";

export class TitleState extends AppState {
  async onEnter() {
    this.add(await Sprite.load(0, 0, "sprites/tetriste/title.png"));

    this.add(
      await Button.load(6, 23, "sprites/play-btn.png", async (sid) => {
        this.app.launcherSid = sid;
        await this.setState("play");
      }),
    );

    this.add(
      await Button.load(0, 22, "sprites/prev.png", async () => {
        this.prevApp();
      }),
    );

    this.add(
      await Button.load(27, 22, "sprites/next.png", async () => {
        this.nextApp();
      }),
    );
  }
}
