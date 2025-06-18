import styled from "styled-components";
import { GameState } from "../types/index";

interface GameControlsProps {
  gameState: GameState;
  onPause: () => void;
  //   onResume: () => void;
  //   onRestart: () => void;
  //   onMenu: () => void;
}

const GameControls = ({
  gameState,
  onPause,
}: //   onResume,
//   onRestart,
//   onMenu,
GameControlsProps) => {
  return (
    <ControlsContainer>
      {gameState === "playing" && (
        <ControlButton onClick={onPause}>⏸️ 일시정지</ControlButton>
      )}

      {/* {gameState === "paused" && (
        <>
          <ControlButton onClick={onResume}>▶️ 계속하기</ControlButton>
          <ControlButton onClick={onRestart}>🔄 다시시작</ControlButton>
          <ControlButton onClick={onMenu}>🏠 메뉴로</ControlButton>
        </>
      )}

      {gameState === "gameOver" && (
        <>
          <ControlButton onClick={onRestart}>🔄 다시시작</ControlButton>
          <ControlButton onClick={onMenu}>🏠 메뉴로</ControlButton>
        </>
      )} */}
    </ControlsContainer>
  );
};

export default GameControls;

const ControlsContainer = styled.div`
  display: flex;
  gap: 10px;
  margin: 10px 0;
  flex-wrap: wrap;
  justify-content: center;
`;

const ControlButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #0056b3;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;
