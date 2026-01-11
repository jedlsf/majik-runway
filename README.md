# Majik Runway

It helps founders, operators, and finance teams understand **how long a business can operate**, **where money is going**, and **how decisions affect survival and growth**.

Majik Runway models your business as a **living financial system**, not a static spreadsheet.

It composes other Majik financial primitives such as [MajikProduct](https://www.npmjs.com/package/@thezelijah/majik-product), [MajikService](https://www.npmjs.com/package/@thezelijah/majik-service), [MajikSubscription](https://www.npmjs.com/package/@thezelijah/majik-subscription), and [MajikMoney](https://www.npmjs.com/package/@thezelijah/majik-money) to produce accurate, period-based projections.


![npm](https://img.shields.io/npm/v/@thezelijah/majik-runway) ![npm downloads](https://img.shields.io/npm/dm/@thezelijah/majik-runway) ![npm bundle size](https://img.shields.io/bundlephobia/min/%40thezelijah%2Fmajik-runway) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) ![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue)

---

## Live Demo

[![Majik Runway Thumbnail](https://www.thezelijah.world/_next/static/media/WA_Tools_Finance_MajikRunway.c4d2034e.webp)](https://www.thezelijah.world/tools/finance-majik-runway)

> Click the image to try Majik Runway live.

## Standalone Desktop App

[![Majik Runway Thumbnail](https://github.com/user-attachments/assets/da176129-b466-45bc-bb90-774cbf7e71f5)](https://github.com/jedlsf/majik-runway/releases)

> Click the image to download the standalone desktop app.

---

## Table of Contents

- [Majik Runway](#majik-runway)
  - [Live Demo](#live-demo)
  - [Standalone Desktop App](#standalone-desktop-app)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Key Concepts](#key-concepts)
    - [Modeling Period](#modeling-period)
    - [Revenue Streams](#revenue-streams)
    - [Expenses](#expenses)
      - [Supported Expense Types:](#supported-expense-types)
        - [Operating Expenses](#operating-expenses)
        - [Variable Expenses](#variable-expenses)
        - [Capital Expenses](#capital-expenses)
      - [Expense Timing](#expense-timing)
        - [One-time](#one-time)
        - [Recurring](#recurring)
        - [Capital](#capital)
    - [Funding](#funding)
      - [Supported Funding Types:](#supported-funding-types)
        - [Equity](#equity)
        - [Debt](#debt)
        - [Grant](#grant)
      - [Relationship to Burn \& Runway](#relationship-to-burn--runway)
    - [Burn Rate](#burn-rate)
    - [Cash Flow](#cash-flow)
    - [Runway](#runway)
    - [Profit vs Cash (Important)](#profit-vs-cash-important)
    - [What Majik Runway Is (and Is Not)](#what-majik-runway-is-and-is-not)
  - [Installation](#installation)
  - [Quick Start](#quick-start)
  - [Usage](#usage)
    - [Initialize a MajikRunway Instance](#initialize-a-majikrunway-instance)
    - [Business Models](#business-models)
    - [Period Configuration](#period-configuration)
    - [Revenue Streams](#revenue-streams-1)
      - [Add/Manage Products to Revenue Stream](#addmanage-products-to-revenue-stream)
      - [Add/Manage Services to Revenue Stream](#addmanage-services-to-revenue-stream)
      - [Add/Manage Subscriptions to Revenue Stream](#addmanage-subscriptions-to-revenue-stream)
      - [Update Existing Revenue Item](#update-existing-revenue-item)
      - [Remove an Existing Revenue Item](#remove-an-existing-revenue-item)
    - [Expenses and Operating Costs](#expenses-and-operating-costs)
      - [Add/Manage Expenses](#addmanage-expenses)
        - [Create Recurring Expense](#create-recurring-expense)
        - [Create One Time Expense](#create-one-time-expense)
        - [Create Capital Expense](#create-capital-expense)
      - [Update an Existing Expense Item](#update-an-existing-expense-item)
      - [Remove an Existing Expense Item](#remove-an-existing-expense-item)
    - [Funding](#funding-1)
      - [Add/Manage Funding Events](#addmanage-funding-events)
        - [Create Equity Funding Event](#create-equity-funding-event)
        - [Create Debt Funding Event](#create-debt-funding-event)
        - [Create Grant Funding Event](#create-grant-funding-event)
      - [Update an Existing Funding Event](#update-an-existing-funding-event)
      - [Remove an Existing Funding Event](#remove-an-existing-funding-event)
    - [Tax Configuration](#tax-configuration)
    - [Initial Cash \& Currency](#initial-cash--currency)
    - [Updating the Model](#updating-the-model)
  - [Mental Model](#mental-model)
    - [Why This Design Works](#why-this-design-works)
  - [Example Usage](#example-usage)
  - [Dashboard Integration \& Real-Time Financial Modeling](#dashboard-integration--real-time-financial-modeling)
  - [Utilities](#utilities)
  - [Use Cases](#use-cases)
    - [What is Majik Runway Used For?](#what-is-majik-runway-used-for)
    - [Core Use Cases](#core-use-cases)
  - [Best Practices](#best-practices)
  - [Conclusion](#conclusion)
  - [Contributing](#contributing)
  - [License](#license)
  - [Author](#author)
  - [About the Developer](#about-the-developer)
  - [Contact](#contact)
  - [API Reference](#api-reference)
    - [MajikRunway](#majikrunway)
    - [RevenueStream](#revenuestream)
    - [MajikProduct](#majikproduct)
    - [MajikService](#majikservice)
    - [MajikSubscription](#majiksubscription)
    - [FundingManager](#fundingmanager)
    - [FundingEvent](#fundingevent)
    - [ExpenseBreakdown](#expensebreakdown)
    - [Expense](#expense)

---

## Overview

Majik Runway manages:

- **Cash Balance:** Starting cash, funding events, and cumulative cash over time
- **Revenue Streams:** Products, services, and subscriptions
- **Expenses:** Fixed, variable, and one-time costs
- **Burn Rate:** Monthly and trend-based burn
- **Runway:** Estimated months before cash depletion
- **Period Modeling:** YYYYMM-based projections with proration
- **Scenario Planning:** Live recomputation on assumption changes
- **Serialization:** Safe export/import using MajikMoney

> Majik Runway is **not accounting software** — it is a **forecasting and decision engine**.

---

## Key Concepts

**Majik Runway** is a financial simulation and planning engine, not an accounting system. It models cash behavior over time using deterministic rules so founders, operators, and finance teams can reason about runway, burn, growth, and survivability with clarity.

### Modeling Period

All computations occur inside a defined modeling window:

- Start: `YYYYMM`
- End: `YYYYMM`

This period defines the **timeline of the simulation**, not the lifetime of the business.

Key rules:
- All revenues, expenses, funding events, and taxes are normalized to monthly granularity
- Partial months are prorated
- Items outside the modeling period are ignored
- Results are computed month-by-month, then aggregated

> Majik Runway assumes time moves forward in discrete monthly steps. There is no backdating, retroactive mutation, or implicit carry-over beyond defined rules.

---

### Revenue Streams

Majik Runway does not invent revenue logic — it **reuses Majik domain models**:

- `MajikProduct`
- `MajikService`
- `MajikSubscription`

Each revenue stream:

- Has an activation window (start / end)
- Produces gross monthly revenue
- May include:
  - Pricing rules
  - Quantity / capacity limits
  - Growth or churn assumptions
- Can scale, pause, or terminate independently

Important clarifications:
- Revenue is modeled as earned revenue, not necessarily collected cash
- Cash collection timing (e.g. delayed payments) must be modeled explicitly if needed
- Refunds, chargebacks, or revenue leakage must be modeled as negative revenue or expenses


---

### Expenses

Expenses represent **cash outflows** that reduce available cash and contribute to burn. Majik Runway models expenses explicitly and intentionally avoids accounting abstractions such as depreciation or accruals.

#### Supported Expense Types:

##### Operating Expenses
Recurring costs required to keep the business running:
- Salaries and contractors
- Rent and utilities
- Software subscriptions
- Base infrastructure costs

These expenses are typically predictable and stable over time.

##### Variable Expenses
Costs that scale with activity, usage, or growth:
- Marketing spend
- Transaction fees
- Usage-based infrastructure
- Performance-based commissions

Variable expenses may fluctuate month-to-month and often correlate with revenue or volume.

##### Capital Expenses
Large, usually strategic cash outlays intended to provide long-term value:
- Equipment and hardware
- Initial platform build costs
- One-time tooling or setup investments

Capital expenses are treated as immediate cash outflows, not depreciated assets.


#### Expense Timing

Independently of type, an expense may follow one of these timing behaviors:

##### One-time
Occurs once in a specific month

##### Recurring
Occurs every month within an active period

##### Capital
Large one-time expenditures, typically paired with `ExpenseType.Capital`

Majik Runway treats all expenses as cash-paid in the month they occur. If amortization, deferred payments, or financing effects are required, they must be modeled explicitly.

Rules:
- Expenses reduce cash balance
- Expenses contribute directly to burn
- Expenses are assumed to be paid in the month they occur
- Depreciation, amortization, and accruals are out of scope

> Majik Runway intentionally favors cash realism over accounting abstraction.


---

### Funding

Funding represents **external capital injections** that increase available cash without generating revenue.

#### Supported Funding Types:

##### Equity

Capital raised in exchange for ownership (e.g. angel or VC funding).

- Increases cash balance
- Does not count as revenue
- Does not affect profit or margins
- Equity dilution is out of scope

##### Debt

- Borrowed capital that must be repaid.
- Increases cash balance at issuance
- Principal repayment and interest are not implicit
- Interest and repayments must be modeled explicitly as expenses

##### Grant

Non-dilutive capital typically provided by institutions or programs.

- Increases cash balance
- Does not count as revenue
- Assumed to have no repayment obligation
- Funding Modeling Rules
- Funding occurs at a specific YYYYMM
- Funding increases cash only
- Funding does not reduce burn directly
- Funding does not imply future obligations unless explicitly modeled

> Majik Runway intentionally separates capital flow from operational performance.

#### Relationship to Burn & Runway

- Expenses and taxes increase burn
- Revenue and funding reduce burn
- Funding extends runway without improving profitability
- Capital-heavy strategies may show strong cash early but poor burn efficiency

---

### Burn Rate

Burn rate represents **net cash loss per month**.

Formula (simplified):
```bash
Burn = Cash Outflows − Cash Inflows
```

Where:
- Outflows include expenses and taxes
- Inflows include revenue collections and funding

Key distinctions:
- Burn is a cash metric, not a profit metric
- A company can be profitable but still burn cash
- A company can have revenue and still burn aggressively

---

### Cash Flow

Cash flow is tracked explicitly per month:

Formula (simplified):
```css
Closing Cash = [Opening Cash] + [Cash Inflows] − [Cash Outflows]
```

There is no hidden balancing or correction layer.

If cash goes negative:
- The model reflects insolvency
- Runway is considered exhausted

---

### Runway

Runway answers a single question:
> **How many months can the company survive before cash reaches zero?**

Runway is derived from:
- Current cash balance
- Forward-looking burn trajectory
- Planned funding events

Runway is **dynamic**, not static — it changes as assumptions change.

---

### Profit vs Cash (Important)

Majik Runway makes a deliberate distinction:

| Concept | Meaning            |
| ------- | ------------------ |
| Revenue | Value earned       |
| Profit  | Revenue − Expenses |
| Cash    | Money available    |
| Burn    | Net cash loss      |

Majik Runway optimizes for cash truth, not accounting compliance.

---

### What Majik Runway Is (and Is Not)

It is:
- A financial planning engine
- A runway and burn simulator
- A decision-support tool

It is not:
- An accounting system
- A tax filing tool
- A replacement for a CFO

---

## Installation

```bash
npm i @thezelijah/majik-runway @thezelijah/majik-money @thezelijah/majik-product @thezelijah/majik-service @thezelijah/majik-subscription
```

---

## Quick Start

```ts
import { MajikRunway } from "@thezelijah/majik-runway";
import { MajikMoney } from "@thezelijah/majik-money";
import { BusinessModelType, VATMode } from "@thezelijah/majik-runway/enums";
import { RevenueStream } from "@thezelijah/majik-runway/revenue";
import { ExpenseBreakdown } from "@thezelijah/majik-runway/expenses";
import {
  dateToYYYYMM,
  offsetMonthsToYYYYMM,
} from "@thezelijah/majik-runway/utils";

const revenueStream = new RevenueStream("PHP");
const expenseBreakdown = new ExpenseBreakdown("PHP");
const fundingManager = new FundingManager("PHP");

const runway = MajikRunway.initialize({
  type: BusinessModelType.Hybrid,
  money: MajikMoney.fromMajor(1000000, "PHP"), // initial cash
  taxConfig: {
    vatMode: VATMode.VAT,
    vatRate: 0.12,
    percentageTaxRate: 0.03,
    incomeTaxRate: 0.08,
  },
  revenues: revenueStream,
  expenses: expenseBreakdown,
  funding: fundingManager,
  period: {
    startMonth: dateToYYYYMM(new Date()),
    endMonth: offsetMonthsToYYYYMM(dateToYYYYMM(new Date()), 23),
  },
});
```

---

## Usage

### Initialize a MajikRunway Instance

Majik Runway is initialized using a configuration object that defines your business model, starting cash, taxes, revenue streams, and expenses.

```ts
import { MajikRunway } from "@thezelijah/majik-runway";
import { MajikMoney } from "@thezelijah/majik-money";
import { BusinessModelType, VATMode } from "@thezelijah/majik-runway/enums";
import { RevenueStream } from "@thezelijah/majik-runway/revenue";
import { ExpenseBreakdown } from "@thezelijah/majik-runway/expenses";
import {
  dateToYYYYMM,
  offsetMonthsToYYYYMM,
} from "@thezelijah/majik-runway/utils";

const revenueStream = new RevenueStream("PHP");
const expenseBreakdown = new ExpenseBreakdown("PHP");
const fundingManager = new FundingManager("PHP");

const runway = MajikRunway.initialize({
  type: BusinessModelType.Hybrid,
  money: MajikMoney.fromMajor(1000000, "PHP"), // initial cash
  taxConfig: {
    vatMode: VATMode.VAT,
    vatRate: 0.12,
    percentageTaxRate: 0.03,
    incomeTaxRate: 0.08,
  },
  revenues: revenueStream,
  expenses: expenseBreakdown,
  funding: fundingManager,
  period: {
    startMonth: dateToYYYYMM(new Date()),
    endMonth: offsetMonthsToYYYYMM(dateToYYYYMM(new Date()), 23),
  },
});
```

---

### Business Models

The business model determines how revenue streams behave and how financial assumptions are applied.

- BusinessModelType.Product
- BusinessModelType.Service
- BusinessModelType.Subscription
- BusinessModelType.Hybrid

Hybrid models allow products, services, and subscriptions to coexist.

---

### Period Configuration

Majik Runway operates on a monthly YYYYMM timeline.

```ts
import {
  dateToYYYYMM,
  offsetMonthsToYYYYMM,
} from "@thezelijah/majik-runway/utils";

const period = {
  startMonth: dateToYYYYMM(new Date()),
  endMonth: offsetMonthsToYYYYMM(dateToYYYYMM(new Date()), 23),
};

runway.setPeriod(period);
```

> This automatically updates the period across the revenue stream, funding, and expenses.

Changing the period automatically:

- Reprojects revenue
- Reallocates expenses
- Updates burn & runway

---

### Revenue Streams

Revenue streams are managed independently and injected into Majik Runway.

They may internally contain:

- MajikProduct
- MajikService
- MajikSubscription

Revenue streams define:

- Price
- Volume
- Growth
- Start & end dates

> Majik Runway does not dictate how revenue is computed — it only aggregates results.


#### Add/Manage Products to Revenue Stream

```ts
import { MajikProduct } from "@thezelijah/majik-product";
import { MajikRunway } from "@thezelijah/majik-runway";
import { MajikMoney } from "@thezelijah/majik-money";
import { BusinessModelType, VATMode } from "@thezelijah/majik-runway/enums";
import { RevenueStream } from "@thezelijah/majik-runway/revenue";
import { ExpenseBreakdown } from "@thezelijah/majik-runway/expenses";
import {
  monthsInPeriod,
  offsetMonthsToYYYYMM,
} from "@thezelijah/majik-runway/utils";
// Create a new Product Instance

const newProduct = MajikProduct.initialize(
  "Brand Z Phone",
  ProductType.PHYSICAL,
  MajikMoney.fromMajor(24500, "PHP")
);

// Prepare and create COGS manually - make sure unitCost and subtotal are MajikMoney class instances (Use MajikMoney.fromMajor())
const productCOGS = [
  {
    id: "mjkpcost-vyR7lY7r",
    item: "Plastic",
    quantity: 50,
    unitCost: {
      __type: "MajikMoney",
      amount: "100",
      currency: "PHP",
    },
    unit: "PELLETS",
    subtotal: {
      __type: "MajikMoney",
      amount: "5000",
      currency: "PHP",
    },
  },
  {
    id: "mjkpcost-wKxE3TT6",
    item: "Metal Parts",
    quantity: 5,
    unitCost: {
      __type: "MajikMoney",
      amount: "2000",
      currency: "PHP",
    },
    unit: "G",
    subtotal: {
      __type: "MajikMoney",
      amount: "10000",
      currency: "PHP",
    },
  },
  {
    id: "mjkpcost-SMWmI7LU",
    item: "Glass Parts",
    quantity: 1,
    unitCost: {
      __type: "MajikMoney",
      amount: "10000",
      currency: "PHP",
    },
    unit: "PIECE",
    subtotal: {
      __type: "MajikMoney",
      amount: "10000",
      currency: "PHP",
    },
  },
];

// Set Cost of Goods and replace the entire list/array
newProduct.setCOGS([[...productCOGS]]);

// OR push one COG at a time (automatic generation of ID and auto computation of subtotal)

newProduct.addCOGS(
  "Metal Parts",
  MajikMoney.fromMajor(parseFloat(2000), "PHP"),
  5,
  "G"
);

// Generate Capacity Plan

newProduct.generateCapacityPlan(
  !!period ? monthsInPeriod(period.startMonth, period.endMonth) : 24, // Number of months to generate from the start date.
  capacityPerMonth, // Base units for the first month.
  capacityGrowthRate // Optional growth rate per month (e.g. 0.03 = +3%).
);

// OR Manually  Set Capacity Plan

const productCapacityPlan = [
  {
    month: "2025-12",
    capacity: 8,
  },
  {
    month: "2026-01",
    capacity: 9,
  },
  {
    month: "2026-02",
    capacity: 9,
  },
  {
    month: "2026-03",
    capacity: 10,
  },
  {
    month: "2026-04",
    capacity: 10,
  },
  {
    month: "2026-05",
    capacity: 11,
  },
  {
    month: "2026-06",
    capacity: 12,
  },
  {
    month: "2026-07",
    capacity: 13,
  },
  {
    month: "2026-08",
    capacity: 14,
  },
  {
    month: "2026-09",
    capacity: 15,
  },
  {
    month: "2026-10",
    capacity: 16,
  },
  {
    month: "2026-11",
    capacity: 17,
  },
  {
    month: "2026-12",
    capacity: 18,
  },
  {
    month: "2027-01",
    capacity: 19,
  },
  {
    month: "2027-02",
    capacity: 21,
  },
  {
    month: "2027-03",
    capacity: 22,
  },
  {
    month: "2027-04",
    capacity: 24,
  },
  {
    month: "2027-05",
    capacity: 25,
  },
  {
    month: "2027-06",
    capacity: 27,
  },
  {
    month: "2027-07",
    capacity: 29,
  },
  {
    month: "2027-08",
    capacity: 31,
  },
  {
    month: "2027-09",
    capacity: 33,
  },
  {
    month: "2027-10",
    capacity: 35,
  },
  {
    month: "2027-11",
    capacity: 38,
  },
];

newProduct.setCapacity([...productCapacityPlan]);

// Dynamically change the price if needed
newProduct.setSRP(MajikMoney.fromMajor(12500, "PHP"));

// Dynamically change the name if needed
newProduct.setName("Brand XYZ Phone");

//Dynamically set a description either both in text/html or either (TipTap compatible)
newProduct.setDescription(
  `<p>This is a new product</p>`, // HTML Content
  "This is a new product" // Plain Text
);

newProduct.setDescriptionText(
  "This is a new product" // Plain Text
);

newProduct.setDescriptionHTML(
  `<p>This is a new product</p>` // HTML Content
);

// When done, validate before finalizing and passing to revenue stream

newProduct.validateSelf(true); // Set to true to throw an error, Defaults to false - returns a plain boolean for custom conditions

// Use addRevenue from the MajikRunway class to add this new product
runway.addRevenue(newProduct);


```
> The new `MajikProduct` will now be added as a new item in `RevenueStream` and return an updated `MajikRunway` instance.


#### Add/Manage Services to Revenue Stream

```ts
import { MajikService } from "@thezelijah/majik-service";
import { MajikRunway } from "@thezelijah/majik-runway";
import { MajikMoney } from "@thezelijah/majik-money";
import { BusinessModelType, VATMode } from "@thezelijah/majik-runway/enums";
import { RevenueStream } from "@thezelijah/majik-runway/revenue";
import { ExpenseBreakdown } from "@thezelijah/majik-runway/expenses";
import {
  monthsInPeriod,
  offsetMonthsToYYYYMM,
} from "@thezelijah/majik-runway/utils";
// Create a new Service Instance

const newService = MajikService.initialize(
  "Home Cleaning",
  ServiceType.TIME_BASED,
  {
    amount: MajikMoney.fromMajor(250, "PHP"),
    unit: RateUnit.PER_HOUR
  }
);

// Prepare and create COS manually - make sure unitCost and subtotal are MajikMoney class instances (Use MajikMoney.fromMajor())
const serviceCOS = [
    {
        "id": "mjkscost-7SgAoOq2",
        "item": "Labor",
        "quantity": 1,
        "unitCost": {
            "__type": "MajikMoney",
            "amount": "8000",
            "currency": "PHP"
        },
        "unit": "PERSON",
        "subtotal": {
            "__type": "MajikMoney",
            "amount": "8000",
            "currency": "PHP"
        }
    },
    {
        "id": "mjkscost-RZPXh7pP",
        "item": "Cleaning Solutions",
        "quantity": 1,
        "unitCost": {
            "__type": "MajikMoney",
            "amount": "3500",
            "currency": "PHP"
        },
        "unit": "PACKAGE",
        "subtotal": {
            "__type": "MajikMoney",
            "amount": "3500",
            "currency": "PHP"
        }
    }
];

// Set Cost of Service and replace the entire list/array
newService.setCOS([...serviceCOS]);

// OR push one COS at a time (automatic generation of ID and auto computation of subtotal)

newService.addCOS(
  "Labor",
  MajikMoney.fromMajor(parseFloat(8000), "PHP"),
  1,
  "PERSON"
);

// Generate Capacity Plan

newService.generateCapacityPlan(
  !!period ? monthsInPeriod(period.startMonth, period.endMonth) : 24, // Number of months to generate from the start date.
  capacityPerMonth, // Base units for the first month.
  capacityGrowthRate // Optional growth rate per month (e.g. 0.03 = +3%).
);

// OR Manually  Set Capacity Plan

const serviceCapacityPlan = [
    {
        "month": "2025-12",
        "capacity": 15
    },
    {
        "month": "2026-01",
        "capacity": 16
    },
    {
        "month": "2026-02",
        "capacity": 18
    },
    {
        "month": "2026-03",
        "capacity": 19
    },
    {
        "month": "2026-04",
        "capacity": 21
    },
    {
        "month": "2026-05",
        "capacity": 23
    },
    {
        "month": "2026-06",
        "capacity": 25
    },
    {
        "month": "2026-07",
        "capacity": 27
    },
    {
        "month": "2026-08",
        "capacity": 30
    },
    {
        "month": "2026-09",
        "capacity": 33
    },
    {
        "month": "2026-10",
        "capacity": 36
    },
    {
        "month": "2026-11",
        "capacity": 39
    },
    {
        "month": "2026-12",
        "capacity": 42
    },
    {
        "month": "2027-01",
        "capacity": 46
    },
    {
        "month": "2027-02",
        "capacity": 50
    },
    {
        "month": "2027-03",
        "capacity": 55
    },
    {
        "month": "2027-04",
        "capacity": 60
    },
    {
        "month": "2027-05",
        "capacity": 65
    },
    {
        "month": "2027-06",
        "capacity": 71
    },
    {
        "month": "2027-07",
        "capacity": 77
    },
    {
        "month": "2027-08",
        "capacity": 84
    },
    {
        "month": "2027-09",
        "capacity": 92
    },
    {
        "month": "2027-10",
        "capacity": 100
    },
    {
        "month": "2027-11",
        "capacity": 109
    }
];

newService.setCapacity([...serviceCapacityPlan]);

// Dynamically change the rate price if needed
newService.setRateAmount(400); // Raw number will automatically be parsed into MajikMoney

// Dynamically change the rate unit if needed
/*
  PER_HOUR = "Per Hour",
  PER_DAY = "Per Day",
  PER_SESSION = "Per Session",
  FIXED = "Per Fixed",
  PER_UNIT = "Per Unit", // e.g., usage-based
*/
newService.setRateUnit(RateUnit.PER_HOUR);

// Dynamically change the name if needed
newService.setName("General Cleaning");

//Dynamically set a description either both in text/html or either (TipTap compatible)
newService.setDescription(
            `<p>This is a new service</p>`, // HTML Content
            "This is a new service" // Plain Text
          );

newService.setDescriptionText(
            "This is a new service" // Plain Text
          );

newService.setDescriptionHTML(
             `<p>This is a new service</p>` // HTML Content
          );

// When done, validate before finalizing and passing to revenue stream

newService.validateSelf(true); // Set to true to throw an error, Defaults to false - returns a plain boolean for custom conditions


// Use addRevenue from the MajikRunway class to add this new service
runway.addRevenue(newService);


```
> The new `MajikService` will now be added as a new item in `RevenueStream` and return an updated `MajikRunway` instance.


#### Add/Manage Subscriptions to Revenue Stream

```ts
import { MajikSubscription } from "@thezelijah/majik-subscription";
import { MajikRunway } from "@thezelijah/majik-runway";
import { MajikMoney } from "@thezelijah/majik-money";
import { BusinessModelType, VATMode } from "@thezelijah/majik-runway/enums";
import { RevenueStream } from "@thezelijah/majik-runway/revenue";
import { ExpenseBreakdown } from "@thezelijah/majik-runway/expenses";
import {
  monthsInPeriod,
  offsetMonthsToYYYYMM,
} from "@thezelijah/majik-runway/utils";
// Create a new Subscription Instance

const newSubscription = MajikSubscription.initialize(
  "Majik Distro Pro",
  SubscriptionType.RECURRING,
  {
    amount: MajikMoney.fromMajor(999,"PHP"),
    unit: RateUnit.PER_USER,
    billingCycle: BillingCycle.MONTHLY,
  }
);

// Prepare and create COS manually - make sure unitCost and subtotal are MajikMoney class instances (Use MajikMoney.fromMajor())
const subscriptionCOS = [
    {
        "id": "mjksubcost-Co7mq4hj",
        "item": "Cloud Services",
        "quantity": 1,
        "unitCost": {
            "__type": "MajikMoney",
            "amount": "2500",
            "currency": "PHP"
        },
        "unit": "MONTH",
        "subtotal": {
            "__type": "MajikMoney",
            "amount": "2500",
            "currency": "PHP"
        }
    },
    {
        "id": "mjksubcost-fm1bQNGp",
        "item": "Customer Support",
        "quantity": 1,
        "unitCost": {
            "__type": "MajikMoney",
            "amount": "2000",
            "currency": "PHP"
        },
        "unit": "MONTH",
        "subtotal": {
            "__type": "MajikMoney",
            "amount": "2000",
            "currency": "PHP"
        }
    }
];

// Set Cost of Service and replace the entire list/array
newSubscription.setCOS([...subscriptionCOS]);

// OR push one COS at a time (automatic generation of ID and auto computation of subtotal)

newSubscription.addCOS(
  "Cloud Services",
  MajikMoney.fromMajor(parseFloat(25), "PHP"),
  1,
  "MONTH"
);

// Generate Capacity Plan

newSubscription.generateCapacityPlan(
  !!period ? monthsInPeriod(period.startMonth, period.endMonth) : 24, // Number of months to generate from the start date.
  capacityPerMonth, // Base units for the first month.
  capacityGrowthRate // Optional growth rate per month (e.g. 0.03 = +3%).
);

// OR Manually  Set Capacity Plan

const subscriptionCapacityPlan = [
    {
        "month": "2025-12",
        "capacity": 16
    },
    {
        "month": "2026-01",
        "capacity": 16
    },
    {
        "month": "2026-02",
        "capacity": 17
    },
    {
        "month": "2026-03",
        "capacity": 17
    },
    {
        "month": "2026-04",
        "capacity": 18
    },
    {
        "month": "2026-05",
        "capacity": 19
    },
    {
        "month": "2026-06",
        "capacity": 19
    },
    {
        "month": "2026-07",
        "capacity": 20
    },
    {
        "month": "2026-08",
        "capacity": 20
    },
    {
        "month": "2026-09",
        "capacity": 21
    },
    {
        "month": "2026-10",
        "capacity": 22
    },
    {
        "month": "2026-11",
        "capacity": 22
    },
    {
        "month": "2026-12",
        "capacity": 23
    },
    {
        "month": "2027-01",
        "capacity": 23
    },
    {
        "month": "2027-02",
        "capacity": 24
    },
    {
        "month": "2027-03",
        "capacity": 25
    },
    {
        "month": "2027-04",
        "capacity": 26
    },
    {
        "month": "2027-05",
        "capacity": 26
    },
    {
        "month": "2027-06",
        "capacity": 27
    },
    {
        "month": "2027-07",
        "capacity": 28
    },
    {
        "month": "2027-08",
        "capacity": 29
    },
    {
        "month": "2027-09",
        "capacity": 30
    },
    {
        "month": "2027-10",
        "capacity": 31
    },
    {
        "month": "2027-11",
        "capacity": 32
    }
];

newSubscription.setCapacity([...subscriptionCapacityPlan]);

// Dynamically change the rate price if needed
newSubscription.setRateAmount(400); // Raw number will automatically be parsed into MajikMoney

// Dynamically change the rate unit if needed
/*
  PER_SUBSCRIBER = "Per Subscriber",
  PER_ACCOUNT = "Per Account",
  PER_USER = "Per User",
  PER_MONTH = "Per Month"
*/
newSubscription.setRateUnit(RateUnit.PER_MONTH);

// Dynamically change the billing cycle if needed
/*
   DAILY = "Daily",
  WEEKLY = "Weekly",
  MONTHLY = "Monthly",
  QUARTERLY = "Quarterly",
  YEARLY = "Yearly"
*/
newSubscription.setBillingCycle(BillingCycle.MONTHLY);

// Dynamically change the name if needed
newSubscription.setName("Majik Distro Advanced Plus");

//Dynamically set a description either both in text/html or either (TipTap compatible)
newSubscription.setDescription(
            `<p>This is a new subscription</p>`, // HTML Content
            "This is a new subscription" // Plain Text
          );

newSubscription.setDescriptionText(
            "This is a new subscription" // Plain Text
          );

newSubscription.setDescriptionHTML(
             `<p>This is a new subscription</p>` // HTML Content
          );

// When done, validate before finalizing and passing to revenue stream

newSubscription.validateSelf(true); // Set to true to throw an error, Defaults to false - returns a plain boolean for custom conditions


// Use addRevenue from the MajikRunway class to add this new subscription
runway.addRevenue(newSubscription);


```
> The new MajikSubscription will now be added as a new item in `RevenueStream` and return an updated `MajikRunway` instance.


#### Update Existing Revenue Item

```ts
// To edit/update an item

const updatedRevisedProduct = newProduct.setName("Hello Phone");

// This method accepts MajikProduct, MajikService or MajikSubscription

runway.updateRevenueItem(
  updatedRevisedProduct.id, // The ID of the product you want to update
  updatedRevisedProduct // The updated product
);


```
> The updated `MajikProduct`/`MajikService`/`MaikSubscription` will now be reflected in the current `RevenueStream` and return an updated `MajikRunway` instance.

#### Remove an Existing Revenue Item

```ts
// To remove/delete an item

runway.removeRevenueByID(
  updatedItem.id // The ID of the product you want to remove
);

```
> The removed `MajikProduct`/`MajikService`/`MaikSubscription` will now be reflected in the current `RevenueStream` and return an updated `MajikRunway` instance.
---


### Expenses and Operating Costs

Expenses are grouped under an `ExpenseBreakdown`.

> Expense instances are immutable and return a new instance when updated.

Expenses directly affect:
- Monthly burn
- Cash balance
- Runway length

Expense types may include:
- Fixed
- Variable
- One-time


---

#### Add/Manage Expenses

There are 3 main types of expenses you can create:
- One Time
- Recurring
- Capital

##### Create Recurring Expense

Recurring expenses represent predictable, repeating cash outflows that occur every month within an active period.

Examples include:

- Salaries and contractor payments
- Rent and utilities
- Software subscriptions
- Baseline infrastructure costs

Characteristics:

- Applied monthly between a defined start and end period
- Reduce cash balance every month they are active
- Contribute directly to monthly burn
- Commonly classified as `Operating` or `Variable`

> Recurring expenses form the structural baseline of a company’s burn rate.

```ts
import { Expense } from "@thezelijah/majik-runway/expenses/expense";
import { Recurrence } from "./enums";


const newExpense = Expense.recurring(
  undefined, // Optional ID. If undefined, automatically generates one
  "Office Rent",
  15000, // Automatically parses into MajikMoney
  "PHP",
  Recurrence.Monthly,
  period, // use  the same Period you have from your MajikRunway instance
  true, // Set to false if not Tax Deductible (defaults to false)
);


// Use addExpense from the MajikRunway class to add this new expense item
runway.addExpense(newExpense)

// To quickly create and add directly use this method (No need to input period, uses the runway's period)
runway.addRecurringExpense(
  "Office Rent",
  15000, // Automatically parses into MajikMoney
  "PHP",
  Recurrence.Monthly,
  true, // Set to false if not Tax Deductible (defaults to false)
  undefined  // Optional ID. If undefined, automatically generates one
)


```
> The new `Expense` will now be added as a new item in `ExpenseBreakdown` and return an updated `MajikRunway` instance.

##### Create One Time Expense

One-time expenses represent single, non-recurring cash outflows that occur in a specific month.

Examples include:

- Legal and incorporation fees
- Marketing launches or campaigns
- One-off consulting or audit work
- Setup or migration costs

Characteristics:

- Occur once at a specific `YYYYMM`
- Reduce cash in the month they occur
- Do not persist or repeat
- May be classified as `Operating` or `Variable`

> One-time expenses often cause short-term spikes in burn but do not affect long-term baseline costs.

```ts
import { Expense } from "@thezelijah/majik-runway/expenses/expense";

  
const newExpense = Expense.oneTime(
  undefined,  // Optional ID. If undefined, automatically generates one
  "Event PubMats",
  35000, // Automatically parses into MajikMoney
  "PHP",
  "2026-10", // Date in YYYY-MM string format
  true, // Set to false if not Tax Deductible (defaults to false)
);


// Use addExpense from the MajikRunway class to add this new expense item
runway.addExpense(newExpense)

// To quickly create and add directly use this method 
runway.addOneTimeExpense(
  "Event PubMats",
  35000, // Automatically parses into MajikMoney
  "PHP",
  "2026-10", // Date in YYYY-MM string format
  true, // Set to false if not Tax Deductible (defaults to false)
  undefined  // Optional ID. If undefined, automatically generates one
)


```
> The new `Expense` will now be added as a new item in `ExpenseBreakdown` and return an updated `MajikRunway` instance.

##### Create Capital Expense

Capital expenses represent large, strategic cash outflows intended to support long-term operations or growth.

Examples include:

- Equipment and hardware purchases
- Initial product or platform build costs
- Long-term tooling or infrastructure investments

Characteristics:

- Typically one-time and high-value
- Classified explicitly as `ExpenseType.Capital`
- Reduce cash immediately in the month they occur
- Are not depreciated or amortized

> In Majik Runway, capital expenses are treated as direct cash outflows to preserve cash-flow realism.

```ts
import { Expense } from "@thezelijah/majik-runway/expenses/expense";

  
const newExpense = Expense.capital(
  undefined,  // Optional ID. If undefined, automatically generates one
  "Photocopy Machine",
  35000, // Automatically parses into MajikMoney
  "PHP",
  "2026-10", // Date in YYYY-MM string format
  36, // Number of months to depreciate
  undefined, // Optional residual value after depreciation
  true, // Set to false if not Tax Deductible (defaults to false)
);
        
// Use addExpense from the MajikRunway class to add this new expense item
runway.addExpense(newExpense)

// To quickly create and add directly use this method 
runway.addCapitalExpense(
  "Photocopy Machine",
  35000, // Automatically parses into MajikMoney
  36, // Number of months to depreciate
  "PHP",
  "2026-10", // Date in YYYY-MM string format
  undefined, // Optional residual value after depreciation
  true, // Set to false if not Tax Deductible (defaults to false)
  undefined  // Optional ID. If undefined, automatically generates one
)


```
> The new expense will now be added as a new item in expense breakdown and return an updated MajikRunway instance.


#### Update an Existing Expense Item

```ts
// To update an existing item

const updatedRevisedExpense = newExpense
.rename("Hello Phone") // Renames the expense
.withAmount(MajikMoney.fromMajor(500),"PHP"); // Updates the amount

// Important: Since expense instances are immutable, all update methods return a new instance 

// This method accepts Expense

runway.updateExpenseItem(
  updatedRevisedExpense.id, // The ID of the expense you want to update
  updatedRevisedExpense // The updated expense instance
);

```
> The updated expense will now be reflected in the current expense breakdown and return an updated MajikRunway instance.


#### Remove an Existing Expense Item

```ts
// To remove/delete an item

runway.removeExpenseByID(
  updatedItem.id // The ID of the expense you want to remove
);

```
> The removed expense will now be reflected in the current expense breakdown and return an updated MajikRunway instance.

---

### Funding

Funding events are managed under the `FundingManager`.

> Funding instances are immutable and return a new instance when updated.

Funding directly affects:

- Cash balance
- Runway length
- Liquidity over time

Funding does not directly affect:

- Revenue
- Profit or margins
- Operating burn

Each funding event:

- Occurs at a specific `YYYYMM`
- Injects cash into the model
- Is treated as a non-operational cash inflow
- Has no implicit dilution, repayment, or interest unless explicitly modeled

Majik Runway treats funding as capital flow, fully decoupled from operational performance.

---

#### Add/Manage Funding Events

There are 3 main types of funding events you can create:
- Equity
- Debt
- Grant

##### Create Equity Funding Event

Equity funding represents capital raised in exchange for ownership in the company.

Examples include:

- Angel investments
- Venture capital rounds
- Founder capital contributions

Characteristics:

- Increases cash balance in the month received
- Does not count as revenue
- Does not affect profit or margins
- Has no implicit dilution modeling

In Majik Runway, equity funding is treated purely as a cash injection, separate from ownership or valuation mechanics.

```ts
import { FundingEvent } from "@thezelijah/majik-runway/funding/funding";


const newFundingEvent = FundingEvent.equity(
  "Round 1 Funding",
  300000, // Automatically parses into MajikMoney
  "2026-10", // Date in YYYY-MM string format
  "PHP",
  undefined // Optional ID. If undefined, automatically generates one
);



// Use addFundingEvent from the MajikRunway class to add this new funding event
runway.addFundingEvent(newFundingEvent)

// To quickly create and add directly use this method 
runway.addEquity(
  "Round 1 Funding",
  300000, // Automatically parses into MajikMoney
  "2026-10", // Date in YYYY-MM string format
  undefined // Optional ID. If undefined, automatically generates one
)


```
> The new `FundingEvent` will now be added as a new item inside `FundingManager` and return an updated `MajikRunway` instance.

##### Create Debt Funding Event

```ts
import { FundingEvent } from "@thezelijah/majik-runway/funding/funding";


const newFundingEvent = FundingEvent.debt(
  "BPI Loan",
  300000, // Automatically parses into MajikMoney
  "2026-10", // Date in YYYY-MM string format
  new Date().toISOString(), // ISO date string representing when the debt must be fully repaid
  "PHP",
  0.05, // Annual interest rate as a decimal ratio (default: 0, e.g., 0.05 for 5%)
  0, // Upfront payment at the start of the loan (default: 0)
  undefined // Optional ID. If undefined, automatically generates one
);



// Use addFundingEvent from the MajikRunway class to add this new funding event
runway.addFundingEvent(newFundingEvent)

// To quickly create and add directly use this method 
runway.addDebt(
 "BPI Loan",
  300000, // Automatically parses into MajikMoney
  "2026-10", // Date in YYYY-MM string format
  new Date().toISOString(), // ISO date string representing when the debt must be fully repaid
  "PHP",
  0.05, // Annual interest rate as a decimal ratio (default: 0, e.g., 0.05 for 5%)
  0, // Upfront payment at the start of the loan (default: 0)
  undefined // Optional ID. If undefined, automatically generates one
)


```
> The new `FundingEvent` will now be added as a new item inside `FundingManager` and return an updated `MajikRunway` instance.

##### Create Grant Funding Event

```ts
import { FundingEvent } from "@thezelijah/majik-runway/funding/funding";


const newFundingEvent = FundingEvent.grant(
  "Round 1 Funding",
  300000, // Automatically parses into MajikMoney
  "2026-10", // Date in YYYY-MM string format
  "PHP",
  undefined // Optional ID. If undefined, automatically generates one
);



// Use addFundingEvent from the MajikRunway class to add this new funding event
runway.addFundingEvent(newFundingEvent)

// To quickly create and add directly use this method 
runway.addGrant(
  "Round 1 Funding",
  300000, // Automatically parses into MajikMoney
  "2026-10", // Date in YYYY-MM string format
  undefined // Optional ID. If undefined, automatically generates one
)


```
> The new `FundingEvent` will now be added as a new item inside `FundingManager` and return an updated `MajikRunway` instance.


#### Update an Existing Funding Event

```ts
// To update an existing item

const updatedRevisedFunding= newFundingEvent
.rename("HSBC Loan") // Renames the funding event
.reschedule("2028-03") // Reschedules the funding to another date
.withAmount(MajikMoney.fromMajor(250000),"PHP"); // Updates the amount

// Important: Since fudning event instances are immutable, all update methods return a new instance 

// This method accepts FundingEvent

runway.updateFundingEvent(
  updatedRevisedFunding.id, // The ID of the expense you want to update
  updatedRevisedFunding // The updated expense instance
);

```
> The updated `FundingEvent` will now be reflected in the current `FundingManager` and return an updated `MajikRunway` instance.


#### Remove an Existing Funding Event

```ts
// To remove/delete an item

runway.removeFundingByID(
  updatedItem.id // The ID of the funding event you want to remove
);

```
> The removed `FundingEvent` will now be reflected in the current `FundingManager` and return an updated `MajikRunway` instance.

---

### Tax Configuration

Majik Runway supports VAT and Non-VAT systems with income tax modeling.

```ts
import { TaxConfig } from "@thezelijah/majik-runway/types/tax";

// To set/update your MajikRunway instance's tax config pass the new taxconfig object to the updateModel

const newTaxConfig: TaxConfig = {
  vatMode: VATMode.VAT,
  vatRate: 0.12,             // VAT businesses
  percentageTaxRate: 0.03,   // Non-VAT businesses
  incomeTaxRate: 0.08,
}

runway.updateTaxConfig(newTaxConfig); 

```
Rules:

- VAT & Percentage Tax are mutually exclusive
- Taxes are applied automatically to projections
- Net cashflow reflects tax impact

---

### Initial Cash & Currency

Initial cash defines your starting runway position (opening balance).

```ts

// Construct the initial cash using MajikMoney
const initialCash = MajikMoney.fromMajor(15000,"PHP");


// Include the initial cash upon setup/initialization of your MajikRunway instance
const runwayInstance = MajikRunway.initialize({
// .. insert other parameters
  money: initialCash,
});


// To set/update your MajikRunway instance's initial cash pass the new MajikMoney to the updateModel() method of MajikRunway

runway.updateModel({
  money: MajikMoney.fromMajor(25000,"PHP"),
}); 

// Or to quickly update it directly

runway.setInitialCash(MajikMoney.fromMajor(25000,"PHP"));

```
Rules:
- All internal computations use MajikMoney
- Currency consistency is enforced
- Avoid raw numbers


---

### Updating the Model

Majik Runway is designed to be mutable.

You can update:

- Business model
- Period
- Tax assumptions
- Revenue streams (Products, Services, and Subscription Plans)
- Expenses
- Initial Cash (Opening Balance)

All changes recompute projections instantly.

```ts
interface BusinessModel {
  money: MajikMoney;
  expenses: ExpenseBreakdown;
  revenues: RevenueStream;
  taxConfig: TaxConfig;
  funding: FundingManager;
  type?: BusinessModelType;
  period: PeriodYYYYMM;
  id?: string;
}

runway.updateModel({
 // pass in partial properties
}); 


```
---

## Mental Model

```css
[ Assumptions ]
      ↓
[ Revenue Streams ] + [ Expenses ] + [ Funding ] + [ Taxes ]
      ↓
[ Monthly Cashflow Engine ]
      ↓
[ Burn Rate & Runway Projection ]

```

- `MajikRunway` is the central financial engine.
- Revenue, Expense, Funding, Tax are pluggable sub-managers.
- Dashboard Snapshot is your single source of truth for rendering.
- Updating any sub-manager triggers a refresh / recompute.
- Charts consume methods from each sub-manager for time-series or trend plotting.
- Dynamic coloring thresholds provide visual alerts for financial health.

### Why This Design Works

- Finance-correct but intuitive
- No spreadsheet drift
- Reactive & composable
- UI-agnostic
- Investor-ready projections

---

## Example Usage

```ts
import {
  SubscriptionType,
  RateUnit,
  BillingCycle,
  CapacityPeriodResizeMode,
} from "@thezelijah/majik-subscription/enums";
import { MajikMoney } from "@thezelijah/majik-money";


const proPlan = MajikSubscription.initialize(
  "Pro Plan",
  SubscriptionType.RECURRING,
  {
    amount: MajikMoney.fromMajor(499, "PHP"),
    unit: RateUnit.PER_USER,
    billingCycle: BillingCycle.MONTHLY,
  },
  "Advanced SaaS plan",
  "PRO-PLAN-001"
)
  .setDescriptionHTML("<p>Best plan for growing teams.</p>")
  .setDescriptionSEO("Pro SaaS subscription plan")
  .addCOS("Cloud Hosting", MajikMoney.fromMajor(300, "PHP"), 1, "per user")
  .addCOS("Customer Support", MajikMoney.fromMajor(100, "PHP"), 1, "per user")
  .generateCapacityPlan(12, 500) // 12 months, 500 subscribers
  .recomputeCapacityPeriod(
    "2025-01",
    "2025-12",
    CapacityPeriodResizeMode.DISTRIBUTE
  );

// Capacity insights
console.log("Total Capacity:", proPlan.totalCapacity);

// Monthly finance
const month = "2025-06";
console.log(`${month} Revenue:`, proPlan.getRevenue(month).value.toFormat());
console.log(`${month} COS:`, proPlan.getCOS(month).value.toFormat());
console.log(`${month} Profit:`, proPlan.getProfit(month).value.toFormat());
console.log(`${month} Margin:`, proPlan.getMargin(month).toFixed(2) + "%");

// Serialization
const json = proPlan.toJSON();
const restored = MajikSubscription.parseFromJSON(json);

console.log("Restored Subscription:", restored.metadata.description.text);
```

---

## Dashboard Integration & Real-Time Financial Modeling

This section demonstrates how Majik Runway is designed to be used inside a production-grade dashboard. Instead of treating financial logic as isolated calculations, Majik Runway acts as a single source of truth that powers KPIs, charts, health indicators, and editable financial modules in real time.

The example below shows how to wire `MajikRunway` into a **React** / **Next.js** dashboard, enabling:

- Live runway and burn calculations
- Revenue, expense, funding, and tax modeling
- Health indicators and financial risk signals
- Interactive charts and managers
- Immutable updates with snapshot-based rendering

```tsx
"use client";

import React, { useMemo, useState } from "react";
import styled from "styled-components";
import {
  ChartLineIcon,
  CurrencyDollarSimpleIcon,
  GaugeIcon,
  CoinsIcon,
  GearIcon,
  BankIcon,
  InfoIcon,
  TrendUpIcon,
  FireIcon,
  ScalesIcon,
  CalendarXIcon,
} from "@phosphor-icons/react";
import DynamicPagedTab, {
  TabContent,
} from "@/components/functional/DynamicPagedTab";
import { MajikRunway } from "@/SDK/tools/business/majik-runway/majik-runway";

import ChartRevenueTrend from "./Charts/ChartRevenueTrend";
import ChartExpensePie from "./Charts/ChartExpensePie";
import ChartCashflowBar from "./Charts/ChartCashflowBar";
import RevenueStreamManager from "./RevenueStreams/RevenueStreamManager";
import ExpenseManager from "./Expenses/ExpenseManager";
import { RevenueStream } from "@/SDK/tools/business/majik-runway/revenue";
import { ExpenseBreakdown } from "@/SDK/tools/business/majik-runway/expenses/expense-breakdown";
import { toast } from "sonner";
import RunwayTaxConfig from "./RunwayTaxConfig";
import { TaxConfig } from "@/SDK/tools/business/majik-runway/types/tax";
import { formatPercentage } from "@/utils/helper";
import moment from "moment";
import { yyyyMMToDate } from "@/SDK/tools/business/majik-runway/utils";
import MajikRunwayHealthIndicator from "./MajikRunwayHealthIndicator";
import { DynamicColoredValue } from "@/components/foundations/DynamicColoredValue";
import theme from "@/globals/theme";
import FundingEventsManager from "./Funding/FundingEventsManager";
import { FundingManager } from "@/SDK/tools/business/majik-runway/funding/funding-manager";
import ChartFundingTimeSeries from "./Charts/ChartFundingTimeSeries";
import ChartExpenseTrend from "./Charts/ChartExpenseTrend";
import { TargetIcon } from "lucide-react";
import ChartGrossMarginTrend from "./Charts/ChartGrossMarginTrend";

// ======== Styled Components ========
const RootContainer = styled.div`
// css
`;

const HeaderCards = styled.div`
// css
`;

const TopHeaderRow = styled.div`
// css
`;

const Card = styled.div`
// css
`;

const CardTitle = styled.div`
// css
`;

const CardValue = styled.div`
// css
`;

const CardSubtext = styled.div`
// css
`;

const MainGrid = styled.div`
// css
`;

const ChartPlaceholder = styled.div`
// css
`;

interface DashboardMajikRunwayProps {
  runway: MajikRunway;
  onUpdate?: (newRunway: MajikRunway) => void;
}

// ======== Main Component ========

const DashboardMajikRunway: React.FC<DashboardMajikRunwayProps> = ({
  runway,
  onUpdate,
}) => {
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const dashboardSnapshot = useMemo(
    () => runway.getDashboardSnapshot(),

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [runway, refreshKey]
  );

  const revenueStream = useMemo(
    () => runway.revenueStream(),

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [runway, refreshKey]
  );

  const expense = useMemo(
    () => runway.expenseBreakdown(),

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [runway, refreshKey]
  );

  const fundingManager = useMemo(
    () => runway.funding(),

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [runway, refreshKey]
  );

  const cashflow = useMemo(
    () => runway.getCashflowPlotlyBar(),

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [runway, refreshKey]
  );

  const taxConfig = useMemo(
    () => runway.taxConfig(),

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [runway, refreshKey]
  );

  const handleUpdateRevenueStream = (input: RevenueStream) => {
    try {
      console.log("Revenue Stream: ", input);
      const updatedRunway = runway.updateModel({
        revenues: input,
      });

      setRefreshKey((prev) => prev + 1);
      onUpdate?.(updatedRunway);
    } catch (error) {
      console.error("Problem while updating Revenue Stream: ", error);
      toast.error("Error", {
        description: `Oops! There seems to be a problem while updating: ${error}`,
        id: "error-input-majik-runway-dashboard-revenue",
      });
    }
  };

  const handleUpdateExpenseBreakdown = (input: ExpenseBreakdown) => {
    try {
      console.log("Expense Breakdown: ", input);
      const updatedRunway = runway.updateModel({
        expenses: input,
      });
      setRefreshKey((prev) => prev + 1);
      onUpdate?.(updatedRunway);
    } catch (error) {
      console.error("Problem while updating Expense Breakdown: ", error);
      toast.error("Error", {
        description: `Oops! There seems to be a problem while updating: ${error}`,
        id: "error-input-majik-runway-dashboard-expense",
      });
    }
  };

  const handleUpdateFundingManager = (input: FundingManager) => {
    try {
      console.log("Funding Manager: ", input);
      const updatedRunway = runway.updateModel({
        funding: input,
      });
      setRefreshKey((prev) => prev + 1);
      onUpdate?.(updatedRunway);
    } catch (error) {
      console.error("Problem while updating Funding Manager: ", error);
      toast.error("Error", {
        description: `Oops! There seems to be a problem while updating: ${error}`,
        id: "error-input-majik-runway-dashboard-funding",
      });
    }
  };

  const handleUpdateTaxConfig = (input: TaxConfig) => {
    try {
      console.log("Tax Config: ", input);
      const updatedRunway = runway.updateModel({
        taxConfig: input,
      });
      setRefreshKey((prev) => prev + 1);
      onUpdate?.(updatedRunway);
    } catch (error) {
      console.error("Problem while updating Tax Config: ", error);
      toast.error("Error", {
        description: `Oops! There seems to be a problem while updating: ${error}`,
        id: "error-input-majik-runway-dashboard-tax",
      });
    }
  };

  const InformationTabs: TabContent[] = [
    {
      id: "info-overview",
      name: "Overview",
      icon: InfoIcon,
      content: (
        <>
          <TopHeaderRow>
            <MajikRunwayHealthIndicator
              health={dashboardSnapshot.runwayHealth}
            />
          </TopHeaderRow>

          {/* ===== Header / KPI Cards ===== */}
          <HeaderCards>
            <Card>
              <CardTitle>
                <CoinsIcon size={20} /> Runway Remaining
              </CardTitle>
              <CardValue>
                <DynamicColoredValue
                  value={dashboardSnapshot.runwayMonths} // numeric months remaining
                  colorsMap={[
                    { color: theme.colors.error, max: 2.99 }, // red if less than 3 months
                    { color: theme.colors.brand.white, min: 3, max: 6 }, // yellow if 3–6 months
                    { color: theme.colors.brand.green, min: 6.01 }, // green if above 6 months
                  ]}
                  size={28}
                  weight={700}
                >
                  {dashboardSnapshot.runwayMonths} months
                </DynamicColoredValue>
              </CardValue>
            </Card>
            <Card>
              <CardTitle>
                <CurrencyDollarSimpleIcon size={20} /> Opening Balance
              </CardTitle>
              <CardValue>{dashboardSnapshot.cashOnHand.format()}</CardValue>
            </Card>
            <Card>
              <CardTitle>
                <BankIcon size={20} /> Total Funding
              </CardTitle>
              <CardValue>
                {dashboardSnapshot.funding.totalFunding.format()}
              </CardValue>
            </Card>
            <Card>
              <CardTitle>
                <GaugeIcon size={20} /> Net Monthly Burn
              </CardTitle>
              <CardValue>
                <DynamicColoredValue
                  value={dashboardSnapshot.avgNetBurn.toMajor()}
                  colorsMap={[
                    { color: theme.colors.brand.green, max: -1 }, // green if negative
                    { color: theme.colors.brand.white, min: 0, max: 0 }, // yellow if zero
                    { color: theme.colors.error, min: 1 }, // red if positive
                  ]}
                  size={28}
                  weight={700}
                >
                  {dashboardSnapshot.avgNetBurn.format()}
                </DynamicColoredValue>
              </CardValue>
            </Card>
            <Card>
              <CardTitle>
                <ChartLineIcon size={20} /> Projected Revenue Next Month
              </CardTitle>
              <CardValue>
                {dashboardSnapshot.nextMonthRevenue.format()}
              </CardValue>
            </Card>
          </HeaderCards>
          {/* ===== SubHeader / Secondary KPI Cards ===== */}
          <HeaderCards>
            <Card>
              <CardTitle>
                <TargetIcon size={20} />
                Break-Even Month
              </CardTitle>
              <CardValue>
                {dashboardSnapshot.breakEvenMonth ?? "Not Available"}
                <CardSubtext>
                  {!!dashboardSnapshot.breakEvenMonth
                    ? moment(
                        yyyyMMToDate(dashboardSnapshot.breakEvenMonth)
                      ).fromNow()
                    : null}
                </CardSubtext>
              </CardValue>
            </Card>
            <Card>
              <CardTitle>
                <TrendUpIcon size={20} />
                Revenue Growth Rate (MoM)
              </CardTitle>
              <CardValue>
                {formatPercentage(
                  dashboardSnapshot.revenueGrowthRateCMGR ?? 0,
                  true
                )}
              </CardValue>
            </Card>
            <Card>
              <CardTitle>
                <FireIcon size={20} />
                Burn Efficiency
              </CardTitle>
              <CardValue>
                <DynamicColoredValue
                  value={dashboardSnapshot.burnEfficiency ?? 0}
                  colorsMap={[
                    { color: theme.colors.error, max: 1 },
                    { color: theme.colors.brand.white, min: 1.1, max: 6 },
                    { color: theme.colors.brand.green, min: 6.1 },
                  ]}
                  size={28}
                  weight={700}
                >
                  {formatPercentage(
                    dashboardSnapshot.burnEfficiency ?? 0,
                    true
                  )}
                </DynamicColoredValue>
              </CardValue>
            </Card>
            <Card>
              <CardTitle>
                <ScalesIcon size={20} />
                Debt Ratio
              </CardTitle>
              <CardValue>
                <DynamicColoredValue
                  value={dashboardSnapshot.funding.debtRatio ?? 0}
                  colorsMap={[
                    { color: theme.colors.brand.green, max: 0.3 }, // Healthy (low debt)
                    { color: theme.colors.brand.white, min: 0.31, max: 0.6 }, // Moderate
                    { color: theme.colors.error, min: 0.61 }, // Risky (high debt)
                  ]}
                  size={28}
                  weight={700}
                >
                  {formatPercentage(
                    dashboardSnapshot.funding.debtRatio ?? 0,
                    true
                  )}
                </DynamicColoredValue>
              </CardValue>
            </Card>
            <Card>
              <CardTitle>
                <CalendarXIcon size={20} />
                Cash-Out Date
              </CardTitle>
              <CardValue>
                {dashboardSnapshot.cashOutDate ?? "Not Available"}
              </CardValue>
            </Card>
          </HeaderCards>

          {/* ===== Main Grid / Charts ===== */}
          <MainGrid>
            <ChartPlaceholder>
              <ChartRevenueTrend
                data={revenueStream.toMonthlyRevenueTraces()}
              />
            </ChartPlaceholder>
            <ChartPlaceholder>
              <ChartCashflowBar data={cashflow} />
            </ChartPlaceholder>
            <ChartPlaceholder>
              <ChartExpenseTrend data={expense.getExpenseTrendByCategory()} />
            </ChartPlaceholder>
            <ChartPlaceholder>
              <ChartExpensePie data={expense.expenseBreakdownPlot()} />
            </ChartPlaceholder>

            <ChartPlaceholder>
              <ChartFundingTimeSeries
                data={fundingManager.generateFundingTimeSeries()}
              />
            </ChartPlaceholder>

            <ChartPlaceholder>
              <ChartGrossMarginTrend
                data={revenueStream.toGrossMarginTrendTraces()}
              />
            </ChartPlaceholder>
          </MainGrid>
        </>
      ),
    },
    {
      id: "info-revenue",
      name: "Revenue Streams",
      icon: CurrencyDollarSimpleIcon,
      content: (
        <>
          <RevenueStreamManager
            revenueStream={revenueStream}
            onUpdate={handleUpdateRevenueStream}
          />
        </>
      ),
    },
    {
      id: "info-expenses",
      name: "Expenses",
      icon: GaugeIcon,
      content: (
        <>
          <ExpenseManager
            expenseBreakdown={expense}
            onUpdate={handleUpdateExpenseBreakdown}
          />
        </>
      ),
    },
    {
      id: "info-funding",
      name: "Funding Events",
      icon: BankIcon,
      content: (
        <>
          {" "}
          <FundingEventsManager
            fundingManager={fundingManager}
            onUpdate={handleUpdateFundingManager}
          />
        </>
      ),
    },
    {
      id: "info-tax",
      name: "Tax Configuration",
      icon: GearIcon,
      content: (
        <>
          <RunwayTaxConfig
            formData={taxConfig}
            onSubmit={handleUpdateTaxConfig}
          />
        </>
      ),
    },
  ];

  return (
    <RootContainer>
      {/* ===== Tabs ===== */}

      <DynamicPagedTab tabs={InformationTabs} position="left" />
    </RootContainer>
  );
};

export default DashboardMajikRunway;

```

---
## Utilities

- `validateSelf`(throwError?: boolean) → validates all required fields
- `finalize`() → converts to JSON with auto-generated ID
- `toJSON`() → serialize with proper `MajikMoney` handling
- `parseFromJSON`(json: string | object) → reconstruct a `MajikSubscription` instance

---

## Use Cases

### What is Majik Runway Used For?

MajikRunway is a financial modeling and runway simulation engine designed to help teams understand, forecast, and control cash flow, burn, growth, and sustainability over time.
It is optimized for startups, creative businesses, SaaS products, agencies, and investor-facing financial planning.

###  Core Use Cases
**1. Startup Runway & Burn Management**

- Calculate cash runway in months based on current burn rate
- Track net burn vs gross burn
- Identify break-even points
- Simulate cost increases or revenue growth
- Evaluate survival scenarios under different funding conditions


***Real-world application***

> “How many months do we survive if revenue stalls for 3 months?”

**2. Funding & Capital Planning**

- Model equity injections, grants, loans, and convertible notes
- Simulate funding rounds over time
- Measure dilution impact vs runway extension
- Evaluate when the next raise is required
- Compare bootstrapping vs fundraising paths

***Real-world application***

> “If we raise PHP 500K now vs PHP 1M later, how does our runway change?”

**3. SaaS & Subscription Financial Modeling**

- Track MRR, ARR, churn, expansion, and contraction
- Model subscriber growth vs capacity limits
- Simulate price changes
- Forecast long-term subscription revenue
- Calculate net income per period

***Real-world application***

> “What happens if churn increases by 2% next quarter?”

**4. Product & Service Profitability Analysis**

- Model products, services, and subscriptions independently
- Calculate:
  - Revenue
  - Cost of Goods / Cost of Service
  - Gross margin
  - Net margin
- Compare multiple offerings side-by-side
- Identify loss-making vs profit-driving items

***Real-world application***

> “Which product is actually paying the bills?”

**5. Scenario & Stress Testing**

- Run best-case, base-case, and worst-case scenarios
- Simulate:
  - Revenue delays
  - Cost spikes
  - Market downturns
  - Team expansion
- Stress test business sustainability

***Real-world application***

> “What if revenue drops 30% but payroll stays the same?”

**6. Financial Dashboards & Visualization Engines**

- Power real-time dashboards
- Feed data into:
  - Burn charts
  - Cash balance timelines
  - Revenue trends
  - Expense breakdowns
- Enable executive-level visibility

***Real-world application***

> “Give founders a single dashboard that tells the truth.”

**7. Investor & Stakeholder Reporting**

- Generate clean, structured financial projections
- Support pitch decks and board updates
- Provide defensible financial logic
- Maintain consistent assumptions across reports

***Real-world application***

> “Show investors a clear path to profitability.”

**8. Creative Studios & Agencies**

- Model project-based income
- Track retainers, milestones, and delivery costs
- Balance capacity vs profitability
- Forecast studio sustainability

***Real-world application***

> “Can we afford to take on another client this quarter?”

**9. Internal Financial Experimentation**

- Test pricing strategies
- Validate business models before launch
- Prototype financial logic without spreadsheets
- Enable developer-driven finance

***Real-world application***

> “Let engineers experiment with business logic safely.”

**10. Education & Financial Literacy Tools**

- Teach:
  - Burn rate
  - Runway
  - Margins
  - Cash flow
- Provide code-driven finance examples
- Replace fragile spreadsheets with deterministic logic

***Real-world application***

> “Explain startup finance using real code, not slides.”
 
---

## Best Practices

1. Model Reality, Not Optimism
   - Start with conservative assumptions
   - Avoid optimistic revenue curves
   - Assume delays, churn, and friction
   - A pessimistic model that survives is better than an optimistic one that collapses.

2. Separate Revenue, Costs, and Funding

   - Treat revenue, expenses, and funding as distinct flows
   - Never mix funding into revenue
   - Always track net cash movement

3. Track Net Burn, Not Just Gross Burn

   - Gross burn hides revenue impact
   - Net burn reveals true cash loss per period
   - Always calculate runway using net burn

4. Use Period-Based Modeling Consistently

   - Choose a time unit (monthly recommended)
   - Keep all inputs aligned to that period
   - Avoid mixing daily, monthly, and yearly values

5. Treat Initial Cash as a Funding Event

   - Initialize cash via the Funding Manager
   - This keeps historical data accurate
   - Ensures consistency in runway calculations

6. Keep Assumptions Explicit

   - Make pricing, churn, growth, and costs configurable
   - Avoid hidden constants
   - Document assumptions clearly

7. Stress Test Every Major Decision

   - Before hiring
   - Before raising capital
   - Before launching a new product
   - Before cutting costs
  > If it doesn’t survive stress testing, it’s not ready.

8. Prefer Deterministic Logic Over Spreadsheets

   - Code is:
     - Testable
     - Repeatable
     - Auditable
   - Avoid spreadsheet drift and silent errors

9. Visualize Outputs, Not Inputs

   - Charts should show:
     - Cash balance over time
     - Burn trends
     - Runway countdown
   - Avoid overwhelming dashboards with raw inputs

10.  Recalculate Often

   - Re-run projections whenever:
     - Costs change
     - Revenue changes
     - Funding changes
   - Financial models are living systems


---

## Conclusion

**MajikRunway** is not just a calculator — it is a financial simulation engine for building sustainable businesses.

It enables teams to:
- See the future clearly
- Make informed decisions
- Avoid financial blind spots
- Replace guesswork with logic

## Contributing

Contributions, bug reports, and suggestions are welcome! Feel free to fork and open a pull request.

---

## License

[MIT](LICENSE) — free for personal and commercial use.

---

## Author

Made with 💙 by [@thezelijah](https://github.com/jedlsf)

## About the Developer

- **Developer**: Josef Elijah Fabian
- **GitHub**: [https://github.com/jedlsf](https://github.com/jedlsf)
- **Project Repository**: [https://github.com/jedlsf/majik-runway](https://github.com/jedlsf/majik-runway)

---

## Contact

- **Business Email**: [business@thezelijah.world](mailto:business@thezelijah.world)
- **Official Website**: [https://www.thezelijah.world](https://www.thezelijah.world)

---


## API Reference

Below are concise method reference tables for the main public classes in this package. Each table lists the method name, inputs (with short descriptions), and what the method does / returns.

### MajikRunway

| Method Name                                                                                                    | Inputs (description)                                                                                                           | Description / Returns                                                                                                                                                                                                                                              |
| -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `initialize(options?)`                                                                                         | `options?: Partial<BusinessModel>` - initial model config                                                                      | Create and return a new `MajikRunway` instance configured with `options`.                                                                                                                                                                                          |
| `getModel()`                                                                                                   | —                                                                                                                              | Return current `BusinessModel` state.                                                                                                                                                                                                                              |
| `revenueStream()`                                                                                              | —                                                                                                                              | Return the `RevenueStream` instance used by the runway.                                                                                                                                                                                                            |
| `expenseBreakdown()`                                                                                           | —                                                                                                                              | Return the `ExpenseBreakdown` instance used by the runway.                                                                                                                                                                                                         |
| `funding()`                                                                                                    | —                                                                                                                              | Return the `FundingManager` instance used by the runway.                                                                                                                                                                                                           |
| `taxConfig()`                                                                                                  | —                                                                                                                              | Return the current `TaxConfig` object.                                                                                                                                                                                                                             |
| `toJSON()`                                                                                                     | —                                                                                                                              | Serialize the runway to a plain object (safely serializes `MajikMoney`).                                                                                                                                                                                           |
| `updateModel(update)`                                                                                          | `update: Partial<BusinessModel>` - partial model changes                                                                       | Apply partial updates to the model and recompute; returns `this`.                                                                                                                                                                                                  |
| `setBusinessModelType(type)`                                                                                   | `type: BusinessModelType`                                                                                                      | Switch business model (Product/Service/Subscription/Hybrid); returns `this`.                                                                                                                                                                                       |
| `updateInitialCash(cash)`                                                                                      | `cash: MajikMoney` - opening balance                                                                                           | Update initial cash and recompute; returns `this`.                                                                                                                                                                                                                 |
| `validateCurrencyConsistency()`                                                                                | —                                                                                                                              | Throws if currencies across sub-managers mismatch.                                                                                                                                                                                                                 |
| `addExpense(expense)`                                                                                          | `expense: Expense`                                                                                                             | Add an `Expense` to the `ExpenseBreakdown`; returns updated `this`.                                                                                                                                                                                                |
| `updateExpenseItem(id, updated)`                                                                               | `id: RevenueID`, `updated: Expense`                                                                                            | Replace expense with `id` by `updated`; returns `this`.                                                                                                                                                                                                            |
| `addRecurringExpense(name, amount, currency?, recurrence?, isTaxDeductible?, id?)`                             | Fields: `name:string`, `amount:number`, `currency?:string`, `recurrence?:Recurrence`, `isTaxDeductible?:boolean`, `id?:string` | Convenience creator for a recurring expense; adds to model and returns `this`.                                                                                                                                                                                     |
| `addOneTimeExpense(name, amount, currency?, month, isTaxDeductible?, id?)`                                     | `month: YYYYMM`                                                                                                                | Convenience creator for a one-time expense in `month`; returns `this`.                                                                                                                                                                                             |
| `addCapitalExpense(name, amount, depreciationMonths, currency?, month, residualValue?, isTaxDeductible?, id?)` | `depreciationMonths:number`, `month:YYYYMM`                                                                                    | Convenience creator for a capital expense (depreciable); returns `this`.                                                                                                                                                                                           |
| `addRevenue(item)`                                                                                             | `item: RevenueItem` (`MajikProduct                                                                                             | MajikService                                                                                                                                                                                                                                                       | MajikSubscription`) | Add revenue item to `RevenueStream`; returns `this`.         |
| `updateRevenueItem(id, updated)`                                                                               | `id: RevenueID`, `updated: RevenueItem`                                                                                        | Replace revenue item by id; returns `this`.                                                                                                                                                                                                                        |
| `addProduct(data)` / `addService(data)` / `addSubscription(data)`                                              | `data: MajikProduct                                                                                                            | MajikService                                                                                                                                                                                                                                                       | MajikSubscription`  | Shortcuts to add specific revenue item types; return `this`. |
| `getRevenueByType(ctor)`                                                                                       | `ctor: new(...args)=>T`                                                                                                        | Return array of revenue items of given constructor type.                                                                                                                                                                                                           |
| `addFundingEvent(event)`                                                                                       | `event: FundingEvent`                                                                                                          | Add a funding event to `FundingManager`; returns `this`.                                                                                                                                                                                                           |
| `updateFundingEvent(id, updated)`                                                                              | `id: FundingID`, `updated: FundingEvent`                                                                                       | Update a funding event; returns `this`.                                                                                                                                                                                                                            |
| `addEquity(name, amount, month?, id?)`                                                                         | `month?: YYYYMM`                                                                                                               | Convenience to add equity funding; returns `this`.                                                                                                                                                                                                                 |
| `addDebt(name, amount, month?, maturityDate, currency?, interestRate?, initialPayment?, id?)`                  | `maturityDate:string (ISO)`, `interestRate:number`                                                                             | Convenience to add debt funding with metadata; returns `this`.                                                                                                                                                                                                     |
| `addGrant(name, amount, month?, id?)`                                                                          | `month?: YYYYMM`                                                                                                               | Convenience to add grant funding; returns `this`.                                                                                                                                                                                                                  |
| `removeExpenseByID(id)` / `removeRevenueByID(id)` / `removeFundingByID(id)`                                    | `id:string`                                                                                                                    | Remove item by id from respective manager; returns `this`.                                                                                                                                                                                                         |
| `updateTaxConfig(taxConfig)`                                                                                   | `taxConfig: Partial<TaxConfig>`                                                                                                | Update tax configuration and recompute; returns `this`.                                                                                                                                                                                                            |
| `generateMonthlyCashflow(months?, startMonth?, plannedFunding?, includeTaxes?)`                                | `months:number`, `startMonth?:YYYYMM`, `plannedFunding?:FundingEvent[]`, `includeTaxes?:boolean`                               | Generate monthly `Cashflow[]` projections for `months`; returns array of cashflow objects.                                                                                                                                                                         |
| `calculateRunway(months?, startMonth?, plannedFunding?, overrides?, includeTaxes?)`                            | `overrides: ScenarioOverride[]`                                                                                                | Compute runway months remaining given assumptions; returns `number` (months).                                                                                                                                                                                      |
| `simulateScenario(overrides)`                                                                                  | `overrides: ScenarioOverride[]`                                                                                                | Return `Cashflow[]` for a scenario override set.                                                                                                                                                                                                                   |
| Reporting getters (examples)                                                                                   | —                                                                                                                              | `getTotalExpenses()`, `getTotalRevenue()`, `getMonthlyEndingCash()`, `getAverageNetMonthlyBurn()`, `getProjectedRevenueNextMonth()`, `getBreakEvenMonth()`, `getRunwayRemainingMonths()`, etc. — these return `MajikMoney`, numbers, `YYYYMM` or records as named. |

### RevenueStream

| Method Name                                                                                                | Inputs (description)                                                | Description / Returns                                            |
| ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- | ---------------------------------------------------------------- |
| `constructor(currency?, items?, period?)`                                                                  | `currency?:string`, `items?: RevenueItem[]`, `period?:PeriodYYYYMM` | Create a `RevenueStream` with optional initial items and period. |
| `addProduct(data)` / `addService(data)` / `addSubscription(data)`                                          | `data: MajikProduct                                                 | MajikService                                                     | MajikSubscription` (initialized instances) | Add a revenue item, validates then returns `this`. |
| `addItem(item)`                                                                                            | `item: T`                                                           | Generic add; returns `this`.                                     |
| `doesExist(id)`                                                                                            | `id: RevenueID`                                                     | Boolean whether an item with `id` exists.                        |
| `remove(id)`                                                                                               | `id: RevenueID`                                                     | Remove item by id; returns `this`.                               |
| `clear()`                                                                                                  | —                                                                   | Remove all items; returns `this`.                                |
| `updateItem(id, updated)`                                                                                  | `id: RevenueID`, `updated: T`                                       | Replace item by id; throws if not found; returns `this`.         |
| `getItemById(id)`                                                                                          | `id: RevenueID`                                                     | Return item or `undefined`.                                      |
| `getAll()`                                                                                                 | —                                                                   | Return shallow copy of all items.                                |
| Aggregations: `getAverageMonthlyRevenue()`, `getTotalRevenue()`, `getTotalCost()`, `getTotalGrossProfit()` | —                                                                   | Return `MajikMoney` aggregates for the stream.                   |
| `getMonthlyRevenue(month)`                                                                                 | `month: YYYYMM`                                                     | Return total revenue for month as `MajikMoney`.                  |
| `getMonthlyRevenueSeries(months)`                                                                          | `months: YYYYMM[]`                                                  | Return record mapping month→`MajikMoney`.                        |
| `getRevenueForYear(year)`                                                                                  | `year:number`                                                       | Return month-by-month revenue for the year.                      |
| `getLastRevenueGrowthMoM()` / `getRevenueGrowthRateCMGR()`                                                 | —                                                                   | Return MoM growth or CMGR as decimal or `null` if undefined.     |

### MajikProduct

| Method Name                | Inputs (Description)                                                                                                                                                                                                                                                                                                                                                      | Description & Returns                                                                         |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `constructor`              | `id?: ProductID` – optional product ID<br>`slug?: string` – optional slug<br>`name: string` – product name<br>`metadata: ProductMetadata` – metadata including finance, COGS, inventory, description<br>`settings: ProductSettings` – status, visibility, system flags<br>`timestamp?: ISODateString` – creation time<br>`last_update?: ISODateString` – last update time | Initializes a new `MajikProduct` instance. Returns a `MajikProduct` object.                   |
| `static initialize`        | `name: string` – product name<br>`type?: ProductType` – default PHYSICAL<br>`srp: MajikMoney` – suggested retail price<br>`stock?: number` – initial stock, default 1<br>`category?: string` – product category<br>`descriptionText?: string` – optional description<br>`skuID?: string` – optional SKU                                                                   | Creates a new product with default metadata and settings. Returns a `MajikProduct`.           |
| `setName`                  | `name: string` – new product name                                                                                                                                                                                                                                                                                                                                         | Updates the name and slug. Returns updated `MajikProduct` (`this`).                           |
| `setSRP`                   | `srp: MajikMoney` – new suggested retail price                                                                                                                                                                                                                                                                                                                            | Updates SRP and marks finance as dirty. Returns `this`.                                       |
| `setCategory`              | `category: string` – new category                                                                                                                                                                                                                                                                                                                                         | Updates the product category. Returns `this`.                                                 |
| `setDescription`           | `html: string`, `text: string` – new HTML and plain text description                                                                                                                                                                                                                                                                                                      | Updates product description. Returns `this`.                                                  |
| `setDescriptionText`       | `text: string` – new description text                                                                                                                                                                                                                                                                                                                                     | Updates plain text description only. Returns `this`.                                          |
| `setDescriptionHTML`       | `html: string` – new HTML description                                                                                                                                                                                                                                                                                                                                     | Updates HTML description only. Returns `this`.                                                |
| `setDescriptionSEO`        | `text: string` – new SEO text                                                                                                                                                                                                                                                                                                                                             | Updates SEO description. Returns `this`.                                                      |
| `setType`                  | `type: ProductType` – new product type                                                                                                                                                                                                                                                                                                                                    | Updates product type. Returns `this`.                                                         |
| `seo`                      | –                                                                                                                                                                                                                                                                                                                                                                         | Getter: returns SEO text if available, otherwise description text.                            |
| `setStock`                 | `amount: number` – new stock count                                                                                                                                                                                                                                                                                                                                        | Updates inventory stock. Returns `this`.                                                      |
| `hasCostBreakdown`         | –                                                                                                                                                                                                                                                                                                                                                                         | Returns `true` if at least one COGS item exists.                                              |
| `addCOGS`                  | `name: string`, `unitCost: MajikMoney`, `quantity?: number` – default 1, `unit?: string` – optional unit label                                                                                                                                                                                                                                                            | Adds a new COGS item. Returns `this`.                                                         |
| `pushCOGS`                 | `item: COGSItem` – full COGS item object                                                                                                                                                                                                                                                                                                                                  | Pushes existing COGS item into product. Returns `this`.                                       |
| `updateCOGS`               | `id: string`, `updates: Partial<COGSItem>`                                                                                                                                                                                                                                                                                                                                | Updates a specific COGS item by ID. Returns `this`.                                           |
| `setCOGS`                  | `items: COGSItem[]` – array of COGS items                                                                                                                                                                                                                                                                                                                                 | Replaces entire COGS array. Returns `this`.                                                   |
| `removeCOGS`               | `id: string` – ID of COGS item                                                                                                                                                                                                                                                                                                                                            | Removes a COGS item by ID. Returns `this`.                                                    |
| `clearCostBreakdown`       | –                                                                                                                                                                                                                                                                                                                                                                         | Clears all COGS items. Returns `this`.                                                        |
| `hasCapacity`              | –                                                                                                                                                                                                                                                                                                                                                                         | Returns `true` if at least one capacity plan exists.                                          |
| `earliestCapacityMonth`    | –                                                                                                                                                                                                                                                                                                                                                                         | Getter: returns earliest YYYYMM in supply plan or `null`.                                     |
| `latestCapacityMonth`      | –                                                                                                                                                                                                                                                                                                                                                                         | Getter: returns latest YYYYMM in supply plan or `null`.                                       |
| `capacity`                 | –                                                                                                                                                                                                                                                                                                                                                                         | Getter: returns array of monthly capacities.                                                  |
| `totalCapacity`            | –                                                                                                                                                                                                                                                                                                                                                                         | Getter: sum of all monthly capacities including adjustments.                                  |
| `averageMonthlyCapacity`   | –                                                                                                                                                                                                                                                                                                                                                                         | Getter: average units per month.                                                              |
| `maxSupplyMonth`           | –                                                                                                                                                                                                                                                                                                                                                                         | Getter: month with max supply including adjustments.                                          |
| `minSupplyMonth`           | –                                                                                                                                                                                                                                                                                                                                                                         | Getter: month with min supply including adjustments.                                          |
| `generateCapacityPlan`     | `months: number`, `amount: number`, `growthRate?: number`, `startDate?: StartDateInput`                                                                                                                                                                                                                                                                                   | Auto-generates a supply plan with optional growth. Returns `this`.                            |
| `normalizeCapacityUnits`   | `amount: number` – units to set for all months                                                                                                                                                                                                                                                                                                                            | Sets same unit amount across all months. Returns `this`.                                      |
| `recomputeCapacityPeriod`  | `start: YYYYMM`, `end: YYYYMM`, `mode?: CapacityPeriodResizeMode`                                                                                                                                                                                                                                                                                                         | Recomputes supply plan for a period with optional distribution mode. Returns `this`.          |
| `setCapacity`              | `supplyPlan: MonthlyCapacity[]`                                                                                                                                                                                                                                                                                                                                           | Replaces entire supply plan. Returns `this`.                                                  |
| `addCapacity`              | `month: YYYYMM`, `capacity: number`, `adjustment?: number`                                                                                                                                                                                                                                                                                                                | Adds a new monthly supply entry. Returns `this`.                                              |
| `updateCapacityUnits`      | `month: YYYYMM`, `units: number`                                                                                                                                                                                                                                                                                                                                          | Updates units for a month. Returns `this`.                                                    |
| `updateCapacityAdjustment` | `month: YYYYMM`, `adjustment?: number`                                                                                                                                                                                                                                                                                                                                    | Updates adjustment for a month. Returns `this`.                                               |
| `removeCapacity`           | `month: YYYYMM`                                                                                                                                                                                                                                                                                                                                                           | Removes a month from supply plan. Returns `this`.                                             |
| `clearCapacity`            | –                                                                                                                                                                                                                                                                                                                                                                         | Clears entire supply plan. Returns `this`.                                                    |
| `averageMonthlyRevenue`    | –                                                                                                                                                                                                                                                                                                                                                                         | Getter: average revenue per month (`MajikMoney`).                                             |
| `averageMonthlyProfit`     | –                                                                                                                                                                                                                                                                                                                                                                         | Getter: average profit per month (`MajikMoney`).                                              |
| `grossRevenue`             | –                                                                                                                                                                                                                                                                                                                                                                         | Getter: total gross revenue (`MajikMoney`).                                                   |
| `grossCost`                | –                                                                                                                                                                                                                                                                                                                                                                         | Getter: total COGS (`MajikMoney`).                                                            |
| `grossProfit`              | –                                                                                                                                                                                                                                                                                                                                                                         | Getter: total gross profit (`MajikMoney`).                                                    |
| `netRevenue`               | –                                                                                                                                                                                                                                                                                                                                                                         | Getter: total net revenue (`MajikMoney`).                                                     |
| `netProfit`                | –                                                                                                                                                                                                                                                                                                                                                                         | Getter: total net profit (`MajikMoney`).                                                      |
| `getRevenue`               | `month: YYYYMM`                                                                                                                                                                                                                                                                                                                                                           | Returns revenue for a specific month.                                                         |
| `cogs`                     | –                                                                                                                                                                                                                                                                                                                                                                         | Getter: array of COGS items.                                                                  |
| `getCOGS`                  | `month: YYYYMM`                                                                                                                                                                                                                                                                                                                                                           | Returns COGS for a specific month.                                                            |
| `getCost`                  | `month: YYYYMM`                                                                                                                                                                                                                                                                                                                                                           | Alias for `getCOGS`.                                                                          |
| `getProfit`                | `month: YYYYMM`                                                                                                                                                                                                                                                                                                                                                           | Returns profit for a specific month.                                                          |
| `getMargin`                | `month: YYYYMM`                                                                                                                                                                                                                                                                                                                                                           | Returns profit margin (0–1) for a month.                                                      |
| `getNetRevenue`            | `month: YYYYMM`, `discounts?: MajikMoney`, `returns?: MajikMoney`, `allowances?: MajikMoney`                                                                                                                                                                                                                                                                              | Returns net revenue for a month.                                                              |
| `getNetProfit`             | `month: YYYYMM`, `operatingExpenses?: MajikMoney`, `taxes?: MajikMoney`, `discounts?: MajikMoney`, `returns?: MajikMoney`, `allowances?: MajikMoney`                                                                                                                                                                                                                      | Returns net profit for a month.                                                               |
| `getNetIncome`             | `month: YYYYMM`, same optional inputs as `getNetProfit`                                                                                                                                                                                                                                                                                                                   | Alias for `getNetProfit`.                                                                     |
| `isOutOfStock`             | –                                                                                                                                                                                                                                                                                                                                                                         | Getter: returns `true` if stock is 0 or less.                                                 |
| `reduceStock`              | `units: number` – units to subtract                                                                                                                                                                                                                                                                                                                                       | Reduces inventory stock. Returns `this`.                                                      |
| `unitCost`                 | –                                                                                                                                                                                                                                                                                                                                                                         | Getter: total unit COGS (`MajikMoney`).                                                       |
| `unitProfit`               | –                                                                                                                                                                                                                                                                                                                                                                         | Getter: profit per unit (`MajikMoney`).                                                       |
| `unitMargin`               | –                                                                                                                                                                                                                                                                                                                                                                         | Getter: profit margin per unit (decimal 0–1).                                                 |
| `price`                    | –                                                                                                                                                                                                                                                                                                                                                                         | Getter: current SRP (`MajikMoney`).                                                           |
| `getMonthlySnapshot`       | `month: YYYYMM`                                                                                                                                                                                                                                                                                                                                                           | Returns object containing revenue, COGS, profit, margin, net revenue, net income for a month. |
| `validateSelf`             | `throwError?: boolean` – default false                                                                                                                                                                                                                                                                                                                                    | Validates product instance; returns boolean or throws error.                                  |
| `finalize`                 | –                                                                                                                                                                                                                                                                                                                                                                         | Returns plain object with autogenerated ID.                                                   |
| `toJSON`                   | –                                                                                                                                                                                                                                                                                                                                                                         | Converts `MajikProduct` to JSON object.                                                       |
| `static parseFromJSON`     | `json: string                                                                                                                                                                                                                                                                                                                                                             | object`                                                                                       | Parses JSON or object into `MajikProduct`. |

### MajikService

| Method / Property                   | Inputs (Description)                                                                                                                                        | Returns / Description                                                     |                                        |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- | -------------------------------------- |
| Constructor                         | `id?: ServiceID, slug?: string, name: string, metadata: ServiceMetadata, settings: ServiceSettings, timestamp?: ISODateString, last_update?: ISODateString` | Creates a new `MajikService` instance                                     |                                        |
| `initialize`                        | `name: string, type?: ServiceType, rate: ServiceRate, category?: string, descriptionText?: string, skuID?: string`                                          | Returns a new `MajikService` instance with default values                 |                                        |
| `setName`                           | `name: string`                                                                                                                                              | Sets service name & regenerates slug                                      |                                        |
| **setRate**                         | `rate: ServiceRate`                                                                                                                                         | Updates service rate and marks finance dirty                              |                                        |
| **setRateUnit**                     | `unit: RateUnit`                                                                                                                                            | Updates rate unit (e.g., per hour/day)                                    |                                        |
| **setRateAmount**                   | `amount: number`                                                                                                                                            | Updates numeric rate amount, must be positive                             |                                        |
| **setCategory**                     | `category: string`                                                                                                                                          | Updates service category                                                  |                                        |
| **setDescription**                  | `html: string, text: string`                                                                                                                                | Updates service description HTML and plain text                           |                                        |
| **setDescriptionText**              | `text: string`                                                                                                                                              | Updates only description text                                             |                                        |
| **setDescriptionHTML**              | `html: string`                                                                                                                                              | Updates only description HTML                                             |                                        |
| **setDescriptionSEO**               | `text: string`                                                                                                                                              | Updates SEO text for the service description                              |                                        |
| **setType**                         | `type: ServiceType`                                                                                                                                         | Updates the service type                                                  |                                        |
| **seo (getter)**                    | None                                                                                                                                                        | Returns SEO text if available, else description text                      |                                        |
| **hasCostBreakdown**                | None                                                                                                                                                        | Returns boolean if COS exists                                             |                                        |
| **addCOS**                          | `name: string, unitCost: MajikMoney, quantity?: number, unit?: string`                                                                                      | Adds a COS item                                                           |                                        |
| **pushCOS**                         | `item: COSItem`                                                                                                                                             | Pushes an existing COSItem into metadata                                  |                                        |
| **updateCOS**                       | `id: string, updates: Partial<{quantity, unitCost, unit, item}>`                                                                                            | Updates COS item by ID                                                    |                                        |
| **setCOS**                          | `items: COSItem[]`                                                                                                                                          | Replaces all COS items                                                    |                                        |
| **removeCOS**                       | `id: string`                                                                                                                                                | Removes COS item by ID                                                    |                                        |
| **clearCostBreakdown**              | None                                                                                                                                                        | Clears all COS items                                                      |                                        |
| **hasCapacity**                     | None                                                                                                                                                        | Returns boolean if capacity plan exists                                   |                                        |
| **earliestCapacityMonth (getter)**  | None                                                                                                                                                        | Returns earliest YYYYMM from capacity plan                                |                                        |
| **latestCapacityMonth (getter)**    | None                                                                                                                                                        | Returns latest YYYYMM from capacity plan                                  |                                        |
| **capacity (getter)**               | None                                                                                                                                                        | Returns monthly capacity plan array                                       |                                        |
| **totalCapacity (getter)**          | None                                                                                                                                                        | Returns total capacity units across all months                            |                                        |
| **averageMonthlyCapacity (getter)** | None                                                                                                                                                        | Returns average capacity per month                                        |                                        |
| **maxSupplyMonth (getter)**         | None                                                                                                                                                        | Returns month with highest supply                                         |                                        |
| **minSupplyMonth (getter)**         | None                                                                                                                                                        | Returns month with lowest supply                                          |                                        |
| **generateCapacityPlan**            | `months: number, amount: number, growthRate?: number, startDate?: StartDateInput`                                                                           | Generates and replaces capacity plan                                      |                                        |
| **normalizeCapacityUnits**          | `amount: number`                                                                                                                                            | Normalizes all months to the same unit amount                             |                                        |
| **recomputeCapacityPeriod**         | `start: YYYYMM, end: YYYYMM, mode?: CapacityPeriodResizeMode`                                                                                               | Adjusts capacity plan to new period                                       |                                        |
| **setCapacity**                     | `capacityPlan: MonthlyCapacity[]`                                                                                                                           | Sets entire capacity plan                                                 |                                        |
| **addCapacity**                     | `month: YYYYMM, hours: number, adjustment?: number`                                                                                                         | Adds capacity for a specific month                                        |                                        |
| **updateCapacityUnits**             | `month: YYYYMM, hours: number`                                                                                                                              | Updates capacity hours for a month                                        |                                        |
| **updateCapacityAdjustment**        | `month: YYYYMM, adjustment?: number`                                                                                                                        | Updates adjustment for a month                                            |                                        |
| **removeCapacity**                  | `month: YYYYMM`                                                                                                                                             | Removes a month from capacity plan                                        |                                        |
| **clearCapacity**                   | None                                                                                                                                                        | Clears all capacity                                                       |                                        |
| **averageMonthlyRevenue (getter)**  | None                                                                                                                                                        | Returns average monthly revenue                                           |                                        |
| **averageMonthlyProfit (getter)**   | None                                                                                                                                                        | Returns average monthly profit                                            |                                        |
| **grossRevenue (getter)**           | None                                                                                                                                                        | Returns total gross revenue                                               |                                        |
| **grossCost (getter)**              | None                                                                                                                                                        | Returns total gross COS                                                   |                                        |
| **grossProfit (getter)**            | None                                                                                                                                                        | Returns total gross profit                                                |                                        |
| **netRevenue (getter)**             | None                                                                                                                                                        | Returns net revenue                                                       |                                        |
| **netProfit (getter)**              | None                                                                                                                                                        | Returns net profit                                                        |                                        |
| **unitCost (getter)**               | None                                                                                                                                                        | Returns per-unit cost                                                     |                                        |
| **unitProfit (getter)**             | None                                                                                                                                                        | Returns per-unit profit                                                   |                                        |
| **unitMargin (getter)**             | None                                                                                                                                                        | Returns profit margin ratio                                               |                                        |
| **price (getter)**                  | None                                                                                                                                                        | Returns service price (rate.amount)                                       |                                        |
| **getMonthlySnapshot**              | `month: YYYYMM`                                                                                                                                             | Returns revenue, COS, profit, margin, netRevenue, netIncome for the month |                                        |
| **getNetRevenue**                   | `month: YYYYMM, discounts?: MajikMoney, returns?: MajikMoney, allowances?: MajikMoney`                                                                      | Calculates net revenue for month                                          |                                        |
| **getNetProfit / getNetIncome**     | `month: YYYYMM, operatingExpenses?: MajikMoney, taxes?: MajikMoney, discounts?: MajikMoney, returns?: MajikMoney, allowances?: MajikMoney`                  | Calculates net profit / net income for month                              |                                        |
| **getRevenue**                      | `month: YYYYMM`                                                                                                                                             | Returns revenue for the month                                             |                                        |
| **getCOS / getCost**                | `month: YYYYMM`                                                                                                                                             | Returns COS for the month                                                 |                                        |
| **getProfit**                       | `month: YYYYMM`                                                                                                                                             | Returns profit for the month                                              |                                        |
| **getMargin**                       | `month: YYYYMM`                                                                                                                                             | Returns margin ratio for the month                                        |                                        |
| **validateSelf**                    | `throwError?: boolean`                                                                                                                                      | Validates required properties; throws if invalid                          |                                        |
| **finalize**                        | None                                                                                                                                                        | Returns plain JSON object with autogenerated ID                           |                                        |
| **toJSON**                          | None                                                                                                                                                        | Serializes MajikService instance to JSON                                  |                                        |
| **parseFromJSON**                   | `json: string                                                                                                                                               | object`                                                                   | Parses JSON into MajikService instance |
| **isMajikServiceClass**             | `item: MajikService`                                                                                                                                        | Returns true if object is class instance                                  |                                        |
| **isMajikServiceJSON**              | `item: MajikService`                                                                                                                                        | Returns true if object is serialized JSON                                 |                                        |


### MajikSubscription

| Method Name                | Inputs (Description)                                                                                                                                                                        | Description / Returns                                                                   |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| `constructor`              | `id` (SubscriptionID), `slug` (string), `name` (string), `metadata` (SubscriptionMetadata), `settings` (SubscriptionSettings), `timestamp?` (ISODateString), `last_update?` (ISODateString) | Creates a new subscription instance. Auto-generates ID/slug if not provided.            |
| `static initialize`        | `name` (string), `type?` (SubscriptionType), `rate` (SubscriptionRate), `category?` (string), `descriptionText?` (string), `skuID?` (string)                                                | Creates a subscription with default metadata and settings. Returns `MajikSubscription`. |
| `setName`                  | `name` (string)                                                                                                                                                                             | Updates subscription name & slug. Returns `this`.                                       |
| `setRate`                  | `rate` (SubscriptionRate)                                                                                                                                                                   | Updates subscription rate. Returns `this`.                                              |
| `setRateUnit`              | `unit` (RateUnit)                                                                                                                                                                           | Updates rate unit. Returns `this`.                                                      |
| `setRateAmount`            | `amount` (number)                                                                                                                                                                           | Updates numeric rate amount. Throws if ≤0. Returns `this`.                              |
| `setBillingCycle`          | `cycle` (BillingCycle)                                                                                                                                                                      | Updates billing cycle. Returns `this`.                                                  |
| `setCategory`              | `category` (string)                                                                                                                                                                         | Updates subscription category. Returns `this`.                                          |
| `setDescription`           | `html` (string), `text` (string)                                                                                                                                                            | Updates HTML and plain text description. Returns `this`.                                |
| `setDescriptionText`       | `text` (string)                                                                                                                                                                             | Updates plain text description. Returns `this`.                                         |
| `setDescriptionHTML`       | `html` (string)                                                                                                                                                                             | Updates HTML description. Returns `this`.                                               |
| `setDescriptionSEO`        | `text` (string)                                                                                                                                                                             | Updates SEO-friendly text. Returns `this`.                                              |
| `setType`                  | `type` (SubscriptionType)                                                                                                                                                                   | Updates subscription type. Returns `this`.                                              |
| `get seo`                  | –                                                                                                                                                                                           | Returns SEO text if available; otherwise plain text.                                    |
| `hasCostBreakdown`         | –                                                                                                                                                                                           | Returns `true` if COS items exist, else `false`.                                        |
| `addCOS`                   | `name` (string), `unitCost` (MajikMoney), `quantity?` (number), `unit?` (string)                                                                                                            | Adds a COS item. Returns `this`.                                                        |
| `pushCOS`                  | `item` (COSItem)                                                                                                                                                                            | Adds existing COS item. Returns `this`.                                                 |
| `updateCOS`                | `id` (string), `updates` (Partial<COSItem>)                                                                                                                                                 | Updates COS item by ID. Returns `this`.                                                 |
| `setCOS`                   | `items` (COSItem[])                                                                                                                                                                         | Replaces all COS items. Returns `this`.                                                 |
| `removeCOS`                | `id` (string)                                                                                                                                                                               | Removes COS item by ID. Returns `this`.                                                 |
| `clearCostBreakdown`       | –                                                                                                                                                                                           | Removes all COS items. Returns `this`.                                                  |
| `hasCapacity`              | –                                                                                                                                                                                           | Returns `true` if capacity plan exists.                                                 |
| `earliestCapacityMonth`    | –                                                                                                                                                                                           | Returns earliest month in capacity plan (`YYYY-MM`) or `null`.                          |
| `latestCapacityMonth`      | –                                                                                                                                                                                           | Returns latest month in capacity plan (`YYYY-MM`) or `null`.                            |
| `capacity`                 | –                                                                                                                                                                                           | Returns full capacity plan (`MonthlyCapacity[]`).                                       |
| `totalCapacity`            | –                                                                                                                                                                                           | Returns total units across all months.                                                  |
| `averageMonthlyCapacity`   | –                                                                                                                                                                                           | Returns average monthly capacity.                                                       |
| `maxSupplyMonth`           | –                                                                                                                                                                                           | Returns month with highest capacity.                                                    |
| `minSupplyMonth`           | –                                                                                                                                                                                           | Returns month with lowest capacity.                                                     |
| `generateCapacityPlan`     | `months` (number), `amount` (number), `growthRate?` (number), `startDate?` (StartDateInput)                                                                                                 | Generates capacity plan automatically. Returns `this`.                                  |
| `normalizeCapacityUnits`   | `amount` (number)                                                                                                                                                                           | Normalizes all months to same units. Returns `this`.                                    |
| `recomputeCapacityPeriod`  | `start` (YYYYMM), `end` (YYYYMM), `mode?` (CapacityPeriodResizeMode)                                                                                                                        | Adjusts capacity plan to new period. Returns `this`.                                    |
| `setCapacity`              | `capacityPlan` (MonthlyCapacity[])                                                                                                                                                          | Sets full capacity plan. Returns `this`.                                                |
| `addCapacity`              | `month` (YYYYMM), `units` (number), `adjustment?` (number)                                                                                                                                  | Adds capacity for a specific month. Returns `this`.                                     |
| `updateCapacityUnits`      | `month` (YYYYMM), `units` (number)                                                                                                                                                          | Updates units for a specific month. Returns `this`.                                     |
| `updateCapacityAdjustment` | `month` (YYYYMM), `adjustment?` (number)                                                                                                                                                    | Updates adjustment for a specific month. Returns `this`.                                |
| `removeCapacity`           | `month` (YYYYMM)                                                                                                                                                                            | Removes a month from capacity plan. Returns `this`.                                     |
| `clearCapacity`            | –                                                                                                                                                                                           | Clears all capacity plan. Returns `this`.                                               |
| `getRevenue`               | `month` (YYYYMM)                                                                                                                                                                            | Returns revenue for the month (`MajikMoney`).                                           |
| `getCOS`                   | `month` (YYYYMM)                                                                                                                                                                            | Returns COS for the month (`MajikMoney`).                                               |
| `getCost`                  | `month` (YYYYMM)                                                                                                                                                                            | Alias for `getCOS`.                                                                     |
| `getProfit`                | `month` (YYYYMM)                                                                                                                                                                            | Returns profit for the month (`MajikMoney`).                                            |
| `getMargin`                | `month` (YYYYMM)                                                                                                                                                                            | Returns profit margin (0–1) for the month.                                              |
| `getNetRevenue`            | `month` (YYYYMM), `discounts?`, `returns?`, `allowances?` (MajikMoney)                                                                                                                      | Returns net revenue for the month (`MajikMoney`).                                       |
| `getNetProfit`             | `month` (YYYYMM), `operatingExpenses?`, `taxes?`, `discounts?`, `returns?`, `allowances?` (MajikMoney)                                                                                      | Returns net profit for the month (`MajikMoney`).                                        |
| `getNetIncome`             | `month` (YYYYMM), `operatingExpenses?`, `taxes?`, `discounts?`, `returns?`, `allowances?` (MajikMoney)                                                                                      | Alias for `getNetProfit`.                                                               |
| `getMonthlySnapshot`       | `month` (YYYYMM)                                                                                                                                                                            | Returns revenue, COS, profit, margin, netRevenue, netIncome for the month.              |
| `applyTrial`               | `months` (number)                                                                                                                                                                           | Reduces capacity for trial period. Returns `this`.                                      |
| `nextBillingDate`          | –                                                                                                                                                                                           | Returns next billing date (ISO string) or `null`.                                       |
| `forecastRevenue`          | `nextNMonths` (number)                                                                                                                                                                      | Forecasts revenue for next N months. Returns `MajikMoney`.                              |
| `getMRR`                   | `month?` (YYYYMM)                                                                                                                                                                           | Returns Monthly Recurring Revenue (`MajikMoney`).                                       |
| `getARR`                   | `months?` (number)                                                                                                                                                                          | Returns Annual Recurring Revenue for next N months (`MajikMoney`).                      |
| `grossRevenue`             | –                                                                                                                                                                                           | Returns total gross revenue.                                                            |
| `grossCost`                | –                                                                                                                                                                                           | Returns total COS.                                                                      |
| `grossProfit`              | –                                                                                                                                                                                           | Returns total gross profit.                                                             |
| `netRevenue`               | –                                                                                                                                                                                           | Returns net revenue (same as gross).                                                    |
| `netProfit`                | –                                                                                                                                                                                           | Returns net profit (same as gross).                                                     |
| `unitCost`                 | –                                                                                                                                                                                           | Returns cost per unit.                                                                  |
| `unitProfit`               | –                                                                                                                                                                                           | Returns profit per unit.                                                                |
| `unitMargin`               | –                                                                                                                                                                                           | Returns margin per unit (0–1).                                                          |
| `price`                    | –                                                                                                                                                                                           | Returns subscription price (`MajikMoney`).                                              |


### FundingManager

| Method Name                                                                                                                                                                                         | Inputs (description)                                                  | Description / Returns                                                                                  |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `constructor(currency?, funding?, period?)`                                                                                                                                                         | `currency?:string`, `funding?:FundingEvent[]`, `period?:PeriodYYYYMM` | Create `FundingManager` instance.                                                                      |
| Cached getters (`totalFundingAcrossPeriodCached`, `averageMonthlyFundingCached`, `totalEquityAcrossPeriodCached`, `totalDebtAcrossPeriodCached`, `totalGrantAcrossPeriodCached`, `debtRatioCached`) | —                                                                     | Return cached `MajikMoney` totals or numeric ratios for the configured period.                         |
| `cache`                                                                                                                                                                                             | —                                                                     | Return full cache summary object.                                                                      |
| `add(event)`                                                                                                                                                                                        | `event: FundingEvent`                                                 | Add funding event; returns `this`.                                                                     |
| `doesExist(id)`                                                                                                                                                                                     | `id: FundingID`                                                       | Boolean whether funding exists.                                                                        |
| `remove(id)`                                                                                                                                                                                        | `id: FundingID`                                                       | Remove event by id; returns `this`.                                                                    |
| `update(id, updated)`                                                                                                                                                                               | `id: FundingID`, `updated: FundingEvent`                              | Update event; returns `this`.                                                                          |
| `clear()`                                                                                                                                                                                           | —                                                                     | Remove all funding events; returns `this`.                                                             |
| `getByID(id)` / `getAll()` / `items` / `hasFunding(id)`                                                                                                                                             | —                                                                     | Retrieval helpers for funding events.                                                                  |
| Quick adders: `addEquity(name, amount, month, currency?, id?)`, `addDebt(...)`, `addGrant(...)`, `addFunding(type,name,amount,month,currency?,id?)`                                                 | —                                                                     | Convenience factories that create and add `FundingEvent` instances; return the created `FundingEvent`. |
| Filters: `getByType(type)`, `getEquity()`, `getDebt()`, `getGrants()`, `getForMonth(month)`                                                                                                         | —                                                                     | Return arrays of matching `FundingEvent`s.                                                             |
| Analytics: `generateFundingTimeSeries()`, `estimateRunway(...)` (internal helpers)                                                                                                                  | —                                                                     | Helpers to produce time-series and analytic values used by the runway.                                 |

### FundingEvent

| Method Name                                                                                                                                    | Inputs (description)                                         | Description / Returns                                                                  |
| ---------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ | -------------------------------------------------------------------------------------- |
| `create(state)`                                                                                                                                | `state: FundingEventState`                                   | Create a `FundingEvent` from normalized state.                                         |
| `equity(name, amount, month, currency?, id?)`                                                                                                  | `month: YYYYMM`                                              | Factory for equity funding event; returns `FundingEvent`.                              |
| `debt(name, amount, month, maturityDate, currency?, interestRate?, initialPayment?, id?)`                                                      | `maturityDate: ISO string`, `interestRate:number`            | Factory for debt event with metadata; returns `FundingEvent`.                          |
| `grant(name, amount, month, currency?, id?)`                                                                                                   | `month: YYYYMM`                                              | Factory for grant event; returns `FundingEvent`.                                       |
| Accessors: `id`, `name`, `type`, `month`, `amount`, `isEquity`, `isDebt`, `isGrant`, `maturityDate`, `installmentPlan`, `initialPayment`, etc. | —                                                            | Read-only getters exposing event properties (mostly `MajikMoney`, strings or numbers). |
| `cashInForMonth(month)`                                                                                                                        | `month: YYYYMM`                                              | Return cash inflow for `month` (non-zero only in event month).                         |
| Interest & debt helpers: `computeInterest(months?)`, `computeCompoundInterest(months?)`, `totalWithInterest(compound?, months?)`               | —                                                            | Compute interest amounts and totals as `MajikMoney`.                                   |
| `generateAmortizationSchedule(fullyAmortized?, useCompoundInterest?)`                                                                          | `fullyAmortized:boolean`, `useCompoundInterest:boolean`      | Return amortization schedule array with month/principal/interest/remaining.            |
| Immutables: `withAmount(amount)`, `rename(name)`, `reschedule(month)`                                                                          | —                                                            | Return updated `FundingEvent` instances (immutable pattern).                           |
| `toJSON()` / `parseFromJSON(json)`                                                                                                             | —                                                            | Serialize / deserialize `FundingEvent`.                                                |
| `computeMonthlyPayment(principal, months, annualRate)` (exported fn)                                                                           | `principal:MajikMoney`, `months:number`, `annualRate:number` | Return monthly payment `MajikMoney` for fully amortized loan.                          |

### ExpenseBreakdown

| Method Name                                                                                                                                                                           | Inputs (description)                                              | Description / Returns                                          |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- | -------------------------------------------------------------- |
| `constructor(currency?, expenses?, period?)`                                                                                                                                          | `currency?:string`, `expenses?:Expense[]`, `period?:PeriodYYYYMM` | Create `ExpenseBreakdown` instance.                            |
| Cache getters: `totalExpensesCached`, `averageMonthlyExpenseCached`, `totalRecurringCached`, `totalOneTimeCached`, `totalCapitalCached`, `totalTaxDeductibleCached`                   | —                                                                 | Return cached `MajikMoney` aggregates for the period.          |
| `add(expense)`                                                                                                                                                                        | `expense: Expense`                                                | Add an `Expense`; returns `this`.                              |
| `doesExist(id)` / `remove(id)` / `update(id, updated)` / `clear()`                                                                                                                    | —                                                                 | CRUD helpers for expenses; `update` throws if not found.       |
| `getByID(id)` / `getAll()` / `items` / `hasExpense(id)`                                                                                                                               | —                                                                 | Retrieval helpers.                                             |
| Filters: `getByType(type)`, `getByRecurrence(recurrence)`, `getByAmountRange(min,max)`                                                                                                | `min,max:MajikMoney`                                              | Return matching `Expense[]`.                                   |
| `getRecurring()` / `getOneTimeForMonth(month)` / `getCapital()` / `getTaxDeductible()`                                                                                                | `month: YYYYMM`                                                   | Convenience accessors.                                         |
| Aggregations: `getMonthlyCashOut(month)`, `getMonthlyExpense(month)`, `getMonthlyDeductibleExpense(month)`, `totalExpenses()`, `totalExpensesForMonth(month)`, `totalTaxDeductible()` | —                                                                 | Return `MajikMoney` totals for requested scope.                |
| `getNetAssetsUpTo(month)`                                                                                                                                                             | `month: YYYYMM`                                                   | Return net book value of capital expenses up to `month`.       |
| `sort(by, descending?)` / `groupByType()` / `monthlyCashflow(months)`                                                                                                                 | —                                                                 | Utilities for sorting, grouping and producing month→cash maps. |

### Expense

| Method Name                                                                                                                                                       | Inputs (description)                                          | Description / Returns                                                      |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `create(state)`                                                                                                                                                   | `state: ExpenseState`                                         | Create `Expense` from state (immutable).                                   |
| `recurring(id?, name, amount, currency?, recurrence?, period, isTaxDeductible?)`                                                                                  | `period:PeriodYYYYMM`                                         | Factory for recurring expense; returns `Expense`.                          |
| `oneTime(id?, name, amount, currency?, month, isTaxDeductible?)`                                                                                                  | `month: YYYYMM`                                               | Factory for one-time expense; returns `Expense`.                           |
| `capital(id?, name, amount, currency?, month, depreciationMonths, residualValue?, isTaxDeductible?)`                                                              | `depreciationMonths:number`                                   | Factory for capital (depreciable) expense; returns `Expense`.              |
| `generateExpenseScheduleForPeriod(months, amount, recurrence, startDate?)`                                                                                        | `months:number`, `amount:MajikMoney`, `recurrence:Recurrence` | Static helper to generate monthly allocations for a recurrence.            |
| Accessors: `id`, `name`, `type`, `category`, `recurrence`, `isTaxDeductible`, `schedule`, `amount`, `depreciationMonths`, `isRecurring`, `isOneTime`, `isCapital` | —                                                             | Read-only properties describing the expense.                               |
| `cashOutForMonth(month)`                                                                                                                                          | `month: YYYYMM`                                               | Return cash outflow (MajikMoney) for `month`.                              |
| `expenseForMonth(month)`                                                                                                                                          | `month: YYYYMM`                                               | Return accounting expense for `month` (includes depreciation for capital). |
| `getNetBookValueUpTo(month)`                                                                                                                                      | `month: YYYYMM`                                               | Return NBV (cost − accumulated depreciation) as `MajikMoney`.              |
| Updaters: `withAmount(amount)`, `rename(name)`, `updatePeriod(period)`                                                                                            | —                                                             | Immutable updaters returning new `Expense` instances.                      |
| `purchaseMonth`                                                                                                                                                   | —                                                             | Getter returning canonical month when cash was paid (or null).             |
| `toJSON()` / `parseFromJSON(json)`                                                                                                                                | —                                                             | Serialize / deserialize `Expense` instances.                               |



