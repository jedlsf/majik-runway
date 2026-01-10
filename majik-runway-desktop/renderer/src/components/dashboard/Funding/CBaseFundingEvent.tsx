"use client";

import React from "react";
import styled, { css } from "styled-components";

import { formatPercentage, isDevEnvironment } from "@/utils/helper";
import RowTextItem from "@/components/foundations/RowTextItem";
import theme from "@/globals/theme";

import DeleteButton from "@/components/foundations/DeleteButton";
import { FundingEvent } from "@thezelijah/majik-runway";

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

interface CBaseFundingEventProps {
  itemData: FundingEvent;
  onPressed?: (itemData: FundingEvent) => void;
  onEdit?: (data: FundingEvent) => void;
  onDelete?: (data: FundingEvent) => void;
  canEdit?: boolean;
  canDelete?: boolean;
}

const CBaseFundingEvent: React.FC<CBaseFundingEventProps> = ({
  itemData,
  onPressed,
  onDelete,
  canDelete = true,
}) => {
  const handleOnPressed = () => {
    if (isDevEnvironment())
      console.log("FundingEvent Item Pressed from Base: ", itemData);

    if (!itemData) return;
    if (onPressed) onPressed(itemData);
  };

  return (
    <RootContainer onClick={handleOnPressed}>
      <ActionButtonRow $enableHover={!!onDelete && canDelete}>
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
            <ItemTitle>{itemData?.name ?? "FundingEvent Item"}</ItemTitle>
            <SubColumnContainer>
              <RowTextItem
                textKey="Amount"
                textValue={itemData.amount.format()}
                highlight={true}
                colorValue={theme.colors.brand.green}
              />

              <RowTextItem
                textKey="Type"
                textValue={itemData.type}
                highlight={false}
              />

              {itemData.isDebt && (
                <RowTextItem
                  textKey="Interest Rate"
                  textValue={formatPercentage(itemData.interestRate, true)}
                  highlight={false}
                />
              )}
            </SubColumnContainer>
          </ColumnMain>
        </ColumnInfo>
      </BodyContainer>
    </RootContainer>
  );
};

export default CBaseFundingEvent;
