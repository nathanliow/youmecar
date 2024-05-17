import React, { useState, useEffect } from 'react'
import { 
    useTheme, 
    useColorMode, 
    Button,
    useDisclosure,
} from '@chakra-ui/react'
import EventNavbar from '.././components/Navbar/EventNavbar.jsx'
import RideCard from '../components/Card/RideCard.jsx';
import SearchBar from '../components/SearchBar.jsx';
import { getRides } from '.././Firebase';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function EventPage() {
    const { orgId, eventId } = useParams();
    const theme = useTheme();
    const { colorMode } = useColorMode();
    const [rides, setRides] = useState([]);
    const [filteredRides, setFilteredRides] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const handleManageEvent = () => {
        navigate(`/edit/${orgId}/${eventId}`);
    };

    useEffect(() => {
        async function fetchRides() {
        try {
            const orgEventsRides = await getRides(orgId, eventId);

            setRides(orgEventsRides);
        } catch (error) {
            console.error('Error fetching rides', error);
        }
        }
        fetchRides();
    }, [orgId]);
  

    useEffect(() => {
        if (rides && rides.length > 0) {
            setFilteredRides(rides.filter(ride => ride.Name.toLowerCase().includes(searchQuery.toLowerCase())));
        }
    }, [rides, searchQuery]);
  

  return (
    <>
        <EventNavbar orgId={orgId} eventId={eventId}/>
        <SearchBar onSearch={setSearchQuery}/>
        <div style={{ maxHeight: '70vh', overflowY: 'auto', marginTop: '20px', paddingLeft: '20px', scrollbarWidth: 'none'}}>
            {/* {filteredRides.map((ride, index) => (
                ride && <RideCard key={index} driver={ride.Driver} time={ride.Time} numRiders={ride.numRiders} maxRiders={ride.maxRiders} riders={ride.Riders}/>
            ))} */}
            <RideCard driver="joe" time="2:00 PM" numRiders="4" maxRiders="5" riders={['ABC', 'DEF', 'GEE', 'EFE']}/>
        </div>
        <div style={{ marginTop: '3vh', display: 'flex', justifyContent: 'space-evenly' }}>
            <Button variant="normal" onClick={handleManageEvent}>Manage Event</Button>
        </div>
    </>
  );
}

export default EventPage;
