"use client";

import React, { useMemo, useRef, useState } from "react";
import styled from "styled-components";

import { ButtonPrimaryConfirm } from "@/globals/buttons";
import { Button } from "@/components/ui/button";

import { Drawer } from "vaul";
import {
  CloseButton,
  StyledDialogContent,
  StyledDialogDescription,
  StyledDialogOverlay,
  StyledDialogTitle,
} from "@/globals/styled-slide-dialogs";

import { GlobalSheetView } from "@/globals/enums";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DesktopView, MobileView } from "@/globals/styled-components";
import HelperHover from "@/components/foundations/HelperHover";
import { MoreHorizontal } from "lucide-react";

import { formatPercentage, isOnMobile } from "@/utils/helper";
import ConfirmationButton from "@/components/foundations/ConfirmationButton";

import {
  FundingEvent,
  FundingType,
  FundingManager,
} from "@thezelijah/majik-runway";
import FormFunding from "./forms/FormFunding";
import CBaseFundingEvent from "./CBaseFundingEvent";

const Container = styled.div`
  padding: 10px;
  width: 100%;
  @media (max-width: 768px) {
    padding: 10px 0px;
  }
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
  @media (max-width: 768px) {
    flex-direction: column;
    justify-content: flex-start;
  }
`;

const FundingManagerOptions = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: flex-start;
  gap: 10px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

interface FundingManagerProps {
  onUpdate?: (updatedFundingManager: FundingManager) => void;
  onClear?: () => void;
  fundingManager: FundingManager;
}

const FundingEventsManager: React.FC<FundingManagerProps> = ({
  onUpdate,
  onClear,
  fundingManager,
}) => {
  const itemList = fundingManager.items || [];

  const [isAdding, setIsAdding] = useState(false);

  const [sheetView, setSheetView] = useState<GlobalSheetView>(
    GlobalSheetView.CLOSED
  );

  const [addType, setAddType] = useState<FundingType>(FundingType.Equity);

  const dialogRef = useRef<HTMLDivElement>(null);

  const handleAddToggle = (input: FundingType) => {
    setSheetView(GlobalSheetView.CREATE);
    setAddType(input);
    setIsAdding((prev) => !prev);
  };

  const handleClearList = () => {
    const updatedFundingManager = fundingManager.clear();
    onUpdate?.(updatedFundingManager);
    onClear?.();
  };

  const handleCancel = () => {
    setIsAdding(false);
    setSheetView(GlobalSheetView.CLOSED);
  };

  const handleSaveNewItem = (newItem: FundingEvent) => {
    const updatedFundingManager = fundingManager.add(newItem);
    onUpdate?.(updatedFundingManager);
    handleCancel();
  };

  const handleDeleteItem = (itemID: string) => {
    if (!fundingManager) return;
    const updatedFundingManager = fundingManager.remove(itemID);
    onUpdate?.(updatedFundingManager);
  };

  const handleClickOutside = (e: React.MouseEvent<Element>) => {
    if (dialogRef.current && !dialogRef.current.contains(e.target as Node)) {
      handleCancel(); // User clicked outside the dialog content
    }
  };

  const getSheetViewWindow = (sheetView: GlobalSheetView) => {
    switch (sheetView) {
      case GlobalSheetView.CREATE: {
        return (
          <FormFunding
            onCancel={handleCancel}
            onSubmit={handleSaveNewItem}
            currency={fundingManager.currency}
            period={fundingManager.period}
            type={addType}
          />
        );
      }

      case GlobalSheetView.VIEW:
        return null;

      default:
        return null;
    }
  };

  return (
    <Container>
      <TopMenuContainer>
        <FundingManagerOptions>
          <ButtonPrimaryConfirm
            onClick={() => handleAddToggle(FundingType.Equity)}
          >
            Add Equity
          </ButtonPrimaryConfirm>

          <ButtonPrimaryConfirm
            onClick={() => handleAddToggle(FundingType.Debt)}
          >
            Add Debt
          </ButtonPrimaryConfirm>
          <ButtonPrimaryConfirm
            onClick={() => handleAddToggle(FundingType.Grant)}
          >
            Add Grant
          </ButtonPrimaryConfirm>
        </FundingManagerOptions>

        <ConfirmationButton
          onClick={handleClearList}
          disabled={!itemList || itemList.length === 0}
          strict
          text="Clear"
          alertTextTitle="Clear FundingEvents"
        />
      </TopMenuContainer>
      {isOnMobile() ? (
        <MobileView>
          <OptionList>
            {itemList.map((item, index) => (
              <OptionItem key={index}>
                <CBaseFundingEvent
                  itemData={item}
                  onDelete={(pressedItem) => handleDeleteItem(pressedItem.id)}
                />
              </OptionItem>
            ))}
          </OptionList>
        </MobileView>
      ) : (
        <DesktopView>
          <FundingManagerTable
            data={fundingManager}
            onDelete={(pressedItem) => handleDeleteItem(pressedItem.id)}
          />
        </DesktopView>
      )}

      <Drawer.Root
        open={isAdding}
        onOpenChange={setIsAdding}
        direction="right"
        snapPoints={[]}
      >
        <Drawer.Portal>
          <StyledDialogOverlay className="DialogOverlay" />
          <StyledDialogContent
            className="DialogContent"
            $width={600}
            ref={dialogRef}
          >
            <CloseButton onClick={handleClickOutside}>Close</CloseButton>
            <StyledDialogTitle className="DialogTitle"></StyledDialogTitle>
            <StyledDialogDescription className="DialogDescription"></StyledDialogDescription>

            {getSheetViewWindow(sheetView)}
          </StyledDialogContent>
        </Drawer.Portal>
      </Drawer.Root>
    </Container>
  );
};

