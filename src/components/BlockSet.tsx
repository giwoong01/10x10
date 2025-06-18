import styled from "styled-components";
import BlockComponent from "./Block";
import { Block } from "../types";

type BlockSetProps = {
  blocks: Block[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onDragEnd: () => void;
};

const BlockSet = ({
  blocks,
  selectedId,
  onSelect,
  onDragEnd,
}: BlockSetProps) => {
  return (
    <BlockSetWrapper>
      {blocks.map((block) => (
        <BlockComponent
          key={block.id}
          block={block}
          isSelected={block.id === selectedId}
          onSelect={() => onSelect(block.id)}
          onDragEnd={onDragEnd}
        />
      ))}
    </BlockSetWrapper>
  );
};

export default BlockSet;

const BlockSetWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 15px;
  padding: 15px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;
