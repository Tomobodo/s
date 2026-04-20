import { AppState } from "../app/AppState.js";
import { Fill } from "../scene/Fill.js";

export class LoadState extends AppState {
  async onEnter() {
    this.add(new Fill(9));

    await this.render();
    await this.setState("play");
  }
}
