import React, { useState, useEffect } from 'react';
import { 
    Card, 
    CardHeader, 
    CardBody, 
    Image, 
    Stack, 
    Text,
    useTheme,
    useColorMode,
    Avatar,
} from '@chakra-ui/react'
import { ChevronRightIcon } from '@chakra-ui/icons'
import { getUsersInfo } from '../../Firebase'
import { useNavigate } from 'react-router-dom';

function EventCard({ orgId, eventId, eventImage, name, location, time, numGoing, going }) {
    const theme = useTheme();
    const { colorMode } = useColorMode();
    const primary = colorMode === "light" ? theme.colors.primary.light : theme.colors.primary.dark;
    const textPrimary = colorMode === "light" ? theme.colors.textPrimary.light : theme.colors.textPrimary.dark;
    const textSecondary = colorMode === "light" ? theme.colors.textSecondary.light : theme.colors.textSecondary.dark;
    const [avatarUsers, setAvatarUsers] = useState([]);
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/${orgId}/${eventId}`);
    };

    const formatDate = (timeString) => {
        const date = new Date(timeString);
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours % 12 || 12; // Convert 0 to 12
        const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
        const formattedDate = `${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}`;
        const formattedTime = `${formattedHours}:${formattedMinutes} ${ampm}`;
        return [formattedDate, formattedTime];
    };

    useEffect(() => {
        const fetchUsers = async () => {
            const avatarMembers = going.slice(0, 3);
            const users = await getUsersInfo(avatarMembers);
            setAvatarUsers(users);
        };

        fetchUsers();
    }, [going]);

    return (
        <Card
            direction='row'
            overflow='hidden'
            variant='Card'
            maxW='95%'
            onClick={handleClick}
            cursor="pointer"
            alignItems="center"
            justifyContent="space-between"
            px='20px'
            marginBottom='20px'
        >
            <Image
                objectFit='cover'
                maxW='30%'
                src={eventImage}
                alt='Event Image'
                borderRadius='20px'
                fallbackSrc='/images/serena.png' 
            />

                <Stack gap='0px' width='full'>
                    <CardHeader 
                        pt='10px' 
                        pb='5px' 
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
                    >
                        <Text 
                            align='left' 
                            fontSize='sm' 
                            color={textSecondary}
                        >
                            Location: <span style={{ fontWeight: 'bold' }}>{location ? location : 'TBD'}</span>
                        </Text>
                        <Text 
                            align='left' 
                            fontSize='sm' 
                            color={textSecondary}
                        >
                            Pick up: <span style={{ fontWeight: 'bold' }}>{time ? formatDate(time)[1] : 'TBD'}</span>
                        </Text>
                        <Text 
                            align='left' 
                            fontSize='sm' 
                            color={textSecondary}
                        >
                            Date: <span style={{ fontWeight: 'bold' }}>{time ? formatDate(time)[0] : 'TBD'}</span>
                        </Text>
                        <br/>
                        <Text 
                            align='left' 
                            fontSize='sm' 
                            color={textSecondary}
                        >
                            <div style={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
                                <div style={{ display: 'flex', flexDirection: 'row', position: 'relative', zIndex: '1' }}> 
                                    {avatarUsers.map((user, index) => (
                                        <Avatar key={index} name={user.displayName} src={user.Pfp} size='xs' bg={primary} style={{ marginLeft: index !== 0 && '-5px' }}/>
                                    ))}
                                </div>
                                <div>
                                    <span style={{ fontWeight: 'bold' }}>{numGoing}</span> going
                                </div>
                            </div>
                        </Text>
                    </CardBody>
                </Stack>
                <ChevronRightIcon 
                    fontSize='30px'
                    color={textPrimary}
                />
        </Card>
    )
}

export default EventCard;