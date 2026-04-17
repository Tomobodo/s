import { Canvas } from "../canvas.js";
import { AppState } from "../app/AppState.js";
import { Sprite } from "../scene/Sprite.js";
import { Button } from "../scene/Button.js";
import { Fill } from "../scene/Fill.js";

export class TitleState extends AppState {
  async onEnter() {
    this.add(
      new Sprite(0, 0, await Canvas.load_png("sprites/snake/title.png")),
    );
    this.add(
      new Button(
        6,
        23,
        await Canvas.load_png("sprites/play-btn.png"),
        async () => {
          this.clear();
          this.add(new Fill(9));
          await this.render();
          await this.setState("play");
        },
      ),
    );
    await this.render();
  }
}
