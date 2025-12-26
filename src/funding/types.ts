import { MajikMoney } from "@thezelijah/majik-money";
import { FundingType } from "../enums";
import { FundingID, YYYYMM } from "../types/types";

/**
 * Represents a funding event for a business or project.
 */
export interface FundingEventState {
  /** Unique identifier for the funding event */
  id: FundingID;

  /** Name of the funding event */
  name: string;

  /** Type of funding (Equity, Debt, Grant, etc.) */
  type: FundingType;

  /** Amount of funding */
  amount: MajikMoney;

  /** Month the funding was received, in YYYY-MM format */
  month: YYYYMM;

  /**
   * Optional metadata for special funding types like convertible notes or SAFEs
   * @param valuationCap Maximum valuation for convertible instruments
   * @param discountRate Discount applied to conversion
   * @param maturityMonth Month when convertible note or SAFE matures
   */
  meta?: {
    valuationCap?: number;
    discountRate?: number;
    maturityMonth?: YYYYMM;
  };

  /**
   * Optional debt-specific metadata
   */
  debt?: DebtMetadata;
}

/**
 * Metadata specific to debt funding events
 */
export interface DebtMetadata {
  /**
   * Interest rate for the debt
   * @example 0.08 // 8% annual or monthly
   */
  interestRate?: number;

  /** ISO string representing the date by which the debt must be fully repaid */
  maturityDate?: string;

  /** Optional custom installment payment plan */
  installmentPlan?: InstallmentEntry[];

  /** Optional upfront payment at the start of the loan */
  initialPayment?: MajikMoney;

  /** Interest compounding frequency */
  compounding?: CompoundingFrequency;

  /** Optional grace period in months before repayment starts */
  gracePeriodMonths?: number;
}

export enum CompoundingFrequency {
  None = "None",
  Monthly = "Monthly",
  Quarterly = "Quarterly",
  Annually = "Annually",
}

/**
 * Represents a single installment entry in a debt repayment schedule
 */
export interface InstallmentEntry {
  /** ISO date of the installment payment */
  date: string;

  /** Amount due on the given installment date */
  amount: MajikMoney;
}

/**
 * Cached funding summary for a period
 */
export interface FundingSummaryCache {
  /** Total funding across the period */
  totalFundingAcrossPeriod: MajikMoney;

  /** Average monthly funding across the period */
  averageMonthlyFunding: MajikMoney;

  /** Total equity funding across the period */
  totalEquityAcrossPeriod: MajikMoney;

  /** Total debt funding across the period */
  totalDebtAcrossPeriod: MajikMoney;

  /** Total grant funding across the period */
  totalGrantAcrossPeriod: MajikMoney;

  /** Debt-to-total funding ratio (0-1) */
  debtRatio: number;

  /** Non-repayable funding ratio (equity + grants / total funding) */
  nonRepayableRatio: number;

  /** Total number of funding events in the period */
  fundingEventCount: number;
}



/**
 * Represents a single month entry in a debt amortization schedule.
 */
export interface AmortizationEntry {
  /** Month in YYYYMM format */
  month: YYYYMM;

  /** Original principal amount of the debt */
  principal: MajikMoney;

  /** Interest accrued in this month */
  interest: MajikMoney;

  /** Total debt (principal + interest) at this month */
  total: MajikMoney;
}
