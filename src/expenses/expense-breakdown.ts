import { MajikMoney, serializeMoney } from "@thezelijah/majik-money";
import {
  dateToYYYYMM,
  DEFAULT_COLORS,
  isValidYYYYMM,
  monthsInPeriod,
  offsetMonthsToYYYYMM,
} from "../utils";
import { YYYYMM, ExpenseID, PeriodYYYYMM } from "../types/types";
import { Expense } from "./expense";
import { ExpenseType, Recurrence } from "../enums";
import { ExpenseSummaryCache } from "./types";
import { PieChartTrace, TimeSeriesTrace } from "../types/plotly";

/**
 * ExpenseBreakdown manages a collection of Expense instances.
 * Provides CRUD operations, filters, aggregations, summaries,
 * and utilities for dashboard/reporting purposes.
 */
export class ExpenseBreakdown {
  private expenses: Expense[] = [];
  currency: string;
  period: PeriodYYYYMM;

  // Private cache property
  private _cache: ExpenseSummaryCache | null = null;

  /* ---------- Constructor ---------- */

  /**
   * Creates a new ExpenseBreakdown instance.
   * @param currency - The currency code for all expenses (default: "PHP").
   * @param expenses - Optional initial array of Expense instances.
   * @param period Optional start and end date
   */
  constructor(
    currency: string = "PHP",
    expenses: Expense[] = [],
    period?: PeriodYYYYMM
  ) {
    this.currency = currency;
    this.expenses = [...expenses];
    this.period = period || {
      startMonth: dateToYYYYMM(new Date()),
      endMonth: offsetMonthsToYYYYMM(dateToYYYYMM(new Date()), 23),
    };
    this.recalculateCache();
  }

  /* ---------- Private Cache Method ---------- */
  private recalculateCache(): void {
    this._cache = {
      totalExpenses: this.totalExpenses(),
      averageMonthlyExpense: this.getAverageMonthlyExpense(),
      totalExpenseAcrossPeriod: this.getTotalExpenseAcrossPeriod(),
      totalCashOutAcrossPeriod: this.getTotalCashOutAcrossPeriod(),
      totalRecurring: this.getTotalRecurring(),
      totalOneTime: this.getTotalOneTime(),
      totalCapital: this.getTotalCapital(),
      totalTaxDeductible: this.totalTaxDeductible(),
    };
  }

  /* ---------- Cache Getters ---------- */
  get totalExpensesCached(): MajikMoney {
    return this._cache?.totalExpenses ?? MajikMoney.zero(this.currency);
  }

  get averageMonthlyExpenseCached(): MajikMoney {
    return this._cache?.averageMonthlyExpense ?? MajikMoney.zero(this.currency);
  }

  get totalExpenseAcrossPeriodCached(): MajikMoney {
    return (
      this._cache?.totalExpenseAcrossPeriod ?? MajikMoney.zero(this.currency)
    );
  }

  get totalCashOutAcrossPeriodCached(): MajikMoney {
    return (
      this._cache?.totalCashOutAcrossPeriod ?? MajikMoney.zero(this.currency)
    );
  }

  get totalRecurringCached(): MajikMoney {
    return this._cache?.totalRecurring ?? MajikMoney.zero(this.currency);
  }

  get totalOneTimeCached(): MajikMoney {
    return this._cache?.totalOneTime ?? MajikMoney.zero(this.currency);
  }

  get totalCapitalCached(): MajikMoney {
    return this._cache?.totalCapital ?? MajikMoney.zero(this.currency);
  }

  get totalTaxDeductibleCached(): MajikMoney {
    return this._cache?.totalTaxDeductible ?? MajikMoney.zero(this.currency);
  }

  // Entire cache summary
  get cache(): ExpenseSummaryCache {
    if (!this._cache) this.recalculateCache();
    return this._cache!;
  }

  /* ---------- CRUD / Builder Methods ---------- */

