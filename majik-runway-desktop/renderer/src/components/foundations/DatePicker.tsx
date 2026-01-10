"use client";

import React, { useState, useEffect } from "react";
import styled from "styled-components";

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
  align-items: flex-start;
  gap: 10px;

  width: 100%;
`;

const Select = styled.select`
  padding: 6px;
  width: 100%;
  min-width: 80px;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.typography.sizes.label};
  font-family: ${({ theme }) => theme.typography.fonts.regular};
  border: ${({ theme }) => theme.borders.width.thin} solid transparent;
  border-radius: ${({ theme }) => theme.borders.radius.medium};
  background-color: ${({ theme }) => theme.colors.secondaryBackground};
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.14);
  &:disabled {
    background-color: ${({ theme }) => theme.colors.secondaryBackground};
    border-color: ${({ theme }) => theme.colors.secondaryBackground};
    color: ${({ theme }) => theme.colors.textSecondary};
  }
  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    outline: none;
  }

  @media (max-width: 768px) {
    font-size: 16px;
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

interface DatePickerProps {
  currentValue?: string;
  onChange: (date: Date) => void;
  required?: boolean;
  settings?: "event" | "birthday" | null;
  minDate?: string; // ISO string format
  maxDate?: string; // ISO string format
  label?: string | null;
}

const DatePicker: React.FC<DatePickerProps> = ({
  currentValue,
  onChange,
  required = false,
  settings = "event",
  minDate,
  maxDate,
  label = null,
}) => {
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [selectedDay, setSelectedDay] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (currentValue) {
      const date = new Date(currentValue);
      if (!isNaN(date.getTime())) {
        setSelectedYear(date.getFullYear().toString());
        setSelectedMonth((date.getMonth() + 1).toString());
        setSelectedDay(date.getDate().toString());
      }
    }
  }, [currentValue]);

  useEffect(() => {
    if (selectedYear && selectedMonth && selectedDay) {
      const pickedDate = new Date(
        parseInt(selectedYear),
        parseInt(selectedMonth) - 1,
        parseInt(selectedDay)
      );

      if (minDate && pickedDate < new Date(minDate)) {
        setError(
          `Date cannot be earlier than ${new Date(
            minDate
          ).toLocaleDateString()}`
        );
        return;
      }

      if (maxDate && pickedDate > new Date(maxDate)) {
        setError(
          `Date cannot be later than ${new Date(maxDate).toLocaleDateString()}`
        );
        return;
      }

      if (settings === "event" && pickedDate < new Date()) {
        setError("Date cannot be in the past");
      } else if (!settings) {
        setError(null);
        onChange(pickedDate);
      } else {
        setError(null);
        onChange(pickedDate);
      }
    } else if (required) {
      setError("Please select a valid date");
    } else {
      setError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedYear, selectedMonth, selectedDay, required, settings]);

  const generateYearOptions = (): number[] => {
    const years: number[] = [];
    const currentYear = new Date().getFullYear();

    let minYear = minDate ? new Date(minDate).getFullYear() : currentYear - 70;
    let maxYear = maxDate ? new Date(maxDate).getFullYear() : currentYear + 3;

    if (settings === "birthday") {
      minYear = minDate ? new Date(minDate).getFullYear() : currentYear - 100;
      maxYear = maxDate ? new Date(maxDate).getFullYear() : currentYear;
    }

    for (let i = minYear; i <= maxYear; i++) {
      years.push(i);
    }
    return years;
  };

  const generateMonthOptions = () => [
    { value: 1, name: "January" },
    { value: 2, name: "February" },
    { value: 3, name: "March" },
    { value: 4, name: "April" },
    { value: 5, name: "May" },
    { value: 6, name: "June" },
    { value: 7, name: "July" },
    { value: 8, name: "August" },
    { value: 9, name: "September" },
    { value: 10, name: "October" },
    { value: 11, name: "November" },
    { value: 12, name: "December" },
  ];

  const generateDayOptions = (): number[] => {
    const days: number[] = [];
    if (selectedYear && selectedMonth) {
      const daysInMonth = new Date(
        parseInt(selectedYear),
        parseInt(selectedMonth),
        0
      ).getDate();

      for (let i = 1; i <= daysInMonth; i++) {
        const potentialDate = new Date(
          parseInt(selectedYear),
          parseInt(selectedMonth) - 1,
          i
        );

        if (
          (!minDate || potentialDate >= new Date(minDate)) &&
          (!maxDate || potentialDate <= new Date(maxDate))
        ) {
          days.push(i);
        }
      }
    }
    return days;
  };

  return (
    <Container>
      {!!label && label.trim() !== "" && <Label>{label}</Label>}
      <DropdownRow>
        <Select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          <option value="">Year</option>
          {generateYearOptions().map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </Select>
        <Select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          disabled={!selectedYear}
        >
          <option value="">Month</option>
          {generateMonthOptions().map((month) => (
            <option key={month.value} value={month.value}>
              {month.name}
            </option>
          ))}
        </Select>
        <Select
          value={selectedDay}
          onChange={(e) => setSelectedDay(e.target.value)}
          disabled={!selectedMonth}
        >
          <option value="">Day</option>
          {generateDayOptions().map((day) => (
            <option key={day} value={day}>
              {day}
            </option>
          ))}
        </Select>
      </DropdownRow>
      {error && <ErrorText>{error}</ErrorText>}
    </Container>
  );
};

export default DatePicker;
