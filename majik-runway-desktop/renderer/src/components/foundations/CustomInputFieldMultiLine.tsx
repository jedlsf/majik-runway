'use client';

import React, { useState, useEffect, type ChangeEvent } from 'react';
import styled from 'styled-components';
import { autocapitalize } from '../../utils/helper';

// Styled components
const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;

`;

const Label = styled.label<{ $ishint: boolean }>`
  margin-bottom: ${({ theme }) => theme.spacing.small};

  font-size: ${({ theme, $ishint }) => ($ishint ? theme.typography.sizes.hint : theme.typography.sizes.body)};
  font-weight: 700;
  color: ${({ theme, $ishint }) => ($ishint ? theme.colors.textSecondary : theme.colors.textPrimary)};
  text-align: left;
  display: ${({ $ishint }) => ($ishint ? 'none' : 'block')}; // Hide label if isLabelHint is true

    @media (max-width: 768px) {
  font-size: ${({ $ishint }) => $ishint ? '16px' : '18px'};
   
  }
`;

const TextAreaField = styled.textarea<{ $haserror: boolean }>`
  padding: ${({ theme }) => theme.spacing.small};
  font-size: ${({ theme }) => theme.typography.sizes.body};
  background-color: ${({ theme }) => theme.colors.secondaryBackground};
  border: 1px solid ${({ $haserror, theme }) => ($haserror ? theme.colors.error : 'transparent')}; 
  border-radius: 6px 6px 15px 6px; 
  outline: none;
  color: ${({ theme }) => theme.colors.textPrimary};
  resize: none; // Disable resizing
  min-height: calc(${({ theme }) => theme.typography.sizes.body} * 15); // Minimum 6 lines
  max-height: calc(${({ theme }) => theme.typography.sizes.body} * 152); // Maximum 72 lines

  &::placeholder {
    color: ${({ theme }) => theme.colors.textSecondary}; // Set hint color
    font-size: ${({ theme }) => theme.typography.sizes.hint}; // Set hint font size
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }

    @media (max-width: 768px) {
  font-size: 16px;
   
  }
`;

const HelperText = styled.span`
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.typography.sizes.helper};
  margin-top: ${({ theme }) => theme.spacing.small};
  font-family: ${({ theme }) => theme.typography.fonts.regular};
  text-align: right;
  align-self: flex-end;
`;

const CharacterCount = styled.div<{ $isexceeded: boolean }>`
  align-self: flex-end;
  font-size: ${({ theme }) => theme.typography.sizes.helper};
  color: ${({ theme, $isexceeded }) => ($isexceeded ? theme.colors.error : theme.colors.textSecondary)};
  margin-top: ${({ theme }) => theme.spacing.small};
`;

// Type for the component props
interface CustomInputFieldMultiLineProps {
  label?: string;
  required?: boolean;
  isLabelHint?: boolean;
  currentValue?: string;
  onChange?: (value: string) => void;
  capitalize?: "word" | "character" | "sentence" | "first" | null;
  maxChar?: number;
}

const CustomInputFieldMultiLine: React.FC<CustomInputFieldMultiLineProps> = ({
  label = 'Label',
  required = false,
  isLabelHint = false,
  currentValue = '',
  onChange,
  capitalize = null,
  maxChar = 0
}) => {
  const [inputValue, setInputValue] = useState<string>(currentValue);
  const [hasError, setHasError] = useState<boolean>(false);
  const [charCount, setCharCount] = useState<number>(currentValue.length);

  useEffect(() => {
    setInputValue(currentValue);
  }, [currentValue]); // Sync inputValue with currentValue when currentValue prop changes

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = event.target;
    const errorState = required && (!value || value.trim() === '');
    const characterCount = value.length;

    if (maxChar > 0 && characterCount > maxChar) {
      return;
    }

    if (characterCount <= maxChar || maxChar === 0) {


      if (capitalize) {

        const capitalizedWord = autocapitalize(value, capitalize);
        setInputValue(capitalizedWord);
        onChange?.(capitalizedWord);
        setCharCount(characterCount);

      } else {
        onChange?.(value); // Call onChange with the input value
        setInputValue(value);
        setHasError(errorState);
        setCharCount(characterCount);

      }


    }
  };

  const isExceeded = charCount > 2500;

  return (
    <InputWrapper>
      {!isLabelHint && (
        <Label htmlFor="custom-input" $ishint={isLabelHint}>
          {label}
        </Label>
      )}
      <TextAreaField
        id="custom-input"
        value={inputValue}
        onChange={handleChange}
        $haserror={hasError || isExceeded} // Pass hasError to TextAreaField
        placeholder={isLabelHint ? label : ''} // Display label as hint if isLabelHint is true
        maxLength={maxChar > 0 ? maxChar : undefined}
      />
      {maxChar !== 0 &&
        <CharacterCount $isexceeded={isExceeded}>{charCount}/{maxChar}</CharacterCount>
      }

      {hasError && required && <HelperText>This field is required</HelperText>}
    </InputWrapper>
  );
};

export default CustomInputFieldMultiLine;
