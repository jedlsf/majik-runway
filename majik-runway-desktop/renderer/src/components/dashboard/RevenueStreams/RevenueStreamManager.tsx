"use client";

import React, { useRef, useState } from "react";
import styled from "styled-components";

import { ButtonPrimaryConfirm } from "../../../globals/buttons";
import { Button } from "../../../components/ui/button";

import { Drawer } from "vaul";
import {
  CloseButton,
  StyledDialogContent,
  StyledDialogDescription,
  StyledDialogOverlay,
  StyledDialogTitle,
} from "../../../globals/styled-slide-dialogs";
import {
  isMajikProduct,
  isMajikService,
  isMajikSubscription,
  type RevenueItem,
  RevenueStream,
  BusinessModelType,
} from "@thezelijah/majik-runway";
import CBaseRevenueStream from "./CBaseRevenueStream";
import FormMajikProduct from "./forms/FormMajikProduct";
import { GlobalSheetView } from "../../../globals/enums";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { DesktopView, MobileView } from "../../../globals/styled-components";
import HelperHover from "../../../components/foundations/HelperHover";
import { MoreHorizontal } from "lucide-react";
import { formatPercentage } from "../../../utils/helper";
import FormMajikService from "./forms/FormMajikService";
import FormMajikSubscription from "./forms/FormMajikSubscription";
import ConfirmationButton from "../../../components/foundations/ConfirmationButton";

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

  @media (max-width: 768px) {
    padding: 10px 0px;
  }
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

const RevenueStreamOptions = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: flex-start;
  gap: 10px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

interface RevenueStreamManagerProps {
  onUpdate?: (updatedStream: RevenueStream) => void;
  onClear?: () => void;
  revenueStream: RevenueStream;
}

