import { extendTheme } from '@chakra-ui/react'
import { CardStyle } from '../CardStyle'
import { DropdownStyle } from '../DropdownStyle'
import { ButtonStyle } from '../ButtonStyle'
import { DrawerStyle } from '../DrawerStyle'

const LightTheme = extendTheme({
  colors: {
    primary: 'white',
    secondary: '#E8E8E8',
    textPrimary: 'black',
    textSecondary: '#888888'
  },
  components: {
    Card: CardStyle,
    Accordion: DropdownStyle,
    Button: ButtonStyle,
    Drawer: DrawerStyle,
  },
})

export default LightTheme;