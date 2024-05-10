import { extendTheme } from '@chakra-ui/react'
import { cardStyle } from '../CardStyle';
import { DropdownStyle } from '../DropdownStyle';
import { ButtonStyle } from '../ButtonStyle';


const LightTheme = extendTheme({
  colors: {
    primary: 'black',
    secondary: '#E8E8E8',
    textPrimary: 'white',
    textSecondary: '#888888'
  },
  components: {
    Card: cardStyle,
    Accordion: DropdownStyle,
    Button: ButtonStyle,
  },
})

export default LightTheme;