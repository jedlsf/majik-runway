// components/ChartCashflowBar.tsx
import React, { useMemo } from "react";
import styled from "styled-components";
import Plot from "react-plotly.js";
import theme from "@/globals/theme";
import { type BarChartTrace } from "@thezelijah/majik-runway";

interface ChartCashflowBarProps {
  data: BarChartTrace[];
}

const RootContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

const ChartCashflowBar: React.FC<ChartCashflowBarProps> = ({ data }) => {
  // Memoize data for performance
  const plotData: BarChartTrace[] = useMemo(() => {
    return data.map((trace) => ({
      ...trace,
      marker: {
        ...trace.marker,
        line: {
          ...(trace.marker?.line ?? {}),
          width: trace.marker?.line?.width ?? 1,
        },
      },
      hovertemplate:
        trace.hovertemplate ?? "%{x}<br> ₱%{y:,.2f}<extra></extra>",
    }));
  }, [data]);

  const layout: Partial<Plotly.Layout> = useMemo(
    () => ({
      autosize: true,
      barmode: "group", // grouped bars
      margin: { l: 120, r: 40, t: 80, b: 80 }, // left margin for y-axis labels
      plot_bgcolor: "transparent",
      paper_bgcolor: "transparent",
      title: {
        text: "Monthly Cashflow",
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

      xaxis: {
        title: {
          text: "Month",
          standoff: 20,
          font: { color: theme.colors.textPrimary },
        },
        showgrid: true,
        zeroline: false,
        gridcolor: theme.colors.secondaryBackground,
        color: theme.colors.textPrimary,
        tickangle: -45,
        automargin: true,
      },

      yaxis: {
        title: { text: "Amount (₱)", standoff: 40 },
        showgrid: true,
        zeroline: true,
        zerolinecolor: "#444",
        gridcolor: theme.colors.secondaryBackground,
        color: theme.colors.textPrimary,
        tickprefix: "₱",
        separatethousands: true,
        automargin: true,
      },
    }),

    []
  );

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

export default ChartCashflowBar;
