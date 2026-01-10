import {
  deserializeMoney,
  MajikMoney,
  serializeMoney,
} from "@thezelijah/majik-money";
import { CompoundingFrequency, FundingType } from "../enums";
import { FundingID, YYYYMM } from "../types/types";
import {
  autogenerateID,
  isoToYYYYMM,
  isValidYYYYMM,
  monthsInPeriod,
  offsetMonthsToYYYYMM,
  yyyyMMToISO,
} from "../utils";
import {
  AmortizationEntry,
  DebtMetadata,
  FundingEventJSON,
  FundingEventState,
  InstallmentEntry,
} from "./types";

/**
 * Represents a funding inflow event in MajikRunway.
 *
 * Immutable: all modifications return a new FundingEvent instance.
 */
export class FundingEvent {
  /**
   * Private constructor. Use static factories like `create()`, `debt()`, or `equity()`.
   * @param state The FundingEvent state
   */
  private constructor(private readonly state: Readonly<FundingEventState>) {
    this.validate();
  }

  /* ---------- Factories ---------- */

  /**
   * Creates a FundingEvent from a normalized state.
   * @param state The FundingEvent state
   * @returns FundingEvent instance
   */
  static create(state: FundingEventState): FundingEvent {
    return new FundingEvent(FundingEvent.normalize(state));
  }

  /* ---------- Factories ---------- */

  /**
   * Create an equity funding event.
   * @param name Name of funding
   * @param amount Amount in major units
   * @param month Month of funding
   * @param currency Currency code (default PHP)
   * @param id Optional ID
   * @returns FundingEvent instance
   */
  static equity(
    name: string,
    amount: number,
    month: YYYYMM,
    currency: string = "PHP",
    id?: FundingID
  ): FundingEvent {
    return FundingEvent.create({
      id: id ?? autogenerateID("mjkfd"),
      name,
      type: FundingType.Equity,
      month,
      amount: MajikMoney.fromMajor(amount, currency),
    });
  }

  /**
   * Create a debt funding event with an automatic installment plan.
   *
   * @param name - Name of the debt
   * @param amount - Principal amount of the debt (in major currency units)
   * @param month - Start month of the debt (YYYYMM)
   * @param maturityDate - ISO date string representing when the debt must be fully repaid
   * @param currency - Currency code (default: "PHP")
   * @param interestRate - Annual interest rate as a decimal ratio (default: 0, e.g., 0.05 for 5%)
   * @param initialPayment - Upfront payment at the start of the loan (default: 0)
   * @param id Optional ID
   * @returns FundingEvent instance representing the debt
   */
  static debt(
    name: string,
    amount: number,
    month: YYYYMM,
    maturityDate: string,
    currency: string = "PHP",
    interestRate: number = 0,
    initialPayment: number = 0,
    id?: FundingID
  ): FundingEvent {
    const principal = MajikMoney.fromMajor(amount, currency);
    const initialPay = MajikMoney.fromMajor(initialPayment, currency);

    // Convert dates to YYYYMM for calculation
    const startMonth = month;
    const endMonth = isoToYYYYMM(maturityDate);

    // Compute total months of the loan
    const totalMonths = monthsInPeriod(startMonth, endMonth);
    if (totalMonths < 1)
      throw new Error("Maturity date must be after start month");

    // Compute remaining principal after initial payment
    const remainingAmount = amount - initialPayment;
    const installmentsCount = totalMonths - (initialPayment > 0 ? 1 : 0);
    const monthlyPayment = remainingAmount / installmentsCount;

    // Build installment plan
    const installmentPlan: InstallmentEntry[] = [];

    if (initialPayment > 0) {
      installmentPlan.push({
        date: yyyyMMToISO(startMonth),
        amount: initialPay,
      });
    }

    for (let i = 0; i < installmentsCount; i++) {
      const installmentMonth = offsetMonthsToYYYYMM(
        startMonth,
        i + (initialPayment > 0 ? 1 : 0)
      );
      installmentPlan.push({
        date: yyyyMMToISO(installmentMonth),
        amount: MajikMoney.fromMajor(monthlyPayment, currency),
      });
    }

    return FundingEvent.create({
      id: id ?? autogenerateID("mjkfd"),
      name,
      type: FundingType.Debt,
      month,
      amount: principal,
      debt: {
        interestRate,
        maturityDate,
        initialPayment: initialPay,
        installmentPlan,
        compounding: CompoundingFrequency.None,
      },
    });
  }

