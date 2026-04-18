import { SCREEN_SIZE } from "../canvas.js";

export class AppState {
  #drawables = [];
  #loopTimeout = null;
  #lastTime = null;

  get drawables() {
    return this.#drawables;
  }

  add(drawable) {
    this.#drawables.push(drawable);
    drawable.onAdd(this);
    return this;
  }

  remove(drawable) {
    this.#drawables = this.#drawables.filter((d) => d !== drawable);
    drawable.onRemove(this);
  }

  clear() {
    for (const d of this.#drawables) d.onRemove(this);
    this.#drawables = [];
  }

  async render() {
    const buf = new Array(SCREEN_SIZE * SCREEN_SIZE).fill(null);
    for (const d of this.#drawables) d.draw(buf, SCREEN_SIZE);
    for (let y = 0; y < SCREEN_SIZE; y++)
      for (let x = 0; x < SCREEN_SIZE; x++)
        if (buf[y * SCREEN_SIZE + x] !== null)
          this.canvas.draw_pixel(x, y, buf[y * SCREEN_SIZE + x]);
    await this.canvas.flush();
  }

  async internalOnEnter(params) {
    await this.onEnter(params);
    await this.loop();
  }

  async internalOnExit() {
    clearTimeout(this.#loopTimeout);
    await this.onExit();
    this.clear();
  }

  async loop() {
    const now = performance.now();
    const dt = this.#lastTime === null ? 0 : now - this.#lastTime;
    this.#lastTime = now;

    this.onUpdate(dt);
    for (const d of this.#drawables) d.onUpdate(dt);
    await this.render();

    this.#loopTimeout = setTimeout(async () => await this.loop(), 10);
  }

  async onEnter() {}
  async onExit() {}

  onMessage(x, y, v, sid) {
    for (const d of this.#drawables) {
      if (d.hitTest(x, y)) d.onClick(x, y, v, sid);
      d.onMessage(x, y, v, sid);
    }
  }

  async onUpdate(dt) {}
}
