"use client";

import React from "react";
import styled from "styled-components";

import { BentoBlockContainer } from "../../components/functional/BentoBlock/BentoBlockContainer";
import { BentoBlock } from "../../components/functional/BentoBlock/BentoBlock";
import {
  BentoItemDescription,
  BentoItemIconContainer,
  BentoItemTitle,
} from "../../components/functional/BentoBlock/styled-bento-components";
import {
  ShoppingCartIcon,
  TagIcon,
  HandshakeIcon,
  CalendarCheckIcon,
} from "@phosphor-icons/react";
import { BusinessModelType } from "@thezelijah/majik-runway";

// Styled components
const RootContainer = styled.div`
  width: 100%;
  max-width: 900px;
  gap: 10px;
  display: flex;
  flex-direction: column;

  align-items: center;
  justify-content: center;
  height: 100%;

  background-color: ${({ theme }) => theme.colors.primaryBackground};

  transition: all 0.3s ease;

  user-select: none;

  @media (max-width: 768px) {
    max-width: unset;
    width: 100%;
  }
`;

interface MajikRunwayModelSelectorProps {
  onSelect: (preset: BusinessModelType) => void;
  currentValue?: BusinessModelType;
}

const MajikRunwayModelSelector: React.FC<MajikRunwayModelSelectorProps> = ({
  onSelect,
  currentValue,
}) => {
  const handleClick = (preset: BusinessModelType) => {
    onSelect(preset);
  };

  return (
    <RootContainer>
      <BentoBlockContainer column={4}>
        <BentoBlock
          onClick={() => handleClick(BusinessModelType.Product)}
          selected={currentValue === BusinessModelType.Product}
        >
          <BentoItemIconContainer>
            <ShoppingCartIcon size={72} />
          </BentoItemIconContainer>
          <BentoItemTitle>Product</BentoItemTitle>
          <BentoItemDescription>
            Sell physical or digital products (one-time purchases).
          </BentoItemDescription>
        </BentoBlock>

        <BentoBlock
          onClick={() => handleClick(BusinessModelType.Service)}
          selected={currentValue === BusinessModelType.Service}
        >
          <BentoItemIconContainer>
            <HandshakeIcon size={72} />
          </BentoItemIconContainer>
          <BentoItemTitle>Service</BentoItemTitle>
          <BentoItemDescription>
            Provide services billed per hour, project, or engagement.
          </BentoItemDescription>
        </BentoBlock>

        <BentoBlock
          onClick={() => handleClick(BusinessModelType.Subscription)}
          selected={currentValue === BusinessModelType.Subscription}
        >
          <BentoItemIconContainer>
            <CalendarCheckIcon size={72} />
          </BentoItemIconContainer>
          <BentoItemTitle>Subscription</BentoItemTitle>
          <BentoItemDescription>
            Recurring plans billed monthly or annually.
          </BentoItemDescription>
        </BentoBlock>

        <BentoBlock
          onClick={() => handleClick(BusinessModelType.Hybrid)}
          selected={currentValue === BusinessModelType.Hybrid}
        >
          <BentoItemIconContainer>
            <TagIcon size={72} />
          </BentoItemIconContainer>
          <BentoItemTitle>Hybrid</BentoItemTitle>
          <BentoItemDescription>
            Don’t worry — Majik Runway supports mixed models. This just sets
            your starting point.
          </BentoItemDescription>
        </BentoBlock>
      </BentoBlockContainer>
    </RootContainer>
  );
};

export default MajikRunwayModelSelector;
