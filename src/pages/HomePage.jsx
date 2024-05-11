import React from 'react'
import { useTheme } from '@chakra-ui/react'
import HomeNavbar from '.././components/Navbar/HomeNavbar.jsx'
import OrgCard from '../components/Card/OrgCard.jsx';

function HomePage() {
  const theme = useTheme();
  const textPrimary = theme.colors.textPrimary; 

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <HomeNavbar/>
        <div style={{ maxHeight:'80vh', alignItems: 'center', overflowY: 'scroll'}}>
            <OrgCard name="Acts College Fellowship" numMembers="473"/>
            <OrgCard name="Acts College Fellowship" numMembers="473"/>
            <OrgCard name="Acts College Fellowship" numMembers="473"/>
            <OrgCard name="Acts College Fellowship" numMembers="473"/>
            <OrgCard name="Acts College Fellowship" numMembers="473"/>
            <OrgCard name="Acts College Fellowship" numMembers="473"/>
            <OrgCard name="Acts College Fellowship" numMembers="473"/>
            <OrgCard name="Acts College Fellowship" numMembers="473"/>
            <OrgCard name="Acts College Fellowship" numMembers="473"/>
        </div>
    </div>
  );
}

export default HomePage;
