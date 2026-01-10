"use client";

import React, { useMemo, useState } from "react";
import styled from "styled-components";

import { ButtonPrimaryConfirm } from "@/globals/buttons";

import {
  type COGSItem,
  type COSItem,
  isMajikProduct,
  isMajikService,
  isMajikSubscription,
  type RevenueItem,
} from "@thezelijah/majik-runway";

import * as AlertDialog from "@radix-ui/react-alert-dialog";
import CBaseCostItem from "./CBaseCostItem";

import InputCostingItem from "./InputCostingItem";
import {
  DialogContent,
  DialogOverlay,
  DialogTitle,
} from "@/globals/styled-dialogs";
import ConfirmationButton from "@/components/foundations/ConfirmationButton";
import DynamicPlaceholder from "@/components/foundations/DynamicPlaceholder";

type CostItem = COGSItem | COSItem;

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

interface RevenueStreamCostingManagerProps {
  onUpdate?: (updatedItem: RevenueItem) => void;
  onClear?: () => void;
  item: RevenueItem;
}

const RevenueStreamCostingManager: React.FC<
  RevenueStreamCostingManagerProps
> = ({ onUpdate, onClear, item }) => {
  const [refreshKey, setRefreshKey] = useState<number>(0);

  const itemList: CostItem[] = useMemo(() => {
    switch (true) {
      case isMajikProduct(item): {
        return [...item.cogs];
      }
      case isMajikService(item): {
        return [...item.cos];
      }
      case isMajikSubscription(item): {
        return [...item.cos];
      }
      default:
        return [];
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item, refreshKey]);

  const [isAdding, setIsAdding] = useState(false);

  const [currentValue, setCurrentValue] = useState<CostItem | null>(null);

  const handleAddToggle = () => {
    setIsAdding((prev) => !prev);
    setCurrentValue(null); // Reset value when toggling add mode
  };

  const handleClearList = () => {
    onUpdate?.(item.clearCostBreakdown());
    onClear?.();
  };

  const handleCancel = () => {
    setIsAdding(false);
    setCurrentValue(null);
  };

  const handleSaveNewItem = (newItem: CostItem) => {
    switch (true) {
      case isMajikProduct(item): {
        const updatedRevenueItem = item.addCOGS(
          newItem.item,
          newItem.unitCost,
          newItem.quantity,
          newItem.unit
        );
        onUpdate?.(updatedRevenueItem);
        handleCancel();
        break;
      }
      case isMajikService(item): {
        const updatedRevenueItem = item.addCOS(
          newItem.item,
          newItem.unitCost,
          newItem.quantity,
          newItem.unit
        );
        onUpdate?.(updatedRevenueItem);
        handleCancel();
        break;
      }
      case isMajikSubscription(item): {
        const updatedRevenueItem = item.addCOS(
          newItem.item,
          newItem.unitCost,
          newItem.quantity,
          newItem.unit
        );
        onUpdate?.(updatedRevenueItem);
        handleCancel();
        break;
      }
      default:
        return;
    }
    setRefreshKey((prev) => prev + 1);
    return;
  };

  const handleEditItem = (editItem: CostItem) => {
    setCurrentValue(editItem);
    setIsAdding(true);
    setRefreshKey((prev) => prev + 1);
  };

  const handleEditSave = (updatedItem: CostItem) => {
    switch (true) {
      case isMajikProduct(item): {
        const updatedRevenueItem = item.updateCOGS(updatedItem.id, updatedItem);

        onUpdate?.(updatedRevenueItem);
        handleCancel();
        break;
      }
      case isMajikService(item): {
        const updatedRevenueItem = item.updateCOS(updatedItem.id, updatedItem);

        onUpdate?.(updatedRevenueItem);
        handleCancel();
        break;
      }
      case isMajikSubscription(item): {
        const updatedRevenueItem = item.updateCOS(updatedItem.id, updatedItem);

        onUpdate?.(updatedRevenueItem);
        handleCancel();
        break;
      }
      default:
        return;
    }
    setRefreshKey((prev) => prev + 1);
    return;
  };

  const handleDeleteItem = (itemID: string) => {
    switch (true) {
      case isMajikProduct(item): {
        const updatedRevenueItem = item.removeCOGS(itemID);

        onUpdate?.(updatedRevenueItem);
        handleCancel();
        break;
      }
      case isMajikService(item): {
        const updatedRevenueItem = item.removeCOS(itemID);

        onUpdate?.(updatedRevenueItem);
        handleCancel();
        break;
      }
      case isMajikSubscription(item): {
        const updatedRevenueItem = item.removeCOS(itemID);

        onUpdate?.(updatedRevenueItem);
        handleCancel();
        break;
      }
      default:
        return;
    }
    setRefreshKey((prev) => prev + 1);
    return;
  };

  return (
    <Container>
      {!isAdding && (
        <TopMenuContainer>
          <ButtonPrimaryConfirm onClick={handleAddToggle}>
            Add Costing Item
          </ButtonPrimaryConfirm>
          <ConfirmationButton
            onClick={handleClearList}
            disabled={!itemList || itemList.length === 0}
            alertTextTitle="Clear Costing Breakdown"
            text="Clear"
            strict
          />
        </TopMenuContainer>
      )}

      {!isAdding && (
        <OptionList>
          {itemList.length > 0 ? (
            itemList.map((cost, index) => (
              <OptionItem key={index}>
                <CBaseCostItem
                  itemData={cost}
                  onEdit={handleEditItem}
                  onDelete={(currentItem) => handleDeleteItem(currentItem.id)}
                />
              </OptionItem>
            ))
          ) : (
            <DynamicPlaceholder>
              No cost items added yet. Start by adding one.
            </DynamicPlaceholder>
          )}
        </OptionList>
      )}
      <AlertDialog.Root open={isAdding} onOpenChange={setIsAdding}>
        <AlertDialog.Portal>
          <DialogOverlay>
            <DialogContent>
              <DialogTitle>{`${
                currentValue ? "Edit" : "Add"
              } Item`}</DialogTitle>

              <InputCostingItem
                currentValue={currentValue}
                onAdd={currentValue ? handleEditSave : handleSaveNewItem}
                onCancel={handleCancel}
              />
            </DialogContent>
          </DialogOverlay>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </Container>
  );
};

export default RevenueStreamCostingManager;
