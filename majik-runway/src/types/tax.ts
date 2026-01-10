import { VATMode } from "../enums";




export interface TaxConfig {
  vatMode: VATMode;
  vatRate?: number;
  percentageTaxRate?: number;
  incomeTaxRate?: number;
}
