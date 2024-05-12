import { cardAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers, useTheme, useColorMode } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(cardAnatomy.keys);

const variants = {
    Card: definePartsStyle(() => {
        const theme = useTheme();
        const { colorMode } = useColorMode()
        const secondary = colorMode === "light" ? theme.colors.secondary.light : theme.colors.secondary.dark;

        return {
            container: {
                backgroundColor: secondary, 
                borderRadius: '20px',
            },
            footer: {
                paddingTop: '0px',
                paddingBottom: '20px',
            }
        };
    }),
};

export const CardStyle = defineMultiStyleConfig({ variants });
