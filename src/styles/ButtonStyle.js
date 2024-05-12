import { defineStyle, defineStyleConfig } from '@chakra-ui/react';
import { useTheme } from '@chakra-ui/react';

const back = defineStyle(() => {
    const theme = useTheme();
    const primary = theme.colors.primary;
    const textPrimary = theme.colors.textPrimary;
    const textSecondary = theme.colors.textSecondary;
    
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
    const primary = theme.colors.primary;
    const textPrimary = theme.colors.textPrimary;
    const textSecondary = theme.colors.textSecondary;
    
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
    const primary = theme.colors.primary;
    const textPrimary = theme.colors.textPrimary;
    const textSecondary = theme.colors.textSecondary;
    
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
        back, 
        darkMode, 
        logOut,
    }
});
