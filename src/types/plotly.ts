// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface PlotlyTrace<TX = any, TY = any> {
  x?: TX[];
  y?: TY[];

  type: "scatter" | "bar" | "pie" | "waterfall";
  mode?: "lines" | "markers" | "lines+markers";
  name?: string;

  line?: {
    shape?: "linear" | "spline";
    smoothing?: number;
    width?: number;
    dash?: "solid" | "dot" | "dash";
  };

  marker?: {
    size?: number;
    color?: string | string[];
  };

  hovertemplate?: string;

  // Pie-specific
  labels?: string[];
  values?: number[];
}

export type TimeSeriesTrace = PlotlyTrace<string, number>;
export type CurrencySeriesTrace = PlotlyTrace<string, number>;

export interface PieChartTrace {
  type: "scatter" | "bar" | "pie" | "waterfall";
  mode?: "lines" | "markers" | "lines+markers";
  name?: string;

  line?: {
    shape?: "linear" | "spline";
    smoothing?: number;
    width?: number;
    dash?: "solid" | "dot" | "dash";
  };

  marker?: {
    size?: number;
    color?: string | string[];
  };

  hovertemplate?: string;

  // Pie-specific
  labels?: string[];
  values?: number[];
}

export interface BarChartTrace {
  type: "bar"; // always "bar" for bar charts
  name: string; // legend name
  x: (string | number)[]; // x-axis labels (e.g., months)
  y: number[]; // y-axis values
  marker?: {
    color?: string | string[]; // optional bar color
    line?: {
      color?: string;
      width?: number;
    };
  };
  text?: string[]; // optional labels on bars
  hovertemplate?: string; // optional hover format
  orientation?: "v" | "h"; // vertical or horizontal bars (default "v")
}

/** Represents a single funding category (equity, debt, grant) over time */
export interface FundingTimeSeriesTrace extends TimeSeriesTrace {
  name: string; // e.g., "Equity", "Debt", "Grant"
  marker?: {
    size?: number;
    color?: string | string[];
  };
}

/** Bar chart trace for funding breakdown per month */
export interface FundingBarChartTrace extends BarChartTrace {
  x: string[]; // months
  y: number[]; // amounts per funding type
  name: string; // "Equity", "Debt", "Grant", etc.
  marker?: {
    color?: string | string[];
    line?: { color?: string; width?: number };
  };
  hovertemplate?: string; // e.g., "%{x}: %{y}"
}

/** Pie chart trace for funding source distribution */
export interface FundingPieChartTrace extends PieChartTrace {
  type: "pie"; // fixed for pie chart
  labels: string[]; // funding types
  values: number[]; // totals per type
  hovertemplate?: string;
}
