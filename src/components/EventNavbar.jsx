import React from 'react';
import { useTheme, IconButton } from '@chakra-ui/react'
import { ChevronLeftIcon } from '@chakra-ui/icons'
import { ReactComponent as ProfileIcon1 } from "../public/profileIcons/profileIcon1.svg";

function EventNavbar() {
    const theme = useTheme();
    const primary = theme.primary;
    const textPrimary = theme.colors.textPrimary; 

    const handleBackClick = () => {
        console.log("Back clicked!");
    };

    const handleProfileClick = () => {
        console.log("Profile clicked!");
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', backgroundColor: primary, width: '100%'}}>
            <IconButton
                variant='back'
                aria-label='Back Button'
                icon={<ChevronLeftIcon />}
                onClick={handleBackClick}
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

export default EventNavbar;