import { extendTheme } from '@chakra-ui/react'
import { cardStyle } from '../CardStyle';


const LightTheme = extendTheme({
  colors: {
    primary: 'white',
    secondary: '#E8E8E8',
    textPrimary: 'black',
    textSecondary: '#888888'
  },
  components: {
    Card: cardStyle,
  },
})

export default LightTheme;