import { cardAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers, useTheme } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(cardAnatomy.keys);

const variants = {
    Card: definePartsStyle((props) => {
        const theme = useTheme();
        const secondaryColor = theme.colors.secondary; 

        return {
            container: {
                backgroundColor: secondaryColor, 
                borderRadius: '20px',
            },
            footer: {
                paddingTop: '0px',
                paddingBottom: '20px',
            }
        };
    }),
};

export const cardStyle = defineMultiStyleConfig({ variants });
