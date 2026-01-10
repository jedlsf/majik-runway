"use client";

import React, { useState } from "react";
import styled from "styled-components";

import ScrollableForm from "@/components/foundations/ScrollableForm";

import { ValueIncrementor } from "@/components/functional/ValueIncrementor";

import {
  type MonthlyCapacity,
  type PeriodYYYYMM,
  type YYYYMM,
  dateToYYYYMM,
  offsetMonthsToYYYYMM,
} from "@thezelijah/majik-runway";

import DateYYYYMMPicker from "@/components/foundations/DateYYYYMMPicker";

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

interface InputProps {
  /** Function to handle proceed  */
  onAdd?: (updatedValue: MonthlyCapacity) => void;
  /** Function to handle cancel  */
  onCancel?: () => void;

  currentValue?: MonthlyCapacity | null;

  latestDate?: YYYYMM;

  period?: PeriodYYYYMM;
}

const InputCapacityItem: React.FC<InputProps> = ({
  onAdd,
  onCancel,
  currentValue = null,
  latestDate,
  period,
}) => {
  const [inputData, setInputData] = useState<MonthlyCapacity>({
    month: currentValue
      ? currentValue.month
      : !latestDate
      ? period?.startMonth || dateToYYYYMM(new Date())
      : offsetMonthsToYYYYMM(latestDate, 1),
    capacity: currentValue?.capacity ?? 1,
    adjustment: currentValue?.adjustment || undefined,
  });

  const handleUpdateMonthYear = (input: YYYYMM) => {
    setInputData((prev) => ({ ...prev, month: input }));
  };

  const handleUpdateCapacity = (input: number) => {
    setInputData((prev) => ({ ...prev, capacity: input }));
  };

  const handleUpdateAdjustment = (input: number) => {
    setInputData((prev) => ({ ...prev, adjustment: input }));
  };

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
        isDisabledProceed={!inputData.month || !inputData.capacity}
        textProceedButton={!currentValue ? "Add" : "Save Changes"}
      >
        <FormBodyEvent>
          {!currentValue ? (
            <DateYYYYMMPicker
              required
              value={inputData.month}
              onChange={handleUpdateMonthYear}
              label="Month"
              min={period?.startMonth}
              max={period?.endMonth}
            />
          ) : null}

          <ValueIncrementor
            label="Capacity"
            currentValue={inputData.capacity}
            direction="row"
            incrementValue={1}
            onUpdate={handleUpdateCapacity}
            displayValue={`${inputData.capacity.toString()} units`}
            helper="Set the maximum number of units you can produce or deliver for this item in the selected month."
          />

          <ValueIncrementor
            label="Adjustment/Offset"
            currentValue={inputData.adjustment || 0}
            direction="row"
            incrementValue={1}
            minValue={0}
            disableDecrement={
              !inputData.adjustment || inputData.adjustment === 0
            }
            onUpdate={handleUpdateAdjustment}
            displayValue={`${(inputData.adjustment ?? 0).toString()} units`}
            helper="Apply a temporary increase or decrease to this month’s capacity (e.g. seasonal demand, constraints, or special projects)."
          />
        </FormBodyEvent>
      </ScrollableForm>
    </RootContainer>
  );
};

export default InputCapacityItem;
