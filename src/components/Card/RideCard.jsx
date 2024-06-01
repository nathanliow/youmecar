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
    Avatar,
} from '@chakra-ui/react'
import {
    List,
    ListItem,
    ListIcon,
} from '@chakra-ui/react'
import { IoMdPerson } from "react-icons/io";
import RideDrawer from '../Drawer/RideDrawer'

function RideCard({ rideImage, driver, time, numRiders, maxRiders, ridersNames, riderPfps }) {
    const theme = useTheme();
    const { colorMode } = useColorMode();
    const primary = colorMode === "light" ? theme.colors.primary.light : theme.colors.primary.dark;
    const textPrimary = colorMode === "light" ? theme.colors.textPrimary.light : theme.colors.textPrimary.dark;
    const textSecondary = colorMode === "light" ? theme.colors.textSecondary.light : theme.colors.textSecondary.dark;
    const { isOpen, onOpen, onClose } = useDisclosure();

    const handleClick = () => {
        // Handle click action here
        onOpen();
        console.log("Card clicked!");
    };

    const formatTime = (timeString) => {
        const date = new Date(timeString);
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours % 12 || 12;
        const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
        const formattedTime = `${formattedHours}:${formattedMinutes} ${ampm}`;
        return [formattedTime];
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
                src={rideImage}
                alt='Car Image'
                fallbackSrc='/cars/light_sedan.png' 
            />

            <Stack gap='0px' maxWidth='154px'>
                <CardHeader 
                    pt='10px' 
                    pb='5px' 
                    pl='5px'
                    pr='5px'
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
                    pl='5px'
                    pr='5px'
                >
                    <Text 
                        align='left' 
                        fontSize='sm' 
                        color={textSecondary}
                    >
                        Pick up: <span style={{ fontWeight: 'bold' }}>{formatTime(time)}</span>
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
                    pr='10px'
                >
                    <List 
                        align='left' 
                        fontSize='10px' 
                        color={textSecondary}
                        fontWeight='bold'
                    >
                        {ridersNames.map((rider, index) => (
                            <ListItem key={index} display="flex" alignItems="center">
                                <Avatar name={rider} src={riderPfps[index]} width='15px' height='15px' bg={primary} mr={2} />
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