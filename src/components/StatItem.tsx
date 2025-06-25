import React from "react";
import styled from "styled-components";

interface StatItemProps {
  label: string;
  value: number | string;
}

const StatItem: React.FC<StatItemProps> = ({ label, value }) => (
  <Item>
    <Label>{label}:</Label>
    <Value>{value}</Value>
  </Item>
);

const Item = styled.div`
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 0.25rem 0.375rem rgba(0, 0, 0, 0.1);
  padding: 0.625rem 0.625rem;
  margin: 0 0.625rem 0 0.625rem;
  display: flex;
  align-items: center;
`;
const Label = styled.span`
  font-weight: bold;
  margin-right: 0.3125rem;
`;
const Value = styled.span``;

export default StatItem;
