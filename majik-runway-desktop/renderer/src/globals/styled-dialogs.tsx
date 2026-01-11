




import { ButtonPrimaryConfirm } from "@/globals/buttons";
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import styled from "styled-components";








// Styled overlay for the dialog
export const DialogOverlay = styled(AlertDialog.Overlay)`
  background: rgba(1, 30, 75, 0.6);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  backdrop-filter: blur(5px); /* Soft blur effect */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: ${({ theme }) => theme.zIndex.topmost};
`;

// Styled dialog content
export const DialogContent = styled(AlertDialog.Content)`
  background: ${({ theme }) => theme.colors.primaryBackground};
  backdrop-filter: blur(50px); 
  border-radius: ${({ theme }) => theme.borders.radius.large};
  padding: 2.5em;
  gap: 10px;
  width: 550px;
  max-width: 90vw;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid transparent;
  justify-content: center;
  align-items: center;
  display: flex;
  flex-direction: column;

`;

// Styled dialog title
export const DialogTitle = styled(AlertDialog.Title)`
  font-size: 18px;
  margin-bottom: 2em;
  color: ${({ theme }) => theme.colors.primary};
`;

// Styled dialog description
export const DialogDescription = styled(AlertDialog.Description)`
  font-size: 14px;
  margin-bottom: 3em;
  text-align: center;
  color: ${({ theme }) => theme.colors.textSecondary};
`;




export const DialogConfirmButton = styled(ButtonPrimaryConfirm)`
  background: ${({ theme }) => theme.colors.primary};
  border: 1px solid transparent;
  color: white;
  width: 130px;
  transition: background 0.3s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryBackground};
    border: 1px solid ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const DialogCancelButton = styled(ButtonPrimaryConfirm)`
  background: ${({ theme }) => theme.colors.primaryBackground};
    border: 1px solid ${({ theme }) => theme.colors.secondaryBackground};
      color: ${({ theme }) => theme.colors.textPrimary};
  width: 130px;
`;


