import { MajikMoney, serializeMoney } from "@thezelijah/majik-money";
import {
  autogenerateID,
  dateToYYYYMM,
  DEFAULT_COLORS,
  isValidYYYYMM,
  monthsArrayInPeriod,
  monthsInPeriod,
  offsetMonthsToYYYYMM,
} from "../utils";
import {
  YYYYMM,
  FundingID,
  PeriodYYYYMM,
  FundingManagerSnapshot,
} from "../types/types";
import { FundingType } from "../enums";
import { FundingEvent } from "./funding";
import {
  AmortizationEntry,
  FundingManagerJSON,
  FundingSummaryCache,
} from "./types";
import {
  FundingBarChartTrace,
  FundingPieChartTrace,
  FundingTimeSeriesTrace,
} from "../types/plotly";

/**
 * FundingManager manages all FundingEvent instances for a business or project.
 * It provides CRUD operations, aggregation utilities, filtering, runway calculations,
 * advanced analytics, and reporting utilities.
 *
 * Example usage:
 * ```ts
 * const fm = new FundingManager("USD");
 * fm.addEquity("Seed Round", 10000, "2025-01");
 * const runwayMonths = fm.estimateRunway(MajikMoney.fromMajor(2000, "USD"));
 * ```
 */
export class FundingManager {
  private fundingEvents: FundingEvent[] = [];
  currency: string;

  period: PeriodYYYYMM;

  // Private cache property
  private _cache: FundingSummaryCache | null = null;

  private _debtSchedules: Record<FundingID, AmortizationEntry[]> | null = null;

  /* ---------- Constructor ---------- */

  /**
   * Creates a new FundingManager instance.
   * @param currency Base currency code (e.g., "PHP", "USD")
   * @param funding Optional initial array of FundingEvent
   * @param period Optional start and end date
   */
  constructor(
    currency: string = "PHP",
    funding: FundingEvent[] = [],
    period?: PeriodYYYYMM
  ) {
    this.currency = currency;
    this.fundingEvents = [...funding];
    this.period = period || {
      startMonth: dateToYYYYMM(new Date()),
      endMonth: offsetMonthsToYYYYMM(dateToYYYYMM(new Date()), 23),
    };
    this.recalculateCache();
  }

  /* ---------- Cache Getters ---------- */
  get totalFundingAcrossPeriodCached(): MajikMoney {
    return (
      this._cache?.totalFundingAcrossPeriod ?? MajikMoney.zero(this.currency)
    );
  }

  get averageMonthlyFundingCached(): MajikMoney {
    return this._cache?.averageMonthlyFunding ?? MajikMoney.zero(this.currency);
  }

  get totalEquityAcrossPeriodCached(): MajikMoney {
    return (
      this._cache?.totalEquityAcrossPeriod ?? MajikMoney.zero(this.currency)
    );
  }

  get totalDebtAcrossPeriodCached(): MajikMoney {
    return this._cache?.totalDebtAcrossPeriod ?? MajikMoney.zero(this.currency);
  }

  get totalGrantAcrossPeriodCached(): MajikMoney {
    return (
      this._cache?.totalGrantAcrossPeriod ?? MajikMoney.zero(this.currency)
    );
  }

  get debtRatioCached(): number {
    return this._cache?.debtRatio || 0;
  }

  get nonRepayableRatioCached(): number {
    return this._cache?.nonRepayableRatio || 0;
  }

  get fundingEventCountCached(): number {
    return this._cache?.fundingEventCount || 0;
  }

  // Entire cache summary
  get cache(): FundingSummaryCache {
    if (!this._cache) this.recalculateCache();
    return this._cache!;
  }

  /* ---------- CRUD Operations ---------- */

  /**
   * Add a FundingEvent instance to the manager.
   * @param event FundingEvent to add
   * @returns The FundingManager instance for chaining
   */
  add(event: FundingEvent): this {
    this.fundingEvents.push(event);
    this.recalculateCache();
    return this;
  }

  /**
   * Check if a funding event exists by ID.
   * @param id FundingID to check
   * @returns True if funding event exists, false otherwise
   */
  doesExist(id: FundingID): boolean {
    return this.fundingEvents.some((f) => f.id === id);
  }

  /**
   * Remove a FundingEvent by its ID.
   * @param id FundingID to remove
   * @returns The FundingManager instance for chaining
   * @throws Error if funding event with given ID does not exist
   */
  remove(id: FundingID): this {
    if (!this.doesExist(id)) {
      throw new Error(`FundingEvent with ID ${id} does not exist`);
    }
    this.fundingEvents = this.fundingEvents.filter((f) => f.id !== id);
    this.recalculateCache();
    return this;
  }

  /**
   * Update an existing FundingEvent by ID.
   * @param id FundingID of the event to update
   * @param updated Updated FundingEvent object
   * @returns The FundingManager instance for chaining
   * @throws Error if event with given ID is not found
   */
  update(id: FundingID, updated: FundingEvent): this {
    const idx = this.fundingEvents.findIndex((f) => f.id === id);
    if (idx === -1) throw new Error(`FundingEvent with ID ${id} not found`);
    this.fundingEvents[idx] = updated;
    this.recalculateCache();
    return this;
  }

