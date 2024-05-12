import { drawerAnatomy as parts } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers, useTheme, useColorMode } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(parts.keys)

const variants = {
    Profile: definePartsStyle(() => {
        const theme = useTheme();
        const { colorMode } = useColorMode();
        const secondary = colorMode === "light" ? theme.colors.secondary.light : theme.colors.secondary.dark;

        return {
            dialog: {
                bg: secondary,
            },
        };
    }),
};

export const DrawerStyle = defineMultiStyleConfig({ variants })