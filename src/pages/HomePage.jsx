import React from 'react'
import { useTheme, useColorMode } from '@chakra-ui/react'
import HomeNavbar from '.././components/Navbar/HomeNavbar.jsx'
import OrgCard from '../components/Card/OrgCard.jsx';
import SearchBar from '../components/SearchBar.jsx';

function HomePage() {
  const theme = useTheme();
  const { colorMode } = useColorMode();
  const textPrimary = colorMode === "light" ? theme.colors.textPrimary.light : theme.colors.textPrimary.dark;

  return (
    <div>
        <HomeNavbar/>
        <SearchBar/>
        <div style={{ maxHeight: '80vh', overflowY: 'auto', marginTop: '20px', paddingLeft: '20px', scrollbarWidth: 'none'}}>
                <OrgCard name="Acts College Fellowship" numMembers="473"/>
                <OrgCard name="Acts College Fellowship" numMembers="473"/>
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