  /**
   * Clears all funding events from the manager.
   * @returns The FundingManager instance for chaining
   */
  clear(): this {
    this.fundingEvents = [];
    this.recalculateCache();
    return this;
  }

  /**
   * Retrieve a FundingEvent by ID.
   * @param id FundingID to search
   * @returns The FundingEvent if found, otherwise undefined
   */
  getByID(id: FundingID): FundingEvent | undefined {
    return this.fundingEvents.find((f) => f.id === id);
  }

  /**
   * Returns all FundingEvent instances.
   * @returns Array of FundingEvent
   */
  getAll(): FundingEvent[] {
    return [...this.fundingEvents];
  }

  get items(): FundingEvent[] {
    return [...this.fundingEvents];
  }

  /**
   * Checks if a funding event exists by ID.
   * @param id FundingID
   * @returns True if the event exists
   */
  hasFunding(id: FundingID): boolean {
    return this.fundingEvents.some((f) => f.id === id);
  }

  /* ---------- Quick Adders / Builders ---------- */

  /**
   * Quickly create and add an equity funding event.
   * @param name Name of the funding event
   * @param amount Amount of funding
   * @param month YYYY-MM formatted month
   * @param currency Optional currency, defaults to manager currency
   * @param id Optional FundingID
   * @returns The created FundingEvent
   */
  addEquity(
    name: string,
    amount: number,
    month: YYYYMM,
    currency: string = this.currency,
    id?: FundingID
  ): FundingEvent {
    const event = FundingEvent.equity(name, amount, month, currency, id);
    return this.add(event).getByID(event.id)!;
  }

  /**
   * Quickly create and add a debt funding event.
   * @param name Name of the funding event
   * @param amount Amount of debt
   * @param month - Start month of the debt (YYYYMM)
   * @param maturityDate - ISO date string representing when the debt must be fully repaid
   * @param currency - Currency code (default: "PHP")
   * @param interestRate - Annual interest rate as a decimal ratio (default: 0, e.g., 0.05 for 5%)
   * @param initialPayment - Upfront payment at the start of the loan (default: 0)
   * @param id Optional ID
   * @returns The created FundingEvent
   */
  addDebt(
    name: string,
    amount: number,
    month: YYYYMM,
    maturityDate: string,
    currency: string = "PHP",
    interestRate: number = 0,
    initialPayment: number = 0,
    id?: FundingID
  ): FundingEvent {
    const event = FundingEvent.debt(
      name,
      amount,
      month,
      maturityDate,
      currency,
      interestRate,
      initialPayment,
      id
    );
    return this.add(event).getByID(event.id)!;
  }

  /**
   * Quickly create and add a grant funding event.
   * @param name Name of the grant
   * @param amount Amount of grant
   * @param month YYYY-MM formatted month
   * @param currency Optional currency, defaults to manager currency
   * @param id Optional FundingID
   * @returns The created FundingEvent
   */
  addGrant(
    name: string,
    amount: number,
    month: YYYYMM,
    currency: string = this.currency,
    id?: FundingID
  ): FundingEvent {
    const event = FundingEvent.grant(name, amount, month, currency, id);
    return this.add(event).getByID(event.id)!;
  }

  /**
   * Generic funding event (advanced usage).
   * @param type Type of funding
   * @param name Name of the funding
   * @param amount Amount
   * @param month YYYY-MM formatted month
   * @param currency Optional currency, defaults to manager currency
   * @param id Optional FundingID
   * @returns The created FundingEvent
   */
  addFunding(
    type: FundingType,
    name: string,
    amount: number,
    month: YYYYMM,
    currency: string = this.currency,
    id?: FundingID
  ): FundingEvent {
    const event = FundingEvent.create({
      id: id ?? autogenerateID("mjkfd"),
      name,
      amount: MajikMoney.fromMajor(amount, currency),
      month,
      type,
    });
    return this.add(event).getByID(event.id)!;
  }

  /* ---------- Filtering Methods ---------- */

  /**
   * Get funding events by type.
   * @param type FundingType
   * @returns Array of FundingEvent matching the type
   */
  getByType(type: FundingType): FundingEvent[] {
    return this.fundingEvents.filter((f) => f.type === type);
  }

  /**
   * Get all equity funding events.
   * @returns Array of equity FundingEvent
   */
  getEquity(): FundingEvent[] {
    return this.fundingEvents.filter((f) => f.isEquity);
  }

  /**
   * Get all debt funding events.
   * @returns Array of debt FundingEvent
   */
  getDebt(): FundingEvent[] {
    return this.fundingEvents.filter((f) => f.isDebt);
  }

  /**
   * Get all grant funding events.
   * @returns Array of grant FundingEvent
   */
  getGrants(): FundingEvent[] {
    return this.fundingEvents.filter((f) => f.isGrant);
  }

