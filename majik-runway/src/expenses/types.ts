import { MajikMoney } from "@thezelijah/majik-money";
import { ExpenseType, Recurrence } from "../enums";
import { ExpenseID, PeriodYYYYMM, YYYYMM } from "../types/types";

export interface ExpenseState {
  id: ExpenseID;
  name: string;
  type: ExpenseType;

  amount: MajikMoney;

  recurrence?: Recurrence;
  schedule?: MonthlyAllocation[];

  isTaxDeductible: boolean;
  capitalMeta?: CapitalMeta;
}

export type ExpenseJSON = ExpenseState;

export interface ExpenseBreakdownJSON {
  currency: string;
  expenses: ExpenseJSON[];
  period: PeriodYYYYMM;
}

export interface MonthlyAllocation {
  month: YYYYMM;
  amount: MajikMoney;
}

export interface CapitalMeta {
  depreciationMonths?: number;
  residualValue?: MajikMoney;
}

export interface ExpenseSummaryCache {
  totalExpenses: MajikMoney;
  averageMonthlyExpense: MajikMoney;
  totalExpenseAcrossPeriod: MajikMoney;
  totalCashOutAcrossPeriod: MajikMoney;
  totalRecurring: MajikMoney;
  totalOneTime: MajikMoney;
  totalCapital: MajikMoney;
  totalTaxDeductible: MajikMoney;
}
