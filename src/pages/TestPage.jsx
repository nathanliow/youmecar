import React from 'react';
import { useTheme } from '@chakra-ui/react';
import EventCard from '.././components/Card/EventCard.jsx';
import EventNavbar from '../components/Navbar/EventNavbar.jsx';
import RideCard from '../components/Card/RideCard.jsx';
import OrgCard from '../components/Card/OrgCard.jsx';
import SearchBar from '../components/SearchBar.jsx';

function TestPage() {
  const theme = useTheme();
  const textPrimary = theme.colors.textPrimary; 

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <EventNavbar/>
      <SearchBar/>
      <OrgCard name="Acts College Fellowship" numMembers="473"/>
      <EventCard name="Church" location="NW Fellowship" time="2:00 PM" numGoing="53"/>
      <RideCard driver="John Ahn" time="1:45 PM" numRiders="4" maxRiders="5" riders={["Nathan Liow", "Serena Oh", "Baek Hyunwoo", "Hae in"]}/>
    </div>
  );
}

export default TestPage;
