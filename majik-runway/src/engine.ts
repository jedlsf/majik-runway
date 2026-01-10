import { Cashflow, CashflowTaxes } from "./cashflow";
import { ScenarioOverride } from "./types/scenario";
import { MajikMoney } from "@thezelijah/majik-money";
import { BalanceSnapshot, BusinessModel, YYYYMM } from "./types/types";
import { FundingEvent } from "./funding/funding";
import { VATMode } from "./enums";

/**
 * ProjectionEngine generates financial projections such as monthly cashflows
 * and runway calculations for a given BusinessModel.
 */
export class ProjectionEngine {
  /**
   * Generate monthly cashflows for a BusinessModel over a specified number of months.
   *
   * @param model - The business model containing revenue streams, expenses, and funding
   * @param months - Number of months to project
   * @param startMonth - Optional starting month (YYYY-MM)
   * @param includeTaxes - Whether to include tax calculations in the cashflow (default: false)
   * @returns Array of Cashflow objects
   */
  static generateMonthlyCashflow(
    model: BusinessModel,
    months: number,
    startMonth?: YYYYMM,
    includeTaxes = false // new optional flag
  ): Cashflow[] {
    const cashflows: Cashflow[] = [];
    let prevEndingCash = model.money;

    for (let m = 0; m < months; m++) {
      const monthLabel: YYYYMM = startMonth
        ? this.offsetMonth(startMonth, m)
        : this.getMonthLabel(m);

      const totalRevenue = this.calculateRevenue(model, monthLabel);
      const totalExpense = this.calculateExpense(model, monthLabel);
      const totalFunding = this.calculateFunding(model, monthLabel);

      let taxes: CashflowTaxes = {
        vat: MajikMoney.zero(model.money.currency.code),
        percentageTax: MajikMoney.zero(model.money.currency.code),
        incomeTax: MajikMoney.zero(model.money.currency.code),
      };

      if (includeTaxes) {
        taxes = this.calculateTaxes(model, monthLabel);
      }

      const cashflow = new Cashflow(
        monthLabel,
        totalRevenue.add(totalFunding),
        totalExpense,
        prevEndingCash,
        taxes
      );
      cashflows.push(cashflow);

      prevEndingCash = cashflow.endingCash;
    }

    return cashflows;
  }

  /**
   * Apply planned funding events to an existing array of cashflows.
   * Adds each funding amount to the corresponding month's cashIn and updates endingCash.
   * @param cashflows Array of Cashflow objects
   * @param events Array of FundingEvent objects
   * @returns Updated Cashflow array
   */
  static projectFunding(
    cashflows: Cashflow[],
    events: FundingEvent[]
  ): Cashflow[] {
    // Create a mapping by month
    const fundingByMonth: Record<YYYYMM, MajikMoney> = {};
    let defCurrency: string = "PHP";
    events.forEach((ev) => {
      defCurrency = ev.amount.currency.code;
      if (!fundingByMonth[ev.month])
        fundingByMonth[ev.month] = MajikMoney.zero(defCurrency);
      fundingByMonth[ev.month] = fundingByMonth[ev.month].add(ev.amount);
    });

    // Update cashflows
    let prevEndingCash =
      cashflows[0]?.endingCash.subtract(cashflows[0].net) ??
      MajikMoney.zero(defCurrency);
    return cashflows.map((cf) => {
      const funding = fundingByMonth[cf.month] ?? MajikMoney.zero(defCurrency);
      const updatedCashIn = cf.cashIn.add(funding);
      const updatedNet = updatedCashIn.subtract(cf.cashOut);
      const updatedEndingCash = prevEndingCash.add(updatedNet);
      prevEndingCash = updatedEndingCash;
      return new Cashflow(
        cf.month,
        updatedCashIn,
        cf.cashOut,
        prevEndingCash.subtract(updatedNet)
      );
    });
  }

  /** Calculate total revenue for a given month. */
  private static calculateRevenue(
    model: BusinessModel,
    month: YYYYMM
  ): MajikMoney {
    return model.revenues.getMonthlyRevenue(month);
  }

  /** Calculate total expenses for a given month. */
  private static calculateExpense(
    model: BusinessModel,
    month: YYYYMM
  ): MajikMoney {
    return model.expenses.totalExpensesForMonth(month);
  }

  /** Calculate total funding for a given month. */
  private static calculateFunding(
    model: BusinessModel,
    month: YYYYMM
  ): MajikMoney {
    return model.funding.totalFundingForMonth(month);
  }

  /** Calculate runway (months until cash runs out). */
  static calculateRunway(cashflows: Cashflow[]): number {
    const idx = cashflows.findIndex(
      (c) => c.endingCash.isZero() || c.endingCash.isNegative()
    );
    return idx === -1 ? cashflows.length : idx;
  }

  static calculateTaxes(model: BusinessModel, month: YYYYMM): CashflowTaxes {
    const revenue = this.calculateRevenue(model, month);
    const expense = this.calculateExpense(model, month);

    const vatRate = model.taxConfig.vatRate ?? 0;
    const percentageTaxRate = model.taxConfig.percentageTaxRate ?? 0;
    const incomeTaxRate = model.taxConfig.incomeTaxRate ?? 0;

    let vat = MajikMoney.zero(revenue.currency.code);
    let percentageTax = MajikMoney.zero(revenue.currency.code);

    if (model.taxConfig.vatMode === VATMode.VAT) {
      vat = revenue.applyPercentage(vatRate); // 12% VAT
    } else {
      percentageTax = revenue.applyPercentage(percentageTaxRate); // 3% PT
    }

    // Profit before income tax
    const profitBeforeIncomeTax = revenue
      .subtract(expense)
      .subtract(vat)
      .subtract(percentageTax);

    // Income tax
    const incomeTax = profitBeforeIncomeTax.applyPercentage(incomeTaxRate);

    return { vat, percentageTax, incomeTax };
  }