  /**
   * Add a new expense.
   * @param expense - Expense instance to add.
   * @returns Current ExpenseBreakdown instance (for chaining).
   */
  add(expense: Expense): this {
    this.expenses.push(expense);
    this.recalculateCache();
    return this;
  }

  /**
   * Check if an expense exists by ID.
   * @param id ExpenseID to check
   * @returns True if expense exists, false otherwise
   */
  doesExist(id: ExpenseID): boolean {
    return this.expenses.some((e) => e.id === id);
  }

  /**
   * Remove an expense by ID.
   * @param id - ID of the expense to remove.
   * @returns Current ExpenseBreakdown instance (for chaining).
   */
  remove(id: ExpenseID): this {
    if (!this.doesExist(id)) {
      throw new Error(`Expense with ID ${id} does not exist`);
    }
    this.expenses = this.expenses.filter((e) => e.id !== id);
    this.recalculateCache();
    return this;
  }

  /**
   * Update an expense by ID.
   * @param id - ID of the expense to update.
   * @param updated - New Expense instance.
   * @returns Current ExpenseBreakdown instance (for chaining).
   * @throws Error if expense not found.
   */
  update(id: ExpenseID, updated: Expense): this {
    const idx = this.expenses.findIndex((e) => e.id === id);
    if (idx === -1) throw new Error(`Expense with ID ${id} not found`);
    this.expenses[idx] = updated;
    this.recalculateCache();
    return this;
  }

  /**
   * Clear all expenses.
   * @returns Current ExpenseBreakdown instance (for chaining).
   */
  clear(): this {
    this.expenses = [];
    this.recalculateCache();
    return this;
  }

  /**
   * Retrieve an expense by ID.
   * @param id - Expense ID.
   * @returns Expense instance or undefined if not found.
   */
  getByID(id: ExpenseID): Expense | undefined {
    return this.expenses.find((e) => e.id === id);
  }

  /**
   * Retrieve all expenses.
   * @returns Array of Expense instances.
   */
  getAll(): Expense[] {
    return [...this.expenses];
  }

  get items(): Expense[] {
    return [...this.expenses];
  }

  /**
   * Check if an expense exists by ID.
   * @param id - Expense ID.
   * @returns True if exists, false otherwise.
   */
  hasExpense(id: ExpenseID): boolean {
    return this.expenses.some((e) => e.id === id);
  }

  /* ---------- Filters ---------- */

  /**
   * Filter expenses by type.
   * @param type - ExpenseType to filter.
   * @returns Array of matching Expense instances.
   */
  getByType(type: ExpenseType): Expense[] {
    return this.expenses.filter((e) => e.type === type);
  }

  /**
   * Filter recurring expenses by recurrence pattern.
   * @param recurrence - Recurrence pattern (Monthly, Quarterly, etc.).
   * @returns Array of recurring Expense instances.
   */
  getByRecurrence(recurrence: Recurrence): Expense[] {
    return this.expenses.filter((e) => e.recurrence === recurrence);
  }

  /**
   * Filter expenses within a specific amount range.
   * @param min - Minimum amount (inclusive).
   * @param max - Maximum amount (inclusive).
   * @returns Array of Expense instances in the range.
   */
  getByAmountRange(min: MajikMoney, max: MajikMoney): Expense[] {
    return this.expenses.filter(
      (e) => e.amount.greaterThanOrEqual(min) && e.amount.lessThanOrEqual(max)
    );
  }

  /** All recurring expenses */
  getRecurring(): Expense[] {
    return this.expenses.filter((e) => e.isRecurring);
  }

  /** One-time expenses for a specific month */
  getOneTimeForMonth(month: YYYYMM): Expense[] {
    if (!isValidYYYYMM(month)) throw new Error("Invalid month");
    return this.expenses.filter(
      (e) => e.isOneTime && e.cashOutForMonth(month).isPositive()
    );
  }

  /** Capital/depreciable expenses */
  getCapital(): Expense[] {
    return this.expenses.filter((e) => e.isCapital);
  }

  /** Tax-deductible expenses */
  getTaxDeductible(): Expense[] {
    return this.expenses.filter((e) => e.isTaxDeductible);
  }

