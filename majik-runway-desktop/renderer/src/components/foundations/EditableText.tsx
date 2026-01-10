"use client";

import React, { useState } from "react";
import styled from "styled-components";
import { PencilSquareIcon } from "@heroicons/react/24/solid";
import CustomInputField from "./CustomInputField";

import { Tooltip } from "react-tooltip";
import { ButtonPrimaryConfirm } from "../../globals/buttons";
// Styled components
const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const DisplayTextRow = styled.div`
  display: flex;

  width: 100%;

  justify-content: flex-start;
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

interface DisplayTextProps {
  $fontSize: number;
  $fontWeight: number;
  $alignment: "left" | "center" | "right";
  $color: string;
  $width?: number;
}

const DisplayTextP = styled.p<DisplayTextProps>`
  color: ${({ $color }) => $color};
  font-size: ${({ $fontSize }) => `${$fontSize}px`};
  font-weight: ${({ $fontWeight }) => $fontWeight};
  text-align: ${({ $alignment }) => $alignment};
  user-select: none;
  margin: unset;
  padding: unset;

  @media (max-width: 768px) {
    font-size: ${({ $fontSize }) => `${$fontSize - 2}px`};
  }
`;

const DisplayTextH1 = styled.h1<DisplayTextProps>`
  color: ${({ $color }) => $color};
  font-size: ${({ $fontSize }) => `${$fontSize}px`};

  text-align: ${({ $alignment }) => $alignment};
  user-select: none;
  margin: unset;
  padding: unset;

  @media (max-width: 768px) {
    font-size: ${({ $fontSize }) => `${$fontSize - 2}px`};
  }
`;

const DisplayTextH2 = styled.h2<DisplayTextProps>`
  color: ${({ $color }) => $color};
  font-size: ${({ $fontSize }) => `${$fontSize}px`};

  text-align: ${({ $alignment }) => $alignment};
  user-select: none;
  margin: unset;
  padding: unset;

  @media (max-width: 768px) {
    font-size: ${({ $fontSize }) => `${$fontSize - 2}px`};
  }
`;

const DisplayTextH3 = styled.h3<DisplayTextProps>`
  color: ${({ $color }) => $color};
  font-size: ${({ $fontSize }) => `${$fontSize}px`};

  text-align: ${({ $alignment }) => $alignment};
  user-select: none;
  margin: unset;
  padding: unset;

  @media (max-width: 768px) {
    font-size: ${({ $fontSize }) => `${$fontSize - 2}px`};
  }
`;

type PasswordRequirement =
  | "DEFAULT"
  | "LETTERS-DIGITS"
  | "CASED-DIGITS"
  | "CASED-DIGITS-SYMBOLS";

// Type definitions for props
interface EditableTextProps {
  label: string;
  required?: boolean;
  isLabelHint?: boolean;
  type?: "email" | "password" | "url" | null | undefined;
  passwordType?: PasswordRequirement;
  overwidth?: boolean;
  currentValue?: string;
  regex?: "alphanumeric" | "alphanumeric-code" | "numbers" | "letters" | "all";
  onChange?: (value: string) => void;
  maxChar?: number;
  minChar?: number;
  allcaps?: boolean;
  onValidated?: (valid: boolean) => void;
  className?: string;
  disabled?: boolean;
  capitalize?: "word" | "character" | "sentence" | "first" | null;
  fontTag?: "p" | "h1" | "h2" | "h3";
  fontSize?: number;
  fontWeight?: number;
  alignment?: "left" | "center" | "right";
  color?: string;
  width?: number;
  darkMode?: boolean;
}

const EditableText: React.FC<EditableTextProps> = ({
  label,
  required = false,
  isLabelHint = false,
  type,
  passwordType = "DEFAULT",
  currentValue = "",
  regex = "all",
  onChange,
  maxChar = 0,
  minChar,
  allcaps = false,
  onValidated,
  className,
  disabled = false,
  capitalize = null,
  fontTag = "p",
  fontSize = 14,
  fontWeight = 400,
  alignment = "left",
  color = "white",
  width = undefined,
  darkMode = false,
}) => {
  const inputValue = currentValue;

  const [isEditing, setIsEditing] = useState<boolean>(false);

  const handleEditText = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleChange = (input: string): void => {
    if (!input || input.trim() === "") {
      return;
    }

    onChange?.(input);
  };

  const getDisplayTextFromTag = (tag: "p" | "h1" | "h2" | "h3") => {
    switch (tag) {
      case "p": {
        return (
          <DisplayTextP
            $fontSize={fontSize}
            $fontWeight={fontWeight}
            $alignment={alignment}
            $color={color}
            $width={width}
          >
            {inputValue}
          </DisplayTextP>
        );
      }
      case "h1": {
        return (
          <DisplayTextH1
            $fontSize={fontSize}
            $fontWeight={fontWeight}
            $alignment={alignment}
            $color={color}
            $width={width}
          >
            {inputValue}
          </DisplayTextH1>
        );
      }
      case "h2": {
        return (
          <DisplayTextH2
            $fontSize={fontSize}
            $fontWeight={fontWeight}
            $alignment={alignment}
            $color={color}
            $width={width}
          >
            {inputValue}
          </DisplayTextH2>
        );
      }
      case "h3": {
        return (
          <DisplayTextH3
            $fontSize={fontSize}
            $fontWeight={fontWeight}
            $alignment={alignment}
            $color={color}
            $width={width}
          >
            {inputValue}
          </DisplayTextH3>
        );
      }
    }
  };

  return (
    <InputWrapper>
      {isEditing ? (
        <>
          <CustomInputField
            label={label}
            required={required}
            isLabelHint={isLabelHint}
            type={type}
            passwordType={passwordType}
            currentValue={inputValue}
            regex={regex}
            onChange={handleChange}
            maxChar={maxChar}
            minChar={minChar}
            allcaps={allcaps}
            onValidated={onValidated}
            className={className}
            disabled={disabled}
            capitalize={capitalize}
          />
          <ButtonPrimaryConfirm onClick={handleCancel}>
            Save Changes
          </ButtonPrimaryConfirm>
        </>
      ) : (
        <DisplayTextRow>
          {getDisplayTextFromTag(fontTag)}
          <IconButton
            $darkMode={darkMode}
            $size={14}
            onClick={handleEditText}
            data-tooltip-id="rtip-edit"
            data-tooltip-content="Edit"
          >
            <PencilSquareIcon />
          </IconButton>
          <Tooltip id="rtip-edit" />
        </DisplayTextRow>
      )}
    </InputWrapper>
  );
};

export default EditableText;

const IconButton = styled.button<{ $darkMode: boolean; $size: number }>`
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: 50%;
  width: ${({ $size }) => `${$size * 1.4}px`};
  height: ${({ $size }) => `${$size * 1.4}px`};
  cursor: pointer;
  color: ${({ theme, $darkMode }) =>
    $darkMode
      ? theme.colors.primaryBackground
      : theme.colors.textPrimary}; // Hover background color
  transition: all 0.3s ease;

  &:hover {
    background: ${({ theme, $darkMode }) =>
      $darkMode
        ? theme.colors.primaryBackground
        : theme.colors.textPrimary}; // Hover background color
    color: ${({ theme, $darkMode }) =>
      $darkMode
        ? theme.colors.textPrimary
        : theme.colors.primaryBackground}; // Hover background color
  }

  &:focus {
    outline: none;
  }

  svg {
    width: ${({ $size }) => `${$size}px`};
    height: ${({ $size }) => `${$size}px`};
    aspect-ratio: 1;
    color: currentColor; // Use currentColor to inherit the button's color
  }
`;
