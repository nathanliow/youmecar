import {
    InputGroup,
    Input,
    InputLeftElement,
    useTheme,
    useColorMode,
} from '@chakra-ui/react'
import { IoMdSearch } from "react-icons/io";

  
function SearchBar() {
    const theme = useTheme();
    const { colorMode } = useColorMode();
    const primary = colorMode === "light" ? theme.colors.primary.light : theme.colors.primary.dark; 
    const textPrimary = colorMode === "light" ? theme.colors.textPrimary.light : theme.colors.textPrimary.dark; 

    return (
      <>
        <InputGroup size="md">
            <InputLeftElement
                children={<IoMdSearch color={textPrimary} />}
            />
            <Input 
                variant='' // prevents default hover effect
                type="text" 
                placeholder="Search..." 
                _placeholder={{ color: textPrimary }}
                color={textPrimary}
                bg={primary}
                border="1px solid" 
                borderColor={textPrimary} 
                borderRadius='20px'/>
        </InputGroup>
      </>
    )
}

export default SearchBar;