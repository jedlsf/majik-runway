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
  autogenerateID,
  dateToYYYYMM,
  yyyyMMToDate,
  CompoundingFrequency,
  type FundingEventState,
  FundingType,
  FundingEvent,
} from "@thezelijah/majik-runway";

import DateYYYYMMPicker from "@/components/foundations/DateYYYYMMPicker";
import { ValueIncrementor } from "@/components/functional/ValueIncrementor";

import DatePicker from "@/components/foundations/DatePicker";

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

interface FormFundingProps {
  onSubmit?: (formData: FundingEvent) => void;
  onCancel?: () => void;
  formData?: FundingEvent;
  currency?: string;
  period: PeriodYYYYMM;
  type?: FundingType;
}

export const FormFunding: React.FC<FormFundingProps> = ({
  onSubmit,
  onCancel,
  formData,
  currency = "PHP",
  period,
  type,
}) => {
  
  const [formDataInstance, setFormDataInstance] = useState<FundingEventState>({
    id: formData?.id || autogenerateID("mjkfd"),
    amount: formData?.amount || MajikMoney.zero(currency),
    month: dateToYYYYMM(new Date()),
    type: formData?.type || FundingType.Equity,
    name: formData?.name || "New Funding",
    meta: {
      discountRate: formData?.discountRate,
      maturityMonth: formData?.maturityMonth,
      valuationCap: formData?.valuationCap,
    },
    debt: formData?.debtMetadata,
  });

  const [isProceedEnabled, setIsProceedEnabled] = useState<boolean>(
    formData ? formData.amount.isZero() : false
  );

  const validateForm = () => {
    if (formDataInstance.type === FundingType.Debt) {
      return (
        !formDataInstance.amount.isZero() ||
        !formDataInstance?.name?.trim() ||
        !formDataInstance?.type?.trim() ||
        !formDataInstance?.id?.trim() ||
        !formDataInstance?.debt?.maturityDate?.trim() ||
        !formDataInstance?.debt?.interestRate ||
        formDataInstance.debt.interestRate < 0 ||
        !formDataInstance?.debt?.compounding?.trim() ||
        false
      );
    }

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

  const handleChangeFundingEventName = (input: string) => {
    if (!!input && !!formDataInstance) {
      try {
        setFormDataInstance((prev) => ({
          ...prev,
          name: input,
        }));

        if (isDevEnvironment())
          console.log("Current FundingEvent Name: ", formDataInstance.name);
      } catch (error) {
        toast.error(
          `There's a problem updating the Fund's name. Please try again or try refreshing. Error: ${error}`
        );
      }
    }

    setIsProceedEnabled(validateForm());
  };

  const handleChangeFundingEventType = (input: string) => {
    if (!!input && !!formDataInstance) {
      try {
        setFormDataInstance((prev) => ({
          ...prev,
          type: input as FundingType,
        }));

        if (isDevEnvironment())
          console.log("Current FundingEvent Type: ", formDataInstance.type);
      } catch (error) {
        toast.error(
          `There's a problem updating the Fund's type. Please try again or try refreshing. Error: ${error}`
        );
      }
    }

    setIsProceedEnabled(validateForm());
  };

  const handleChangeDebtCompoundFrequency = (input: string) => {
    if (!!input && !!formDataInstance) {
      try {
        setFormDataInstance((prev) => ({
          ...prev,
          debt: {
            ...prev.debt,
            compounding: input as CompoundingFrequency,
          },
        }));

        if (isDevEnvironment())
          console.log(
            "Current FundingEvent Compounding Frequency: ",
            formDataInstance.type
          );
      } catch (error) {
        toast.error(
          `There's a problem updating the Fund's debt compounding frequency. Please try again or try refreshing. Error: ${error}`
        );
      }
    }

    setIsProceedEnabled(validateForm());
  };

  const handleChangeFundingEventAmount = (input: string) => {
    if (!!input && !!formDataInstance) {
      try {
        setFormDataInstance((prev) => ({
          ...prev,
          amount: MajikMoney.fromMajor(parseFloat(input), currency),
        }));

        if (isDevEnvironment())
          console.log(
            "Current FundingEvent Amount: ",
            formDataInstance.amount.format()
          );
      } catch (error) {
        toast.error(
          `There's a problem updating the Fund's amount. Please try again or try refreshing. Error: ${error}`
        );
      }
    }

    setIsProceedEnabled(validateForm());
  };

  const handleChangeDebtGracePeriod = (input: number) => {
    if (!!input && !!formDataInstance) {
      try {
        setFormDataInstance((prev) => ({
          ...prev,
          debt: {
            ...prev.debt,
            gracePeriodMonths: input > 0 ? input : undefined,
          },
        }));

        if (isDevEnvironment())
          console.log(
            "Current FundingEvent Debt Grace Period: ",
            formDataInstance.amount.format()
          );
      } catch (error) {
        toast.error(
          `There's a problem updating the Fund's debt grace period. Please try again or try refreshing. Error: ${error}`
        );
      }
    }

    setIsProceedEnabled(validateForm());
  };

  const handleChangeDebtInitialPayment = (input: string) => {
    if (!!input && !!formDataInstance) {
      try {
        setFormDataInstance((prev) => ({
          ...prev,
          debt: {
            ...prev.debt,
            initialPayment: MajikMoney.fromMajor(parseFloat(input), currency),
          },
        }));

        if (isDevEnvironment())
          console.log(
            "Current FundingEvent Debt Initial Payment: ",
            formDataInstance.amount.format()
          );
      } catch (error) {
        toast.error(
          `There's a problem updating the Fund's debt initial payment. Please try again or try refreshing. Error: ${error}`
        );
      }
    }

    setIsProceedEnabled(validateForm());
  };

  const handleUpdateMonthYear = (input: YYYYMM) => {
    if (formDataInstance) {
      try {
        setFormDataInstance((prev) => ({
          ...prev,
          month: input,
        }));

        if (isDevEnvironment())
          console.log("Current FundingEvent Month: ", formDataInstance.month);
      } catch (error) {
        toast.error(
          `There's a problem updating the Fund's Month. Please try again or try refreshing. Error: ${error}`
        );
      }
    }

    setIsProceedEnabled(validateForm());
  };

  const handleUpdateDebtMaturityDate = (input: Date) => {
    if (formDataInstance) {
      try {
        setFormDataInstance((prev) => ({
          ...prev,
          debt: {
            ...prev.debt,
            maturityDate: input.toISOString(),
          },
        }));

        if (isDevEnvironment())
          console.log(
            "Current FundingEvent Debt Maturity Date: ",
            formDataInstance.debt?.maturityDate
          );
      } catch (error) {
        toast.error(
          `There's a problem updating the Fund's Debt Maturity Date. Please try again or try refreshing. Error: ${error}`
        );
      }
    }

    setIsProceedEnabled(validateForm());
  };

  const handleChangeDebtInterestRate = (input: number) => {
    if (formDataInstance) {
      try {
        setFormDataInstance((prev) => ({
          ...prev,
          debt: {
            ...prev.debt,
            interestRate: input > 0 ? input / 100 : undefined,
          },
        }));

        if (isDevEnvironment())
          console.log(
            "Current FundingEvent Interest Rate: ",
            formDataInstance.debt?.interestRate
          );
      } catch (error) {
        toast.error(
          `There's a problem updating the Fund's Interest Rate. Please try again or try refreshing. Error: ${error}`
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
      case FundingType.Equity: {
        const newFundingEvent = FundingEvent.equity(
          formDataInstance.name,
          formDataInstance.amount.toMajor(),
          formDataInstance.month,
          currency
        );
        onSubmit?.(newFundingEvent);
        return;
      }
      case FundingType.Debt: {
        if (!formDataInstance.debt?.maturityDate) {
          toast.error(`Missing Maturity Date. Complete the form.`);
          return;
        }
        const newFundingEvent = FundingEvent.debt(
          formDataInstance.name,
          formDataInstance.amount.toMajor(),
          formDataInstance.month,
          formDataInstance.debt?.maturityDate,
          currency,
          formDataInstance.debt?.interestRate,
          formDataInstance.debt?.initialPayment?.toMajor()
        );
        onSubmit?.(newFundingEvent);
        return;
      }
      case FundingType.Grant: {
        const newFundingEvent = FundingEvent.grant(
          formDataInstance.name,
          formDataInstance.amount.toMajor(),
          formDataInstance.month,
          currency
        );
        onSubmit?.(newFundingEvent);
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
          <SectionTitle>New FundingEvent</SectionTitle>

          <CustomInputField
            required
            label="Fund Name"
            isLabelHint={false}
            onChange={handleChangeFundingEventName}
            currentValue={formDataInstance.name}
            maxChar={200}
            capitalize={"word"}
          />
          <HelperColumn>
            <HelperText>Enter the display name of the fund.</HelperText>
          </HelperColumn>

          {!type && (
            <CustomDropdown
              options={FundingType}
              required
              title="Type"
              label="Type"
              onChange={handleChangeFundingEventType}
              currentValue={formDataInstance.type || FundingType.Equity}
            />
          )}

          <DateYYYYMMPicker
            required
            value={formDataInstance.month}
            onChange={handleUpdateMonthYear}
            label="Month"
            min={period?.startMonth}
            max={period?.endMonth}
          />

          <CustomInputField
            label={`Amount (in ${currency || "PHP"})`}
            isLabelHint={false}
            onChange={handleChangeFundingEventAmount}
            currentValue={formDataInstance.amount.toMajorDecimal().toString()}
            maxChar={25}
            required
            regex="numbers"
          />

          {type === FundingType.Debt && (
            <>
              <ValueIncrementor
                label="Interest Rate"
                currentValue={(formDataInstance?.debt?.interestRate || 0) * 100}
                direction="row"
                incrementValue={0.01}
                onUpdate={handleChangeDebtInterestRate}
                displayValue={`${(
                  (formDataInstance?.debt?.interestRate || 0) * 100
                ).toFixed(2)} %`}
                helper="The interest rate expressed as a percentage."
                minValue={0}
                disableDecrement={
                  type === FundingType.Debt &&
                  formDataInstance?.debt?.interestRate === 0
                }
              />

              <CustomInputField
                label={`Initial Payment (in ${currency || "PHP"})`}
                isLabelHint={false}
                onChange={handleChangeDebtInitialPayment}
                currentValue={formDataInstance.debt?.initialPayment
                  ?.toMajorDecimal()
                  .toString()}
                maxChar={25}
                required
                regex="numbers"
              />

              <CustomDropdown
                options={CompoundingFrequency}
                required
                title="Compounding Frequency"
                label="Compounding"
                onChange={handleChangeDebtCompoundFrequency}
                currentValue={
                  formDataInstance.debt?.compounding ||
                  CompoundingFrequency.None
                }
              />

              <DatePicker
                required
                currentValue={formDataInstance.debt?.maturityDate}
                onChange={handleUpdateDebtMaturityDate}
                label="Debt Maturity Date"
                minDate={yyyyMMToDate(period.startMonth).toISOString()}
                maxDate={yyyyMMToDate(period.endMonth).toISOString()}
              />

              <ValueIncrementor
                label="Grace Period"
                currentValue={formDataInstance.debt?.gracePeriodMonths || 0}
                direction="row"
                incrementValue={1}
                onUpdate={handleChangeDebtGracePeriod}
                displayValue={`${
                  formDataInstance.debt?.gracePeriodMonths
                    ? formDataInstance.debt?.gracePeriodMonths?.toLocaleString()
                    : 0
                } months`}
                helper="Grace period in months before repayment starts"
              />
            </>
          )}
        </FormBodyEvent>
      </ScrollableForm>
    </BodyContainer>
  );
};

export default FormFunding;
