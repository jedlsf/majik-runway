import { MajikMoney, MajikMoneyJSON } from "@thezelijah/majik-money";
import { ExpenseBreakdown } from "./expenses/expense-breakdown";
import { RevenueStream, RevenueItem } from "./revenue";
import { Cashflow, CashflowTaxes } from "./cashflow";
import { ProjectionEngine } from "./engine";
import { BusinessModelType, Recurrence, VATMode } from "./enums";
import {
  BalanceSnapshot,
  BusinessModel,
  DashboardSnapshot,
  ExpenseBreakdownSnapshot,
  FundingID,
  FundingManagerSnapshot,
  HealthSeverity,
  MajikRunwayJSON,
  PeriodYYYYMM,
  RevenueID,
  RunwayHealth,
  YYYYMM,
} from "./types/types";
import { ScenarioOverride } from "./types/scenario";
import { Expense } from "./expenses/expense";
import { TaxConfig } from "./types/tax";
import { FundingEvent } from "./funding/funding";
import { FundingManager } from "./funding/funding-manager";
import { MajikProduct } from "@thezelijah/majik-product";
import { MajikService } from "@thezelijah/majik-service";
import { MajikSubscription } from "@thezelijah/majik-subscription";
import {
  autogenerateID,
  dateToYYYYMM,
  DEFAULT_COLORS,
  isValidYYYYMM,
  monthsInPeriod,
  offsetMonthsToYYYYMM,
} from "./utils";
import { BarChartTrace } from "./types/plotly";

/**
 * MajikRunway is the central financial engine of a business.
 * It orchestrates expenses, revenues, funding, taxes, cashflows, and projections.
 *
 * It is designed for **chaining operations**, e.g.:
 * ```ts
 * runway.addExpense(exp).addRevenue(product).calculateRunway();
 * ```
 */
export class MajikRunway {
  private model: BusinessModel;
  readonly id: string;

  /* ---------- Initialization / Factory ---------- */

  constructor(model: BusinessModel) {
    this.model = model;
    this.id = model?.id || autogenerateID("mjkrunway");
  }

  /**
   * Initialize a new MajikRunway instance with optional defaults.
   *
   * @param options - Partial BusinessModel to pre-fill the instance.
   *                  Useful for restoring from saved state or setting default values.
   * @returns A fully initialized `MajikRunway` instance.
   */
  public static initialize(options?: Partial<BusinessModel>): MajikRunway {
    const defaultCurrency = options?.money?.currency?.code ?? "PHP";
    const defaultMoney = options?.money ?? MajikMoney.zero(defaultCurrency);

    const fundingManager = new FundingManager(defaultCurrency);

    const model: BusinessModel = {
      money: defaultMoney,
      expenses: options?.expenses ?? new ExpenseBreakdown(defaultCurrency),
      revenues: options?.revenues ?? new RevenueStream(defaultCurrency),
      taxConfig: options?.taxConfig ?? {
        vatMode: VATMode.NON_VAT,
        vatRate: 0,
        percentageTaxRate: 0,
        incomeTaxRate: 0,
      },
      funding: options?.funding ?? fundingManager,
      type: options?.type || BusinessModelType.Hybrid,
      period: {
        startMonth: options?.period?.startMonth || dateToYYYYMM(new Date()),
        endMonth:
          options?.period?.endMonth ||
          offsetMonthsToYYYYMM(dateToYYYYMM(new Date()), 23),
      },
    };

    return new MajikRunway(model);
  }

  get currency(): string {
    return this.model.money.currency.code || "PHP";
  }

  get isTaxEnabled(): boolean {
    const config = this.model.taxConfig;

    if (!config) return false;

    // Income tax is enabled if rate is set and > 0
    const hasIncomeTax = !!config.incomeTaxRate && config.incomeTaxRate > 0;

    // VAT is enabled if mode is VAT and rate is > 0
    const hasVAT =
      config.vatMode === VATMode.VAT && !!config.vatRate && config.vatRate > 0;

    // Percentage tax is enabled if mode is non-VAT and rate is > 0
    const hasPercentageTax =
      config.vatMode === VATMode.NON_VAT &&
      !!config.percentageTaxRate &&
      config.percentageTaxRate > 0;

    return hasIncomeTax || hasVAT || hasPercentageTax;
  }

