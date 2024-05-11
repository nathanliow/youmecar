import React from 'react';
import { useTheme, IconButton, useDisclosure } from '@chakra-ui/react'
import { FaCarAlt } from "react-icons/fa";
import { ReactComponent as ProfileIcon1 } from "../../public/profileIcons/profileIcon1.svg";
import ProfileDrawer from '../Drawer/ProfileDrawer';

function HomeNavbar() {
    const theme = useTheme();
    const primary = theme.primary;
    const textPrimary = theme.colors.textPrimary; 
    const { isOpen, onOpen, onClose } = useDisclosure();

    const handleEasterEgg = () => {
        console.log("Easter Egg clicked!");
    };

    const handleProfileClick = () => {
        onOpen();
        console.log("Profile clicked!");
    };

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
            <button onClick={handleProfileClick} style={{ border: 'none', backgroundColor: 'transparent', marginRight: '10px' }}>
                <ProfileIcon1 onClick={handleProfileClick} width="40px" height="40px" style={{ fill: 'white' }} />
            </button>
        </div>
        <ProfileDrawer isOpen={isOpen} onOpen={onOpen} onClose={onClose} />
      </>
    )
}

export default HomeNavbar;