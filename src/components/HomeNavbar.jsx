import React from 'react';
import { useTheme, IconButton } from '@chakra-ui/react'
import { HamburgerIcon } from '@chakra-ui/icons'
import { ReactComponent as ProfileIcon1 } from "../public/profileIcons/profileIcon1.svg";

function HomeNavbar() {
    const theme = useTheme();
    const primary = theme.primary;
    const textPrimary = theme.colors.textPrimary; 

    const handleMenuClick = () => {
        console.log("Menu clicked!");
    };

    const handleProfileClick = () => {
        console.log("Profile clicked!");
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', backgroundColor: primary, width: '100%'}}>
            <IconButton
                variant='menu'
                aria-label='Menu Button'
                icon={<HamburgerIcon />}
                onClick={handleMenuClick}
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
    )
}

export default HomeNavbar;