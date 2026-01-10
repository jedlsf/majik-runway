// DynamicColoredValue.tsx
"use client";


import React, { type ReactNode, useMemo } from "react";
import styled, { useTheme } from "styled-components";
import { isDevEnvironment } from "../../utils/helper";

const RootContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ValueText = styled.span<{
  $color: string;
  $size?: number;
  $weight?: number;
}>`
  color: ${(props) => props.$color};
  font-weight: ${(props) => props.$weight ?? 400};
  font-size: ${(props) => props.$size ?? 12}px;
  white-space: nowrap;
  width: 100%;
`;


interface ColorMapItem {
  color: string; // hex color
  min?: number; // optional minimum threshold
  max?: number; // optional maximum threshold
}

interface DynamicColoredValueProps {
  children: ReactNode;
  colorsMap?: ColorMapItem[]; // multiple colors with optional thresholds
  value?: number; // value to check against thresholds
  size?: number;
  weight?: number;
}

export const DynamicColoredValue: React.FC<DynamicColoredValueProps> = ({
  children,
  colorsMap,
  value,
  size = 12,
  weight = 400,
}) => {
  const theme = useTheme();

  const resolvedColor = useMemo(() => {
    if (!colorsMap || colorsMap.length === 0) {
      return theme.colors.textPrimary;
    }

    // Validate colors map in dev mode
    if (isDevEnvironment()) {
      for (let i = 0; i < colorsMap.length; i++) {
        const { min, max } = colorsMap[i];

        if (min !== undefined && max !== undefined && min > max) {
          console.warn(
            `[DynamicColoredValue] ColorMapItem at index ${i} has min > max:`,
            colorsMap[i]
          );
        }

        // Check for overlapping ranges
        for (let j = i + 1; j < colorsMap.length; j++) {
          const other = colorsMap[j];
          if (
            (min ?? -Infinity) <= (other.max ?? Infinity) &&
            (max ?? Infinity) >= (other.min ?? -Infinity)
          ) {
            console.warn(
              `[DynamicColoredValue] Overlapping ColorMapItems at index ${i} and ${j}:`,
              colorsMap[i],
              other
            );
          }
        }
      }
    }

    // Single color fallback
    if (colorsMap.length === 1) {
      return colorsMap[0].color;
    }

    // Multiple colors with thresholds
    if (value !== undefined) {
      const matching = colorsMap.find(
        (c) =>
          (c.min === undefined || value >= c.min) &&
          (c.max === undefined || value <= c.max)
      );
      if (matching) return matching.color;
    }

    // Fallback if value doesn't match any range
    return colorsMap[0].color;
  }, [colorsMap, value, theme.colors.textPrimary]);

  return (
    <RootContainer>
      <ValueText $color={resolvedColor} $size={size} $weight={weight}>
        {children}
      </ValueText>
    </RootContainer>
  );
};
