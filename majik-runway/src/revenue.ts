import { MajikMoney, serializeMoney } from "@thezelijah/majik-money";
import { MajikProduct, MajikProductJSON } from "@thezelijah/majik-product";
import { MajikService, MajikServiceJSON } from "@thezelijah/majik-service";
import {
  MajikSubscription,
  MajikSubscriptionJSON,
} from "@thezelijah/majik-subscription";

import {
  PeriodYYYYMM,
  RevenueID,
  RevenueStreamJSON,
  YYYYMM,
} from "./types/types";
import {
  dateToYYYYMM,
  isValidYYYYMM,
  monthsArrayInPeriod,
  monthsInPeriod,
  offsetMonthsToYYYYMM,
} from "./utils";
import { CapacityPeriodResizeMode } from "./enums";
import { PlotlyTrace, TimeSeriesTrace } from "./types/plotly";

// Union type of supported revenue items
export type RevenueItem = MajikProduct | MajikService | MajikSubscription;
export type RevenueItemJSON =
  | MajikProductJSON
  | MajikServiceJSON
  | MajikSubscriptionJSON;
/**
 * Manages a collection of revenue items (products, services, subscriptions)
 * and provides aggregation, filtering, sorting, and reporting utilities.
 *
 * Supports mixed revenue types within the same stream.
 * Intended for use in financial calculations, projections, and dashboard reporting.
 *
 * @template T Type of RevenueItem this stream manages (default: all RevenueItems)
 */
export class RevenueStream<T extends RevenueItem = RevenueItem> {
  /** List of revenue items in this stream */
  items: T[];

  /** Currency code for all revenue items (e.g., "PHP", "USD") */
  currency: string;

  period: PeriodYYYYMM;

  /**
   * Creates a new RevenueStream.
   *
   * @param currency - Currency code for the stream (default: "PHP")
   * @param items - Optional initial list of revenue items
   * @param period Optional start and end date
   */
  constructor(
    currency: string = "PHP",
    items: T[] = [],
    period?: PeriodYYYYMM
  ) {
    this.items = [...items];
    this.currency = currency;
    this.period = period || {
      startMonth: dateToYYYYMM(new Date()),
      endMonth: offsetMonthsToYYYYMM(dateToYYYYMM(new Date()), 23),
    };
  }

  /* ---------- Quick Add Shortcuts ---------- */

  /**
   * Adds an initialized MajikProduct to the revenue stream.
   *
   * @param data - A fully initialized MajikProduct instance.
   *               Use `MajikProduct.initialize()` to construct a valid product
   *               before adding it to the stream.
   * @throws Error if validation fails
   * @returns The current RevenueStream instance (for chaining)
   */
  addProduct(data: MajikProduct): this {
    data.validateSelf(true);
    this.addItem(data as T);
    return this;
  }

  /**
   * Adds an initialized MajikService to the revenue stream.
   *
   * @param data - A fully initialized MajikService instance.
   *               Use `MajikService.initialize()` to construct a valid service
   *               before adding it to the stream.
   * @throws Error if validation fails
   * @returns The current RevenueStream instance (for chaining)
   */
  addService(data: MajikService): this {
    data.validateSelf(true);
    this.addItem(data as T);
    return this;
  }

  /**
   * Adds an initialized MajikSubscription to the revenue stream.
   *
   * @param data - A fully initialized MajikSubscription instance.
   *               Use `MajikSubscription.initialize()` to construct a valid
   *               subscription before adding it to the stream.
   * @throws Error if validation fails
   * @returns The current RevenueStream instance (for chaining)
   */
  addSubscription(data: MajikSubscription): this {
    data.validateSelf(true);
    this.addItem(data as T);
    return this;
  }

  /* ---------- CRUD ---------- */

  /**
   * Adds a revenue item to the stream.
   * @param item - Revenue item to add
   * @returns The current RevenueStream instance (for chaining)
   */
  addItem(item: T): this {
    this.items.push(item);
    return this;
  }

  /**
   * Check if a revenue item exists by ID.
   * @param id RevenueID to check
   * @returns True if revenue item exists, false otherwise
   */
  doesExist(id: RevenueID): boolean {
    return this.items.some((e) => e.id === id);
  }

