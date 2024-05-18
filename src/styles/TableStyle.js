import { tableAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers, useTheme, useColorMode } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(tableAnatomy.keys)

  const variants = {
    MemberDisplay: definePartsStyle(() => {
        const theme = useTheme();
        const { colorMode } = useColorMode();
        const primary = colorMode === "light" ? theme.colors.primary.light : theme.colors.primary.dark;

        return {
            tbody: {
                tr: {
                    borderWidth: 'none',
                },
            },
        };
    }),
};

export const TableStyle = defineMultiStyleConfig({ variants })