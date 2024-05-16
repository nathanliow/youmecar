import React, { useState, useEffect } from 'react'
import { 
    useTheme, 
    useColorMode, 
    Button,
    useDisclosure,
} from '@chakra-ui/react'
import EventNavbar from '.././components/Navbar/EventNavbar.jsx'
import EventCard from '../components/Card/EventCard.jsx';
import SearchBar from '../components/SearchBar.jsx';
import EventCreateModal from '../components/Modal/EventCreateModal.jsx';
import { getEvents } from '.././Firebase';
import { useParams } from 'react-router-dom';

function OrgPage() {
    const { orgId } = useParams();
    const theme = useTheme();
    const { colorMode } = useColorMode();
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    const { isOpen, onOpen, onClose } = useDisclosure();

    useEffect(() => {
        async function fetchEvents() {
        try {
            const orgEvents = await getEvents(orgId);

            setEvents(orgEvents);
        } catch (error) {
            console.error('Error fetching events', error);
        }
        }
        fetchEvents();
    }, [orgId]);
  

    useEffect(() => {
        if (events && events.length > 0) {
            setFilteredEvents(events.filter(event => event.Name.toLowerCase().includes(searchQuery.toLowerCase())));
        }
    }, [events, searchQuery]);
  

  return (
    <>
        <EventNavbar/>
        <SearchBar onSearch={setSearchQuery}/>
        <div style={{ maxHeight: '70vh', overflowY: 'auto', marginTop: '20px', paddingLeft: '20px', scrollbarWidth: 'none'}}>
            {filteredEvents.map((event, index) => (
                event && <EventCard key={index} orgId={orgId} eventId={event.id} eventImage={event.Image} name={event.Name} location={event.Location} time={event.Time} numGoing={event.numGoing} going={event.going}/>
            ))}
        </div>
        <div style={{ marginTop: '3vh', display: 'flex', justifyContent: 'space-evenly' }}>
            <Button variant="normal" onClick={onOpen}>Create Event</Button>
        </div>
        <EventCreateModal isOpen={isOpen} onOpen={onOpen} onClose={onClose} orgId={orgId} setEvents={setEvents} />
    </>
  );
}

export default OrgPage;