  /**
   * Create a grant funding event.
   * @param name Name of grant
   * @param amount Amount in major units
   * @param month Month of grant
   * @param currency Currency code (default PHP)
   * @param id Optional ID
   * @returns FundingEvent instance
   */
  static grant(
    name: string,
    amount: number,
    month: YYYYMM,
    currency: string = "PHP",
    id?: FundingID
  ): FundingEvent {
    return FundingEvent.create({
      id: id ?? autogenerateID("mjkfd"),
      name,
      type: FundingType.Grant,
      month,
      amount: MajikMoney.fromMajor(amount, currency),
    });
  }

  /* ---------- Accessors ---------- */

  get id(): FundingID {
    return this.state.id;
  }

  get name(): string {
    return this.state.name;
  }

  get type(): FundingType {
    return this.state.type;
  }

  get month(): YYYYMM {
    return this.state.month;
  }

  get amount(): MajikMoney {
    return this.state.amount;
  }

  /* ---------- Type Helpers ---------- */

  get isEquity(): boolean {
    return this.type === FundingType.Equity;
  }

  get isDebt(): boolean {
    return this.type === FundingType.Debt;
  }

  get isGrant(): boolean {
    return this.type === FundingType.Grant;
  }

  get valuationCap(): number | undefined {
    return this.state.meta?.valuationCap;
  }

  get discountRate(): number | undefined {
    return this.state.meta?.discountRate;
  }

  get maturityMonth(): YYYYMM | undefined {
    return this.state.meta?.maturityMonth;
  }

  get debtMetadata(): DebtMetadata | undefined {
    if (!this.isDebt) return undefined;
    return this.state.debt;
  }

  get maturityDate(): string | undefined {
    return this.state.debt?.maturityDate;
  }

  get installmentPlan(): InstallmentEntry[] | undefined {
    if (!this.isDebt) return undefined;
    return this.state.debt?.installmentPlan;
  }

  get initialPayment(): MajikMoney | undefined {
    if (!this.isDebt) return undefined;
    return this.state.debt?.initialPayment;
  }

  get compounding(): CompoundingFrequency {
    if (!this.isDebt) return CompoundingFrequency.None;
    return this.state.debt?.compounding ?? CompoundingFrequency.None;
  }

  get gracePeriodMonths(): number | undefined {
    if (!this.isDebt) return undefined;
    return this.state.debt?.gracePeriodMonths;
  }

  /* ---------- Core Behavior ---------- */

  /**
   * Cash inflow for a given month.
   * Funding happens only in its declared month.
   */
  cashInForMonth(month: YYYYMM): MajikMoney {
    if (this.isDebt && this.installmentPlan) {
      const installment = this.installmentPlan.find(
        (i) => isoToYYYYMM(i.date) === month
      );
      return installment?.amount ?? MajikMoney.zero(this.amount.currency.code);
    }
    return month === this.month
      ? this.amount
      : MajikMoney.zero(this.amount.currency.code);
  }

  /* ---------- Interest / Debt Methods ---------- */

  get interestRate(): number {
    if (!this.isDebt || !this.state.debt?.interestRate) {
      return 0;
    }
    return this.state.debt.interestRate;
  }

  /**
   * Compute simple interest for a number of months.
   * @param months Optional number of months (default: until maturity)
   */
  computeInterest(months?: number): MajikMoney {
    if (!this.isDebt || !this.interestRate)
      return MajikMoney.zero(this.amount.currency.code);

    const totalMonths =
      months ?? monthsInPeriod(this.month, isoToYYYYMM(this.maturityDate!));
    if (totalMonths <= 0) return MajikMoney.zero(this.amount.currency.code);

    return this.amount.multiply((this.interestRate / 12) * totalMonths);
  }

  /**
   * Compute compound interest over a number of months (default: until maturity)
   * Respects compounding frequency.
   * @param months Optional number of months
   */
  computeCompoundInterest(months?: number): MajikMoney {
    if (!this.isDebt || !this.interestRate || this.interestRate <= 0)
      return MajikMoney.zero(this.amount.currency.code);

    const totalMonths =
      months ?? monthsInPeriod(this.month, isoToYYYYMM(this.maturityDate!));
    if (totalMonths <= 0) return MajikMoney.zero(this.amount.currency.code);

    let periodsPerYear = 12;
    switch (this.compounding) {
      case CompoundingFrequency.None:
        return this.computeInterest(totalMonths);
      case CompoundingFrequency.Monthly:
        periodsPerYear = 12;
        break;
      case CompoundingFrequency.Quarterly:
        periodsPerYear = 4;
        break;
      case CompoundingFrequency.Annually:
        periodsPerYear = 1;
        break;
    }

    const ratePerPeriod = this.interestRate / periodsPerYear;
    const totalPeriods = (totalMonths / 12) * periodsPerYear;

    const compoundedAmount = this.amount
      .multiply(Math.pow(1 + ratePerPeriod, totalPeriods))
      .subtract(this.amount);

    return compoundedAmount;
  }