  /**
   * Removes a revenue item by its ID.
   * @param id - ID of the item to remove
   * @returns The current RevenueStream instance (for chaining)
   */
  remove(id: RevenueID): this {
    if (!this.doesExist(id)) {
      throw new Error(`Revenue item with ID ${id} does not exist`);
    }
    this.items = this.items.filter((i) => i.id !== id);
    return this;
  }

  /**
   * Removes all revenue items from the stream.
   * @returns The current RevenueStream instance (for chaining)
   */
  clear(): this {
    this.items.length = 0; // preserves reference, faster than reassignment
    return this;
  }

  /**
   * Updates a revenue item by its ID.
   * @param id - ID of the item to update
   * @param updated - Updated revenue item
   * @throws Error if the item is not found
   * @returns The current RevenueStream instance (for chaining)
   */
  updateItem(id: RevenueID, updated: T): this {
    const idx = this.items.findIndex((i) => i.id === id);
    if (idx === -1) throw new Error(`Revenue item with ID ${id} not found`);
    this.items[idx] = updated;
    return this;
  }

  /**
   * Gets a revenue item by its ID.
   * @param id - ID of the item
   * @returns The revenue item, or undefined if not found
   */
  getItemById(id: RevenueID): T | undefined {
    return this.items.find((i) => i.id === id);
  }

  /**
   * Returns all revenue items in the stream.
   * @returns A shallow copy of all items
   */
  getAll(): T[] {
    return [...this.items];
  }

  /* ---------- Aggregations ---------- */

  /**
   * Calculates the average monthly revenue across the entire period.
   * @returns Average monthly revenue as a MajikMoney instance
   */
  getAverageMonthlyRevenue(): MajikMoney {
    const totalMonths = monthsInPeriod(
      this.period.startMonth,
      this.period.endMonth
    );
    if (totalMonths <= 0) return MajikMoney.zero(this.currency);

    let totalRevenue = MajikMoney.zero(this.currency);

    for (let m = 0; m < totalMonths; m++) {
      const month = offsetMonthsToYYYYMM(this.period.startMonth, m);
      totalRevenue = totalRevenue.add(this.getMonthlyRevenue(month));
    }

    return totalRevenue.divide(totalMonths);
  }

  /**
   * Calculates the average monthly gross profit across the entire period.
   * @returns Average monthly gross profit as a MajikMoney instance
   */
  getAverageMonthlyGrossProfit(): MajikMoney {
    const totalMonths = monthsInPeriod(
      this.period.startMonth,
      this.period.endMonth
    );
    if (totalMonths <= 0) return MajikMoney.zero(this.currency);

    let totalProfit = MajikMoney.zero(this.currency);

    for (let m = 0; m < totalMonths; m++) {
      const month = offsetMonthsToYYYYMM(this.period.startMonth, m);
      // Sum gross profit for each item in the month
      const monthProfit = this.items.reduce(
        (sum, item) =>
          sum.add(item.getProfit?.(month) ?? MajikMoney.zero(this.currency)),
        MajikMoney.zero(this.currency)
      );
      totalProfit = totalProfit.add(monthProfit);
    }

    return totalProfit.divide(totalMonths);
  }

  /**
   * Calculates total gross revenue across all items in the stream.
   * @returns Total revenue as a MajikMoney instance
   */
  getTotalRevenue(): MajikMoney {
    return this.items.reduce(
      (total, item) => total.add(item.grossRevenue),
      MajikMoney.zero(this.currency)
    );
  }

  /**
   * Calculates total cogs/cos across all items in the stream.
   * @returns Total cost as a MajikMoney instance
   */
  getTotalCost(): MajikMoney {
    return this.items.reduce(
      (total, item) => total.add(item.grossCost),
      MajikMoney.zero(this.currency)
    );
  }

  /**
   * Calculates total gross profit across all items in the stream.
   * @returns Total gross profit as a MajikMoney instance
   */
  getTotalGrossProfit(): MajikMoney {
    return this.items.reduce(
      (total, item) => total.add(item.grossProfit),
      MajikMoney.zero(this.currency)
    );
  }

