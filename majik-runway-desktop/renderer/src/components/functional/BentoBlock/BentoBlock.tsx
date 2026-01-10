import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const StyledLink = styled(Link)`
  height: auto;
  box-sizing: border-box;
  display: flex;
`;

const BentoBlockWrapper = styled.div<{ $isLink?: boolean }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: auto;
  box-sizing: border-box;
  background: ${({ theme }) => theme.colors.secondaryBackground};
  border: 1px solid ${({ theme }) => theme.colors.secondaryBackground};
  border-radius: 12px;
  padding: 16px;
  overflow: hidden;

  transition: all 0.24s ease;
  color: ${({ theme }) => theme.colors.textPrimary};
  cursor: ${({ $isLink }) => ($isLink ? "pointer" : "unset")};

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      transform: scale(1.02);
      border: 1px solid ${({ theme }) => theme.colors.primary};
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
    }
  }
`;

const BentoBlockDisabledWrapper = styled.div<{ $isLink?: boolean }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: auto;
  box-sizing: border-box;
  background: ${({ theme }) => theme.colors.secondaryBackground};
  border: 1px solid ${({ theme }) => theme.colors.secondaryBackground};
  border-radius: 12px;
  padding: 16px;
  overflow: hidden;
  transition: all 0.24s ease;
  color: ${({ theme }) => theme.colors.textPrimary};
  opacity: 0.7;
  cursor: ${({ $isLink }) => ($isLink ? "pointer" : "unset")};

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      transform: scale(1.02);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
    }
  }
`;

const BentoBlockSelectedWrapper = styled(BentoBlockDisabledWrapper)<{
  $isLink?: boolean;
}>`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: auto;
  box-sizing: border-box;
  background: ${({ theme }) => theme.colors.accent};
  border: 1px solid ${({ theme }) => theme.colors.secondaryBackground};
  border-radius: 12px;
  padding: 16px;
  overflow: hidden;
  transition: all 0.24s ease;
  color: ${({ theme }) => theme.colors.textPrimary};
  opacity: 1;
  cursor: ${({ $isLink }) => ($isLink ? "pointer" : "unset")};

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      transform: scale(1.02);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
    }
  }
`;

interface BentoBlockProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  selected?: boolean;
}

export const BentoBlock: React.FC<BentoBlockProps> = ({
  children,
  href,
  onClick,
  disabled = false,
  selected = false,
}) => {
  if (!!href && href.trim() !== "") {
    return (
      <StyledLink to={href}>
        <BentoBlockWrapper $isLink={true}>{children}</BentoBlockWrapper>
      </StyledLink>
    );
  }

  return disabled ? (
    <BentoBlockDisabledWrapper $isLink={!!onClick} onClick={onClick}>
      {children}
    </BentoBlockDisabledWrapper>
  ) : selected ? (
    <BentoBlockSelectedWrapper $isLink={!!onClick} onClick={onClick}>
      {children}
    </BentoBlockSelectedWrapper>
  ) : (
    <BentoBlockWrapper $isLink={!!onClick} onClick={onClick}>
      {children}
    </BentoBlockWrapper>
  );
};
