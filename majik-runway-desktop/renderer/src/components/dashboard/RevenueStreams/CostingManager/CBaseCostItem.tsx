"use client";

import React, { useRef } from "react";
import styled, { css } from "styled-components";

import { formatPercentage, isDevEnvironment, isOnMobile } from "@/utils/helper";
import RowTextItem from "@/components/foundations/RowTextItem";
import theme from "@/globals/theme";

import StyledIconButton from "@/components/foundations/StyledIconButton";
import { PencilIcon } from "@phosphor-icons/react";
import DeleteButton from "@/components/foundations/DeleteButton";

import {
  type COGSItem,
  type COSItem,
  MajikMoney,
} from "@thezelijah/majik-runway";

type CostItem = COGSItem | COSItem;

// Styled components
const RootContainer = styled.div`
  min-width: 340px;
  width: 100%;
  border: 1px solid transparent;
  border-radius: 8px;
   display: flex;
 flex-direction: column;
 gap: 5px;

   user-select: none;
  transition: all 0.3s ease;

     @media (hover: hover) and (pointer: fine) {

   &:hover {
        border: 1px solid ${({ theme }) => theme.colors.secondaryBackground};

  }


`;

const BodyContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.secondaryBackground};
  border-radius: 12px;
  display: flex;
  width: 100%;
    padding: 0px;
  transition: all 0.4s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.085);
    cursor: pointer;
  @media (hover: hover) and (pointer: fine) {

   &:hover {
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.24);
       border-radius: 0px 0px 12px 12px;

  }
`;

const ColumnMain = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  justify-content: left;
  text-align: left;
`;

const ColumnInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  text-align: left;
  gap: 25px;
  width: 100%;
  padding: 15px;
`;

const ItemTitle = styled.div`
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 8px;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const SubColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  width: 100%;
  margin-bottom: 10px;
`;

const ActionButtonRow = styled.div<{ $enableHover?: boolean }>`
  display: flex;
  flex-direction: row;
  gap: 3px;
  align-items: center;
  justify-content: flex-end;
  transition: all 0.2s ease;
  height: 0px;
  opacity: 0;

  ${({ $enableHover }) =>
    $enableHover &&
    css`
      @media (hover: hover) and (pointer: fine) {
        ${RootContainer}:hover & {
          height: 30px;
          opacity: 1;
          padding: 5px;
          margin: 3px;
        }
      }
    `}
`;

interface CBaseCostItemProps {
  itemData: CostItem;
  onPressed?: (itemData: CostItem) => void;
  onEdit?: (data: CostItem) => void;
  onDelete?: (data: CostItem) => void;
  canEdit?: boolean;
  canDelete?: boolean;
  totalCost?: MajikMoney;
}

const CBaseCostItem: React.FC<CBaseCostItemProps> = ({
  itemData,
  onPressed,
  onEdit,
  onDelete,
  canEdit = true,
  canDelete = true,
  totalCost,
}) => {
  const longPressTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleOnPressed = () => {
    if (isOnMobile()) return;
    if (isDevEnvironment())
      console.log("Cost Item Pressed from Base: ", itemData);

    if (!itemData) return;
    onPressed?.(itemData);
  };

  const handlePressStart = () => {
    if (isOnMobile()) {
      // Start long press detection (for delete)
      longPressTimeout.current = setTimeout(() => {
        if (onDelete && canDelete) onDelete(itemData);
      }, 600); // 600ms for long press
    }
  };

  const handlePressEnd = () => {
    if (longPressTimeout.current) {
      clearTimeout(longPressTimeout.current);
      longPressTimeout.current = null;

      // If press ended before long press threshold, treat as edit
      if (isOnMobile() && onEdit && canEdit) onEdit(itemData);
      else if (!isOnMobile() && onPressed) onPressed(itemData); // desktop click
    }
  };

  return (
    <RootContainer
      onPointerDown={handlePressStart}
      onPointerUp={handlePressEnd}
      onPointerLeave={() => {
        if (longPressTimeout.current) {
          clearTimeout(longPressTimeout.current);
          longPressTimeout.current = null;
        }
      }}
    >
      <ActionButtonRow
        $enableHover={(!!onDelete && canDelete) || (!!onEdit && canEdit)}
      >
        {!!onEdit && onEdit !== undefined && !!canEdit ? (
          <StyledIconButton
            icon={PencilIcon}
            size={20}
            onClick={() => onEdit?.(itemData)}
            tooltip="Edit"
            disabled={!canEdit}
          />
        ) : null}

        {!!onDelete && onDelete !== undefined && !!canDelete ? (
          <DeleteButton
            title="deliverable"
            onClick={() => onDelete?.(itemData)}
          />
        ) : null}
      </ActionButtonRow>
      <BodyContainer onClick={handleOnPressed}>
        <ColumnInfo>
          <ColumnMain>
            <ItemTitle>{itemData?.item ?? "Cost Item"}</ItemTitle>
            <SubColumnContainer>
              <RowTextItem
                textKey="Unit Cost"
                textValue={itemData.unitCost.format()}
                highlight={false}
              />

              <RowTextItem
                textKey="Quantity"
                textValue={`${itemData.quantity.toLocaleString()} ${
                  itemData.unit
                }`}
                highlight={false}
              />

              <RowTextItem
                textKey="Subtotal"
                textValue={itemData.subtotal.format()}
                highlight={true}
                colorValue={theme.colors.primary}
              />

              {!!totalCost && !totalCost.isPositive() ? (
                <RowTextItem
                  textKey="Cost Margin"
                  textValue={formatPercentage(
                    itemData.subtotal.ratio(totalCost)
                  )}
                />
              ) : null}
            </SubColumnContainer>
          </ColumnMain>
        </ColumnInfo>
      </BodyContainer>
    </RootContainer>
  );
};

export default CBaseCostItem;
