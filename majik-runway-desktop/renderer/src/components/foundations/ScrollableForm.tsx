"use client";

import React, { type ReactNode } from "react";
import styled from "styled-components";


import DuoButton from "./DuoButton";
import { isDevEnvironment } from "../../utils/helper";
import { ButtonPrimaryConfirm } from "../../globals/buttons";
import { DividerGlobal } from "../../globals/styled-components";

// Styled component for the frosted glass effect and full space usage
const RootContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: auto;
  height: inherit;
  margin: 15px;
  user-select: none;
  overflow: hidden;
  gap: 15px;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const ScrollContainer = styled.div`
  width: inherit;
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch; // IMPORTANT for iOS
  touch-action: pan-y; // Allows drag scroll
  display: flex;
  flex-direction: column;
  max-height: 720px;
  padding: 0px 30px;

  @media (max-width: 768px) {
    padding: 0px;
  }

  /* Custom Scrollbar Styling */
  &::-webkit-scrollbar {
    width: 4px; /* Width of the entire scrollbar */
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0); /* Background color of the scrollbar track */
    border-radius: 24px; /* Rounded corners of the scrollbar track */
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0); /* Color of the scrollbar thumb */
    border-radius: 24px; /* Rounded corners of the scrollbar thumb */
    border: 2px solid ${({ theme }) => theme.colors.textSecondary}; /* Space around the thumb */
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: rgba(
      0,
      0,
      0,
      0
    ); /* Color when hovering over the scrollbar thumb */
  }

  /* Custom Scrollbar for Firefox */
  scrollbar-width: thin; /* Makes the scrollbar thinner */
  scrollbar-color: ${({ theme }) => theme.colors.accent} rgba(0, 0, 0, 0); /* Thumb and track colors */

  position: relative;
`;

// Type definition for the props
interface ScrollableFormProps {
  children: ReactNode;
  textCancelButton?: string;
  textProceedButton?: string;
  onClickCancel: () => void;
  onClickProceed: () => void;
  isDisabledCancel?: boolean;
  isDisabledProceed?: boolean;
  onDebug?: () => void;
}

// Stateless functional component
const ScrollableForm: React.FC<ScrollableFormProps> = ({
  children,
  textCancelButton = "Cancel",
  textProceedButton = "Proceed",
  onClickCancel,
  onClickProceed,
  isDisabledCancel = false,
  isDisabledProceed = false,
  onDebug,
}) => {
  return (
    <RootContainer>
      <ScrollContainer>{children}</ScrollContainer>
      <DividerGlobal />
      <DuoButton
        textButtonA={textCancelButton}
        textButtonB={textProceedButton}
        onClickButtonA={onClickCancel}
        onClickButtonB={onClickProceed}
        isDisabledButtonA={isDisabledCancel}
        isDisabledButtonB={isDisabledProceed}
        strictMode={true}
      />
      {isDevEnvironment() && (
        <ButtonPrimaryConfirm onClick={onDebug}>
          View Class Instance
        </ButtonPrimaryConfirm>
      )}
    </RootContainer>
  );
};

export default ScrollableForm;
