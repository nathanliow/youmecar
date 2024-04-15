import React from 'react';
import './App.css';
import LocationDropdown from './components/LocationDropdown';
import EventCard from './components/Card/EventCard';


function App() {
  return (
    <div className="App">
        <header className="App-header">
            <div className="container">
                <LocationDropdown name='PCL/Jester'/>
                <LocationDropdown name='Quarters Nueces'/>
                <EventCard name="Church" location="NW Fellowship" time="2:00 PM" numGoing="50"/>
            </div>
        </header>
    </div>
  );
}

export default App;
