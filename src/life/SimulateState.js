import { AppState } from "../app/AppState.js";
import { SCREEN_SIZE } from "../canvas.js";
import { GridDrawable } from "./GridDrawable.js";
import { ProgressBar } from "../scene/ProgressBar.js";

const SIMULATE_TIME = 30000;
const STEP_INTERVAL = 250;

export class SimulateState extends AppState {
  #elapsed = 0;
  #stepAccumulator = 0;
  #done = false;
  #bar = null;

  async onEnter() {
    this.#elapsed = 0;
    this.#stepAccumulator = 0;
    this.#done = false;
    this.add(new GridDrawable(this.app.grid));
    this.#bar = new ProgressBar(0, 0, SCREEN_SIZE, 1, 0, 9);
    this.add(this.#bar);
  }

  onUpdate(dt) {
    if (this.#done) return;
    this.#elapsed += dt;
    this.#bar.progress = Math.max(0, 1 - this.#elapsed / SIMULATE_TIME);
    if (this.#elapsed >= SIMULATE_TIME) {
      this.#done = true;
      this.setState("title");
      return;
    }
    this.#stepAccumulator += dt;
    if (this.#stepAccumulator >= STEP_INTERVAL) {
      this.#stepAccumulator = 0;
      this.#doStep();
    }
  }

  #doStep() {
    const grid = this.app.grid;
    const next = new Array(SCREEN_SIZE * SCREEN_SIZE);
    for (let y = 0; y < SCREEN_SIZE; y++) {
      for (let x = 0; x < SCREEN_SIZE; x++) {
        const alive = grid[y * SCREEN_SIZE + x];
        const n = this.#countNeighbors(grid, x, y);
        next[y * SCREEN_SIZE + x] = alive ? (n === 2 || n === 3) : n === 3;
      }
    }
    for (let i = 0; i < next.length; i++) grid[i] = next[i];
  }

  #countNeighbors(grid, x, y) {
    let count = 0;
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue;
        const nx = (x + dx + SCREEN_SIZE) % SCREEN_SIZE;
        const ny = (y + dy + SCREEN_SIZE) % SCREEN_SIZE;
        if (grid[ny * SCREEN_SIZE + nx]) count++;
      }
    }
    return count;
  }
}
