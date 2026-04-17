import { Canvas } from "../canvas.js";
import { AppState } from "../app/AppState.js";
import { Button } from "../scene/Button.js";
import { Sprite } from "../scene/Sprite.js";

export class TitleState extends AppState {
  async onEnter() {
    this.add(new Sprite(0, 0, await Canvas.load_png("sprites/life/title.png")));

    this.add(
      new Button(
        6,
        23,
        await Canvas.load_png("sprites/play-btn.png"),
        async (sid) => {
          await this.setState("draw");
        },
      ),
    );

    this.add(
      new Button(0, 22, await Canvas.load_png("sprites/prev.png"), async () => {
        this.prevApp();
      }),
    );

    this.add(
      new Button(
        27,
        22,
        await Canvas.load_png("sprites/next.png"),
        async () => {
          this.nextApp();
        },
      ),
    );
  }
}
