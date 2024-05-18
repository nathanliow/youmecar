import { defineStyle, defineStyleConfig } from '@chakra-ui/react';
import { useTheme, useColorMode } from '@chakra-ui/react';

const normal = defineStyle(() => {
    const theme = useTheme();
    const { colorMode } = useColorMode();
    const secondary = colorMode === "light" ? theme.colors.secondary.light : theme.colors.secondary.dark;
    const textPrimary = colorMode === "light" ? theme.colors.textPrimary.light : theme.colors.textPrimary.dark;
    const hover = colorMode === "light" ? theme.colors.hover.light : theme.colors.hover.dark;
    
    return {
        color: textPrimary,
        background: secondary,
        _hover: {
            background: hover,
        },
    };
}); 

const back = defineStyle(() => {
    const theme = useTheme();
    const { colorMode } = useColorMode();
    const primary = colorMode === "light" ? theme.colors.primary.light : theme.colors.primary.dark;
    const textPrimary = colorMode === "light" ? theme.colors.textPrimary.light : theme.colors.textPrimary.dark;
    const hover = colorMode === "light" ? theme.colors.hover.light : theme.colors.hover.dark;
    
    return {
        fontSize: "30px",
        color: textPrimary,
        background: primary,
        _hover: {
            background: hover,
        },
    };
});

const darkMode = defineStyle(() => {
    const theme = useTheme();
    const { colorMode } = useColorMode();
    const primary = colorMode === "light" ? theme.colors.primary.light : theme.colors.primary.dark;
    const textPrimary = colorMode === "light" ? theme.colors.textPrimary.light : theme.colors.textPrimary.dark;
    const hover = colorMode === "light" ? theme.colors.hover.light : theme.colors.hover.dark;
    
    return {
        fontSize: "30px",
        color: textPrimary,
        background: primary,
        _hover: {
            background: hover,
        },
    };
});

const logOut = defineStyle(() => {
    const theme = useTheme();
    const { colorMode } = useColorMode();
    const primary = colorMode === "light" ? theme.colors.primary.light : theme.colors.primary.dark;
    const textPrimary = colorMode === "light" ? theme.colors.textPrimary.light : theme.colors.textPrimary.dark;
    const hover = colorMode === "light" ? theme.colors.hover.light : theme.colors.hover.dark;
    
    return {
        fontSize: "30px",
        color: textPrimary,
        background: primary,
        _hover: {
            background: hover,
        },
    };
});

const saveChanges = defineStyle(() => {
    const theme = useTheme();
    const { colorMode } = useColorMode();
    const textPrimary = colorMode === "light" ? theme.colors.textPrimary.light : theme.colors.textPrimary.dark;
    
    return {
        color: textPrimary,
        background: '#3182CE',
        _hover: {
            background: '#669ED2',
        },
    };
});


const discardChanges = defineStyle(() => {
    const theme = useTheme();
    const { colorMode } = useColorMode();
    const textPrimary = colorMode === "light" ? theme.colors.textPrimary.light : theme.colors.textPrimary.dark;
    
    return {
        color: textPrimary,
        background: '#D63939',
        _hover: {
            background: '#F67878',
        },
    };
});

export const ButtonStyle = defineStyleConfig({ 
    variants: { 
        normal,
        back, 
        darkMode, 
        logOut,
        saveChanges,
        discardChanges,
    }
});