  /* ---------- Aggregations / Summaries ---------- */

  /**
   * Total cash out for a specific month.
   * @param month - Month in YYYY-MM format.
   * @returns MajikMoney representing total cash out.
   */
  getMonthlyCashOut(month: YYYYMM): MajikMoney {
    if (!isValidYYYYMM(month)) throw new Error("Invalid month");
    return this.expenses.reduce(
      (sum, e) => sum.add(e.cashOutForMonth(month)),
      MajikMoney.zero(this.currency)
    );
  }

  /**
   * Total expense recognized for P&L (after depreciation).
   * @param month - Month in YYYY-MM format.
   * @returns MajikMoney representing recognized expense.
   */
  getMonthlyExpense(month: YYYYMM): MajikMoney {
    if (!isValidYYYYMM(month)) throw new Error("Invalid month");
    return this.expenses.reduce(
      (sum, e) => sum.add(e.expenseForMonth(month)),
      MajikMoney.zero(this.currency)
    );
  }

  /**
   * Total tax-deductible expense for a month.
   * @param month - Month in YYYY-MM format.
   * @returns MajikMoney representing deductible expense.
   */
  getMonthlyDeductibleExpense(month: YYYYMM): MajikMoney {
    if (!isValidYYYYMM(month)) throw new Error("Invalid month");
    return this.expenses
      .filter((e) => e.isTaxDeductible)
      .reduce(
        (sum, e) => sum.add(e.expenseForMonth(month)),
        MajikMoney.zero(this.currency)
      );
  }

  /** Total of all expenses */
  totalExpenses(): MajikMoney {
    return this.expenses.reduce(
      (sum, e) => sum.add(e.amount),
      MajikMoney.zero(this.currency)
    );
  }

  /**
   * Total of all expenses for a specific month.
   * @param month - Month in YYYY-MM format.
   * @returns Total expenses as MajikMoney
   */
  totalExpensesForMonth(month: YYYYMM): MajikMoney {
    if (!isValidYYYYMM(month)) throw new Error("Invalid month");
    return this.expenses.reduce(
      (sum, exp) => sum.add(exp.cashOutForMonth(month)),
      MajikMoney.zero(this.currency)
    );
  }

  /** Total of all tax-deductible expenses */
  totalTaxDeductible(): MajikMoney {
    return this.expenses
      .filter((e) => e.isTaxDeductible)
      .reduce((sum, e) => sum.add(e.amount), MajikMoney.zero(this.currency));
  }

  /**
   * Get total net assets for all capital expenses up to a specific month.
   * Net assets = sum of NBV (Cost - Accumulated Depreciation) for all capital expenses.
   * @param month - Month in YYYY-MM format.
   * @returns MajikMoney representing net assets.
   */
  getNetAssetsUpTo(month: YYYYMM): MajikMoney {
    if (!isValidYYYYMM(month)) throw new Error("Invalid month");

    return this.getCapital().reduce(
      (sum, expense) => sum.add(expense.getNetBookValueUpTo(month)),
      MajikMoney.zero(this.currency)
    );
  }

  /* ---------- Sorting / Utilities ---------- */

  /**
   * Sort expenses by property.
   * @param by - Property to sort by ("name", "amount", or "type").
   * @param descending - Whether to sort descending (default: false).
   * @returns Sorted array of Expense instances.
   */
  sort(by: "name" | "amount" | "type", descending: boolean = false): Expense[] {
    const sorted = [...this.expenses].sort((a, b) => {
      switch (by) {
        case "name":
          return a.name.localeCompare(b.name);
        case "amount":
          return (
            a.amount.toMajorDecimal().toNumber() -
            b.amount.toMajorDecimal().toNumber()
          );
        case "type":
          return a.type.localeCompare(b.type);
      }
    });
    if (descending) sorted.reverse();
    return sorted;
  }

