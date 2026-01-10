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
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "../../../components/ui/dropdown-menu";

import {
  DotsThreeIcon,
  EraserIcon,
  type Icon,
  PlusIcon,
} from "@phosphor-icons/react";

import moment from "moment";
import { parseDateFromISO } from "../../../utils/helper";

import theme from "../../../globals/theme";

const Photo = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
`;

// ---------------- Types ---------------- //

type AccessorFormat =
  | "string"
  | "full-name"
  | "date"
  | "relative-time"
  | "time"
  | "address"
  | "bool-yes-no";

interface ReferenceItem {
  id: string | null;
  name: string;
}

export interface GroupedOptions {
  group: string;
  items: any[];
  accessorKey: string;
  emptyActionButton?: () => void;
  emptyActionText?: string;
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

interface ReferenceItemGroupedListSelectorProps {
  id?: string;
  options: GroupedOptions[];
  value?: ReferenceItem[];
  idKey?: string;
  tooltip: string;
  refKey?: string;
  onUpdate?: (value: ReferenceItem[], refKey?: string) => void;
  onClearAll?: (refKey?: string) => void;
  allowEmpty?: boolean;
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

const filterItems = (
  group: GroupedOptions,
  idKey: string,
  selected: ReferenceItem[]
) => {
  let items = [...group.items];

  // Apply exclude/limit filters...
  if (group.excludeKey && group.exclude?.length) {
    items = items.filter(
      (opt) => !group.exclude!.includes(resolveAccessor(opt, group.excludeKey!))
    );
  }

  if (group.limitKey && group.limit?.length) {
    items = items.filter((opt) =>
      group.limit!.includes(resolveAccessor(opt, group.limitKey!))
    );
  }

  return items
    .filter(
      (opt) => !selected.some((sel) => String(sel.id) === String(opt[idKey]))
    )
    .map((opt) => {
      const rawValue = resolveAccessor(opt, group.accessorKey);
      const label = formatAccessorValue(
        rawValue ?? opt[idKey],
        group.accessorFormat
      );

      // ---- handle subtext ----
      let subtext: string | undefined;
      if (group.extras?.subtext?.accessorKey) {
        const rawSub = resolveAccessor(opt, group.extras.subtext.accessorKey);
        subtext = formatAccessorValue(
          rawSub,
          group.extras.subtext.accessorFormat
        );
      }

      const finalLabel = subtext ? `${label} (${subtext})` : label;

      // ---- handle photo ----
      let photoUrl: string | undefined;
      if (group.extras?.photo?.accessorKey) {
        photoUrl = resolveAccessor(opt, group.extras.photo.accessorKey);
      }

      return {
        ...opt,
        _label: finalLabel,
        _photo: photoUrl,
        _icon: group.extras?.icon,
      };
    });
};

// ---------------- Component ---------------- //

export function ReferenceItemGroupedListSelector({
  id,
  options,
  value = [],
  idKey = "id",
  tooltip,
  refKey,
  onUpdate,
  onClearAll,
  allowEmpty = true,
}: ReferenceItemGroupedListSelectorProps) {
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

  const handleSelect = (item: any, group: GroupedOptions) => {
    const rawValue = resolveAccessor(item, group.accessorKey) ?? item[idKey];

    const newItem: ReferenceItem = {
      id: String(item[idKey]),
      name: formatAccessorValue(rawValue, group.accessorFormat),
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

  const groupedOptions = useMemo(
    () =>
      options.map((group) => ({
        ...group,
        filtered: filterItems(group, idKey, list),
      })),
    [options, list, idKey]
  );

  const handleIconClick = (e: React.MouseEvent) => {
    if (!options || options.length <= 0) {
      toast.error("No Options Available", {
        description:
          "You currently do not have available items to choose from for this field.",
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
                // find the group + item that matches this tag.id
                const sourceItem = options
                  .flatMap((g) => g.items.map((opt) => ({ group: g, opt })))
                  .find((entry) => String(entry.opt[idKey]) === String(tag.id));

                let photo: string | undefined;
                let IconComp: Icon | undefined;

                if (sourceItem) {
                  const { group, opt } = sourceItem;

                  if (group.extras?.photo?.accessorKey) {
                    photo = resolveAccessor(
                      opt,
                      group.extras.photo.accessorKey
                    );
                  }

                  if (group.extras?.icon) {
                    IconComp = group.extras.icon;
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
          </TagsWrapper>

          <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
            <DropdownMenuTrigger asChild={false} />

            <StyledDropdownMenuContent className="flex-column w-56 !py-1 bg-[#f8eee2]">
              {groupedOptions.map((group) => (
                <DropdownMenuSub key={group.group}>
                  <DropdownMenuSubTrigger
                    className="
                  !px-4 !py-2 w-full flex items-center justify-between
                  data-[highlighted]:bg-[#f2e0cb]
                  data-[state=open]:bg-[#f2e0cb]
                "
                  >
                    {group.group}
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    {group.filtered.map((opt) => (
                      <DropdownMenuItem
                        key={String(opt[idKey])}
                        onSelect={() => handleSelect(opt, group)}
                        className="!px-4 !py-2 data-[highlighted]:bg-[#f2e0cb] flex items-center gap-3"
                      >
                        {opt._photo ? (
                          <Photo src={opt._photo} alt="photo" />
                        ) : opt._icon ? (
                          <opt._icon size={24} />
                        ) : null}

                        <span>{opt._label}</span>
                      </DropdownMenuItem>
                    ))}

                    {/* Group-specific empty action */}
                    {group.filtered.length === 0 && group.emptyActionButton && (
                      <DropdownMenuItem
                        onSelect={() => {
                          group.emptyActionButton?.();
                          setMenuOpen(false);
                        }}
                        className="!px-4 !py-2 data-[highlighted]:bg-[#f2e0cb]"
                      >
                        <PlusIcon size={20} />
                        {group.emptyActionText ?? "Add New Item"}
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
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
            </StyledDropdownMenuContent>
          </DropdownMenu>

          <DotsWrapper>
            <DotsThreeIcon size={20} />
          </DotsWrapper>

          <Tooltip
            id={`rtip-ref-list-${refKey}`}
            style={{
              fontSize: 12,
              fontWeight: 400,
              backgroundColor: theme.colors.primary,
            }}
          />
        </SelectorWrapper>
      </DesktopWrapper>
      <MobileWrapper>
        {list.length > 0 ? (
          list.map((tag, index) => {
            const sourceItem = options
              .flatMap((g) => g.items.map((opt) => ({ group: g, opt })))
              .find((entry) => String(entry.opt[idKey]) === String(tag.id));

            let photo: string | undefined;
            let IconComp: Icon | undefined;

            if (sourceItem) {
              const { group, opt } = sourceItem;
              if (group.extras?.photo?.accessorKey) {
                photo = resolveAccessor(opt, group.extras.photo.accessorKey);
              }
              if (group.extras?.icon) {
                IconComp = group.extras.icon;
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

            // Detect empty action
            if (selectedId.startsWith("add-")) {
              const groupName = selectedId.replace("add-", "");
              const targetGroup = groupedOptions.find(
                (g) => g.group === groupName
              );
              targetGroup?.emptyActionButton?.();
              return;
            }

            const found = groupedOptions
              .flatMap((g) => g.filtered.map((opt) => ({ group: g, opt })))
              .find((entry) => String(entry.opt[idKey]) === selectedId);

            if (found) {
              handleSelect(found.opt, found.group);
            }
          }}
        >
          <MobileOption value="" disabled>
            {tooltip?.trim() ? `Add New ${tooltip}` : "Select an option"}
          </MobileOption>

          {groupedOptions.map((group) => (
            <MobileOptGroup key={group.group} label={group.group}>
              {group.filtered.map((opt) => (
                <MobileOption
                  key={String(opt[idKey])}
                  value={String(opt[idKey])}
                >
                  {opt._label}
                </MobileOption>
              ))}

              {/* Empty state action */}
              {group.emptyActionButton && (
                <MobileOption value={`add-${group.group}`}>
                  {group.emptyActionText ?? "Create New Item"}
                </MobileOption>
              )}
            </MobileOptGroup>
          ))}

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
  display: flex; /* Required for line clamping */
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2; /* Max 2 lines before ellipsis */
  overflow: hidden;
  text-overflow: ellipsis;
  flex-direction: row;

  align-items: center;
  gap: 6px;
  padding: 5px 10px;
  background-color: ${({ theme }) => theme.colors.primaryBackground};
  color: ${({ theme }) => theme.colors.textPrimary};
  border-radius: 8px;
  font-size: 0.875rem;
  transition: all 0.3s ease;
  cursor: default;

  /* Force wrapping and breaking */
  white-space: normal; /* Allow text to wrap */
  overflow-wrap: break-word; /* Break long words */
  word-break: break-word; /* Extra support for long strings */
  hyphens: auto; /* Add dashes when breaking long words */

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

const MobileOptGroup = styled.optgroup`
  font-weight: 600;
  padding: 4px 0;
  text-align: left;
  color: ${({ theme }) => theme.colors.textPrimary};
`;
