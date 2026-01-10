import React, { type ReactNode, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline';

interface HelperHoverProps {
  children: ReactNode | string;
  darkMode?: boolean;
}

const Container = styled.div`
  position: relative;
  display: inline-block;

  &:hover {
    cursor: pointer;
  }

  &:hover .helper-icon {
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primaryBackground};
    transform: scale(1.05);
  }

  &:hover .helper-tooltip {
    opacity: 1;
    visibility: visible;
  }
`;

const StyledIcon = styled.div<{ $darkMode: boolean }>`
  color: ${({ theme, $darkMode }) => $darkMode ? theme.colors.textSecondary : theme.colors.secondaryBackground};
  width: 25px;
  height: 25px;
  padding: 1px;
  border-radius: 50%;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 100%;
    height: 100%;
    color: ${({ theme, $darkMode }) => $darkMode ? theme.colors.textPrimary : theme.colors.primaryBackground};
  }
`;

const Tooltip = styled.div<{ $position: 'left' | 'right' | 'center' }>`
  position: absolute;
  top: 140%;
  ${({ $position }) =>
    $position === 'left'
      ? 'right: 0; transform: translateX(0);'
      : $position === 'right'
        ? 'left: 0; transform: translateX(0);'
        : 'left: 50%; transform: translateX(-50%);'}

  background: ${({ theme }) => theme.colors.semitransparent};
  backdrop-filter: blur(18px);

  color: ${({ theme }) => theme.colors.textPrimary};
  padding: 0.65rem 1rem;
  border-radius: 12px;
  box-shadow: 0 6px 24px -6px rgba(0, 0, 0, 0.25);
  z-index: 9999;
  font-weight: 400;
  opacity: 0;
  visibility: hidden;
  transition: all 0.25s ease;
  max-width: 360px;
  width: auto;
  white-space: normal;
  word-break: break-word;
  overflow-wrap: break-word;

  @media (max-width: 768px) {
    max-width: 220px;
  }
`;

const TooltipText = styled.p`
  width: 100%;
  text-align: justify;
  min-width: 330px;
  font-size: 12px;
  white-space: normal;
  word-break: break-word;
  overflow-wrap: break-word;
  margin: 0;

  @media (max-width: 768px) {
    min-width: 190px;
  }
`;

const HelperHover: React.FC<HelperHoverProps> = ({ children, darkMode = true }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<'left' | 'right' | 'center'>('center');

  useEffect(() => {
    const handlePosition = () => {
      if (!containerRef.current || !tooltipRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const screenWidth = window.innerWidth;

      if (containerRect.right + tooltipRect.width / 2 > screenWidth) {
        setPosition('left');
      } else if (containerRect.left - tooltipRect.width / 2 < 0) {
        setPosition('right');
      } else {
        setPosition('center');
      }
    };

    handlePosition();
    window.addEventListener('resize', handlePosition);
    return () => window.removeEventListener('resize', handlePosition);
  }, []);

  return (
    <Container ref={containerRef}>
      <StyledIcon
        as={QuestionMarkCircleIcon}
        className="helper-icon"
        aria-hidden="true"
        $darkMode={darkMode}
      />
      <Tooltip className="helper-tooltip" ref={tooltipRef} $position={position}>
        {typeof children === 'string' ? <TooltipText>{children}</TooltipText> : children}
      </Tooltip>
    </Container>
  );
};

export default HelperHover;
