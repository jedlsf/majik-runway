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
} from "../components/ui/dropdown-menu";

import { DotsThreeIcon, EraserIcon, PlusIcon } from "@phosphor-icons/react";
import theme from "../globals/theme";

import { MajikContact } from "../SDK/majik-message/core/contacts/majik-contact";

interface MajikContactListSelectorProps {
  id?: string;
  contacts: MajikContact[]; // available contacts
  value?: MajikContact[]; // selected contacts
  tooltip: string;
  refKey?: string;
  onUpdate?: (value: MajikContact[], refKey?: string) => void;
  onClearAll?: (refKey?: string) => void;
  emptyActionButton?: () => void;
  emptyActionText?: string;
  allowEmpty?: boolean;
}

// ---------------- Helpers ---------------- //

const arraysEqual = (a: MajikContact[], b: MajikContact[]) =>
  a.length === b.length && a.every((item, i) => item.id === b[i].id);

const getContactLabel = (contact: MajikContact) =>
  contact.meta.label || contact.id;

// ---------------- Component ---------------- //

export function MajikContactListSelector({
  id,
  contacts,
  value = [],
  tooltip,
  refKey,
  onUpdate,
  onClearAll,
  emptyActionButton,
  emptyActionText = "Add New Contact",
  allowEmpty = true,
}: MajikContactListSelectorProps) {
  const [list, setList] = useState<MajikContact[]>(value);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isItemHovered, setIsItemHovered] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value && !arraysEqual(value, list)) setList(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const handleSelect = (contact: MajikContact) => {
    if (list.some((c) => c.id === contact.id)) {
      toast.error("This contact is already added.");
      return;
    }
    const updated = [...list, contact];
    setList(updated);
    onUpdate?.(updated, refKey);
    setMenuOpen(false);
  };

  const handleRemove = (index: number) => {
    const updated = list.filter((_, i) => i !== index);
    if (!allowEmpty && updated.length === 0) {
      toast.error("Recipient cannot be empty.", {
        id: "toast-error-empty-recipient",
      });
      return;
    }
    setList(updated);
    onUpdate?.(updated, refKey);
  };

  const availableContacts = useMemo(
    () => contacts.filter((c) => !list.some((sel) => sel.id === c.id)),
    [contacts, list]
  );

  const handleIconClick = (e: React.MouseEvent) => {
    if (!contacts || contacts.length === 0) {
      toast.error("No contacts available.", {
        description:
          "You currently do not have available contacts to choose from.",
        id: `toast-error-${id}`,
        action: !!emptyActionButton
          ? { label: emptyActionText, onClick: emptyActionButton }
          : undefined,
      });
      return;
    }

    if (isItemHovered) return;

    e.stopPropagation();
    setMenuOpen(!menuOpen);
  };

  // ---------------- Render ---------------- //
  return (
    <>
      <SelectorWrapper
        ref={wrapperRef}
        id={id}
        onClick={handleIconClick}
        $isEmpty={list.length === 0}
      >
        <TagsWrapper
          data-tooltip-id={`rtip-contact-list-${refKey}`}
          data-tooltip-content={tooltip}
        >
          {list.length > 0 ? (
            list.map((contact, index) => (
              <Tag
                key={contact.id}
                onMouseEnter={() => setIsItemHovered(true)}
                onMouseLeave={() => setIsItemHovered(false)}
              >
                <span>{getContactLabel(contact)}</span>
                <RemoveButton onClick={() => handleRemove(index)}>
                  ✕
                </RemoveButton>
              </Tag>
            ))
          ) : (
            <span>No contacts selected yet.</span>
          )}

          <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
            <DropdownMenuTrigger asChild={false}></DropdownMenuTrigger>
            <StyledDropdownMenuContent>
              {availableContacts.map((contact) => (
                <DropdownMenuItem
                  key={contact.id}
                  onSelect={() => handleSelect(contact)}
                  className="!px-4 !py-2 data-[highlighted]:bg-[#750c0c] text-[#f7f7f7] data-[highlighted]:text-[#f7f7f7]"
                >
                  {getContactLabel(contact)}
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
                    className="!px-4 !py-2 data-[highlighted]:bg-[#750c0c] text-[#f7f7f7] data-[highlighted]:text-[#f7f7f7]"
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
                  className="!px-4 !py-2 data-[highlighted]:bg-[#750c0c] text-[#f7f7f7] data-[highlighted]:text-[#f7f7f7]"
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
        id={`rtip-contact-list-${refKey}`}
        style={{
          fontSize: 12,
          fontWeight: 400,
          backgroundColor: theme.colors.secondaryBackground,
        }}
      />
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
