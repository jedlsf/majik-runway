import React, { useState } from "react";

import styled from "styled-components";

import { toast } from "sonner";

import { ButtonPrimaryCTA } from "../../globals/buttons";
import MajikRunwayModelSelector from "./MajikRunwayModelSelector";

import {
  dateToYYYYMM,
  MajikRunway,
  offsetMonthsToYYYYMM,
  RevenueStream,
  type PeriodYYYYMM,
  type TaxConfig,
  BusinessModelType,
  VATMode,
  ExpenseBreakdown,
  MajikMoney,
} from "@thezelijah/majik-runway";

import { SectionSubTitle, SectionTitle } from "../../globals/styled-components";
import { ValueIncrementor } from "../../components/functional/ValueIncrementor";
import { EditableOption } from "../../components/foundations/EditableComponents/EditableOption";

import CustomInputField from "../../components/foundations/CustomInputField";
import RevenueStreamManager from "./RevenueStreams/RevenueStreamManager";

import PeriodSetter from "./PeriodSetter";

import ExpenseManager from "./Expenses/ExpenseManager";

const RootContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  margin: 10px;
  padding: 10px;

  @media (max-width: 768px) {
    margin: 0px;
    padding: 0px;
  }
`;

const ControllerBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 25px;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  height: 100%;
  width: 100%;
  padding: 35px;
  margin: 0px 30px;
  max-width: 950px;

  border: 1px solid ${({ theme }) => theme.colors.primary};


    @media (max-width: 768px) {
    margin: 0px;
      padding: 0px;
      border: 1px solid transparent};
    }
`;

