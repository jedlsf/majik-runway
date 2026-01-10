// styled.d.ts
import 'styled-components';

declare module 'styled-components' {
    export interface DefaultTheme {
        typography: {
            fonts: {
                thin: string;
                extralight: string;
                light: string;
                regular: string;
                medium: string;
                semibold: string;
                bold: string;
                extrabold: string;
                black: string;
                thinItalic: string;
                extralightItalic: string;
                lightItalic: string;
                regularItalic: string;
                mediumItalic: string;
                semiboldItalic: string;
                boldItalic: string;
                extraboldItalic: string;
                blackItalic: string;
                numbers: string;
            };
            sizes: {
                header: string;
                body: string;
                label: string;
                title: string;
                helper: string;
                hint: string;
                tab: string;
                subject: string;
                xl: string;
            };
            weights: {
                header: number;
                body: number;
                title: number;
                subject: number;
                light: number;
            };
            lineHeights: {
                body: string;
                heading: string;
            };
            letterSpacing: {
                body: string;
                heading: string;
            };
        };

        colors: {
            primary: string;
            accent: string;
            error: string;
            textPrimary: string;
            textSecondary: string;
            primaryBackground: string;
            secondaryBackground: string;
            brand: {
                green: string;
                red: string;
                blue: string;
                white: string;
            };
            disabled: string;
            semitransparent: string;
        };

        spacing: {
            tight: string;
            small: string;
            medium: string;
            large: string;
            xlarge: string;
        };

        borders: {
            width: {
                thin: string;
                medium: string;
                thick: string;
            };
            radius: {
                small: string;
                medium: string;
                big: string;
                large: string;
                rounded: string;
            };
            color: {
                primary: string;
                secondary: string;
            };
        };

        shadows: {
            small: string;
            medium: string;
            large: string;
        };

        breakpoints: {
            mobile: string;
            tablet: string;
            laptop: string;
            desktop: string;
        };

        zIndex: {
            subroot: number;
            root: number;
            suboverlay: number;
            overlay: number;
            overlayContent: number;
            modal: number;
            dropdown: number;
            tooltip: number;
            topmost: number;
        };

        animations: {
            duration: {
                short: string;
                medium: string;
                long: string;
            };
            easing: {
                easeIn: string;
                easeOut: string;
                easeInOut: string;
            };
        };

        iconSizes: {
            small: string;
            medium: string;
            large: string;
            xlarge: string;
        };
    }
}
