
import React from 'react';
import styled from 'styled-components';

const RootContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  width: 85%;
    padding: 10px 20px;
    cursor: pointer;
    


  background-color: rgba(0, 0, 0, 0.4);
  border-radius: 12px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);


  user-select: none;


    transition: transform 0.3s ease;

  &:hover {
    transform: scale(0.98);
    .labelInfo { color: ${({ theme }) => theme.colors.primary};}
  }


`;

const Container = styled.div`

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;

`;

const LabelContainer = styled.div`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.9em;
  font-weight: ${({ theme }) => theme.typography.weights.body};
  text-align: center; 
`;

const ValueContainer = styled.div`
  font-size: 0.8em; 
  font-weight: ${({ theme }) => theme.typography.weights.bold}; 
  text-align: center; /* Center the text */
   color: ${({ theme }) => theme.colors.textPrimary};
`;

const ColorBox = styled.div`
  display: flex;
  justify-content: flex-start;
  width: 15px;
  height: 15px;
  background-color: ${({ color }) => color}; 
  margin-right: 5px;
  border-radius: 50%;
`;


const BaseListItem = ({ label = "Label", value = 0, color = null, onPressed }) => {

  const handleOnPressed = () => {

    if (onPressed) onPressed();

  };

  return (
    <RootContainer onClick={handleOnPressed}>
      <Container>
        <ColorBox color={color} />
        <LabelContainer className='labelInfo'>{label}</LabelContainer>

      </Container>
      <ValueContainer className='valueinfo'>{value}</ValueContainer>
    </RootContainer>
  );
};

export default BaseListItem;
