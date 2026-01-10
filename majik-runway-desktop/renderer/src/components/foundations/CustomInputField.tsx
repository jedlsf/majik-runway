"use client";

import React, {
  useState,
  type ChangeEvent,
  type KeyboardEvent,
  type JSX,
  useId,
} from "react";
import styled from "styled-components";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";

import { FileJsonIcon } from "lucide-react";
import { ClipboardIcon, TextAaIcon } from "@phosphor-icons/react";

import { Tooltip } from "react-tooltip";
import { dangerousSites } from "../../utils/globalDropdownOptions";
import { isDevEnvironment, isPasswordValidSafe } from "../../utils/helper";

// Styled components
const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: inherit;
`;

const LabelRowContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: inherit;
  gap: 5px;
  align-items: flex-start;
  justify-content: flex-start;

  p {
    margin: 0;
  }
`;

const RequiredAsterisk = styled.p`
  font-size: 12px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  text-align: left;
  user-select: none;
`;

const Label = styled.label<{ $ishelper: boolean }>`
  margin-bottom: ${({ theme }) => theme.spacing.small};
  font-size: ${({ theme, $ishelper }) =>
    $ishelper ? theme.typography.sizes.helper : theme.typography.sizes.label};
  font-weight: 700;
  color: ${({ theme, $ishelper }) =>
    $ishelper ? theme.colors.textSecondary : theme.colors.textPrimary};
  text-align: left;
  display: ${({ $ishelper }) => ($ishelper ? "none" : "block")};
  user-select: none;

  @media (max-width: 768px) {
    font-size: ${({ $ishelper }) => ($ishelper ? "16px" : "18px")};
  }
`;

const InputField = styled.input<{ $haserror: boolean }>`
  padding: 10px 15px;
  background-color: transparent;
  border: 1px solid transparent;
    overflow-hidden;

  font-size: ${({ theme }) => theme.typography.sizes.body};

  border-bottom: 1px solid
    ${({ $haserror, theme }) =>
      $haserror ? theme.colors.error : theme.colors.secondaryBackground};

  outline: none;
  color: ${({ theme }) => theme.colors.textPrimary};
  width: 90%;
  flex-shrink: 1;
  user-select: none;

  &::placeholder {
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: ${({ theme }) => theme.typography.sizes.helper};
  }



  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const HelperText = styled.p`
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.typography.sizes.helper};
  margin-top: ${({ theme }) => theme.spacing.small};
  text-align: right;
  align-self: flex-end;
  user-select: none;
  max-width: 270px;
  width: 100%;
`;

const ToggleIcon = styled.button<{ disabled: boolean }>`
  width: 50px;
  background: none;
  border: none;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.typography.sizes.body};
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  padding-right: 15px;
`;

const CharacterCount = styled.div<{ $isexceeded: boolean }>`
  align-self: flex-end;
  font-size: ${({ theme }) => theme.typography.sizes.helper};
  color: ${({ theme, $isexceeded }) =>
    $isexceeded ? theme.colors.error : theme.colors.textSecondary};
  margin-top: ${({ theme }) => theme.spacing.small};
`;

// Styled component for the import icon button
const ImportButton = styled.button`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.secondaryBackground};
  color: ${({ theme }) => theme.colors.textPrimary};
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid transparent;
  cursor: pointer;
  padding: 0;
  margin-left: 5px;
  transition: all 0.3s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.textSecondary};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const HintText = styled.span`
  font-size: 12px;
  text-align: right;
  font-weight: 300;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: right;
  user-select: none;
`;

type PasswordRequirement =
  | "NONE"
  | "DEFAULT"
  | "LETTERS-DIGITS"
  | "CASED-DIGITS"
  | "CASED-DIGITS-SYMBOLS";

const sanitizeURL = (url: string): boolean => {
  if (!url) return true;

  try {
    const urlObject = new URL(url);
    return dangerousSites.every(
      (site: string) => !urlObject.hostname.includes(site)
    );
  } catch (error) {
    if (isDevEnvironment()) console.warn(error);
    return true;
  }
};