const MenuSubtitle = styled.p`
  width: 100%;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const BodyColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  width: 100%;
  gap: 12px;
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

interface SetupMajikRunwayProps {
  onUpdate?(data: MajikRunway): void;
}

interface MajijkRunwaySetupInfo {
  type: BusinessModelType;
  currency: string;
  amount: number;
  tax: TaxConfig;
  period: PeriodYYYYMM;
}

export const SetupMajikRunway: React.FC<SetupMajikRunwayProps> = ({
  onUpdate,
}) => {
  const [setupInfo, setSetupInfo] = useState<MajijkRunwaySetupInfo>({
    amount: 0,
    currency: "PHP",
    type: BusinessModelType.Hybrid,
    tax: {
      vatMode: VATMode.VAT,
      incomeTaxRate: 0.08,
      percentageTaxRate: 0.03,
      vatRate: 0.12,
    },
    period: {
      startMonth: dateToYYYYMM(new Date()),
      endMonth: offsetMonthsToYYYYMM(dateToYYYYMM(new Date()), 23),
    },
  });

  const [, setRefreshKey] = useState<number>(0);

  const [revenueStream, setRevenueStream] = useState<RevenueStream>(
    new RevenueStream("PHP")
  );

  const [expenseBreakdown, setExpenseBreakdown] = useState<ExpenseBreakdown>(
    new ExpenseBreakdown("PHP")
  );

  const handleCompleteSetup = () => {
    if (!setupInfo) return;

    try {
      const newInstance = MajikRunway.initialize({
        taxConfig: setupInfo.tax,
        money: MajikMoney.fromMajor(setupInfo.amount, setupInfo.currency),
        type: setupInfo.type,
        revenues: revenueStream,
        expenses: expenseBreakdown,
        period: setupInfo.period,
      });

      console.log("New Instance: ", newInstance);

      onUpdate?.(newInstance);
    } catch (error) {
      console.error("Problem while initializing Majik Runway: ", error);
      toast.error("Error", {
        description: `Oops! There seems to be a problem while initializing Majik Runway: ${error}`,
        id: "error-init-majik-runway",
      });
    }
  };

  const handleUpdateModelType = (input: BusinessModelType) => {
    try {
      console.log("Selected: ", input);
      setSetupInfo((prev) => {
        return {
          ...prev,
          type: input,
        };
      });
    } catch (error) {
      console.error("Problem while updating Setup: ", error);
      toast.error("Error", {
        description: `Oops! There seems to be a problem while updating: ${error}`,
        id: "error-input-setup",
      });
    }
  };

  const handleUpdatePeriod = (input: PeriodYYYYMM) => {
    try {
      console.log("Period: ", input);
      setSetupInfo((prev) => {
        return {
          ...prev,
          period: input,
        };
      });
      setRevenueStream((prev) => prev.setPeriod(input));
    } catch (error) {
      console.error("Problem while updating Setup: ", error);
      toast.error("Error", {
        description: `Oops! There seems to be a problem while updating: ${error}`,
        id: "error-input-setup",
      });
    }
  };

  const handleUpdateVATType = (input: string | number) => {
    try {
      console.log("Selected: ", input);
      setSetupInfo((prev) => {
        return {
          ...prev,
          tax: {
            ...prev.tax,
            vatMode: input as VATMode,
            percentageTaxRate:
              input === VATMode.NON_VAT
                ? prev.tax.percentageTaxRate || 0.03
                : 0,
            vatRate: input === VATMode.VAT ? prev.tax.vatRate || 0.12 : 0,
          },
        };
      });
    } catch (error) {
      console.error("Problem while updating Setup: ", error);
      toast.error("Error", {
        description: `Oops! There seems to be a problem while updating: ${error}`,
        id: "error-input-setup",
      });
    }
  };

  const handleUpdateVATRate = (input: number) => {
    try {
      console.log("VAT: ", input);
      setSetupInfo((prev) => {
        return {
          ...prev,
          tax: {
            ...prev.tax,
            vatRate: (input || 0) / 100,
          },
        };
      });
    } catch (error) {
      console.error("Problem while updating Setup: ", error);
      toast.error("Error", {
        description: `Oops! There seems to be a problem while updating: ${error}`,
        id: "error-input-setup",
      });
    }
  };

  const handleUpdateIncomeTaxRate = (input: number) => {
    try {
      console.log("Income Tax: ", input);
      setSetupInfo((prev) => {
        return {
          ...prev,
          tax: {
            ...prev.tax,
            incomeTaxRate: (input || 0) / 100,
          },
        };
      });
    } catch (error) {
      console.error("Problem while updating Setup: ", error);
      toast.error("Error", {
        description: `Oops! There seems to be a problem while updating: ${error}`,
        id: "error-input-setup",
      });
    }
  };

  const handleUpdatePercentageTaxRate = (input: number) => {
    try {
      console.log("Income Tax: ", input);
      setSetupInfo((prev) => {
        return {
          ...prev,
          tax: {
            ...prev.tax,
            percentageTaxRate: (input || 0) / 100,
          },
        };
      });
    } catch (error) {
      console.error("Problem while updating Setup: ", error);
      toast.error("Error", {
        description: `Oops! There seems to be a problem while updating: ${error}`,
        id: "error-input-setup",
      });
    }
  };

  const handleUpdateCurrency = (input: string) => {
    try {
      console.log("Currency: ", input);
      setSetupInfo((prev) => {
        return {
          ...prev,
          currency: input,
        };
      });
      setRevenueStream(new RevenueStream(input || "PHP"));
    } catch (error) {
      console.error("Problem while updating Setup: ", error);
      toast.error("Error", {
        description: `Oops! There seems to be a problem while updating: ${error}`,
        id: "error-input-setup",
      });
    }
  };

  const handleUpdateInitialCash = (input: string) => {
    try {
      console.log("Initial Cash: ", input);
      setSetupInfo((prev) => {
        return {
          ...prev,
          amount: parseFloat(input || "0"),
        };
      });
    } catch (error) {
      console.error("Problem while updating Setup: ", error);
      toast.error("Error", {
        description: `Oops! There seems to be a problem while updating: ${error}`,
        id: "error-input-setup",
      });
    }
  };

  const handleUpdateRevenueStream = (input: RevenueStream) => {
    try {
      console.log("Revenue Stream: ", input);
      setRevenueStream(input);
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      console.error("Problem while updating Revenue Stream: ", error);
      toast.error("Error", {
        description: `Oops! There seems to be a problem while updating: ${error}`,
        id: "error-input-setup",
      });
    }
  };

  const handleUpdateExpenseBreakdown = (input: ExpenseBreakdown) => {
    try {
      console.log("Expense Breakdown: ", input);
      setExpenseBreakdown(input);
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      console.error("Problem while updating Expense Breakdown: ", error);
      toast.error("Error", {
        description: `Oops! There seems to be a problem while updating: ${error}`,
        id: "error-input-setup",
      });
    }
  };

  return (
    <RootContainer>
      <ControllerBody>
        <SectionTitle>Setup Majik Runway</SectionTitle>
        <BodyColumn>
          <SectionSubTitle>Business Model</SectionSubTitle>
          <MenuSubtitle>
            Choose how your business earns revenue. This determines how income
            is modeled across products, services, and subscriptions.
          </MenuSubtitle>

          <MajikRunwayModelSelector
            onSelect={handleUpdateModelType}
            currentValue={setupInfo.type}
          />
        </BodyColumn>
        <BodyColumn>
          <SectionSubTitle>Starting Capital</SectionSubTitle>
          <MenuSubtitle>
            This is your available cash at the start of the simulation. Funding
            events and revenue will extend your runway over time.
          </MenuSubtitle>
          <StackRow>
            <CustomInputField
              onChange={handleUpdateCurrency}
              maxChar={3}
              regex="letters"
              label="Currency"
              currentValue={setupInfo.currency}
              required
              allcaps
            />
            <CustomInputField
              onChange={handleUpdateInitialCash}
              maxChar={25}
              regex="numbers"
              label="Initial Cash"
              currentValue={setupInfo.amount.toString()}
              required
            />
          </StackRow>
        </BodyColumn>
        <BodyColumn>
          <SectionSubTitle>Runway Timeline</SectionSubTitle>
          <MenuSubtitle>
            Define the start and end months for your financial forecast and
            runway simulation.
          </MenuSubtitle>
          <PeriodSetter
            onChange={handleUpdatePeriod}
            currentValue={setupInfo.period}
            required
          />
        </BodyColumn>
        <BodyColumn>
          <SectionSubTitle>Tax Assumptions</SectionSubTitle>
          <MenuSubtitle>
            These rates are applied automatically to revenue and profit to
            estimate your net cash flow.
          </MenuSubtitle>
          <StackRow>
            <ItemRow>
              <OptionText>VAT Type</OptionText>

              <EditableOption
                options={VATMode}
                currentValue={setupInfo.tax.vatMode}
                tooltip="VAT Type"
                onUpdate={handleUpdateVATType}
              />
            </ItemRow>
          </StackRow>
          <StackRow>
            {setupInfo.tax.vatMode === VATMode.VAT ? (
              <ItemRow>
                <ValueIncrementor
                  label="VAT Rate"
                  currentValue={(setupInfo.tax?.vatRate || 0) * 100}
                  direction="column"
                  incrementValue={0.01}
                  onUpdate={handleUpdateVATRate}
                  displayValue={`${(
                    (setupInfo.tax?.vatRate || 0) * 100
                  ).toFixed(2)} %`}
                  helper="The Value Added Tax rate expressed as a percentage."
                  isHelperHover
                />
              </ItemRow>
            ) : (
              <ItemRow>
                <ValueIncrementor
                  label="Percentage Tax Rate"
                  currentValue={(setupInfo.tax?.percentageTaxRate || 0) * 100}
                  direction="column"
                  incrementValue={0.01}
                  onUpdate={handleUpdatePercentageTaxRate}
                  displayValue={`${(
                    (setupInfo.tax?.percentageTaxRate || 0) * 100
                  ).toFixed(2)} %`}
                  helper="The Percentage Tax rate expressed as a percentage."
                  isHelperHover
                />
              </ItemRow>
            )}

            <ItemRow>
              <ValueIncrementor
                label="Income Tax Rate"
                currentValue={(setupInfo.tax?.incomeTaxRate || 0) * 100}
                direction="column"
                incrementValue={0.01}
                onUpdate={handleUpdateIncomeTaxRate}
                displayValue={`${(
                  (setupInfo.tax?.incomeTaxRate || 0) * 100
                ).toFixed(2)} %`}
                helper="The Income Tax rate expressed as a percentage."
                isHelperHover
              />
            </ItemRow>
          </StackRow>
        </BodyColumn>

        <BodyColumn>
          <SectionSubTitle>Revenue Streams</SectionSubTitle>
          <MenuSubtitle>
            Define how much you expect to sell and at what price. Majik Runway
            projects revenue over time using these assumptions. You can add more
            later.
          </MenuSubtitle>
          <RevenueStreamManager
            revenueStream={revenueStream}
            onUpdate={handleUpdateRevenueStream}
          />
        </BodyColumn>

        <BodyColumn>
          <SectionSubTitle>Operating Costs</SectionSubTitle>
          <MenuSubtitle>
            Add your fixed and variable expenses. These directly determine your
            monthly burn rate. You can add more later.
          </MenuSubtitle>
          <ExpenseManager
            expenseBreakdown={expenseBreakdown}
            onUpdate={handleUpdateExpenseBreakdown}
          />
        </BodyColumn>

        <BodyColumn>
          <SectionSubTitle>Ready to Simulate</SectionSubTitle>
          <MenuSubtitle>
            Once you’re done, click <strong>Proceed</strong> to view your runway
            results and visualizations. You can add or adjust revenue streams,
            expenses, and funding at any time.
          </MenuSubtitle>
          <ButtonPrimaryCTA onClick={handleCompleteSetup} disabled={!setupInfo}>
            Proceed
          </ButtonPrimaryCTA>
        </BodyColumn>
      </ControllerBody>
    </RootContainer>
  );
};

export default SetupMajikRunway;
