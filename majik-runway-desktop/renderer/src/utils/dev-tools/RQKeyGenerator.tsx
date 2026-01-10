'use client';

import React, { useState } from 'react';
import styled from 'styled-components';


import { generateRQKey, isDevEnvironment } from '@/utils/helper';
import { toast } from 'sonner';
import { ButtonPrimaryConfirm } from '@/globals/buttons';
import { Subtext, TitleSubHeader } from '@/globals/styled-components';
import CustomInputField from '@/components/foundations/CustomInputField';
import APITranscoder from '../APITranscoder';

// Styled components
const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;


`;







const RQKeyGenerator: React.FC = () => {
    const [generatedToken, setGeneratedToken] = useState<string | null>(null);
    const [generatedHash, setGeneratedHash] = useState<string | null>(null);

    const [inputValue, setInputValue] = useState<string>("");



    const handleChangeText = (input: string) => {

        if (!!input) {
            try {

                setInputValue(input);

                if (isDevEnvironment()) console.log("Current Text: ", input);
            } catch (error) {
                toast.error(`There's a problem updating the text. Please try again or try refreshing. Error: ${error}`)
            }
        }


    };


    const handleGenerateRQKey = () => {

        const generatedKey = generateRQKey(inputValue || generateRandomString(24));
        const generatedHash = APITranscoder.hashString(generatedKey);
        setGeneratedToken(generatedKey);
        setGeneratedHash(generatedHash);

    };


    return (
        <InputWrapper>
            <CustomInputField
                label='string'
                onChange={handleChangeText}
                currentValue={inputValue}
            />
            <ButtonPrimaryConfirm
                onClick={handleGenerateRQKey}
            >
                Generate Key
            </ButtonPrimaryConfirm>
            <TitleSubHeader>
                Generated
            </TitleSubHeader>
            <Subtext
                style={{ userSelect: "all" }}
            >
                {generatedToken}
            </Subtext>
            <TitleSubHeader>
                Hash
            </TitleSubHeader>
            <Subtext
                style={{ userSelect: "all" }}
            >
                {generatedHash}
            </Subtext>

        </InputWrapper>
    );
};

export default RQKeyGenerator;

function generateRandomString(length = 24) {
    return [...Array(length)]
        .map(() => Math.random().toString(36)[2])
        .join('');
}

