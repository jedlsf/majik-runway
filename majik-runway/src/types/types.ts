import { RevenueItemJSON, RevenueStream } from "../revenue";
import { TaxConfig } from "./tax";

import { MajikMoney, MajikMoneyJSON } from "@thezelijah/majik-money";
import { ExpenseBreakdown } from "../expenses/expense-breakdown";
import { FundingManager } from "../funding/funding-manager";
import { BusinessModelType } from "../enums";
import { CashflowTaxes } from "../cashflow";
import { ExpenseBreakdownJSON } from "../expenses/types";
import { FundingManagerJSON } from "../funding/types";

export type ISODateString = string;
export type YYYYMM = `${number}${number}${number}${number}-${number}${number}`;
export type StartDateInput = Date | ISODateString | YYYYMM;

export type RevenueID = string;
export type ExpenseID = string;
export type FundingID = string;

export type ObjectType = "class" | "json";

export interface PeriodYYYYMM {
  startMonth: YYYYMM;
  endMonth: YYYYMM;
}

export interface BusinessModel {
  money: MajikMoney;
  expenses: ExpenseBreakdown;
  revenues: RevenueStream;
  taxConfig: TaxConfig;
  funding: FundingManager;
  type?: BusinessModelType;
  period: PeriodYYYYMM;
  id?: string;
}

export interface BalanceSnapshot {
  month: YYYYMM;

  cash: MajikMoney;

  assetsNet: MajikMoney;
  liabilities: MajikMoney;
  equity: MajikMoney;

  debtOutstanding: MajikMoney;
  retainedEarnings: MajikMoney;
}

export interface MonthlyCapacity {
  month: YYYYMM;
  capacity: number;
  adjustment?: number;
}

export interface RunwayHealth {
  status: HealthSeverity;
  reasons: string[];
}

export type HealthSeverity = "healthy" | "warning" | "critical";

export interface DashboardSnapshot {
  runwayMonths: number;
  cashOnHand: MajikMoney;
  avgNetBurn: MajikMoney;
  nextMonthRevenue: MajikMoney;

  breakEvenMonth: YYYYMM | null;
  revenueGrowthRateMoM: number | null; // ratio (e.g. 0.12 = 12%)
  revenueGrowthRateCMGR: number | null; // ratio (e.g. 0.12 = 12%)
  burnEfficiency: number | null; // revenue / burn
  cashOutDate: YYYYMM | null;
  runwayHealth: RunwayHealth;

  funding: FundingManagerSnapshot;

  tax: CashflowTaxes;

  ebitda: MajikMoney;
  earningsAfterTax: MajikMoney;
}

export interface ExpenseBreakdownSnapshot {
  recurring: MajikMoney;
  oneTime: MajikMoney;
  capital: MajikMoney;
}

/**
 * Funding Dashboard Snapshot
 */
export interface FundingManagerSnapshot {
  /** Total funding across the period */
  totalFunding: MajikMoney;

  /** Total equity funding across the period */
  totalEquity: MajikMoney;

  /** Total debt funding across the period */
  totalDebt: MajikMoney;

  /** Total grant funding across the period */
  totalGrant: MajikMoney;

  /** Debt-to-total funding ratio (0-1) */
  debtRatio: number;

  /** Non-repayable funding ratio (equity + grants / total funding) */
  nonRepayableRatio: number;

  totalNonRepayable: MajikMoney;

  outstandingDebt: MajikMoney;

  /** Total number of funding events in the period */
  fundingEventCount: number;
}

export interface RevenueStreamJSON {
  currency: string;
  items: RevenueItemJSON[];
  period: PeriodYYYYMM;
}

export interface MajikRunwayJSON {
  money: MajikMoneyJSON;
  expenses: ExpenseBreakdownJSON;
  revenues: RevenueStreamJSON;
  taxConfig: TaxConfig;
  funding: FundingManagerJSON;
  type?: BusinessModelType;
  period: PeriodYYYYMM;
  id: string;
}
