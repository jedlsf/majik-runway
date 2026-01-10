"use client";

import React, { useState, useMemo } from "react";
import styled from "styled-components";

import { ButtonPrimaryConfirm } from "@/globals/buttons";

import * as AlertDialog from "@radix-ui/react-alert-dialog";

import {
  type RevenueItem,
  type MonthlyCapacity,
  type PeriodYYYYMM,
  type YYYYMM,
  monthsInPeriod,
} from "@thezelijah/majik-runway";

import {
  DialogContent,
  DialogOverlay,
  DialogTitle,
} from "@/globals/styled-dialogs";

import CBaseCapacity from "./CBaseCapacity";
import InputCapacityItem from "./InputCapacityItem";
import ConfirmationButton from "@/components/foundations/ConfirmationButton";
import { GlobalSheetView } from "@/globals/enums";
import { ValueIncrementor } from "@/components/functional/ValueIncrementor";
import { formatPercentage } from "@/utils/helper";
import DuoButton from "@/components/foundations/DuoButton";

import DynamicPlaceholder from "@/components/foundations/DynamicPlaceholder";

const Container = styled.div`
  padding: 10px 0px;
  gap: 10px;
`;

const OptionList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const OptionItem = styled.li`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 10px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.secondaryBackground};
  cursor: pointer;
  transition: background-color 0.2s ease;
  border-radius: 8px;
  background-color: transparent;
`;

const TopMenuContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  gap: 15px;
  margin-bottom: 15px;
