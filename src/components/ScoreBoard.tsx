import styled from "styled-components";

type ScoreBoardProps = { score: number };

const ScoreBoard = ({ score }: ScoreBoardProps) => (
  <Score>Score: {score}</Score>
);

export default ScoreBoard;

const Score = styled.div`
  font-size: 24px;
  font-weight: bold;
`;
