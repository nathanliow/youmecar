import React, { useState, useEffect } from 'react'
import { 
    useTheme, 
    useColorMode, 
    Button,
    useDisclosure,
} from '@chakra-ui/react'
import OrgNavbar from '.././components/Navbar/OrgNavbar.jsx'
import EventCard from '../components/Card/EventCard.jsx';
import SearchBar from '../components/SearchBar.jsx';
import EventCreateModal from '../components/Modal/EventCreateModal.jsx';
import { getEvents, getOrg, getUser } from '.././Firebase';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function OrgPage() {
    const { orgId } = useParams();
    const theme = useTheme();
    const { colorMode } = useColorMode();
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [org, setOrg] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const navigate = useNavigate();

    const handleManageOrg = () => {
        navigate(`/edit/${orgId}`);
    };

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

    useEffect(() => {
        async function fetchOrg() {
            try {
                const orgDoc = await getOrg(orgId);
                const uid = (JSON.parse(localStorage.getItem('currentUser'))).uid;
                const adminPromises = orgDoc.data().Admins.map(ref => getUser(ref));
                const adminDocs = await Promise.all(adminPromises);
                const adminUIDs = adminDocs.map(doc => doc.data().uid);
                setOrg(orgDoc.data());
                setIsAdmin(adminUIDs.includes(uid))
            } catch (error) {
                console.error('Error fetching org:', error);
            }
        }
        fetchOrg();
    }, []);
  

  return (
    <>
        <OrgNavbar orgName={org.Name} navigateTo={'/home'}/>
        <SearchBar onSearch={setSearchQuery}/>
        <div style={{ maxHeight: isAdmin ? '70vh' : '80vh', overflowY: 'auto', marginTop: '20px', paddingLeft: '20px', scrollbarWidth: 'none'}}>
            {filteredEvents.map((event, index) => (
                event && <EventCard key={index} orgId={orgId} eventId={event.id} eventImage={event.Image} name={event.Name} location={event.Location} time={event.Time} numGoing={event.numGoing} drivers={event.Drivers} riders={event.Riders}/>
            ))}
        </div>
        {isAdmin && 
            <div>
                <div style={{ marginTop: '3vh', display: 'flex', justifyContent: 'space-evenly' }}>
                    <Button variant="normal" onClick={handleManageOrg}>Manage Org</Button>
                    <Button variant="normal" onClick={onOpen}>Create Event</Button>
                </div>
                <EventCreateModal isOpen={isOpen} onOpen={onOpen} onClose={onClose} orgId={orgId} setEvents={setEvents} />
             </div>
        }
    </>
  );
}

export default OrgPage;
