"use client";

import React, { useEffect, useState } from "react";
import styled from "styled-components";

import CustomInputField from "@/components/foundations/CustomInputField";

import { DividerGlobal } from "@/globals/styled-components";

import RowTextItem from "@/components/foundations/RowTextItem";

import ScrollableForm from "@/components/foundations/ScrollableForm";
import {
  type COGSItem,
  type COSItem,
  MajikMoney,
  autogenerateID,
} from "@thezelijah/majik-runway";

import { ValueIncrementor } from "@/components/functional/ValueIncrementor";
import theme from "@/globals/theme";

const RootContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 15px;
  max-height: 580px;
`;

const FormBodyEvent = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 300px;
  width: 100%;
  flex-grow: 1; /* Allows it to grow and take available space */
  gap: 15px;

  box-sizing: border-box; /* Include padding and borders in width/height */
`;

const HelperColumn = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 5px;
  align-items: flex-end;
`;

const HelperText = styled.p`
  font-size: 12px;
  text-align: right;
  color: ${({ theme }) => theme.colors.textSecondary};
  opacity: 0.7;
  font-weight: 300;
`;

type CostItem = COGSItem | COSItem;

interface InputProps {
  /** Function to handle proceed  */
  onAdd?: (updatedValue: CostItem) => void;

  /** Function to handle cancel  */
  onCancel?: () => void;

  currentValue?: CostItem | null;

  /**Currency to use */
  currency?: string;
}

const InputCostItem: React.FC<InputProps> = ({
  onAdd,
  onCancel,
  currentValue = null,
  currency = "PHP",
}) => {
  const [inputData, setInputData] = useState<CostItem>({
    item: currentValue?.item || "",
    quantity: currentValue?.quantity || 1,
    unit: currentValue?.unit || "PIECE",
    unitCost: currentValue?.unitCost || MajikMoney.zero(currency),
    subtotal: currentValue?.subtotal || MajikMoney.zero(currency),
    id: currentValue?.id || autogenerateID("mjkcost"),
  });

  const handleUpdateLabel = (input: string) => {
    setInputData((prev) => ({ ...prev, item: input }));
  };

  const handleUpdateQuantity = (input: number) => {
    const quantity = input >= 0.5 ? input : 1;
    setInputData((prev) => ({ ...prev, quantity: quantity }));
  };

  const handleUpdateUnit = (input: string) => {
    setInputData((prev) => ({ ...prev, unit: input.toUpperCase() }));
  };

  const handleUpdateUnitPrice = (input: string) => {
    setInputData((prev) => ({
      ...prev,
      unitCost: input?.trim()
        ? MajikMoney.fromMajor(parseFloat(input), currency)
        : MajikMoney.zero(currency),
    }));
  };

  useEffect(() => {
    const quantity = inputData.quantity || 0;
    const unitCost = inputData.unitCost || MajikMoney.zero(currency);
    const subtotal = unitCost.multiply(quantity);

    if (!inputData.subtotal.equals(subtotal)) {
      setInputData((prev) => ({ ...prev, subtotal: subtotal }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputData.quantity, inputData.unitCost]);

  const handleCancel = () => {
    onCancel?.();
  };

  const handleSubmit = () => {
    if (inputData) {
      onAdd?.(inputData);
    }
  };

  return (
    <RootContainer>
      <ScrollableForm
        onClickCancel={handleCancel}
        onClickProceed={handleSubmit}
        isDisabledProceed={
          !inputData.item ||
          !inputData.subtotal ||
          !inputData.unitCost ||
          !inputData.quantity ||
          inputData.unitCost.isZero()
        }
        textProceedButton={!currentValue ? "Add" : "Save Changes"}
      >
        <FormBodyEvent>
          <CustomInputField
            required
            label="Label"
            isLabelHint={false}
            onChange={handleUpdateLabel}
            currentValue={inputData.item}
            maxChar={100}
            capitalize="word"
          />
          <HelperColumn>
            <HelperText>
              Enter a short, descriptive name for this item or service{" "}
              <i>
                (Ex: &quot;Dinorado Rice&quot;, &quot;Graphic Design
                Service&quot;)
              </i>
              .
            </HelperText>
          </HelperColumn>

          <CustomInputField
            required
            label="Unit Price"
            isLabelHint={false}
            onChange={handleUpdateUnitPrice}
            currentValue={inputData.unitCost.toMajorDecimal().toString()}
            maxChar={25}
            regex="numbers"
          />
          <HelperColumn>
            <HelperText>
              Input the cost per unit, without commas or currency symbols{" "}
              <i>(Ex: 500, 1200.75)</i>.
            </HelperText>
          </HelperColumn>

          <ValueIncrementor
            label="Quantity"
            currentValue={inputData.quantity}
            direction="row"
            incrementValue={0.5}
            onUpdate={handleUpdateQuantity}
            displayValue={`${(inputData.quantity ?? 1).toFixed(
              2
            )} ${inputData.unit?.toUpperCase()}`}
            helper="Indicate how many units of the item or service are being billed."
          />

          <CustomInputField
            required
            label="Unit"
            isLabelHint={false}
            onChange={handleUpdateUnit}
            currentValue={inputData.unit?.toUpperCase()}
            maxChar={100}
            capitalize="character"
            allcaps
          />
          <HelperColumn>
            <HelperText>
              Specify the unit of measure{" "}
              <i>(Ex: piece, hour, session, month)</i>.
            </HelperText>
          </HelperColumn>

          <DividerGlobal />

          <RowTextItem
            textKey="Subtotal Amount"
            textValue={inputData?.subtotal.format()}
            highlight
            colorValue={theme.colors.brand.green}
          />
        </FormBodyEvent>
      </ScrollableForm>
    </RootContainer>
  );
};

export default InputCostItem;
