import React, { useState, useEffect } from 'react';
import { 
  useTheme,
  Drawer, 
  DrawerHeader,
  DrawerBody, 
  DrawerFooter, 
  DrawerOverlay,
  DrawerContent, 
  DrawerCloseButton, 
  IconButton,
  Spacer,
  useColorMode,
  Avatar,
} from '@chakra-ui/react'
import { ReactComponent as ProfileIcon1 } from "../../public/profileIcons/profileIcon1.svg";
import { IoMdPerson, IoMdSettings, IoMdMoon, IoIosLogOut } from "react-icons/io";
import { handleSignOut } from '../../Firebase';

function ProfileDrawer({ isOpen, onClose, userInfo }) {
    const { colorMode, toggleColorMode } = useColorMode()
    const theme = useTheme();
    const secondary = colorMode === "light" ? theme.colors.secondary.light : theme.colors.secondary.dark;
    const overlayColor = colorMode === "light" ? theme.colors.overlay.light : theme.colors.overlay.dark;

    const handleProfileClick = () => {
        console.log("Profile Page clicked!");
    };

    const handleSettingsClick = () => {
        console.log("Settings clicked!");
    };

  return (
    <Drawer variant='Profile' isOpen={isOpen} placement='right' onClose={onClose}>
      <DrawerOverlay 
        bg={overlayColor}
      />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader></DrawerHeader>
        <DrawerBody display="flex" flexDirection="column" alignItems="center">
          <div style={{ marginTop: '30px' }}> 
            <Avatar name={userInfo && userInfo.displayName} size='xl' src={userInfo && userInfo.pfp} bg={secondary} />
          </div>
          <div style={{ marginTop: '10px', fontSize: '24px' }}> 
          {userInfo && userInfo.displayName}
          </div>
          <div style={{ fontSize: '16px' }}> 
            {userInfo && userInfo.email}
          </div>
          <div style={{ fontSize: '16px' }}> 
            <span style={{ fontWeight: 'bold' }}>{userInfo && userInfo.numFriends}</span> Friends
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', marginTop: '30px', fontSize: '20px', alignSelf: 'flex-start', marginLeft: '10px' }}>
            <button onClick={handleProfileClick} style={{ display: 'flex', alignItems: 'center' }}>
              <IoMdPerson style={{ marginRight: '20px' }} />
              Profile
            </button>
            <button onClick={handleSettingsClick} style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
              <IoMdSettings style={{ marginRight: '20px' }} />
              Settings
            </button>
          </div>
        </DrawerBody>

        <DrawerFooter justifyContent='left'>
          <IconButton
            variant='darkMode'
            aria-label='Toggle Dark Mode'
            icon={<IoMdMoon />}
            onClick={toggleColorMode}
          />
          <Spacer/>
          <IconButton
            variant='logOut'
            aria-label='Log Out'
            icon={<IoIosLogOut />}
            onClick={handleSignOut}
          />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default ProfileDrawer;
