export * from "./majik-runway";

export * from "./utils";
export * from "./enums";

export * from "./revenue";
export * from "./engine";
export * from "./cashflow";

export * from "./funding/funding";
export type {
  AmortizationEntry,
  DebtMetadata,
  FundingEventJSON,
  FundingEventState,
  FundingManagerJSON,
  FundingSummaryCache,
  InstallmentEntry,
} from "./funding/types";
export * from "./funding/funding-manager";

export * from "./expenses/expense";
export type {
  CapitalMeta,
  ExpenseBreakdownJSON,
  ExpenseJSON,
  ExpenseState,
  ExpenseSummaryCache,
  MonthlyAllocation,
} from "./expenses/types";
export * from "./expenses/expense-breakdown";

export type {
  BalanceSnapshot,
  BusinessModel,
  DashboardSnapshot,
  ExpenseBreakdownSnapshot,
  ExpenseID,
  FundingID,
  FundingManagerSnapshot,
  HealthSeverity,
  ISODateString,
  MajikRunwayJSON,
  MonthlyCapacity,
  ObjectType,
  PeriodYYYYMM,
  RevenueID,
  RevenueStreamJSON,
  RunwayHealth,
  StartDateInput,
  YYYYMM,
} from "./types/types";
export * from "./types/plotly";
export * from "./types/tax";
export * from "./types/scenario";

export {
  MajikProduct,
  type MajikProductJSON,
  type COGSItem,
  isMajikProductClass,
  isMajikProductJSON,
  ProductType,
  ProductStatus,
  ProductVisibility,
} from "@thezelijah/majik-product";

export {
  MajikService,
  type MajikServiceJSON,
  type COSItem,
  isMajikServiceClass,
  isMajikServiceJSON,
  ServiceType,
  ServiceStatus,
  ServiceVisibility,
  RateUnit as ServiceRateUnit,
} from "@thezelijah/majik-service";

export {
  MajikSubscription,
  type MajikSubscriptionJSON,
  isMajikSubscriptionClass,
  isMajikSubscriptionJSON,
  SubscriptionType,
  SubscriptionStatus,
  SubscriptionVisibility,
  BillingCycle,
  RateUnit as SubscriptionRateUnit,
} from "@thezelijah/majik-subscription";

export {
  MajikMoney,
  type MajikMoneyJSON,
  CURRENCIES,
  type CurrencyDefinition,
  deserializeMoney,
  serializeMoney,
} from "@thezelijah/majik-money";
