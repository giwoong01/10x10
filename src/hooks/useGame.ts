import { useState, useEffect, useCallback } from "react";
import { Board as BoardType, Block } from "../types";
import { GameState, GameStats } from "../types/index";
import {
  createEmptyBoard,
  clearFullLines,
  generateBlocks,
  isGameOver,
  saveHighScore,
  getHighScore,
  calculateLevel,
} from "../utils/gameLogic";
import { BOARD_HEIGHT, BOARD_WIDTH } from "../constants/game";

export const useGame = () => {
  const [board, setBoard] = useState<BoardType>(createEmptyBoard());
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [gameState, setGameState] = useState<GameState>("playing");
  const [stats, setStats] = useState<GameStats>({
    score: 0,
    linesCleared: 0,
    level: 1,
    playTime: 0,
    highScore: getHighScore(),
  });

  // 게임 초기화
  const initializeGame = useCallback(() => {
    setBoard(createEmptyBoard());
    setBlocks(generateBlocks());
    setStats({
      score: 0,
      linesCleared: 0,
      level: 1,
      playTime: 0,
      highScore: getHighScore(),
    });
    setGameState("playing");
  }, []);

  // 게임 시작 시 초기화
  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  // 게임 오버 체크
  useEffect(() => {
    if (gameState === "playing" && blocks.length > 0) {
      if (isGameOver(board, blocks)) {
        setGameState("gameOver");
        saveHighScore(stats.score);
        setStats((prev: GameStats) => ({ ...prev, highScore: getHighScore() }));
      }
    }
  }, [board, blocks, gameState, stats.score]);

  // 플레이 시간 측정
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameState === "playing") {
      interval = setInterval(() => {
        setStats((prev: GameStats) => ({
          ...prev,
          playTime: prev.playTime + 1,
        }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameState]);

  // ESC 키로 일시정지/해제
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (gameState === "playing") {
          setGameState("paused");
        } else if (gameState === "paused") {
          setGameState("playing");
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState]);

  const placeBlockOnBoard = useCallback(
    (row: number, col: number, block: Block) => {
      if (gameState !== "playing") return false;

      let placed = false;
      setBoard((prevBoard) => {
        const canPlace = block.shape.every((blockRow, r) =>
          blockRow.every((cell, c) => {
            const boardRow = row + r;
            const boardCol = col + c;
            return (
              cell === 0 ||
              (boardRow >= 0 &&
                boardRow < BOARD_HEIGHT &&
                boardCol >= 0 &&
                boardCol < BOARD_WIDTH &&
                prevBoard[boardRow][boardCol] === 0)
            );
          })
        );

        if (canPlace) {
          placed = true;
          const newBoard = prevBoard.map((r) => [...r]);
          block.shape.forEach((blockRow, r) => {
            blockRow.forEach((cell, c) => {
              if (cell === 1) {
                const boardRow = row + r;
                const boardCol = col + c;
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

          const [clearedBoard, clearedLines] = clearFullLines(newBoard);
          if (clearedLines > 0) {
            setStats((prevStats: GameStats) => {
              const newLinesCleared = prevStats.linesCleared + clearedLines;
              const newScore = prevStats.score + clearedLines * 100;
              const newLevel = calculateLevel(newLinesCleared);
              return {
                ...prevStats,
                score: newScore,
                linesCleared: newLinesCleared,
                level: newLevel,
              };
            });
          }

          setBlocks((prevBlocks) => {
            const nextBlocks = prevBlocks.filter((b) => b.id !== block.id);
            if (nextBlocks.length === 0) {
              return generateBlocks();
            }
            return nextBlocks;
          });

          return clearedBoard;
        }
        return prevBoard;
      });
      return placed;
    },
    [gameState]
  );

  return {
    board,
    blocks,
    gameState,
    stats,
    placeBlockOnBoard,
    initializeGame,
    setGameState,
  };
};
