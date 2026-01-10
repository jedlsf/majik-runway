"use client";

import React, { useState } from "react";
import styled from "styled-components";

import { toast } from "sonner";

import { isDevEnvironment } from "../../utils/helper";

import { VATMode, type TaxConfig } from "@thezelijah/majik-runway";

import CustomToggleSwitch from "../../components/foundations/CustomToggleSwitch";

import { ValueIncrementor } from "../../components/functional/ValueIncrementor";

import { SectionSubTitle } from "../../globals/styled-components";
import { EditableOption } from "../../components/foundations/EditableComponents/EditableOption";
import DuoButton from "../../components/foundations/DuoButton";

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
  flex-grow: 1; /* Allows it to grow and take available space */
  gap: 15px;
  padding: 15px;
  box-sizing: border-box; /* Include padding and borders in width/height */
`;

const OptionText = styled.p`
  font-size: 14px;
  width: auto;
  color: ${({ theme }) => theme.colors.textPrimary};
  white-space: nowrap;
  cursor: help;
`;

const ItemRow = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  gap: 15px;
  align-items: center;
  justify-content: flex-start;
  border: 1px solid ${({ theme }) => theme.colors.secondaryBackground};
  padding: 10px 25px;
  border-radius: 8px;

  @media (max-width: 1000px) {
    flex-direction: column;
  }
`;

const VATTypeRow = styled(ItemRow)`
  flex-direction: column;
  height: 120px;
  justify-content: center;
`;

const StackRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  gap: 15px;
  margin-top: 10px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const MenuSubtitle = styled.p`
  width: 100%;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

interface RunwayTaxConfigProps {
  onSubmit?: (formData: TaxConfig) => void;
  onCancel?: () => void;
  formData?: TaxConfig;
}

export const RunwayTaxConfig: React.FC<RunwayTaxConfigProps> = ({
  onSubmit,
  onCancel,
  formData,
}) => {
  const [formDataInstance, setFormDataInstance] = useState<TaxConfig>({
    vatMode: formData?.vatMode || VATMode.VAT,
    incomeTaxRate: formData?.incomeTaxRate || 0.08,
    percentageTaxRate: formData?.percentageTaxRate || 0.03,
    vatRate: formData?.vatRate || 0.12,
  });

  // Helper function to check if tax is enabled based on TaxConfig
  const checkIsTaxEnabled = (config?: TaxConfig): boolean => {
    if (!config) return false;

    const hasIncomeTax = !!config.incomeTaxRate && config.incomeTaxRate > 0;
    const hasVAT =
      config.vatMode === VATMode.VAT && !!config.vatRate && config.vatRate > 0;
    const hasPercentageTax =
      config.vatMode === VATMode.NON_VAT &&
      !!config.percentageTaxRate &&
      config.percentageTaxRate > 0;

    return hasIncomeTax || hasVAT || hasPercentageTax;
  };

  const [isTaxEnabled, setIsTaxEnabled] = useState<boolean>(
    checkIsTaxEnabled(formData)
  );

  const [isDirty, setIsDirty] = useState<boolean>(false);

  const handleRevert = () => {
    console.log("Reverting Changes");
    setIsTaxEnabled(checkIsTaxEnabled(formData));
    setFormDataInstance({
      vatMode: formData?.vatMode || VATMode.VAT,
      incomeTaxRate: formData?.incomeTaxRate,
      percentageTaxRate: formData?.percentageTaxRate,
      vatRate: formData?.vatRate,
    });
    onCancel?.();
    setIsDirty(false);
  };

  const handleToggleTax = (input: boolean) => {
    try {
      if (!input) {
        setFormDataInstance((prev) => ({
          ...prev,
          vatRate: undefined,
          percentageTaxRate: undefined,
          incomeTaxRate: undefined,
        }));
      } else {
        setFormDataInstance((prev) => ({
          ...prev,
          incomeTaxRate: 0.08,
          percentageTaxRate: 0.03,
          vatRate: 0.12,
        }));
      }

      setIsTaxEnabled(input);
      setIsDirty(true);
      if (isDevEnvironment())
        console.log("Current Tax Toggle: ", formDataInstance);
    } catch (error) {
      toast.error(
        `There's a problem updating the Tax Config. Please try again or try refreshing. Error: ${error}`
      );
    }
  };

  const handleUpdateVATType = (input: string | number) => {
    try {
      setFormDataInstance((prev) => {
        return {
          ...prev,
          vatMode: input as VATMode,
          percentageTaxRate:
            input === VATMode.NON_VAT ? prev.percentageTaxRate || 0.03 : 0,
          vatRate: input === VATMode.VAT ? prev.vatRate || 0.12 : 0,
        };
      });
      setIsDirty(true);
    } catch (error) {
      console.error("Problem while updating Tax Config: ", error);
      toast.error("Error", {
        description: `Oops! There seems to be a problem while updating: ${error}`,
        id: "error-input-setup",
      });
    }
  };

  const handleUpdateVATRate = (input: number) => {
    try {
      console.log("VAT: ", input);
      setFormDataInstance((prev) => {
        return {
          ...prev,
          vatRate: (input || 0) / 100,
        };
      });
      setIsDirty(true);
    } catch (error) {
      console.error("Problem while updating Tax Config: ", error);
      toast.error("Error", {
        description: `Oops! There seems to be a problem while updating: ${error}`,
        id: "error-input-vat",
      });
    }
  };

  const handleUpdateIncomeTaxRate = (input: number) => {
    try {
      console.log("Income Tax: ", input);
      setFormDataInstance((prev) => {
        return {
          ...prev,
          incomeTaxRate: (input || 0) / 100,
        };
      });
      setIsDirty(true);
    } catch (error) {
      console.error("Problem while updating Tax Config: ", error);
      toast.error("Error", {
        description: `Oops! There seems to be a problem while updating: ${error}`,
        id: "error-input-income-tax",
      });
    }
  };

  const handleUpdatePercentageTaxRate = (input: number) => {
    try {
      console.log("Income Tax: ", input);
      setFormDataInstance((prev) => {
        return {
          ...prev,
          percentageTaxRate: (input || 0) / 100,
        };
      });
      setIsDirty(true);
    } catch (error) {
      console.error("Problem while updating Tax Config: ", error);
      toast.error("Error", {
        description: `Oops! There seems to be a problem while updating: ${error}`,
        id: "error-input-percentage-tax",
      });
    }
  };

  const handleSubmitSave = () => {
    console.log("Saving Changes");
    onSubmit?.(formDataInstance);
  };

  return (
    <BodyContainer>
      <FormBodyEvent>
        <SectionSubTitle>Tax Assumptions</SectionSubTitle>
        <MenuSubtitle>
          These rates are applied automatically to revenue and profit to
          estimate your net cash flow.
        </MenuSubtitle>
        <CustomToggleSwitch
          label="Enable Tax"
          currentToggle={isTaxEnabled}
          onToggle={handleToggleTax}
        />
        {isTaxEnabled && (
          <StackRow>
            <VATTypeRow>
              <OptionText>VAT Type</OptionText>

              <EditableOption
                options={VATMode}
                currentValue={formDataInstance.vatMode}
                tooltip="VAT Type"
                onUpdate={handleUpdateVATType}
              />
            </VATTypeRow>
            {formDataInstance.vatMode === VATMode.VAT ? (
              <ItemRow>
                <ValueIncrementor
                  label="VAT Rate"
                  currentValue={(formDataInstance?.vatRate || 0) * 100}
                  direction="column"
                  incrementValue={0.01}
                  onUpdate={handleUpdateVATRate}
                  displayValue={`${(
                    (formDataInstance?.vatRate || 0) * 100
                  ).toFixed(2)} %`}
                  helper="The Value Added Tax rate expressed as a percentage."
                  isHelperHover
                />
              </ItemRow>
            ) : (
              <ItemRow>
                <ValueIncrementor
                  label="Percentage Tax Rate"
                  currentValue={
                    (formDataInstance?.percentageTaxRate || 0) * 100
                  }
                  direction="column"
                  incrementValue={0.01}
                  onUpdate={handleUpdatePercentageTaxRate}
                  displayValue={`${(
                    (formDataInstance?.percentageTaxRate || 0) * 100
                  ).toFixed(2)} %`}
                  helper="The Percentage Tax rate expressed as a percentage."
                  isHelperHover
                />
              </ItemRow>
            )}

            <ItemRow>
              <ValueIncrementor
                label="Income Tax Rate"
                currentValue={(formDataInstance?.incomeTaxRate || 0) * 100}
                direction="column"
                incrementValue={0.01}
                onUpdate={handleUpdateIncomeTaxRate}
                displayValue={`${(
                  (formDataInstance?.incomeTaxRate || 0) * 100
                ).toFixed(2)} %`}
                helper="The Income Tax rate expressed as a percentage."
                isHelperHover
              />
            </ItemRow>
          </StackRow>
        )}
        <DuoButton
          textButtonA="Revert"
          textButtonB="Save Changes"
          isDisabledButtonB={!isDirty}
          onClickButtonA={handleRevert}
          onClickButtonB={handleSubmitSave}
        />
      </FormBodyEvent>
    </BodyContainer>
  );
};

export default RunwayTaxConfig;
