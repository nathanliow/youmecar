import { cardAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers, useTheme } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(cardAnatomy.keys);

const variants = {
  RideCard: definePartsStyle((props) => {
    const theme = useTheme();
    const primaryColor = theme.colors.primary; 
    const secondaryColor = theme.colors.secondary; 

    return {
      container: {
        backgroundColor: secondaryColor, 
        borderColor: 'green',
        borderWidth: '3px',
        borderRadius: '20px',
      },
      header: {
        borderColor: 'red',
        borderWidth: '1px',
      },
      body: {
        borderColor: 'blue',
        borderWidth: '1px',
      },
      footer: {
        borderColor: 'red',
        borderWidth: '1px',
      },
    };
  }),
};

export const cardStyle = defineMultiStyleConfig({ variants });
