import {
    InputGroup,
    Input,
    InputLeftElement,
    useTheme,
} from '@chakra-ui/react'
import { IoMdSearch } from "react-icons/io";

  
function SearchBar() {
    const theme = useTheme();
    const primary = theme.colors.primary; 
    const textPrimary = theme.colors.textPrimary; 
    const textSecondary = theme.colors.textSecondary;

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