  /** Group expenses by type */
  groupByType(): Record<ExpenseType, Expense[]> {
    return this.expenses.reduce((acc, e) => {
      acc[e.type] = acc[e.type] || [];
      acc[e.type].push(e);
      return acc;
    }, {} as Record<ExpenseType, Expense[]>);
  }

  /**
   * Generate monthly cashflow map.
   * @param months - Array of YYYYMM months.
   * @returns Record of month => total cash out.
   */
  monthlyCashflow(months: YYYYMM[]): Record<YYYYMM, MajikMoney> {
    const flow: Record<YYYYMM, MajikMoney> = {};
    for (const month of months) {
      flow[month] = this.getMonthlyCashOut(month);
    }
    return flow;
  }

  private getMonthsInPeriod(period: PeriodYYYYMM): YYYYMM[] {
    const months: YYYYMM[] = [];
    let current = period.startMonth;

    while (current <= period.endMonth) {
      months.push(current);
      current = offsetMonthsToYYYYMM(current, 1);
    }

    return months;
  }

  getAverageMonthlyExpense(): MajikMoney {
    const months = this.getMonthsInPeriod(this.period);

    if (months.length === 0) {
      return MajikMoney.zero(this.currency);
    }

    const total = months.reduce(
      (sum, month) => sum.add(this.getMonthlyExpense(month)),
      MajikMoney.zero(this.currency)
    );

    return total.divide(months.length);
  }

  getTotalExpenseAcrossPeriod(): MajikMoney {
    const months = this.getMonthsInPeriod(this.period);

    return months.reduce(
      (sum, month) => sum.add(this.getMonthlyExpense(month)),
      MajikMoney.zero(this.currency)
    );
  }

  getTotalCashOutAcrossPeriod(): MajikMoney {
    const months = this.getMonthsInPeriod(this.period);

    return months.reduce(
      (sum, month) => sum.add(this.getMonthlyCashOut(month)),
      MajikMoney.zero(this.currency)
    );
  }

  /**
   * Generate monthly summary of cashOut and expense.
   * @param months - Array of YYYYMM months.
   * @returns Record of month => { cashOut, expense }.
   */
  monthlySummary(
    months: YYYYMM[]
  ): Record<YYYYMM, { cashOut: MajikMoney; expense: MajikMoney }> {
    const summary: Record<
      YYYYMM,
      { cashOut: MajikMoney; expense: MajikMoney }
    > = {};
    for (const month of months) {
      summary[month] = {
        cashOut: this.getMonthlyCashOut(month),
        expense: this.getMonthlyExpense(month),
      };
    }
    return summary;
  }

  /* ---------- Dashboard / Reporting ---------- */

  /**
   * Get top N expenses by amount or cashOut.
   * @param n - Number of top expenses (default: 5).
   * @param by - "amount" or "cashOut" (default: "amount").
   * @param month - Month for cashOut sorting (required if by = "cashOut").
   * @returns Array of top Expense instances.
   */
  getTopExpenses(
    n: number = 5,
    by: "amount" | "cashOut" = "amount",
    month?: YYYYMM
  ): Expense[] {
    const list = [...this.expenses];
    if (by === "cashOut" && month) {
      list.sort(
        (a, b) =>
          a.cashOutForMonth(month).toMajorDecimal().toNumber() -
          b.cashOutForMonth(month).toMajorDecimal().toNumber()
      );
    } else {
      list.sort(
        (a, b) =>
          a.amount.toMajorDecimal().toNumber() -
          b.amount.toMajorDecimal().toNumber()
      );
    }
    return list.reverse().slice(0, n);
  }

  /** Sum of all recurring expenses */
  getTotalRecurring(): MajikMoney {
    return this.getRecurring().reduce(
      (sum, e) => sum.add(e.amount),
      MajikMoney.zero(this.currency)
    );
  }

  /** Sum of all one-time expenses */
  getTotalOneTime(): MajikMoney {
    return this.expenses
      .filter((e) => e.isOneTime)
      .reduce((sum, e) => sum.add(e.amount), MajikMoney.zero(this.currency));
  }

