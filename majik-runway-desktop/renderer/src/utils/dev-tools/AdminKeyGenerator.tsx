'use client';

import React, { useState } from 'react';
import styled from 'styled-components';


import { downloadBlob, isDevEnvironment, prepareToBlobFile } from '@/utils/helper';
import { toast } from 'sonner';
import { ButtonPrimaryConfirm } from '@/globals/buttons';
import CustomInputField from '@/components/foundations/CustomInputField';
import APITranscoder from '../APITranscoder';

// Styled components
const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;


`;







const AdminKeyGenerator: React.FC = () => {

    const [inputUserName, setInputUsername] = useState<string>("");

    const [inputPassword, setInputPassword] = useState<string>("");


    const handleChangeUsername = (input: string) => {

        if (!!input) {
            try {

                setInputUsername(input);

                if (isDevEnvironment()) console.log("Current Username: ", input);
            } catch (error) {
                toast.error(`There's a problem updating the Username. Please try again or try refreshing. Error: ${error}`)
            }
        }


    };

    const handleChangePassword = (input: string) => {

        if (!!input) {
            try {

                setInputPassword(input);

                if (isDevEnvironment()) console.log("Current Username: ", input);
            } catch (error) {
                toast.error(`There's a problem updating the Username. Please try again or try refreshing. Error: ${error}`)
            }
        }


    };


    const handleDownloadFile = () => {

        const rawData = {
            u: inputUserName,
            p: inputPassword
        }


        const generatedRQC = APITranscoder.generateRQC();
        const encryptedData = APITranscoder.encryptPayload(rawData, generatedRQC, true);

        const blobData = prepareToBlobFile(encryptedData);
        downloadBlob(blobData, "zworld", "Admin Access Key");


    };




    return (
        <InputWrapper>
            <CustomInputField
                label='Username'
                type="email"
                currentValue={inputUserName}
                onChange={handleChangeUsername}
                required
            />
            <CustomInputField
                label="Password"
                type="password"
                currentValue={inputPassword}
                onChange={handleChangePassword}
                required
            />

            <ButtonPrimaryConfirm
                onClick={handleDownloadFile}
            >
                Download Admin Key
            </ButtonPrimaryConfirm>


        </InputWrapper>
    );
};

export default AdminKeyGenerator;
