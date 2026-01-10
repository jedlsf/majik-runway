/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";

import { DotsThreeIcon, EraserIcon, PlusIcon } from "@phosphor-icons/react";
import { Tooltip } from "react-tooltip";
import theme from "../../../globals/theme";
import { toast } from "sonner";

// ---------------- Styled Components ---------------- //

const OptionContainer = styled.div`
  display: flex;
  position: relative;
  width: 100%;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: ${({ theme }) => theme.colors.secondaryBackground};
  color: ${({ theme }) => theme.colors.textPrimary};
  border: 1px solid ${({ theme }) => theme.colors.secondaryBackground};
  border-radius: 8px;
  padding: 3px 10px;
  transition: background 0.1s ease-in-out;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryBackground};
  }
`;

const CenteredTextWrapper = styled.div`
  flex: 1;
  text-align: center;
  pointer-events: none;
`;

const DotsWrapper = styled.div`
  position: absolute;
  right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const OptionItem = styled.p`
  font-size: ${({ theme }) => theme.typography.sizes.subject};
  color: ${({ theme }) => theme.colors.textPrimary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const UnsetOptionItem = styled(OptionItem)`
  opacity: 0.6;
`;

const StyledDropdownMenuContent = styled(DropdownMenuContent)`
  max-height: 400px;
  overflow-y: auto;
  background: ${({ theme }) => theme.colors.primaryBackground};
`;

// ---------------- Helper Functions ---------------- //

/** Resolves nested object keys like "metadata.name" */
const resolveAccessor = (obj: any, accessor: string): string | undefined => {
  return accessor.split(".").reduce((acc, key) => acc?.[key], obj);
};

// ---------------- Component ---------------- //

interface ReferenceItem {
  id: string | null;
  name: string;
}

interface ReferenceItemSelectorProps {
  id?: string;
  options: any[];
  value?: ReferenceItem;
  accessorKey: string;
  idKey?: string;
  tooltip: string;
  onUpdate?: (value: ReferenceItem, refKey?: string) => void;
  onClear?: (refKey?: string) => void;
  refKey?: string;
  emptyActionButton?: () => void;
  emptyActionText?: string;

  exclude?: any[];
  limit?: any[];
  excludeKey?: string;
  limitKey?: string;
}

export function ReferenceItemSelector({
  id,
  options,
  value,
  accessorKey,
  idKey = "id",
  tooltip,
  onUpdate,
  onClear,
  refKey,
  emptyActionButton,
  emptyActionText = "Add New Item",
  exclude = [],
  limit = [],
  excludeKey,
  limitKey,
}: ReferenceItemSelectorProps) {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  const handleClose = () => setMenuOpen(false);

  const handleIconClick = (e: React.MouseEvent) => {
    if (!options || options.length <= 0) {
      toast.error("No Options Available", {
        description:
          "You currently do not have available items to choose from for this field.",
        id: `toast-error-${id}`,
        action: emptyActionButton
          ? {
              label: emptyActionText,
              onClick: () => emptyActionButton?.(),
            }
          : undefined,
      });
      return;
    }

    e.stopPropagation();
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {}, [value, options, accessorKey, idKey]);

  const displayValue = useMemo((): string => {
    if (!value?.id) {
      return "";
    }

    const match = options.find(
      (opt) => String(opt[idKey]) === String(value.id)
    );
    if (match) {
      const label = resolveAccessor(match, accessorKey) ?? String(match[idKey]);

      return label && String(label).trim()
        ? String(label)
        : String(match[idKey]);
    } else {
      return "Not Found";
    }
  }, [value, options, accessorKey, idKey]);

  const handleSelect = (item: any) => {
    const newItem: ReferenceItem = {
      id: String(item[idKey]),
      name: String(resolveAccessor(item, accessorKey) ?? item[idKey]),
    };
    onUpdate?.(newItem, refKey);
    handleClose();
  };

  const optionsWithLabels = useMemo(() => {
    let opts = [...options];

    // Exclude filter
    if (excludeKey && exclude.length > 0) {
      opts = opts.filter(
        (opt) => !exclude.includes(resolveAccessor(opt, excludeKey))
      );
    }

    // Limit filter
    if (limitKey && limit.length > 0) {
      opts = opts.filter((opt) =>
        limit.includes(resolveAccessor(opt, limitKey))
      );
    }

    return opts
      .filter((opt) => opt.id !== value?.id)
      .map((opt) => ({
        ...opt,
        _label: resolveAccessor(opt, accessorKey) ?? String(opt[idKey]),
      }));
  }, [
    options,
    accessorKey,
    idKey,
    value?.id,
    exclude,
    excludeKey,
    limit,
    limitKey,
  ]);

  const currentTooltip =
    !value?.id || value.id === ""
      ? tooltip
      : displayValue === "Not Found"
      ? "Click Here to Change/Update"
      : tooltip;

  return (
    <>
      <OptionContainer
        onClick={handleIconClick}
        data-tooltip-id={`rtip-ref-item-${refKey}-${id}`}
        data-tooltip-content={currentTooltip}
        id={id}
      >
        <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
          <DropdownMenuTrigger asChild>
            <CenteredTextWrapper>
              {displayValue ? (
                displayValue === "Not Found" ? (
                  <UnsetOptionItem>{displayValue}</UnsetOptionItem>
                ) : (
                  <OptionItem>{displayValue}</OptionItem>
                )
              ) : (
                <UnsetOptionItem>{tooltip}</UnsetOptionItem>
              )}
            </CenteredTextWrapper>
          </DropdownMenuTrigger>

          <DotsWrapper>
            <DotsThreeIcon size={20} />
          </DotsWrapper>

          <StyledDropdownMenuContent>
            {optionsWithLabels.map((opt) => {
              return (
                <DropdownMenuItem
                  key={String(opt[idKey])}
                  onSelect={() => handleSelect(opt)}
                  className="!px-4 !py-2 data-[highlighted]:bg-[#f2e0cb]"
                >
                  {opt._label}
                </DropdownMenuItem>
              );
            })}

            {!!onClear && !!displayValue?.trim() && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={() => {
                    onClear(refKey);
                    handleClose();
                  }}
                  className="!px-4 !py-2 data-[highlighted]:bg-[#f2e0cb]"
                >
                  <EraserIcon size={24} />
                  Clear
                </DropdownMenuItem>
              </>
            )}

            {!!emptyActionButton && (
              <DropdownMenuItem
                onSelect={() => {
                  emptyActionButton();
                  setMenuOpen(false);
                }}
                className="!px-4 !py-2 data-[highlighted]:bg-[#f2e0cb]"
              >
                <PlusIcon size={24} />
                {emptyActionText}
              </DropdownMenuItem>
            )}
          </StyledDropdownMenuContent>
        </DropdownMenu>
      </OptionContainer>

      <Tooltip
        id={`rtip-ref-item`}
        style={{
          fontSize: 12,
          fontWeight: 400,
          backgroundColor: theme.colors.primary,
        }}
      />
    </>
  );
}
