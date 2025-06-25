import { Board, Block, Position } from "../types";
import {
  BOARD_HEIGHT,
  BOARD_WIDTH,
  BLOCK_SHAPES,
  BLOCKS_TO_GENERATE,
  HIGH_SCORE_STORAGE_KEY,
  LINES_FOR_LEVEL_UP,
} from "../constants/game";

export const createEmptyBoard = (): Board =>
  Array(BOARD_HEIGHT)
    .fill(null)
    .map(() => Array(BOARD_WIDTH).fill(0));

export const generateBlock = (): Block => {
  const randomShape =
    BLOCK_SHAPES[Math.floor(Math.random() * BLOCK_SHAPES.length)];

  return {
    id: Math.random().toString(36).substr(2, 9),
    shape: randomShape,
  };
};

export const generateBlocks = (): Block[] => {
  return Array.from({ length: BLOCKS_TO_GENERATE }, () => generateBlock());
};

export const canPlaceBlock = (
  board: Board,
  block: Block,
  position: Position
): boolean => {
  return block.shape.every((row, r) =>
    row.every((cell, c) => {
      const boardRow = position.row + r;
      const boardCol = position.col + c;
      return (
        cell === 0 ||
        (boardRow >= 0 &&
          boardRow < BOARD_HEIGHT &&
          boardCol >= 0 &&
          boardCol < BOARD_WIDTH &&
          board[boardRow][boardCol] === 0)
      );
    })
  );
};

export const placeBlock = (
  board: Board,
  block: Block,
  position: Position
): Board => {
  const newBoard = board.map((row) => [...row]);
  block.shape.forEach((row, r) => {
    row.forEach((cell, c) => {
      if (cell === 1) {
        const boardRow = position.row + r;
        const boardCol = position.col + c;
        if (
          boardRow >= 0 &&
          boardRow < BOARD_HEIGHT &&
          boardCol >= 0 &&
          boardCol < BOARD_WIDTH
        ) {
          newBoard[boardRow][boardCol] = 1;
        }
      }
    });
  });
  return newBoard;
};

export const clearFullLines = (board: Board): [Board, number] => {
  let linesCleared = 0;
  const newBoard = board.map((row) => [...row]);

  // 가로 줄 체크
  for (let i = 0; i < BOARD_HEIGHT; i++) {
    if (newBoard[i].every((cell) => cell === 1)) {
      newBoard[i].fill(0) as (0 | 1 | 2)[];
      linesCleared++;
    }
  }

  // 세로 줄 체크
  for (let j = 0; j < BOARD_WIDTH; j++) {
    if (newBoard.every((row) => row[j] === 1)) {
      for (let i = 0; i < BOARD_HEIGHT; i++) {
        newBoard[i][j] = 0;
      }
      linesCleared++;
    }
  }

  return [newBoard, linesCleared];
};

// 게임 오버 체크 함수
export const isGameOver = (board: Board, blocks: Block[]): boolean => {
  // 모든 블록에 대해 배치 가능한 위치가 있는지 확인
  return blocks.every((block) => {
    // 보드의 모든 위치에서 블록을 배치할 수 있는지 확인
    for (let row = 0; row < BOARD_HEIGHT; row++) {
      for (let col = 0; col < BOARD_WIDTH; col++) {
        if (canPlaceBlock(board, block, { row, col })) {
          return false; // 하나라도 배치 가능하면 게임 오버 아님
        }
      }
    }
    return true; // 모든 위치에서 배치 불가능
  });
};

// 최고 점수 저장/로드 함수
export const saveHighScore = (score: number): void => {
  const currentHigh = getHighScore();
  if (score > currentHigh) {
    localStorage.setItem(HIGH_SCORE_STORAGE_KEY, score.toString());
  }
};

export const getHighScore = (): number => {
  const saved = localStorage.getItem(HIGH_SCORE_STORAGE_KEY);
  return saved ? parseInt(saved, 10) : 0;
};

// 레벨 계산 함수
export const calculateLevel = (linesCleared: number): number => {
  return Math.floor(linesCleared / LINES_FOR_LEVEL_UP) + 1;
};