  /**
   * Get funding events for a specific month.
   * @param month YYYY-MM formatted month
   * @returns Array of FundingEvent
   */
  getForMonth(month: YYYYMM): FundingEvent[] {
    if (!isValidYYYYMM(month)) throw new Error("Invalid month format");
    return this.fundingEvents.filter((f) => f.month === month);
  }

  /**
   * Get funding events between two months inclusive.
   * @param start Start month (YYYY-MM)
   * @param end End month (YYYY-MM)
   * @returns Array of FundingEvent
   */
  getFundingBetween(start: YYYYMM, end: YYYYMM): FundingEvent[] {
    return this.fundingEvents.filter((f) => f.month >= start && f.month <= end);
  }

  /* ---------- Aggregation & Totals ---------- */

  /**
   * Total cash-in for a specific month.
   * @param month YYYY-MM formatted month
   * @returns Total funding as MajikMoney
   */
  getMonthlyCashIn(month: YYYYMM): MajikMoney {
    if (!isValidYYYYMM(month)) throw new Error("Invalid month format");
    return this.fundingEvents.reduce(
      (sum, f) => sum.add(f.cashInForMonth(month)),
      MajikMoney.zero(this.currency)
    );
  }

  /**
   * Total funding raised across all time.
   * @returns Total funding as MajikMoney
   */
  totalFunding(): MajikMoney {
    return this.fundingEvents.reduce(
      (sum, f) => sum.add(f.amount),
      MajikMoney.zero(this.currency)
    );
  }

  /**
   * Get Total funding raised for a specific month.
   * @returns Total funding as MajikMoney
   */
  totalFundingForMonth(month: YYYYMM): MajikMoney {
    return this.getForMonth(month).reduce(
      (sum, f) => sum.add(f.amount),
      MajikMoney.zero(this.currency)
    );
  }

  /**
   * Total non-repayable funding (equity + grants).
   * @returns MajikMoney representing non-repayable funding
   */
  totalNonRepayable(): MajikMoney {
    return this.fundingEvents
      .filter((f) => f.isEquity || f.isGrant)
      .reduce((sum, f) => sum.add(f.amount), MajikMoney.zero(this.currency));
  }

  /**
   * Total debt funding.
   * @returns MajikMoney representing debt
   */
  totalDebt(): MajikMoney {
    return this.fundingEvents
      .filter((f) => f.isDebt)
      .reduce((sum, f) => sum.add(f.amount), MajikMoney.zero(this.currency));
  }

  /**
   * Total funding of a specific type up to a given month.
   * @param type FundingType
   * @param month YYYY-MM formatted month
   * @returns MajikMoney representing the total
   */
  totalByTypeUntil(type: FundingType, month: YYYYMM): MajikMoney {
    return this.fundingEvents
      .filter((f) => f.type === type && f.month <= month)
      .reduce((sum, f) => sum.add(f.amount), MajikMoney.zero(this.currency));
  }

  /**
   * Returns a breakdown of funding by type.
   * @returns Record with FundingType keys and MajikMoney values
   */
  fundingBreakdown(): Record<FundingType, MajikMoney> {
    const breakdown: Record<FundingType, MajikMoney> = {
      [FundingType.Equity]: MajikMoney.zero(this.currency),
      [FundingType.Grant]: MajikMoney.zero(this.currency),
      [FundingType.Debt]: MajikMoney.zero(this.currency),
    };
    for (const f of this.fundingEvents)
      breakdown[f.type] = breakdown[f.type].add(f.amount);
    return breakdown;
  }

  /**
   * Debt ratio: debt / total funding.
   * @returns Number between 0-1 representing debt ratio
   */
  debtRatio(): number {
    const total = this.totalFunding().toMajor();
    return total === 0 ? 0 : this.totalDebt().divide(total).toMajor();
  }

  /**
   * Check if debt exceeds a max ratio.
   * @param maxRatio Maximum allowed ratio (default 0.5)
   * @returns True if debt exceeds max ratio
   */
  checkDebtLimit(maxRatio = 0.5): boolean {
    return this.debtRatio() > maxRatio;
  }

  /**
   * Get total outstanding debt balance up to a given month.
   *
   * Outstanding debt is derived from amortization schedules
   * and represents remaining principal balances.
   *
   * @param month YYYYMM
   * @returns MajikMoney outstanding debt
   */
  getOutstandingDebtUpTo(month: YYYYMM): MajikMoney {
    let total = MajikMoney.zero(this.currency);

    for (const debt of this.getDebt()) {
      const schedule = this._debtSchedules?.[debt.id] ?? [];
      const entry = schedule.filter((e) => e.month <= month).at(-1);

      if (entry) total = total.add(entry.total);
    }

    return total;
  }

  /**
   * Total outstanding debt (remaining principal)
   * at the end of the manager period.
   *
   * Represents unpaid debt / payables.
   */
  getTotalOutstandingDebtAcrossPeriod(): MajikMoney {
    const { endMonth } = this.period;
    let total = MajikMoney.zero(this.currency);

    for (const debt of this.getDebt()) {
      const schedule = this._debtSchedules?.[debt.id] ?? [];

      // last entry within period
      const entry = schedule.filter((e) => e.month <= endMonth).at(-1);

      if (entry) {
        total = total.add(entry.principal);
      }
    }

    return total;
  }

