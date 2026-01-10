export const ExpenseType = {
  Operating: "Operating",
  Variable: "Variable",
  Capital: "Capital",
} as const;

export type ExpenseType = (typeof ExpenseType)[keyof typeof ExpenseType];

export const Recurrence = {
  Monthly: "Monthly",
  Quarterly: "Quarterly",
  Yearly: "Yearly",
} as const;

export type Recurrence = (typeof Recurrence)[keyof typeof Recurrence];

export const RevenueKind = {
  Product: "Product",
  Service: "Service",
  Subscription: "Subscription",
} as const;

export type RevenueKind = (typeof RevenueKind)[keyof typeof RevenueKind];

export const VATMode = {
  NON_VAT: "Non-VAT",
  VAT: "VAT",
} as const;

export type VATMode = (typeof VATMode)[keyof typeof VATMode];

export const FundingType = {
  Equity: "Equity",
  Debt: "Debt",
  Grant: "Grant",
} as const;

export type FundingType = (typeof FundingType)[keyof typeof FundingType];

export const BusinessModelType = {
  Product: "Product",
  Service: "Service",
  Subscription: "Subscription",
  Hybrid: "Hybrid",
} as const;

export type BusinessModelType =
  (typeof BusinessModelType)[keyof typeof BusinessModelType];

export const CapacityPeriodResizeMode = {
  DEFAULT: "default",
  DISTRIBUTE: "distribute",
} as const;

export type CapacityPeriodResizeMode =
  (typeof CapacityPeriodResizeMode)[keyof typeof CapacityPeriodResizeMode];

export const CompoundingFrequency = {
  None: "None",
  Monthly: "Monthly",
  Quarterly: "Quarterly",
  Annually: "Annually",
} as const;

export type CompoundingFrequency =
  (typeof CompoundingFrequency)[keyof typeof CompoundingFrequency];