const RevenueStreamManager: React.FC<RevenueStreamManagerProps> = ({
  onUpdate,
  onClear,
  revenueStream,
}) => {
  const itemList = revenueStream.items || [];

  const [isAdding, setIsAdding] = useState(false);

  const [currentValue, setCurrentValue] = useState<RevenueItem | null>(null);

  const [sheetView, setSheetView] = useState<GlobalSheetView>(
    GlobalSheetView.CLOSED
  );

  const [addType, setAddType] = useState<BusinessModelType>(
    BusinessModelType.Product
  );

  const dialogRef = useRef<HTMLDivElement>(null);

  const handleAddToggle = (type: BusinessModelType) => {
    setSheetView(GlobalSheetView.CREATE);
    setAddType(type);
    setIsAdding((prev) => !prev);
    setCurrentValue(null); // Reset value when toggling add mode
  };

  const handleClearList = () => {
    const updatedStream = revenueStream.clear();
    onUpdate?.(updatedStream);
    onClear?.();
  };

  const handleCancel = () => {
    setIsAdding(false);
    setCurrentValue(null);
    setSheetView(GlobalSheetView.CLOSED);
  };

  const handleSaveNewItem = (newItem: RevenueItem) => {
    const updatedStream = revenueStream.addItem(newItem);
    onUpdate?.(updatedStream);
    handleCancel();
  };

  const handleEditItem = (editItem: RevenueItem) => {
    setSheetView(GlobalSheetView.EDIT);
    setCurrentValue(editItem);
    setIsAdding(true);
  };

  const handleEditSave = (updatedItem: RevenueItem) => {
    const updatedStream = revenueStream.updateItem(updatedItem.id, updatedItem);
    onUpdate?.(updatedStream);
    handleCancel();
  };

  const handleDeleteItem = (itemID: string) => {
    if (!revenueStream) return;
    const updatedStream = revenueStream.remove(itemID);
    onUpdate?.(updatedStream);
  };

  const handleClickOutside = (e: React.MouseEvent<Element>) => {
    if (dialogRef.current && !dialogRef.current.contains(e.target as Node)) {
      handleCancel(); // User clicked outside the dialog content
    }
  };

  const getSheetViewWindow = (sheetView: GlobalSheetView) => {
    switch (sheetView) {
      case GlobalSheetView.CREATE:
        {
          switch (addType) {
            case BusinessModelType.Product: {
              return (
                <FormMajikProduct
                  onCancel={handleCancel}
                  onSubmit={handleSaveNewItem}
                  currency={revenueStream.currency}
                  period={revenueStream.period}
                />
              );
            }
            case BusinessModelType.Service: {
              return (
                <FormMajikService
                  onCancel={handleCancel}
                  onSubmit={handleSaveNewItem}
                  currency={revenueStream.currency}
                  period={revenueStream.period}
                />
              );
            }
            case BusinessModelType.Subscription: {
              return (
                <FormMajikSubscription
                  onCancel={handleCancel}
                  onSubmit={handleSaveNewItem}
                  currency={revenueStream.currency}
                  period={revenueStream.period}
                />
              );
            }
          }
        }
        break;
      case GlobalSheetView.EDIT:
        {
          if (!currentValue) return;
          switch (true) {
            case isMajikProduct(currentValue): {
              return (
                <FormMajikProduct
                  formData={currentValue}
                  onCancel={handleCancel}
                  onSubmit={handleEditSave}
                  currency={revenueStream.currency}
                  period={revenueStream.period}
                />
              );
            }
            case isMajikService(currentValue): {
              return (
                <FormMajikService
                  formData={currentValue}
                  onCancel={handleCancel}
                  onSubmit={handleEditSave}
                  currency={revenueStream.currency}
                  period={revenueStream.period}
                />
              );
            }
            case isMajikSubscription(currentValue): {
              return (
                <FormMajikSubscription
                  formData={currentValue}
                  onCancel={handleCancel}
                  onSubmit={handleEditSave}
                  currency={revenueStream.currency}
                  period={revenueStream.period}
                />
              );
            }
          }
        }
        break;

      case GlobalSheetView.VIEW:
        return null;

      default:
        return null;
    }
  };

  return (
    <Container>
      <TopMenuContainer>
        <RevenueStreamOptions>
          <ButtonPrimaryConfirm
            onClick={() => handleAddToggle(BusinessModelType.Product)}
          >
            Add Product
          </ButtonPrimaryConfirm>

          <ButtonPrimaryConfirm
            onClick={() => handleAddToggle(BusinessModelType.Service)}
          >
            Add Service
          </ButtonPrimaryConfirm>
          <ButtonPrimaryConfirm
            onClick={() => handleAddToggle(BusinessModelType.Subscription)}
          >
            Add Subscription
          </ButtonPrimaryConfirm>
        </RevenueStreamOptions>

        <ConfirmationButton
          onClick={handleClearList}
          disabled={!itemList || itemList.length === 0}
          strict
          text="Clear"
          alertTextTitle="Clear Revenue Streams"
        />
      </TopMenuContainer>
      <MobileView>
        <OptionList>
          {itemList.map((item, index) => (
            <OptionItem key={index}>
              <CBaseRevenueStream
                itemData={item}
                onEdit={(pressedItem) => handleEditItem(pressedItem)}
                onDelete={(pressedItem) => handleDeleteItem(pressedItem.id)}
              />
            </OptionItem>
          ))}
        </OptionList>
      </MobileView>
      <DesktopView>
        <RevenueStreamTable
          data={revenueStream}
          onDelete={(pressedItem) => handleDeleteItem(pressedItem.id)}
          onEdit={handleEditItem}
        />
      </DesktopView>

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

export default RevenueStreamManager;

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

interface RevenueStreamTableProps {
  data: RevenueStream;
  onEdit?: (item: RevenueItem) => void;
  onDelete?: (item: RevenueItem) => void;
}

const RevenueStreamTable: React.FC<RevenueStreamTableProps> = ({
  data,
  onEdit,
  onDelete,
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-[#f2e0cb]">
          <TableHead className="w-[100px] text-[#272525] !px-2" colSpan={2}>
            Name
          </TableHead>

          <TableHead className="text-[#272525] !px-2 text-center">
            <RowMerger>
              Price
              <HelperHover>
                The selling price per unit. This is the product SRP or the rate
                charged for a service or subscription.
              </HelperHover>
            </RowMerger>
          </TableHead>

          <TableHead className="text-right text-[#272525] !px-2 text-center">
            <RowMerger>
              Supply
              <HelperHover>
                The total available units or capacity for this revenue stream
                within the selected period.
              </HelperHover>
            </RowMerger>
          </TableHead>

          <TableHead className="text-right text-[#272525] !px-2 text-center">
            <RowMerger>
              Unit Cost
              <HelperHover>
                The cost per unit required to deliver this product or service,
                also known as COGS or cost of service.
              </HelperHover>
            </RowMerger>
          </TableHead>

          <TableHead className="text-[#272525] !px-2 text-center">
            <RowMerger>
              Revenue
              <HelperHover>
                The expected gross revenue, calculated by multiplying the price
                by the total supply or capacity.
              </HelperHover>
            </RowMerger>
          </TableHead>

          <TableHead className="text-right text-[#272525] !px-2 text-center">
            <RowMerger>
              Profit Margin
              <HelperHover>
                The percentage of profit earned per unit after subtracting cost
                from the price.
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

                <CellDescriptionText>{item.seo}</CellDescriptionText>
              </CellColumn>
            </TableCell>
            <TableCell className="text-[#272525] !px-2 text-center">
              {item.price.format()}
            </TableCell>
            <TableCell className="text-center text-[#272525] !px-2">
              {item.totalCapacity.toLocaleString()}
            </TableCell>
            <TableCell className="text-right text-[#272525] !px-2 text-center">
              {item.unitCost.format()}
            </TableCell>
            <TableCell className="text-center text-[#272525] !px-2">
              {item.grossRevenue.format()}
            </TableCell>

            <TableCell className="text-right text-[#272525] !px-2 text-center">
              {formatPercentage(item.unitMargin, true)}
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

                  {!!onEdit && (
                    <DropdownMenuItem
                      onClick={() => onEdit(item)}
                      className="!px-1"
                    >
                      Edit
                    </DropdownMenuItem>
                  )}

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
          <TableCell
            className="!px-2 group-hover:text-gray-100 text-left"
            colSpan={7}
          >
            Average Monthly Revenue
          </TableCell>
          <TableCell className="text-right !px-2 group-hover:text-gray-100">
            {data.getAverageMonthlyRevenue().format()}
          </TableCell>
        </TableRow>
        <TableRow className="h-12 bg-[#f2e0cb] hover:bg-[#ea7f05] group">
          <TableCell className="!px-2 group-hover:text-gray-100" colSpan={7}>
            Average Monthly Profit
          </TableCell>
          <TableCell className="text-right !px-2 group-hover:text-gray-100">
            {data.getAverageMonthlyGrossProfit().format()}
          </TableCell>
        </TableRow>
        <TableRow className="h-12 bg-[#f2e0cb] hover:bg-[#ea7f05] group">
          <TableCell className="!px-2 group-hover:text-gray-100" colSpan={7}>
            Total Revenue
          </TableCell>
          <TableCell className="text-right !px-2 group-hover:text-gray-100">
            {data.getTotalRevenue().format()}
          </TableCell>
        </TableRow>
        <TableRow className="h-12 bg-[#f2e0cb] hover:bg-[#ea7f05] group">
          <TableCell className="!px-2 group-hover:text-gray-100" colSpan={7}>
            Total Cost
          </TableCell>
          <TableCell className="text-right !px-2 group-hover:text-gray-100">
            {data.getTotalCost().format()}
          </TableCell>
        </TableRow>

        <TableRow className="h-12 bg-[#f2e0cb] hover:bg-[#ea7f05] group">
          <TableCell className="!px-2 group-hover:text-gray-100" colSpan={7}>
            Gross Profit
          </TableCell>
          <TableCell className="text-right !px-2 group-hover:text-gray-100">
            {data.getTotalGrossProfit().format()}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
};