  /**
   * Calculates total revenue for a specific month.
   * @param month - Month in YYYY-MM format
   * @throws Error if month format is invalid
   * @returns Total revenue for the month as MajikMoney
   */
  getMonthlyRevenue(month: YYYYMM): MajikMoney {
    if (!isValidYYYYMM(month)) throw new Error("Invalid month");
    return this.items.reduce(
      (total, item) =>
        total.add(item.getRevenue(month) ?? MajikMoney.zero(this.currency)),
      MajikMoney.zero(this.currency)
    );
  }

  /**
   * Generates a revenue series for multiple months.
   * @param months - Array of months in YYYY-MM format
   * @returns Record mapping each month to its total revenue
   */
  getMonthlyRevenueSeries(months: YYYYMM[]): Record<YYYYMM, MajikMoney> {
    const series: Record<YYYYMM, MajikMoney> = {};
    months.forEach((month) => {
      series[month] = this.getMonthlyRevenue(month);
    });
    return series;
  }

  /**
   * Calculates revenue for an entire year, broken down by month.
   * @param year - Full year (e.g., 2025)
   * @returns Record mapping YYYY-MM to monthly revenue
   */
  getRevenueForYear(year: number): Record<YYYYMM, MajikMoney> {
    const result: Record<YYYYMM, MajikMoney> = {};
    for (let m = 1; m <= 12; m++) {
      const mm = m < 10 ? `0${m}` : `${m}`;
      const yyyymm: YYYYMM = `${year}-${mm}` as YYYYMM;
      result[yyyymm] = this.getMonthlyRevenue(yyyymm);
    }
    return result;
  }

  /**
   * Returns the **last month-over-month (MoM) revenue growth rate**.
   *
   * This compares the revenue of the final month in the period
   * against the immediately preceding month.
   *
   * Formula:
   *   (Revenue_end - Revenue_prev) / Revenue_prev
   *
   * Returns `null` if:
   * - The previous month's revenue is zero (to avoid division by zero)
   *
   * @returns Growth rate as a decimal (e.g. 0.12 = +12%), or null if undefined
   */
  getLastRevenueGrowthMoM(): number | null {
    const months = [
      offsetMonthsToYYYYMM(this.period.endMonth, -1),
      this.period.endMonth,
    ];

    const prev = this.getMonthlyRevenue(months[0]);
    const curr = this.getMonthlyRevenue(months[1]);

    if (prev.isZero()) return null;

    return curr.subtract(prev).ratio(prev);
  }

  /**
   * Returns the **Compound Monthly Growth Rate (CMGR)** of revenue
   * across the entire period.
   *
   * CMGR answers the question:
   * "If revenue grew at a constant monthly rate, what would that rate be
   * from the first month to the last month?"
   *
   * Formula:
   *   CMGR = (End / Start)^(1 / (months - 1)) - 1
   *
   * Where:
   * - `months` is the number of months in the period (inclusive)
   *
   * Returns `null` if:
   * - The period has fewer than 2 months
   * - The starting month's revenue is zero
   *
   * @returns Compound monthly growth rate as a decimal, or null if undefined
   */
  getRevenueGrowthRateCMGR(): number | null {
    const months = monthsInPeriod(this.period.startMonth, this.period.endMonth);

    if (months < 2) return null;

    const start = this.getMonthlyRevenue(this.period.startMonth);
    const end = this.getMonthlyRevenue(this.period.endMonth);

    if (start.isZero()) return null;

    const ratio = end.ratio(start);

    return Math.pow(ratio, 1 / (months - 1)) - 1;
  }

  /* ---------- Filters ---------- */

  /**
   * Filters items by their class type (e.g., MajikProduct, MajikService).
   * @template K - Type of RevenueItem to filter
   * @param ctor - Class constructor for the type to filter
   * @returns Array of items that are instances of the specified class
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getByType<K extends RevenueItem>(ctor: new (...args: any[]) => K): K[] {
    return this.items.filter((i) => i instanceof ctor) as unknown as K[];
  }

  /**
   * Returns the top N revenue items by gross revenue.
   * @param n - Number of top items to return (default: 5)
   * @returns Array of top revenue items
   */
  getTopRevenueItems(n: number = 5): T[] {
    return [...this.items]
      .sort(
        (a, b) =>
          b.grossRevenue.toMajorDecimal().toNumber() -
          a.grossRevenue.toMajorDecimal().toNumber()
      )
      .slice(0, n);
  }

