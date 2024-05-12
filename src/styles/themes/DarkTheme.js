import { extendTheme } from '@chakra-ui/react'
import { CardStyle } from '../CardStyle';
import { DropdownStyle } from '../DropdownStyle';
import { ButtonStyle } from '../ButtonStyle';
import { DrawerStyle } from '../DrawerStyle'

const DarkTheme = extendTheme({
  colors: {
    primary: 'black',
    secondary: '#2D2D2D',
    textPrimary: 'white',
    textSecondary: '#888888'
  },
  components: {
    Card: CardStyle,
    Accordion: DropdownStyle,
    Button: ButtonStyle,
    Drawer: DrawerStyle,
  },
})

export default DarkTheme;