import React from 'react';
import { 
    Card, 
    CardHeader, 
    CardBody, 
    Image, 
    Stack, 
    Text,
    useTheme,
} from '@chakra-ui/react'
import { ReactComponent as ProfileIcon1 } from "../../public/profileIcons/profileIcon1.svg";
import { ChevronRightIcon } from '@chakra-ui/icons'

function OrgCard({ name, numMembers }) {
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
            variant='Card'
            maxW='95%'
            onClick={handleClick}
            cursor="pointer"
            alignItems="center"
            justifyContent="space-between"
            px='20px'
        >
            <Image
                objectFit='cover'
                maxW='30%'
                src='https://static.wixstatic.com/media/cef247_25962d37998547028c5ddb86886e7053~mv2.jpg/v1/crop/x_155,y_0,w_608,h_609/fill/w_560,h_560,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/Kyle-Church_edited.jpg'
                alt='Event Image'
                borderRadius='20px'
            />

                <Stack gap='0px'>
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
                                    <ProfileIcon1 width='20px' height='20px' style={{ marginLeft: '-5px' }} />
                                    <ProfileIcon1 width='20px' height='20px' style={{ marginLeft: '-5px' }} />
                                    <ProfileIcon1 width='20px' height='20px' style={{ marginLeft: '-5px' }} />
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