  /**
   * Total debt paid (principal + interest)
   * across the manager period.
   *
   * Represents historical cash outflow for debt servicing.
   */
  getTotalDebtPaidAcrossPeriod(): MajikMoney {
    const { startMonth, endMonth } = this.period;
    let total = MajikMoney.zero(this.currency);

    for (const schedule of Object.values(this._debtSchedules ?? {})) {
      for (const entry of schedule) {
        if (entry.month >= startMonth && entry.month <= endMonth) {
          total = total.add(entry.principal).add(entry.interest);
        }
      }
    }

    return total;
  }

  /* ---------- Cashflow Maps ---------- */

  /**
   * Monthly cash-in map for a set of months.
   * @param months Array of YYYY-MM months
   * @returns Record mapping month to MajikMoney
   */
  monthlyNetCashflow(months: YYYYMM[]): Record<YYYYMM, MajikMoney> {
    const flow: Record<YYYYMM, MajikMoney> = {};

    for (const month of months) {
      let net = this.getMonthlyCashIn(month);

      for (const debt of this.getDebt()) {
        const schedule = debt.generateAmortizationSchedule();
        const entry = schedule.find((e) => e.month === month);

        if (entry) {
          net = net.subtract(entry.principal).subtract(entry.interest);
        }
      }

      flow[month] = net;
    }

    return flow;
  }

  /**
   * Cumulative funding up to a given month.
   * @param month YYYY-MM formatted month
   * @returns MajikMoney representing cumulative funding
   */
  cumulativeFunding(month: YYYYMM): MajikMoney {
    let sum = MajikMoney.zero(this.currency);
    for (const f of this.fundingEvents)
      if (f.month <= month) sum = sum.add(f.amount);
    return sum;
  }

  /**
   * Cumulative monthly cash-in map for a set of months.
   * @param months Array of YYYY-MM months
   * @returns Record mapping month to cumulative MajikMoney
   */
  cumulativeMonthlyCashflow(months: YYYYMM[]): Record<YYYYMM, MajikMoney> {
    const flow: Record<YYYYMM, MajikMoney> = {};
    let cumulative = MajikMoney.zero(this.currency);
    for (const month of months) {
      cumulative = cumulative.add(this.getMonthlyCashIn(month));
      flow[month] = cumulative;
    }
    return flow;
  }

  /**
   * Monthly cash-in map split by funding type.
   * @param months Array of YYYY-MM months
   * @returns Record mapping month to a record of FundingType -> MajikMoney
   */
  monthlyCashflowByType(
    months: YYYYMM[]
  ): Record<YYYYMM, Record<FundingType, MajikMoney>> {
    const map: Record<YYYYMM, Record<FundingType, MajikMoney>> = {};
    for (const month of months) {
      const typesMap: Record<FundingType, MajikMoney> = {
        [FundingType.Equity]: MajikMoney.zero(this.currency),
        [FundingType.Debt]: MajikMoney.zero(this.currency),
        [FundingType.Grant]: MajikMoney.zero(this.currency),
      };
      for (const f of this.getForMonth(month))
        typesMap[f.type] = typesMap[f.type].add(f.amount);
      map[month] = typesMap;
    }
    return map;
  }

  /**
   * Estimate runway in months using non-repayable funding only.
   *
   * Runway excludes debt principal since loans do not extend
   * operational runway.
   *
   * @param monthlyBurn Monthly burn rate
   * @returns Number of months of runway
   */
  estimateRunway(monthlyBurn: MajikMoney): number {
    if (monthlyBurn.isZero()) return Infinity;

    const usableFunds = this.totalNonRepayable();
    return usableFunds.isZero() ? 0 : usableFunds.ratio(monthlyBurn);
  }

  /**
   * Estimate net runway considering debt repayments.
   *
   * Net runway accounts for:
   * - Non-repayable funding
   * - Scheduled debt repayments (principal + interest)
   *
   * @param monthlyBurn Monthly expenses
   * @returns Number of months of net runway
   */
  estimateNetRunway(monthlyBurn: MajikMoney): number {
    if (monthlyBurn.isZero()) return Infinity;

    let totalDebtOutflow = MajikMoney.zero(this.currency);

    for (const schedule of Object.values(this._debtSchedules ?? {})) {
      for (const entry of schedule) {
        totalDebtOutflow = totalDebtOutflow
          .add(entry.principal)
          .add(entry.interest);
      }
    }

    const netFunds = this.totalNonRepayable().subtract(totalDebtOutflow);

    return netFunds.isZero() ? 0 : netFunds.ratio(monthlyBurn);
  }

  /**
   * Total projected interest for all debt up to a given month.
   * @param upToMonth YYYYMM
   * @param compound Whether to use compound interest
   * @returns MajikMoney
   */
  totalDebtInterest(
    upToMonth: YYYYMM,
    fullyAmortized = false,
    compound = true
  ): MajikMoney {
    let total = MajikMoney.zero(this.currency);

    for (const debt of this.getDebt()) {
      const schedule = debt.generateAmortizationSchedule(
        fullyAmortized,
        compound
      );

      for (const entry of schedule) {
        if (entry.month <= upToMonth) {
          total = total.add(entry.interest);
        }
      }
    }

    return total;
  }

