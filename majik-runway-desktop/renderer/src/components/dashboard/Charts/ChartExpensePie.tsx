// components/ChartExpensePie.tsx
"use client";

import React, { useMemo } from "react";
import styled from "styled-components";
import Plot from "react-plotly.js";
import theme from "@/globals/theme";
import { type PieChartTrace } from "@thezelijah/majik-runway";
import DynamicPlaceholder from "@/components/foundations/DynamicPlaceholder";

interface ChartExpensePieProps {
  data: PieChartTrace[];
  title?: string;
}

const RootContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

const ChartExpensePie: React.FC<ChartExpensePieProps> = ({ data, title }) => {
  // Memoize data for performance
  const plotData: PieChartTrace[] = useMemo(() => {
    return data.map((trace) => ({
      ...trace,
      hovertemplate:
        trace.hovertemplate ??
        "%{label}<br>₱%{value:,.2f} (%{percent})<extra></extra>",
    }));
  }, [data]);

  const layout: Partial<Plotly.Layout> = useMemo(() => {
    return {
      autosize: true,
      margin: { l: 20, r: 20, t: 60, b: 20 },
      plot_bgcolor: "transparent",
      paper_bgcolor: "transparent",
      title: {
        text: title ?? "Expense Breakdown",
        font: { color: theme.colors.textPrimary, size: 16 },
        x: 0.5,
        y: 0.95,
      },
      height: 450,
      legend: {
        orientation: "h",
        x: 0,
        y: -0.1,
        font: { color: theme.colors.textSecondary },
      },
    };
  }, [title]);

  return (
    <RootContainer>
      {!!plotData && plotData.length > 0 ? (
        <Plot
          data={plotData}
          layout={layout}
          useResizeHandler
          style={{ width: "100%", height: "100%" }}
          config={{ responsive: true, displayModeBar: false }}
        />
      ) : (
        <DynamicPlaceholder>
          No data to show. Try adding your first expense.
        </DynamicPlaceholder>
      )}
    </RootContainer>
  );
};

export default ChartExpensePie;
