import styled from "styled-components";
import { useDrop } from "react-dnd";
import {
  Board as BoardType,
  Block,
  Position,
  Cell as CellType,
} from "../types";

type BoardProps = {
  board: BoardType;
  onCellClick: (row: number, col: number) => void;
  onDrop: (row: number, col: number, block: Block) => void;
  onHover: (row: number, col: number, block: Block) => void;
  previewShape: (0 | 1)[][] | null;
  previewPosition: Position | null;
};

const Board = ({
  board,
  onCellClick,
  onDrop,
  onHover,
  previewShape,
  previewPosition,
}: BoardProps) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "block",
    drop: (item: { block: Block }, monitor) => {
      const offset = monitor.getClientOffset();
      if (!offset) return;

      const boardElement = document.getElementById("board");
      if (!boardElement) return;

      const boardRect = boardElement.getBoundingClientRect();
      const cellSize = 32;
      const row = Math.floor((offset.y - boardRect.top - 15) / cellSize);
      const col = Math.floor((offset.x - boardRect.left - 15) / cellSize);

      if (row >= 0 && row < board.length && col >= 0 && col < board[0].length) {
        onDrop(row, col, item.block);
      }
    },

    hover: (item: { block: Block }, monitor) => {
      const offset = monitor.getClientOffset();
      if (!offset) return;

      const boardElement = document.getElementById("board");
      if (!boardElement) return;

      const boardRect = boardElement.getBoundingClientRect();
      const cellSize = 32;
      const row = Math.floor((offset.y - boardRect.top - 15) / cellSize);
      const col = Math.floor((offset.x - boardRect.left - 15) / cellSize);

      if (row >= 0 && row < board.length && col >= 0 && col < board[0].length) {
        onHover(row, col, item.block);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const displayBoard: CellType[][] = board.map((row) => [...row]);
  if (previewShape && previewPosition) {
    previewShape.forEach((row, r) => {
      row.forEach((cell, c) => {
        if (cell === 1) {
          const boardRow = previewPosition.row + r;
          const boardCol = previewPosition.col + c;
          if (
            boardRow >= 0 &&
            boardRow < 10 &&
            boardCol >= 0 &&
            boardCol < 10 &&
            displayBoard[boardRow][boardCol] === 0
          ) {
            displayBoard[boardRow][boardCol] = 2 as CellType;
          }
        }
      });
    });
  }

  return (
    <BoardWrapper ref={drop as any} id="board" isOver={isOver}>
      {displayBoard.map((row, rIdx) => (
        <Row key={rIdx}>
          {row.map((cell, cIdx) => (
            <Cell
              key={cIdx}
              cellState={cell}
              onClick={() => onCellClick(rIdx, cIdx)}
            />
          ))}
        </Row>
      ))}
    </BoardWrapper>
  );
};

export default Board;

const BoardWrapper = styled.div<{ isOver: boolean }>`
  background-color: ${({ isOver }) => (isOver ? "#f8f9fa" : "white")};
  padding: 15px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: background-color 0.2s ease;
`;

const Row = styled.div`
  display: flex;
  justify-content: center;
`;

const Cell = styled.div<{ cellState: number }>`
  width: 30px;
  height: 30px;
  background-color: ${({ cellState }) => {
    if (cellState === 1) return "#495057";
    if (cellState === 2) return "rgba(73, 80, 87, 0.5)";
    return "#e9ecef";
  }};
  margin: 1px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ cellState }) =>
      cellState === 1 ? "#343a40" : "#dee2e6"};
    transform: scale(1.05);
  }
`;
