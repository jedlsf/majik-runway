'use client';

import React from 'react';
import styled from 'styled-components';

// Define the theme structure for type safety


const RootContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  background-color: ${({ theme }) => theme.colors.secondaryBackground};
  border-radius: 15px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  min-width: 150px;
  width: inherit;
  height: 80px;

  user-select: none;

  transition: all 0.3s ease;

  &:hover {

    .valueinfo {
      color: ${({ theme }) => theme.colors.primary};
    }
  }

  padding: 15px;
`;

const LabelContainer = styled.div`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.7em;
  font-weight: ${({ theme }) => theme.typography.weights.body};
  margin-bottom: 10px;
  text-align: center;
`;

const ValueContainer = styled.div`
  font-size: 1.8em;
  font-weight: ${({ theme }) => theme.typography.weights.title};
  text-align: center;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

interface QuickStatInfoProps {
  label?: string;
  value?: number | string;
}

const QuickStatInfo: React.FC<QuickStatInfoProps> = ({ label = "Label", value = 0 }) => {
  return (
    <RootContainer>
      <ValueContainer className='valueinfo'>{value}</ValueContainer>
      <LabelContainer>{label}</LabelContainer>
    </RootContainer>
  );
};

export default QuickStatInfo;
