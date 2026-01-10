/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import styled from "styled-components";
import { Tooltip } from "react-tooltip";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";

import {
  DotsThreeIcon,
  EraserIcon,
  type Icon,
  PlusIcon,
} from "@phosphor-icons/react";

import theme from "../../../globals/theme";

import moment from "moment";
import { parseDateFromISO } from "../../../utils/helper";

// ---------------- Types ---------------- //

interface ReferenceItem {
  id: string | null;
  name: string;
}

type AccessorFormat =
  | "string"
  | "date"
  | "relative-time"
  | "time"
  | "bool-yes-no";

interface ReferenceItemListSelectorProps {
  id?: string;
  options: any[];
  value?: ReferenceItem[];
  accessorKey: string;
  idKey?: string;
  tooltip: string;
  refKey?: string;
  onUpdate?: (value: ReferenceItem[], refKey?: string) => void;
  onClearAll?: (refKey?: string) => void;
  emptyActionButton?: () => void;
  emptyActionText?: string;
  allowEmpty?: boolean;

  exclude?: any[];
  limit?: any[];
  excludeKey?: string;
  limitKey?: string;

  accessorFormat?: AccessorFormat;
  extras?: {
    photo?: {
      accessorKey?: string;
    };
    icon?: Icon;
    subtext?: {
      accessorFormat?: AccessorFormat;
      accessorKey?: string;
    };
  };
}

// ---------------- Helper ---------------- //

/** Resolves nested object keys like "metadata.name" */
const resolveAccessor = (obj: any, accessor: string): string | undefined => {
  return accessor.split(".").reduce((acc, key) => acc?.[key], obj);
};

const formatAccessorValue = (
  value: any,
  format: AccessorFormat = "string"
): string => {
  if (value == null) return "";

  switch (format) {
    case "date":
      return parseDateFromISO(value, true);
    case "relative-time":
      return moment(value).fromNow();
    case "time":
      return moment(value).format("HH:mm");
    case "bool-yes-no":
      return value ? "Yes" : "No";
    case "string":
    default:
      return String(value);
  }
};

