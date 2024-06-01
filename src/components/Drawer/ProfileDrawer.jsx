import React from 'react';
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
import { IoMdPerson, IoMdSettings, IoMdMoon, IoIosLogOut } from "react-icons/io";
import { handleSignOut } from '../../Firebase';
import { useNavigate } from 'react-router-dom';

function ProfileDrawer({ isOpen, onClose, userInfo }) {
    const { colorMode, toggleColorMode } = useColorMode()
    const theme = useTheme();
    const secondary = colorMode === "light" ? theme.colors.secondary.light : theme.colors.secondary.dark;
    const overlayColor = colorMode === "light" ? theme.colors.overlay.light : theme.colors.overlay.dark;
    const navigate = useNavigate();

    const handleProfileClick = () => {
        navigate('/profile')
    };

    // const handleSettingsClick = () => {
    //     console.log("Settings clicked!");
    // };

    const handleSignOutAndNavigate = () => {
      handleSignOut(); // Call handleSignOut function
      navigate('/'); // Navigate to the login page
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
            <Avatar name={userInfo && userInfo.Name} size='xl' src={userInfo && userInfo.Pfp} bg={secondary} />
          </div>
          <div style={{ marginTop: '10px', fontSize: '24px' }}> 
          {userInfo && userInfo.Name}
          </div>
          <div style={{ fontSize: '16px' }}> 
            {userInfo && userInfo.Email}
          </div>
          <div style={{ fontSize: '16px' }}> 
            <span style={{ fontWeight: 'bold' }}>{userInfo && userInfo.Friends.length}</span> Friends
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', marginTop: '30px', fontSize: '20px', alignSelf: 'flex-start', marginLeft: '10px' }}>
            <button onClick={handleProfileClick} style={{ display: 'flex', alignItems: 'center' }}>
              <IoMdPerson style={{ marginRight: '20px' }} />
              Profile
            </button>
            {/* <button onClick={handleSettingsClick} style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
              <IoMdSettings style={{ marginRight: '20px' }} />
              Settings
            </button> */}
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
            onClick={handleSignOutAndNavigate}
          />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default ProfileDrawer;