  get period(): PeriodYYYYMM {
    return this.model.period;
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

    this.model.period = { startMonth, endMonth };
    this.model.revenues.setPeriod(period);
    this.model.expenses.setPeriod(period);
    this.model.funding.setPeriod(period);
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
      startMonth: partial.startMonth ?? this.model.period.startMonth,
      endMonth: partial.endMonth ?? this.model.period.endMonth,
    };

    return this.setPeriod(nextPeriod);
  }

  /* ---------- Model Access / Serialization ---------- */

  /**
   * Get a deep clone of the internal business model.
   *
   * @remarks
   * Safe for external inspection without mutating internal state.
   *
   * @returns A deep copy of the current `BusinessModel`.
   */
  public getModel(): BusinessModel {
    return JSON.parse(JSON.stringify(this.model));
  }

  public revenueStream(): RevenueStream {
    return this.model.revenues;
  }

  public expenseBreakdown(): ExpenseBreakdown {
    return this.model.expenses;
  }

  public funding(): FundingManager {
    return this.model.funding;
  }

  public taxConfig(): TaxConfig {
    return this.model.taxConfig;
  }

  /**
   * Serialize the entire model into JSON.
   *
   * @returns An object representing the full state of the runway,
   * including money, expenses, revenues, tax configuration, and funding events.
   */
  public toJSON(): MajikRunwayJSON {
    return {
      money: this.model.money.toJSON(),
      expenses: this.model.expenses.toJSON(),
      revenues: this.model.revenues.toJSON(),
      taxConfig: this.model.taxConfig,
      funding: this.model.funding.toJSON(),
      type: this.model.type,
      period: this.model.period,
      id: this.id,
    };
  }

  /**
   * Static method to parse a JSON string or object into a `MajikRunway` instance.
   *
   * @param json - A JSON string or plain object to be parsed.
   * @returns {MajikRunway} - A new MajikRunway instance based on the parsed JSON.
   * @throws Will throw an error if required properties are missing.
   */

  static parseFromJSON(json: string | MajikRunwayJSON): MajikRunway {
    // If the input is a string, parse it as JSON
    const rawParse: MajikRunwayJSON =
      typeof json === "string"
        ? JSON.parse(json)
        : structuredClone
        ? structuredClone(json)
        : JSON.parse(JSON.stringify(json));

    const model: BusinessModel = {
      money: MajikMoney.parseFromJSON(
        rawParse.money as unknown as MajikMoneyJSON
      ),
      expenses: ExpenseBreakdown.parseFromJSON(rawParse.expenses),
      revenues: RevenueStream.parseFromJSON(rawParse.revenues),
      taxConfig: rawParse.taxConfig,
      funding: FundingManager.parseFromJSON(rawParse.funding),
      type: rawParse.type || BusinessModelType.Hybrid,
      period: {
        startMonth: rawParse.period.startMonth || dateToYYYYMM(new Date()),
        endMonth:
          rawParse.period.endMonth ||
          offsetMonthsToYYYYMM(dateToYYYYMM(new Date()), 23),
      },
      id: rawParse?.id,
    };

    return new MajikRunway(model);
  }

  /* ---------- Model Update / Validation ---------- */

  /**
   * Update the model partially while preserving class instances.
   * @param update Partial model to merge
   * @returns this for chaining
   */
  public updateModel(update: Partial<BusinessModel>): this {
    if (update.money) this.model.money = update.money;
    if (update.expenses) this.model.expenses = update.expenses;
    if (update.revenues) this.model.revenues = update.revenues;
    if (update.taxConfig) this.model.taxConfig = update.taxConfig;
    if (update.funding) this.model.funding = update.funding;
    if (update.type) this.model.type = update.type;
    return this;
  }

  public setBusinessModelType(type: BusinessModelType): this {
    if (!type?.trim()) {
      throw new Error("Invalid type");
    }

    if (!Object.values(BusinessModelType).includes(type)) {
      throw new Error("Invalid Product type.");
    }

    this.model.type = type;
    return this;
  }

  /**
   * Update the initial cash amount (opening balance).
   *
   * @param cash - New initial cash amount to set. Can be a `MajikMoney` instance or a raw number (which will be converted using the current currency).
   * @returns Chainable `MajikRunway` instance
   */
  public updateInitialCash(cash: MajikMoney | number): this {
    this.model.money =
      typeof cash === "number"
        ? MajikMoney.fromMajor(cash, this.currency)
        : cash;
    return this;
  }

  /**
   * Ensure all monetary objects use the same currency.
   *
   * @throws {Error} If any mismatch in currency is detected.
   */
  public validateCurrencyConsistency(): void {
    this.model.expenses.validateCurrencyConsistency();
    this.model.revenues.validateCurrencyConsistency();
    this.model.funding.validateCurrencyConsistency();

    if (this.model.money.currency.code !== this.model.expenses.currency)
      throw new Error("Model money currency does not match expenses currency");
    if (this.model.money.currency.code !== this.model.revenues.currency)
      throw new Error("Model money currency does not match revenues currency");
  }

  /* ---------- Expense Management ---------- */

  /**
   * Add an existing expense instance to the model.
   *
   * @param expense - An instance of `Expense`.
   * @returns The current instance (chainable).
   */
  public addExpense(expense: Expense): this {
    this.model.expenses.add(expense);
    return this;
  }

  /**
   * Updates an expense item by its ID.
   * @param id - ID of the item to update
   * @param updated - Updated expense item
   * @throws Error if the item is not found
   * @returns Chainable `MajikRunway` instance
   */
  public updateExpenseItem(id: RevenueID, updated: Expense): this {
    this.model.expenses.update(id, updated);
    return this;
  }

  /**
   * Add a recurring expense.
   *
   * @param name - Expense name
   * @param amount - Amount in the specified currency
   * @param currency - Currency code (defaults to model currency)
   * @param recurrence - Recurrence type (default: monthly)
   * @param isTaxDeductible - Whether expense is deductible (default: true)
   * @param id - Optional unique identifier
   * @returns Chainable `MajikRunway` instance
   */
  public addRecurringExpense(
    name: string,
    amount: number,
    currency: string = this.model.expenses.currency,
    recurrence: Recurrence = Recurrence.Monthly,
    isTaxDeductible: boolean = true,
    id?: string
  ): this {
    this.model.expenses.addRecurring(
      name,
      amount,
      currency,
      recurrence,
      isTaxDeductible,
      this.model.period,
      id
    );
    return this;
  }

  /**
   * Add a one-time expense for a specific month.
   *
   * @param name - Expense name
   * @param amount - Amount in specified currency
   * @param currency - Currency code (default: model currency)
   * @param month - Month of expense in YYYY-MM format
   * @param isTaxDeductible - Whether expense is deductible (default: true)
   * @param id - Optional unique identifier
   * @returns Chainable `MajikRunway` instance
   */
  public addOneTimeExpense(
    name: string,
    amount: number,
    currency: string = this.model.expenses.currency,
    month: YYYYMM,
    isTaxDeductible: boolean = true,
    id?: string
  ): this {
    this.model.expenses.addOneTime(
      name,
      amount,
      currency,
      month,
      isTaxDeductible,
      id
    );
    return this;
  }

  /**
   * Add a capital expense (with optional depreciation).
   *
   * @param name - Expense name
   * @param amount - Amount in specified currency
   * @param depreciationMonths - Number of months to depreciate
   * @param currency - Currency code (default: model currency)
   * @param month Month in YYYYMM format
   * @param residualValue - Optional residual value after depreciation
   * @param isTaxDeductible - Whether expense is deductible (default: true)
   * @param id - Optional unique identifier
   * @returns Chainable `MajikRunway` instance
   */
  public addCapitalExpense(
    name: string,
    amount: number,
    depreciationMonths: number,
    currency: string = this.model.expenses.currency,
    month: YYYYMM,
    residualValue?: number,
    isTaxDeductible: boolean = true,
    id?: string
  ): this {
    this.model.expenses.addCapital(
      name,
      amount,
      depreciationMonths,
      currency,
      month,
      residualValue,
      isTaxDeductible,
      id
    );
    return this;
  }

  /* ---------- Revenue Management ---------- */

  /**
   * Add a revenue item.
   *
   * @param item - RevenueItem instance (product, service, subscription, etc.)
   * @returns Chainable `MajikRunway` instance
   */
  public addRevenue(item: RevenueItem): this {
    this.model.revenues.addItem(item);
    return this;
  }

  /**
   * Updates a revenue item by its ID.
   * @param id - ID of the item to update
   * @param updated - Updated revenue item (`MajikProduct`, `MajikService` or `MajikSubscription`)
   * @throws Error if the item is not found
   * @returns Chainable `MajikRunway` instance
   */
  public updateRevenueItem(id: RevenueID, updated: RevenueItem): this {
    updated.validateSelf(true);
    this.model.revenues.updateItem(id, updated);
    return this;
  }

  /**
   * Add a product to the revenue stream.
   *
   * @param data - Fully initialized `MajikProduct` instance
   * @throws Error if product validation fails
   * @returns Chainable `MajikRunway` instance
   */
  public addProduct(data: MajikProduct): this {
    data.validateSelf(true);
    this.model.revenues.addProduct(data);
    return this;
  }

  /**
   * Add a service to the revenue stream.
   *
   * @param data - Fully initialized `MajikService` instance
   * @throws Error if service validation fails
   * @returns Chainable `MajikRunway` instance
   */
  public addService(data: MajikService): this {
    data.validateSelf(true);
    this.model.revenues.addService(data);
    return this;
  }

  /**
   * Add a subscription to the revenue stream.
   *
   * @param data - Fully initialized `MajikSubscription` instance
   * @throws Error if subscription validation fails
   * @returns Chainable `MajikRunway` instance
   */
  public addSubscription(data: MajikSubscription): this {
    data.validateSelf(true);
    this.model.revenues.addSubscription(data);
    return this;
  }

  /**
   * Get revenue items filtered by type.
   *
   * @template T - RevenueItem type
   * @param ctor - Constructor of the type to filter (e.g., MajikProduct)
   * @returns Array of revenue items matching the type
   */

  public getRevenueByType<T extends RevenueItem>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ctor: new (...args: any[]) => T
  ): T[] {
    return this.model.revenues.getByType(ctor);
  }

  /* ---------- Funding Management ---------- */

  /**
   * Add a generic funding event.
   *
   * @param event - A fully initialized `FundingEvent` instance
   * @returns Chainable `MajikRunway` instance
   */
  public addFundingEvent(event: FundingEvent): this {
    this.model.funding.add(event);
    return this;
  }

  /**
   * Updates a funding event by its ID.
   * @param id - ID of the item to update
   * @param updated - Updated funding event
   * @throws Error if the item is not found
   * @returns Chainable `MajikRunway` instance
   */
  public updateFundingEvent(id: FundingID, updated: FundingEvent): this {
    this.model.funding.update(id, updated);
    return this;
  }

  /**
   * Quickly create and add an equity funding event.
   * @param name Name of the funding event
   * @param amount Amount of funding
   * @param month YYYY-MM formatted month
   * @param currency Optional currency, defaults to manager currency
   * @param id Optional FundingID
   * @returns The created FundingEvent
   */
  public addEquity(
    name: string,
    amount: number,
    month: YYYYMM = this.getCurrentMonth(),
    id?: string
  ): this {
    this.model.funding.addEquity(
      name,
      amount,
      month,
      this.model.money.currency.code,
      id
    );
    return this;
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
  public addDebt(
    name: string,
    amount: number,
    month: YYYYMM = this.getCurrentMonth(),
    maturityDate: string,
    currency: string = "PHP",
    interestRate: number = 0,
    initialPayment: number = 0,
    id?: string
  ): this {
    this.model.funding.addDebt(
      name,
      amount,
      month,
      maturityDate,
      currency,
      interestRate,
      initialPayment,
      id
    );
    return this;
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
  public addGrant(
    name: string,
    amount: number,
    month: YYYYMM = this.getCurrentMonth(),
    id?: string
  ): this {
    this.model.funding.addGrant(
      name,
      amount,
      month,
      this.model.money.currency.code,
      id
    );
    return this;
  }

  /* ---------- Removal Methods ---------- */

  /**
   * Remove an expense by its unique ID.
   *
   * @param id - The unique identifier of the expense to remove.
   * @returns Chainable `MajikRunway` instance
   */
  public removeExpenseByID(id: string): this {
    this.model.expenses.remove(id);
    return this;
  }

  /**
   * Remove a revenue item by its unique ID.
   *
   * @param id - The unique identifier of the revenue item to remove.
   * @returns Chainable `MajikRunway` instance
   */
  public removeRevenueByID(id: string): this {
    this.model.revenues.remove(id);
    return this;
  }

  /**
   * Remove a funding event by its unique ID.
   *
   * @param id - The unique identifier of the funding event to remove.
   * @returns Chainable `MajikRunway` instance
   */
  public removeFundingByID(id: string): this {
    this.model.funding.remove(id);
    return this;
  }

  /* ---------- Tax Configuration ---------- */

  /**
   * Update tax configuration partially.
   *
   * @param taxConfig - Partial tax config (VAT, income tax, etc.)
   * @returns Chainable `MajikRunway` instance
   */
  public updateTaxConfig(taxConfig: Partial<TaxConfig>): this {
    this.model.taxConfig = { ...this.model.taxConfig, ...taxConfig };
    return this;
  }

  /* ---------- Cashflow & Projections ---------- */

  /**
   * Generate monthly cashflows for projection.
   *
   * @param months - Number of months to generate (default 12)
   * @param startMonth - Optional start month in YYYY-MM format
   * @param plannedFunding - Optional additional funding events
   * @param includeTaxes - Whether to include taxes in the cashflow (default false)
   * @returns Array of `Cashflow` objects
   */
  public generateMonthlyCashflow(
    months: number = 12,
    startMonth?: YYYYMM,
    plannedFunding: FundingEvent[] = [],
    includeTaxes: boolean = false
  ): Cashflow[] {
    let cashflows = ProjectionEngine.generateMonthlyCashflow(
      this.model,
      months,
      startMonth,
      includeTaxes
    );
    if (plannedFunding.length)
      cashflows = ProjectionEngine.projectFunding(cashflows, plannedFunding);
    return cashflows;
  }

  /**
   * Calculate runway in months until cash runs out.
   *
   * @param months - Months to project (default 24)
   * @param startMonth - Optional start month
   * @param plannedFunding - Optional funding events
   * @param overrides - Optional scenario overrides
   * @param includeTaxes - Include taxes in calculation (default false)
   * @returns Months of runway
   */
  public calculateRunway(
    months: number = 24,
    startMonth?: YYYYMM,
    plannedFunding: FundingEvent[] = [],
    overrides: ScenarioOverride[] = [],
    includeTaxes: boolean = false
  ): number {
    let cashflows = this.generateMonthlyCashflow(
      months,
      startMonth,
      plannedFunding,
      includeTaxes
    );
    if (overrides.length)
      cashflows = ProjectionEngine.simulateScenario(
        this.model,
        overrides,
        months
      );
    return ProjectionEngine.calculateRunway(cashflows);
  }

  /** Simulate scenario overrides */
  public simulateScenario(overrides: ScenarioOverride[]): Cashflow[] {
    return ProjectionEngine.simulateScenario(this.model, overrides);
  }

  /* ---------- Aggregations & Reports ---------- */

  public getTotalExpenses(): MajikMoney {
    return this.model.expenses.totalExpenses();
  }
  public getTotalDeductibleExpenses(): MajikMoney {
    return this.model.expenses.totalTaxDeductible();
  }
  public getTotalRecurringExpenses(): MajikMoney {
    return this.model.expenses.getTotalRecurring();
  }
  public getTotalRevenue(): MajikMoney {
    return this.model.revenues.getTotalRevenue();
  }
  public getTotalGrossProfit(): MajikMoney {
    return this.model.revenues.getTotalGrossProfit();
  }

  /** Monthly revenue series */
  public getMonthlyRevenueSeries(months: YYYYMM[]): Record<string, MajikMoney> {
    return this.model.revenues.getMonthlyRevenueSeries(months);
  }

  /** Monthly expenses series */
  public getMonthlyExpenses(months: YYYYMM[]): Record<string, MajikMoney> {
    const result: Record<string, MajikMoney> = {};
    months.forEach((month) => {
      result[month] = this.model.expenses.getMonthlyCashOut(month);
    });
    return result;
  }

  /** Get ending cash series for given months */
  public getMonthlyEndingCash(months: number = 12): Record<string, MajikMoney> {
    const cashflows = this.generateMonthlyCashflow(months);
    const series: Record<string, MajikMoney> = {};
    cashflows.forEach((cf) => {
      series[cf.month] = cf.endingCash;
    });
    return series;
  }

  public getMonthlyNetProfit(
    months: number = 12,
    startMonth?: YYYYMM
  ): Record<string, MajikMoney> {
    const cashflows = this.generateMonthlyCashflow(
      months,
      startMonth,
      [],
      true
    );
    const result: Record<string, MajikMoney> = {};
    cashflows.forEach((cf) => {
      const netAfterTax = cf.cashIn
        .subtract(cf.cashOut)
        .subtract(cf.taxes?.vat || MajikMoney.zero(cf.cashIn.currency.code))
        .subtract(
          cf.taxes?.percentageTax || MajikMoney.zero(cf.cashIn.currency.code)
        )
        .subtract(
          cf.taxes?.incomeTax || MajikMoney.zero(cf.cashIn.currency.code)
        );
      result[cf.month] = netAfterTax;
    });
    return result;
  }

  /** Get total taxes (VAT + percentage tax + income tax) over a period */
  public getTotalTaxes(
    months: number = 12,
    startMonth?: YYYYMM
  ): CashflowTaxes {
    const cashflows = this.generateMonthlyCashflow(
      months,
      startMonth,
      [],
      true
    ); // includeTaxes=true
    const currency = this.model.money.currency.code;

    return cashflows.reduce(
      (totals, cf) => {
        totals.vat = totals.vat.add(
          cf.taxes?.vat || MajikMoney.zero(cf.cashIn.currency.code)
        );
        totals.percentageTax = totals.percentageTax.add(
          cf.taxes?.percentageTax || MajikMoney.zero(cf.cashIn.currency.code)
        );
        totals.incomeTax = totals.incomeTax.add(
          cf.taxes?.incomeTax || MajikMoney.zero(cf.cashIn.currency.code)
        );
        return totals;
      },
      {
        vat: MajikMoney.zero(currency),
        percentageTax: MajikMoney.zero(currency),
        incomeTax: MajikMoney.zero(currency),
      }
    );
  }

  public getBalanceSnapshot(
    month: YYYYMM,
    months: number = 24
  ): BalanceSnapshot {
    const cashflows = this.generateMonthlyCashflow(months);
    return ProjectionEngine.generateBalanceSnapshot(
      this.model,
      month,
      cashflows
    );
  }

  public getRunwayRemainingMonths(
    plannedFunding: FundingEvent[] = [],
    includeTaxes: boolean = false
  ): number {
    return this.calculateRunway(
      monthsInPeriod(this.model.period.startMonth, this.model.period.endMonth),
      this.model.period.startMonth,
      plannedFunding,
      [],
      includeTaxes
    );
  }

  public getCashOnHand(): MajikMoney {
    return this.model.money;
  }

  public getCashOnHandAt(month: YYYYMM): MajikMoney {
    const snapshot = this.getBalanceSnapshot(month);
    return snapshot.cash;
  }

  public getAverageNetMonthlyBurn(): MajikMoney {
    const cashflows = this.generateMonthlyCashflow(
      monthsInPeriod(this.model.period.startMonth, this.model.period.endMonth),
      this.model.period.startMonth
    );
    const currency = this.model.money.currency.code;

    if (!cashflows.length) return MajikMoney.zero(currency);

    const totalNet = cashflows.reduce(
      (sum, cf) => sum.add(cf.cashOut.subtract(cf.cashIn)),
      MajikMoney.zero(currency)
    );

    return totalNet.divide(cashflows.length);
  }

  public getProjectedRevenueNextMonth(): MajikMoney {
    const nextMonth = offsetMonthsToYYYYMM(dateToYYYYMM(new Date()), 1);
    return this.model.revenues.getMonthlyRevenue(nextMonth);
  }

  public getProjectedRevenueForMonth(month: YYYYMM): MajikMoney {
    return this.model.revenues.getMonthlyRevenue(month);
  }

  public getBreakEvenMonth(): YYYYMM | null {
    const cashflows = this.generateMonthlyCashflow(
      monthsInPeriod(this.model.period.startMonth, this.model.period.endMonth),
      this.model.period.startMonth,
      [],
      true
    );

    for (const cf of cashflows) {
      const net = cf.cashIn.subtract(cf.cashOut);
      if (!net.isNegative()) {
        return cf.month;
      }
    }

    return null;
  }

  public getLastRevenueGrowthMoM(): number | null {
    return this.model.revenues.getLastRevenueGrowthMoM();
  }

  public getRevenueGrowthRateCMGR(): number | null {
    return this.model.revenues.getRevenueGrowthRateCMGR();
  }

  public getBurnEfficiency(): number | null {
    const cashflows = this.generateMonthlyCashflow(
      monthsInPeriod(this.model.period.startMonth, this.model.period.endMonth),
      this.model.period.startMonth,
      [],
      true
    );

    let revenue = MajikMoney.zero(this.model.money.currency.code);
    let burn = MajikMoney.zero(this.model.money.currency.code);

    for (const cf of cashflows) {
      revenue = revenue.add(cf.cashIn);

      const netBurn = cf.cashOut.subtract(cf.cashIn);
      if (netBurn.isPositive()) {
        burn = burn.add(netBurn);
      }
    }

    if (burn.isZero()) return null;

    return revenue.ratio(burn);
  }

  public getCashOutDate(): YYYYMM | null {
    const cashflows = this.generateMonthlyCashflow(
      monthsInPeriod(this.model.period.startMonth, this.model.period.endMonth),
      this.model.period.startMonth,
      [],
      true
    );

    const zero = MajikMoney.zero(this.model.money.currency.code);

    for (const cf of cashflows) {
      if (cf.endingCash.lessThanOrEqual(zero)) {
        return cf.month;
      }
    }

    return null;
  }

  /* ---------- ProjectionEngine Quick-Access Wrappers for Taxes & Profit ---------- */

  /** Generate monthly cashflows using ProjectionEngine */
  public projectCashflows(
    includeTaxes: boolean = false,
    plannedFunding: FundingEvent[] = []
  ): Cashflow[] {
    let cashflows = ProjectionEngine.generateMonthlyCashflow(
      this.model,
      monthsInPeriod(this.model.period.startMonth, this.model.period.endMonth),
      this.model.period.startMonth,
      includeTaxes
    );

    if (plannedFunding.length > 0) {
      cashflows = ProjectionEngine.projectFunding(cashflows, plannedFunding);
    }

    return cashflows;
  }

  /** Calculate runway from cashflows or model */
  public projectRunway(
    plannedFunding: FundingEvent[] = [],
    includeTaxes: boolean = false
  ): number {
    const cashflows = this.projectCashflows(includeTaxes, plannedFunding);

    return ProjectionEngine.calculateRunway(cashflows);
  }

  /** Get total taxes across a period */
  public getTotalTaxesAcrossPeriod(): CashflowTaxes {
    const cashflows = this.projectCashflows();
    return ProjectionEngine.getTotalTaxesAcrossPeriod(cashflows);
  }

  /** Get taxes for a specific month */
  public getTaxesForMonth(month: YYYYMM): CashflowTaxes {
    const cashflows = this.projectCashflows(true);
    return ProjectionEngine.getTaxesForMonth(cashflows, month);
  }

  /** Calculate EBITDA across a period */
  public getEBITDAAcrossPeriod(): MajikMoney {
    const cashflows = this.projectCashflows(false);
    return ProjectionEngine.getEBITDAAcrossPeriod(this.model, cashflows);
  }

  /** Calculate net income (after tax) across a period */
  public getNetIncomeAcrossPeriod(): MajikMoney {
    const cashflows = this.projectCashflows(true);
    return ProjectionEngine.getNetIncomeAcrossPeriod(this.model, cashflows);
  }

  public getRunwayHealth(): RunwayHealth {
    const reasons: string[] = [];
    let maxSeverity: HealthSeverity = "healthy";

    const severityRank: Record<HealthSeverity, number> = {
      healthy: 0,
      warning: 1,
      critical: 2,
    };

    const escalate = (severity: HealthSeverity, reason: string) => {
      reasons.push(reason);
      if (severityRank[severity] > severityRank[maxSeverity]) {
        maxSeverity = severity;
      }
    };

    const runway = this.getRunwayRemainingMonths([], true); // months
    const burn = this.getAverageNetMonthlyBurn(); // MajikMoney
    const growth = this.getLastRevenueGrowthMoM(); // decimal | null
    const efficiency = this.getBurnEfficiency(); // number | null
    const breakEvenMonth = this.getBreakEvenMonth(); // YYYYMM | null
    const avgRevenue = this.model.revenues.getAverageMonthlyRevenue(); // MajikMoney
    const avgExpenses = this.model.expenses.getAverageMonthlyExpense(); // MajikMoney

    /* ----------------------------- Critical checks ---------------------------- */

    if (runway !== null && runway <= 3) {
      escalate("critical", "Less than 3 months of runway remaining");
    }

    if (avgRevenue.isZero() && !avgExpenses.isZero()) {
      escalate("critical", "No revenue while expenses are ongoing");
    }

    if (burn.isPositive() && runway !== null && runway <= 6) {
      escalate("critical", "Burning cash with insufficient runway buffer");
    }

    /* ------------------------------ Warning checks ----------------------------- */

    if (runway !== null && runway <= 6 && runway > 3) {
      escalate("warning", "Runway is below 6 months");
    }

    if (growth !== null && growth < 0) {
      escalate("warning", "Revenue is declining month-over-month");
    }

    if (growth !== null && growth < 0 && runway !== null && runway <= 6) {
      escalate("warning", "Declining revenue combined with limited runway");
    }

    if (efficiency !== null && efficiency < 0.5) {
      escalate("warning", "Low burn efficiency relative to revenue generation");
    }

    if (!breakEvenMonth && burn.isPositive()) {
      escalate("warning", "No break-even point identified while burning cash");
    }

    /* ------------------------------ Healthy signals ---------------------------- */

    if (burn.isNegative()) {
      escalate("healthy", "Business is cash-flow positive");
    }

    if (burn.isNegative() && breakEvenMonth) {
      escalate(
        "healthy",
        "Business is profitable and break-even has been achieved"
      );
    }

    if (reasons.length === 0) {
      reasons.push(
        "Runway, burn, and revenue metrics are within safe thresholds"
      );
    }

    return {
      status: maxSeverity,
      reasons,
    };
  }

  public getDashboardSnapshot(): DashboardSnapshot {
    return {
      runwayMonths: this.getRunwayRemainingMonths(
        this.model.funding.getAll(),
        true
      ),
      cashOnHand: this.getCashOnHand(),
      avgNetBurn: this.getAverageNetMonthlyBurn(),
      nextMonthRevenue: this.getProjectedRevenueNextMonth(),
      breakEvenMonth: this.getBreakEvenMonth(),
      revenueGrowthRateMoM: this.getLastRevenueGrowthMoM(),
      revenueGrowthRateCMGR: this.getRevenueGrowthRateCMGR(),
      burnEfficiency: this.getBurnEfficiency(),
      cashOutDate: this.getCashOutDate(),
      runwayHealth: this.getRunwayHealth(),
      funding: this.getFundingSnapshot(),
      tax: this.getTotalTaxesAcrossPeriod(),
      ebitda: this.getEBITDAAcrossPeriod(),
      earningsAfterTax: this.getNetIncomeAcrossPeriod(),
    };
  }

  public getFundingSnapshot(): FundingManagerSnapshot {
    return this.model.funding.getDashboardSnapshot();
  }

  public getExpenseBreakdown(): ExpenseBreakdownSnapshot {
    return {
      recurring: this.model.expenses.cache.totalRecurring,
      oneTime: this.model.expenses.cache.totalOneTime,
      capital: this.model.expenses.cache.totalCapital,
    };
  }

  /**
   * Returns a Plotly bar chart trace array for monthly cashflows
   * using the current period of the runway.
   *
   * @param plannedFunding - Optional additional funding events
   * @param includeTaxes - Include taxes in cashOut (default false)
   * @param colors - Colors to use for the chart
   * @returns Plotly trace array for a bar chart
   */
  public getCashflowPlotlyBar(
    plannedFunding: FundingEvent[] = [],
    includeTaxes: boolean = this.isTaxEnabled,
    colors: string[] = [
      DEFAULT_COLORS.green,
      DEFAULT_COLORS.red,
      DEFAULT_COLORS.blue,
    ]
  ): BarChartTrace[] {
    const monthsCount = monthsInPeriod(
      this.model.period.startMonth,
      this.model.period.endMonth
    );

    const cashflows = this.generateMonthlyCashflow(
      monthsCount,
      this.model.period.startMonth,
      plannedFunding,
      includeTaxes
    );

    const xLabels = cashflows.map((cf) => cf.month);
    const cashInValues = cashflows.map((cf) => cf.cashIn.toMajor());
    const cashOutValues = cashflows.map((cf) => cf.cashOut.toMajor());
    const endingCashValues = cashflows.map((cf) => cf.endingCash.toMajor());

    const traces: BarChartTrace[] = [
      {
        type: "bar",
        name: "Cash In",
        x: xLabels,
        y: cashInValues,
        marker: { color: colors[0] }, // green
      },
      {
        type: "bar",
        name: "Cash Out",
        x: xLabels,
        y: cashOutValues,
        marker: { color: colors[1] }, // red
      },
      {
        type: "bar",
        name: "Ending Cash",
        x: xLabels,
        y: endingCashValues,
        marker: { color: colors[2] }, // blue
      },
    ];

    // Only add taxes trace if taxes are enabled
    if (includeTaxes) {
      const cashflowTaxes = cashflows.map((cf) => {
        if (!cf.taxes) return 0;
        return cf.taxes.incomeTax
          .add(cf.taxes.vat)
          .add(cf.taxes.percentageTax)
          .toMajor();
      });

      traces.push({
        type: "bar",
        name: "Taxes",
        x: xLabels,
        y: cashflowTaxes,
        marker: { color: colors[3] || DEFAULT_COLORS.white }, // Use 4th color or fallback
      });
    }

    return traces;
  }

  /* ---------- Utilities ---------- */

  /** Get current month in YYYY-MM format */
  private getCurrentMonth(): YYYYMM {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      "0"
    )}` as YYYYMM;
  }
}
