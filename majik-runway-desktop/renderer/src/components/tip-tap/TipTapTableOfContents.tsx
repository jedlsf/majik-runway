/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo } from "react";
import styled from "styled-components";

// ----------------------------
// Styled Components
// ----------------------------
const TocContainer = styled.div`
  padding: 1rem;

  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.secondaryBackground};
  width: 100%;
`;

const TitleText = styled.p`
  font-size: 20px;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const TocItemWrapper = styled.div`
  margin: 0.25rem 0;
  padding-left: calc(var(--level) * 12px);
  border-radius: ${({ theme }) => theme.borders.radius.small};

  &.is-active a {
    font-weight: 600;
    text-decoration: underline;
  }

  a {
    text-decoration: none;
    color: ${({ theme }) => theme.colors.textSecondary};
    cursor: pointer;
  }

  &:hover {
    background-color: ${({ theme }) => theme.colors.accent};
    transition: all 0.2s ease;
    a {
      color: ${({ theme }) => theme.colors.textPrimary};
    }
  }
`;

const EmptyState = styled.div`
  padding: 0.5rem 0;
  color: #888;
  font-size: 0.9rem;
`;

// ----------------------------
// Types
// ----------------------------
interface TOCItem {
  id: string;
  level: number;
  textContent: string;
}

// ----------------------------
// Component
// ----------------------------
const TipTapTableOfContents: React.FC<{ html: string }> = ({ html }) => {
  const toc = useMemo(() => {
    if (!html) return;

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const headings = Array.from(doc.querySelectorAll("h1, h2, h3, h4, h5, h6"));

    const items: TOCItem[] = headings.map((h) => ({
      id: h.getAttribute("id") || "",
      level: Number(h.tagName.substring(1)),
      textContent: h.textContent || "",
    }));
    return items;
  }, [html]);

  const handleItemClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();

    const element = document.getElementById(id);
    if (!element) return;

    window.history.pushState(null, "", `#${id}`);

    window.scrollTo({
      top: element.getBoundingClientRect().top + window.scrollY,
      behavior: "smooth",
    });
  };

  return (
    <TocContainer>
      <TitleText>Table of Contents</TitleText>

      {!toc || toc.length === 0 ? (
        <EmptyState>Start editing your document to see the outline.</EmptyState>
      ) : (
        toc.map((item) => (
          <TocItemWrapper
            key={item.id}
            style={{ ["--level" as any]: item.level }}
          >
            <a
              href={`#${item.id}`}
              onClick={(e) => handleItemClick(e, item.id)}
            >
              {item.textContent}
            </a>
          </TocItemWrapper>
        ))
      )}
    </TocContainer>
  );
};

export default TipTapTableOfContents;
