import { extendTheme } from "@chakra-ui/react";
import { CardStyle } from './CardStyle'
import { DropdownStyle } from './DropdownStyle'
import { ButtonStyle } from './ButtonStyle'
import { DrawerStyle } from './DrawerStyle'
import { TableStyle } from './TableStyle'

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
            light: '#E8E8E8',
            dark: '#2D2D2D',
        },
        overlay: {
            light: 'blackAlpha.600',
            dark: 'blackAlpha.800',
        },
        hover: {
            light: '#F5F5F5',
            dark: '#4B4B4B',
        },
    },
    components: {
        Card: CardStyle,
        Accordion: DropdownStyle,
        Button: ButtonStyle,
        Drawer: DrawerStyle,
        Table: TableStyle,
    },
};

export default extendTheme(theme);