  /**
   * Total amount including interest.
   * @param compound Whether to use compound interest (default: false)
   * @param months Optional number of months (default: until maturity)
   */
  totalWithInterest(compound: boolean = false, months?: number): MajikMoney {
    if (!compound) return this.amount.add(this.computeInterest(months));
    return this.amount.add(this.computeCompoundInterest(months));
  }

  /**
   * Generates an amortization schedule for this debt/funding event.
   *
   * The schedule accounts for:
   * - Initial payment (if any)
   * - Grace period (interest-only period)
   * - Fully amortized payments (optional)
   * - Compound or simple interest
   *
   * Each entry contains the month, principal paid, interest accrued, and remaining balance.
   *
   * @param {boolean} [fullyAmortized=false] - If `true`, generates a fully amortized payment schedule.
   * @param {boolean} [useCompoundInterest=true] - If `true`, interest is compounded per the compounding frequency.
   * @returns {AmortizationEntry[]} Array of amortization entries, each with:
   *  - `month`: YYYYMM string of the installment
   *  - `principal`: MajikMoney instance representing principal paid this period
   *  - `interest`: MajikMoney instance representing interest accrued this period
   *  - `total`: MajikMoney instance representing remaining principal after this period
   *
   * @throws {Error} If the debt amount is not positive or the schedule period is invalid.
   */

  generateAmortizationSchedule(
    fullyAmortized: boolean = false,
    useCompoundInterest: boolean = true
  ): AmortizationEntry[] {
    if (!this.isDebt || !this.amount.isPositive()) return [];

    const startMonth = this.month;
    const endMonth = isoToYYYYMM(this.maturityDate!);
    const totalMonths = monthsInPeriod(startMonth, endMonth);
    if (totalMonths <= 0) return [];

    const schedule: AmortizationEntry[] = [];
    const principalAmount = this.amount;
    let remainingPrincipal = principalAmount;

    const initialPay =
      this.initialPayment ?? MajikMoney.zero(this.amount.currency.code);
    const gracePeriod = this.gracePeriodMonths ?? 0;

    // Determine periods per year for compounding
    let periodsPerYear = 12;
    switch (this.compounding) {
      case CompoundingFrequency.Monthly:
        periodsPerYear = 12;
        break;
      case CompoundingFrequency.Quarterly:
        periodsPerYear = 4;
        break;
      case CompoundingFrequency.Annually:
        periodsPerYear = 1;
        break;
      case CompoundingFrequency.None:
      default:
        periodsPerYear = 12;
    }

    const ratePerPeriod = this.interestRate / periodsPerYear;

    // Compute fixed monthly payment for fully amortized schedule
    let monthlyPayment = MajikMoney.zero(this.amount.currency.code);
    if (fullyAmortized) {
      const amortMonths =
        totalMonths - (initialPay.isPositive() ? 1 : 0) - gracePeriod;
      monthlyPayment =
        amortMonths > 0
          ? computeMonthlyPayment(
              principalAmount.subtract(initialPay),
              amortMonths,
              this.interestRate * 100
            )
          : MajikMoney.zero(this.amount.currency.code);
    }

    for (let i = 0; i < totalMonths; i++) {
      const installmentMonth = offsetMonthsToYYYYMM(startMonth, i);
      let interestAmount = MajikMoney.zero(this.amount.currency.code);
      let principalPaid = MajikMoney.zero(this.amount.currency.code);

      // Initial payment
      if (i === 0 && initialPay.isPositive()) {
        principalPaid = initialPay;
        remainingPrincipal = remainingPrincipal.subtract(principalPaid);
      }
      // Grace period: only interest accrues
      else if (i < gracePeriod + (initialPay.isPositive() ? 1 : 0)) {
        interestAmount = useCompoundInterest
          ? remainingPrincipal
              .compound(ratePerPeriod, 1)
              .subtract(remainingPrincipal)
          : remainingPrincipal.multiply(this.interestRate / 12);
      }
      // Fully amortized payment
      else if (fullyAmortized) {
        interestAmount = useCompoundInterest
          ? remainingPrincipal
              .compound(ratePerPeriod, 1)
              .subtract(remainingPrincipal)
          : remainingPrincipal.multiply(this.interestRate / 12);

        principalPaid = monthlyPayment.subtract(interestAmount);
        remainingPrincipal = remainingPrincipal.subtract(principalPaid);
      }
      // Standard schedule: interest accrues, principal stays
      else {
        interestAmount = useCompoundInterest
          ? remainingPrincipal
              .compound(ratePerPeriod, 1)
              .subtract(remainingPrincipal)
          : remainingPrincipal.multiply(this.interestRate / 12);

        // Add interest to principal if not paying
        remainingPrincipal = remainingPrincipal.add(interestAmount);
      }

      // Ensure remaining principal never negative
      if (!remainingPrincipal.isPositive()) {
        remainingPrincipal = MajikMoney.zero(this.amount.currency.code);
      }

      schedule.push({
        month: installmentMonth,
        principal: principalPaid,
        interest: interestAmount,
        total: remainingPrincipal,
      });
    }

    return schedule;
  }

