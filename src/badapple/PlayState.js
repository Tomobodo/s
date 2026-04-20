import { AppState } from "../app/AppState.js";
import { GameObject } from "../scene/GameObject.js";
import { loadFrames, PIXELS } from "./frames.js";

class VideoDrawable extends GameObject {
  #frame = null;

  setFrame(frame) {
    this.#frame = frame;
  }

  draw(buf, width) {
    if (!this.#frame) return;
    for (let i = 0; i < PIXELS; i++) {
      buf[i] = this.#frame[i];
    }
  }
}

export class PlayState extends AppState {
  #frameStep;
  #frameMs;
  #frames = null;
  #currentFrame = 0;
  #accumulator = 0;
  #drawable = null;
  #done = false;

  constructor(sourceFps = 30, targetFps = 15) {
    super();
    this.#frameStep = Math.round(sourceFps / targetFps);
    this.#frameMs = 1000 / targetFps;
  }

  async onEnter() {
    this.app.canvas.setSyncOptions({
      batchSize: 1024,
      silent: true,
    });
    this.#currentFrame = 0;
    this.#accumulator = 0;
    this.#done = false;

    this.#drawable = new VideoDrawable();
    this.add(this.#drawable);

    this.#frames = await loadFrames(this.#frameStep);
  }

  onExit() {
    this.app.canvas.setSyncOptions({
      batchSize: 10,
      silent: false,
    });
    this.#done = true;
    this.#frames = null;
    this.#currentFrame = 0;
    this.#accumulator = 0;
  }

  onMessage(x, y) {
    if (x >= 0 && x < 32 && y >= 0 && y < 32) {
      this.setState("title");
    }
  }

  onUpdate(dt) {
    if (this.#done || !this.#frames) return;

    this.#accumulator += dt;
    while (this.#accumulator >= this.#frameMs) {
      this.#accumulator -= this.#frameMs;
      if (this.#currentFrame >= this.#frames.length) {
        this.#done = true;
        this.setState("title");
        return;
      }
      this.#drawable.setFrame(this.#frames[this.#currentFrame]);
      this.#currentFrame++;
    }
  }
}
