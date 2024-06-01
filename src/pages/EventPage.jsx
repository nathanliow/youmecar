import React, { useState, useEffect } from 'react'
import { 
    Button,
} from '@chakra-ui/react'
import EventNavbar from '.././components/Navbar/EventNavbar.jsx'
import SearchBar from '../components/SearchBar.jsx';
import LocationDropdown from '../components/LocationDropdown.jsx';
import { getLocations, getUser, getOrg, getEvent } from '.././Firebase';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function EventPage() {
    const { orgId, eventId } = useParams();
    const [isAdmin, setIsAdmin] = useState(false);
    const [event, setEvent] = useState('');
    const [locations, setLocations] = useState([]);
    const [filteredLocations, setFilteredLocations] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const handleManageEvent = () => {
        navigate(`/edit/${orgId}/${eventId}`);
    };

    useEffect(() => {
        async function fetchAdmin() {
            try {
                const orgDoc = await getOrg(orgId);
                const uid = (JSON.parse(localStorage.getItem('currentUser'))).uid;
                const adminPromises = orgDoc.data().Admins.map(ref => getUser(ref));
                const adminDocs = await Promise.all(adminPromises);
                const adminUIDs = adminDocs.map(doc => doc.data().uid);
                setIsAdmin(adminUIDs.includes(uid))
            } catch (error) {
                console.error('Error fetching org:', error);
            }
        }
        fetchAdmin();
    }, [orgId]);

    useEffect(() => {
        async function fetchEventandLocations() {
            try {
                const eventLocations = await getLocations(orgId, eventId);
                const event = await getEvent(orgId, eventId);

                setLocations(eventLocations);
                setEvent(event.data());
            } catch (error) {
                console.error('Error fetching locations:', error);
            }
        }
        fetchEventandLocations();
    }, [orgId, eventId]);

    useEffect(() => {
        if (locations && locations.length > 0) {
            setFilteredLocations(locations.filter(location => location.Name.toLowerCase().includes(searchQuery.toLowerCase())));
        }
    }, [locations, searchQuery]);
  

  return (
    <>
        <EventNavbar eventName={event.Name} navigateTo={`/${orgId}`}/>
        <SearchBar onSearch={setSearchQuery}/>
        <div style={{ maxHeight: isAdmin ? '70vh' : '80vh', overflowY: 'auto', marginTop: '20px', paddingLeft: '20px', scrollbarWidth: 'none'}}>
            {filteredLocations.map((location, index) => (
                <LocationDropdown 
                    key={index}
                    name={location.Name}
                    rides={location.Rides}
                    orgId={orgId}
                    eventId={eventId}
                    pickupLocationId={location.id}
                />
            ))}
        </div>
        {isAdmin && 
            <div style={{ marginTop: '3vh', display: 'flex', justifyContent: 'space-evenly' }}>
                <Button variant="normal" onClick={handleManageEvent}>Manage Event</Button>
            </div>
        }
    </>
  );
}

export default EventPage;
