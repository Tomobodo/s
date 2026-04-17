export class App {
  #states = {};
  #stateEntering = false;
  #stateExiting = false;
  #appExiting = false;
  #currentState = null;
  #currentStateName = undefined;

  constructor(canvas, { nextApp, prevApp } = {}) {
    this.canvas = canvas;
    this.nextApp = nextApp ?? (() => {});
    this.prevApp = prevApp ?? (() => {});
  }

  _register(name, state) {
    state.app = this;
    state.canvas = this.canvas;
    state.setState = (name) => this.setState(name);
    state.nextApp = () => this.nextApp();
    state.prevApp = () => this.prevApp();
    this.#states[name] = state;
  }

  async onEnter() {
    this.#appExiting = false;
    await this.start();
  }

  async onExit() {
    this.#appExiting = true;
    if (this.#currentState) {
      await this.#currentState.internalOnExit();
    }
    this.#currentState = null;
    this.#currentStateName = undefined;
    this.#appExiting = false;
  }

  async start() {}

  async setState(name) {
    if (this.#appExiting) return;
    if (this.#currentStateName === name) return;

    console.log("Setting state to", name);
    this.#stateExiting = true;
    if (this.#currentState) await this.#currentState.internalOnExit();
    this.#stateExiting = false;

    if (this.#states[name]) {
      this.#currentState = this.#states[name];
      this.#currentStateName = name;
    } else {
      throw new Error(`No state named ${name}`);
    }

    this.#stateEntering = true;
    if (this.#currentState) await this.#currentState.internalOnEnter();
    this.#stateEntering = false;
  }

  onMessage(x, y, v, sid) {
    if (this.#stateEntering || this.#stateExiting || this.#appExiting) return;
    this.#currentState?.onMessage?.(x, y, v, sid);
  }
}
