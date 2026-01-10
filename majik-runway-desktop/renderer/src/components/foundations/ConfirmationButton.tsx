"use client";

import React, { useState } from "react";
import styled from "styled-components";
import * as AlertDialog from "@radix-ui/react-alert-dialog";

import StyledIconButton from "./StyledIconButton";
import { ButtonPrimaryConfirm } from "../../globals/buttons";

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
  box-sizing: unset;
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

const StyledConfirmButton = styled(ButtonPrimaryConfirm)`
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

const Button = styled(ButtonPrimaryConfirm)`
  min-width: 100px;
`;

interface ConfirmationButtonProps {
  onClick?: () => void;
  onCancel?: () => void;
  text?: string;
  disabled?: boolean;
  strict?: boolean;
  icon?: React.ComponentType;
  alertTextTitle?: string;
}

const ConfirmationButton: React.FC<ConfirmationButtonProps> = ({
  onClick,
  onCancel,
  text = "Confirm",
  disabled = false,
  strict = true,
  icon,
  alertTextTitle = "Confirm Action",
}) => {
  const [open, setOpen] = useState<boolean>(false);

  const handleOnConfirm = () => {
    onClick?.();
    setOpen(false); // Close dialog after confirming
  };

  const handleOnCancel = () => {
    onCancel?.();
    setOpen(false); // Close dialog after confirming
  };

  return (
    <>
      {icon ? (
        <StyledIconButton
          icon={icon}
          size={25}
          onClick={() => setOpen(true)}
          disabled={disabled}
          title={text}
        />
      ) : (
        <Button onClick={() => setOpen(true)} disabled={disabled}>
          {text}
        </Button>
      )}

      <AlertDialog.Root open={open} onOpenChange={setOpen}>
        <AlertDialog.Portal>
          <Overlay>
            <DialogContent>
              <DialogTitle>{alertTextTitle}</DialogTitle>
              <DialogDescription>
                {strict
                  ? "Are you sure you want to proceed with this action? This cannot be undone."
                  : "Are you sure you want to proceed with this action?."}
              </DialogDescription>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "25px",
                }}
              >
                <StyledCancelButton onClick={handleOnCancel}>
                  Cancel
                </StyledCancelButton>
                <StyledConfirmButton onClick={handleOnConfirm}>
                  Proceed
                </StyledConfirmButton>
              </div>
            </DialogContent>
          </Overlay>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </>
  );
};

export default ConfirmationButton;
