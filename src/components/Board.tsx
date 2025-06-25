import styled from "styled-components";
import { useDrop } from "react-dnd";
import {
  Board as BoardType,
  Block,
  Position,
  Cell as CellType,
} from "../types";
import { BOARD_HEIGHT, BOARD_WIDTH } from "../constants/game";
import { COLORS, SIZES } from "../constants/styles";

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
      const cellSize = SIZES.CELL + SIZES.CELL_MARGIN * 2;
      const row = Math.floor(
        (offset.y - boardRect.top - SIZES.BOARD_PADDING) / cellSize
      );
      const col = Math.floor(
        (offset.x - boardRect.left - SIZES.BOARD_PADDING) / cellSize
      );

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
      const cellSize = SIZES.CELL + SIZES.CELL_MARGIN * 2;
      const row = Math.floor(
        (offset.y - boardRect.top - SIZES.BOARD_PADDING) / cellSize
      );
      const col = Math.floor(
        (offset.x - boardRect.left - SIZES.BOARD_PADDING) / cellSize
      );

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
            boardRow < BOARD_HEIGHT &&
            boardCol >= 0 &&
            boardCol < BOARD_WIDTH &&
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
  background-color: ${({ isOver }) =>
    isOver ? COLORS.BOARD_BG_HOVER : COLORS.BOARD_BG};
  padding: ${SIZES.BOARD_PADDING}px;
  border-radius: 12px;
  box-shadow: 0 4px 6px ${COLORS.BOARD_SHADOW};
  transition: background-color 0.2s ease;
`;

const Row = styled.div`
  display: flex;
  justify-content: center;
`;

const Cell = styled.div<{ cellState: number }>`
  width: ${SIZES.CELL}px;
  height: ${SIZES.CELL}px;
  background-color: ${({ cellState }) => {
    if (cellState === 1) return COLORS.CELL_FILLED;
    if (cellState === 2) return COLORS.CELL_PREVIEW;
    return COLORS.CELL_EMPTY;
  }};
  margin: ${SIZES.CELL_MARGIN}px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ cellState }) =>
      cellState === 1 ? COLORS.CELL_FILLED_HOVER : COLORS.CELL_EMPTY_HOVER};
    transform: scale(1.05);
  }
`;
