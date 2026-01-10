"use client";

import React, { useState, useEffect, type ReactNode } from "react";
import styled from "styled-components";
import * as AlertDialog from "@radix-ui/react-alert-dialog";

import { ButtonPrimaryConfirm } from "@/globals/buttons";
import {
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogTitle,
} from "@/globals/styled-dialogs";

const StyledButton = styled(ButtonPrimaryConfirm)`
  background: ${({ theme }) => theme.colors.error};
  border: 1px solid transparent;
  color: white;
  width: 130px;
  padding: 10px;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryBackground};
    border: 1px solid ${({ theme }) => theme.colors.error};
    color: ${({ theme }) => theme.colors.error};
  }
`;

interface ConnectionDetectorProps {
  children: ReactNode;
}

const ConnectionDetector: React.FC<ConnectionDetectorProps> = ({
  children,
}) => {
  const [isOffline, setIsOffline] = useState(false);
  const [isSlow, setIsSlow] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Ensure this code runs only on the client
    if (typeof window === "undefined") return;

    const handleOffline = () => {
      setIsOffline(true);
      setOpen(true);
    };

    const handleOnline = () => {
      setIsOffline(false);
      setIsSlow(false);
      setOpen(false);
    };

    const handleConnectionChange = () => {
      if ("connection" in navigator) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const connection = navigator.connection as any;
        if (
          connection &&
          (connection.downlink < 0.35 || connection.rtt > 2000)
        ) {
          setIsSlow(true);
          setOpen(true);
        } else {
          setIsSlow(false);
          setOpen(false);
        }
      }
    };

    // Add event listeners
    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    if ("connection" in navigator) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const connection = navigator.connection as any;
      connection.addEventListener("change", handleConnectionChange);
    }

    // Cleanup event listeners
    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);

      if ("connection" in navigator) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const connection = navigator.connection as any;
        connection.removeEventListener("change", handleConnectionChange);
      }
    };
  }, []);

  const handleRefreshClick = () => {
    if (typeof window === "undefined") return;

    if (navigator.onLine) {
      if ("connection" in navigator) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const connection = navigator.connection as any;
        if (connection.downlink >= 0.5 && connection.rtt <= 3000) {
          window.location.reload();
        } else {
          setIsSlow(true);
          setOpen(true);
        }
      } else {
        window.location.reload(); // Fallback if `navigator.connection` is unavailable
      }
    } else {
      setIsOffline(true);
      setOpen(true);
    }
  };

  return (
    <>
      <AlertDialog.Root open={open} onOpenChange={setOpen}>
        <AlertDialog.Portal>
          <DialogOverlay>
            <DialogContent>
              <DialogTitle>Connection Issue</DialogTitle>
              <DialogDescription>
                {isOffline
                  ? "You are currently offline. Please check your internet connection."
                  : isSlow
                  ? "Your connection seems really slow. You might experience some delays."
                  : ""}
              </DialogDescription>
              <StyledButton onClick={handleRefreshClick}>Refresh</StyledButton>
            </DialogContent>
          </DialogOverlay>
        </AlertDialog.Portal>
      </AlertDialog.Root>
      {children}
    </>
  );
};

export default ConnectionDetector;
