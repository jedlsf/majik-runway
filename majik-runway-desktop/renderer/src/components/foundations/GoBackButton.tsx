'use client';

import React from 'react';
import styled from 'styled-components';



const ButtonPrimaryConfirm = styled.div`
display: flex;
  font-family: ${({ theme }) => theme.typography.fonts.regular};
  padding: 0.75rem 2rem;
  background-color: ${({ theme }) => theme.colors.secondaryBackground};
  color: ${({ theme }) => theme.colors.textPrimary};
  border: none;
  border-radius: 50px;
  font-size: 24px;
  font-weight: 700;
  cursor: pointer;
  user-select: none;
  align-items: center;
  justify-content: center;
  border: 1px solid transparent;
  box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.18);
  transition: all 0.3s ease;
  width: 40px;
  flex-direction: row;
  height: 40px;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary};
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primaryBackground};
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.30);
    width: 150px;
    font-weight: 500;
    font-size: 18px;
    align-items: space-between;
    justify-content: space-between;
  }

  
  &:disabled {
    background-color: ${({ theme }) => theme.colors.secondaryBackground};
    border-color: ${({ theme }) => theme.colors.secondaryBackground};
    color: ${({ theme }) => theme.colors.textSecondary};
    cursor: not-allowed;
  }

    &:focus,
  &:active {
    outline: none;
    color: ${({ theme }) => theme.colors.primaryBackground};
    background-color: ${({ theme }) => theme.colors.primary};
    border-color: transparent;
  }
`;


const TextContainer = styled.p`
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  width: 0px;
  font-size: 0px;

     text-overflow: ellipsis;
   overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 1; /* Limit to 3 lines */
  -webkit-box-orient: vertical;
  word-break: break-word;

  ${ButtonPrimaryConfirm}:hover & {
    opacity: 1;
    visibility: visible;
    width: auto;
    font-size: 14px;

  }
`;

interface GoBackButtonProps {
  onClick?: () => void;
  onCancel?: () => void;
  text?: string;
  disabled?: boolean;
  strict?: boolean;
}


const GoBackButton: React.FC<GoBackButtonProps> = ({ onClick, text = "Go Back" }) => {

  const handleOnClick = () => {
    onClick?.();
  };


  return (
    <>
      <ButtonPrimaryConfirm onClick={handleOnClick}>
        {`<`}
        <TextContainer>{text}</TextContainer>
      </ButtonPrimaryConfirm>

    </>
  );
};

export default GoBackButton;
