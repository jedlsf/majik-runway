"use client";

import React from "react";
import styled from "styled-components";


import { ButtonPrimaryConfirm } from "../../globals/buttons";
import { Subtext } from "../../globals/styled-components";
import { isDevEnvironment } from "../../utils/utils";
import { KeyIcon, TextAaIcon } from "@phosphor-icons/react";

// Styled Components
const RootColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: auto;
  padding: 10px;
  gap: 15px;
`;

const RowContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: inherit;
  height: auto;
  padding: 10px;
  flex-direction: row;
  gap: 25px;
`;

const FilterButton = styled(ButtonPrimaryConfirm)<{ isSelected?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 140px;
  padding: 15px;
  background-color: transparent;
  border-radius: 15px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  gap: 5px;
  overflow: hidden;

  border-color: ${({ theme }) => theme.colors.secondaryBackground};
  color: ${({ theme }) => theme.colors.textPrimary};
  cursor: ${({ isSelected }) => (isSelected ? "not-allowed" : "pointer")};
  transition: all 0.4s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.brand.red};
    color: ${({ theme }) => theme.colors.primaryBackground};
    border-color: ${({ theme }) => theme.colors.primaryBackground};
    font-weight: 800;
    opacity: 1;
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.brand.red};
    color: ${({ theme }) => theme.colors.primaryBackground};
    font-weight: 800;
    opacity: 1;
  }
`;

const StyledIcon = styled.div<{ size?: number }>`
  background-color: transparent;
  width: ${({ size }) => size || 150}px;
  height: ${({ size }) => size || 150}px;
  transition: transform 0.4s ease, filter 0.4s ease;
  color: ${({ theme }) => theme.colors.textPrimary};
  ${FilterButton}:hover & {
    transform: scale(1.1);
  }
`;

const TitleContainer = styled.div`
  font-size: 1.3em;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-weight: 600;
  transition: color 0.4s ease, transform 0.4s ease, text-shadow 0.4s ease;

  ${FilterButton}:hover & {
    transform: scale(1.1);
    text-shadow: 0 0 10px ${({ theme }) => theme.colors.primary};
  }

  @media (max-width: 768px) {
    font-size: 1.5em;
  }
`;

const HintContainer = styled(Subtext)`
  color: ${({ theme }) => theme.colors.primaryBackground};
  width: 90%;
  white-space: normal;
  word-break: break-word;
  text-align: center;
  align-items: center;
  justify-content: center;
  font-size: 1em;
  opacity: 0;
  transition: opacity 0.2s ease, transform 0.3s ease;

  ${FilterButton}:hover & {
    opacity: 1;
    color: ${({ theme }) => theme.colors.textSecondary};
  }

  @media (max-width: 768px) {
    font-size: 10px;
    opacity: 1;
    color: ${({ theme }) => theme.colors.textPrimary};
  }

  ${FilterButton}:active & {
    color: ${({ theme }) => theme.colors.primaryBackground};
  }
`;

// Props Interface
interface DynamicMenuSelectorProps {
  onSelect?: (type: string) => void;
  readOnly?: boolean;
  currentValue?: string;
}

// Component
const DynamicMenuSelector: React.FC<DynamicMenuSelectorProps> = ({
  onSelect,
  readOnly,
  currentValue,
}) => {
  const handleClick = (type: string) => {
    if (!readOnly) {
      if (onSelect) onSelect(type);
      if (isDevEnvironment()) console.log("Clicked: ", type);
    }
  };

  return (
    <RootColumn>
      <RowContainer>
        <FilterButton
          onClick={() => handleClick("backup")}
          disabled={currentValue === "backup"}
        >
          <StyledIcon as={TextAaIcon} size={36} />
          <TitleContainer>Backup</TitleContainer>
          <HintContainer>Import with backup key</HintContainer>
        </FilterButton>

        <FilterButton
          onClick={() => handleClick("mnemonic")}
          disabled={currentValue === "mnemonic"}
        >
          <StyledIcon as={KeyIcon} />
          <TitleContainer>Mnemonic</TitleContainer>
          <HintContainer>Import with Mnemonic Seed Phrase</HintContainer>
        </FilterButton>
      </RowContainer>
    </RootColumn>
  );
};

export default DynamicMenuSelector;
