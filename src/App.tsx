import { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import Board from "./components/Board";
import BlockSet from "./components/BlockSet";
import GameControls from "./components/GameControls";
import GameOverlay from "./components/GameOverlay";
import { Board as BoardType, Block, Position } from "./types";
import { GameState, GameStats } from "./types/index";
import {
  createEmptyBoard,
  clearFullLines,
  generateBlocks,
  isGameOver,
  saveHighScore,
  getHighScore,
  calculateLevel,
} from "./utils/gameLogic";

const isMobile = () => {
  if (typeof window === "undefined") return false;
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
};

const App = () => {
  const [board, setBoard] = useState<BoardType>(createEmptyBoard());
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [gameState, setGameState] = useState<GameState>("playing");
  const [stats, setStats] = useState<GameStats>({
    score: 0,
    linesCleared: 0,
    level: 1,
    playTime: 0,
    highScore: getHighScore(),
  });
  const [dragPreview, setDragPreview] = useState<{
    shape: (0 | 1)[][];
    position: Position;
  } | null>(null);

  // 게임 초기화
  const initializeGame = useCallback(() => {
    setBoard(createEmptyBoard());
    setBlocks(generateBlocks());
    setSelectedBlockId(null);
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

  const placeBlockOnBoard = (row: number, col: number, block: Block) => {
    if (gameState !== "playing") return;

    setDragPreview(null);
    setBoard((prevBoard) => {
      const canPlace = block.shape.every((blockRow, r) =>
        blockRow.every((cell, c) => {
          const boardRow = row + r;
          const boardCol = col + c;
          return (
            cell === 0 ||
            (boardRow >= 0 &&
              boardRow < 10 &&
              boardCol >= 0 &&
              boardCol < 10 &&
              prevBoard[boardRow][boardCol] === 0)
          );
        })
      );

      if (canPlace) {
        const newBoard = prevBoard.map((r) => [...r]);
        block.shape.forEach((blockRow, r) => {
          blockRow.forEach((cell, c) => {
            if (cell === 1) {
              const boardRow = row + r;
              const boardCol = col + c;
              if (
                boardRow >= 0 &&
                boardRow < 10 &&
                boardCol >= 0 &&
                boardCol < 10
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

        setSelectedBlockId(null);
        return clearedBoard;
      }
      return prevBoard;
    });
  };

  const handleCellClick = (row: number, col: number) => {
    if (!selectedBlockId || gameState !== "playing") return;
    const selectedBlock = blocks.find((b) => b.id === selectedBlockId);
    if (!selectedBlock) return;
    placeBlockOnBoard(row, col, selectedBlock);
  };

  const handleDrop = (row: number, col: number, block: Block) => {
    placeBlockOnBoard(row, col, block);
  };

  const handleDragHover = (row: number, col: number, block: Block) => {
    setDragPreview({ shape: block.shape, position: { row, col } });
  };

  const handleDragEnd = () => {
    setDragPreview(null);
  };

  // 게임 제어 함수들
  const handlePause = () => setGameState("paused");
  const handleResume = () => setGameState("playing");
  const handleRestart = () => initializeGame();
  const handleMenu = () => setGameState("menu");

  // 메뉴 상태일 때는 메뉴 화면 표시
  if (gameState === "menu") {
    return (
      <MenuContainer>
        <MenuTitle>1010 게임</MenuTitle>
        <MenuButton onClick={handleRestart}>🎮 새 게임 시작</MenuButton>
        <StatsDisplay>
          <StatItem>
            <StatLabel>최고 점수:</StatLabel>
            <StatValue>{stats.highScore}</StatValue>
          </StatItem>
        </StatsDisplay>
      </MenuContainer>
    );
  }

  return (
    <DndProvider backend={isMobile() ? TouchBackend : HTML5Backend}>
      <AppContainer>
        <GameHeader>
          <ScoreDisplay>점수: {stats.score}</ScoreDisplay>
          <LevelDisplay>레벨: {stats.level}</LevelDisplay>
          <LinesDisplay>줄: {stats.linesCleared}</LinesDisplay>
        </GameHeader>

        <GameContainer>
          <Board
            board={board}
            onCellClick={handleCellClick}
            onDrop={handleDrop}
            onHover={handleDragHover}
            previewShape={dragPreview?.shape ?? null}
            previewPosition={dragPreview?.position ?? null}
          />
          <BlockSet
            blocks={blocks}
            selectedId={selectedBlockId}
            onSelect={setSelectedBlockId}
            onDragEnd={handleDragEnd}
          />
        </GameContainer>

        <GameControls gameState={gameState} onPause={handlePause} />

        <GameOverlay
          gameState={gameState}
          stats={stats}
          onRestart={handleRestart}
          onMenu={handleMenu}
          onResume={handleResume}
        />
      </AppContainer>
    </DndProvider>
  );
};

export default App;

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  background-color: #f8f9fa;
`;

const GameHeader = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  flex-wrap: wrap;
  justify-content: center;
`;

const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  margin-top: 20px;
  width: 100%;
  max-width: 800px;
`;

const ScoreDisplay = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: #343a40;
  padding: 10px 20px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const LevelDisplay = styled(ScoreDisplay)`
  color: #007bff;
`;

const LinesDisplay = styled(ScoreDisplay)`
  color: #28a745;
`;

const MenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f8f9fa;
  padding: 20px;
`;

const MenuTitle = styled.h1`
  font-size: 48px;
  font-weight: bold;
  color: #343a40;
  margin-bottom: 40px;
  text-align: center;
`;

const MenuButton = styled.button`
  padding: 20px 40px;
  font-size: 24px;
  font-weight: bold;
  border: none;
  border-radius: 12px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 30px;

  &:hover {
    background-color: #0056b3;
    transform: translateY(-3px);
  }

  &:active {
    transform: translateY(-1px);
  }
`;

const StatsDisplay = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const StatItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px 0;
`;

const StatLabel = styled.span`
  font-weight: bold;
  color: #495057;
  font-size: 18px;
`;

const StatValue = styled.span`
  font-size: 18px;
  font-weight: bold;
  color: #007bff;
`;
