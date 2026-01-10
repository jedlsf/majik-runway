"use client";

import React, { Component, type ErrorInfo, type ReactNode } from "react";

import styled from "styled-components";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { ButtonPrimaryConfirm } from "@/globals/buttons";
import { toast, Toaster } from "sonner";
import ErrorPlaceholder from "../foundations/ErrorPlaceholder";


interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

const ErrorTitle = styled.h2`
  padding: 15px;
  color: ${({ theme }) => theme.colors.primary};
`;

const ErrorSubTitle = styled.p`
  padding: 15px;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const ErrorMessageText = styled.h3`
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 14px;
`;

const ErrorStackBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const ErrorMessageStack = styled.pre`
  color: ${({ theme }) => theme.colors.textPrimary};
  width: 100%;
  font-size: 12px;
  white-space: pre-wrap; /* Allows line breaks inside <pre> */
  word-break: break-word; /* Breaks long words/URLs if needed */
  overflow-wrap: break-word; /* Fallback for better browser support */
`;

interface State {
  hasError: boolean;
  error?: Error;
  isViewingErrorStack: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = {
    hasError: false,
    error: undefined,
    isViewingErrorStack: false,
  };

  private dialogRef = React.createRef<HTMLDivElement>();

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      isViewingErrorStack: false,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn("Uncaught error:", error, errorInfo);

    // // Convert errorInfo.componentStack into a plain string for Sentry
    // Sentry.withScope((scope) => {
    //   scope.setExtras({
    //     componentStack: errorInfo.componentStack,
    //   });
    //   scope.setTag("component", "ErrorBoundary");
    //   scope.setContext("AppInfo", {
    //     environment: process.env.NODE_ENV,
    //     url: typeof window !== "undefined" ? window.location.href : "server",
    //   });
    //   Sentry.captureException(error);
    // });
  }

  handleCancel = () => {
    this.setState({ isViewingErrorStack: false });
  };

  handleOpenStack = () => {
    this.setState({ isViewingErrorStack: true });
  };

  handleClickOutside = (e: React.MouseEvent<Element>) => {
    if (
      this.dialogRef.current &&
      !this.dialogRef.current.contains(e.target as Node)
    ) {
      this.handleCancel(); // User clicked outside the dialog content
    }
  };

  handleCopy = () => {
    navigator.clipboard.writeText(this.state.error?.stack || "Not Available");
    toast.message("Copied to clipboard", {
      description: this.state.error?.stack,
      id: `error-stack-${this.state.error?.name}`,
    });
  };

  render() {
    if (this.state.hasError) {
      const stackLines = this.state.error?.stack?.split("\n") ?? [];

      return (
        <ErrorPlaceholder>
          <ErrorTitle>Something went wrong on this page.</ErrorTitle>
          <ErrorMessageText>{this.state.error?.message}</ErrorMessageText>
          <ErrorSubTitle>
            We&apos;re still in Early Access, so you may encounter occasional
            issues. Thank you for your patience and support!
          </ErrorSubTitle>

          <ButtonPrimaryConfirm
            onClick={this.handleOpenStack}
            style={{ marginTop: "15px", width: "100%" }}
          >
            View Error Stack
          </ButtonPrimaryConfirm>

          <AlertDialog.Root
            open={this.state.isViewingErrorStack}
            onOpenChange={this.handleCancel}
          >
            <AlertDialog.Portal>
              <Overlay onClick={this.handleClickOutside}>
                <DialogContent ref={this.dialogRef}>
                  <DialogTitle>Error Stack Trace</DialogTitle>
                  <AlertDialog.AlertDialogDescription
                    style={{ padding: "0px 25px", fontSize: "12px" }}
                  >
                    This error has been automatically reported via our internal
                    logging system (Sentry). For extra assurance, you may also
                    copy the stack trace below and send it to our support team
                    at
                    <strong>
                      {" "}
                      <a href="mailto:business@majikah.solutions">
                        business@majikah.solutions
                      </a>
                    </strong>
                    . Thank you for helping us improve during Early Access.
                  </AlertDialog.AlertDialogDescription>
                  <ButtonPrimaryConfirm
                    onClick={this.handleCopy}
                    style={{ marginTop: "15px", width: "90%" }}
                  >
                    Copy
                  </ButtonPrimaryConfirm>
                  <ScrollContainer>
                    <ErrorStackBody>
                      {stackLines.map((line, index) => (
                        <ErrorMessageStack key={index}>
                          {line.trim()}
                        </ErrorMessageStack>
                      ))}
                    </ErrorStackBody>
                  </ScrollContainer>
                </DialogContent>
              </Overlay>
            </AlertDialog.Portal>
          </AlertDialog.Root>
          <Toaster expand={true} position="top-center" />
        </ErrorPlaceholder>
      );
    }

    return this.props.children;
  }
}

const Overlay = styled(AlertDialog.Overlay)`
  background: rgba(0, 41, 104, 0.2);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  backdrop-filter: blur(10px); /* Soft blur effect */
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
  width: 80%;
  padding-top: 1.5em;
  max-width: 550px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid transparent;
  justify-content: flex-start;
  align-items: center;
  display: flex;
  flex-direction: column;
  max-height: 80vh; /* 👈 ADD THIS to limit vertical height */
`;

// Styled dialog title
const DialogTitle = styled(AlertDialog.Title)`
  font-size: 18px;
  margin-bottom: 2em;
  color: ${({ theme }) => theme.colors.primary};
`;

const ScrollContainer = styled.div`
  width: 100%;
  padding: 1.5em;
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch; // IMPORTANT for iOS
  touch-action: pan-y; // Allows drag scroll
  display: flex;
  flex-direction: column;

  /* Custom Scrollbar Styling */
  &::-webkit-scrollbar {
    width: 4px; /* Width of the entire scrollbar */
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0); /* Background color of the scrollbar track */
    border-radius: 24px; /* Rounded corners of the scrollbar track */
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0); /* Color of the scrollbar thumb */
    border-radius: 24px; /* Rounded corners of the scrollbar thumb */
    border: 2px solid #f1f1f1; /* Space around the thumb */
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: rgba(
      0,
      0,
      0,
      0
    ); /* Color when hovering over the scrollbar thumb */
  }

  /* Custom Scrollbar for Firefox */
  scrollbar-width: thin; /* Makes the scrollbar thinner */
  scrollbar-color: ${({ theme }) => theme.colors.primary} rgba(0, 0, 0, 0); /* Thumb and track colors */

  position: relative;

  @media (max-width: 768px) {
    padding: 0px;
  }
`;
