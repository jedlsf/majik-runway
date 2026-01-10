"use client";

import React from "react";
import styled from "styled-components";
import CustomInputField from "./CustomInputField";
import { DividerGlobal } from "../../globals/styled-components";

/**
 * Budget Range containing the min and max of the budget with currency.
 */
interface BudgetRange {
  /**
   * Minimum allocated budget.
   */
  minimum: number;

  /**
   * Maximum allocated budget.
   */
  maximum: number;

  /**
   * Currency of the budget (e.g., USD, PHP).
   */
  currency: string;
}

const RootContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 15px;
`;

interface InputProps {
  /** Function to handle updates  */
  onUpdate?: (updatedValue: BudgetRange) => void;

  /** Current full name */
  currentValue?: BudgetRange | null;
}

const InputBudget: React.FC<InputProps> = ({
  onUpdate,
  currentValue = null,
}) => {
  const inputData: BudgetRange = {
    currency: currentValue?.currency || "PHP",
    minimum: currentValue?.minimum || 0,
    maximum: currentValue?.maximum || 0,
  };



  const handleUpdateCurrency = (input: string) => {
    const updatedDetails: BudgetRange = {
      ...inputData,
      currency: input || "PHP",
    };
    onUpdate?.(updatedDetails);
  };

  const handleUpdateMinimum = (input: string) => {
    const updatedDetails: BudgetRange = {
      ...inputData,
      minimum: parseFloat(input) || 0,
    };
    onUpdate?.(updatedDetails);
  };

  const handleUpdateMaximum = (input: string) => {
    const updatedDetails: BudgetRange = {
      ...inputData,
      maximum: parseFloat(input) || 0,
    };
    onUpdate?.(updatedDetails);
  };

  return (
    <RootContainer>
      <CustomInputField
        required
        label="Currency"
        isLabelHint={false}
        onChange={handleUpdateCurrency}
        currentValue={inputData.currency}
        maxChar={3}
        capitalize="character"
      />
      <CustomInputField
        required={false}
        label="Minimum"
        isLabelHint={false}
        onChange={handleUpdateMinimum}
        currentValue={inputData.minimum.toString()}
        maxChar={25}
        regex="numbers"
      />
      <CustomInputField
        required={false}
        label="Maximum"
        isLabelHint={false}
        onChange={handleUpdateMaximum}
        currentValue={inputData.maximum.toString()}
        maxChar={25}
        regex="numbers"
      />

      <DividerGlobal />
    </RootContainer>
  );
};

export default InputBudget;
