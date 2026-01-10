"use client";

import DateYYYYMMPicker from "../../components/foundations/DateYYYYMMPicker";
import { ValueIncrementor } from "../../components/functional/ValueIncrementor";
import {
  type PeriodYYYYMM,
  type YYYYMM,
  dateToYYYYMM,
  monthsInPeriod,
  offsetMonthsToYYYYMM,
} from "@thezelijah/majik-runway";

import React, { useState, useEffect } from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex: 1;
  width: 100%;
  height: 100%;
`;

const DropdownRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 25px;

  width: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ErrorText = styled.div`
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.typography.sizes.helper};
  margin-top: ${({ theme }) => theme.spacing.small};
  text-align: right;
  align-self: flex-end;
  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const Label = styled.label`
  margin-bottom: ${({ theme }) => theme.spacing.small};
  font-size: ${({ theme }) => theme.typography.sizes.body};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  text-align: left;
  user-select: none;

  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

interface PeriodSetterProps {
  currentValue?: PeriodYYYYMM;
  onChange: (period: PeriodYYYYMM) => void;
  required?: boolean;
  label?: string | null;
}

const PeriodSetter: React.FC<PeriodSetterProps> = ({
  currentValue,
  onChange,
  required = false,
  label = null,
}) => {
  const [durationMonths, setDurationMonths] = useState<number>(
    currentValue
      ? monthsInPeriod(currentValue.startMonth, currentValue.endMonth)
      : 24
  );

  const [inputData, setInputData] = useState<PeriodYYYYMM>({
    startMonth: currentValue?.startMonth || dateToYYYYMM(new Date()),
    endMonth:
      currentValue?.endMonth ||
      offsetMonthsToYYYYMM(
        currentValue?.startMonth || dateToYYYYMM(new Date()),
        durationMonths - 1
      ),
  });

  const [error, setError] = useState<string | null>(null);

  /* ---------- Emit YYYYMM ---------- */
  useEffect(() => {
    if (!inputData) {
      if (required) setError("Please select a month");
      return;
    }

    onChange(inputData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputData.startMonth, inputData.endMonth, required]);

  const handleUpdateMonthYear = (input: YYYYMM) => {
    setInputData((prev) => ({
      ...prev,
      startMonth: input,
      endMonth: offsetMonthsToYYYYMM(input, durationMonths - 1),
    }));
  };

  const handleUpdate = (input: number) => {
    if (!inputData.startMonth) return;

    setDurationMonths(input);
    setInputData((prev) => ({
      ...prev,
      endMonth: offsetMonthsToYYYYMM(prev.startMonth, input - 1),
    }));
  };

  return (
    <Container>
      {!!label && label.trim() !== "" && <Label>{label}</Label>}
      <DropdownRow>
        <DateYYYYMMPicker
          required
          value={inputData.startMonth}
          onChange={handleUpdateMonthYear}
          label="Starting Month"
        />

        <ValueIncrementor
          label="Duration"
          currentValue={durationMonths}
          direction="column"
          incrementValue={1}
          minValue={2}
          onUpdate={handleUpdate}
          displayValue={`${durationMonths.toString()} months`}
        />
      </DropdownRow>
      {error && <ErrorText>{error}</ErrorText>}
    </Container>
  );
};

export default PeriodSetter;
