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
  isMajikProductClass,
  MajikProduct,
  ProductType,
  MajikMoney,
  isMajikProduct,
  type RevenueItem,
  type PeriodYYYYMM,
  type MajikProductJSON,
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

interface FormMajikProductProps {
  onSubmit?: (formData: MajikProduct) => void;
  onCancel?: () => void;
  formData?: MajikProduct;
  currency?: string;
  period?: PeriodYYYYMM;
}

export const FormMajikProduct: React.FC<FormMajikProductProps> = ({
  onSubmit,
  onCancel,
  formData,
  currency = "PHP",
  period,
}) => {
  const [, setRefreshKey] = useState<number>(0);
  const [formDataInstance, setFormDataInstance] = useState<MajikProduct>(() =>
    formData
      ? isMajikProductClass(formData)
        ? formData
        : MajikProduct.parseFromJSON(formData as MajikProductJSON)
      : MajikProduct.initialize(
          "New Product",
          ProductType.PHYSICAL,
          MajikMoney.zero(currency)
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

  const handleChangeMajikProductName = (input: string) => {
    if (!!input && !!formDataInstance) {
      try {
        const updatedMajikProductInstance = formDataInstance.setName(input);

        setFormDataInstance(updatedMajikProductInstance);
        setRefreshKey((prev) => prev + 1);

        if (isDevEnvironment())
          console.log(
            "Current MajikProduct Name: ",
            updatedMajikProductInstance.name
          );
      } catch (error) {
        toast.error(
          `There's a problem updating the MajikProduct's Name. Please try again or try refreshing. Error: ${error}`
        );
      }
    }

    setIsProceedEnabled(validateForm());
  };

  const handleChangeMajikProductDescription = (html: string, text: string) => {
    if (!!html && !!text && !!formDataInstance) {
      try {
        if (!!html && html.trim() !== "") {
          const updatedMajikProductInstance = formDataInstance.setDescription(
            html,
            text
          );

          setFormDataInstance(updatedMajikProductInstance);
          setRefreshKey((prev) => prev + 1);

          if (isDevEnvironment())
            console.log(
              "Current MajikProduct Description Text: ",
              updatedMajikProductInstance.metadata?.description?.text
            );
          if (isDevEnvironment())
            console.log(
              "Current MajikProduct Description HTML: ",
              updatedMajikProductInstance.metadata?.description?.html
            );
        }
      } catch (error) {
        toast.error(
          `There's a problem updating the MajikProduct's Description. Please try again or try refreshing. Error: ${error}`
        );
      }
    }

    setIsProceedEnabled(validateForm());
  };

  const handleChangeMajikProductType = (input: string) => {
    if (!!input && !!formDataInstance) {
      try {
        const updatedMajikProductInstance = formDataInstance.setType(
          input as ProductType
        );

        setFormDataInstance(updatedMajikProductInstance);
        setRefreshKey((prev) => prev + 1);

        if (isDevEnvironment())
          console.log(
            "Current MajikProduct Type: ",
            updatedMajikProductInstance.type
          );
      } catch (error) {
        toast.error(
          `There's a problem updating the MajikProduct's Name. Please try again or try refreshing. Error: ${error}`
        );
      }
    }

    setIsProceedEnabled(validateForm());
  };

  const handleChangeMajikProductPrice = (input: string) => {
    if (!!input && !!formDataInstance) {
      try {
        const updatedMajikProductInstance = formDataInstance.setSRP(
          MajikMoney.fromMajor(parseFloat(input), currency)
        );

        setFormDataInstance(updatedMajikProductInstance);
        setRefreshKey((prev) => prev + 1);

        if (isDevEnvironment())
          console.log(
            "Current MajikProduct SRP: ",
            updatedMajikProductInstance.srp.format()
          );
      } catch (error) {
        toast.error(
          `There's a problem updating the MajikProduct's SRP. Please try again or try refreshing. Error: ${error}`
        );
      }
    }

    setIsProceedEnabled(validateForm());
  };

  const handleUpdateCostBreakdown = (input: RevenueItem) => {
    try {
      if (!isMajikProduct(input)) return;
      const updatedMajikProductInstance = formDataInstance.setCOGS([
        ...input.cogs,
      ]);

      setFormDataInstance(updatedMajikProductInstance);
      setRefreshKey((prev) => prev + 1);

      if (isDevEnvironment())
        console.log(
          "Current MajikProduct Cost Breakdown: ",
          updatedMajikProductInstance.cogs
        );
    } catch (error) {
      toast.error(
        `There's a problem updating the MajikProduct's Cost Breakdown. Please try again or try refreshing. Error: ${error}`
      );
    }
  };

  const handleUpdateCapacity = (input: RevenueItem) => {
    try {
      if (!isMajikProduct(input)) return;
      const updatedMajikProductInstance = formDataInstance.setCapacity([
        ...input.capacity,
      ]);

      setFormDataInstance(updatedMajikProductInstance);
      setRefreshKey((prev) => prev + 1);

      if (isDevEnvironment())
        console.log(
          "Current MajikProduct Capacity Plan: ",
          updatedMajikProductInstance.capacity
        );
    } catch (error) {
      toast.error(
        `There's a problem updating the MajikProduct's Capacity Plan. Please try again or try refreshing. Error: ${error}`
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
          <SectionTitle>New Product</SectionTitle>

          <CustomInputField
            required
            label="Product Name"
            isLabelHint={false}
            onChange={handleChangeMajikProductName}
            currentValue={formDataInstance.name}
            maxChar={200}
            capitalize={"word"}
          />
          <HelperColumn>
            <HelperText>Enter the display name of the product.</HelperText>
          </HelperColumn>

          <CustomDropdown
            options={ProductType}
            required
            title="Type"
            label="Type"
            onChange={handleChangeMajikProductType}
            currentValue={formDataInstance.type || ProductType.PHYSICAL}
          />

          <TipTapTextEditor
            label="Description"
            content={formDataInstance.metadata.description?.html || ""}
            onChange={handleChangeMajikProductDescription}
          />

          <HelperColumn>
            <HelperText>
              Provide a brief description for this product.
            </HelperText>
          </HelperColumn>

          <CustomInputField
            label={`Price (in ${currency || "PHP"})`}
            isLabelHint={false}
            onChange={handleChangeMajikProductPrice}
            currentValue={formDataInstance.srp.toMajorDecimal().toString()}
            maxChar={25}
            required
            regex="numbers"
          />
          <HelperColumn>
            <HelperText>How much you sell each unit for.</HelperText>
          </HelperColumn>
          <SectionTitle>Cost Breakdown</SectionTitle>

          <RevenueStreamCostingManager
            onUpdate={handleUpdateCostBreakdown}
            item={formDataInstance}
          />
          <SectionTitle>Capacity Plan</SectionTitle>
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

export default FormMajikProduct;
