import styled from "styled-components";
import { GameState, GameStats } from "../types/index";

interface GameOverlayProps {
  gameState: GameState;
  stats: GameStats;
  onRestart: () => void;
  onMenu: () => void;
  onResume: () => void;
}

const GameOverlay = ({
  gameState,
  stats,
  onRestart,
  onMenu,
  onResume,
}: GameOverlayProps) => {
  if (gameState === "playing") return null;

  return (
    <OverlayContainer>
      <OverlayContent>
        {gameState === "paused" && (
          <>
            <OverlayTitle>게임 일시정지</OverlayTitle>
            <OverlayText>일시정지된 상태입니다.</OverlayText>
            <ButtonContainer>
              <OverlayButton onClick={onResume}>▶️ 계속하기</OverlayButton>
              <OverlayButton onClick={onRestart}>🔄 다시시작</OverlayButton>
              <OverlayButton onClick={onMenu}>🏠 메뉴로</OverlayButton>
            </ButtonContainer>
          </>
        )}

        {gameState === "gameOver" && (
          <>
            <OverlayTitle>게임 오버!</OverlayTitle>
            <StatsContainer>
              <StatItem>
                <StatLabel>최종 점수:</StatLabel>
                <StatValue>{stats.score}</StatValue>
              </StatItem>
              <StatItem>
                <StatLabel>제거한 줄:</StatLabel>
                <StatValue>{stats.linesCleared}</StatValue>
              </StatItem>
              <StatItem>
                <StatLabel>레벨:</StatLabel>
                <StatValue>{stats.level}</StatValue>
              </StatItem>
              {stats.score >= stats.highScore && (
                <NewRecordBadge>🎉 새로운 기록!</NewRecordBadge>
              )}
            </StatsContainer>
            <ButtonContainer>
              <OverlayButton onClick={onRestart}>🔄 다시시작</OverlayButton>
              <OverlayButton onClick={onMenu}>🏠 메뉴로</OverlayButton>
            </ButtonContainer>
          </>
        )}
      </OverlayContent>
    </OverlayContainer>
  );
};

export default GameOverlay;

const OverlayContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const OverlayContent = styled.div`
  background-color: white;
  padding: 40px;
  border-radius: 16px;
  text-align: center;
  max-width: 400px;
  width: 90%;
`;

const OverlayTitle = styled.h2`
  font-size: 32px;
  font-weight: bold;
  color: #343a40;
  margin-bottom: 20px;
`;

const OverlayText = styled.p`
  font-size: 18px;
  color: #6c757d;
  margin-bottom: 30px;
`;

const StatsContainer = styled.div`
  margin: 20px 0;
`;

const StatItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px 0;
  padding: 10px;
  background-color: #f8f9fa;
  border-radius: 8px;
`;

const StatLabel = styled.span`
  font-weight: bold;
  color: #495057;
`;

const StatValue = styled.span`
  font-size: 18px;
  font-weight: bold;
  color: #007bff;
`;

const NewRecordBadge = styled.div`
  background-color: #28a745;
  color: white;
  padding: 10px;
  border-radius: 8px;
  font-weight: bold;
  margin-top: 15px;
  animation: pulse 2s infinite;

  @keyframes pulse {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
    100% {
      transform: scale(1);
    }
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 30px;
`;

const OverlayButton = styled.button`
  padding: 12px 24px;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:first-child {
    background-color: #28a745;
    color: white;

    &:hover {
      background-color: #218838;
    }
  }

  &:last-child {
    background-color: #6c757d;
    color: white;

    &:hover {
      background-color: #5a6268;
    }
  }

  &:hover {
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;
