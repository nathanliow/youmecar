// make sure to import this to right place
import React, { useState, useEffect } from 'react';
import { useTheme, IconButton, useDisclosure, useColorMode, Avatar, Text } from '@chakra-ui/react'
import { ChevronLeftIcon } from '@chakra-ui/icons'
import ProfileDrawer from '../Drawer/ProfileDrawer';
import { getActiveUserInfo, getEvent } from '../../Firebase';
import { useNavigate } from 'react-router-dom';

function EventNavbar({ orgId, eventId }) {
    const theme = useTheme();
    const { colorMode } = useColorMode();
    const primary = colorMode === "light" ? theme.colors.primary.light : theme.colors.primary.dark;
    const secondary = colorMode === "light" ? theme.colors.secondary.light : theme.colors.secondary.dark;
    const textPrimary = colorMode === "light" ? theme.colors.textPrimary.light : theme.colors.textPrimary.dark; 
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [userInfo, setUserInfo] = useState(null);
    const [event, setEvent] = useState('');
    const navigate = useNavigate();

    const handleBackClick = () => {
        navigate(`/${orgId}`);
    };

    const handleProfileClick = () => {
        onOpen();
    };

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const userInfoData = await getActiveUserInfo();
                setUserInfo(userInfoData);
            } catch (error) {
                console.error('Error retrieving active user info:', error);
            }
        };

        fetchUserInfo();
    }, []); 

    useEffect(() => {
        async function fetchEvent() {
        try {
            const eventDoc = await getEvent(orgId, eventId);

            setEvent(eventDoc.data());
        } catch (error) {
            console.error('Error fetching event:', error);
        }
        }
        fetchEvent();
    }, []);

    return (
      <>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', backgroundColor: primary, width: '100%', minHeight: '92px'}}>
            <IconButton
                variant='back'
                aria-label='Back Button'
                icon={<ChevronLeftIcon style={{ width: '100%', height: '100%' }}/>}
                onClick={handleBackClick}
            />
            <div style={{ textAlign: 'center', maxWidth: '60%'}}>
                {event === '' ? (
                    <Text noOfLines={1} marginTop='24px' marginBottom='24px' style={{color: primary, fontWeight: 'bold'}}>_</Text>
                ) : (
                    <Text noOfLines={1} marginTop='24px' marginBottom='24px' style={{color: textPrimary, fontWeight: 'bold'}}>{event.Name}</Text>
                )}
            </div>
            <Avatar name={userInfo && userInfo.name} size='md' src={userInfo && userInfo.pfp} bg={secondary} onClick={handleProfileClick} style={{ cursor: 'pointer' }}/>
        </div>
        <ProfileDrawer isOpen={isOpen} onOpen={onOpen} onClose={onClose} userInfo={userInfo}/>
      </>
    )
}

export default EventNavbar;