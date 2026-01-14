import React, { useEffect } from "react";
import styled from "styled-components";
import { MoonIcon, SunIcon } from "@phosphor-icons/react";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme, type ReduxSystemRootState } from "@/redux/slices/system";

/* ----------------------------------
 * Styled Components
 * ---------------------------------- */

const ToggleButton = styled.button<{ size: number }>`
  all: unset;
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  border-radius: 999px;

  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.textPrimary};

  background: transparent;

  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.primary};
  }

  &:active {
    transform: scale(0.94);
  }
`;

/* ----------------------------------
 * Types
 * ---------------------------------- */

export interface ThemeToggleProps {
  size?: number;
}

/* ----------------------------------
 * Component
 * ---------------------------------- */

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ size = 30 }) => {
  const iconSize = Math.floor(size * 0.55);

  const dispatch = useDispatch();
  const darkMode = useSelector(
    (state: ReduxSystemRootState) => state.system.darkMode
  );

  // Optional: Sync Redux state with <html> class for global dark mode
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <ToggleButton
      size={size}
      onClick={() => dispatch(toggleTheme(!darkMode))}
      aria-pressed={darkMode}
      aria-label="Toggle Dark Mode"
      title="Toggle Dark Mode"
    >
      {darkMode ? (
        <MoonIcon size={iconSize} weight="fill" />
      ) : (
        <SunIcon size={iconSize} weight="fill" />
      )}
    </ToggleButton>
  );
};

export default ThemeToggle;
