"use client";

import React, { useState } from "react";
import styled from "styled-components";

import { toast } from "sonner";

import { SectionTitle } from "@/globals/styled-components";

import CustomInputField from "@/components/foundations/CustomInputField";

import { isDevEnvironment } from "@/utils/helper";

import CustomDropdown from "@/components/foundations/CustomDropdown";
import TipTapTextEditor from "@/components/tip-tap/TipTapTextEditor";

import ScrollableForm from "@/components/foundations/ScrollableForm";

import RevenueStreamCostingManager from "../CostingManager/RevenueStreamCostingManager";
import {
  MajikMoney,
  isMajikSubscription,
  type RevenueItem,
  isMajikSubscriptionClass,
  MajikSubscription,
  BillingCycle,
  SubscriptionRateUnit,
  SubscriptionType,
  type PeriodYYYYMM,
  type MajikSubscriptionJSON,
} from "@thezelijah/majik-runway";
import RevenueStreamSupplyCapacityManager from "../SupplyCapacityManager/RevenueStreamSupplyCapacityManager";

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
  min-width: 420px;

  background-color: ${({ theme }) => theme.colors.primaryBackground};

  @media (max-width: 768px) {
    min-width: 280px;
  }
`;

const FormBodyEvent = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 300px;
  width: 100%;
  flex-grow: 1; /* Allows it to grow and take available space */
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

interface FormMajikSubscriptionProps {
  onSubmit?: (formData: MajikSubscription) => void;
  onCancel?: () => void;
  formData?: MajikSubscription;
  currency?: string;
  period?: PeriodYYYYMM;
}

export const FormMajikSubscription: React.FC<FormMajikSubscriptionProps> = ({
  onSubmit,
  onCancel,
  formData,
  currency = "PHP",
  period,
}) => {
  const [, setRefreshKey] = useState<number>(0);
  const [formDataInstance, setFormDataInstance] = useState<MajikSubscription>(
    () =>
      formData
        ? isMajikSubscriptionClass(formData)
          ? formData
          : MajikSubscription.parseFromJSON(formData as MajikSubscriptionJSON)
        : MajikSubscription.initialize(
            "New Subscription",
            SubscriptionType.RECURRING,
            {
              amount: MajikMoney.zero(currency),
              unit: SubscriptionRateUnit.PER_USER,
              billingCycle: BillingCycle.MONTHLY,
            }
          )
  );

  const [isProceedEnabled, setIsProceedEnabled] = useState<boolean>(
    formData ? formDataInstance.validateSelf(false) : false
  );

  const validateForm = () => {
    return formDataInstance.validateSelf(false) || false;
  };

  const handleCancel = () => {
    console.log("Cancelling Form");
    onCancel?.();
  };

  const handleChangeMajikSubscriptionName = (input: string) => {
    if (!!input && !!formDataInstance) {
      try {
        const updatedMajikSubscriptionInstance =
          formDataInstance.setName(input);

        setFormDataInstance(updatedMajikSubscriptionInstance);
        setRefreshKey((prev) => prev + 1);

        if (isDevEnvironment())
          console.log(
            "Current MajikSubscription Name: ",
            updatedMajikSubscriptionInstance.name
          );
      } catch (error) {
        toast.error(
          `There's a problem updating the MajikSubscription's Name. Please try again or try refreshing. Error: ${error}`
        );
      }
    }

    setIsProceedEnabled(validateForm());
  };

  const handleChangeMajikSubscriptionDescription = (
    html: string,
    text: string
  ) => {
    if (!!html && !!text && !!formDataInstance) {
      try {
        if (!!html && html.trim() !== "") {
          const updatedMajikSubscriptionInstance =
            formDataInstance.setDescription(html, text);

          setFormDataInstance(updatedMajikSubscriptionInstance);
          setRefreshKey((prev) => prev + 1);

          if (isDevEnvironment())
            console.log(
              "Current MajikSubscription Description Text: ",
              updatedMajikSubscriptionInstance.metadata?.description?.text
            );
          if (isDevEnvironment())
            console.log(
              "Current MajikSubscription Description HTML: ",
              updatedMajikSubscriptionInstance.metadata?.description?.html
            );
        }
      } catch (error) {
        toast.error(
          `There's a problem updating the MajikSubscription's Description. Please try again or try refreshing. Error: ${error}`
        );
      }
    }

    setIsProceedEnabled(validateForm());
  };

  const handleChangeMajikSubscriptionType = (input: string) => {
    if (!!input && !!formDataInstance) {
      try {
        const updatedMajikSubscriptionInstance = formDataInstance.setType(
          input as SubscriptionType
        );

        setFormDataInstance(updatedMajikSubscriptionInstance);
        setRefreshKey((prev) => prev + 1);

        if (isDevEnvironment())
          console.log(
            "Current MajikSubscription Type: ",
            updatedMajikSubscriptionInstance.type
          );
      } catch (error) {
        toast.error(
          `There's a problem updating the MajikSubscription's Name. Please try again or try refreshing. Error: ${error}`
        );
      }
    }

    setIsProceedEnabled(validateForm());
  };

  const handleChangeMajikSubscriptionSubscriptionRateUnit = (input: string) => {
    if (!!input && !!formDataInstance) {
      try {
        const updatedMajikSubscriptionInstance = formDataInstance.setRateUnit(
          input as SubscriptionRateUnit
        );

        setFormDataInstance(updatedMajikSubscriptionInstance);
        setRefreshKey((prev) => prev + 1);

        if (isDevEnvironment())
          console.log(
            "Current MajikSubscription Rate Unit: ",
            updatedMajikSubscriptionInstance.rate.unit
          );
      } catch (error) {
        toast.error(
          `There's a problem updating the MajikSubscription's Name. Please try again or try refreshing. Error: ${error}`
        );
      }
    }

    setIsProceedEnabled(validateForm());
  };

  const handleChangeMajikSubscriptionBillingCycle = (input: string) => {
    if (!!input && !!formDataInstance) {
      try {
        const updatedMajikSubscriptionInstance =
          formDataInstance.setBillingCycle(input as BillingCycle);

        setFormDataInstance(updatedMajikSubscriptionInstance);
        setRefreshKey((prev) => prev + 1);

        if (isDevEnvironment())
          console.log(
            "Current MajikSubscription Billing Cycle: ",
            updatedMajikSubscriptionInstance.rate.billingCycle
          );
      } catch (error) {
        toast.error(
          `There's a problem updating the MajikSubscription's Billing Cycle. Please try again or try refreshing. Error: ${error}`
        );
      }
    }

    setIsProceedEnabled(validateForm());
  };

  const handleChangeMajikSubscriptionPrice = (input: string) => {
    if (!!input && !!formDataInstance) {
      try {
        const updatedMajikSubscriptionInstance = formDataInstance.setRateAmount(
          parseFloat(input)
        );

        setFormDataInstance(updatedMajikSubscriptionInstance);
        setRefreshKey((prev) => prev + 1);

        if (isDevEnvironment())
          console.log(
            "Current MajikSubscription Rate: ",
            updatedMajikSubscriptionInstance.rate.amount.format()
          );
      } catch (error) {
        toast.error(
          `There's a problem updating the MajikSubscription's SRP. Please try again or try refreshing. Error: ${error}`
        );
      }
    }

    setIsProceedEnabled(validateForm());
  };

  const handleUpdateCostBreakdown = (input: RevenueItem) => {
    try {
      if (!isMajikSubscription(input)) return;
      const updatedMajikSubscriptionInstance = formDataInstance.setCOS([
        ...input.cos,
      ]);

      setFormDataInstance(updatedMajikSubscriptionInstance);
      setRefreshKey((prev) => prev + 1);

      if (isDevEnvironment())
        console.log(
          "Current MajikSubscription Cost Breakdown: ",
          updatedMajikSubscriptionInstance.cos
        );
    } catch (error) {
      toast.error(
        `There's a problem updating the MajikSubscription's Cost Breakdown. Please try again or try refreshing. Error: ${error}`
      );
    }
  };

  const handleUpdateCapacity = (input: RevenueItem) => {
    try {
      if (!isMajikSubscription(input)) return;
      const updatedMajikSubscriptionInstance = formDataInstance.setCapacity([
        ...input.capacity,
      ]);

      setFormDataInstance(updatedMajikSubscriptionInstance);
      setRefreshKey((prev) => prev + 1);

      if (isDevEnvironment())
        console.log(
          "Current MajikSubscription Capacity Plan: ",
          updatedMajikSubscriptionInstance.capacity
        );
    } catch (error) {
      toast.error(
        `There's a problem updating the MajikSubscription's Capacity Plan. Please try again or try refreshing. Error: ${error}`
      );
    }
  };

  const handleSubmitSave = () => {
    console.log("Submitting Form");

    try {
      formDataInstance.validateSelf(true);
    } catch (error) {
      toast.error(`Missing fields: ${error}`);
      return;
    }

    onSubmit?.(formDataInstance);
  };

  const handleViewTestInstance = () => {
    console.log("Instance: ", formDataInstance);
    try {
      formDataInstance.validateSelf(true);
    } catch (error) {
      console.log("Error: ", error);
    }
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
          <SectionTitle>New Subscription</SectionTitle>

          <CustomInputField
            required
            label="Subscription Name"
            isLabelHint={false}
            onChange={handleChangeMajikSubscriptionName}
            currentValue={formDataInstance.name}
            maxChar={200}
            capitalize={"word"}
          />
          <HelperColumn>
            <HelperText>Enter the display name of the subscription.</HelperText>
          </HelperColumn>

          <CustomDropdown
            options={SubscriptionType}
            required
            title="Type"
            label="Type"
            onChange={handleChangeMajikSubscriptionType}
            currentValue={formDataInstance.type || SubscriptionType.RECURRING}
          />

          <TipTapTextEditor
            label="Description"
            content={formDataInstance.metadata.description?.html || ""}
            onChange={handleChangeMajikSubscriptionDescription}
          />

          <HelperColumn>
            <HelperText>
              Provide a brief description for this subscription.
            </HelperText>
          </HelperColumn>

          <CustomInputField
            label={`Rate (in ${currency || "PHP"})`}
            isLabelHint={false}
            onChange={handleChangeMajikSubscriptionPrice}
            currentValue={formDataInstance.rate.amount
              .toMajorDecimal()
              .toString()}
            maxChar={25}
            required
            regex="numbers"
          />
          <CustomDropdown
            options={SubscriptionRateUnit}
            required
            title="Rate Unit"
            label="Rate Unit"
            onChange={handleChangeMajikSubscriptionSubscriptionRateUnit}
            currentValue={
              formDataInstance.rate.unit || SubscriptionRateUnit.PER_MONTH
            }
          />

          <CustomDropdown
            options={BillingCycle}
            required
            title="Billing Cycle"
            label="Billing Cycle"
            onChange={handleChangeMajikSubscriptionBillingCycle}
            currentValue={formDataInstance.rate.unit || BillingCycle.MONTHLY}
          />
          <HelperColumn>
            <HelperText>The rate you charge for this subscription.</HelperText>
          </HelperColumn>
          <RevenueStreamCostingManager
            onUpdate={handleUpdateCostBreakdown}
            item={formDataInstance}
          />
          <RevenueStreamSupplyCapacityManager
            onUpdate={handleUpdateCapacity}
            item={formDataInstance}
            period={period}
          />
        </FormBodyEvent>
      </ScrollableForm>
    </BodyContainer>
  );
};

export default FormMajikSubscription;
