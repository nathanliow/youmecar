import { accordionAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers, useTheme, useColorMode } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(accordionAnatomy.keys)

const variants = {
    LocationDropdown: definePartsStyle(() => {
        const theme = useTheme();
        const { colorMode } = useColorMode();
        const textPrimary = colorMode === "light" ? theme.colors.textPrimary.light : theme.colors.textPrimary.dark;
        const textSecondary = colorMode === "light" ? theme.colors.textSecondary.light : theme.colors.textSecondary.dark;

        return {
            container: {
                border: '0px',
            },
            button: {
                textColor: textPrimary,
                borderRadius: 'full'
            },
            icon: {
                color: textSecondary,
            },
        };
    }),
};

export const DropdownStyle = defineMultiStyleConfig({ variants })