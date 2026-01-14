"use client";

import React, { useMemo, useState } from "react";
import styled from "styled-components";
import {
  ChartLineIcon,
  CurrencyDollarSimpleIcon,
  GaugeIcon,
  CoinsIcon,
  GearIcon,
  BankIcon,
  InfoIcon,
  TrendUpIcon,
  FireIcon,
  ScalesIcon,
  CalendarXIcon,
  CalendarIcon,
} from "@phosphor-icons/react";
import DynamicPagedTab, {
  type TabContent,
} from "../../components/functional/DynamicPagedTab";
import {
  MajikRunway,
  ExpenseBreakdown,
  RevenueStream,
  FundingManager,
  type TaxConfig,
  yyyyMMToDate,
  type PeriodYYYYMM,
} from "@thezelijah/majik-runway";

import ChartRevenueTrend from "./Charts/ChartRevenueTrend";
import ChartExpensePie from "./Charts/ChartExpensePie";
import ChartCashflowBar from "./Charts/ChartCashflowBar";
import RevenueStreamManager from "./RevenueStreams/RevenueStreamManager";
import ExpenseManager from "./Expenses/ExpenseManager";

import { toast } from "sonner";
import RunwayTaxConfig from "./RunwayTaxConfig";

import { formatPercentage } from "../../utils/helper";
import moment from "moment";

import MajikRunwayHealthIndicator from "./MajikRunwayHealthIndicator";
import { DynamicColoredValue } from "../../components/foundations/DynamicColoredValue";
import theme from "../../globals/theme";
import FundingEventsManager from "./Funding/FundingEventsManager";

import ChartFundingTimeSeries from "./Charts/ChartFundingTimeSeries";
import ChartExpenseTrend from "./Charts/ChartExpenseTrend";
import { TargetIcon } from "lucide-react";
import ChartGrossMarginTrend from "./Charts/ChartGrossMarginTrend";
import { EditableText } from "../foundations/EditableComponents/EditableText";
import PeriodConfig from "./PeriodConfig";
import ThemeToggle from "../functional/ThemeToggle";

// ======== Styled Components ========
const RootContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 20px;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 0px;
  }
`;

const HeaderCards = styled.div`
  display: grid;
  gap: 20px;
  margin-bottom: 30px;
  grid-template-columns: repeat(5, 1fr);

  /* Between 1100px and 1399px - Custom layout */
  @media (max-width: 1399px) and (min-width: 1100px) {
    grid-template-columns: repeat(4, 1fr);

    /* Row 1: Runway Remaining (1) + Net Monthly Burn (4) */
    & > :nth-child(1) {
      order: 1;
      grid-column: span 2;
    }
    & > :nth-child(4) {
      order: 2;
      grid-column: span 2;
    }

    /* Row 2: Opening Balance, Total Funding, Projected Revenue, Revenue Growth */
    & > :nth-child(2) {
      order: 3;
    } /* Opening Balance */
    & > :nth-child(3) {
      order: 4;
    } /* Total Funding */
    & > :nth-child(5) {
      order: 5;
    } /* Projected Revenue */
    & > :nth-child(7) {
      order: 6;
    } /* Revenue Growth */

    /* Row 3: Break-Even, Burn Efficiency, Debt Ratio, Cash-Out Date */
    & > :nth-child(6) {
      order: 7;
    } /* Break-Even */
    & > :nth-child(8) {
      order: 8;
    } /* Burn Efficiency */
    & > :nth-child(9) {
      order: 9;
    } /* Debt Ratio */
    & > :nth-child(10) {
      order: 10;
    } /* Cash-Out Date */
  }

  @media (max-width: 1099px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const TopHeaderRow = styled.div`
  display: flex;
  gap: 20px;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 30px;
  width: 100%;
  padding: 0px 15px;
`;

const Card = styled.div`
  flex: 1 1 200px;
  background: ${({ theme }) => theme.colors.secondaryBackground};
  color: ${({ theme }) => theme.colors.textPrimary};
  padding: 20px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 150px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.05);

  border: 1px solid transparent;
  transition: all 0.3s ease;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      border-color: ${({ theme }) => theme.colors.primary};
    }
  }

  @media (max-width: 1199px) {
    padding: 10px;
  }
`;

const CardTitle = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textSecondary};
  display: flex;
  align-items: center;
  gap: 8px;

  @media (max-width: 1199px) {
    font-size: 10px;
  }
`;

const CardValue = styled.div`
  font-size: 26px;
  font-weight: 700;
  padding: 0.25rem 0.5rem;

  @media (max-width: 1199px) {
    font-size: 20px;
  }