  /** Sum of all capital/depreciable expenses */
  getTotalCapital(): MajikMoney {
    return this.getCapital().reduce(
      (sum, e) => sum.add(e.amount),
      MajikMoney.zero(this.currency)
    );
  }

  /**
   * Get all expenses affecting a specific year.
   * @param year - Year (YYYY).
   * @returns Record of month => Expense[].
   */
  getExpensesForYear(year: number): Record<YYYYMM, Expense[]> {
    const result: Record<YYYYMM, Expense[]> = {};
    for (let month = 1; month <= 12; month++) {
      const mm = month < 10 ? `0${month}` : `${month}`;
      const yyyymm: YYYYMM = `${year}-${mm}` as YYYYMM;
      const expensesForMonth = this.expenses.filter((e) =>
        e.cashOutForMonth(yyyymm).isPositive()
      );
      if (expensesForMonth.length) result[yyyymm] = expensesForMonth;
    }
    return result;
  }

  /* ---------- Period ---------- */

  /**
   * Fully sets the expense breakdown period.
   * Replaces both start and end months.
   * NOTE:
   * Any existing expense outside the new period
   * will be automatically removed.
   * @param period - Period with startMonth and endMonth (YYYY-MM)
   * @throws Error if months are invalid or start is after end
   * @returns The current ExpenseBreakdown instance (for chaining)
   */
  setPeriod(period: PeriodYYYYMM): this {
    const { startMonth, endMonth } = period;

    if (!isValidYYYYMM(startMonth)) {
      throw new Error(`Invalid startMonth: ${startMonth}`);
    }

    if (!isValidYYYYMM(endMonth)) {
      throw new Error(`Invalid endMonth: ${endMonth}`);
    }

    if (monthsInPeriod(startMonth, endMonth) <= 0) {
      throw new Error(
        `startMonth (${startMonth}) cannot be after endMonth (${endMonth})`
      );
    }

    this.period = { startMonth, endMonth };
    this.onPeriodChanged(period);
    return this;
  }

  /**
   * Updates part of the Expense Breakdown period.
   * Useful for UI-driven changes where only one bound is modified.
   * NOTE:
   * Any existing expense outside the new period
   * will be automatically removed.
   * @param partial - Partial period update (startMonth and/or endMonth)
   * @throws Error if resulting period is invalid
   * @returns The current ExpenseBreakdown instance (for chaining)
   */
  updatePeriod(partial: Partial<PeriodYYYYMM>): this {
    const nextPeriod: PeriodYYYYMM = {
      startMonth: partial.startMonth ?? this.period.startMonth,
      endMonth: partial.endMonth ?? this.period.endMonth,
    };

    return this.setPeriod(nextPeriod);
  }

  private reconcileExpensesForPeriod(nextPeriod: PeriodYYYYMM): void {
    const reconciled: Expense[] = [];

    for (const expense of this.expenses) {
      // 🔁 Recurring → regenerate schedule
      if (expense.isRecurring) {
        reconciled.push(expense.updatePeriod(nextPeriod));
        continue;
      }

      // 🧾 One-time or Capital → keep only if purchase month is in period
      const purchaseMonth = expense.purchaseMonth;

      if (!purchaseMonth) continue;

      if (this.isMonthInPeriod(purchaseMonth, nextPeriod)) {
        reconciled.push(expense);
      }
      // else → dropped
    }

    this.expenses = reconciled;
  }

  private isMonthInPeriod(month: YYYYMM, period: PeriodYYYYMM): boolean {
    return month >= period.startMonth && month <= period.endMonth;
  }

  private onPeriodChanged(nextPeriod: PeriodYYYYMM): void {
    this.reconcileExpensesForPeriod(nextPeriod);
    this.recalculateCache();
  }

  /* ---------- Instance Builders / Quick Adders ---------- */

