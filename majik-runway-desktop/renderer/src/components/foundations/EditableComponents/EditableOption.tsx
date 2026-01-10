"use client";
import { useState } from "react";

import styled from "styled-components";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";

import { DotsThreeIcon, EraserIcon } from "@phosphor-icons/react";

import { Tooltip } from "react-tooltip";
import theme from "../../../globals/theme";

const OptionContainer = styled.div`
  display: flex;
  position: relative; /* Needed for absolutely positioning the text if required */
  height: auto;
  width: 100%;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: ${({ theme }) => theme.colors.secondaryBackground};
  color: ${({ theme }) => theme.colors.textPrimary};
  transition: background 0.1s ease-in-out;
  border: 1px solid ${({ theme }) => theme.colors.secondaryBackground};
  overflow: hidden;
  border-radius: 8px;
  padding: 3px 10px;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryBackground};
  }
`;

/* Wraps the text to keep it centered */
const CenteredTextWrapper = styled.div`
  flex: 1; /* Take up full width except where icon sits */
  text-align: center; /* Center the text horizontally */
  pointer-events: none; /* So clicking still triggers the container */
`;

/* The three-dot menu icon pinned to the right */
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

  /* Fallback shrinking based on viewport width */
  font-size: min(${({ theme }) => theme.typography.sizes.subject}, 4vw);
`;

const UnsetOptionItem = styled(OptionItem)`
  opacity: 0.6;
`;

const StyledDropdownMenuContent = styled(DropdownMenuContent)`
  max-height: 500px; /* enable scrolling */
  overflow-y: auto;
  background: ${({ theme }) => theme.colors.primaryBackground};

  /* Custom Scrollbar Styling */
  &::-webkit-scrollbar {
    width: 1px; /* Width of the entire scrollbar */
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0); /* Background color of the scrollbar track */
    border-radius: 24px; /* Rounded corners of the scrollbar track */
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0); /* Color of the scrollbar thumb */
    border-radius: 24px; /* Rounded corners of the scrollbar thumb */
    border: 1px solid transparent; /* Space around the thumb */
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: rgba(
      0,
      0,
      0,
      0
    ); /* Color when hovering over the scrollbar thumb */
  }

  /* Custom Scrollbar for Firefox */
  scrollbar-width: thin; /* Makes the scrollbar thinner */
  scrollbar-color: ${({ theme }) => theme.colors.secondaryBackground}
    rgba(0, 0, 0, 0); /* Thumb and track colors */
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

interface EditableOptionProps {
  id?: string;
  options:
    | string[]
    | number[]
    | { [key: string]: string | number }
    | { value: string | number }[]
    | object;
  exclude?: string[] | { [key: string]: string } | { value: string }[] | object;
  refKey?: string;
  currentValue?: string | number;
  tooltip?: string;
  onUpdate?: (value: string | number, refKey?: string) => void;
  onClear?: (refKey?: string) => void;
}

