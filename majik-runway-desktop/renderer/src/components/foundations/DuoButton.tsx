"use client";

import React, { useState } from "react";
import styled from "styled-components";
import { ButtonPrimaryConfirm } from "../../globals/buttons";

import * as AlertDialog from "@radix-ui/react-alert-dialog";

interface RowProps {
  $enableColumn?: boolean;
}

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

const StyledConfirmButton = styled(ButtonPrimaryConfirm)`
  background-color: ${({ theme }) => theme.colors.brand.red};
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

const RowContainer = styled.div<RowProps>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  max-width: 450px;
  gap: 1em;

  @media (max-width: 768px) {
    max-width: 340px;
    flex-direction: ${(props) => (props.$enableColumn ? "column" : "row")};
  }
`;

const ButtonA = styled(ButtonPrimaryConfirm)`
  min-width: 140px;
  width: inherit;
  background-color: ${({ theme }) => theme.colors.brand.red};
  color: ${({ theme }) => theme.colors.textPrimary};

  &:hover {
    border-color: ${({ theme }) => theme.colors.brand.red};
    color: ${({ theme }) => theme.colors.brand.red};
  }
`;

const ButtonB = styled(ButtonPrimaryConfirm)`
  min-width: 140px;
  width: inherit;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.primaryBackground};
`;

interface DuoButtonProps {
  textButtonA?: string;
  textButtonB?: string;
  onClickButtonA: () => void;
  onClickButtonB: () => void;
  isDisabledButtonA?: boolean;
  isDisabledButtonB?: boolean;
  enableColumn?: boolean;
  strictMode?: boolean;
}

const DuoButton: React.FC<DuoButtonProps> = ({
  textButtonA = "Cancel",
  textButtonB = "Proceed",
  onClickButtonA,
  onClickButtonB,
  isDisabledButtonA = false,
  isDisabledButtonB = false,
  enableColumn = false,
  strictMode = false,
}) => {
  const [open, setOpen] = useState<boolean>(false);

  const handleOnConfirm = () => {
    onClickButtonB?.();
    setOpen(false); // Close dialog after confirming
  };

  const handleOnCancel = () => {
    setOpen(false); // Close dialog after confirming
  };

  const handleOnStrictClick = () => {
    setOpen(true); // Close dialog after confirming
  };

  return (
    <>
      <RowContainer $enableColumn={enableColumn}>
        <ButtonA onClick={onClickButtonA} disabled={isDisabledButtonA}>
          {textButtonA}
        </ButtonA>
        <ButtonB
          onClick={strictMode ? handleOnStrictClick : onClickButtonB}
          disabled={isDisabledButtonB}
        >
          {textButtonB}
        </ButtonB>
      </RowContainer>
      <AlertDialog.Root open={open} onOpenChange={setOpen}>
        <AlertDialog.Portal>
          <Overlay>
            <DialogContent>
              <DialogTitle>Confirm Action</DialogTitle>
              <DialogDescription>
                Are you sure you want to proceed with this action?
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

export default DuoButton;
