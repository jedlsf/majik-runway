"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TipTapMenuBar from "./TipTapMenuBar";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import styled from "styled-components";
import { dangerousSites } from "@/utils/globalDropdownOptions";
import TableOfContents from "@tiptap/extension-table-of-contents";
import Heading from "@tiptap/extension-heading";

const Label = styled.label`
  margin-bottom: ${({ theme }) => theme.spacing.small};
  font-size: ${({ theme }) => theme.typography.sizes.label};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  text-align: left;
  display: block;
  user-select: none;

  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

interface TipTapTextEditorProps {
  label?: string;
  content: string;
  onChange: (html: string, text: string) => void;
}
export default function TipTapTextEditor({
  label,
  content,
  onChange,
}: TipTapTextEditorProps) {
  const isClient = true;

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: { HTMLAttributes: { class: "list-disc ml-3" } },
        orderedList: { HTMLAttributes: { class: "list-decimal ml-3" } },
      }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Highlight,
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
        protocols: ["http", "https"],
        isAllowedUri: (url, ctx) => {
          try {
            const parsedUrl = url.includes(":")
              ? new URL(url)
              : new URL(`${ctx.defaultProtocol}://${url}`);
            const protocol = parsedUrl.protocol.replace(":", "");
            const disallowedProtocols = ["ftp", "file", "mailto"];
            const allowedProtocols = ctx.protocols.map((p) =>
              typeof p === "string" ? p : p.scheme
            );
            const domain = parsedUrl.hostname;
            const disallowedDomains = dangerousSites;

            return (
              ctx.defaultValidate(parsedUrl.href) &&
              !disallowedProtocols.includes(protocol) &&
              allowedProtocols.includes(protocol) &&
              !disallowedDomains.includes(domain)
            );
          } catch {
            return false;
          }
        },
        shouldAutoLink: (url) => {
          try {
            const parsedUrl = url.includes(":")
              ? new URL(url)
              : new URL(`https://${url}`);
            const domain = parsedUrl.hostname;
            const disallowedDomains = [
              "example-no-autolink.com",
              "another-no-autolink.com",
            ];
            return !disallowedDomains.includes(domain);
          } catch {
            return false;
          }
        },
      }),
      Heading.configure({
        levels: [1, 2, 3, 4, 5, 6],
        HTMLAttributes: {
          // The TOC extension relies on this
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          "data-toc-id": (node: any) => {
            // Fallback if ID is missing
            return (
              node.attrs.id ||
              node.textContent.toLowerCase().replace(/\\s+/g, "-")
            );
          },
        },
      }),
      TableOfContents.configure({
        getId: (text) =>
          text
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, "") // remove punctuation
            .replace(/\s+/g, "-"), // replace spaces with hyphens
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class: "min-h-[156px] border rounded-md !py-2 !px-3",
      },
    },
    onUpdate: ({ editor }) => {
      const editorHTML = editor.getHTML();
      const editorText = editor.getText();
      onChange(editorHTML, editorText);
    },
    immediatelyRender: false, // crucial for SSR
  });

  if (!isClient || !editor) return null;

  return (
    <div className="flex flex-col gap-[10px]">
      {!!label && label.trim() !== "" ? <Label>{label}</Label> : null}
      <TipTapMenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
