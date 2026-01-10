import React from "react";
import styled, { css, keyframes } from "styled-components";

/* ----------------------------------
 * Animations
 * ---------------------------------- */

const pulse = (color: string) => keyframes`
  0% {
    box-shadow: 0 0 0 0 ${color}66;
  }
  50% {
    box-shadow: 0 0 0 10px ${color}22;
  }
  100% {
    box-shadow: 0 0 0 0 ${color}66;
  }
`;

/* ----------------------------------
 * Styled Components
 * ---------------------------------- */

const Root = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 15px;
  margin: 20px 0px;
`;

const CircleButton = styled.button<{
  size: number;
  active: boolean;
  color: string;
}>`
  all: unset;
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  background: ${({ active }) =>
    active ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.04)"};

  transition: transform 0.15s ease, background-color 0.2s ease;

  ${({ active, color }) =>
    active &&
    css`
      animation: ${pulse(color)} 2.6s ease-in-out infinite;
    `}

  &:hover {
    transform: scale(1.08);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const MessageText = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

/* ----------------------------------
 * Types
 * ---------------------------------- */

export interface IconOpts {
  icon: React.ComponentType<{ size?: number; color?: string }>;
  color: string;
  message?: string;
}

export interface AnimatedIconToggleProps {
  size: number; // px
  options: {
    on: IconOpts;
    off: IconOpts;
  };
  currentValue: boolean;
  onUpdate: (nextValue: boolean) => void;
}

/* ----------------------------------
 * Component
 * ---------------------------------- */

export const AnimatedIconToggle: React.FC<AnimatedIconToggleProps> = ({
  size,
  options,
  currentValue,
  onUpdate,
}) => {
  const { icon: Icon, color } = currentValue ? options.on : options.off;

  const iconSize = Math.floor(size * 0.55);

  return (
    <Root>
      <CircleButton
        size={size}
        active={currentValue}
        color={options.on.color}
        onClick={() => onUpdate(!currentValue)}
        aria-pressed={currentValue}
      >
        <Icon size={iconSize} color={color} />
      </CircleButton>
      {(!!options?.on?.message?.trim() || !!options?.off?.message?.trim()) && 
          <MessageText>
            {currentValue ? options.on.message : options.off.message}
          </MessageText>
        }
    </Root>
  );
};

export default AnimatedIconToggle;
