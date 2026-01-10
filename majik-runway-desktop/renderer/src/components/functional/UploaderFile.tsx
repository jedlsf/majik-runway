"use client";

import React, { type ChangeEvent, useRef, useState, useEffect } from "react";
import styled from "styled-components";
import { ButtonPrimaryConfirm } from "../../globals/buttons";

const RootContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  min-width: 250px;
  padding: 10px;
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.typography.sizes.label};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  user-select: none;
`;

const HelperText = styled.div<{ $error?: boolean }>`
  font-size: ${({ theme }) => theme.typography.sizes.helper};
  color: ${({ $error, theme }) =>
    $error ? theme.colors.error : theme.colors.textSecondary};
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 10px;
`;

const Button = styled(ButtonPrimaryConfirm)`
  padding: 6px 10px;
  height: 32px;
  border-radius: 5px;
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

export interface UploadedFilePayload {
  file: Blob; // File extends Blob
  name: string;
  type: string;
  size: number;
  extension: string;
}

interface UploaderFileProps {
  label?: string;
  accept?: string[]; // MIME types
  maxFileSizeMB?: number; // 0 = unlimited
  allowClear?: boolean;
  disabled?: boolean;

  onUpload?: (payload: UploadedFilePayload | null) => void;
  onClear?: () => void;

  id?: string;
}

const UploaderFile: React.FC<UploaderFileProps> = ({
  label,
  accept,
  maxFileSizeMB = 0,
  allowClear = true,
  disabled = false,
  onUpload,
  onClear,
  id,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getFileNameWithoutExtension = (fileName: string): string => {
    const lastDotIndex = fileName.lastIndexOf(".");
    return lastDotIndex === -1 ? fileName : fileName.slice(0, lastDotIndex);
  };

  const getFileExtension = (fileName: string): string => {
    const lastDotIndex = fileName.lastIndexOf(".");
    return lastDotIndex === -1
      ? ""
      : fileName.slice(lastDotIndex + 1).toLowerCase();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (accept?.length) {
      const fileExt = `.${file.name.split(".").pop()?.toLowerCase()}`;
      const mimeType = file.type;

      const allowed = accept.some((type) =>
        type.startsWith(".") ? type === fileExt : type === mimeType
      );

      if (!allowed) {
        setError(`Unsupported file type. Allowed: ${formatTypes(accept)}`);
        event.target.value = "";
        return;
      }
    }

    // Size validation
    if (maxFileSizeMB > 0) {
      const maxBytes = maxFileSizeMB * 1024 * 1024;
      if (file.size > maxBytes) {
        setError(`File exceeds ${maxFileSizeMB}MB limit.`);
        return;
      }
    }

    setError(null);

    const cleanName = getFileNameWithoutExtension(file.name);
    const extension = getFileExtension(file.name);

    setFileName(file.name);

    onUpload?.({
      file,
      name: cleanName,
      size: file.size,
      type: file.type,
      extension,
    });
  };

  const handleClear = () => {
    setFileName(null);
    setError(null);

    if (inputRef.current) {
      inputRef.current.value = "";
    }

    onUpload?.(null);
    onClear?.();
  };

  useEffect(() => {
    handleClear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <RootContainer>
      {label && <Label>{label}</Label>}

      <ButtonRow>
        <Button
          onClick={() => inputRef.current?.click()}
          disabled={disabled || !!fileName}
        >
          {fileName ? "Imported" : "Import File"}
        </Button>

        <Button onClick={handleClear} disabled={!fileName || !allowClear}>
          Clear
        </Button>
      </ButtonRow>

      <HiddenInput
        ref={inputRef}
        type="file"
        accept={accept?.join(",")}
        onChange={handleFileChange}
      />

      <HelperText $error={!!error}>
        {error || (fileName ? `Selected: ${fileName}` : "No file selected")}
      </HelperText>
    </RootContainer>
  );
};

export default UploaderFile;

/* -------------------------------- Utils -------------------------------- */

const formatTypes = (types: string[]) =>
  types
    .map((t) =>
      t.startsWith(".") ? t.toUpperCase() : t.split("/")[1]?.toUpperCase() ?? t
    )
    .join(", ");

