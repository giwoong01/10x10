export type Cell = 0 | 1;

export type Board = Cell[][];

export type Position = { row: number; col: number };

export type Block = { shape: Cell[][]; id: string };

export type GameState = "playing" | "paused" | "gameOver" | "menu";

export interface GameStats {
  score: number;
  linesCleared: number;
  level: number;
  playTime: number;
  highScore: number;
}
