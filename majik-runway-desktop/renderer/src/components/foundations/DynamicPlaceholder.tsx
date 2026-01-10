'use client';

import React, { type ReactNode } from 'react';
import styled from 'styled-components';

import { DotLoader } from "react-spinners";
import { ButtonPrimaryConfirm } from '../../globals/buttons';
import theme from '../../globals/theme';

// Styled component for the frosted glass effect and full space usage
const PlaceholderContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 90%;
  height: inherit;
  margin: 15px;
  border-radius: 10px;
  drop-shadow: 1px 2px 3px rgba(0, 0, 0, 0.2);
  text-align: center;
  user-select: none;
  overflow: hidden;
  padding: 20px 5px;
`;

const StyledText = styled.div`
  padding: 10px 25px;
  color: ${({ theme }) => theme.colors.textPrimary};
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 450px; /* Adjust width as needed */

  /* Dynamic font size */
  font-size: clamp(10px, 1vw, 14px);  /* Min: 12px, Preferred: 2vw, Max: 24px */

     @media (max-width: 768px) {
        max-width: 250px; /* Adjust width as needed */
    }
`;

// Type definition for the props
interface DynamicPlaceholderProps {
  children: ReactNode;
  loading?: boolean;
  onActionClick?(): void;
  actionButtonText?: string;
}

// Stateless functional component
const DynamicPlaceholder: React.FC<DynamicPlaceholderProps> = ({ children, loading = false, onActionClick, actionButtonText }) => {
  return (
    <PlaceholderContainer>
      {
        loading
          ?
          <DotLoader
            color={theme.colors.primary}
            loading={true}
            size={70}
            aria-label="Loading Spinner"
            data-testid="loader"
            speedMultiplier={1.3}

          />

          :

          null

      }
      <StyledText>
        {children}
      </StyledText>
      {
        !!onActionClick && !!actionButtonText && actionButtonText.trim() !== "" &&
        < ButtonPrimaryConfirm
          onClick={onActionClick}
        >
          {actionButtonText}
        </ButtonPrimaryConfirm>
      }
    </PlaceholderContainer >
  );
};

export default DynamicPlaceholder;