  /**
   * Generate amortization schedules for all debt.
   * @param fullyAmortized Whether to use fully amortized payments
   * @param {boolean} [useCompoundInterest=true] - If `true`, interest is compounded per the compounding frequency.
   * @returns Record mapping FundingID -> AmortizationEntry[]
   */
  debtAmortizationSchedules(
    fullyAmortized: boolean = false,
    useCompoundInterest: boolean = true
  ): Record<FundingID, AmortizationEntry[]> {
    const months = monthsInPeriod(this.period.startMonth, this.period.endMonth);
    if (months <= 0) return {};
    const schedules: Record<FundingID, AmortizationEntry[]> = {};
    this.getDebt().forEach((f) => {
      schedules[f.id] = f.generateAmortizationSchedule(
        fullyAmortized,
        useCompoundInterest
      );
    });
    return schedules;
  }

  /**
   * Monthly net cashflow including actual debt repayments.
   *
   * Net cashflow = cash-in − (debt principal + interest paid in that month)
   *
   * This method is amortization-schedule–driven and reflects
   * real cash leaving the business.
   *
   * @param months Array of YYYYMM months
   * @returns Record mapping YYYYMM -> net MajikMoney
   */
  monthlyCashflowWithDebtInterest(
    months: YYYYMM[]
  ): Record<YYYYMM, MajikMoney> {
    const flow: Record<YYYYMM, MajikMoney> = {};

    for (const month of months) {
      let net = this.getMonthlyCashIn(month);

      for (const debt of this.getDebt()) {
        const schedule = this._debtSchedules?.[debt.id] ?? [];
        const entry = schedule.find((e) => e.month === month);

        if (entry) {
          net = net.subtract(entry.principal).subtract(entry.interest);
        }
      }

      flow[month] = net;
    }

    return flow;
  }

  /**
   * Total non-repayable funding (equity + grants) up to a month.
   */
  totalNonRepayableUpTo(month: YYYYMM): MajikMoney {
    return this.fundingEvents
      .filter((f) => (f.isEquity || f.isGrant) && f.month <= month)
      .reduce((sum, f) => sum.add(f.amount), MajikMoney.zero(this.currency));
  }

  /**
   * Percentage of equity vs total funding for a given month
   */
  equityPercentage(month: YYYYMM): number {
    const total = this.getMonthlyCashIn(month).toMajor();
    if (total === 0) return 0;
    const equity = this.getForMonth(month)
      .filter((f) => f.isEquity)
      .reduce((sum, f) => sum.add(f.amount), MajikMoney.zero(this.currency))
      .toMajor();
    return equity / total;
  }

  /* ---------- Sorting & Grouping ---------- */

