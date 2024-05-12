import { extendTheme } from "@chakra-ui/react";
import { CardStyle } from './CardStyle'
import { DropdownStyle } from './DropdownStyle'
import { ButtonStyle } from './ButtonStyle'
import { DrawerStyle } from './DrawerStyle'

const theme = {
    config: {
        initialColorMode: "system",
        useSystemColorMode: false,
    },
    colors: {
        primary: {
            light: 'white',
            dark: 'black',
        },
        secondary: {
            light: '#E8E8E8',
            dark: '#2D2D2D',
        },
        textPrimary: {
            light: 'black',
            dark: 'white',
        },
        textSecondary: {
            light: '#888888',
            dark: '#888888',
        }
    },
    components: {
        Card: CardStyle,
        Accordion: DropdownStyle,
        Button: ButtonStyle,
        Drawer: DrawerStyle,
    },
};

export default extendTheme(theme);