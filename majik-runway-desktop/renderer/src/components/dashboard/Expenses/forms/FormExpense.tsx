"use client";

import React, { useState } from "react";
import styled from "styled-components";

import { toast } from "sonner";

import { SectionTitle } from "@/globals/styled-components";

import CustomInputField from "@/components/foundations/CustomInputField";

import { isDevEnvironment } from "@/utils/helper";

import CustomDropdown from "@/components/foundations/CustomDropdown";

import ScrollableForm from "@/components/foundations/ScrollableForm";

import {
  MajikMoney,
  type PeriodYYYYMM,
  type YYYYMM,
  ExpenseType,
  Recurrence,
  Expense,
  type ExpenseState,
  autogenerateID,
  dateToYYYYMM,
} from "@thezelijah/majik-runway";

import CustomToggleSwitch from "@/components/foundations/CustomToggleSwitch";
import DateYYYYMMPicker from "@/components/foundations/DateYYYYMMPicker";
import { ValueIncrementor } from "@/components/functional/ValueIncrementor";

// Styled components
const BodyContainer = styled.div`
  width: 100%;
  align-items: center;
  justify-content: flex-start;
  display: flex;
  flex-direction: column;
  user-select: none;
  height: inherit;
  gap: 5px;
  min-width: 620px;

  background-color: ${({ theme }) => theme.colors.primaryBackground};

  @media (max-width: 768px) {
    min-width: 280px;
  }
`;

const FormBodyEvent = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 500px;
  width: 100%;

  gap: 15px;
  padding: 15px;
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

  font-weight: 300;
