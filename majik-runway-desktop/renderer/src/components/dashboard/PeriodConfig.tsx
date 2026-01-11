"use client";

import React, { useState } from "react";
import styled from "styled-components";

import { toast } from "sonner";

import {
  dateToYYYYMM,
  offsetMonthsToYYYYMM,
  type PeriodYYYYMM,
} from "@thezelijah/majik-runway";

import { SectionSubTitle } from "../../globals/styled-components";

import DuoButton from "../foundations/DuoButton";
import PeriodSetter from "./PeriodSetter";

// Styled components
const BodyContainer = styled.div`
  width: 100%;
  align-items: center;
  justify-content: flex-start;
  display: flex;
  flex-direction: column;
  user-select: none;
  height: inherit;
  gap: 5px;
  min-width: 620px;

  background-color: ${({ theme }) => theme.colors.primaryBackground};

  @media (max-width: 768px) {
    min-width: 280px;
  }
`;

const FormBodyEvent = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 500px;
  width: 100%;
  flex-grow: 1; /* Allows it to grow and take available space */
  gap: 15px;
  padding: 15px;
  box-sizing: border-box; /* Include padding and borders in width/height */
`;

const StackRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  gap: 15px;
  margin-top: 10px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const MenuSubtitle = styled.p`
  width: 100%;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

interface PeriodConfigProps {
  onSubmit?: (period: PeriodYYYYMM) => void;
  onCancel?: () => void;
  period?: PeriodYYYYMM;
}

export const PeriodConfig: React.FC<PeriodConfigProps> = ({
  onSubmit,
  onCancel,
  period,
}) => {
  const [periodInstance, setperiodInstance] = useState<PeriodYYYYMM>({
    startMonth: period?.startMonth || dateToYYYYMM(new Date()),
    endMonth:
      period?.endMonth || offsetMonthsToYYYYMM(dateToYYYYMM(new Date()), 23),
  });
  const [isDirty, setIsDirty] = useState<boolean>(false);

  const handleRevert = () => {
    console.log("Reverting Changes");
    setperiodInstance({
      startMonth: period?.startMonth || dateToYYYYMM(new Date()),
      endMonth:
        period?.endMonth || offsetMonthsToYYYYMM(dateToYYYYMM(new Date()), 23),
    });
    onCancel?.();
    setIsDirty(false);
  };

  const handleUpdatePeriod = (input: PeriodYYYYMM) => {
    try {
 
      setperiodInstance((prev) => {
        return {
          ...prev,
          startMonth: input.startMonth,
          endMonth: input.endMonth,
        };
      });
      setIsDirty(true);
    } catch (error) {
      console.error("Problem while updating Period: ", error);
      toast.error("Error", {
        description: `Oops! There seems to be a problem while updating: ${error}`,
        id: "error-input-period",
      });
    }
  };

  const handleSubmitSave = () => {
    console.log("Saving Changes");
    onSubmit?.(periodInstance);
  };

  return (
    <BodyContainer>
      <FormBodyEvent>
        <SectionSubTitle>Runway Period</SectionSubTitle>
        <MenuSubtitle>
          Define the start and end months used to calculate your financial
          runway and projections.
        </MenuSubtitle>

        <StackRow>
          <PeriodSetter
            onChange={handleUpdatePeriod}
            currentValue={periodInstance}
            required
          />
        </StackRow>

        <DuoButton
          textButtonA="Revert"
          textButtonB="Save Changes"
          isDisabledButtonB={!isDirty}
          onClickButtonA={handleRevert}
          onClickButtonB={handleSubmitSave}
        />
      </FormBodyEvent>
    </BodyContainer>
  );
};

export default PeriodConfig;