const checkSourceURL = (url: string, whitelist: string[]): boolean => {
  if (!url) return true;

  try {
    const urlObject = new URL(url);
    return whitelist.some(
      (site) =>
        urlObject.hostname === site || urlObject.hostname.endsWith(`.${site}`)
    );
  } catch (error) {
    if (isDevEnvironment()) console.warn(error);
    return false;
  }
};

const validateURL = (url: string): boolean => {
  const urlPattern = /^(https?:\/\/[^\s$.?#].[^\s]*)$/i;
  return urlPattern.test(url) && sanitizeURL(url);
};

// Type definitions for props
interface CustomInputFieldProps {
  label: string;
  required?: boolean;
  isLabelHint?: boolean;
  type?: "email" | "password" | "url" | null | undefined;
  passwordType?: PasswordRequirement;
  overwidth?: boolean;
  currentValue?: string;
  regex?: "alphanumeric" | "alphanumeric-code" | "numbers" | "letters" | "all";
  onChange?: (value: string) => void;
  onBlur?: () => void;
  maxChar?: number;
  minChar?: number;
  allcaps?: boolean;
  onValidated?: (valid: boolean) => void;
  className?: string;
  disabled?: boolean;
  capitalize?: "word" | "character" | "sentence" | "first" | null;
  whitelist?: string[];
  importProp?: {
    type: "json" | "txt" | "clipboard" | "all";
    jsonAccessor?: string;
  };
  helper?: string;
}

const CustomInputField: React.FC<CustomInputFieldProps> = ({
  label,
  required = false,
  isLabelHint = false,
  type,
  passwordType = "DEFAULT",
  currentValue = "",
  regex = "all",
  onChange,
  onBlur,
  maxChar = 0,
  minChar,
  allcaps = false,
  onValidated,
  className,
  disabled = false,
  capitalize = null,
  whitelist,
  importProp,
  helper,
}) => {
  const tooltipId = useId();

  const inputValue = currentValue ?? "";
  const [hasError, setHasError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [charCount, setCharCount] = useState<number>(currentValue.length);

  const validateInput = (value: string): boolean => {
    let regexPattern: RegExp;

    switch (regex) {
      case "alphanumeric":
        regexPattern = /^[a-zA-Z0-9]*$/;
        break;
      case "alphanumeric-code":
        regexPattern = /^[a-zA-Z0-9-_]*$/; // Allows letters, numbers, dashes, and underscores
        break;
      case "numbers":
        regexPattern = /^\d*\.?\d{0,2}$/;
        break;
      case "letters":
        regexPattern = /^[a-zA-Z\s]*$/;
        break;
      case "all":
        return true;
      default:
        regexPattern = /.*/;
        break;
    }

    return regexPattern.test(value) && (value.match(/\s/g) || []).length <= 3;
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const { value } = event.target;
    let error = false;
    let errorText = "";
    const processedValue = allcaps ? value.toUpperCase() : value;
    const characterCount = processedValue.length;
    setCharCount(characterCount);

    if (maxChar > 0 && processedValue.length > maxChar) {
      return;
    }

    if (required && !processedValue.trim()) {
      error = true;
      errorText = "This field is required";
      onValidated?.(false);
    } else if (type === "email" && !validateEmail(processedValue)) {
      error = true;
      errorText = "Please enter a valid email address";
      onValidated?.(true);
    } else if (type === "url") {
      if (processedValue.trim() !== "") {
        const urlIsValidFormat = validateURL(processedValue);
        const urlIsSafe = sanitizeURL(processedValue);
        const urlIsInWhitelist =
          whitelist && whitelist.length > 0
            ? checkSourceURL(processedValue, whitelist)
            : true;

        if (!urlIsValidFormat) {
          error = true;
          errorText = "Enter a valid URL starting with http:// or https://";
          onValidated?.(false);
        } else if (!urlIsSafe) {
          error = true;
          errorText = "This URL is unsafe. Please enter a different URL.";
          onValidated?.(false);
        } else if (!urlIsInWhitelist) {
          error = true;
          errorText =
            "This URL is not allowed. Please use a link from an approved source.";
          onValidated?.(false);
        } else {
          onValidated?.(true); // ✅ URL passes all checks
        }
      } else {
        onValidated?.(false);
      }
    } else if (
      type === "password" &&
      !isPasswordValidSafe(processedValue, minChar, passwordType)
    ) {
      error = true;

      switch (passwordType) {
        case "DEFAULT": {
          errorText = `Please enter a valid password with at least ${
            !!minChar && minChar > 0 ? minChar : 8
          } characters.`;
          break;
        }
        case "LETTERS-DIGITS": {
          errorText = `Please enter a valid password with at least ${
            !!minChar && minChar > 0 ? minChar : 8
          } characters and numbers.`;
          break;
        }
        case "CASED-DIGITS": {
          errorText = `Please enter a valid password with at least ${
            !!minChar && minChar > 0 ? minChar : 8
          } characters and a combination of uppercase-lowercase letters and numbers.`;
          break;
        }
        case "CASED-DIGITS-SYMBOLS": {
          errorText = `Please enter a valid password with at least ${
            !!minChar && minChar > 0 ? minChar : 8
          } characters and a combination of uppercase-lowercase letters, numbers, and symbols.`;
          break;
        }
        default: {
          errorText = `Please enter a valid password with at least ${
            !!minChar && minChar > 0 ? minChar : 8
          } characters.`;
          break;
        }
      }

      onValidated?.(true);
    } else if (!validateInput(processedValue)) {
      error = true;
      errorText = "Invalid input";
      onValidated?.(true);
    }

    setHasError(error);
    setErrorMessage(errorText);

    if (capitalize) {
      const capitalizedWord = autocapitalize(processedValue, capitalize);

      onChange?.(capitalizedWord);
    } else {

      onChange?.(processedValue);
    }
  };

  const togglePasswordVisibility = (): void => {
    setShowPassword(!showPassword);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    const char = event.key;

    // Prevent invalid input
    if (!validateInput(char) && char.length === 1) {
      event.preventDefault();
      return;
    }

    // Trigger blur when Enter is pressed
    if (char === "Enter") {
      event.preventDefault(); // optional, prevents form submission
      onBlur?.(); // call the onBlur handler
    }
  };

  // --- IMPORT HANDLERS ---
  const handleJsonImport = async () => {
    if (!importProp?.jsonAccessor) {
      setHasError(true);
      setErrorMessage("JSON accessor is required for JSON import.");
      return;
    }

    try {
      const file = await selectFile(".json");
      const text = await file.text();
      const json = JSON.parse(text);

      const value = importProp.jsonAccessor
        .split(".")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .reduce((obj: any, key) => obj?.[key], json);

      if (value === undefined) {
        setHasError(true);
        setErrorMessage(
          `Accessor "${importProp.jsonAccessor}" not found in JSON.`
        );
        return;
      }

      applyValue(value.toString());
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setHasError(true);
      setErrorMessage(err.message || "Failed to import JSON");
    }
  };

  const handleTextImport = async () => {
    try {
      const file = await selectFile(".txt");
      const text = await file.text();

      if (!text.trim()) {
        setHasError(true);
        setErrorMessage("Text file is empty.");
        return;
      }

      const trimmed = maxChar > 0 ? text.slice(0, maxChar) : text;
      applyValue(trimmed);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setHasError(true);
      setErrorMessage(err.message || "Failed to import text");
    }
  };

  const handleClipboardImport = async () => {
    try {
      const text = await navigator.clipboard.readText();
      applyValue(text);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setHasError(true);
      setErrorMessage(`Failed to read from clipboard: ${err}`);
    }
  };

  const applyValue = (value: string) => {
    const processed = capitalize ? autocapitalize(value, capitalize) : value;
    setCharCount(processed.length);
    onChange?.(processed);
    setHasError(false);
    setErrorMessage("");
  };

  const selectFile = (accept: string): Promise<File> => {
    return new Promise((resolve, reject) => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = accept;
      input.onchange = () => {
        if (input.files?.[0]) resolve(input.files[0]);
        else reject(new Error("No file selected"));
      };
      input.click();
    });
  };

  const renderImportIcons = () => {
    if (!importProp) return null;

    const icons: JSX.Element[] = [];

    const pushIcon = (
      tooltip: string,
      icon: JSX.Element,
      onClick: () => void
    ) =>
      icons.push(
        <ImportButton
          key={tooltip}
          type="button"
          onClick={onClick}
          disabled={disabled}
          aria-label={tooltip}
          data-tooltip-id={tooltipId}
          data-tooltip-content={tooltip}
        >
          {icon}
        </ImportButton>
      );

    switch (importProp.type) {
      case "json":
        pushIcon(
          "Import a JSON file",
          <FileJsonIcon width={16} />,
          handleJsonImport
        );
        break;

      case "txt":
        pushIcon(
          "Import a text file",
          <TextAaIcon width={16} />,
          handleTextImport
        );
        break;

      case "clipboard":
        pushIcon(
          "Paste text from clipboard",
          <ClipboardIcon width={16} />,
          handleClipboardImport
        );
        break;

      case "all":
        pushIcon(
          "Import a JSON file",
          <FileJsonIcon width={16} />,
          handleJsonImport
        );
        pushIcon(
          "Import a text file",
          <TextAaIcon width={16} />,
          handleTextImport
        );
        pushIcon(
          "Paste text from clipboard",
          <ClipboardIcon width={16} />,
          handleClipboardImport
        );
        break;
    }

    return (
      <div style={{ display: "flex", gap: "6px", marginLeft: "5px" }}>
        {icons}
        <Tooltip
          id={tooltipId}
          place="top"
          delayShow={300}
          style={{
            fontSize: "11px",
            borderRadius: "6px",
            padding: "6px 8px",
          }}
        />
      </div>
    );
  };

  const isExceeded = charCount > 2500;

  return (
    <InputWrapper>
      {!isLabelHint && (
        <LabelRowContainer>
          <Label htmlFor="custom-input" $ishelper={isLabelHint}>
            {label}
          </Label>
          {required ? <RequiredAsterisk>*</RequiredAsterisk> : null}
          {renderImportIcons()}
        </LabelRowContainer>
      )}
      <div style={{ position: "relative" }}>
        <InputField
          type={type === "password" && !showPassword ? "password" : "text"}
          value={inputValue}
          onChange={handleChange}
          $haserror={hasError}
          placeholder={isLabelHint ? label : ""}
          className={className}
          disabled={disabled}
          onBlur={onBlur}
          onKeyDown={handleKeyDown}
        />
        {type === "password" && (
          <ToggleIcon onClick={togglePasswordVisibility} disabled={disabled}>
            {!showPassword ? (
              <EyeSlashIcon width={20} />
            ) : (
              <EyeIcon width={20} />
            )}
          </ToggleIcon>
        )}
      </div>
      {maxChar !== 0 && (
        <CharacterCount $isexceeded={isExceeded}>
          {charCount}/{maxChar}
        </CharacterCount>
      )}
      {helper && <HintText>{helper}</HintText>}
      {hasError && <HelperText>{errorMessage}</HelperText>}
    </InputWrapper>
  );
};

export default CustomInputField;

/**
 * Transforms the input text based on the specified capitalization mode.
 *
 * @param text - The input string to be transformed.
 * @param mode - The capitalization mode to apply. Can be one of the following:
 *   - "word": Capitalizes the first letter of every word separated by whitespace.
 *   - "character": Converts the entire string to uppercase.
 *   - "sentence": Capitalizes the first letter of every sentence, defined as text following a period and a space.
 *   - "first": (Default) Capitalizes only the first character of the entire string.
 * @returns The transformed string based on the selected mode.
 */
function autocapitalize(
  text: string,
  mode: "word" | "character" | "sentence" | "first" = "first"
): string {
  if (!text) return "";

  switch (mode) {
    case "word":
      return text
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

    case "character":
      return text.toUpperCase();

    case "sentence":
      return text
        .split(/(?<=\.)\s+/) // Splits text by sentences (after a period and a space)
        .map((sentence) => sentence.charAt(0).toUpperCase() + sentence.slice(1))
        .join(" ");

    case "first":
    default:
      return text.charAt(0).toUpperCase() + text.slice(1);
  }
}
