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
import { getOrganizationMembers } from '../../Firebase';

function OrgCard({ key, name, numMembers }) {
    const theme = useTheme();
    const { colorMode } = useColorMode();
    const primary = colorMode === "light" ? theme.colors.primary.light : theme.colors.primary.dark;
    const textPrimary = colorMode === "light" ? theme.colors.textPrimary.light : theme.colors.textPrimary.dark;
    const textSecondary = colorMode === "light" ? theme.colors.textSecondary.light : theme.colors.textSecondary.dark;
    const [memberAvatars, setMemberAvatars] = useState([]);

    const handleClick = () => {
        // Handle click action here
        console.log("Card clicked!");
    };

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const orgId = key;
                const members = await getOrganizationMembers(orgId);
                console.log(members)

                // Set the member avatars in state
                setMemberAvatars(members);
            } catch (error) {
                // Handle error
                console.error('Error fetching organization members:', error);
            }
        };

        fetchMembers();
    }, []);

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
                src='https://static.wixstatic.com/media/cef247_25962d37998547028c5ddb86886e7053~mv2.jpg/v1/crop/x_155,y_0,w_608,h_609/fill/w_560,h_560,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/Kyle-Church_edited.jpg'
                alt='Event Image'
                borderRadius='20px'
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
                                    {memberAvatars.map((avatarpfp, index) => (
                                        <Avatar key={index} name="Joe Mama" size='xs' src={avatarpfp} bg={primary} style={{ marginLeft: '-5px' }}/>
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