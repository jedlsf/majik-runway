



export enum ExpenseType {
  Operating = 'Operating',
  Variable = 'Variable',
  Capital = 'Capital'
}

export enum Recurrence {
  Monthly = 'Monthly',
  Quarterly = 'Quarterly',
  Yearly = 'Yearly'
}

export enum RevenueKind {
  Product = 'Product',
  Service = 'Service',
  Subscription = 'Subscription'
}


export enum VATMode {
  NON_VAT = 'Non-VAT',
  VAT = 'VAT',
}


export enum FundingType {
  Equity = "Equity",
  Debt = "Debt",
  Grant = "Grant"
}

export enum BusinessModelType {
  Product = 'Product',
  Service = 'Service',
  Subscription = 'Subscription',
  Hybrid = "Hybrid"
}


export enum CapacityPeriodResizeMode {
  DEFAULT = "default", // trim or pad, keep per-month units
  DISTRIBUTE = "distribute", // preserve total capacity, redistribute evenly
}
