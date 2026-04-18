import Database from "better-sqlite3";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const DB_PATH = resolve(dirname(fileURLToPath(import.meta.url)), "..", "scores.db");

const db = new Database(DB_PATH);

db.exec(`
  CREATE TABLE IF NOT EXISTS scores (
    id    INTEGER PRIMARY KEY AUTOINCREMENT,
    app   TEXT    NOT NULL,
    user  TEXT    NOT NULL,
    score INTEGER NOT NULL
  )
`);

export function saveScore(app, user, score) {
  db.prepare("INSERT INTO scores (app, user, score) VALUES (?, ?, ?)").run(app, user, score);
}

export function getTopScores(app, limit = 10) {
  return db
    .prepare("SELECT * FROM scores WHERE app = ? ORDER BY score DESC LIMIT ?")
    .all(app, limit);
}
