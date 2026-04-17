import { GameObject } from "../scene/GameObject.js";
import { SCREEN_SIZE } from "../canvas.js";

const FOOD_COLOR = 2; // orange

export class Food extends GameObject {
  #possiblePositions = [];
  #positions = [];

  constructor(maxCount) {
    super();
    for (let i = 0; i < SCREEN_SIZE; ++i)
      for (let j = 0; j < SCREEN_SIZE; ++j)
        this.#possiblePositions.push({ x: j, y: i });

    for (let i = 0; i < maxCount; i++) {
      this.addNew();
    }
  }

  addAt(pos) {
    this.#positions.push(pos);
  }

  addNew(bannedPos = []) {
    const allBanned = bannedPos.concat(this.#positions);

    const availablePositions = this.#possiblePositions.filter(
      (newPos) =>
        !allBanned.some((bp) => bp.x === newPos.x && bp.y === newPos.y),
    );

    if (availablePositions.length > 0) {
      const posIndex = Math.floor(Math.random() * availablePositions.length);
      this.#positions.push(availablePositions[posIndex]);
    }
  }

  tryEat(pos) {
    const posIndex = this.#positions.findIndex(
      (i) => i.x === pos.x && i.y === pos.y,
    );
    if (posIndex > -1) {
      this.#positions.splice(posIndex, 1);
      return true;
    }
    return false;
  }

  draw(buf, width) {
    for (const { x, y } of this.#positions) {
      if (x >= 0 && x < width && y >= 0 && y < width)
        buf[y * width + x] = FOOD_COLOR;
    }
  }
}
