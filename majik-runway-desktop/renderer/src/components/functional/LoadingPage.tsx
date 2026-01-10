"use client";

import React, { type ReactNode, useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import DynamicPlaceholder from "../foundations/DynamicPlaceholder";

/* ---------------- Animations ---------------- */

const progressAnimation = keyframes`
  from {
    width: 0%;
  }
  to {
    width: 100%;
  }
`;

/* ---------------- Styled Components ---------------- */

const Root = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

const LoadingContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
`;

const ProgressBarWrapper = styled.div`
  width: 60%;
  max-width: 360px;
  height: 6px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 999px;
  overflow: hidden;
`;

const ProgressBar = styled.div<{ $durationMs: number }>`
  height: 100%;
  width: 0%;
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.accent},
    ${({ theme }) => theme.colors.brand.green}
  );
  animation: ${progressAnimation} ${({ $durationMs }) => $durationMs}ms linear
    forwards;
`;

interface LoadingPageProps {
  children: ReactNode;
  /** Time to wait before showing content (in seconds) */
  seconds: number;
  text?: string;
}

/* ---------------- Component ---------------- */

const LoadingPage: React.FC<LoadingPageProps> = ({
  children,
  seconds,
  text = "Loading Page...",
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const durationMs = Math.max(seconds, 0) * 1000;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, durationMs);

    return () => clearTimeout(timer);
  }, [durationMs]);

  return (
    <Root>
      {!isLoaded ? (
        <LoadingContainer>
          <DynamicPlaceholder loading>{text}</DynamicPlaceholder>

          <ProgressBarWrapper>
            <ProgressBar $durationMs={durationMs} />
          </ProgressBarWrapper>
        </LoadingContainer>
      ) : (
        children
      )}
    </Root>
  );
};

export default LoadingPage;
