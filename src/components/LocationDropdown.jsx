import {
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Box,
    useTheme,
} from '@chakra-ui/react'
import RideCard from './Card/RideCard';
  
function LocationDropdown({ name }) {
    const theme = useTheme();
    const textPrimary = theme.colors.textPrimary; 
    const textSecondary = theme.colors.textSecondary;

    return (
        <Accordion 
            allowMultiple
            variant='LocationDropdown'
            minW='100%'
        >
            <AccordionItem>
                <AccordionButton>
                    <Box as='span' flex='1' textAlign='left' fontWeight='bold'>
                        {name}
                    </Box>
                    <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4} display="flex" flexDirection="column" justifyContent="center" alignItems="center" gap="20px">
                    <RideCard
                        driver="John Ahn"
                        time="1:25 PM"
                        numRiders="4"
                        maxRiders="4"
                        riders={["Nathan Liow", "Serena Oh", "Joe Mama", "Mama Joe"]}
                    />
                    <RideCard
                        driver="Daniel Yu"
                        time="1:30 PM"
                        numRiders="3"
                        maxRiders="5"
                        riders={["Joe Biden", "Bo Han", "Charis Shin"]}
                    />
                </AccordionPanel>
            </AccordionItem>
        </Accordion>
    )
}

export default LocationDropdown;