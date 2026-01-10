'use client';

import React, { useState } from 'react';
import styled from 'styled-components';

interface CustomCheckboxProps {
    label: string;
    disabled?: boolean;
    defaultChecked?: boolean;
    currentValue?: boolean; // Optional prop to control the current value externally
    onToggle?: (checked: boolean) => void;
}

const ColumnContainer = styled.div`
  margin: 15px 5px;
  display: flex;
  gap: ${({ theme }) => theme.spacing.small};
`;

const RowContainer = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  width: 100%;
  gap: 25px;
`;

const Label = styled.span`
  font-size: ${({ theme }) => theme.typography.sizes.body};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-weight: ${({ theme }) => theme.typography.weights.body};
  max-width: 320px;
  text-align: justify;
  white-space: normal; /* Allows text to wrap */
  word-wrap: break-word; /* Ensures text wraps within container width */
  flex-shrink: 1; /* Prevents shrinking */
`;

const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  margin-right: ${({ theme }) => theme.spacing.small};
  width: 18px;
  height: 18px;
`;

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
    label,
    disabled = false,
    defaultChecked = false,
    currentValue,
    onToggle,
}) => {
    if (!label) {
        throw new Error('Label is required and must not be null nor empty');
    }

    // Internal state to handle uncontrolled mode
    const [isChecked, setIsChecked] = useState(defaultChecked);

    // Determine the current value of the checkbox (controlled or uncontrolled)
    const effectiveChecked = currentValue !== undefined ? currentValue : isChecked;

    const handleToggle = () => {
        if (!disabled) {
            const newChecked = !effectiveChecked;
            // Update local state if not controlled
            if (currentValue === undefined) {
                setIsChecked(newChecked);
            }
            // Trigger the onToggle callback
            if (onToggle) {
                onToggle(newChecked);
            }
        }
    };

    return (
        <ColumnContainer>
            <RowContainer>
                <Checkbox
                    checked={effectiveChecked}
                    onChange={handleToggle}
                    disabled={disabled}
                />
                <Label>{label}</Label>
            </RowContainer>
        </ColumnContainer>
    );
};

export default CustomCheckbox;
