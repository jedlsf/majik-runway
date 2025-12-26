import { MajikMoney } from "@thezelijah/majik-money";
import { YYYYMM } from "./types/types";



/** Represents tax breakdown for a month */
export interface CashflowTaxes {
  vat: MajikMoney;
  percentageTax: MajikMoney;
  incomeTax: MajikMoney;
}


/**
 * Represents a single month's cashflow in a business or project.
 * Tracks cash inflows, outflows, net cash change, and cumulative ending cash.
 *
 * Useful for calculating runway, forecasting, and scenario planning.
 */
export class Cashflow {
  /**
   * The month this cashflow represents, in YYYYMM format.
   * Example: "202512" for December 2025.
   */
  month: YYYYMM;

  /**
   * Total cash received during the month.
   * Examples: revenue, funding, loans, client payments.
   */
  cashIn: MajikMoney;

  /**
   * Total cash spent during the month.
   * Examples: salaries, rent, utilities, materials, marketing.
   */
  cashOut: MajikMoney;

  /**
   * Net cash for the month (cashIn - cashOut).
   * Positive if cash increased, negative if cash decreased.
   */
  net: MajikMoney;

  /**
   * Cumulative cash at the end of the month.
   * Calculated as previous month's endingCash + this month's net.
   */
  endingCash: MajikMoney;

  /** Optional tax breakdown for the month */
  taxes?: CashflowTaxes;


  /**
   * Creates a new Cashflow instance for a specific month.
   *
   * @param month - Month in YYYYMM format
   * @param cashIn - Total cash inflow for the month
   * @param cashOut - Total cash outflow for the month
   * @param previousEndingCash - Ending cash from previous month (default: 0)
   * @param taxes - Optional tax breakdown for the month
   * @example
   * const cashflowDec = new Cashflow(
   *   "202512",
   *   new MajikMoney(100000), // cash in
   *   new MajikMoney(75000),  // cash out
   *   new MajikMoney(50000)   // previous ending cash
   * );
   * console.log(cashflowDec.net.toNumber()); // 25000
   * console.log(cashflowDec.endingCash.toNumber()); // 75000
   */
  constructor(
    month: YYYYMM,
    cashIn: MajikMoney,
    cashOut: MajikMoney,
    previousEndingCash: MajikMoney = MajikMoney.zero(cashIn.currency.code),
    taxes?: CashflowTaxes
  ) {
    this.month = month;
    this.cashIn = cashIn;
    this.cashOut = cashOut;
    this.net = cashIn.subtract(cashOut);
    this.endingCash = previousEndingCash.add(this.net);
    if (taxes) this.taxes = taxes;
  }

  /**
   * Updates cashIn and/or cashOut for the month and recalculates net and endingCash.
   *
   * @param cashIn - Optional new cash inflow value
   * @param cashOut - Optional new cash outflow value
   * @param previousEndingCash - Optional previous month's ending cash for recalculation
   *
   * @example
   * cashflowDec.updateCash(
   *   new MajikMoney(120000), // updated cash in
   *   undefined,               // keep cash out unchanged
   *   new MajikMoney(50000)    // previous month's ending cash
   * );
   * console.log(cashflowDec.net.toNumber()); // 45000
   */
  updateCash(
    cashIn?: MajikMoney,
    cashOut?: MajikMoney,
    previousEndingCash?: MajikMoney,
    taxes?: CashflowTaxes
  ) {
    if (cashIn) this.cashIn = cashIn;
    if (cashOut) this.cashOut = cashOut;
    this.net = this.cashIn.subtract(this.cashOut);
    this.endingCash = previousEndingCash
      ? previousEndingCash.add(this.net)
      : this.net;

    if (taxes) this.taxes = taxes;
  }

  /**
   * Converts the Cashflow instance to a plain JSON object.
   *
   * @returns {object} Serialized version of the cashflow
   *
   * @example
   * console.log(cashflowDec.toJSON());
   * // {
   * //   month: "202512",
   * //   cashIn: 120000,
   * //   cashOut: 75000,
   * //   net: 45000,
   * //   endingCash: 95000
   * // }
   */
  toJSON(): object {
    return {
      month: this.month,
      cashIn: this.cashIn.toJSON(),
      cashOut: this.cashOut.toJSON(),
      net: this.net.toJSON(),
      endingCash: this.endingCash.toJSON(),
      taxes: this.taxes
        ? {
          vat: this.taxes.vat.toJSON(),
          percentageTax: this.taxes.percentageTax.toJSON(),
          incomeTax: this.taxes.incomeTax.toJSON(),
        }
        : undefined,
    };
  }
}
