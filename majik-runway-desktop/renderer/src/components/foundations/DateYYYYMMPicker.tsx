"use client";

import React, { useEffect, useState } from "react";
import styled from "styled-components";

type YYYYMM = `${number}${number}${number}${number}-${number}${number}`;

const Container = styled.div`
   width: 100%;
  height: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.small};
  margin: 15px 0px;
`;

const DropdownRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  width: 100%;
`;

const Select = styled.select`
  padding: 6px;
  width: 100%;
  min-width: 100px;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.typography.sizes.body};
  font-family: ${({ theme }) => theme.typography.fonts.regular};
  border: ${({ theme }) => theme.borders.width.thin} solid transparent;
  border-radius: ${({ theme }) => theme.borders.radius.medium};
  background-color: ${({ theme }) => theme.colors.secondaryBackground};
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.14);

  &:disabled {
    color: ${({ theme }) => theme.colors.textSecondary};
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    outline: none;
  }
`;

const Label = styled.label`
  margin-bottom: ${({ theme }) => theme.spacing.small};
  font-size: ${({ theme }) => theme.typography.sizes.label};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const ErrorText = styled.div`
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.typography.sizes.helper};
  margin-top: ${({ theme }) => theme.spacing.small};
  align-self: flex-end;
`;

/* ===================== TYPES ===================== */

interface DateYYYYMMPickerProps {
  value?: YYYYMM;
  onChange: (value: YYYYMM) => void;
  required?: boolean;
  min?: YYYYMM;
  max?: YYYYMM;
  label?: string | null;
}

/* ===================== COMPONENT ===================== */

const DateYYYYMMPicker: React.FC<DateYYYYMMPickerProps> = ({
  value,
  onChange,
  required = false,
  min,
  max,
  label = null,
}) => {
  const [year, setYear] = useState<string>("");
  const [month, setMonth] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  /* ---------- Hydrate from YYYYMM ---------- */
  useEffect(() => {
    if (!value) return;

    const [y, m] = value.split("-");
    setYear(y);
    setMonth(m);
  }, [value]);

  /* ---------- Emit YYYYMM ---------- */
  useEffect(() => {
    if (!year || !month) {
      if (required) setError("Please select a month");
      return;
    }

    const yyyyMM = `${year}-${month}` as YYYYMM;
    const date = yyyyMMToDate(yyyyMM);

    if (min && date < yyyyMMToDate(min)) {
      setError(`Month cannot be earlier than ${min}`);
      return;
    }

    if (max && date > yyyyMMToDate(max)) {
      setError(`Month cannot be later than ${max}`);
      return;
    }

    setError(null);
    onChange(yyyyMM);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, month, required]);

  /* ---------- Options ---------- */

  const generateYearOptions = (): number[] => {
    const years: number[] = [];
    const currentYear = new Date().getUTCFullYear();

    const minYear = min ? yyyyMMToDate(min).getUTCFullYear() : currentYear - 10;

    const maxYear = max ? yyyyMMToDate(max).getUTCFullYear() : currentYear + 20;

    for (let y = minYear; y <= maxYear; y++) {
      years.push(y);
    }

    return years;
  };

  const months = [
    { value: "01", name: "January" },
    { value: "02", name: "February" },
    { value: "03", name: "March" },
    { value: "04", name: "April" },
    { value: "05", name: "May" },
    { value: "06", name: "June" },
    { value: "07", name: "July" },
    { value: "08", name: "August" },
    { value: "09", name: "September" },
    { value: "10", name: "October" },
    { value: "11", name: "November" },
    { value: "12", name: "December" },
  ];

  /* ===================== RENDER ===================== */

  return (
    <Container>
      {!!label && <Label>{label}</Label>}

      <DropdownRow>
        <Select value={year} onChange={(e) => setYear(e.target.value)}>
          <option value="">Year</option>
          {generateYearOptions().map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </Select>

        <Select
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          disabled={!year}
        >
          <option value="">Month</option>
          {months.map((m) => (
            <option key={m.value} value={m.value}>
              {m.name}
            </option>
          ))}
        </Select>
      </DropdownRow>

      {error && <ErrorText>{error}</ErrorText>}
    </Container>
  );
};

export default DateYYYYMMPicker;

function yyyyMMToDate(yyyyMM: YYYYMM): Date {
  const [year, month] = yyyyMM.split("-").map(Number);

  return new Date(Date.UTC(year, month - 1, 1));
}
