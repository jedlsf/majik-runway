/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { downloadBlob } from "../../utils/helper";
import { ButtonPrimaryConfirm } from "../../globals/buttons";
import { toast } from "sonner";

/* ---------------------------------------------
 * Types
 * ------------------------------------------- */
type Mode = "encrypt" | "decrypt";

/* ---------------------------------------------
 * Styled Components
 * ------------------------------------------- */
const Root = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  color: ${({ theme }) => theme.colors.textPrimary};

  overflow: hidden;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #222;

`;

const Title = styled.div`
  font-size: 14px;
  font-weight: 600;
  opacity: 0.85;
`;

const Toggle = styled.button<{ mode: Mode }>`
  padding: 6px 12px;
  font-size: 12px;
  border-radius: 999px;
  border: 1px solid #333;
  cursor: pointer;
  background: ${({ mode }) => (mode === "encrypt" ? "#2563eb" : "#16a34a")};
  color: #fff;
  transition: background 0.2s ease;

  &:hover {
    opacity: 0.9;
  }
`;

const Body = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Section = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Label = styled.div`
  padding: 8px 16px;
  font-size: 12px;
  opacity: 0.6;
`;

const TextArea = styled.textarea<{ readOnly?: boolean }>`
  flex: 1;
    border-radius: 12px;
  resize: none;
  padding: 16px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
    "Liberation Mono", monospace;
  font-size: ${({ theme }) => theme.typography.sizes.label};
  line-height: 1.5;
  border: none;
  outline: none;
  min-height: 160px;
  color: ${({ readOnly, theme }) =>
    readOnly ? theme.colors.textSecondary : theme.colors.textPrimary};
  background: ${({ readOnly, theme }) =>
    readOnly ? "#0b0d11" : theme.colors.semitransparent};
`;

const PreviewActions = styled.div`
  display: flex;
  gap: 8px;
  padding: 8px 16px;
  border-top: 1px solid #222;
`;

const ActionButton = styled(ButtonPrimaryConfirm)`
  padding: 6px 20px;
`;

interface TextEditPreviewInputProps {
  onEncrypt: (input: string) => Promise<string>;
  onDecrypt: (input: string) => Promise<string>;
  downloadName?: string;
}

/* ---------------------------------------------
 * Component
 * ------------------------------------------- */
const TextEditPreviewInput: React.FC<TextEditPreviewInputProps> = ({
  onEncrypt,
  onDecrypt,
  downloadName,
}) => {
  const [mode, setMode] = useState<Mode>("encrypt");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [, setIsProcessing] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const process = async () => {
      if (!input.trim()) {
        setOutput("");
        return;
      }

      setIsProcessing(true);

      try {
        const result =
          mode === "encrypt" ? await onEncrypt(input) : await onDecrypt(input);

        if (!cancelled) {
          setOutput(result);
        }
      } catch (err) {
        if (!cancelled) {
          console.error(err);
          setOutput("⚠️ Failed to process text");
        }
      } finally {
        if (!cancelled) {
          setIsProcessing(false);
        }
      }
    };

    process();

    return () => {
      cancelled = true;
    };
  }, [input, mode, onEncrypt, onDecrypt]);

  const handleToggle = () => {
    setMode((prev) => (prev === "encrypt" ? "decrypt" : "encrypt"));
    setInput("");
    setOutput("");
  };

  const handleCopy = useCallback(() => {
    if (!output?.trim()) {
      toast.error("Failed to copy to clipboard", {
        description: "No text to copy.",
        id: `toast-error-copy-${output}`,
      });
      return;
    }
    try {
      navigator.clipboard.writeText(output);
      toast.success("Copied to clipboard", {
        description: output.length > 200 ? output.slice(0, 200) + "…" : output,
        id: `toast-success-copy-${output}`,
      });
    } catch (e) {
      // fallback: show in prompt
      toast.error("Failed to copy to clipboard", {
        description: (e as any)?.message || e,
        id: `toast-error-copy-${output}`,
      });
    }
  }, [output]);

  const handleDownloadTxt = () => {
    const blob = new Blob([output], {
      type: "application/octet-stream",
    });
    downloadBlob(blob, "txt", downloadName || "Encoded");
  };

  const handleDownloadJson = () => {
    const messageJSON = {
      original: input,
      encrypted: output,
    };

    const jsonString = JSON.stringify(messageJSON);

    const blob = new Blob([jsonString], {
      type: "application/json;charset=utf-8",
    });
    downloadBlob(blob, "json", downloadName || "Encoded");
  };

  const labels = useMemo(
    () => ({
      input: mode === "encrypt" ? "Plain Text Input" : "Encrypted Text Input",
      output: mode === "encrypt" ? "Encrypted Preview" : "Decrypted Preview",
    }),
    [mode]
  );

  return (
    <Root>
      <Header>
        <Title>Text Encode / Decode</Title>
        <Toggle mode={mode} onClick={handleToggle}>
          {mode === "encrypt" ? "Encrypt" : "Decrypt"}
        </Toggle>
      </Header>

      <Body>
        <Section>
          <Label>{labels.input}</Label>
          <TextArea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              mode === "encrypt"
                ? "Type any message here…"
                : "Paste encrypted text here…"
            }
          />
        </Section>

        <Section>
          <Label>{labels.output}</Label>
          <TextArea readOnly value={output} />
          <PreviewActions>
            <ActionButton onClick={handleCopy}>Copy</ActionButton>
            <ActionButton onClick={handleDownloadTxt}>
              Download .txt
            </ActionButton>
            <ActionButton onClick={handleDownloadJson}>
              Download .json
            </ActionButton>
          </PreviewActions>
        </Section>
      </Body>
    </Root>
  );
};

export default TextEditPreviewInput;
