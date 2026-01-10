'use client';

import React, { useState } from 'react';
import styled from 'styled-components';

import { TrashIcon } from '@heroicons/react/24/solid';


import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { ButtonPrimaryConfirm } from '../../globals/buttons';




interface DeleteButtonProps {
  onClick?: () => void;
  onCancel?: () => void;
  title?: string;
}

// Styled button component for icon
const IconButton = styled.button`
  background-color: transparent;
  color: ${({ theme }) => theme.colors.error};
  border: none;
  border-radius: 8px;
  padding: 5px;
  aspect-ratio: 1/1;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.primaryBackground};
      background-color: ${({ theme }) => theme.colors.primary};
  }

  &:focus {
    outline: none;
  }
`;

// Styled overlay for the dialog
const Overlay = styled(AlertDialog.Overlay)`
  background: rgba(0, 0, 0, 0.5); 
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
const DialogContent = styled(AlertDialog.Content)`
  background: ${({ theme }) => theme.colors.primaryBackground};
  backdrop-filter: blur(50px); 
  border-radius: ${({ theme }) => theme.borders.radius.large};
  padding: 2.5em;
  width: 350px;
  max-width: 90vw;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid transparent;
  justify-content: center;
  align-items: center;
  display: flex;
  flex-direction: column;
`;

// Styled dialog title
const DialogTitle = styled(AlertDialog.Title)`
  font-size: 18px;
  margin-bottom: 2em;
  color: ${({ theme }) => theme.colors.primary};
`;

// Styled dialog description
const DialogDescription = styled(AlertDialog.Description)`
  font-size: 14px;
  margin-bottom: 3em;
  text-align: center;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const StyledDeleteConfirmButton = styled(ButtonPrimaryConfirm)`
  background: ${({ theme }) => theme.colors.error};
  border: 1px solid transparent;
  color: white;
  width: 130px;
  transition: background 0.3s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryBackground};
    border: 1px solid ${({ theme }) => theme.colors.error};
    color: ${({ theme }) => theme.colors.error};
  }
`;

const StyledCancelButton = styled(ButtonPrimaryConfirm)`
  background: ${({ theme }) => theme.colors.primaryBackground};
      color: ${({ theme }) => theme.colors.textPrimary};
  width: 130px;
`;

const DeleteButton: React.FC<DeleteButtonProps> = ({ onClick, onCancel, title = "item" }) => {
  const [open, setOpen] = useState<boolean>(false);

  const handleOnDelete = () => {
    if (onClick) onClick();
    setOpen(false); // Close dialog after confirming
  };

  const handleOnCancel = () => {
    if (onCancel) onCancel();
    setOpen(false); // Close dialog after confirming
  };

  return (
    <>
      <IconButton onClick={() => setOpen(true)}>
        <TrashIcon width={20} height={20} />
      </IconButton>
      <AlertDialog.Root open={open} onOpenChange={setOpen}>
        <AlertDialog.Portal>
          <Overlay>
            <DialogContent>
              <DialogTitle>Confirm Delete</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this {title}? This action cannot be undone.
              </DialogDescription>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '25px' }}>
                <StyledCancelButton onClick={handleOnCancel}>Cancel</StyledCancelButton>
                <StyledDeleteConfirmButton onClick={handleOnDelete}>Delete</StyledDeleteConfirmButton>
              </div>
            </DialogContent>
          </Overlay>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </>
  );
};

export default DeleteButton;
