import React from 'react';
import { 
    Card, 
    CardHeader, 
    CardBody, 
    Image, 
    Stack, 
    Text,
    useTheme,
    useDisclosure,
    useColorMode,
} from '@chakra-ui/react'
import {
    List,
    ListItem,
    ListIcon,
} from '@chakra-ui/react'
import { IoMdPerson } from "react-icons/io";
import { ReactComponent as ProfileIcon1 } from "../../public/profileIcons/profileIcon1.svg";
// import { ReactComponent as ProfileIcon2 } from "../../public/profileIcons/profileIcon2.svg";
// import { ReactComponent as ProfileIcon3 } from "../../public/profileIcons/profileIcon3.svg";
// import { ReactComponent as ProfileIcon4 } from "../../public/profileIcons/profileIcon4.svg";
// import { ReactComponent as ProfileIcon5 } from "../../public/profileIcons/profileIcon5.svg";
// import { ReactComponent as ProfileIcon6 } from "../../public/profileIcons/profileIcon6.svg";
// import { ReactComponent as ProfileIcon7 } from "../../public/profileIcons/profileIcon7.svg";
import RideDrawer from '../Drawer/RideDrawer'

function RideCard({ driver, time, numRiders, maxRiders, riders }) {
    const theme = useTheme();
    const { colorMode } = useColorMode();
    const textPrimary = colorMode === "light" ? theme.colors.textPrimary.light : theme.colors.textPrimary.dark;
    const textSecondary = colorMode === "light" ? theme.colors.textSecondary.light : theme.colors.textSecondary.dark;
    const { isOpen, onOpen, onClose } = useDisclosure();

    const handleClick = () => {
        // Handle click action here
        onOpen();
        console.log("Card clicked!");
    };

    return (
    <>
        <Card
            direction='row'
            overflow='hidden'
            variant='Card'
            maxW='95%'
            onClick={handleClick}
            cursor="pointer"
            minH='107px'
            marginBottom='20px'
        >
            <Image
                objectFit='cover'
                maxW='30%'
                src="cars/dark_suv.png"
                alt='Car Image'
            />

            <Stack gap='0px' maxW='154px'>
                <CardHeader 
                    pt='10px' 
                    pb='5px' 
                >
                    <Text 
                        align='left' 
                        fontWeight='bold' 
                        fontSize='lg' 
                        color={textPrimary}
                    >
                        {driver}
                    </Text>
                </CardHeader>

                <CardBody 
                    pt='0px' 
                >
                    <Text 
                        align='left' 
                        fontSize='sm' 
                        color={textSecondary}
                    >
                        Pick up: <span style={{ fontWeight: 'bold' }}>{time}</span>
                    </Text>
                </CardBody>
            </Stack>

            <Stack gap='0px'>
                <CardHeader 
                    pt='10px' 
                    pb='5px' 
                    display='flex' 
                    alignItems='center' 
                    justifyContent='center'
                    fontSize='lg' 
                    fontWeight={500}
                    color={textPrimary}
                >
                    <IoMdPerson/>
                    <Text>
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
                        color={textSecondary}
                        fontWeight='bold'
                    >
                        {riders.map((rider, index) => (
                            <ListItem key={index}>
                                <ListIcon as={ProfileIcon1} color={textPrimary} />
                                {rider}
                            </ListItem>
                        ))}
                    </List>
                </CardBody>
            </Stack>
        </Card>
        <RideDrawer isOpen={isOpen} onOpen={onOpen} onClose={onClose} />
    </>
    )
}

export default RideCard;