  /**
   * Sort funding events by field.
   * @param by Field to sort by ("name", "amount", "type", "month")
   * @param descending Whether to sort in descending order
   * @returns Sorted array of FundingEvent
   */
  sort(
    by: "name" | "amount" | "type" | "month",
    descending = false
  ): FundingEvent[] {
    const sorted = [...this.fundingEvents].sort((a, b) => {
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
        case "month":
          return a.month.localeCompare(b.month);
      }
    });
    return descending ? sorted.reverse() : sorted;
  }

  /**
   * Group funding events by type.
   * @returns Record mapping FundingType -> FundingEvent[]
   */
  groupByType(): Record<FundingType, FundingEvent[]> {
    return this.fundingEvents.reduce((acc, f) => {
      acc[f.type] = acc[f.type] || [];
      acc[f.type].push(f);
      return acc;
    }, {} as Record<FundingType, FundingEvent[]>);
  }

  /* ---------- Analytics & Forecast ---------- */

  /**
   * Monthly funding growth rate.
   * @param months Array of YYYY-MM months
   * @returns Record mapping month -> growth percentage (0-1)
   */
  monthlyGrowthRate(months: YYYYMM[]): Record<YYYYMM, number> {
    const growth: Record<YYYYMM, number> = {};
    let prev = MajikMoney.zero(this.currency);
    for (const month of months) {
      const current = this.getMonthlyCashIn(month);
      growth[month] = prev.isZero()
        ? 0
        : current.divide(prev.toMajor()).toMajor();
      prev = current;
    }
    return growth;
  }

  /**
   * Monthly funding weights by type.
   * @param months Array of YYYY-MM months
   * @returns Record mapping month -> FundingType -> percentage of total
   */
  monthlyFundingWeights(
    months: YYYYMM[]
  ): Record<YYYYMM, Record<FundingType, number>> {
    const map: Record<YYYYMM, Record<FundingType, number>> = {};
    for (const month of months) {
      const total = this.getMonthlyCashIn(month).toMajor();
      const typesMap: Record<FundingType, number> = {
        [FundingType.Equity]: 0,
        [FundingType.Debt]: 0,
        [FundingType.Grant]: 0,
      };
      for (const f of this.getForMonth(month))
        typesMap[f.type] = f.amount.divide(total).toMajor();
      map[month] = typesMap;
    }
    return map;
  }

  /**
   * Project funding for future months including planned events.
   * @param months Array of YYYY-MM months
   * @param plannedEvents Array of planned FundingEvent
   * @returns Record mapping month -> total MajikMoney
   */
  projectFunding(
    months: YYYYMM[],
    plannedEvents: FundingEvent[]
  ): Record<YYYYMM, MajikMoney> {
    const map: Record<YYYYMM, MajikMoney> = {};
    for (const month of months) {
      const actual = this.getMonthlyCashIn(month);
      const projected = plannedEvents
        .filter((f) => f.month === month)
        .reduce((sum, f) => sum.add(f.amount), MajikMoney.zero(this.currency));
      map[month] = actual.add(projected);
    }
    return map;
  }

  /* ---------- Dashboard Utilities ---------- */

  /**
   * Get top N funding events by amount.
   * @param n Number of top events to return (default 5)
   * @returns Array of FundingEvent
   */
  getTopFunding(n: number = 5): FundingEvent[] {
    return [...this.fundingEvents]
      .sort(
        (a, b) =>
          b.amount.toMajorDecimal().toNumber() -
          a.amount.toMajorDecimal().toNumber()
      )
      .slice(0, n);
  }

  /**
   * Get funding events for a specific year.
   * @param year Year (e.g., 2025)
   * @returns Record mapping YYYY-MM -> FundingEvent[]
   */
  getFundingForYear(year: number): Record<YYYYMM, FundingEvent[]> {
    const result: Record<YYYYMM, FundingEvent[]> = {};
    for (let month = 1; month <= 12; month++) {
      const mm = month.toString().padStart(2, "0");
      const yyyymm: YYYYMM = `${year}-${mm}` as YYYYMM;
      const events = this.fundingEvents.filter((f) => f.month === yyyymm);
      if (events.length) result[yyyymm] = events;
    }
    return result;
  }

  /**
   * Generate funding alerts.
   * @param maxDebtRatio Maximum debt ratio allowed (default 0.5)
   * @param threshold Minimum cash-in expected for next month (default 1000)
   * @returns Array of alert strings
   */
  fundingAlerts(maxDebtRatio = 0.5, threshold = 1000): string[] {
    const alerts: string[] = [];
    if (this.checkDebtLimit(maxDebtRatio))
      alerts.push(`Debt exceeds ${maxDebtRatio * 100}% of total funding.`);

    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    const mm = (nextMonth.getMonth() + 1).toString().padStart(2, "0");
    const yyyymm: YYYYMM = `${nextMonth.getFullYear()}-${mm}` as YYYYMM;

    const nextMonthCashIn = this.getMonthlyCashIn(yyyymm);
    if (nextMonthCashIn.toMajor() < threshold)
      alerts.push(
        `Low or no funding expected for next month: ${nextMonthCashIn.toMajor()} ${
          this.currency
        }.`
      );

    const equityTotal = this.totalByTypeUntil(
      FundingType.Equity,
      yyyymm
    ).toMajor();
    if (equityTotal === 0) alerts.push("No equity funding raised yet.");
    return alerts;
  }

  /* ---------- Period ---------- */

  /**
   * Fully sets the Funding Manager period.
   * Replaces both start and end months.
   *
   * @param period - Period with startMonth and endMonth (YYYY-MM)
   * @throws Error if months are invalid or start is after end
   * @returns The current FundingManager instance (for chaining)
   *
   * NOTE:
   * Any existing funding events outside the new period
   * will be automatically removed.
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
    this.onPeriodChanged();
    return this;
  }

  /**
   * Updates part of the Funding Manager period.
   * Useful for UI-driven changes where only one bound is modified.
   * NOTE:
   * Any existing funding events outside the new period
   * will be automatically removed.
   * @param partial - Partial period update (startMonth and/or endMonth)
   * @throws Error if resulting period is invalid
   * @returns The current FundingManager instance (for chaining)
   */
  updatePeriod(partial: Partial<PeriodYYYYMM>): this {
    const nextPeriod: PeriodYYYYMM = {
      startMonth: partial.startMonth ?? this.period.startMonth,
      endMonth: partial.endMonth ?? this.period.endMonth,
    };

    return this.setPeriod(nextPeriod);
  }

  private removeFundingOutsidePeriod(): void {
    const { startMonth, endMonth } = this.period;

    this.fundingEvents = this.fundingEvents.filter(
      (f) => f.month >= startMonth && f.month <= endMonth
    );
  }

  private onPeriodChanged(): void {
    this.removeFundingOutsidePeriod();
    this.recalculateCache();
  }

  /* ---------- Validation & Clone ---------- */

  /**
   * Validates that all funding events have consistent currency.
   * @throws Error if any event has mismatched currency
   */
  validateCurrencyConsistency(): void {
    this.fundingEvents.forEach((f) => {
      if (f.amount.currency.code !== this.currency)
        throw new Error(
          `FundingEvent ${f.name} has mismatched currency: ${f.amount.currency.code}`
        );
    });
  }

  /**
   * Clone the FundingManager.
   * @param modifications Optional modifications (currency or fundingEvents)
   * @returns New FundingManager instance
   */
  clone(
    modifications?: Partial<{ currency: string; fundingEvents: FundingEvent[] }>
  ): FundingManager {
    return new FundingManager(
      modifications?.currency ?? this.currency,
      modifications?.fundingEvents ?? [...this.fundingEvents]
    );
  }

  /**
   * Merge another FundingManager into this one.
   * @param other Other FundingManager
   * @returns The FundingManager instance for chaining
   */
  merge(other: FundingManager): this {
    other.getAll().forEach((f) => this.add(f));
    return this;
  }

  /**
   * Merge funding events by name and type (aggregates amounts).
   * @returns The FundingManager instance for chaining
   */
  mergeByNameAndType(): this {
    const merged: Record<string, FundingEvent> = {};
    for (const f of this.fundingEvents) {
      const key = `${f.name}-${f.type}`;
      if (!merged[key]) merged[key] = f;
      else
        merged[key] = merged[key].withAmount(merged[key].amount.add(f.amount));
    }
    this.fundingEvents = Object.values(merged);
    this.recalculateCache();
    return this;
  }

  /**
   * Compare totals between this and another FundingManager.
   * @param other Other FundingManager
   * @returns Record mapping FundingType -> difference in MajikMoney
   */
  compareTotals(other: FundingManager): Record<FundingType, MajikMoney> {
    const diff: Record<FundingType, MajikMoney> = {
      [FundingType.Equity]: MajikMoney.zero(this.currency),
      [FundingType.Grant]: MajikMoney.zero(this.currency),
      [FundingType.Debt]: MajikMoney.zero(this.currency),
    };
    const thisBreakdown = this.fundingBreakdown();
    const otherBreakdown = other.fundingBreakdown();
    for (const type of Object.keys(diff) as FundingType[]) {
      diff[type] = thisBreakdown[type].subtract(otherBreakdown[type]);
    }
    return diff;
  }

  /** SUMMARY */

  private getFundingWithinPeriod(): FundingEvent[] {
    const { startMonth, endMonth } = this.period;
    return this.fundingEvents.filter(
      (f) => f.month >= startMonth && f.month <= endMonth
    );
  }

  private totalFundingAcrossPeriod(): MajikMoney {
    return this.getFundingWithinPeriod().reduce(
      (sum, f) => sum.add(f.amount),
      MajikMoney.zero(this.currency)
    );
  }

  private totalByTypeAcrossPeriod(type: FundingType): MajikMoney {
    return this.getFundingWithinPeriod()
      .filter((f) => f.type === type)
      .reduce((sum, f) => sum.add(f.amount), MajikMoney.zero(this.currency));
  }

  private averageMonthlyFundingAcrossPeriod(): MajikMoney {
    const { startMonth, endMonth } = this.period;

    const months = monthsInPeriod(startMonth, endMonth);

    if (months <= 0) return MajikMoney.zero(this.currency);

    return this.totalFundingAcrossPeriod().divide(months);
  }

  private recalculateCache(): void {
    const totalFunding = this.totalFundingAcrossPeriod();
    const totalDebt = this.totalByTypeAcrossPeriod(FundingType.Debt);
    const totalEquity = this.totalByTypeAcrossPeriod(FundingType.Equity);
    const totalGrant = this.totalByTypeAcrossPeriod(FundingType.Grant);

    this._cache = {
      totalFundingAcrossPeriod: totalFunding,
      averageMonthlyFunding: this.averageMonthlyFundingAcrossPeriod(),

      totalEquityAcrossPeriod: totalEquity,
      totalDebtAcrossPeriod: totalDebt,
      totalGrantAcrossPeriod: totalGrant,

      debtRatio: totalFunding.isZero() ? 0 : totalDebt.ratio(totalFunding),

      nonRepayableRatio: totalFunding.isZero()
        ? 0
        : totalEquity.add(totalGrant).ratio(totalFunding),

      fundingEventCount: this.getFundingWithinPeriod().length,
    };

    this._debtSchedules = Object.fromEntries(
      this.getDebt().map((d) => [d.id, d.generateAmortizationSchedule()])
    );
  }

  getDashboardSnapshot(): FundingManagerSnapshot {
    return {
      totalFunding: this.totalFundingAcrossPeriodCached,
      totalEquity: this.totalEquityAcrossPeriodCached,
      totalDebt: this.totalDebtAcrossPeriodCached,
      totalGrant: this.totalGrantAcrossPeriodCached,
      debtRatio: this.debtRatioCached,
      fundingEventCount: this.fundingEventCountCached,
      outstandingDebt: this.getTotalOutstandingDebtAcrossPeriod(),
      nonRepayableRatio: this.nonRepayableRatioCached,
      totalNonRepayable: this.totalNonRepayable(),
    };
  }

  /* ---------- Plotly for Charts and Graphs ---------- */

  /**
   * Generate time series traces for each funding type over a period.
   * @param months Array of months (YYYY-MM)
   * @returns FundingTimeSeriesTrace[]
   */
  generateFundingTimeSeries(
    months?: YYYYMM[],
    colors: string[] = [
      DEFAULT_COLORS.green,
      DEFAULT_COLORS.red,
      DEFAULT_COLORS.blue,
    ]
  ): FundingTimeSeriesTrace[] {
    const periodMonths =
      months ??
      monthsArrayInPeriod(this.period.startMonth, this.period.endMonth);

    const types: FundingType[] = [
      FundingType.Equity,
      FundingType.Debt,
      FundingType.Grant,
    ];
    const markerColors: Record<FundingType, string> = {
      [FundingType.Equity]: colors[2],
      [FundingType.Debt]: colors[1],
      [FundingType.Grant]: colors[0],
    };

    return types.map((type) => ({
      type: "scatter",
      mode: "lines+markers",
      name: type,
      x: periodMonths,
      y: periodMonths.map((month) =>
        this.getForMonth(month)
          .filter((f) => f.type === type)
          .reduce((sum, f) => sum + f.amount.toMajor(), 0)
      ),
      marker: { color: markerColors[type] },
      hovertemplate: `${type}: %{y} ${this.currency}<extra></extra>`,
      line: { shape: "spline", smoothing: 0.5, width: 2 },
    }));
  }

  /**
   * Generate bar chart traces for each funding type per month
   * @param months Array of months (YYYY-MM)
   * @returns FundingBarChartTrace[]
   */
  generateFundingBarChart(months?: YYYYMM[]): FundingBarChartTrace[] {
    const periodMonths =
      months ??
      monthsArrayInPeriod(this.period.startMonth, this.period.endMonth);

    const types: FundingType[] = [
      FundingType.Equity,
      FundingType.Debt,
      FundingType.Grant,
    ];
    const colors: Record<FundingType, string> = {
      [FundingType.Equity]: "#1f77b4",
      [FundingType.Debt]: "#ff7f0e",
      [FundingType.Grant]: "#2ca02c",
    };

    return types.map((type) => ({
      type: "bar",
      name: type,
      x: periodMonths,
      y: periodMonths.map((month) =>
        this.getForMonth(month)
          .filter((f) => f.type === type)
          .reduce((sum, f) => sum + f.amount.toMajor(), 0)
      ),
      marker: { color: colors[type] },
      hovertemplate: `%{x}: %{y} ${this.currency}<extra></extra>`,
    }));
  }

  /**
   * Generate pie chart for total funding by type across period
   * @returns FundingPieChartTrace
   */
  generateFundingPieChart(): FundingPieChartTrace {
    const breakdown = this.fundingBreakdown();
    const labels = Object.keys(breakdown) as FundingType[];
    const values = labels.map((type) => breakdown[type].toMajor());
    const colors: Record<FundingType, string> = {
      [FundingType.Equity]: "#1f77b4",
      [FundingType.Debt]: "#ff7f0e",
      [FundingType.Grant]: "#2ca02c",
    };

    return {
      type: "pie",
      labels,
      values,
      marker: { color: labels.map((type) => colors[type]) },
      hovertemplate: "%{label}: %{value} " + this.currency + "<extra></extra>",
    };
  }

  /* ---------- Export ---------- */

  /**
   * Export funding events to CSV string.
   * @returns CSV formatted string
   */
  toCSV(): string {
    const header = "ID,Name,Type,Amount,Currency,Month";
    const rows = this.fundingEvents.map(
      (f) =>
        `${f.id},${f.name},${f.type},${f.amount.toMajorDecimal().toNumber()},${
          f.amount.currency.code
        },${f.month}`
    );
    return [header, ...rows].join("\n");
  }

  /**
   * Converts the current FundingManager object to a plain JavaScript object (JSON).
   * @returns {FundingManagerJSON} - The plain object representation of the FundingManager instance.
   */
  toJSON(): FundingManagerJSON {
    const preJSON = {
      currency: this.currency,
      fundingEvents: this.fundingEvents.map((f) => f.toJSON()),
      period: this.period,
    };

    const serializedMoney: FundingManagerJSON = serializeMoney(preJSON);

    return serializedMoney;
  }

  /**
   * Static method to parse a JSON string or object into a `FundingManager` instance.
   *
   * @param json - A JSON string or plain object to be parsed.
   * @returns {FundingManager} - A new FundingManager instance based on the parsed JSON.
   * @throws Will throw an error if required properties are missing.
   */

  static parseFromJSON(json: string | FundingManagerJSON): FundingManager {
    // If the input is a string, parse it as JSON
    const parsedData: FundingManagerJSON =
      typeof json === "string"
        ? JSON.parse(json)
        : structuredClone
        ? structuredClone(json)
        : JSON.parse(JSON.stringify(json));

    const fundingEvents =
      parsedData.fundingEvents?.map((e) => FundingEvent.parseFromJSON(e)) || [];
    return new FundingManager(
      parsedData.currency,
      fundingEvents,
      parsedData?.period
    );
  }
}