  /* ---------- Updaters (Immutable) ---------- */

  withAmount(amount: MajikMoney): FundingEvent {
    return FundingEvent.create({ ...this.state, amount });
  }

  rename(name: string): FundingEvent {
    return FundingEvent.create({ ...this.state, name });
  }

  reschedule(month: YYYYMM): FundingEvent {
    return FundingEvent.create({ ...this.state, month });
  }

  /* ---------- Validation ---------- */

  private validate(): void {
    if (!isValidYYYYMM(this.state.month)) {
      throw new Error("FundingEvent month must be valid YYYYMM");
    }

    if (!this.state.amount) {
      throw new Error("FundingEvent must define an amount");
    }

    if (!this.state.amount.isPositive()) {
      throw new Error("Funding amount must be positive");
    }

    if (this.isDebt) {
      if (this.interestRate < 0)
        throw new Error("Interest rate cannot be negative");
      if (this.state.debt?.installmentPlan) {
        for (const entry of this.state.debt.installmentPlan) {
          if (!entry.amount.isPositive())
            throw new Error("Installment amount must be positive");
        }
      }
      if (this.isDebt && this.maturityDate) {
        const startMonth = isoToYYYYMM(this.month);
        const endMonth = isoToYYYYMM(this.maturityDate);
        if (monthsInPeriod(startMonth, endMonth) < 1)
          throw new Error("Debt maturityDate must be after start month");
      }
    }
  }

  private static normalize(state: FundingEventState): FundingEventState {
    return {
      ...state,
    };
  }

  /* ---------- Serialization ---------- */

  /**
   * Converts the current FundingEvent object to a plain JavaScript object (JSON).
   * @returns {FundingEventJSON} - The plain object representation of the FundingEvent instance.
   */
  toJSON(): FundingEventJSON {
    const preJSON = {
      ...this.state,
    };

    const serializedMoney: FundingEventJSON = serializeMoney(preJSON);

    return serializedMoney;
  }

  /**
   * Parse an FundingEvent from a JSON object (produced by `toJSON`).
   * @param json JSON object
   * @returns FundingEvent instance
   */
  static parseFromJSON(json: string | FundingEventJSON): FundingEvent {
    // If the input is a string, parse it as JSON
    const rawParse: FundingEventJSON =
      typeof json === "string"
        ? JSON.parse(json)
        : structuredClone
        ? structuredClone(json)
        : JSON.parse(JSON.stringify(json));

    const parsedData: FundingEventState = deserializeMoney(rawParse);

    return FundingEvent.create(parsedData);
  }
}

/**
 * Compute monthly payment for a fully amortized loan
 * @param principal Principal amount in major units
 * @param months Number of months
 * @param annualRate Annual interest rate in percent
 * @returns Monthly payment in major units
 */
export function computeMonthlyPayment(
  principal: MajikMoney,
  months: number,
  annualRate: number
): MajikMoney {
  if (annualRate <= 0) {
    // No interest, simple division
    return principal.divide(months);
  }

  const monthlyRate = annualRate / 12 / 100;
  return principal
    .multiply(monthlyRate)
    .divide(1 - Math.pow(1 + monthlyRate, -months));
}
