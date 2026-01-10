
import React, { useState, useRef, useEffect } from "react";
import { Tooltip } from "react-tooltip";
import { toast } from "sonner";
import styled from "styled-components";
import theme from "../../../globals/theme";

const CharacterCount = styled.div<{ $isexceeded: boolean }>`
  align-self: flex-end;
  font-size: ${({ theme }) => theme.typography.sizes.helper};
  color: ${({ theme, $isexceeded }) =>
        $isexceeded ? theme.colors.error : theme.colors.textSecondary};
  margin-top: ${({ theme }) => theme.spacing.small};
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const TagsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  width: 100%;
`;

const Tag = styled.span`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 10px;
  background-color: ${({ theme }) => theme.colors.secondaryBackground};
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
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.error};
  }
`;

interface EditableListStringProps {
    id?: string;
    listData?: string[];
    refKey?: string;
    onUpdate: (newList: string[], refKey?: string) => void;
    allowEmpty?: boolean;
    tooltip?: string;
    maxChar?: number;
    minChar?: number;
}

export function EditableListString({
    id,
    listData = [],
    refKey,
    onUpdate,
    allowEmpty = false,
    tooltip = "Edit List",
    maxChar = 0
}: EditableListStringProps) {





    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [value, setValue] = useState<string[]>(listData);
    const [currentInput, setCurrentInput] = useState<string>("");

    const inputRef = useRef<HTMLInputElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);


    useEffect(() => {
        setValue(listData);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);


    const handleBlur = () => {
        setIsEditing(false);
        setCurrentInput("");
    };



    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                handleBlur();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);


    const handleAddTag = () => {
        const trimmed = currentInput.trim();
        if (!trimmed) return;

        if (maxChar > 0 && trimmed.length > maxChar) {
            toast.error(`Tag exceeds maximum length of ${maxChar} characters.`);
            return;
        }

        const duplicate = value.some((item) => item.toLowerCase() === trimmed.toLowerCase());
        if (duplicate) {
            toast.error("Duplicate tag not allowed.");
            return;
        }

        const updatedList = [...value, trimmed];
        setValue(updatedList);
        setCurrentInput("");
        onUpdate(updatedList, refKey);
    };

    const handleRemoveTag = (index: number) => {
        const updatedList = value.filter((_, i) => i !== index);
        if (!allowEmpty && updatedList.length === 0) {
            toast.error("List cannot be empty.");
            return;
        }
        setValue(updatedList);
        onUpdate(updatedList, refKey);
    };

    const handleEnterKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleAddTag();
        } else if (e.key === "Escape") {
            setIsEditing(false);
            setCurrentInput("");
        }
    };

    const isExceeded = maxChar > 0 && currentInput.length > maxChar;

    return (
        <EditableListStringWrapper ref={wrapperRef} $isEditing={isEditing} id={id}>

            {isEditing ? (
                <InputWrapper>
                    <TagsWrapper>
                        {value.map((tag, index) => (
                            <Tag key={index}>
                                {tag}
                                <RemoveButton onClick={() => handleRemoveTag(index)}>✕</RemoveButton>
                            </Tag>
                        ))}
                    </TagsWrapper>

                    <GroupInput
                        ref={inputRef}
                        value={currentInput}
                        placeholder="Type and press Enter to add"
                        onChange={(e) => setCurrentInput(e.target.value)}
                        onKeyDown={handleEnterKey}
                        autoFocus
                    />

                    {maxChar !== 0 && (
                        <CharacterCount $isexceeded={isExceeded}>
                            {currentInput.length}/{maxChar}
                        </CharacterCount>
                    )}
                </InputWrapper>
            ) : (
                <GroupLabelText
                    onClick={() => {
                        if (!isEditing) {
                            setIsEditing(true);
                            setTimeout(() => inputRef.current?.focus(), 0);
                        }
                    }}
                    $isEmpty={value.length === 0}
                    data-tooltip-id={`rtip-editable-list-${refKey}`}
                    data-tooltip-content={tooltip}
                >
                    <TagsWrapper>
                        {value.length > 0 ? (
                            value.map((tag, index) => <Tag key={index}>{tag}</Tag>)
                        ) : (
                            <span>No items added yet.</span>
                        )}
                    </TagsWrapper>
                </GroupLabelText>
            )}
            <Tooltip
                id={`rtip-editable-list-${refKey}`}
                style={{
                    fontSize: 12,
                    fontWeight: 400,
                    backgroundColor: theme.colors.primary
                }}
            />
        </EditableListStringWrapper>
    );
}

/* ---------- styled ---------- */

const EditableListStringWrapper = styled.div<{ $isEditing: boolean }>`
  display: flex;
  width: 100%;
  align-items: center;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  cursor: text;
  transition: all 0.2s ease;
  border: 1px solid transparent;

  ${({ $isEditing }) =>
        !$isEditing &&
        `
      &:hover {
        border: 1px solid #ea7f05;
        background: rgba(234, 127, 5, 0.05);
      }
    `}
`;

const GroupInput = styled.input`
  width: 100%;
  font-size: ${({ theme }) => theme.typography.sizes.label};
  background: white;
  border: 1px solid #ea7f05;
  border-radius: 6px;
  padding: 4px 8px;
  outline: none;
  margin-top: 8px;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

interface SectionTitleProps {
    alignment?: "left" | "center" | "right";
    $isEmpty?: boolean;
}

const GroupLabelText = styled.div<SectionTitleProps>`
  width: 100%;
  font-size: ${({ theme }) => theme.typography.sizes.label};
  transition: all 0.2s ease;
  opacity: ${(props) => (props.$isEmpty ? "0.6" : "unset")};

  display: flex;
  justify-content: space-between;
  color: ${({ theme }) => theme.colors.textPrimary};
  text-align: ${(props) => props.alignment || "left"};
`;