`;

interface FormExpenseProps {
  onSubmit?: (formData: Expense) => void;
  onCancel?: () => void;
  formData?: Expense;
  currency?: string;
  period: PeriodYYYYMM;
  type: "one-time" | "recurring" | "capital";
}

export const FormExpense: React.FC<FormExpenseProps> = ({
  onSubmit,
  onCancel,
  formData,
  currency = "PHP",
  period,
  type = "recurring",
}) => {
  const [formDataInstance, setFormDataInstance] = useState<ExpenseState>({
    id: formData?.id || autogenerateID("mjkex"),
    amount: formData?.amount || MajikMoney.zero(currency),
    recurrence:
      type === "recurring"
        ? formData?.recurrence || Recurrence.Monthly
        : undefined,
    isTaxDeductible: formData?.isTaxDeductible || true,
    type: formData?.type || ExpenseType.Operating,
    name: formData?.name || "New Expense",
    capitalMeta: {
      depreciationMonths:
        formData?.depreciationMonths || type === "capital" ? 12 : 0,
    },
  });

  const [isProceedEnabled, setIsProceedEnabled] = useState<boolean>(
    formData ? formData.amount.isZero() : false
  );

  const [pickedDate, setPickedDate] = useState<YYYYMM>(
    dateToYYYYMM(new Date())
  );

  const validateForm = () => {
    return (
      !formDataInstance.amount.isZero() ||
      !formDataInstance?.name?.trim() ||
      !formDataInstance?.type?.trim() ||
      !formDataInstance?.id?.trim() ||
      false
    );
  };

  const handleCancel = () => {
    console.log("Cancelling Form");
    onCancel?.();
  };

  const handleChangeExpenseName = (input: string) => {
    if (!!input && !!formDataInstance) {
      try {
        setFormDataInstance((prev) => ({
          ...prev,
          name: input,
        }));

        if (isDevEnvironment())
          console.log("Current Expense Name: ", formDataInstance.name);
      } catch (error) {
        toast.error(
          `There's a problem updating the Expense's Name. Please try again or try refreshing. Error: ${error}`
        );
      }
    }

    setIsProceedEnabled(validateForm());
  };

  const handleChangeExpenseType = (input: string) => {
    if (!!input && !!formDataInstance) {
      try {
        setFormDataInstance((prev) => ({
          ...prev,
          type: input as ExpenseType,
        }));

        if (isDevEnvironment())
          console.log("Current Expense Type: ", formDataInstance.type);
      } catch (error) {
        toast.error(
          `There's a problem updating the Expense's Name. Please try again or try refreshing. Error: ${error}`
        );
      }
    }

    setIsProceedEnabled(validateForm());
  };

  const handleChangeExpenseTax = (input: boolean) => {
    if (formDataInstance) {
      try {
        setFormDataInstance((prev) => ({
          ...prev,
          isTaxDeductible: input,
        }));

        if (isDevEnvironment())
          console.log("Current Expense Tax: ", formDataInstance.type);
      } catch (error) {
        toast.error(
          `There's a problem updating the Expense's Tax. Please try again or try refreshing. Error: ${error}`
        );
      }
    }

    setIsProceedEnabled(validateForm());
  };

  const handleChangeExpenseRecurrence = (input: string) => {
    if (!!input && !!formDataInstance) {
      try {
        setFormDataInstance((prev) => ({
          ...prev,
          recurrence: input as Recurrence,
        }));

        if (isDevEnvironment())
          console.log(
            "Current Expense Recurrence: ",
            formDataInstance.recurrence
          );
      } catch (error) {
        toast.error(
          `There's a problem updating the Expense's Name. Please try again or try refreshing. Error: ${error}`
        );
      }
    }

    setIsProceedEnabled(validateForm());
  };

  const handleChangeExpensePrice = (input: string) => {
    if (!!input && !!formDataInstance) {
      try {
        setFormDataInstance((prev) => ({
          ...prev,
          amount: MajikMoney.fromMajor(parseFloat(input), currency),
        }));

        if (isDevEnvironment())
          console.log(
            "Current Expense Amount: ",
            formDataInstance.amount.format()
          );
      } catch (error) {
        toast.error(
          `There's a problem updating the Expense's Amount. Please try again or try refreshing. Error: ${error}`
        );
      }
    }

    setIsProceedEnabled(validateForm());
  };

  const handleUpdateMonthYear = (input: YYYYMM) => {
    setPickedDate(input);
  };
  const handleChangeCapitalExpenseDepMonths = (input: number) => {
    if (!!input && !!formDataInstance) {
      try {
        setFormDataInstance((prev) => ({
          ...prev,
          capitalMeta: {
            ...prev.capitalMeta,
            depreciationMonths: input,
          },
        }));

        if (isDevEnvironment())
          console.log(
            "Current Expense Depreciation in Months: ",
            formDataInstance.capitalMeta?.depreciationMonths
          );
      } catch (error) {
        toast.error(
          `There's a problem updating the Expense's Depreciation. Please try again or try refreshing. Error: ${error}`
        );
      }
    }

    setIsProceedEnabled(validateForm());
  };

  const handleSubmitSave = () => {
    console.log("Submitting Form");
    if (!validateForm()) {
      toast.error(`Missing fields. Complete the form.`);
    }

    switch (type) {
      case "recurring": {
        const newExpense = Expense.recurring(
          undefined,
          formDataInstance.name,
          formDataInstance.amount.toMajor(),
          currency,
          formDataInstance.recurrence,
          period,
          formDataInstance.isTaxDeductible
        );
        onSubmit?.(newExpense);
        return;
      }
      case "one-time": {
        const newExpense = Expense.oneTime(
          undefined,
          formDataInstance.name,
          formDataInstance.amount.toMajor(),
          currency,
          pickedDate,
          formDataInstance.isTaxDeductible
        );
        onSubmit?.(newExpense);
        return;
      }
      case "capital": {
        const newExpense = Expense.capital(
          undefined,
          formDataInstance.name,
          formDataInstance.amount.toMajor(),
          currency,
          pickedDate,
          formDataInstance.capitalMeta?.depreciationMonths || 12,
          undefined,
          formDataInstance.isTaxDeductible
        );
        onSubmit?.(newExpense);
        return;
      }
      default:
        return;
    }
  };

  const handleViewTestInstance = () => {
    console.log("Instance: ", formDataInstance);
  };

  return (
    <BodyContainer>
      <ScrollableForm
        onClickCancel={handleCancel}
        onClickProceed={handleSubmitSave}
        onDebug={handleViewTestInstance}
        isDisabledProceed={!isProceedEnabled}
      >
        <FormBodyEvent>
          <SectionTitle>New Expense</SectionTitle>

          <CustomInputField
            required
            label="Expense Name"
            isLabelHint={false}
            onChange={handleChangeExpenseName}
            currentValue={formDataInstance.name}
            maxChar={200}
            capitalize={"word"}
          />
          <HelperColumn>
            <HelperText>Enter the display name of the expense.</HelperText>
          </HelperColumn>

          <CustomDropdown
            options={ExpenseType}
            required
            title="Type"
            label="Type"
            onChange={handleChangeExpenseType}
            currentValue={formDataInstance.type || ExpenseType.Operating}
          />

          {type === "recurring" && (
            <CustomDropdown
              options={Recurrence}
              required
              title="Recurrence"
              label="Recurrence"
              onChange={handleChangeExpenseRecurrence}
              currentValue={formDataInstance.recurrence || Recurrence.Monthly}
            />
          )}

          {type !== "recurring" && (
            <DateYYYYMMPicker
              required
              value={pickedDate}
              onChange={handleUpdateMonthYear}
              label="Month"
              min={period?.startMonth}
              max={period?.endMonth}
            />
          )}

          {type === "capital" && (
            <ValueIncrementor
              label="Depreciation"
              currentValue={
                formDataInstance.capitalMeta?.depreciationMonths || 12
              }
              direction="row"
              incrementValue={1}
              onUpdate={handleChangeCapitalExpenseDepMonths}
              displayValue={`${formDataInstance.capitalMeta?.depreciationMonths?.toLocaleString()} months`}
            />
          )}

          <CustomInputField
            label={`Rate (in ${currency || "PHP"})`}
            isLabelHint={false}
            onChange={handleChangeExpensePrice}
            currentValue={formDataInstance.amount.toMajorDecimal().toString()}
            maxChar={25}
            required
            regex="numbers"
          />
          <CustomToggleSwitch
            label="Is Tax Deductible"
            currentToggle={formDataInstance.isTaxDeductible}
            onToggle={handleChangeExpenseTax}
          />
        </FormBodyEvent>
      </ScrollableForm>
    </BodyContainer>
  );
};

export default FormExpense;
