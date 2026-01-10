'use client';

import React, { useState } from 'react';
import styled from 'styled-components';

import { readBlobFile } from '@/utils/helper';

import { ButtonPrimaryConfirm } from '@/globals/buttons';
import { Subtext } from '@/globals/styled-components';
import APITranscoder, { EncryptedData } from '../APITranscoder';
import { toast } from 'sonner';

// Styled components
const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;


`;




interface AdminKeyFile {
    u: string;
    p: string;
}


// Type definitions for props
interface AdminKeyLoaderProps {
    onSuccess?: (keyData: AdminKeyFile) => void;
}

const AdminKeyLoader: React.FC<AdminKeyLoaderProps> = ({ onSuccess }) => {





    const [parsedContent, setParsedContent] = useState<string | null>(null);

    const handleReadFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (file) {
            // Ensure the file has a .liamkey extension
            if (!file.name.endsWith('.liamkey')) {
                toast.error('Oops! Only .liamkey files are allowed. Please load a valid .liamkey provided by the developer.');
                event.target.value = ''; // Reset the file input
                return;
            }

            // Proceed with reading the file


            try {
                const content = await readBlobFile(file);

                // Convert JSON object to a formatted string
                const parsedData = JSON.parse(content as string) as EncryptedData;

                const extractedKey = APITranscoder.decodeRQX(parsedData.rqx);

                const decryptedData = APITranscoder.decryptPayload(parsedData.data, extractedKey);

                setParsedContent(decryptedData.u as string);

                const outputData = decryptedData as unknown;
                onSuccess?.(outputData as AdminKeyFile);
            } catch (error) {
                console.error(error);
                setParsedContent('Invalid Admin Key');
            }
        }

    };

    return (
        <InputWrapper>
            <Subtext>
                {parsedContent}
            </Subtext>
            <ButtonPrimaryConfirm onClick={() => document.getElementById(`file-upload-key`)?.click()}>
                Load File
            </ButtonPrimaryConfirm>
            <input
                id={`file-upload-key`}
                type="file"
                accept=".liamkey"
                onChange={handleReadFile}
                style={{ display: 'none' }}
            />

        </InputWrapper >
    );
};

export default AdminKeyLoader;