export default FundingEventsManager;

const RowMerger = styled.div`
  display: flex;

  width: 100%;

  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

const CellColumn = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 5px 0px;
`;

interface FundingManagerTableProps {
  data: FundingManager;
  onDelete?: (item: FundingEvent) => void;
}

const FundingManagerTable: React.FC<FundingManagerTableProps> = ({
  data,
  onDelete,
}) => {
  const totalFunding = useMemo(
    () => data.totalFundingAcrossPeriodCached,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data.items]
  );

  const debtRatio = useMemo(
    () => data.debtRatioCached,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data.items]
  );

  const totalEquity = useMemo(
    () => data.totalEquityAcrossPeriodCached,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data.items]
  );

  const totalDebt = useMemo(
    () => data.totalDebtAcrossPeriodCached,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data.items]
  );

  const totalGrant = useMemo(
    () => data.totalGrantAcrossPeriodCached,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data.items]
  );

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-[#f2e0cb]">
          <TableHead className="w-[100px] text-[#272525] !px-2" colSpan={2}>
            Name
          </TableHead>

          <TableHead className="text-right text-[#272525] !px-2 text-center">
            <RowMerger>
              Type
              <HelperHover>
                Specifies the funding source type: Equity, Debt, Grant, or
                Other. Helps distinguish between investor contributions and
                borrowed funds.
              </HelperHover>
            </RowMerger>
          </TableHead>

          <TableHead className="text-[#272525] !px-2 text-center">
            <RowMerger>
              Amount
              <HelperHover>
                The total funding received from this source. For recurring
                funding (e.g., installments or tranches), this reflects the
                scheduled amount for the period.
              </HelperHover>
            </RowMerger>
          </TableHead>

          <TableHead className="text-right text-[#272525] !px-2 text-center">
            Manage
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {data.getAll().map((item, index) => (
          <TableRow
            key={`${item.id}-${index}`}
            className="h-10 hover:bg-[#ea7f05]"
          >
            <TableCell className="text-[#272525] !px-2" colSpan={2}>
              <CellColumn>
                <p className="font-medium">{item.name}</p>
              </CellColumn>
            </TableCell>
            <TableCell className="text-right text-[#272525] !px-2 text-center">
              {item.type}
            </TableCell>
            <TableCell className="text-[#272525] !px-2 text-center">
              <CellColumn>
                <p className="font-medium">{item.amount.format()}</p>
              </CellColumn>
            </TableCell>

            <TableCell className="text-center text-[#272525] !px-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="!p-2 !space-y-1 ">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>

                  {!!onDelete && (
                    <DropdownMenuItem
                      onClick={() => onDelete(item)}
                      className="!px-1"
                    >
                      Delete
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter style={{ marginTop: 12, paddingTop: 12 }}>
        <TableRow className="h-12 bg-[#f2e0cb] hover:bg-[#ea7f05] group">
          <TableCell className="!px-2 group-hover:text-gray-100" colSpan={4}>
            Total Equity
          </TableCell>
          <TableCell className="text-right !px-2 group-hover:text-gray-100">
            {totalEquity.format()}
          </TableCell>
        </TableRow>

        <TableRow className="h-12 bg-[#f2e0cb] hover:bg-[#ea7f05] group">
          <TableCell className="!px-2 group-hover:text-gray-100" colSpan={4}>
            Total Debt
          </TableCell>
          <TableCell className="text-right !px-2 group-hover:text-gray-100">
            {totalDebt.format()}
          </TableCell>
        </TableRow>

        <TableRow className="h-12 bg-[#f2e0cb] hover:bg-[#ea7f05] group">
          <TableCell className="!px-2 group-hover:text-gray-100" colSpan={4}>
            Debt Ratio
          </TableCell>
          <TableCell className="text-right !px-2 group-hover:text-gray-100">
            {formatPercentage(debtRatio, true)}
          </TableCell>
        </TableRow>

        <TableRow className="h-12 bg-[#f2e0cb] hover:bg-[#ea7f05] group">
          <TableCell className="!px-2 group-hover:text-gray-100" colSpan={4}>
            Total Grant
          </TableCell>
          <TableCell className="text-right !px-2 group-hover:text-gray-100">
            {totalGrant.format()}
          </TableCell>
        </TableRow>

        <TableRow className="h-12 bg-[#f2e0cb] hover:bg-[#ea7f05] group">
          <TableCell className="!px-2 group-hover:text-gray-100" colSpan={4}>
            Total Funding
          </TableCell>
          <TableCell className="text-right !px-2 group-hover:text-gray-100">
            {totalFunding.format()}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
};
