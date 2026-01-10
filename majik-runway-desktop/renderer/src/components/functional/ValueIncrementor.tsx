import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { PlusIcon, MinusIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/solid';
import HelperHover from '../foundations/HelperHover';
import { Tooltip } from 'react-tooltip';
import theme from '../../globals/theme';

const RootContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.small};
  margin: 15px 0px;
`;

const RowContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Label = styled.span`
  font-size: ${({ theme }) => theme.typography.sizes.label};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-weight: 700;
  user-select: none;
`;


const MainRowContainer = styled.div<{ $direction: "row" | "column" }>`
  display: flex;
  flex: 1;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  flex-direction: ${({ $direction }) => $direction};
  gap: 15px;
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

const StyledIconButton = styled.button<{ disabled?: boolean }>`
  background-color: ${({ disabled, theme }) => (disabled ? theme.colors.secondaryBackground : theme.colors.primary)};
  border: none;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  transition: background-color 0.2s ease;

  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: ${({ disabled, theme }) => (disabled ? '#ccc' : theme.colors.primary)};
  }

  svg {
    width: 1.25rem;
    height: 1.25rem;
    color: #333;
  }
`;

const ValueText = styled.span`
  font-size: 16px;
  font-weight: 600;
  min-width: 2rem;
  text-align: center;
  color: ${({ theme }) => theme.colors.textPrimary};
  cursor: pointer;
`;

const ValueInput = styled.input`
  padding: 5px 15px;

  font-size: ${({ theme }) => theme.typography.sizes.body};
  background-color: ${({ theme }) => theme.colors.secondaryBackground};
  border: 1px solid transparent;
  border-radius: 25px;
  outline: none;
  color: ${({ theme }) => theme.colors.textPrimary};
  width: 100%;
  max-width: 80px;
  user-select: none;
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.14);

  &::placeholder {
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: ${({ theme }) => theme.typography.sizes.hint};
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }

    @media (max-width: 768px) {
  font-size: 16px;
   
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

interface ValueIncrementorProps {
    currentValue: number;
    disableDecrement?: boolean;
    disableIncrement?: boolean;
    onUpdate?(number: number): void;
    displayValue?: string | number;
    incrementValue?: number;
    label?: string;
    helper?: string;
    isHelperHover?: boolean;
    minValue?: number;
    maxValue?: number;
    direction?: "column" | "row";
}

export const ValueIncrementor: React.FC<ValueIncrementorProps> = ({
    currentValue,
    onUpdate,
    displayValue,
    incrementValue = 1,
    isHelperHover = false,
    label,
    helper = '',
    minValue,
    maxValue,
    direction = "row"
}) => {
    const [stateValue, setStateValue] = useState<number>(currentValue);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [editValue, setEditValue] = useState<string>(currentValue?.toString() || "0");

    const canDecrement = minValue !== undefined ? stateValue > minValue : stateValue > 0;
    const canIncrement = maxValue !== undefined ? stateValue < maxValue : true;



    useEffect(() => {
        setStateValue(currentValue);
        setEditValue(currentValue.toString())
    }, [currentValue]);

    const handleDecrement = () => {
        if (canDecrement) {
            const newValue = stateValue - incrementValue;
            const clampedValue = minValue !== undefined ? Math.max(newValue, minValue) : newValue;
            setStateValue(clampedValue);
            setEditValue(clampedValue.toFixed(4));
            onUpdate?.(clampedValue);
        }
    };

    const handleIncrement = () => {
        if (canIncrement) {
            const newValue = stateValue + incrementValue;
            const clampedValue = maxValue !== undefined ? Math.min(newValue, maxValue) : newValue;
            setStateValue(clampedValue);
            setEditValue(clampedValue.toFixed(4));
            onUpdate?.(clampedValue);
        }
    };

    const handleSave = () => {
        let parsed = parseFloat(editValue);
        if (isNaN(parsed) || parsed < 0) parsed = 0;

        if (minValue !== undefined) parsed = Math.max(parsed, minValue);
        if (maxValue !== undefined) parsed = Math.min(parsed, maxValue);

        setStateValue(parsed);
        setEditValue(parsed.toString());
        onUpdate?.(parsed);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditValue(stateValue.toString());
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSave();
        }
    };


    return (
        <RootContainer>
            <MainRowContainer $direction={direction}>
                <RowLabelHelper>
                    <Label>{label}</Label>
                    {!!helper && helper.trim() !== "" && isHelperHover ? (
                        <HelperHover>{helper}</HelperHover>
                    ) : null}
                </RowLabelHelper>

                <RowContainer>
                    {!isEditing ? (
                        <>
                            <StyledIconButton onClick={handleDecrement} disabled={!canDecrement}>
                                <MinusIcon />
                            </StyledIconButton>

                            <ValueText
                                data-tooltip-id="rtip-edit"
                                data-tooltip-content="Click to edit"
                                onClick={() => setIsEditing(true)}
                            >
                                {displayValue !== undefined ? displayValue : stateValue.toLocaleString()}
                            </ValueText>

                            <Tooltip id="rtip-edit" style={{ background: theme.colors.secondaryBackground, color: theme.colors.textPrimary }} />

                            <StyledIconButton onClick={handleIncrement} disabled={!canIncrement}>
                                <PlusIcon />
                            </StyledIconButton>
                        </>
                    ) : (
                        <>
                            <StyledIconButton onClick={handleCancel}>
                                <XMarkIcon />
                            </StyledIconButton>

                            <ValueInput
                                value={editValue}
                                onChange={(e) => {
                                    const value = e.target.value;

                                    // Allow digits and one decimal point
                                    if (/^\d*\.?\d*$/.test(value)) {
                                        setEditValue(value);
                                    }
                                }}
                                onKeyDown={handleKeyDown}
                                autoFocus
                            />

                            <StyledIconButton onClick={handleSave}>
                                <CheckIcon />
                            </StyledIconButton>
                        </>
                    )}
                </RowContainer>
            </MainRowContainer>

            {helper && !isHelperHover && (
                <HintText>{helper}</HintText>
            )}
        </RootContainer>
    );
};
