'use client';

import React, { useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { EyeIcon, EyeSlashIcon, ClipboardIcon } from '@heroicons/react/24/solid';

import { toast } from 'sonner';
import HelperHover from './HelperHover';

// Define fade-in keyframes for animation
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

// Define the styled-components for the container, icon, and text
const Container = styled.div<{ $hashint?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 5px;
  width: inherit;
  height: auto;
  transition: all 0.3s ease;
  border: 1px solid transparent;
  background-color: transparent;
  padding: 0px;
  border-radius: 4px;

  ${({ $hashint, theme }) =>
    $hashint &&
    css`
      &:hover {
        background-color: ${theme.colors.primaryBackground};
        color: ${theme.colors.primary};
        border-color: ${theme.colors.primary};
        border-radius: 12px;
        border: 1px solid;
        padding: 10px;
      }
    `}
`;

const ContentContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 5px;
  width: inherit;
`;

const RowContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-direction: row;
  gap: 1em;
`;

const TextKeyRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: row;
  gap: 5px;
`;

const TextKeyContainer = styled.div<{ $dark?: boolean }>`
  font-size: ${({ theme }) => theme.typography.sizes.body};
  font-weight: ${({ theme }) => theme.typography.weights.body};
    color: ${({ theme, $dark }) =>
    $dark ? theme.colors.primaryBackground : theme.colors.textSecondary};
  user-select: none;
    text-align: left;
`;

const TextValueContainer = styled(TextKeyContainer) <{ $highlight?: boolean, $fcolor?: string | null, $extend?: boolean, $dark?: boolean }>`
  font-size: ${({ theme, $highlight }) => $highlight ? theme.typography.sizes.subject : theme.typography.sizes.body}; 
   color: ${({ theme, $highlight, $fcolor, $dark }) =>
    $highlight
      ? $fcolor
        ? $fcolor
        : theme.colors.textPrimary
      : $fcolor
        ? $fcolor
        : $dark
          ? theme.colors.primaryBackground
          : theme.colors.textSecondary};
  font-weight: ${({ theme, $highlight }) => $highlight ? theme.typography.weights.subject : '550'};
  max-width: 230px;
  text-align: right;
 ${({ $extend }) => $extend
    ? 'white-space: normal; overflow: visible; text-overflow: clip;'
    : 'white-space: nowrap; overflow: hidden; text-overflow: ellipsis;'}
`;

const IconContainer = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  padding-top: 5px;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 1em;
`;

// Styled component for the hint text
const HintText = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.hint}; // Placeholder for font size
  color: ${({ theme }) => theme.colors.textSecondary}; // Placeholder for color
  animation: ${fadeIn} 0.3s ease-in-out;
  margin: 5px 15px;
  text-align: left;
  width: 90%;
  max-width: 300px;
`;

export interface RowTextItemProps {
  textKey?: string;
  textValue?: string;
  darkMode?: boolean;
  highlight?: boolean;
  sensitive?: boolean;
  copyable?: boolean;
  hint?: string | null;
  colorValue?: string | null;
  extend?: boolean;
  helper?: string | null;
}

const RowTextItem: React.FC<RowTextItemProps> = ({
  textKey = "Enter label",
  textValue = "Enter value",
  darkMode = false,
  highlight = true,
  sensitive = false,
  copyable = false,
  hint = null,
  colorValue = null,
  extend = false,
  helper = null
}) => {
  const [showValue, setShowValue] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const handleToggle = () => {
    setShowValue((prev) => !prev);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(textValue);
    toast.message('Copied to clipboard', {
      description: textValue,
    });
  };

  return (
    <Container
      $hashint={hint !== null}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <ContentContainer>
        <TextKeyRow>
          <TextKeyContainer $dark={darkMode}>{textKey}</TextKeyContainer>
          {!!helper && helper.trim() !== ""
            ?
            <HelperHover>
              {helper}
            </HelperHover>
            :
            null
          }
        </TextKeyRow>


        <RowContainer>
          {copyable && (
            <IconContainer onClick={handleCopy}>
              <ClipboardIcon />
            </IconContainer>
          )}
          <TextValueContainer $highlight={highlight} $fcolor={colorValue} $extend={extend} $dark={darkMode}>
            {sensitive && !showValue ? '••••••••' : textValue}
          </TextValueContainer>
          {sensitive && (
            <IconContainer onClick={handleToggle}>
              {showValue ? <EyeIcon /> : <EyeSlashIcon />}
            </IconContainer>
          )}
        </RowContainer>
      </ContentContainer>
      {isHovered && hint && (
        <HintText>
          {hint}
        </HintText>
      )}
    </Container>
  );
};

export default RowTextItem;