`;

interface RevenueStreamSupplyCapacityManagerProps {
  onUpdate?: (updatedItem: RevenueItem) => void;
  onClear?: () => void;
  item: RevenueItem;
  period?: PeriodYYYYMM;
}

const RevenueStreamSupplyCapacityManager: React.FC<
  RevenueStreamSupplyCapacityManagerProps
> = ({ onUpdate, onClear, item, period }) => {
  const [isAdding, setIsAdding] = useState<boolean>(false);

  const [currentValue, setCurrentValue] = useState<MonthlyCapacity | null>(
    null
  );

  const [sheetView, setSheetView] = useState<GlobalSheetView>(
    GlobalSheetView.CLOSED
  );

  const [capacityPerMonth, setCapacityPerMonth] = useState<number>(1);
  const [capacityGrowthRate, setCapacityGrowthRate] = useState<number>(0);

  const itemList: MonthlyCapacity[] = useMemo(() => [...item.capacity], [item]);

  const handleAddToggle = () => {
    setSheetView(GlobalSheetView.CREATE);
    setIsAdding((prev) => !prev);
    setCurrentValue(null); // Reset value when toggling add mode
  };

  const handleGenerateToggle = () => {
    setSheetView(GlobalSheetView.CUSTOM_A);
    setIsAdding((prev) => !prev);
    setCurrentValue(null); // Reset value when toggling add mode
  };

  const handleClearList = () => {
    onUpdate?.(item.clearCapacity());
    onClear?.();
  };

  const handleCancel = () => {
    setIsAdding(false);
    setCurrentValue(null);
    setSheetView(GlobalSheetView.CLOSED);
  };

  const handleUpdateCapacity = (input: number) => {
    setCapacityPerMonth(input ?? 1);
  };

  const handleUpdateCapacityGrowthRate = (input: number) => {
    setCapacityGrowthRate(parseFloat(input.toFixed(4)));
  };

  const handleSaveNewItem = (newItem: MonthlyCapacity) => {
    const updatedCapacityItem = item.addCapacity(
      newItem.month,
      newItem.capacity,
      newItem.adjustment
    );
    onUpdate?.(updatedCapacityItem);
    handleCancel();
  };

  const handleEditItem = (editItem: MonthlyCapacity) => {
    setSheetView(GlobalSheetView.CREATE);
    setCurrentValue(editItem);
    setIsAdding(true);
  };

  const handleEditSave = (updatedItem: MonthlyCapacity) => {
    const updatedCapacityItem = item
      .updateCapacityUnits(updatedItem.month, updatedItem.capacity)
      .updateCapacityAdjustment(updatedItem.month, updatedItem.adjustment);

    onUpdate?.(updatedCapacityItem);
    handleCancel();
  };

  const handleDeleteItem = (month: YYYYMM) => {
    const updatedCapacityItem = item.removeCapacity(month);


    onUpdate?.(updatedCapacityItem);
    handleCancel();
  };

  const handleGeneratePlan = () => {
    const updatedCapacityItem = item.generateCapacityPlan(
      period ? monthsInPeriod(period.startMonth, period.endMonth) : 24,
      capacityPerMonth,
      capacityGrowthRate
    );

    onUpdate?.(updatedCapacityItem);
    handleCancel();
  };

  const getSheetViewWindow = (sheetView: GlobalSheetView) => {
    switch (sheetView) {
      case GlobalSheetView.CREATE: {
        return (
          <DialogContent>
            <DialogTitle>{`${currentValue ? "Edit" : "Add"} Item`}</DialogTitle>

            <InputCapacityItem
              currentValue={currentValue}
              onAdd={currentValue ? handleEditSave : handleSaveNewItem}
              onCancel={handleCancel}
              period={period}
              latestDate={
                item.hasCapacity()
                  ? (item.latestCapacityMonth as YYYYMM)
                  : undefined
              }
            />
          </DialogContent>
        );
      }
      case GlobalSheetView.CUSTOM_A: {
        return (
          <DialogContent>
            <DialogTitle>Generate Capacity Plan</DialogTitle>

            <ValueIncrementor
              label="Capacity"
              currentValue={capacityPerMonth}
              direction="row"
              incrementValue={1}
              onUpdate={handleUpdateCapacity}
              displayValue={`${capacityPerMonth.toString()} units`}
              helper="Defines the starting monthly capacity for this item. This value is used as the base capacity for the first month of the generated plan."
            />

            <ValueIncrementor
              label="Growth Rate"
              currentValue={capacityGrowthRate}
              direction="row"
              incrementValue={0.005}
              disableDecrement={capacityGrowthRate <= 0.5}
              onUpdate={handleUpdateCapacityGrowthRate}
              displayValue={formatPercentage(capacityGrowthRate, true)}
              helper="Controls how capacity changes month over month. If set to 0%, the capacity will remain the same for all months. Otherwise, each month’s capacity increases based on this rate."
            />
            <DuoButton
              textButtonA={"Cancel"}
              textButtonB={"Generate"}
              onClickButtonA={handleCancel}
              onClickButtonB={handleGeneratePlan}
              isDisabledButtonB={capacityPerMonth <= 0}
              strictMode={true}
            />
          </DialogContent>
        );
      }

      default:
        return null;
    }
  };

  return (
    <Container>
      {!isAdding && (
        <TopMenuContainer>
          <ButtonPrimaryConfirm onClick={handleAddToggle}>
            Add Capacity Plan
          </ButtonPrimaryConfirm>
          <ButtonPrimaryConfirm onClick={handleGenerateToggle}>
            Generate
          </ButtonPrimaryConfirm>

          <ConfirmationButton
            onClick={handleClearList}
            disabled={!itemList || itemList.length === 0}
            alertTextTitle="Clear Capacity Plans"
            text="Clear"
            strict
          />
        </TopMenuContainer>
      )}

      {!isAdding && (
        <OptionList>
          {itemList.length > 0 ? (
            itemList.map((capacity, index) => (
              <OptionItem key={index}>
                <CBaseCapacity
                  itemData={capacity}
                  onEdit={handleEditItem}
                  onDelete={(currentItem) =>
                    handleDeleteItem(currentItem.month)
                  }
                  totalCapacity={item.totalCapacity}
                />
              </OptionItem>
            ))
          ) : (
            <DynamicPlaceholder>
              No capacity items added yet. Start by adding one or generating
              automatically.
            </DynamicPlaceholder>
          )}
        </OptionList>
      )}
      <AlertDialog.Root open={isAdding} onOpenChange={setIsAdding}>
        <AlertDialog.Portal>
          <DialogOverlay>{getSheetViewWindow(sheetView)}</DialogOverlay>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </Container>
  );
};

export default RevenueStreamSupplyCapacityManager;