export function EditableOption({
  id,
  options = [],
  exclude = [],
  refKey,
  currentValue,
  onUpdate,
  onClear,
  tooltip = "Edit Option",
}: EditableOptionProps) {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  const handleClose = () => setMenuOpen(false);

  const handleIconClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(!menuOpen);
  };

  const value = currentValue;

  /**
   * Normalizes any type of input (array, object, enum)
   * into a clean string[] for dropdown rendering.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const normalizeToStringArray = (input: any): string[] => {
    if (!input) return [];

    // ✅ Handle plain object or enum
    if (typeof input === "object" && !Array.isArray(input)) {
      const values = Object.values(input);

      // Detect if it's a numeric enum (has reverse mapping)
      const isNumericEnum = values.some((v) => typeof v === "number");

      if (isNumericEnum) {
        // Only return numeric values (ignore string keys like "ISO_100")
        return values
          .filter((v) => typeof v === "number")
          .map((v) => String(v));
      } else {
        // String enum or plain object → return as is
        return values.map((v) => String(v));
      }
    }

    // ✅ Handle array of objects like [{ value: 1 }, { value: "x" }]
    if (
      Array.isArray(input) &&
      typeof input[0] === "object" &&
      input[0] !== null
    ) {
      return input
        .map((item) => ("value" in item ? String(item.value) : String(item)))
        .filter(Boolean);
    }

    // ✅ Handle simple array of strings or numbers
    if (Array.isArray(input)) {
      return input.map((v) => String(v));
    }

    return [];
  };

  const getOptions = (): string[] => {
    const optionsArray = normalizeToStringArray(options);
    const excludeArray = normalizeToStringArray(exclude);

    if (excludeArray.length === 0) return optionsArray;

    return optionsArray.filter((opt) => !excludeArray.includes(opt));
  };

  return (
    <>
      <DesktopWrapper>
        <OptionContainer
          onClick={handleIconClick}
          data-tooltip-id={`rtip-editable-option-${refKey}`}
          data-tooltip-content={tooltip}
          id={id}
        >
          <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
            <DropdownMenuTrigger asChild>
              <CenteredTextWrapper>
                {(typeof value === "string" && !!value?.trim()) ||
                (typeof value === "number" && !isNaN(Number(value))) ? (
                  <OptionItem>{value}</OptionItem>
                ) : (
                  <UnsetOptionItem>
                    {tooltip || "Click here to change"}
                  </UnsetOptionItem>
                )}
              </CenteredTextWrapper>
            </DropdownMenuTrigger>

            <DotsWrapper>
              <DotsThreeIcon size={24} />
            </DotsWrapper>
            <StyledDropdownMenuContent>
              {getOptions()
                .filter((opt) => opt !== value)
                .map((item) => (
                  <DropdownMenuItem
                    key={item}
                    onSelect={() => {
                      const normalizedOptions = normalizeToStringArray(options);

                      // Check if the current `item` is numeric and matches a numeric option
                      const parsedValue =
                        !isNaN(Number(item)) &&
                        normalizedOptions.includes(String(Number(item)))
                          ? Number(item)
                          : item;

                      onUpdate?.(parsedValue, refKey);

                      handleClose();
                    }}
                    className="!px-4 !py-2 data-[highlighted]:bg-[#750c0c] text-[#f7f7f7] data-[highlighted]:text-[#f7f7f7]"
                  >
                    {item}
                  </DropdownMenuItem>
                ))}

              {!!onClear && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onSelect={() => {
                      onClear?.(refKey);
                      handleClose();
                    }}
                    className="!px-4 !py-2 data-[highlighted]:bg-[#750c0c] text-[#f7f7f7] data-[highlighted]:text-[#f7f7f7]"
                  >
                    <EraserIcon size={24} />
                    Clear
                  </DropdownMenuItem>
                </>
              )}
            </StyledDropdownMenuContent>
          </DropdownMenu>
        </OptionContainer>
        <Tooltip
          id={`rtip-editable-option-${refKey}`}
          style={{
            fontSize: 12,
            fontWeight: 400,
            backgroundColor: theme.colors.secondaryBackground,
          }}
        />
      </DesktopWrapper>
      <MobileWrapper>
        <MobileDropdown
          value={value || ""}
          onChange={(e) => {
            const selectedValue = e.target.value;
            if (selectedValue === "clear") {
              onClear?.(refKey);
            } else {
              onUpdate?.(selectedValue, refKey);
            }
          }}
        >
          <MobileOption value="" disabled>
            {tooltip || "Select Option"}
          </MobileOption>

          {getOptions().map((item) => (
            <MobileOption
              key={item}
              onSelect={() => {
                const normalizedOptions = normalizeToStringArray(options);

                // Check if the current `item` is numeric and matches a numeric option
                const parsedValue =
                  !isNaN(Number(item)) &&
                  normalizedOptions.includes(String(Number(item)))
                    ? Number(item)
                    : item;

                onUpdate?.(parsedValue, refKey);

                handleClose();
              }}
            >
              {item}
            </MobileOption>
          ))}

          {/* Clear Option */}
          <MobileOption value="clear">Clear</MobileOption>
        </MobileDropdown>
      </MobileWrapper>
    </>
  );
}