  /**
   * Apply scenario overrides to a business model and simulate new monthly cashflows.
   *
   * @param model - Original business model
   * @param overrides - Array of scenario overrides
   * @param months - Number of months to simulate (default 24)
   * @returns Simulated monthly cashflows
   */
  static simulateScenario(
    model: BusinessModel,
    overrides: ScenarioOverride[],
    months = 24
  ): Cashflow[] {
    const tempModel = structuredClone(model);

    overrides.forEach((ov) => {
      const keys = ov.field.split(".");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let target: any = tempModel;
      for (let i = 0; i < keys.length - 1; i++) target = target[keys[i]];
      target[keys[keys.length - 1]] = ov.value;
    });

    return this.generateMonthlyCashflow(tempModel, months);
  }

  static getTotalTaxesAcrossPeriod(cashflows: Cashflow[]): CashflowTaxes {
    if (cashflows.length === 0) {
      throw new Error("No cashflows provided");
    }

    const currency =
      cashflows[0].taxes?.vat.currency.code ||
      cashflows[0].endingCash.currency.code ||
      "PHP";

    return cashflows.reduce(
      (acc, cf) => {
        acc.vat = acc.vat.add(cf.taxes?.vat || MajikMoney.zero(currency));
        acc.percentageTax = acc.percentageTax.add(
          cf.taxes?.percentageTax || MajikMoney.zero(currency)
        );
        acc.incomeTax = acc.incomeTax.add(
          cf.taxes?.incomeTax || MajikMoney.zero(currency)
        );
        return acc;
      },
      {
        vat: MajikMoney.zero(currency),
        percentageTax: MajikMoney.zero(currency),
        incomeTax: MajikMoney.zero(currency),
      }
    );
  }

  static getTaxesForMonth(cashflows: Cashflow[], month: YYYYMM): CashflowTaxes {
    const cashflow = cashflows.find((cf) => cf.month === month);
    if (!cashflow) {
      throw new Error(`No cashflow found for month ${month}`);
    }

    const currency =
      cashflow.taxes?.vat.currency.code ||
      cashflow.endingCash.currency.code ||
      "PHP";

    const cfTaxes = cashflow.taxes || {
      vat: MajikMoney.zero(currency),
      percentageTax: MajikMoney.zero(currency),
      incomeTax: MajikMoney.zero(currency),
    };

    return cfTaxes;
  }

  static getEBITDAAcrossPeriod(
    model: BusinessModel,
    cashflows: Cashflow[]
  ): MajikMoney {
    if (cashflows.length === 0) {
      throw new Error("No cashflows provided");
    }

    const currency = cashflows[0].cashIn.currency.code;

    return cashflows.reduce((sum, cf) => {
      const revenue = this.calculateRevenue(model, cf.month);
      const expenses = this.calculateExpense(model, cf.month);
      return sum.add(revenue.subtract(expenses));
    }, MajikMoney.zero(currency));
  }

  static getNetIncomeAcrossPeriod(
    model: BusinessModel,
    cashflows: Cashflow[]
  ): MajikMoney {
    if (cashflows.length === 0) {
      throw new Error("No cashflows provided");
    }

    const currency = cashflows[0].cashIn.currency.code;

    return cashflows.reduce((sum, cf) => {
      const revenue = this.calculateRevenue(model, cf.month);
      const expenses = this.calculateExpense(model, cf.month);

      const taxes = cf.taxes;

      const netIncome = revenue
        .subtract(expenses)
        .subtract(taxes?.vat || MajikMoney.zero(currency))
        .subtract(taxes?.percentageTax || MajikMoney.zero(currency))
        .subtract(taxes?.incomeTax || MajikMoney.zero(currency));

      return sum.add(netIncome);
    }, MajikMoney.zero(currency));
  }

  static generateBalanceSnapshot(
    model: BusinessModel,
    month: YYYYMM,
    cashflows: Cashflow[]
  ): BalanceSnapshot {
    const cashflow = cashflows.find((cf) => cf.month === month);
    if (!cashflow) throw new Error(`No cashflow for month ${month}`);

    const cash = cashflow.endingCash;

    const assetsNet = model.expenses.getNetAssetsUpTo(month);
    const liabilities = model.funding.getOutstandingDebtUpTo(month);

    const retainedEarnings = cashflows
      .filter((cf) => cf.month <= month)
      .reduce(
        (sum, cf) => sum.add(cf.net),
        MajikMoney.zero(cash.currency.code)
      );

    const equity = assetsNet.add(cash).subtract(liabilities);

    return {
      month,
      cash,
      assetsNet,
      liabilities,
      equity,
      debtOutstanding: liabilities,
      retainedEarnings,
    };
  }

  /** Helper: generate YYYY-MM string offset by given months. */
  private static getMonthLabel(offset: number): YYYYMM {
    const now = new Date();
    now.setMonth(now.getMonth() + offset);
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}` as YYYYMM;
  }

  private static offsetMonth(start: YYYYMM, offset: number): YYYYMM {
    const [year, month] = start.split("-").map(Number);
    const date = new Date(year, month - 1 + offset);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    return `${yyyy}-${mm}` as YYYYMM;
  }
}
