import { useState } from "react";
import styled from "styled-components";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import GameHeader from "./components/GameHeader";
import Menu from "./components/Menu";
import GameContainer from "./components/GameContainer";
import GameControls from "./components/GameControls";
import GameOverlay from "./components/GameOverlay";
import { Block, Position } from "./types";
import { useGame } from "./hooks/useGame";

const isMobile = () => {
  if (typeof window === "undefined") return false;
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
};

const App = () => {
  const {
    board,
    blocks,
    gameState,
    stats,
    placeBlockOnBoard,
    initializeGame,
    setGameState,
  } = useGame();
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [dragPreview, setDragPreview] = useState<{
    shape: (0 | 1)[][];
    position: Position;
  } | null>(null);

  const handleCellClick = (row: number, col: number) => {
    if (!selectedBlockId || gameState !== "playing") return;
    const selectedBlock = blocks.find((b) => b.id === selectedBlockId);
    if (!selectedBlock) return;
    if (placeBlockOnBoard(row, col, selectedBlock)) {
      setSelectedBlockId(null);
    }
  };

  const handleDrop = (row: number, col: number, block: Block) => {
    if (placeBlockOnBoard(row, col, block)) {
      setSelectedBlockId(null);
    }
    setDragPreview(null);
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
  const handleRestart = () => {
    initializeGame();
    setSelectedBlockId(null);
    setDragPreview(null);
  };
  const handleMenu = () => setGameState("menu");

  // 메뉴 상태일 때는 메뉴 화면 표시
  if (gameState === "menu") {
    return <Menu highScore={stats.highScore} onRestart={handleRestart} />;
  }

  return (
    <DndProvider backend={isMobile() ? TouchBackend : HTML5Backend}>
      <AppContainer>
        <GameHeader
          score={stats.score}
          level={stats.level}
          lines={stats.linesCleared}
        />
        <GameContainer
          board={board}
          blocks={blocks}
          selectedBlockId={selectedBlockId}
          onSelect={setSelectedBlockId}
          onDragEnd={handleDragEnd}
          onCellClick={handleCellClick}
          onDrop={handleDrop}
          onHover={handleDragHover}
          previewShape={dragPreview?.shape ?? null}
          previewPosition={dragPreview?.position ?? null}
        />
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
  justify-content: center;
  min-height: 100vh;
  background-color: #f0f2f5;
  padding: 1.25rem;
  font-family: "Nanum Gothic", sans-serif;
`;