  /**
   * Quickly create and add a recurring expense.
   * @param name - Name/description of the expense.
   * @param amount - Amount of the expense in major currency units (e.g., 100.50).
   * @param currency - Currency code (default: this.currency).
   * @param recurrence - Recurrence pattern (default: Monthly).
   * @param isTaxDeductible - Whether this expense is tax-deductible (default: true).
   * @param period - Month of the expense in YYYY-MM format.
   * @param id - Optional custom ExpenseID.
   * @returns The created Expense instance.
   */
  addRecurring(
    name: string,
    amount: number,
    currency: string = this.currency,
    recurrence: Recurrence = Recurrence.Monthly,
    isTaxDeductible: boolean = true,
    period: PeriodYYYYMM = this.period,
    id?: ExpenseID
  ): Expense {
    const expense = Expense.recurring(
      id,
      name,
      amount,
      currency,
      recurrence,
      period,
      isTaxDeductible
    );
    this.add(expense);
    return expense;
  }

  /**
   * Quickly create and add a one-time expense.
   * @param name - Name/description of the expense.
   * @param amount - Amount of the expense in major currency units.
   * @param currency - Currency code (default: this.currency).
   * @param month - Month of the expense in YYYY-MM format.
   * @param isTaxDeductible - Whether this expense is tax-deductible (default: true).
   * @param id - Optional custom ExpenseID.
   * @returns The created Expense instance.
   */
  addOneTime(
    name: string,
    amount: number,
    currency: string = this.currency,
    month: YYYYMM,
    isTaxDeductible: boolean = true,
    id?: ExpenseID
  ): Expense {
    const expense = Expense.oneTime(
      id,
      name,
      amount,
      currency,
      month,
      isTaxDeductible
    );
    this.add(expense);
    return expense;
  }

  /**
   * Quickly create and add a capital/depreciable expense.
   * @param name - Name/description of the expense.
   * @param amount - Total cost of the capital expense.
   * @param depreciationMonths - Number of months over which the expense is depreciated.
   * @param currency - Currency code (default: this.currency).
   * @param month Month in YYYYMM format
   * @param residualValue - Optional residual value at the end of depreciation.
   * @param isTaxDeductible - Whether this expense is tax-deductible (default: true).
   * @param id - Optional custom ExpenseID.
   * @returns The created Expense instance.
   */
  addCapital(
    name: string,
    amount: number,
    depreciationMonths: number,
    currency: string = this.currency,
    month: YYYYMM,
    residualValue?: number,
    isTaxDeductible: boolean = true,
    id?: ExpenseID
  ): Expense {
    const expense = Expense.capital(
      id,
      name,
      amount,
      currency,
      month,
      depreciationMonths,
      residualValue,
      isTaxDeductible
    );
    this.add(expense);
    return expense;
  }

  /**
   * Generates a Pie Chart trace representing the breakdown of expenses by type.
   *
   * Each expense is represented by a slice:
   * - Capital expenses → green
   * - One-time expenses → blue
   * - Recurring expenses → red
   * - Fallback/unknown → gray
   * @param colors - Colors to use for the chart
   * @returns {PieChartTrace[]} An array with a single PieChartTrace object.
   *   - `labels` are the names of the expenses.
   *   - `values` are the expense amounts in major currency units.
   *   - `marker.color` maps the expense type to a color.
   *   - `hovertemplate` shows the name, amount, and percentage of the total.
   *   - If there are no expenses, returns an empty pie chart trace.
   */
  expenseBreakdownPlot(
    colors: string[] = [
      DEFAULT_COLORS.green,
      DEFAULT_COLORS.blue,
      DEFAULT_COLORS.red,
      DEFAULT_COLORS.white,
    ]
  ): PieChartTrace[] {
    if (this.expenses.length === 0) {
      return [];
    }

    const labels = this.expenses.map((e) => e.name);
    const values = this.expenses.map((e) => e.amount.toMajor());

    const markerColors = this.expenses.map((e) => {
      if (e.isCapital) return colors[0]; // green
      if (e.isOneTime) return colors[1]; // blue
      if (e.isRecurring) return colors[2]; // red
      return colors[3]; // fallback white
    });

    return [
      {
        type: "pie",
        labels,
        values,
        marker: { color: markerColors },
        name: "Expenses",
        hovertemplate: "%{label}<br>₱%{value:,.2f} (%{percent})<extra></extra>",
      },
    ];
  }

