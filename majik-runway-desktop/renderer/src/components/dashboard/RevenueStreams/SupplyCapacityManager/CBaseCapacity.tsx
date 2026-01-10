"use client";

import React, { useRef } from "react";
import styled, { css } from "styled-components";

import {
  formatPercentage,
  isDevEnvironment,
  isOnMobile,
} from "../../../../utils/helper";
import RowTextItem from "../../../../components/foundations/RowTextItem";
import theme from "../../../../globals/theme";

import StyledIconButton from "../../../../components/foundations/StyledIconButton";
import { PencilIcon } from "@phosphor-icons/react";
import DeleteButton from "../../../../components/foundations/DeleteButton";

import { type MonthlyCapacity } from "@thezelijah/majik-runway";

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

interface CBaseCapacityProps {
  itemData: MonthlyCapacity;
  onPressed?: (itemData: MonthlyCapacity) => void;
  onEdit?: (data: MonthlyCapacity) => void;
  onDelete?: (data: MonthlyCapacity) => void;
  canEdit?: boolean;
  canDelete?: boolean;
  totalCapacity?: number;
}

const CBaseCapacity: React.FC<CBaseCapacityProps> = ({
  itemData,
  onPressed,
  onEdit,
  onDelete,
  canEdit = true,
  canDelete = true,
  totalCapacity,
}) => {
  const longPressTimeout = useRef<NodeJS.Timeout | null>(null);
  const handleOnPressed = () => {
    if (isOnMobile()) return;
    if (isDevEnvironment())
      console.log("Capacity Item Pressed from Base: ", itemData);

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
            <ItemTitle>{itemData?.month ?? "Unknown Month"}</ItemTitle>
            <SubColumnContainer>
              <RowTextItem
                textKey="Capacity"
                textValue={itemData.capacity.toLocaleString()}
                highlight={true}
                colorValue={theme.colors.brand.green}
              />

              {!!itemData?.adjustment && itemData.adjustment > 0 ? (
                <RowTextItem
                  textKey="Adjustment"
                  textValue={itemData.adjustment.toLocaleString()}
                  highlight={false}
                />
              ) : null}

              {totalCapacity ? (
                <RowTextItem
                  textKey="Capacity Margin"
                  textValue={formatPercentage(
                    itemData.capacity / totalCapacity
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

export default CBaseCapacity;