const Photo = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
`;

// ---------------- Component ---------------- //

export function ReferenceItemListSelector({
  id,
  options,
  value = [],
  accessorKey,
  idKey = "id",
  tooltip,
  refKey,
  onUpdate,
  onClearAll,
  emptyActionButton,
  emptyActionText = "Add New Item",
  allowEmpty = true,
  exclude = [],
  limit = [],
  excludeKey,
  limitKey,
  extras,
  accessorFormat,
}: ReferenceItemListSelectorProps) {
  const [list, setList] = useState<ReferenceItem[]>(value);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  const [isItemHovered, setIsItemHovered] = useState<boolean>(false);

  const wrapperRef = useRef<HTMLDivElement>(null);

  const arraysEqual = (a: ReferenceItem[], b: ReferenceItem[]) =>
    a.length === b.length &&
    a.every((item, i) => item.id === b[i].id && item.name === b[i].name);

  useEffect(() => {
    if (value && !arraysEqual(value, list)) {
      setList(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const handleSelect = (item: any) => {
    const newItem: ReferenceItem = {
      id: String(item[idKey]),
      name: String(resolveAccessor(item, accessorKey) ?? item[idKey]),
    };

    if (list.some((existing) => existing.id === newItem.id)) {
      toast.error("This item is already added.");
      return;
    }

    const updated = [...list, newItem];
    setList(updated);
    onUpdate?.(updated, refKey);
    setMenuOpen(false);
  };

  const handleRemove = (index: number) => {
    const updated = list.filter((_, i) => i !== index);
    if (!allowEmpty && updated.length === 0) {
      toast.error("List cannot be empty.");
      return;
    }
    setList(updated);
    onUpdate?.(updated, refKey);
  };

  // Reuse availableOptions for both Desktop & Mobile
  const availableOptions = useMemo(() => {
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

    // Remove already selected ones
    return opts
      .filter(
        (opt) => !list.some((sel) => String(sel.id) === String(opt[idKey]))
      )
      .map((opt) => {
        const labelVal =
          resolveAccessor(opt, accessorKey) ?? String(opt[idKey]);
        const formatted = formatAccessorValue(labelVal, accessorFormat);

        return {
          ...opt,
          _label: formatted,
          _photo: extras?.photo?.accessorKey
            ? resolveAccessor(opt, extras.photo.accessorKey)
            : undefined,
          _icon: extras?.icon,
          _subtext: extras?.subtext?.accessorKey
            ? formatAccessorValue(
                resolveAccessor(opt, extras.subtext.accessorKey),
                extras.subtext.accessorFormat
              )
            : undefined,
        };
      });
  }, [
    options,
    list,
    accessorKey,
    idKey,
    exclude,
    excludeKey,
    limit,
    limitKey,
    accessorFormat,
    extras,
  ]);

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

    if (isItemHovered) return;

    e.stopPropagation();
    setMenuOpen(!menuOpen);
  };

  return (
    <>
      <DesktopWrapper>
        <SelectorWrapper
          ref={wrapperRef}
          id={id}
          onClick={handleIconClick}
          $isEmpty={value.length === 0}
        >
          <TagsWrapper
            data-tooltip-id={`rtip-ref-list-${refKey}`}
            data-tooltip-content={tooltip}
          >
            {list.length > 0 ? (
              list.map((tag, index) => {
                const sourceItem = options.find(
                  (opt) => String(opt[idKey]) === String(tag.id)
                );

                let photo: string | undefined;
                let IconComp: Icon | undefined;

                if (sourceItem) {
                  if (extras?.photo?.accessorKey) {
                    photo = resolveAccessor(
                      sourceItem,
                      extras.photo.accessorKey
                    );
                  }
                  if (extras?.icon) {
                    IconComp = extras.icon;
                  }
                }

                return (
                  <Tag
                    key={tag.id ?? `${tag.name}-${index}`}
                    onMouseEnter={() => setIsItemHovered(true)}
                    onMouseLeave={() => setIsItemHovered(false)}
                  >
                    {photo ? (
                      <Photo src={photo} alt="photo" />
                    ) : IconComp ? (
                      <IconComp size={20} />
                    ) : null}
                    <span>{tag.name}</span>
                    <RemoveButton onClick={() => handleRemove(index)}>
                      ✕
                    </RemoveButton>
                  </Tag>
                );
              })
            ) : (
              <span>No items selected yet.</span>
            )}

            <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
              <DropdownMenuTrigger asChild={false}></DropdownMenuTrigger>

              <StyledDropdownMenuContent>
                {availableOptions.map((opt) => (
                  <DropdownMenuItem
                    key={String(opt[idKey])}
                    onSelect={() => handleSelect(opt)}
                    className="!px-4 !py-2 data-[highlighted]:bg-[#f2e0cb]"
                  >
                    {opt._label}
                  </DropdownMenuItem>
                ))}

                {!!onClearAll && list.length > 0 && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onSelect={() => {
                        onClearAll(refKey);
                        setList([]);
                        setMenuOpen(false);
                      }}
                      className="!px-4 !py-2 data-[highlighted]:bg-[#f2e0cb]"
                    >
                      <EraserIcon size={24} />
                      Clear All
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
          </TagsWrapper>
          <DotsWrapper>
            <DotsThreeIcon size={20} />
          </DotsWrapper>
        </SelectorWrapper>
        <Tooltip
          id={`rtip-ref-list-${refKey}`}
          style={{
            fontSize: 12,
            fontWeight: 400,
            backgroundColor: theme.colors.primary,
          }}
        />
      </DesktopWrapper>
      <MobileWrapper>
        {list.length > 0 ? (
          list.map((tag, index) => {
            const sourceItem = options.find(
              (opt) => String(opt[idKey]) === String(tag.id)
            );

            let photo: string | undefined;
            let IconComp: Icon | undefined;

            if (sourceItem) {
              if (extras?.photo?.accessorKey) {
                photo = resolveAccessor(sourceItem, extras.photo.accessorKey);
              }
              if (extras?.icon) {
                IconComp = extras.icon;
              }
            }

            return (
              <Tag key={tag.id ?? `${tag.name}-${index}`}>
                {photo ? (
                  <Photo src={photo} alt="photo" />
                ) : IconComp ? (
                  <IconComp size={20} />
                ) : null}
                <span>{tag.name}</span>
                <RemoveButton onClick={() => handleRemove(index)}>
                  ✕
                </RemoveButton>
              </Tag>
            );
          })
        ) : (
          <span>No items selected yet.</span>
        )}

        <MobileDropdown
          value=""
          onChange={(e) => {
            const selectedId = e.target.value;

            if (selectedId === "clear") {
              onClearAll?.(refKey);
              setList([]);
              setMenuOpen(false);
              return;
            }

            if (selectedId === "empty-action") {
              emptyActionButton?.();
              return;
            }

            const found = availableOptions.find(
              (opt) => String(opt[idKey]) === selectedId
            );

            if (found) handleSelect(found);
          }}
        >
          <MobileOption value="" disabled>
            {tooltip?.trim() ? `Add New ${tooltip}` : "Select an option"}
          </MobileOption>

          {availableOptions.map((opt) => (
            <MobileOption key={String(opt[idKey])} value={String(opt[idKey])}>
              {opt._label}
              {opt._subtext ? ` – ${opt._subtext}` : ""}
            </MobileOption>
          ))}

          {/* Empty action button */}
          {!!emptyActionButton && (
            <MobileOption value="empty-action">{emptyActionText}</MobileOption>
          )}

          {list.length > 0 && (
            <MobileOption value="clear">Clear All</MobileOption>
          )}
        </MobileDropdown>
      </MobileWrapper>
    </>
  );
}

// ---------------- Styled ---------------- //

const SelectorWrapper = styled.div<{ $isEmpty?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  border: 1px solid ${({ theme }) => theme.colors.secondaryBackground};
  border-radius: 8px;
  padding: 6px 10px;
  background: ${({ theme }) => theme.colors.secondaryBackground};
  opacity: ${(props) => (props.$isEmpty ? "0.6" : "unset")};
  cursor: pointer;
`;

const TagsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  flex: 1;
`;

const Tag = styled.span`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 10px;
  background-color: ${({ theme }) => theme.colors.primaryBackground};
  color: ${({ theme }) => theme.colors.textPrimary};
  border-radius: 8px;
  font-size: 0.875rem;
  white-space: nowrap;
  transition: all 0.3s ease;
  cursor: default;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      transform: scale(1.06);
    }
  }
`;

const RemoveButton = styled.button`
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.75rem;
  cursor: pointer;
  padding: 0;
  margin: 0;
  line-height: 1;
  transition: all 0.2s ease;
  display: none;
  transform: scale(0);

  @media (hover: hover) and (pointer: fine) {
    ${Tag}:hover & {
      display: block;
      transform: scale(1);
    }
  }

  &:hover {
    color: ${({ theme }) => theme.colors.error};
  }
`;

const DotsWrapper = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledDropdownMenuContent = styled(DropdownMenuContent)`
  max-height: 400px;
  overflow-y: auto;
  background: ${({ theme }) => theme.colors.primaryBackground};
`;

const DesktopWrapper = styled.div`
  display: flex;
  width: inherit;

  @media (max-width: 768px) {
    display: none;
  }
`;

const MobileWrapper = styled.div`
  display: none;
  width: inherit;

  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileDropdown = styled.select`
  width: 100%;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.secondaryBackground};
  background: ${({ theme }) => theme.colors.secondaryBackground};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.typography.sizes.subject};

  cursor: pointer;
  text-align: center; /* Selected value centered */

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }

  /* Custom scrollbar for dropdowns (if content overflows) */
  &::-webkit-scrollbar {
    width: 1px;
  }
  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0);
    border-radius: 24px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0);
    border-radius: 24px;
    border: 1px solid transparent;
  }
  &::-webkit-scrollbar-thumb:hover {
    background-color: rgba(0, 0, 0, 0);
  }

  /* Firefox scrollbar */
  scrollbar-width: thin;
  scrollbar-color: ${({ theme }) => theme.colors.secondaryBackground}
    rgba(0, 0, 0, 0);
`;

const MobileOption = styled.option`
  padding: 8px;
  background: ${({ theme }) => theme.colors.primaryBackground};
  color: ${({ theme }) => theme.colors.textPrimary};
  text-align: left; /* Options aligned left */
  border-radius: 8px;
`;