  /* ---------- Period ---------- */

  /**
   * Fully sets the revenue stream period.
   * Replaces both start and end months.
   *
   * @param period - Period with startMonth and endMonth (YYYY-MM)
   * @throws Error if months are invalid or start is after end
   * @returns The current RevenueStream instance (for chaining)
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

    this.recomputeAllItemCapacities(startMonth, endMonth);

    return this;
  }

  /**
   * Updates part of the revenue stream period.
   * Useful for UI-driven changes where only one bound is modified.
   *
   * @param partial - Partial period update (startMonth and/or endMonth)
   * @throws Error if resulting period is invalid
   * @returns The current RevenueStream instance (for chaining)
   */
  updatePeriod(partial: Partial<PeriodYYYYMM>): this {
    const nextPeriod: PeriodYYYYMM = {
      startMonth: partial.startMonth ?? this.period.startMonth,
      endMonth: partial.endMonth ?? this.period.endMonth,
    };

    return this.setPeriod(nextPeriod);
  }

  private recomputeAllItemCapacities(
    start: YYYYMM,
    end: YYYYMM,
    mode: CapacityPeriodResizeMode = CapacityPeriodResizeMode.DEFAULT
  ): void {
    for (const item of this.items) {
      item.recomputeCapacityPeriod(start, end, mode);
    }
  }

  /* ---------- Sorting / Grouping ---------- */

  /**
   * Sorts items by name or revenue.
   * @param by - Field to sort by ("name" or "revenue")
   * @param descending - Whether to sort in descending order (default: false)
   * @returns Sorted array of items
   */
  sort(by: "name" | "revenue" = "name", descending: boolean = false): T[] {
    const sorted = [...this.items].sort((a, b) => {
      if (by === "name") return a.name.localeCompare(b.name);
      return (
        b.grossRevenue.toMajorDecimal().toNumber() -
        a.grossRevenue.toMajorDecimal().toNumber()
      );
    });
    if (descending) sorted.reverse();
    return sorted;
  }

  /**
   * Groups items by their class name (e.g., "MajikProduct", "MajikService").
   * @returns Record mapping type name to array of items
   */
  groupByType(): Record<string, RevenueItem[]> {
    return this.items.reduce((acc, item) => {
      const typeName = item.constructor.name;
      if (!acc[typeName]) acc[typeName] = [];
      acc[typeName].push(item);
      return acc;
    }, {} as Record<string, RevenueItem[]>);
  }

  /* ---------- Validation / Merge ---------- */

  /**
   * Ensures all items in the stream use the same currency as the stream.
   * @throws Error if any item has a different currency
   */
  validateCurrencyConsistency(): void {
    this.items.forEach((i) => {
      if (i.grossRevenue.currency.code !== this.currency) {
        throw new Error(
          `Item ${i.name} has a different currency: ${i.grossRevenue.currency.code}`
        );
      }
    });
  }

  /**
   * Merges another RevenueStream into this one.
   * @param other - Another RevenueStream instance
   * @returns The current RevenueStream instance (for chaining)
   */
  merge(other: RevenueStream<T>): this {
    other.getAll().forEach((i) => this.addItem(i));
    return this;
  }

  toMonthlyRevenueTraces(): TimeSeriesTrace[] {
    const months = Array.from(
      { length: monthsInPeriod(this.period.startMonth, this.period.endMonth) },
      (_, i) => offsetMonthsToYYYYMM(this.period.startMonth, i)
    );

    return [
      {
        x: months,
        y: months.map((m) => this.getMonthlyRevenue(m).toMajor()),
        type: "scatter",
        mode: "lines+markers",
        name: "Revenue",
        line: { shape: "spline", smoothing: 0.4, width: 3 },
        marker: { size: 6 },
        hovertemplate: "%{x}<br>₱%{y:,.2f}<extra></extra>",
      },
    ];
  }

