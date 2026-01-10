"use client";
import styled from "styled-components";

export const DividerGlobal = styled.div`
  height: 1px;
  width: 100%;
  box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.1);
  opacity: 0.9;
  background-color: ${({ theme }) => theme.colors.secondaryBackground};
`;

export const DividerVertical = styled.div`
  width: 1px;
  height: 100%;
  box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.1);
  opacity: 0.9;
  background-color: ${({ theme }) => theme.colors.secondaryBackground};
`;

interface TitleSubHeaderProps {
  $autowrap?: boolean;
  alignment?: "left" | "center" | "right";
}

export const TitleSubHeader = styled.h2<TitleSubHeaderProps>`
  background-color: transparent;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.typography.sizes.subject};
  font-weight: ${({ theme }) => theme.typography.weights.title};
  text-align: ${(props) => (props.alignment ? props.alignment : "left")};
  white-space: ${(props) => (props.$autowrap ? "normal" : "nowrap")};
  text-overflow: ellipsis;
  user-select: none;
  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

export const TitleHeader = styled.h1`
  background-color: transparent;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.typography.sizes.header};
  font-weight: ${({ theme }) => theme.typography.weights.title};
  text-align: left;
  min-width: 270px;

  text-overflow: ellipsis;
  user-select: none;

  @media (max-width: 768px) {
    min-width: 200px;
    font-size: ${({ theme }) => theme.typography.sizes.title};
  }
`;

export const Subtext = styled.p`
  background-color: transparent;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.typography.sizes.body};
  font-weight: ${({ theme }) => theme.typography.weights.body};
  text-align: left;
  white-space: normal;
  user-select: none;
`;

export const DropShadowFrameContainer = styled.div`
  width: auto;
  min-width: 300px;
  padding: 25px;
  gap: 25px;

  display: flex;
  height: auto;
  margin: 20px 25px;
  align-items: center;

  border: 1px solid transparent;
  border-radius: ${({ theme }) => theme.borders.radius.large};
  display: flex;
  flex-direction: column;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.1);
`;

export const MainBodyContainer = styled.div`
  width: 100%;
  align-items: center;
  justify-content: flex-start;
  display: flex;
  flex-direction: column;
  user-select: none;
  height: auto;
  gap: 5px;
`;

interface SectionTitleProps {
  alignment?: "left" | "center" | "right";
}

export const SectionTitle = styled.p<SectionTitleProps>`
  width: 100%;
  padding: 10px 15px;
  font-size: 20px;
  font-weight: 700;
  border-radius: ${({ theme }) => theme.borders.radius.medium};
  margin: 10px 0px;
  color: ${({ theme }) => theme.colors.primaryBackground};

  background: linear-gradient(
    to left,
    ${({ theme }) => theme.colors.primaryBackground},
    ${({ theme }) => theme.colors.primary}
  );
  text-align: ${(props) => props.alignment || "left"};
`;

export const SectionTitleFrame = styled.div<SectionTitleProps>`
  width: 100%;
  padding: 10px 15px;
  font-size: 20px;
  font-weight: 700;
  border-radius: ${({ theme }) => theme.borders.radius.medium};
  margin: 10px 0px;
  color: ${({ theme }) => theme.colors.primaryBackground};
  background: linear-gradient(
    to left,
    ${({ theme }) => theme.colors.primaryBackground},
    ${({ theme }) => theme.colors.primary}
  );
  text-align: ${(props) => props.alignment || "left"};
`;

export const SectionSubTitle = styled.div<SectionTitleProps>`
  width: 100%;
  padding: 10px 0px;
  font-size: 20px;
  font-weight: 700;

  margin: 10px 0px;
  margin-bottom: 15px;
  color: ${({ theme }) => theme.colors.primary};
  text-align: ${(props) => props.alignment || "left"};
  border-bottom: 2px solid ${({ theme }) => theme.colors.primary};
`;

export const GeneralStatus = styled.div`
  width: auto;
  padding: 15px 40px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  background-color: ${({ theme }) => theme.colors.secondaryBackground};
  display: flex;
  height: auto;
  margin: 20px 25px;
  align-items: center;

  border: 1px solid transparent;
  border-radius: ${({ theme }) => theme.borders.radius.large};
  display: flex;
  flex-direction: column;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.1);
`;

export const GeneralColumnMerger = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
  width: 100%;
`;

export const GenericMessageBox = styled.div<{ $alignment?: "center" | "left" }>`
  padding: 15px 25px;
  width: 100%;
  text-align: ${({ $alignment }) => ($alignment ? $alignment : "center")};
  align-items: ${({ $alignment }) => ($alignment ? $alignment : "center")};
  justify-content: center;

  border-radius: ${({ theme }) => theme.borders.radius.medium};
  border: 1px solid ${({ theme }) => theme.colors.secondaryBackground};

  strong {
    color: ${({ theme }) => theme.colors.primary};
    font-size: 18px;
  }
`;

export const PaperBackground = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  height: 100%;
  width: 100%;
  background-color: white;
  padding: 35px;
  margin: 0px 30px;
  max-width: 900px;
  color: ${({ theme }) => theme.colors.textPrimary};

  li {
    color: ${({ theme }) => theme.colors.textPrimary};
  }

  @media (max-width: 768px) {
    margin: 0px;
    padding: 35px 20px;
  }
`;

export const DashboardTitle = styled.h1`
  background-color: transparent;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.typography.sizes.title};
  font-weight: ${({ theme }) => theme.typography.weights.title};
  text-align: left;
  min-width: 270px;

  text-overflow: ellipsis;
  user-select: none;

  @media (max-width: 768px) {
    text-align: center;
    min-width: 200px;
    font-size: ${({ theme }) => theme.typography.sizes.subject};
  }
`;

export const WindowRootContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0.4em 1em;
  width: 100%;

  gap: 15px;
  background-color: transparent;
  align-items: center;

  /* Hide scrollbar for Webkit browsers (Chrome, Safari, etc.) */
  &::-webkit-scrollbar {
    display: none;
  }
  /* Hide scrollbar for IE, Edge, and Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */

  @media (max-width: 768px) {
    padding: 0px;
    margin: 5em 0.1em;
    margin-top: 1em;
    max-width: 380px;
  }
`;

export const MobileView = styled.div`
  display: none;
  gap: 10px;

  height: 100%;
  width: 100%;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
  }
`;

export const DesktopView = styled.div`
  height: 100%;
  width: 100%;

  @media (max-width: 768px) {
    display: none;
  }
`;
