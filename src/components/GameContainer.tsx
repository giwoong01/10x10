import React from "react";
import styled from "styled-components";
import Board from "./Board";
import BlockSet from "./BlockSet";
import { Block, Position } from "../types";

interface GameContainerProps {
  board: any;
  blocks: Block[];
  selectedBlockId: string | null;
  onSelect: (id: string | null) => void;
  onDragEnd: () => void;
  onCellClick: (row: number, col: number) => void;
  onDrop: (row: number, col: number, block: Block) => void;
  onHover: (row: number, col: number, block: Block) => void;
  previewShape: (0 | 1)[][] | null;
  previewPosition: Position | null;
}

const GameContainer: React.FC<GameContainerProps> = ({
  board,
  blocks,
  selectedBlockId,
  onSelect,
  onDragEnd,
  onCellClick,
  onDrop,
  onHover,
  previewShape,
  previewPosition,
}) => (
  <Container>
    <Board
      board={board}
      onCellClick={onCellClick}
      onDrop={onDrop}
      onHover={onHover}
      previewShape={previewShape}
      previewPosition={previewPosition}
    />
    <BlockSet
      blocks={blocks}
      selectedId={selectedBlockId}
      onSelect={onSelect}
      onDragEnd={onDragEnd}
    />
  </Container>
);

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.875rem;
  margin-top: 0.625rem;
`;

export default GameContainer;
