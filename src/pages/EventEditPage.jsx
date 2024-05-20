import React, { useState, useEffect, useRef } from 'react'
import { 
    useTheme, 
    useColorMode, 
    Button,
    Input,
    useToast,
    VStack,
    Divider,
    Box,
    Spacer,
    Image,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Switch,
} from '@chakra-ui/react'
import EventNavbar from '.././components/Navbar/EventNavbar.jsx'
import { getOrg, getUser, getUsersInfo, updateEvent, getUserRef, getOrgPeople, getEvent } from '.././Firebase'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

function EventEditPage() {
    const { orgId, eventId } = useParams();
    const theme = useTheme();
    const { colorMode } = useColorMode();
    const [org, setOrg] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [eventName, setEventName] = useState('');
    const [eventTime, setEventTime] = useState('');
    const [people, setPeople] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [riders, setRiders] = useState([]);
    const [event, setEvent] = useState('');
    const [changes, setChanges] = useState([]);
    const [eventImage, setEventImage] = useState(null);
    const textPrimary = colorMode === "light" ? theme.colors.textPrimary.light : theme.colors.textPrimary.dark;
    const navigate = useNavigate();
    const toast = useToast();
    const toastShownRef = useRef(false);

    useEffect(() => {
        async function fetchEvent() {
            try {
                const orgDoc = await getOrg(orgId);
                const eventDoc = await getEvent(orgId, eventId);
                const uid = (JSON.parse(localStorage.getItem('currentUser'))).uid;
                const adminPromises = orgDoc.data().Admins.map(ref => getUser(ref));
                const adminDocs = await Promise.all(adminPromises);
                const adminUIDs = adminDocs.map(doc => doc.data().uid);
                const driverPromises = eventDoc.data().Drivers.map(ref => getUser(ref));
                const driverDocs = await Promise.all(driverPromises);
                const driverUIDs = driverDocs.map(doc => doc.data().uid);

                setOrg(orgDoc.data());
                setEvent(eventDoc.data());
                setEventName(eventDoc.data().Name);
                setEventTime(eventDoc.data().Time);
                setEventImage(eventDoc.data().Image);
                setIsAdmin(adminUIDs.includes(uid))
                setDrivers(driverUIDs);

                if (!(adminUIDs.includes(uid)) && !toastShownRef.current) {
                    toastShownRef.current = true;
                    toast({
                        title: "Access Denied",
                        description: "You are not an admin of this organization.",
                        status: "error",
                        duration: null,
                        isClosable: true,
                    });
                    navigate('/home');
                }
            } catch (error) {
                console.error('Error fetching event:', error);
            }
        }
        fetchEvent();
    }, [orgId, eventId, navigate, toast]);

    useEffect(() => {
        async function fetchUsers() {
            if (org.Admins && org.Members) {
                const members = await getUsersInfo(org.Members);
                const admins = await getUsersInfo(org.Admins);
                setPeople(members.concat(admins));
            }
        }
        fetchUsers();
        
    }, [org]);

    const handleDriverToggle = (uid, isChecked) => {
        setChanges(prevChanges => {
            const existingChangeIndex = prevChanges.findIndex(change => change.uid === uid);
            if (existingChangeIndex !== -1) {
                const updatedChanges = [...prevChanges];
                updatedChanges[existingChangeIndex].isDriver = isChecked;
                return updatedChanges;
            }
            return [...prevChanges, { uid, isDriver: isChecked }];
        });
    };

    const handleInputChange = (setter, value, field) => {
        setter(value);
        setChanges(prevChanges => {
            const existingChangeIndex = prevChanges.findIndex(change => change.field === field);
            if (existingChangeIndex !== -1) {
                const updatedChanges = [...prevChanges];
                updatedChanges[existingChangeIndex].value = value;
                return updatedChanges;
            }
            return [...prevChanges, { field, value }];
        });
    };

    const saveChanges = async () => {
        const alphanumericRegex = /^[a-zA-Z0-9]+$/;
        try {
            // check if there are even any changes
            if (changes.length === 0) {
                toast({
                    title: "No changes to be saved.",
                    status: "info",
                    duration: 5000,
                    isClosable: true,
                });
                return;
            }
            
            const eventDoc = await getEvent(orgId, eventId);
            const eventData = eventDoc.data();
            let updatedDrivers = eventData.Drivers || [];
            let updatedRiders = eventData.Riders || [];
            let updatedFields = {};

            changes.forEach(change => {
                if (change.uid) {
                    const driverRef = getUserRef(change.uid);
                    if (change.isDriver) {
                        if (!updatedDrivers.some(driver => driver.id === change.uid)) {
                            updatedDrivers.push(driverRef);
                            updatedRiders = updatedRiders.filter(rider => rider.id !== change.uid);
                        }
                    } else {
                        updatedDrivers = updatedDrivers.filter(driver => driver.id !== change.uid);
                        if (!updatedRiders.some(rider => rider.id === change.uid)) {
                            updatedRiders.push(driverRef);
                        }
                    }
                } else {
                    updatedFields[change.field] = change.value;
                }
            });
    
            await updateEvent(orgId, eventId, {
                ...updatedFields,
                updatedDrivers: updatedDrivers,
                updatedRiders: updatedRiders,
            });

            setChanges([]);

            // Fetch updated riders/drivers/event
            const updatedEventDoc = await getEvent(orgId, eventId);
            const updatedDriverPromises = updatedEventDoc.data().Drivers.map(ref => getUser(ref));
            const updatedDriverDocs = await Promise.all(updatedDriverPromises);
            const updatedDriverUIDs = updatedDriverDocs.map(doc => doc.data().uid);

            setEvent(updatedEventDoc.data());
            setEventName(updatedEventDoc.data().Name);
            setEventTime(updatedEventDoc.data().Time);
            setEventImage(updatedEventDoc.data().Image);
            setDrivers(updatedDriverUIDs);

            toast({
                title: "Changes saved",
                description: "Changes have been saved and updated.",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
        } catch (error) {
            console.error('Error saving changes:', error);
            toast({
                title: "Error",
                description: "There was an error saving the changes.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };
    

    const discardChanges = () => {
        setChanges([]);
        setEventName(event.Name);
        setEventTime(event.Time);
        setEventImage(event.Image);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        handleInputChange(setEventImage, file, 'Image');
    };

    return (
        <>
            <EventNavbar eventName={event.Name} navigateTo={`/${orgId}`}/>
            <Box color={textPrimary} display='flex' flexDirection='row' justifyContent='center' alignItems='center' marginTop='20px' marginBottom='20px'>
                <Spacer/>
                <Image
                    objectFit='cover'
                    maxW='30%'
                    src={event.Image}
                    alt='Event Image'
                    borderRadius='20px'
                    fallbackSrc='/images/serena.png' 
                />
                <Spacer/>
                <VStack maxWidth='50vw'>
                    <Input 
                        placeholder='Event Image' 
						type="file" 
						accept="image/*" 
						size='xs'
						border="0px" 
						onChange={handleImageChange}
                    />
                    <Divider/>
                    <Input 
                        placeholder={event.Name} 
                        isRequired
                        value={eventName}
                        onChange={(e) => handleInputChange(setEventName, e.target.value, 'Name')}
                    />
                    <Divider/>
                    <Input 
                        placeholder={event.Time}
                        type="datetime-local" 
                        isRequired
                        value={eventTime}
                        onChange={(e) => handleInputChange(setEventTime, e.target.value, 'Time')}
                    />
                </VStack>
                <Spacer/>
            </Box>
            
            <Box color={textPrimary} display='flex' flexDirection='row' justifyContent='center' alignItems='center' marginTop='20px' marginBottom='20px'>
                <TableContainer maxH='40vh' overflowY='auto'>
                    <Table variant='MemberDisplay' size='sm'>
                        <Thead>
                            <Tr>
                                <Th>Member</Th>
                                <Th>Driver</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {people.map((person, index) => (
                                <Tr key={index}>
                                    <Td>{person.Name}</Td>
                                    <Td>
                                        <Switch 
                                            isChecked={changes.some(change => change.uid === person.uid) ? changes.find(change => change.uid === person.uid).isDriver : drivers.includes(person.uid)}
                                            onChange={(e) => handleDriverToggle(person.uid, e.target.checked)}
                                            paddingLeft='5px'
                                            paddingRight='20px'
                                        />
                                    </Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </TableContainer>
            </Box>

            <Box display='flex' flexDirection='column' justifyContent='center' alignItems='center'>
                <Box display='flex' flexDirection='row' justifyContent='center' alignItems='center' marginBottom='10px'>
                    <Button variant='saveChanges' onClick={saveChanges} m={2}>Save Changes</Button>
                    <Button variant='discardChanges' onClick={discardChanges} m={2}>Discard Changes</Button>
                </Box>
            </Box>
        </>
    );
}

export default EventEditPage;
