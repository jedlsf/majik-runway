import styled from "styled-components";

export const BentoItemTitle = styled.h3`
  font-size: 24px;
  margin: 0;
  text-align: left;
  line-height: 1.3;

  @media (max-width: 728px) {
    font-size: 16px;
  }
`;

export const BentoItemDescription = styled.p`
  font-size: 14px;
  text-align: left;

  @media (max-width: 728px) {
    font-size: 12px;
  }
`;

export const BentoItemIconContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  background: ${({ theme }) => theme.colors.primaryBackground};
  border-radius: 12px;
  padding: 16px;
  color: ${({ theme }) => theme.colors.primary};
`;

export const BentoItemPreviewContainer = styled.div`
  width: 100%;
  display: flex;
  max-height: 300px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  background: ${({ theme }) => theme.colors.primaryBackground};
  border-radius: 12px;
  color: ${({ theme }) => theme.colors.primary};
  overflow: hidden;
`;

export const BentoItemSquarePreviewContainer = styled.div`
  width: 100%;
  display: flex;
  aspect-ratio: 1/1;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.primaryBackground};
  border-radius: 12px;
  color: ${({ theme }) => theme.colors.primary};
  overflow: hidden;
`;
