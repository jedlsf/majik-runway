"use client";

import React, { useMemo } from "react";
import styled, { css, keyframes } from "styled-components";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { type RunwayHealth } from "@thezelijah/majik-runway";
import theme from "../../globals/theme";

// ─────────────────────────────────────────────────────────────
// Severity helpers
// ─────────────────────────────────────────────────────────────

const StyledDropdownMenuContent = styled(DropdownMenuContent)`
  max-height: 500px; /* enable scrolling */
  min-width: 260px;
  overflow-y: auto;
  padding: 10px;
  background: ${({ theme }) => theme.colors.primaryBackground};

  /* Custom Scrollbar Styling */
  &::-webkit-scrollbar {
    width: 1px; /* Width of the entire scrollbar */
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0); /* Background color of the scrollbar track */
    border-radius: 24px; /* Rounded corners of the scrollbar track */
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0); /* Color of the scrollbar thumb */
    border-radius: 24px; /* Rounded corners of the scrollbar thumb */
    border: 1px solid transparent; /* Space around the thumb */
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: rgba(
      0,
      0,
      0,
      0
    ); /* Color when hovering over the scrollbar thumb */
  }

  /* Custom Scrollbar for Firefox */
  scrollbar-width: thin; /* Makes the scrollbar thinner */
  scrollbar-color: ${({ theme }) => theme.colors.secondaryBackground}
    rgba(0, 0, 0, 0); /* Thumb and track colors */
`;

type HealthStatus = RunwayHealth["status"];

const STATUS_COLORS: Record<HealthStatus, string> = {
  healthy: theme.colors.brand.green, // green
  warning: theme.colors.brand.blue, // amber
  critical: theme.colors.error, // red
};

const STATUS_LABELS: Record<HealthStatus, string> = {
  healthy: "Healthy",
  warning: "Warning",
  critical: "Critical",
};

const STATUS_PRIORITY: Record<HealthStatus, number> = {
  critical: 0,
  warning: 1,
  healthy: 2,
};

// ─────────────────────────────────────────────────────────────
// Animations
// ─────────────────────────────────────────────────────────────

const pulse = (color: string) => keyframes`
  0% {
    box-shadow: 0 0 0 0 ${color}55;
  }
  50% {
    box-shadow: 0 0 0 8px ${color}22;
  }
  100% {
    box-shadow: 0 0 0 0 ${color}55;
  }
`;

// ─────────────────────────────────────────────────────────────
// Styled Components
// ─────────────────────────────────────────────────────────────

const RootContainer = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

const IndicatorButton = styled.div<{ status: HealthStatus }>`
  width: 14px;
  height: 14px;
  border-radius: 999px;
  background-color: ${({ status }) => STATUS_COLORS[status]};
  cursor: pointer;

  animation: ${({ status }) => pulse(STATUS_COLORS[status])} 2.8s ease-in-out
    infinite;

  transition: transform 0.15s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

const Header = styled.div<{ status: HealthStatus }>`
  font-size: 14px;
  font-weight: 600;
  color: ${({ status }) => STATUS_COLORS[status]};
  margin-bottom: 6px;
`;

const ReasonItem = styled.div<{ status: HealthStatus }>`
  font-size: 13px;
  padding: 6px 8px;
  margin: 10px 0px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 8px;

  ${({ status }) => css`
    color: ${STATUS_COLORS[status]};
    background-color: ${STATUS_COLORS[status]}15;
  `}
`;

const EmptyState = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
  padding: 6px 8px;
`;

// ─────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────

interface MajikRunwayHealthIndicatorProps {
  health: RunwayHealth;
}

// ─────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────

const MajikRunwayHealthIndicator: React.FC<MajikRunwayHealthIndicatorProps> = ({
  health,
}) => {
  const sortedReasons = useMemo(() => {
    if (!health.reasons?.length) return [];

    return [...health.reasons].sort(() => STATUS_PRIORITY[health.status]);
  }, [health]);

  return (
    <RootContainer>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <IndicatorButton status={health.status} />
        </DropdownMenuTrigger>

        <StyledDropdownMenuContent align="end">
          <Header status={health.status}>
            {STATUS_LABELS[health.status]} Status
          </Header>

          <DropdownMenuSeparator />

          {sortedReasons.length === 0 || health.status === "healthy" ? (
            <EmptyState>No issues detected. Everything looks good.</EmptyState>
          ) : (
            sortedReasons.map((reason, index) => (
              <DropdownMenuItem
                key={index}
                asChild
                className="!px-4 !py-2 data-[highlighted]:bg-[#750c0c] text-[#f7f7f7] data-[highlighted]:text-[#f7f7f7]"
              >
                <ReasonItem status={health.status}>{reason}</ReasonItem>
              </DropdownMenuItem>
            ))
          )}
        </StyledDropdownMenuContent>
      </DropdownMenu>
    </RootContainer>
  );
};

export default MajikRunwayHealthIndicator;
