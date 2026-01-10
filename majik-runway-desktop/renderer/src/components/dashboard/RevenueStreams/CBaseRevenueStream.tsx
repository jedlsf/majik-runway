"use client";

import React from "react";
import styled, { css } from "styled-components";

import { formatPercentage, isDevEnvironment } from "../../../utils/helper";
import RowTextItem from "../../../components/foundations/RowTextItem";
import theme from "../../../globals/theme";
import {
  isMajikProduct,
  isMajikService,
  isMajikSubscription,
  type RevenueItem,
} from "@thezelijah/majik-runway";
import StyledIconButton from "../../../components/foundations/StyledIconButton";
import { PencilIcon } from "@phosphor-icons/react";
import DeleteButton from "../../../components/foundations/DeleteButton";

// Styled components
const RootContainer = styled.div`

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

const ItemDescription = styled.div`
  font-size: 10px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 4px;
  font-weight: 400;
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

interface CBaseRevenueStreamProps {
  itemData: RevenueItem;
  onPressed?: (itemData: RevenueItem) => void;
  onEdit?: (data: RevenueItem) => void;
  onDelete?: (data: RevenueItem) => void;
  canEdit?: boolean;
  canDelete?: boolean;
}

const CBaseRevenueStream: React.FC<CBaseRevenueStreamProps> = ({
  itemData,
  onPressed,
  onEdit,
  onDelete,
  canEdit = true,
  canDelete = true,
}) => {
  const handleOnPressed = () => {
    if (isDevEnvironment())
      console.log("Revenue Stream Item Pressed from Base: ", itemData);

    if (!itemData) return;
    if (onPressed) onPressed(itemData);
  };

  return (
    <RootContainer onClick={handleOnPressed}>
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
            <ItemTitle>{itemData?.name ?? "Revenue Item"}</ItemTitle>
            <SubColumnContainer>
              {isMajikProduct(itemData) && (
                <RowTextItem
                  textKey="Price"
                  textValue={itemData.price.format()}
                  highlight={true}
                  colorValue={theme.colors.brand.green}
                />
              )}

              {isMajikService(itemData) && (
                <RowTextItem
                  textKey="Rate"
                  textValue={`${itemData.price.format()} per ${
                    itemData.rate.unit
                  }}`}
                  highlight={true}
                  colorValue={theme.colors.brand.green}
                />
              )}

              {isMajikSubscription(itemData) && (
                <RowTextItem
                  textKey="Price"
                  textValue={`${itemData.price.format()} per ${
                    itemData.rate.unit
                  }}`}
                  highlight={true}
                  colorValue={theme.colors.brand.green}
                />
              )}

              {!!itemData?.unitMargin && itemData.unitMargin > 0 ? (
                <RowTextItem
                  textKey="Profit Margin"
                  textValue={formatPercentage(itemData?.unitMargin)}
                />
              ) : null}

              <RowTextItem
                textKey="Gross Revenue"
                textValue={itemData.metadata.finance.revenue.gross.value.format()}
              />

              {isMajikProduct(itemData) && (
                <RowTextItem
                  textKey="Gross COGS"
                  textValue={itemData.metadata.finance.cogs.gross.value.format()}
                  highlight={false}
                />
              )}

              {isMajikProduct(itemData) && (
                <RowTextItem
                  textKey="Stock"
                  textValue={`${itemData.metadata.inventory.stock}`}
                  highlight={false}
                />
              )}
            </SubColumnContainer>

            {!!itemData?.metadata?.description?.text &&
              itemData.metadata.description.text.trim() !== "" && (
                <ItemDescription>
                  {itemData.metadata.description.text}
                </ItemDescription>
              )}
          </ColumnMain>
        </ColumnInfo>
      </BodyContainer>
    </RootContainer>
  );
};

export default CBaseRevenueStream;
