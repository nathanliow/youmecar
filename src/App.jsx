import React from 'react';
import './App.css';
import { useTheme } from '@chakra-ui/react'; 
import LocationDropdown from './components/LocationDropdown';
import EventCard from './components/Card/EventCard';
import HomeNavbar from './components/Navbar/HomeNavbar';
import EventNavbar from './components/Navbar/EventNavbar';
import { Pages } from './Routes';

function App() {
  const theme = useTheme(); 
  const primaryColor = theme.colors.primary;

  return (
    <div className="App">
        <header className="App-header" style={{ background: primaryColor }}>
            <div className="container">
                <Pages/>
                {/* <EventNavbar />
                <LocationDropdown name='PCL/Jester'/>
                <LocationDropdown name='Quarters Nueces'/>
                <EventCard name="Church" location="NW Fellowship" time="2:00 PM" numGoing="50"/> */}

            </div>
        </header>
    </div>
  );
}

export default App;
