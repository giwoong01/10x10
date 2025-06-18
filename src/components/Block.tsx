import styled from "styled-components";
import { useDrag } from "react-dnd";
import { Block as BlockType } from "../types";

type BlockProps = {
  block: BlockType;
  isSelected: boolean;
  onSelect: () => void;
  onDragEnd: () => void;
};

const BlockComponent = ({
  block,
  isSelected,
  onSelect,
  onDragEnd,
}: BlockProps) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "block",
    item: () => ({ block }),
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
    end: onDragEnd,
  }));

  return (
    <BlockWrapper
      ref={drag as any}
      onClick={onSelect}
      selected={isSelected}
      isDragging={isDragging}
    >
      {block.shape.map((row, rIdx) => (
        <Row key={rIdx}>
          {row.map((cell, cIdx) => (
            <MiniCell key={cIdx} filled={cell === 1} />
          ))}
        </Row>
      ))}
    </BlockWrapper>
  );
};

export default BlockComponent;

const BlockWrapper = styled.div<{ selected: boolean; isDragging: boolean }>`
  cursor: move;
  transition: all 0.2s ease;
  opacity: ${({ isDragging }) => (isDragging ? 0.5 : 1)};

  &:hover {
    transform: translateY(-2px);
  }
`;

const Row = styled.div`
  display: flex;
  justify-content: center;
`;

const MiniCell = styled.div<{ filled: boolean }>`
  width: 20px;
  height: 20px;
  background-color: ${({ filled }) => (filled ? "#495057" : "none")};
  margin: 1px;
  border-radius: 3px;
  transition: background-color 0.2s ease;
`;
