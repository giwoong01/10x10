import React from "react";
import StatItem from "./StatItem";
import styled from "styled-components";

interface GameHeaderProps {
  score: number;
  level: number;
  lines: number;
}

const GameHeader: React.FC<GameHeaderProps> = ({ score, level, lines }) => (
  <HeaderWrapper>
    <StatItem label="점수" value={score} />
    <StatItem label="레벨" value={level} />
    <StatItem label="줄" value={lines} />
  </HeaderWrapper>
);

const HeaderWrapper = styled.header`
  display: flex;
  justify-content: space-around;
  padding: 0.625rem 1.25rem;
  font-size: 1.2rem;
  font-weight: bold;
  color: #343a40;
`;

export default GameHeader;
