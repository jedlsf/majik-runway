import styled from "styled-components";
import { ButtonPrimaryConfirm } from "./buttons";

import { Drawer } from 'vaul';

// Styled components based on the provided CSS
export const StyledDialogOverlay = styled(Drawer.Overlay)`
  position: fixed;
  inset: 0;
  background-color: rgba(1, 30, 75, 0.6);
  animation: overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1);
  width: 100vw;
  backdrop-filter: blur(5px);
  z-index: ${({ theme }) => theme.zIndex.overlay};
`;

export const ScrollContainer = styled.div`
  width: 100%;
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch; // IMPORTANT for iOS
  touch-action: pan-y; // Allows drag scroll
  display: flex;
  flex-direction: column;

  position: relative;


    @media (max-width: 768px) {
        padding: 0px;
    }
`;


export const StyledDialogContent = styled(Drawer.Content) <{ $width?: number }>`
  background:  ${({ theme }) => theme.colors.primaryBackground};
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100vh;
  margin-left: 25px;

  position: fixed;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  width: ${({ $width }) => !!$width && $width > 0 ? `${$width}px` : "500px"};
  top: 0;
  right: 0;
  z-index: ${({ theme }) => theme.zIndex.overlay};
  backdrop-filter: blur(45px);

  @media (max-width: 768px) {
background-color:  ${({ theme }) => theme.colors.primaryBackground};
    width: 100%;
    right: 0;

    margin-left: 0px;
    margin-right: 0px;
  }
`;

export const StyledDialogTitle = styled(Drawer.Title)`
height: 0px;
display: none;
`;



export const StyledDialogDescription = styled(Drawer.Description)`
height: 0px;
display: none;
`;



export const CloseButton = styled(ButtonPrimaryConfirm)`
  width: 100%;
  height: 25px;
  background-color: ${({ theme }) => theme.colors.secondaryBackground};
  color: ${({ theme }) => theme.colors.primary};
  border: 0px transparent;
  border-radius: 0px;
  padding: 5px;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.14);
  transition: height 0.18s ease-in, box-shadow 0.3s ease-in, background-color 0.1s ease-in;

  &:hover {
    height: 40px;
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primaryBackground};
    box-shadow: 0 5px 9px rgba(0, 0, 0, 0.24);
  
  }
`;




