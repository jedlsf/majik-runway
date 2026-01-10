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

import {
  MajikMoney,
  isMajikService,
  type RevenueItem,
  isMajikServiceClass,
  MajikService,
  ServiceRateUnit,
  ServiceType,
  type PeriodYYYYMM,
  type MajikServiceJSON,
} from "@thezelijah/majik-runway";

import RevenueStreamCostingManager from "../CostingManager/RevenueStreamCostingManager";

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

interface FormMajikServiceProps {
  onSubmit?: (formData: MajikService) => void;
  onCancel?: () => void;
  formData?: MajikService;
  currency?: string;
  period?: PeriodYYYYMM;
}

export const FormMajikService: React.FC<FormMajikServiceProps> = ({
  onSubmit,
  onCancel,
  formData,
  currency = "PHP",
  period,
}) => {
  const [, setRefreshKey] = useState<number>(0);
  const [formDataInstance, setFormDataInstance] = useState<MajikService>(() =>
    formData
      ? isMajikServiceClass(formData)
        ? formData
        : MajikService.parseFromJSON(formData as MajikServiceJSON)
      : MajikService.initialize("New Service", ServiceType.TIME_BASED, {
          amount: MajikMoney.zero(currency),
          unit: ServiceRateUnit.PER_HOUR,
        })
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

  const handleChangeMajikServiceName = (input: string) => {
    if (!!input && !!formDataInstance) {
      try {
        const updatedMajikServiceInstance = formDataInstance.setName(input);

        setFormDataInstance(updatedMajikServiceInstance);
        setRefreshKey((prev) => prev + 1);

        if (isDevEnvironment())
          console.log(
            "Current MajikService Name: ",
            updatedMajikServiceInstance.name
          );
      } catch (error) {
        toast.error(
          `There's a problem updating the MajikService's Name. Please try again or try refreshing. Error: ${error}`
        );
      }
    }

    setIsProceedEnabled(validateForm());
  };

  const handleChangeMajikServiceDescription = (html: string, text: string) => {
    if (!!html && !!text && !!formDataInstance) {
      try {
        if (!!html && html.trim() !== "") {
          const updatedMajikServiceInstance = formDataInstance.setDescription(
            html,
            text
          );

          setFormDataInstance(updatedMajikServiceInstance);
          setRefreshKey((prev) => prev + 1);

          if (isDevEnvironment())
            console.log(
              "Current MajikService Description Text: ",
              updatedMajikServiceInstance.metadata?.description?.text
            );
          if (isDevEnvironment())
            console.log(
              "Current MajikService Description HTML: ",
              updatedMajikServiceInstance.metadata?.description?.html
            );
        }
      } catch (error) {
        toast.error(
          `There's a problem updating the MajikService's Description. Please try again or try refreshing. Error: ${error}`
        );
      }
    }

    setIsProceedEnabled(validateForm());
  };

  const handleChangeMajikServiceType = (input: string) => {
    if (!!input && !!formDataInstance) {
      try {
        const updatedMajikServiceInstance = formDataInstance.setType(
          input as ServiceType
        );

        setFormDataInstance(updatedMajikServiceInstance);
        setRefreshKey((prev) => prev + 1);

        if (isDevEnvironment())
          console.log(
            "Current MajikService Type: ",
            updatedMajikServiceInstance.type
          );
      } catch (error) {
        toast.error(
          `There's a problem updating the MajikService's Name. Please try again or try refreshing. Error: ${error}`
        );
      }
    }

    setIsProceedEnabled(validateForm());
  };

  const handleChangeMajikServiceServiceRateUnit = (input: string) => {
    if (!!input && !!formDataInstance) {
      try {
        const updatedMajikServiceInstance = formDataInstance.setRateUnit(
          input as ServiceRateUnit
        );

        setFormDataInstance(updatedMajikServiceInstance);
        setRefreshKey((prev) => prev + 1);

        if (isDevEnvironment())
          console.log(
            "Current MajikService Rate Unit: ",
            updatedMajikServiceInstance.rate.unit
          );
      } catch (error) {
        toast.error(
          `There's a problem updating the MajikService's Name. Please try again or try refreshing. Error: ${error}`
        );
      }
    }

    setIsProceedEnabled(validateForm());
  };

  const handleChangeMajikServicePrice = (input: string) => {
    if (!!input && !!formDataInstance) {
      try {
        const updatedMajikServiceInstance = formDataInstance.setRateAmount(
          parseFloat(input)
        );

        setFormDataInstance(updatedMajikServiceInstance);
        setRefreshKey((prev) => prev + 1);

        if (isDevEnvironment())
          console.log(
            "Current MajikService Rate: ",
            updatedMajikServiceInstance.rate.amount.format()
          );
      } catch (error) {
        toast.error(
          `There's a problem updating the MajikService's SRP. Please try again or try refreshing. Error: ${error}`
        );
      }
    }

    setIsProceedEnabled(validateForm());
  };

  const handleUpdateCostBreakdown = (input: RevenueItem) => {
    try {
      if (!isMajikService(input)) return;
      const updatedMajikServiceInstance = formDataInstance.setCOS([
        ...input.cos,
      ]);

      setFormDataInstance(updatedMajikServiceInstance);
      setRefreshKey((prev) => prev + 1);

      if (isDevEnvironment())
        console.log(
          "Current MajikService Cost Breakdown: ",
          updatedMajikServiceInstance.cos
        );
    } catch (error) {
      toast.error(
        `There's a problem updating the MajikService's Cost Breakdown. Please try again or try refreshing. Error: ${error}`
      );
    }
  };

  const handleUpdateCapacity = (input: RevenueItem) => {
    try {
      if (!isMajikService(input)) return;
      const updatedMajikServiceInstance = formDataInstance.setCapacity([
        ...input.capacity,
      ]);

      setFormDataInstance(updatedMajikServiceInstance);
      setRefreshKey((prev) => prev + 1);

      if (isDevEnvironment())
        console.log(
          "Current MajikService Capacity Plan: ",
          updatedMajikServiceInstance.capacity
        );
    } catch (error) {
      toast.error(
        `There's a problem updating the MajikService's Capacity Plan. Please try again or try refreshing. Error: ${error}`
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
          <SectionTitle>New Service</SectionTitle>

          <CustomInputField
            required
            label="Service Name"
            isLabelHint={false}
            onChange={handleChangeMajikServiceName}
            currentValue={formDataInstance.name}
            maxChar={200}
            capitalize={"word"}
          />
          <HelperColumn>
            <HelperText>Enter the display name of the service.</HelperText>
          </HelperColumn>

          <CustomDropdown
            options={ServiceType}
            required
            title="Type"
            label="Type"
            onChange={handleChangeMajikServiceType}
            currentValue={formDataInstance.type || ServiceType.TIME_BASED}
          />

          <TipTapTextEditor
            label="Description"
            content={formDataInstance.metadata.description?.html || ""}
            onChange={handleChangeMajikServiceDescription}
          />

          <HelperColumn>
            <HelperText>
              Provide a brief description for this service.
            </HelperText>
          </HelperColumn>

          <CustomInputField
            label={`Rate (in ${currency || "PHP"})`}
            isLabelHint={false}
            onChange={handleChangeMajikServicePrice}
            currentValue={formDataInstance.rate.amount
              .toMajorDecimal()
              .toString()}
            maxChar={25}
            required
            regex="numbers"
          />
          <CustomDropdown
            options={ServiceRateUnit}
            required
            title="Rate Unit"
            label="Rate Unit"
            onChange={handleChangeMajikServiceServiceRateUnit}
            currentValue={
              formDataInstance.rate.unit || ServiceRateUnit.PER_HOUR
            }
          />
          <HelperColumn>
            <HelperText>The rate you charge for this service.</HelperText>
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

export default FormMajikService;
