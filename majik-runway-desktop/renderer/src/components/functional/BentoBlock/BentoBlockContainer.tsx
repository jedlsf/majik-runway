import React from "react";
import styled from "styled-components";
import { BentoBlock } from "./BentoBlock";

interface BentoBlockContainerProps {
  column?: number;
  children:
    | React.ReactElement<typeof BentoBlock>
    | React.ReactElement<typeof BentoBlock>[];
}

const GridContainer = styled.div<{ $column: number }>`
  display: grid;
  grid-template-columns: repeat(${(props) => props.$column}, 1fr);
  gap: 15px;
  width: 100%;
  user-select: none;

  @media (max-width: 900px) {
    display: flex;
    flex-direction: column;
  }
`;

export const BentoBlockContainer: React.FC<BentoBlockContainerProps> = ({
  column = 2,
  children,
}) => {
  return <GridContainer $column={column}>{children}</GridContainer>;
};
