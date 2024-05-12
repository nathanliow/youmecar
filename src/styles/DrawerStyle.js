import { drawerAnatomy as parts } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers, useTheme } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(parts.keys)

const variants = {
    Profile: definePartsStyle(() => {
        const theme = useTheme();
        const primary = theme.colors.primary; 
        const textPrimary = theme.colors.textPrimary;

        return {
            dialog: {
                bg: primary,
                color: textPrimary,
            },
            overlay: {
                bg: 'whiteAlpha.200'
            }
        };
    }),
};

export const DrawerStyle = defineMultiStyleConfig({ variants })