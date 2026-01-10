'use client';

import { ThemeProvider } from 'styled-components';

import { type ReduxSystemRootState } from '@/redux/slices/system.js';
import { useSelector } from 'react-redux';
import { useMemo } from 'react';
import theme from './theme';

export default function ThemeProviderWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    // Get darkMode state from Redux
    const darkMode = useSelector((state: ReduxSystemRootState) => state.system.darkMode ?? false);

    // Dynamically create theme
    const dynamicTheme = useMemo(() => {
        return {
            ...theme,
            colors: {
                ...theme.colors,
                primaryBackground: darkMode ? '#151515' : theme.colors.primaryBackground,
                secondaryBackground: darkMode ? '#222020ff' : theme.colors.secondaryBackground,
                textPrimary: darkMode ? '#f8eee2' : '#272525',
                textSecondary: darkMode ? '#f2e0cb' : '#514f4f',
                semitransparent: darkMode ? "#1a191882" : theme.colors.semitransparent,

                brand: {
                    green: '#9b9e00ff',
                    red: '#ff471e',
                    blue: '#002968',
                    white: '#f7f7f7'
                },
                disabled: '#1e2021'
            },
        };
    }, [darkMode]);

    return <ThemeProvider theme={dynamicTheme}>{children}</ThemeProvider>;
}