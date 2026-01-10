"use client";

import { ButtonPrimaryConfirm } from "@/globals/buttons";
import { preloadedNavigation } from "@/utils/navigation";

import React, { type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

// Styled component for the frosted glass effect and full space usage
const PlaceholderContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: inherit;
  margin-top: 15px;
  border-radius: 10px;
  drop-shadow: 1px 2px 3px rgba(0, 0, 0, 0.2);
  text-align: center;
  user-select: none;
  overflow: hidden;
  gap: 3em;
`;

const StyledText = styled.div`
  display: flex;
  flex-direction: column;
  padding: 25px;
  color: ${({ theme }) => theme.colors.textPrimary};
  justify-content: center;
  align-items: center;

  font-weight: 400;
  max-width: 600px; /* Adjust width as needed */

  /* Dynamic font size */
  font-size: clamp(14px, 1vw, 18px); /* Min: 12px, Preferred: 2vw, Max: 24px */

  @media (max-width: 768px) {
    width: 250px;
  }
`;

const ButtonColumn = styled.div`
  max-width: 500px;
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;

  button {
    width: 100%;
  }

  @media (max-width: 768px) {
    max-width: 320px;
  }
`;

const Image = styled.img`
  width: 250px;
  aspect-ratio: 1/1;
  user-select: none; /* Disable text selection */
  border-radius: 50%;
  object-fit: contain;

  @media (max-width: 768px) {
    width: 250px;
  }
`;

// Type definition for the props
interface ErrorPlaceholderProps {
  children: ReactNode;
  path?: string;
}

// Stateless functional component
const ErrorPlaceholder: React.FC<ErrorPlaceholderProps> = ({
  children,
  path = "",
}) => {
  const navigate = useNavigate();
  const handleGoBack = () =>
    !!path && path.trim() !== ""
      ? preloadedNavigation(path, navigate)
      : preloadedNavigation("/", navigate);

  const handleRefresh = () => window.location.reload();

  return (
    <PlaceholderContainer>
      <StyledText>{children}</StyledText>
      <Image src={"/Logo_MajikRunway_256px.png"} alt="Error Placeholder" />
      <ButtonColumn>
        <ButtonPrimaryConfirm onClick={handleGoBack}>
          Go Back
        </ButtonPrimaryConfirm>
        <ButtonPrimaryConfirm onClick={handleRefresh}>
          Refresh
        </ButtonPrimaryConfirm>
      </ButtonColumn>
    </PlaceholderContainer>
  );
};

export default ErrorPlaceholder;
