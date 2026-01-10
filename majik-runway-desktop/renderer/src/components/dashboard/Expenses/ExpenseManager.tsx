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

import { ExpenseBreakdown, Expense } from "@thezelijah/majik-runway";

import FormExpense from "./forms/FormExpense";
import CBaseExpense from "./CBaseExpense";
import { isOnMobile } from "@/utils/helper";
import ConfirmationButton from "@/components/foundations/ConfirmationButton";

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

const ExpenseManagerOptions = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: flex-start;
  gap: 10px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

interface ExpenseManagerProps {
  onUpdate?: (updatedExpenseBreakdown: ExpenseBreakdown) => void;
  onClear?: () => void;
  expenseBreakdown: ExpenseBreakdown;
}

const ExpenseManager: React.FC<ExpenseManagerProps> = ({
  onUpdate,
  onClear,
  expenseBreakdown,
}) => {
  const [isAdding, setIsAdding] = useState(false);

  const [sheetView, setSheetView] = useState<GlobalSheetView>(
    GlobalSheetView.CLOSED
  );

  const [addType, setAddType] = useState<"one-time" | "recurring" | "capital">(
    "recurring"
  );

  const dialogRef = useRef<HTMLDivElement>(null);

  const itemList: Expense[] = useMemo(
    () => expenseBreakdown.items || [],
    [expenseBreakdown]
  );

  const handleAddToggle = (input: "one-time" | "recurring" | "capital") => {
    setSheetView(GlobalSheetView.CREATE);
    setAddType(input);
    setIsAdding((prev) => !prev);
  };

  const handleClearList = () => {
    const updatedExpenseBreakdown = expenseBreakdown.clear();

    onUpdate?.(updatedExpenseBreakdown);
    onClear?.();
  };

  const handleCancel = () => {
    setIsAdding(false);
    setSheetView(GlobalSheetView.CLOSED);
  };

  const handleSaveNewItem = (newItem: Expense) => {
    const updatedExpenseBreakdown = expenseBreakdown.add(newItem);

    onUpdate?.(updatedExpenseBreakdown);
    handleCancel();
  };

  const handleDeleteItem = (itemID: string) => {
    if (!expenseBreakdown) return;
    const updatedExpenseBreakdown = expenseBreakdown.remove(itemID);
    onUpdate?.(updatedExpenseBreakdown);
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
          <FormExpense
            onCancel={handleCancel}
            onSubmit={handleSaveNewItem}
            currency={expenseBreakdown.currency}
            period={expenseBreakdown.period}
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
        <ExpenseManagerOptions>
          <ButtonPrimaryConfirm onClick={() => handleAddToggle("one-time")}>
            Add One-Time
          </ButtonPrimaryConfirm>

          <ButtonPrimaryConfirm onClick={() => handleAddToggle("recurring")}>
            Add Recurring
          </ButtonPrimaryConfirm>
          <ButtonPrimaryConfirm onClick={() => handleAddToggle("capital")}>
            Add Capital
          </ButtonPrimaryConfirm>
        </ExpenseManagerOptions>

        <ConfirmationButton
          onClick={handleClearList}
          disabled={!itemList || itemList.length === 0}
          strict
          text="Clear"
          alertTextTitle="Clear Expenses"
        />
      </TopMenuContainer>
      {isOnMobile() ? (
        <MobileView>
          <OptionList>
            {itemList.map((item, index) => (
              <OptionItem key={index}>
                <CBaseExpense
                  itemData={item}
                  onDelete={(pressedItem) => handleDeleteItem(pressedItem.id)}
                />
              </OptionItem>
            ))}
          </OptionList>
        </MobileView>
      ) : (
        <DesktopView>
          <ExpenseManagerTable
            data={expenseBreakdown}
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

export default ExpenseManager;

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

const CellDescriptionText = styled.span`
  width: 100%;
  word-wrap: break-word;
  white-space: normal;
  overflow-wrap: break-word;
  font-size: 10px;
`;

interface ExpenseManagerTableProps {
  data: ExpenseBreakdown;
  onDelete?: (item: Expense) => void;
}

const ExpenseManagerTable: React.FC<ExpenseManagerTableProps> = ({
  data,
  onDelete,
}) => {
  const totalCashOut = useMemo(
    () => data.totalCashOutAcrossPeriodCached,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data.items]
  );

  const averageCash = useMemo(
    () => data.averageMonthlyExpenseCached,
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

          <TableHead className="text-[#272525] !px-2 text-center">
            <RowMerger>
              Amount
              <HelperHover>
                The total expense amount for this item. If recurring, this value
                is applied per recurrence period (e.g. monthly, yearly).
              </HelperHover>
            </RowMerger>
          </TableHead>

          <TableHead className="text-right text-[#272525] !px-2 text-center">
            <RowMerger>
              Category
              <HelperHover>
                Defines the expense timing and lifecycle. One-time expenses
                occur once, Recurring expenses repeat on a schedule, and Capital
                expenses are spread or depreciated over time.
              </HelperHover>
            </RowMerger>
          </TableHead>

          <TableHead className="text-[#272525] !px-2 text-center">
            <RowMerger>
              Tax Deductible
              <HelperHover>
                Indicates whether this expense can be deducted from taxable
                income. Helps calculate net cash flow and tax impact.
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
                <CellDescriptionText>{item.type}</CellDescriptionText>
              </CellColumn>
            </TableCell>
            <TableCell className="text-[#272525] !px-2 text-center">
              <CellColumn>
                <p className="font-medium">{item.amount.format()}</p>
                <CellDescriptionText>{item.recurrence}</CellDescriptionText>
              </CellColumn>
            </TableCell>

            <TableCell className="text-right text-[#272525] !px-2 text-center">
              {item.category}
            </TableCell>
            <TableCell className="text-center text-[#272525] !px-2">
              {item.isTaxDeductible ? "Yes" : "No"}
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
          <TableCell className="!px-2 group-hover:text-gray-100" colSpan={5}>
            Average Monthly Expense
          </TableCell>
          <TableCell className="text-right !px-2 group-hover:text-gray-100">
            {averageCash.format()} per month
          </TableCell>
        </TableRow>

        <TableRow className="h-12 bg-[#f2e0cb] hover:bg-[#ea7f05] group">
          <TableCell className="!px-2 group-hover:text-gray-100" colSpan={5}>
            Total Cash Out
          </TableCell>
          <TableCell className="text-right !px-2 group-hover:text-gray-100">
            {totalCashOut.format()}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
};
