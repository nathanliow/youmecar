import { accordionAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers, useTheme } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(accordionAnatomy.keys)

const variants = {
    LocationDropdown: definePartsStyle(() => {
        const theme = useTheme();
        const textPrimaryColor = theme.colors.textPrimary; 
        const textSecondaryColor = theme.colors.textSecondary; 

        return {
            container: {
                border: '0px',
            },
            button: {
                textColor: textPrimaryColor,
                borderRadius: 'full'
            },
            icon: {
                color: textSecondaryColor,
            },
        };
    }),
};

export const DropdownStyle = defineMultiStyleConfig({ variants })