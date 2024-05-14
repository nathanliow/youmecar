import React, { useState, useEffect } from 'react';
import { useTheme, IconButton, useDisclosure, useColorMode, Avatar } from '@chakra-ui/react'
import { FaCarAlt } from "react-icons/fa";
import ProfileDrawer from '../Drawer/ProfileDrawer';
import { getActiveUserInfo } from '../../Firebase';


function HomeNavbar() {
    const theme = useTheme();
    const { colorMode } = useColorMode();
    const primary = colorMode === "light" ? theme.colors.primary.light : theme.colors.primary.dark;
    const secondary = colorMode === "light" ? theme.colors.secondary.light : theme.colors.secondary.dark;
    const textPrimary = colorMode === "light" ? theme.colors.textPrimary.light : theme.colors.textPrimary.dark; 
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [userInfo, setUserInfo] = useState(null);

    const handleEasterEgg = () => {
        console.log("Easter Egg clicked!");
    };

    const handleProfileClick = () => {
        onOpen();
        console.log("Profile clicked!");
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

    return (
      <>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', backgroundColor: primary, width: '100%'}}>
            <IconButton
                variant='back'
                aria-label='Back Button'
                icon={<FaCarAlt />}
                onClick={handleEasterEgg}
            />
            <div style={{ textAlign: 'center' }}>
                <div style={{ display: 'grid', gridTemplateRows: 'repeat(3, 1fr)', color: textPrimary, fontWeight: 'bold' }}>
                    <div>YOO</div>
                    <div>MEE</div>
                    <div>CAR</div>
                </div>
            </div>
            <Avatar name={userInfo && userInfo.displayName} size='md' src={userInfo && userInfo.pfp} bg={secondary} onClick={handleProfileClick} style={{ cursor: 'pointer' }}/>
        </div>
        <ProfileDrawer isOpen={isOpen} onOpen={onOpen} onClose={onClose} userInfo={userInfo}/>
      </>
    )
}

export default HomeNavbar;