import React, { useState, useEffect } from 'react'
import { 
    useTheme, 
    useColorMode, 
    Button,
    useDisclosure,
} from '@chakra-ui/react'
import EventNavbar from '.././components/Navbar/EventNavbar.jsx'
import OrgCard from '../components/Card/OrgCard.jsx';
import SearchBar from '../components/SearchBar.jsx';
import OrgJoinModal from '../components/Modal/OrgJoinModal.jsx';
import OrgCreateModal from '../components/Modal/OrgCreateModal.jsx';
import { getActiveOrgs } from '.././Firebase';

function EventPage() {
    const theme = useTheme();
    const { colorMode } = useColorMode();
    const [activeOrgs, setActiveOrgs] = useState([]);
    const [filteredOrgs, setFilteredOrgs] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    const { isOpen: isJoinModalOpen, onOpen: onJoinModalOpen, onClose: onJoinModalClose } = useDisclosure();
    const { isOpen: isCreateModalOpen, onOpen: onCreateModalOpen, onClose: onCreateModalClose } = useDisclosure();

    useEffect(() => {
        async function fetchActiveOrgs() {
        try {
            const orgDocs = await getActiveOrgs();

            setActiveOrgs(orgDocs.map(doc => doc.data()));
        } catch (error) {
            console.error('Error fetching active organizations:', error);
        }
        }
        fetchActiveOrgs();
    }, []);
  

    useEffect(() => {
        setFilteredOrgs(activeOrgs.filter(org => org.Name.toLowerCase().includes(searchQuery.toLowerCase())));
    }, [activeOrgs, searchQuery]);
  

  return (
    <>
        <EventNavbar/>
        <SearchBar onSearch={setSearchQuery}/>
        <div style={{ maxHeight: '70vh', overflowY: 'auto', marginTop: '20px', paddingLeft: '20px', scrollbarWidth: 'none'}}>
            {filteredOrgs.map((org, index) => (
                org && <OrgCard key={index} orgId={org.id} orgImage={org.Image} name={org.Name} numMembers={org.numMembers} admins={org.Admins} members={org.Members} />
            ))}
        </div>
        <div style={{ marginTop: '3vh', display: 'flex', justifyContent: 'space-evenly' }}>
            <Button variant="normal" onClick={onCreateModalOpen}>Create Organization</Button>
            <Button variant="normal" onClick={onJoinModalOpen}>Join Organization</Button>
        </div>
        <OrgCreateModal isOpen={isCreateModalOpen} onOpen={onCreateModalOpen} onClose={onCreateModalClose} setActiveOrgs={setActiveOrgs} />
        <OrgJoinModal isOpen={isJoinModalOpen} onOpen={onJoinModalOpen} onClose={onJoinModalClose} setActiveOrgs={setActiveOrgs} />
    </>
  );
}

export default EventPage;