  toRevenueByItemTraces(
    type: "bar" | "pie" = "bar"
  ): PlotlyTrace<string, number>[] {
    return [
      {
        x: this.items.map((i) => i.name),
        y: this.items.map((i) => i.grossRevenue.toMajor()),
        type,
        name: "Revenue by Item",
        hovertemplate: "%{x}<br>₱%{y:,.2f}<extra></extra>",
      },
    ];
  }

  toRevenueByTypeTraces(): PlotlyTrace<string, number>[] {
    const grouped = this.groupByType();

    return [
      {
        x: Object.keys(grouped),
        y: Object.values(grouped).map((items) =>
          items.reduce((sum, i) => sum + i.grossRevenue.toMajor(), 0)
        ),
        type: "pie",
        name: "Revenue by Type",
        hovertemplate: "%{label}<br>₱%{value:,.2f}<extra></extra>",
      },
    ];
  }

  toGrossMarginTrendTraces(): TimeSeriesTrace[] {
    const months = monthsArrayInPeriod(
      this.period.startMonth,
      this.period.endMonth
    );

    const margins = months.map((month) => {
      const revenue = this.items.reduce(
        (sum, item) => sum.add(item.getRevenue(month)),
        MajikMoney.zero(this.currency)
      );

      if (revenue.isZero()) return 0;

      const cogs = this.items.reduce(
        (sum, item) => sum.add(item.getCost(month)),
        MajikMoney.zero(this.currency)
      );

      const profit = revenue.subtract(cogs);

      return profit.ratio(revenue) * 100;
    });

    return [
      {
        x: months,
        y: margins,
        type: "scatter",
        mode: "lines+markers",
        name: "Gross Margin %",
        line: { shape: "spline", width: 3 },
        marker: { size: 6 },
        hovertemplate: "%{x}<br><b>Gross Margin</b>: %{y:.1f}%<extra></extra>",
      },
    ];
  }

  /**
   * Converts the current ExpenseBreakdown object to a plain JavaScript object (JSON).
   * @returns {object} - The plain object representation of the ExpenseBreakdown instance.
   */
  toJSON(): RevenueStreamJSON {
    const preJSON = {
      currency: this.currency,
      items: this.items.map((r) => r.toJSON()),
      period: this.period,
    };

    const serializedMoney: RevenueStreamJSON = serializeMoney(preJSON);

    return serializedMoney;
  }

  /**
   * Static method to parse a JSON string or object into a `RevenueStream` instance.
   *
   * @param json - A JSON string or plain object to be parsed.
   * @returns {RevenueStream} - A new RevenueStream instance based on the parsed JSON.
   * @throws Will throw an error if required properties are missing.
   */

  static parseFromJSON(json: string | RevenueStreamJSON): RevenueStream {
    // If the input is a string, parse it as JSON
    const parsedData: RevenueStreamJSON =
      typeof json === "string"
        ? JSON.parse(json)
        : structuredClone
        ? structuredClone(json)
        : JSON.parse(JSON.stringify(json));

    // Step 3: map each item to its proper RevenueItem class
    const items: RevenueItem[] = (parsedData.items || []).map(
      (item: RevenueItemJSON) => {
        switch (
          item.__type // assuming each MajikProduct/Service/Subscription has __type in their toJSON
        ) {
          case "MajikProduct":
            return MajikProduct.parseFromJSON(item);
          case "MajikService":
            return MajikService.parseFromJSON(item);
          case "MajikSubscription":
            return MajikSubscription.parseFromJSON(item);
          default:
            throw new Error(`Unknown RevenueItem type`);
        }
      }
    );

    return new RevenueStream(parsedData.currency, items, parsedData?.period);
  }
}

export const isMajikProduct = (item: RevenueItem): item is MajikProduct =>
  item.__type === "MajikProduct";

export const isMajikService = (item: RevenueItem): item is MajikService =>
  item.__type === "MajikService";

export const isMajikSubscription = (
  item: RevenueItem
): item is MajikSubscription => item.__type === "MajikSubscription";
