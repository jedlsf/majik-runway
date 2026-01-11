"use client";

import React, { type ComponentType, type ButtonHTMLAttributes } from "react";
import styled from "styled-components";
import { Tooltip } from "react-tooltip";
import theme from "../../globals/theme";

// Define your styled button with default styles
const IconButton = styled.button<{ $darkMode: boolean; $size: number }>`
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: 8px;
  width: ${({ $size }) => `${$size * 1.4}px`};
  height: ${({ $size }) => `${$size * 1.4}px`};
  cursor: pointer;
  color: ${({ theme, $darkMode }) =>
    $darkMode
      ? theme.colors.primaryBackground
      : theme.colors.textPrimary}; // Hover background color
  transition: all 0.3s ease;

  &:hover {
    background: ${({ theme, $darkMode }) =>
      $darkMode
        ? theme.colors.primaryBackground
        : theme.colors.primary}; // Hover background color
    color: ${({ theme, $darkMode }) =>
      $darkMode
        ? theme.colors.textPrimary
        : theme.colors.primaryBackground}; // Hover background color
  }

  &:focus {
    outline: none;
  }

  &:disabled {
    color: ${({ theme, $darkMode }) =>
      $darkMode
        ? theme.colors.secondaryBackground
        : theme.colors.secondaryBackground}; // Hover background color

    &:hover {
      background: ${({ theme, $darkMode }) =>
        $darkMode
          ? theme.colors.primaryBackground
          : "transparent"}; // Hover background color
    }
  }

  svg {
    width: ${({ $size }) => `${$size}px`};
    height: ${({ $size }) => `${$size}px`};
    aspect-ratio: 1;
    color: currentColor; // Use currentColor to inherit the button's color
  }
`;

// Define the props type for the IconButton component
interface StyledIconButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ComponentType;
  darkMode?: boolean;
  size?: number;
  tooltip?: string;
}

// IconButton component
const StyledIconButton: React.FC<StyledIconButtonProps> = ({
  icon: Icon,
  tooltip = "",
  darkMode = false,
  size = 15,
  ...props
}) => {
  return (
    <IconButton
      {...props}
      $darkMode={darkMode}
      $size={size}
      data-tooltip-id={`rtip-button-${Icon.displayName}`}
      data-tooltip-content={`${tooltip ? tooltip : ""}`}
      title={props.title}
    >
      <Icon />
      {!!tooltip && tooltip.trim() !== "" ? (
        <Tooltip
          id={`rtip-button-${Icon.displayName}`}
          style={{
            fontSize: 12,
            fontWeight: 400,
            backgroundColor: theme.colors.secondaryBackground,
            zIndex: theme.zIndex.topmost,
            color: theme.colors.textPrimary
          }}
        />
      ) : null}
    </IconButton>
  );
};

export default StyledIconButton;
