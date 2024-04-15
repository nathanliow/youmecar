import React from 'react';
import { 
    Card, 
    CardHeader, 
    CardBody, 
    CardFooter,
    Image, 
    Stack, 
    Text,
    useTheme,
    Spacer
} from '@chakra-ui/react'
import { ReactComponent as ProfileIcon1 } from "../../public/profileIcons/profileIcon1.svg";

function EventCard({ name, location, time, numGoing }) {
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
            maxW='95%'
            onClick={handleClick}
            cursor="pointer"
        >
            <Image
                objectFit='cover'
                maxW='30%'
                src='https://images.unsplash.com/photo-1667489022797-ab608913feeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw5fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60'
                alt='Caffe Latte'
            />

                <Stack gap='0px'>
                    <CardHeader 
                        pt='5px' 
                        pb='5px' 
                        pl='20px'
                        fontWeight='bold' 
                        fontSize='lg' 
                        color={textPrimary}
                        align='left'
                    >
                        <Text>
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
                            Location: {location}
                        </Text>
                        <Text 
                            align='left' 
                            fontSize='sm' 
                            color={textSecondary}
                        >
                            Pick up: {time}
                        </Text>
                        <br/>
                        <Text 
                            align='left' 
                            fontSize='sm' 
                            color={textSecondary}
                        >
                            <div style={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
                                <div style={{ display: 'flex', flexDirection: 'row', position: 'relative', zIndex: '1' }}> 
                                    <ProfileIcon1 width='20px' height='20px' style={{ marginLeft: '-5px' }} />
                                    <ProfileIcon1 width='20px' height='20px' style={{ marginLeft: '-5px' }} />
                                    <ProfileIcon1 width='20px' height='20px' style={{ marginLeft: '-5px' }} />
                                </div>
                                {numGoing} going
                            </div>
                        </Text>
                    </CardBody>
                </Stack>
        </Card>
    )
}

export default EventCard;