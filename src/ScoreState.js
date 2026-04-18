import { Text } from "./scene/Text.js";
import { AppState } from "./app/AppState.js";
import { Fill } from "./scene/Fill.js";
import { ProgressBar } from "./scene/ProgressBar.js";
import { SCREEN_SIZE } from "./canvas.js";
import { saveScore, getTopScores } from "./db.js";

const SCORE_DURATION = 30000;
const LINE_H = 6;
const CHAR_W = 3;
const CHAR_GAP = 1;

function scoreX(scoreStr) {
  const textWidth = scoreStr.length * (CHAR_W + CHAR_GAP) - CHAR_GAP;
  return SCREEN_SIZE - 1 - textWidth;
}

export class ScoreState extends AppState {
  #elapsed = 0;
  #bar = null;
  #done = false;
  #playerNameText = null;
  #app = null;
  #score = null;

  async onEnter({ app, score }) {
    await Text.preload();
    this.#elapsed = 0;
    this.#done = false;
    this.#app = app;
    this.#score = score;

    this.add(new Fill(9));

    const top = getTopScores(app, 100);
    const betterCount = top.filter((s) => s.score > score).length;
    const playerRank = betterCount + 1;
    const slots = this.#buildSlots(top, score, playerRank);

    let playerSlotY = null;

    for (let i = 0; i < slots.length; i++) {
      const slot = slots[i];
      const y = i * LINE_H + 1;

      if (slot.type === "gap") {
        this.add(new Text(1, y, "...", 1));
        continue;
      }

      const isPlayer = slot.type === "player";
      const color = isPlayer ? 0 : 1;
      const scoreStr = String(slot.score);

      if (isPlayer) {
        playerSlotY = y;
        this.add(new Text(scoreX(scoreStr), y, scoreStr, color));
      } else {
        this.add(new Text(1, y, slot.user, color));
        this.add(new Text(scoreX(scoreStr), y, scoreStr, color));
      }
    }

    this.#bar = new ProgressBar(0, SCREEN_SIZE - 1, SCREEN_SIZE, 1, 0);
    this.#bar.onComplete = () => this.#finish();
    this.add(this.#bar);

    if (playerSlotY !== null) {
      this.#playerNameText = new Text(1, playerSlotY, "AAAA", 0);
      this.#playerNameText.cursorPos = 0;
      this.add(this.#playerNameText);
    }
  }

  #buildSlots(top, playerScore, playerRank) {
    const slots = [];

    if (playerRank <= 5) {
      let topIdx = 0;
      for (let rank = 1; rank <= 5; rank++) {
        if (rank === playerRank) {
          slots.push({ type: "player", rank, score: playerScore });
        } else if (topIdx < top.length) {
          const entry = top[topIdx++];
          slots.push({ type: "entry", rank, score: entry.score, user: entry.user });
        }
      }
    } else {
      for (let i = 0; i < 3 && i < top.length; i++) {
        slots.push({ type: "entry", rank: i + 1, score: top[i].score, user: top[i].user });
      }
      slots.push({ type: "gap" });
      slots.push({ type: "player", rank: playerRank, score: playerScore });
    }

    return slots;
  }

  onUpdate(dt) {
    if (this.#done) return;
    this.#elapsed += dt;
    this.#bar.progress = Math.max(0, 1 - this.#elapsed / SCORE_DURATION);
    if (this.#elapsed >= SCORE_DURATION) this.#finish();
  }

  #finish() {
    if (this.#done) return;
    this.#done = true;
    const user = this.#playerNameText?.getString().trim() || "????";
    saveScore(this.#app, user, this.#score);
    this.setState("title");
  }
}
