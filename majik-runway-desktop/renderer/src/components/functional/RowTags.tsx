'use client';

import React from 'react';
import styled from 'styled-components';

type RowTagsProps = {
    tags: string[];
};

const TagsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  width: 100%;
`;

const Tag = styled.span`
  padding: 5px 15px;
  background-color: ${({ theme }) => theme.colors.secondaryBackground};
  color: ${({ theme }) => theme.colors.textPrimary};
  border-radius: 8px;
  font-size: 0.875rem; // text-sm
  white-space: nowrap;
`;

const RowTags: React.FC<RowTagsProps> = ({ tags }) => {
    return (
        <TagsWrapper>
            {tags.map((tag, index) => (
                <Tag key={index}>{tag}</Tag>
            ))}
        </TagsWrapper>
    );
};

export default RowTags;
