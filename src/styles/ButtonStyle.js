import { defineStyle, defineStyleConfig } from '@chakra-ui/react';
import { useTheme, useColorMode } from '@chakra-ui/react';

const normal = defineStyle(() => {
    const theme = useTheme();
    const { colorMode } = useColorMode();
    const secondary = colorMode === "light" ? theme.colors.secondary.light : theme.colors.secondary.dark;
    const textPrimary = colorMode === "light" ? theme.colors.textPrimary.light : theme.colors.textPrimary.dark;
    
    return {
        color: textPrimary,
        background: secondary,
    };
}); 

const back = defineStyle(() => {
    const theme = useTheme();
    const { colorMode } = useColorMode();
    const primary = colorMode === "light" ? theme.colors.primary.light : theme.colors.primary.dark;
    const textPrimary = colorMode === "light" ? theme.colors.textPrimary.light : theme.colors.textPrimary.dark;
    const textSecondary = colorMode === "light" ? theme.colors.textSecondary.light : theme.colors.textSecondary.dark;
    
    return {
        fontSize: "30px",
        color: textPrimary,
        background: primary,
        _hover: {
            background: textSecondary,
        },
    };
});

const darkMode = defineStyle(() => {
    const theme = useTheme();
    const { colorMode } = useColorMode();
    const primary = colorMode === "light" ? theme.colors.primary.light : theme.colors.primary.dark;
    const textPrimary = colorMode === "light" ? theme.colors.textPrimary.light : theme.colors.textPrimary.dark;
    const textSecondary = colorMode === "light" ? theme.colors.textSecondary.light : theme.colors.textSecondary.dark;
    
    return {
        fontSize: "30px",
        color: textPrimary,
        background: primary,
        _hover: {
            background: textSecondary,
        },
    };
});

const logOut = defineStyle(() => {
    const theme = useTheme();
    const { colorMode } = useColorMode();
    const primary = colorMode === "light" ? theme.colors.primary.light : theme.colors.primary.dark;
    const textPrimary = colorMode === "light" ? theme.colors.textPrimary.light : theme.colors.textPrimary.dark;
    const textSecondary = colorMode === "light" ? theme.colors.textSecondary.light : theme.colors.textSecondary.dark;
    
    return {
        fontSize: "30px",
        color: textPrimary,
        background: primary,
        _hover: {
            background: textSecondary,
        },
    };
});

export const ButtonStyle = defineStyleConfig({ 
    variants: { 
        normal,
        back, 
        darkMode, 
        logOut,
    }
});
