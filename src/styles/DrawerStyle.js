import { drawerAnatomy as parts } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers, useTheme, useColorMode } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(parts.keys)

const variants = {
    Profile: definePartsStyle(() => {
        const theme = useTheme();
        const { colorMode } = useColorMode();
        const primary = colorMode === "light" ? theme.colors.primary.light : theme.colors.primary.dark;

        return {
            dialog: {
                bg: primary,
            },
        };
    }),
};

export const DrawerStyle = defineMultiStyleConfig({ variants })