`;

const CardSubtext = styled.div`
  font-size: 12px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.textSecondary};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const MainGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 25px;
  margin-bottom: 30px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const ChartPlaceholder = styled.div`
  width: 100%;
  height: 350px;
  background: ${({ theme }) => theme.colors.primaryBackground};
  border: 1px solid ${({ theme }) => theme.colors.secondaryBackground};
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 16px;
  padding: 15px;
  transition: all 0.3s ease;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      border-color: ${({ theme }) => theme.colors.primary};
    }
  }
`;

interface DashboardMajikRunwayProps {
  runway: MajikRunway;
  onUpdate?: (newRunway: MajikRunway) => void;
}

// ======== Main Component ========

const DashboardMajikRunway: React.FC<DashboardMajikRunwayProps> = ({
  runway,
  onUpdate,
}) => {
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [activeTabId, setActiveTabId] = useState<string | undefined>(undefined);

  const dashboardSnapshot = useMemo(
    () => runway.getDashboardSnapshot(),

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [runway, refreshKey]
  );

  const revenueStream = useMemo(
    () => runway.revenueStream(),

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [runway, refreshKey]
  );

  const expense = useMemo(
    () => runway.expenseBreakdown(),

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [runway, refreshKey]
  );

  const fundingManager = useMemo(
    () => runway.funding(),

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [runway, refreshKey]
  );

  const cashflow = useMemo(
    () =>
      runway.getCashflowPlotlyBar(undefined, undefined, [
        theme.colors.brand.blue,
        theme.colors.error,
        theme.colors.primary,
      ]),

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [runway, refreshKey]
  );

  const taxConfig = useMemo(
    () => runway.taxConfig(),

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [runway, refreshKey]
  );

  const handleUpdateRevenueStream = (input: RevenueStream) => {
    try {
      console.log("Revenue Stream: ", input);
      const updatedRunway = runway.updateModel({
        revenues: input,
      });

      setRefreshKey((prev) => prev + 1);
      onUpdate?.(updatedRunway);
    } catch (error) {
      console.error("Problem while updating Revenue Stream: ", error);
      toast.error("Error", {
        description: `Oops! There seems to be a problem while updating: ${error}`,
        id: "error-input-majik-runway-dashboard-revenue",
      });
    }
  };

  const handleUpdateExpenseBreakdown = (input: ExpenseBreakdown) => {
    try {
      console.log("Expense Breakdown: ", input);
      const updatedRunway = runway.updateModel({
        expenses: input,
      });
      setRefreshKey((prev) => prev + 1);
      onUpdate?.(updatedRunway);
    } catch (error) {
      console.error("Problem while updating Expense Breakdown: ", error);
      toast.error("Error", {
        description: `Oops! There seems to be a problem while updating: ${error}`,
        id: "error-input-majik-runway-dashboard-expense",
      });
    }
  };

  const handleUpdateFundingManager = (input: FundingManager) => {
    try {
      console.log("Funding Manager: ", input);
      const updatedRunway = runway.updateModel({
        funding: input,
      });
      setRefreshKey((prev) => prev + 1);
      onUpdate?.(updatedRunway);
    } catch (error) {
      console.error("Problem while updating Funding Manager: ", error);
      toast.error("Error", {
        description: `Oops! There seems to be a problem while updating: ${error}`,
        id: "error-input-majik-runway-dashboard-funding",
      });
    }
  };

  const handleUpdateTaxConfig = (input: TaxConfig) => {
    try {
      console.log("Tax Config: ", input);
      const updatedRunway = runway.updateModel({
        taxConfig: input,
      });
      setRefreshKey((prev) => prev + 1);
      onUpdate?.(updatedRunway);
      handleTabNavigation();
      toast.success("Changes Saved", {
        description: `New tax settings have been saved.`,
        id: "success-input-majik-runway-dashboard-tax",
      });
    } catch (error) {
      console.error("Problem while updating Tax Config: ", error);
      toast.error("Error", {
        description: `Oops! There seems to be a problem while updating: ${error}`,
        id: "error-input-majik-runway-dashboard-tax",
      });
    }
  };

  const handleUpdatePeriod = (input: PeriodYYYYMM) => {
    try {
      console.log("Period: ", input);
      const updatedRunway = runway.updatePeriod(input);
      setRefreshKey((prev) => prev + 1);
      onUpdate?.(updatedRunway);
      handleTabNavigation();
      toast.success("Changes Saved", {
        description: `New Period have been saved.`,
        id: "success-input-majik-runway-dashboard-period",
      });
    } catch (error) {
      console.error("Problem while updating Period: ", error);
      toast.error("Error", {
        description: `Oops! There seems to be a problem while updating: ${error}`,
        id: "error-input-majik-runway-dashboard-period",
      });
    }
  };

  const handleUpdateOpeningBalance = (input: string) => {
    try {
      console.log("Opening Balance: ", input);
      const parsedAmount = parseFloat(input);
      const updatedRunway = runway.updateInitialCash(parsedAmount);
      setRefreshKey((prev) => prev + 1);
      onUpdate?.(updatedRunway);
    } catch (error) {
      console.error("Problem while updating Opening Balance: ", error);
      toast.error("Error", {
        description: `Oops! There seems to be a problem while updating: ${error}`,
        id: "error-input-majik-runway-dashboard-opening-balance",
      });
    }
  };

  const handleTabNavigation = (input?: string) => {
    console.log("Tab: ", input);
    setActiveTabId(input);
  };

  const InformationTabs: TabContent[] = [
    {
      id: "info-overview",
      name: "Overview",
      icon: InfoIcon,
      content: (
        <>
          <TopHeaderRow>
            <ThemeToggle />
            <MajikRunwayHealthIndicator
              health={dashboardSnapshot.runwayHealth}
            />
          </TopHeaderRow>

          {/* ===== Header / KPI Cards ===== */}
          <HeaderCards>
            <Card>
              <CardTitle>
                <CoinsIcon size={20} /> Runway Remaining
              </CardTitle>
              <CardValue>
                <DynamicColoredValue
                  value={dashboardSnapshot.runwayMonths} // numeric months remaining
                  colorsMap={[
                    { color: theme.colors.error, max: 2.99 }, // red if less than 3 months
                    { color: theme.colors.textPrimary, min: 3, max: 6 }, // yellow if 3–6 months
                    { color: theme.colors.primary, min: 6.01 }, // green if above 6 months
                  ]}
                  size={26}
                  weight={700}
                >
                  {dashboardSnapshot.runwayMonths} months
                </DynamicColoredValue>
              </CardValue>
            </Card>
            <Card>
              <CardTitle>
                <CurrencyDollarSimpleIcon size={20} /> Opening Balance
              </CardTitle>
              <EditableText
                currentValue={dashboardSnapshot.cashOnHand.toMajor().toString()}
                onUpdate={handleUpdateOpeningBalance}
                displayStyle={{
                  size: "26px",
                  weight: 700,
                }}
                tooltip="Update Opening Balance"
              >
                {dashboardSnapshot.cashOnHand.format()}
              </EditableText>
            </Card>
            <Card>
              <CardTitle>
                <BankIcon size={20} /> Total Funding
              </CardTitle>
              <CardValue>
                {dashboardSnapshot.funding.totalFunding.format()}
              </CardValue>
            </Card>
            <Card>
              <CardTitle>
                <GaugeIcon size={20} /> Net Monthly Burn
              </CardTitle>
              <CardValue>
                <DynamicColoredValue
                  value={dashboardSnapshot.avgNetBurn.toMajor()}
                  colorsMap={[
                    { color: theme.colors.primary, max: -1 }, // green if negative
                    { color: theme.colors.textPrimary, min: 0, max: 0 }, // yellow if zero
                    { color: theme.colors.error, min: 1 }, // red if positive
                  ]}
                  size={26}
                  weight={700}
                >
                  {dashboardSnapshot.avgNetBurn.format()}
                </DynamicColoredValue>
              </CardValue>
            </Card>
            <Card>
              <CardTitle>
                <ChartLineIcon size={20} /> Projected Revenue
              </CardTitle>
              <CardValue>
                {dashboardSnapshot.nextMonthRevenue.format()}
                <CardSubtext>Next Month</CardSubtext>
              </CardValue>
            </Card>

            {/* ===== SubHeader / Secondary KPI Cards ===== */}

            <Card>
              <CardTitle>
                <TargetIcon size={20} />
                Break-Even Month
              </CardTitle>
              <CardValue>
                {dashboardSnapshot.breakEvenMonth ?? "N/A"}
                <CardSubtext>
                  {dashboardSnapshot.breakEvenMonth
                    ? moment(
                        yyyyMMToDate(dashboardSnapshot.breakEvenMonth)
                      ).fromNow()
                    : null}
                </CardSubtext>
              </CardValue>
            </Card>
            <Card>
              <CardTitle>
                <TrendUpIcon size={20} />
                Revenue Growth Rate
              </CardTitle>
              <CardValue>
                {formatPercentage(
                  dashboardSnapshot.revenueGrowthRateCMGR ?? 0,
                  true
                )}
                <CardSubtext>MoM</CardSubtext>
              </CardValue>
            </Card>
            <Card>
              <CardTitle>
                <FireIcon size={20} />
                Burn Efficiency
              </CardTitle>
              <CardValue>
                <DynamicColoredValue
                  value={dashboardSnapshot.burnEfficiency ?? 0}
                  colorsMap={[
                    { color: theme.colors.error, max: 1 },
                    { color: theme.colors.textPrimary, min: 1.1, max: 6 },
                    { color: theme.colors.primary, min: 6.1 },
                  ]}
                  size={26}
                  weight={700}
                >
                  {formatPercentage(
                    dashboardSnapshot.burnEfficiency ?? 0,
                    true
                  )}
                </DynamicColoredValue>
              </CardValue>
            </Card>
            <Card>
              <CardTitle>
                <ScalesIcon size={20} />
                Debt Ratio
              </CardTitle>
              <CardValue>
                <DynamicColoredValue
                  value={dashboardSnapshot.funding.debtRatio ?? 0}
                  colorsMap={[
                    { color: theme.colors.primary, max: 0.3 }, // Healthy (low debt)
                    { color: theme.colors.textPrimary, min: 0.31, max: 0.6 }, // Moderate
                    { color: theme.colors.error, min: 0.61 }, // Risky (high debt)
                  ]}
                  size={26}
                  weight={700}
                >
                  {formatPercentage(
                    dashboardSnapshot.funding.debtRatio ?? 0,
                    true
                  )}
                </DynamicColoredValue>
              </CardValue>
            </Card>
            <Card>
              <CardTitle>
                <CalendarXIcon size={20} />
                Cash-Out Date
              </CardTitle>
              <CardValue>{dashboardSnapshot.cashOutDate ?? "N/A"}</CardValue>
            </Card>
          </HeaderCards>

          {/* ===== Main Grid / Charts ===== */}
          <MainGrid>
            <ChartPlaceholder>
              <ChartRevenueTrend
                data={revenueStream.toMonthlyRevenueTraces()}
              />
            </ChartPlaceholder>
            <ChartPlaceholder>
              <ChartCashflowBar data={cashflow} />
            </ChartPlaceholder>
            <ChartPlaceholder>
              <ChartExpenseTrend
                data={expense.getExpenseTrendByCategory(undefined, undefined, [
                  theme.colors.brand.blue,
                  theme.colors.textPrimary,
                  theme.colors.primary,
                ])}
              />
            </ChartPlaceholder>
            <ChartPlaceholder>
              <ChartExpensePie data={expense.expenseBreakdownPlot()} />
            </ChartPlaceholder>

            <ChartPlaceholder>
              <ChartFundingTimeSeries
                data={fundingManager.generateFundingTimeSeries(undefined, [
                  theme.colors.brand.blue,
                  theme.colors.error,
                  theme.colors.primary,
                ])}
              />
            </ChartPlaceholder>

            <ChartPlaceholder>
              <ChartGrossMarginTrend
                data={revenueStream.toGrossMarginTrendTraces()}
              />
            </ChartPlaceholder>
          </MainGrid>
        </>
      ),
    },
    {
      id: "info-revenue",
      name: "Revenue Streams",
      icon: CurrencyDollarSimpleIcon,
      content: (
        <>
          <RevenueStreamManager
            revenueStream={revenueStream}
            onUpdate={handleUpdateRevenueStream}
          />
        </>
      ),
    },
    {
      id: "info-expenses",
      name: "Expenses",
      icon: GaugeIcon,
      content: (
        <>
          <ExpenseManager
            expenseBreakdown={expense}
            onUpdate={handleUpdateExpenseBreakdown}
          />
        </>
      ),
    },
    {
      id: "info-funding",
      name: "Funding Events",
      icon: BankIcon,
      content: (
        <>
          {" "}
          <FundingEventsManager
            fundingManager={fundingManager}
            onUpdate={handleUpdateFundingManager}
          />
        </>
      ),
    },
    {
      id: "info-period",
      name: "Period",
      icon: CalendarIcon,
      content: (
        <>
          <PeriodConfig period={runway.period} onSubmit={handleUpdatePeriod} />
        </>
      ),
    },
    {
      id: "info-tax",
      name: "Tax Configuration",
      icon: GearIcon,
      content: (
        <>
          <RunwayTaxConfig
            formData={taxConfig}
            onSubmit={handleUpdateTaxConfig}
          />
        </>
      ),
    },
  ];

  return (
    <RootContainer>
      {/* ===== Tabs ===== */}

      <DynamicPagedTab
        tabs={InformationTabs}
        position="left"
        currentTabID={activeTabId}
        onUpdate={handleTabNavigation}
      />
    </RootContainer>
  );
};

export default DashboardMajikRunway;
