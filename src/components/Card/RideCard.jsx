import { 
    Card, 
    CardHeader, 
    CardBody, 
    Image, 
    Stack, 
    Text,
    useTheme,
    Spacer
} from '@chakra-ui/react'
import {
    List,
    ListItem,
    ListIcon,
} from '@chakra-ui/react'
import { IoMdPerson } from "react-icons/io";
import { ReactComponent as ProfileIcon1 } from "../../public/profileIcons/profileIcon1.svg";
import { ReactComponent as ProfileIcon2 } from "../../public/profileIcons/profileIcon2.svg";

function RideCard({ name, time, numRiders, maxRiders, riders }) {
    const theme = useTheme();
    const textPrimary = theme.colors.textPrimary; 
    const textSecondary = theme.colors.textSecondary;

    const handleClick = () => {
        // Handle click action here
        console.log("Card clicked!");
    };

    return (
        <Card
            direction='row'
            overflow='hidden'
            variant='RideCard'
            maxW='90%'
            onClick={handleClick}
            cursor="pointer"
        >
            <Image
                objectFit='cover'
                maxW={{ base: '30%', sm: '120px' }}
                src='https://images.unsplash.com/photo-1667489022797-ab608913feeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw5fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60'
                alt='Caffe Latte'
            />

                <Stack gap='0px'>
                    <CardHeader 
                        pt='5px' 
                        pb='5px' 
                        pl='20px'
                    >
                        <Text 
                            align='left' 
                            fontWeight='bold' 
                            fontSize='lg' 
                            color={textPrimary}
                        >
                            {name}
                        </Text>
                    </CardHeader>

                    <CardBody 
                        pt='0px' 
                        pl='20px'
                    >
                        <Text 
                            align='left' 
                            fontSize='sm' 
                            color={textSecondary}
                        >
                            Pick up: {time}
                        </Text>
                    </CardBody>
                </Stack>

                <Spacer />

                <Stack gap='0px'>
                    <CardHeader 
                        pt='5px' 
                        pb='5px' 
                        display='flex' 
                        alignItems='center' 
                        justifyContent='center'
                    >
                        <IoMdPerson/>
                        <Text 
                            fontWeight={500}
                            fontSize='lg' 
                            color={textPrimary}
                        >
                            {numRiders}/{maxRiders}
                        </Text>
                    </CardHeader>

                    <CardBody 
                        pt='0px' 
                        pl='4px' 
                        pb='10px' 
                        pr='20px'
                    >
                        <List 
                            align='left' 
                            fontSize='10px' 
                            color={textPrimary}
                        >
                            {riders.map((rider, index) => (
                            <ListItem 
                                key={index} 
                            >
                                <ListIcon as={ProfileIcon2} color={textPrimary} />
                                {rider}
                            </ListItem>
                            ))}
                        </List>
                    </CardBody>
                </Stack>
        </Card>
    )
}

export default RideCard;