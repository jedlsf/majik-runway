'use client';

import React, { useState, useEffect, type ChangeEvent, type KeyboardEvent } from 'react';
import styled from 'styled-components';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';
import HelperHover from './HelperHover';
import { autocapitalize } from '../../utils/helper';


const ColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.small};
  width: 100%;
`;

const RowContainer = styled.div`
  display: flex;
  flex: 1;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const RowLabelHelper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  gap: 2px;



  @media (max-width: 768px) {
      justify-content: flex-start;
  align-items: center;
  width: 100%;
  gap: 5px;
  }

`;

const Label = styled.span < { $darkMode: boolean }> `
  font-size: ${({ theme }) => theme.typography.sizes.label};
  color: ${({ theme, $darkMode }) => $darkMode ? theme.colors.textPrimary : theme.colors.primaryBackground};
  font-weight: 700;
  user-select: none;
`;

const ToggleSwitch = styled.input.attrs({ type: 'checkbox' }) <{
  checked: boolean;
  disabled: boolean;
}>`
  width: 50px;
  height: 27px;
  background-color: ${({ checked, theme }) =>
    checked ? theme.colors.primary : theme.colors.secondaryBackground};
  border-radius: 15px;
  border: 1px solid ${({ theme, checked }) => checked ? theme.colors.secondaryBackground : theme.colors.textSecondary};

  position: relative;
  appearance: none;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  outline: none;
  transition: background-color ${({ theme }) => theme.animations.duration.medium}
    ${({ theme }) => theme.animations.easing.easeInOut};

  &:disabled {
    background-color: ${({ theme }) => theme.colors.secondaryBackground};
  }

  &::after {
    content: '';
    width: 21px;
    height: 21px;
    background-color: ${({ checked, theme }) =>
    checked ? theme.colors.secondaryBackground : theme.colors.textSecondary};
    border-radius: 50%;
    position: absolute;
    top: 2px;
    left: ${({ checked }) => (checked ? '26px' : '2px')};
    transition: left ${({ theme }) => theme.animations.duration.medium}
      ${({ theme }) => theme.animations.easing.easeInOut};
  }
`;

const InputField = styled.input<{ $haserror: boolean }>`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.small};
  font-family: ${({ theme }) => theme.typography.fonts.regular};
  font-size: ${({ theme }) => theme.typography.sizes.body};
  background-color: ${({ theme }) => theme.colors.secondaryBackground};
  border: 1px solid ${({ $haserror, theme }) =>
    $haserror ? theme.colors.error : 'transparent'};
  border-radius: 6px 6px 15px 6px;
  outline: none;
  color: ${({ theme }) => theme.colors.textPrimary};

  &::placeholder {
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: ${({ theme }) => theme.typography.sizes.hint};
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const HintText = styled.span<{ $haserror: boolean }>`
  font-size: 12px;
  text-align: right;
  font-weight: 300;
  color: ${({ $haserror, theme }) =>
    $haserror ? theme.colors.error : theme.colors.textSecondary};
  text-align: right;
  user-select: none;
`;

const ToggleIcon = styled.button<{ disabled: boolean }>`
  width: 50px;
  background: none;
  border: none;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.typography.sizes.body};
`;

interface CustomToggleSwitchProps {
  label: string;
  disabled?: boolean;
  requireInput?: boolean;
  hint?: string;
  helper?: string;
  sensitive?: boolean;
  errorText?: string;
  onToggle?: (value: boolean) => void;
  onChange?: (value: string) => void;
  regex?: 'alphanumeric' | 'alphanumeric-code' | 'numbers' | 'letters' | 'all';
  currentToggle?: boolean;
  currentValue?: string;
  darkMode?: boolean;
  isHelperHover?: boolean;
  capitalize?: "word" | "character" | "sentence" | "first" | null;
  maxChar?: number;
}

const CustomToggleSwitch: React.FC<CustomToggleSwitchProps> = ({
  label,
  disabled = false,
  requireInput = false,
  hint = '',
  helper = '',
  isHelperHover = false,
  sensitive = false,
  errorText,
  onToggle,
  onChange,
  regex,
  currentToggle = false,
  currentValue = '',
  darkMode = true,
  capitalize = null,
  maxChar = 0,
}) => {
  const [stateValue, setStateValue] = useState<boolean>(currentToggle);
  const [inputValue, setInputValue] = useState<string>(currentValue ?? '');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  useEffect(() => {
    setInputValue(currentValue ?? '');
  }, [currentValue]);

  useEffect(() => {
    setStateValue(currentToggle);
  }, [currentToggle]);

  const handleToggle = () => {
    if (!disabled) {
      const newStateValue = !stateValue;
      setStateValue(newStateValue);
      if (onToggle) onToggle(newStateValue);
    }
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;


    if (maxChar > 0 && value.length > maxChar) {
      return;
    }

    if (capitalize) {

      const capitalizedWord = autocapitalize(value, capitalize);
      setInputValue(capitalizedWord);
      onChange?.(capitalizedWord);

    } else {
      setInputValue(value);
      onChange?.(value);

    }


  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateInput = (value: string) => {
    let regexPattern: RegExp;

    switch (regex) {
      case 'alphanumeric':
        regexPattern = /^[a-zA-Z0-9]*$/;
        break;
      case 'numbers':
        regexPattern = /^\d*\.?\d{0,2}$/;
        break;
      case 'all':
      default:
        regexPattern = /.*/;
        break;
    }

    return regexPattern.test(value);
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    const char = String.fromCharCode(event.charCode);
    if (!validateInput(char)) event.preventDefault();
  };

  const hasError = requireInput && stateValue && !inputValue;

  return (
    <ColumnContainer>
      <RowContainer>
        <RowLabelHelper>
          <Label
            $darkMode={darkMode}
          >{label}
          </Label>
          {!!helper && helper.trim() !== "" && isHelperHover
            ?
            <HelperHover
              darkMode={darkMode}
            >
              {helper}
            </HelperHover>
            :
            null
          }
        </RowLabelHelper>

        <ToggleSwitch
          checked={stateValue}
          onChange={handleToggle}
          disabled={disabled}
        />
      </RowContainer>
      {stateValue && requireInput && (
        <RowContainer>
          <InputField
            type={sensitive && !showPassword ? 'password' : 'text'}
            value={inputValue}
            onChange={handleInputChange}
            placeholder={hint || ''}
            $haserror={hasError}
            onKeyPress={handleKeyPress}
          />
          {sensitive && (
            <ToggleIcon onClick={togglePasswordVisibility} disabled={disabled}>
              {showPassword ? <EyeIcon /> : <EyeSlashIcon />}
            </ToggleIcon>
          )}
        </RowContainer>
      )}
      {helper && !isHelperHover && (
        <HintText $haserror={hasError}>
          {hasError ? errorText || 'This field is required' : helper}
        </HintText>
      )}
    </ColumnContainer>
  );
};

export default CustomToggleSwitch;
