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
import { ReactComponent as ProfileIcon1 } from "../../public/profileIcons/profileIcon1.svg";
import { ChevronRightIcon } from '@chakra-ui/icons'
import { getUsersInfo } from '../../Firebase'

function OrgCard({ orgImage, name, numMembers, admins, members }) {
    const theme = useTheme();
    const { colorMode } = useColorMode();
    const primary = colorMode === "light" ? theme.colors.primary.light : theme.colors.primary.dark;
    const textPrimary = colorMode === "light" ? theme.colors.textPrimary.light : theme.colors.textPrimary.dark;
    const textSecondary = colorMode === "light" ? theme.colors.textSecondary.light : theme.colors.textSecondary.dark;
    const [avatarUsers, setAvatarUsers] = useState([]);

    const handleClick = () => {
        // Handle click action here
        console.log("Card clicked!");
    };

    // Fetch user data for admins and members
    useEffect(() => {
        const fetchUsers = async () => {
            const avatarMembers = admins.concat(members).slice(0, 3);
            const users = await getUsersInfo(avatarMembers);
            setAvatarUsers(users);
        };

        fetchUsers();
    }, [admins, members]);

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
            minH='134px'
        >
            <Image
                objectFit='cover'
                maxW='30%'
                src={orgImage}
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
                                <span style={{ fontWeight: 'bold' }}>{numMembers}</span> Members
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

export default OrgCard;