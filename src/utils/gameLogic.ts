import { Board, Block, Position } from "../types";

export const createEmptyBoard = (): Board =>
  Array(10)
    .fill(null)
    .map(() => Array(10).fill(0));

export const generateBlock = (): Block => {
  const shapes: (0 | 1)[][][] = [
    [
      [1, 1],
      [1, 1],
    ], // 2x2
    [
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
    ],
    [[1, 1]], // 2x1
    [[1, 1, 1]], // 1x3
    [[1, 1, 1, 1]], // 4x1
    [[1], [1]], // 1x2
    [[1], [1], [1]], // 3x1
    [[1], [1], [1], [1]], // 1x4
    [
      [1, 1, 1],
      [0, 1, 0],
    ],
    [
      [0, 1, 0],
      [1, 1, 1],
    ],
    [
      [0, 1],
      [1, 1],
      [0, 1],
    ],
    [
      [1, 0],
      [1, 1],
      [1, 0],
    ],
    [
      [1, 1, 0],
      [0, 1, 1],
    ],
    [
      [0, 1, 1],
      [1, 1, 0],
    ],
    [
      [1, 0],
      [1, 1],
    ], // ㄴ
    [
      [0, 1],
      [1, 1],
    ], // 반대 ㄴ
    [
      [1, 1, 1],
      [1, 0, 0],
    ],
    [
      [1, 1, 1],
      [0, 0, 1],
    ],
  ];

  const randomShape = shapes[Math.floor(Math.random() * shapes.length)];

  return {
    id: Math.random().toString(36).substr(2, 9),
    shape: randomShape,
  };
};

export const generateBlocks = (): Block[] => {
  return [generateBlock(), generateBlock(), generateBlock()];
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
          boardRow < 10 &&
          boardCol >= 0 &&
          boardCol < 10 &&
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
        if (boardRow >= 0 && boardRow < 10 && boardCol >= 0 && boardCol < 10) {
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
  for (let i = 0; i < 10; i++) {
    if (newBoard[i].every((cell) => cell === 1)) {
      newBoard[i].fill(0) as (0 | 1 | 2)[];
      linesCleared++;
    }
  }

  // 세로 줄 체크
  for (let j = 0; j < 10; j++) {
    if (newBoard.every((row) => row[j] === 1)) {
      for (let i = 0; i < 10; i++) {
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
    for (let row = 0; row < 10; row++) {
      for (let col = 0; col < 10; col++) {
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
    localStorage.setItem("1010-high-score", score.toString());
  }
};

export const getHighScore = (): number => {
  const saved = localStorage.getItem("1010-high-score");
  return saved ? parseInt(saved, 10) : 0;
};

// 레벨 계산 함수
export const calculateLevel = (linesCleared: number): number => {
  return Math.floor(linesCleared / 10) + 1;
};