  /* ---------- Expense Trend Over Time ---------- */

  /**
   * Generates a monthly expense trend broken down by type.
   * Returns an array of TimeSeriesTrace, one per category.
   * @param months - Optional array of YYYYMM months. If not provided, uses full period.
   * @param mode - Optional Plotly mode ("lines" | "markers" | "lines+markers").
   * @param colors - Colors to use for the chart
   */
  getExpenseTrendByCategory(
    months?: YYYYMM[],
    mode: "lines" | "markers" | "lines+markers" = "lines+markers",
    colors: string[] = [
      DEFAULT_COLORS.green,
      DEFAULT_COLORS.blue,
      DEFAULT_COLORS.red,
    ]
  ): TimeSeriesTrace[] {
    const trendMonths =
      months && months.length > 0
        ? months
        : this.getMonthsInPeriod(this.period);

    const categories: {
      name: string;
      filter: (e: Expense) => boolean;
      color: string;
    }[] = [
      {
        name: "Recurring",
        filter: (e) => e.isRecurring,
        color: colors[2],
      },
      {
        name: "One-Time",
        filter: (e) => e.isOneTime,
        color: colors[1],
      },
      {
        name: "Capital",
        filter: (e) => e.isCapital,
        color: colors[0],
      },
    ];

    return categories.map((cat) => {
      const y: number[] = trendMonths.map((month) =>
        this.expenses
          .filter(cat.filter)
          .reduce(
            (sum, e) => sum.add(e.expenseForMonth(month)),
            MajikMoney.zero(this.currency)
          )
          .toMajor()
      );

      return {
        type: "scatter",
        mode,
        name: cat.name,
        x: trendMonths,
        y,
        line: { shape: "spline", smoothing: 0.5, width: 3 },
        marker: { size: 6, color: cat.color },
        hovertemplate: "%{x}: ₱%{y:,.2f}<extra></extra>",
      };
    });
  }

  /* ---------- Validation / Merge ---------- */

  /** Validate that all expenses have consistent currency */
  validateCurrencyConsistency(): void {
    this.expenses.forEach((e) => {
      if (e.amount.currency.code !== this.currency) {
        throw new Error(
          `Expense ${e.name} has different currency: ${e.amount.currency.code}`
        );
      }
    });
  }

  /**
   * Merge another ExpenseBreakdown into this one.
   * @param other - ExpenseBreakdown instance to merge.
   * @returns Current ExpenseBreakdown instance (for chaining).
   */
  merge(other: ExpenseBreakdown): this {
    other.getAll().forEach((e) => this.add(e));
    return this;
  }

  /**
   * Converts the current ExpenseBreakdown object to a plain JavaScript object (JSON).
   * @returns {object} - The plain object representation of the ExpenseBreakdown instance.
   */
  toJSON(): object {
    const preJSON = {
      currency: this.currency,
      expenses: this.expenses.map((e) => e.toJSON()),
      period: this.period,
    };

    const serializedMoney: object = serializeMoney(preJSON);

    return serializedMoney;
  }

  /**
   * Static method to parse a JSON string or object into a `ExpenseBreakdown` instance.
   *
   * @param json - A JSON string or plain object to be parsed.
   * @returns {ExpenseBreakdown} - A new ExpenseBreakdown instance based on the parsed JSON.
   * @throws Will throw an error if required properties are missing.
   */

  static parseFromJSON(json: string | object): ExpenseBreakdown {
    // If the input is a string, parse it as JSON
    const rawParse: ExpenseBreakdown =
      typeof json === "string"
        ? JSON.parse(json)
        : structuredClone
        ? structuredClone(json)
        : JSON.parse(JSON.stringify(json));

    const expenses =
      rawParse.expenses?.map((e) => Expense.parseFromJSON(e)) || [];
    return new ExpenseBreakdown(rawParse.currency, expenses, rawParse?.period);
  }
}
