import { AppState } from "../app/AppState.js";
import { Button } from "../scene/Button.js";
import { QRCode } from "../scene/QRCode.js";
import { Fill } from "../scene/Fill.js";

export class QRState extends AppState {
  async onEnter() {
    this.add(new Fill(9));
    this.add(new QRCode("t.ly/XhonS", { centered: true }));

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
