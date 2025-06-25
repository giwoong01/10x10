import React from "react";
import styled from "styled-components";
import StatItem from "./StatItem";

interface MenuProps {
  highScore: number;
  onRestart: () => void;
}

const Menu: React.FC<MenuProps> = ({ highScore, onRestart }) => (
  <MenuContainer>
    <MenuTitle>1010 게임</MenuTitle>
    <MenuButton onClick={onRestart}>🎮 새 게임 시작</MenuButton>
    <StatsDisplay>
      <StatItem label="최고 점수" value={highScore} />
    </StatsDisplay>
  </MenuContainer>
);

const MenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f0f2f5;
  color: #495057;
`;
const MenuTitle = styled.h1`
  font-size: 4rem;
  font-weight: bold;
  margin-bottom: 2.5rem;
  color: #343a40;
`;
const MenuButton = styled.button`
  background-color: #4dabf7;
  color: white;
  border: none;
  padding: 0.9375rem 1.875rem;
  font-size: 1.5rem;
  font-weight: bold;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 0.25rem 0.375rem rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: #339af0;
    transform: translateY(-0.125rem);
    box-shadow: 0 0.375rem 0.5rem rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 0.25rem 0.375rem rgba(0, 0, 0, 0.1);
  }
`;
const StatsDisplay = styled.div`
  margin-top: 2.5rem;
  font-size: 1.2rem;
`;

export default Menu;
