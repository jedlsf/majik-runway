// components/ChartFundingTimeSeries.tsx
import React, { useMemo } from "react";

import styled from "styled-components";
import Plot from "react-plotly.js";
import theme from "@/globals/theme";
import { type FundingTimeSeriesTrace } from "@thezelijah/majik-runway";

interface ChartFundingTimeSeriesProps {
  data: FundingTimeSeriesTrace[];
}

const RootContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

const ChartFundingTimeSeries: React.FC<ChartFundingTimeSeriesProps> = ({
  data,
}) => {
  // Memoize data for performance
  const plotData: FundingTimeSeriesTrace[] = useMemo(() => {
    return data.map((trace) => ({
      ...trace,
      line: {
        ...trace.line,
        width: trace.line?.width ?? 3,
      },
      marker: {
        ...trace.marker,
        size: trace.marker?.size ?? 6,
      },
    }));
  }, [data]);

  const layout: Partial<Plotly.Layout> = useMemo(() => {
    return {
      autosize: true,
      margin: { l: 120, r: 40, t: 80, b: 80 }, // left margin for y-axis labels
      plot_bgcolor: "transparent",
      paper_bgcolor: "transparent",
      colorway: [
        theme.colors.brand.blue,
        theme.colors.textPrimary,
        theme.colors.primary,
      ],
      title: {
        text: "Funding Time Series",
        font: { color: theme.colors.textPrimary, size: 16 },
        x: 0.5,
        y: 0.95,
      },
      height: 450,
      legend: {
        orientation: "h",
        x: 0,
        y: 1.15,
        font: { color: theme.colors.textSecondary },
      },
      line: { shape: "spline", width: 3 },

      xaxis: {
        title: { text: "Month", standoff: 20 },
        showgrid: true,
        zeroline: false,
        gridcolor: theme.colors.secondaryBackground,
        color: theme.colors.textPrimary,
        tickangle: -45, // slanted labels for readability
        tickformat: "%b %Y", // month-year format
        automargin: true,
      },

      yaxis: {
        title: { text: "Fund Amount (₱)", standoff: 40 },
        showgrid: true,
        zeroline: true,
        zerolinecolor: "#444",
        gridcolor: theme.colors.secondaryBackground,
        color: theme.colors.textPrimary,
        tickprefix: "₱",
        separatethousands: true,
        automargin: true,
      },
    };
  }, []);

  return (
    <RootContainer>
      <Plot
        data={plotData}
        layout={layout}
        useResizeHandler
        style={{ width: "100%", height: "100%" }}
        config={{ responsive: true, displayModeBar: false }}
      />
    </RootContainer>
  );
};

export default ChartFundingTimeSeries;
