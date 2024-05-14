import {
    InputGroup,
    Input,
    InputLeftElement,
    useTheme,
    useColorMode,
} from '@chakra-ui/react'
import { IoMdSearch } from "react-icons/io";

  
function SearchBar({ onSearch }) {
    const theme = useTheme();
    const { colorMode } = useColorMode();
    const primary = colorMode === "light" ? theme.colors.primary.light : theme.colors.primary.dark; 
    const textSecondary = colorMode === "light" ? theme.colors.textSecondary.light : theme.colors.textSecondary.dark; 
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
                _placeholder={{ color: textSecondary }}
                color={textPrimary}
                bg={primary}
                border="1px solid" 
                borderColor={textPrimary} 
                borderRadius='20px'
                onChange={(e) => onSearch(e.target.value)}
            />
        </InputGroup>
      </>
    )
}

export default SearchBar;