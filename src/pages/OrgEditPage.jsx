import React, { useState, useEffect, useRef } from 'react'
import { 
    useTheme, 
    useColorMode, 
    Button,
    useDisclosure,
    Input,
    useToast,
    VStack,
    Text,
    Divider,
    Box,
    Spacer,
    Image,
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
    Switch,
} from '@chakra-ui/react'
import OrgNavbar from '.././components/Navbar/OrgNavbar.jsx'
import { getOrg, getUser, getUsersInfo, updateOrgAdmins, getUserRef } from '.././Firebase';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import RemoveUserAlert from '../components/RemoveUserAlert.jsx';

function OrgEditPage() {
    const { orgId } = useParams();
    const theme = useTheme();
    const { colorMode } = useColorMode();
    const [org, setOrg] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [isNameInvalid, setIsNameInvalid] = useState(false);
    const [isCodeInvalid, setIsCodeInvalid] = useState(false);
    const [orgName, setOrgName] = useState('');
    const [orgCode, setOrgCode] = useState('');
    const [people, setPeople] = useState([]);
    const [adminList, setAdminList] = useState([]);
    const [changes, setChanges] = useState([]);
    const [removeUser, setRemoveUser] = useState({ uid: null, name: '' });
    const textPrimary = colorMode === "light" ? theme.colors.textPrimary.light : theme.colors.textPrimary.dark;
    const navigate = useNavigate();
    const toast = useToast();
    const toastShownRef = useRef(false);
    const { isOpen, onOpen, onClose } = useDisclosure()

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
            console.error('Error fetching org:', error);
        }
        }
        fetchOrg();
    }, [orgId, navigate, toast]);

    useEffect(() => {
        async function fetchUsers() {
            if (org.Admins && org.Members) {
                const members = await getUsersInfo(org.Members);
                const admins = await getUsersInfo(org.Admins);
                setPeople(members.concat(admins));
                setAdminList(admins.map(admin => admin.uid));
            }
        }
        fetchUsers();
        
    }, [org]);

    const handleAdminToggle = (uid, isChecked) => {
        setChanges(prevChanges => {
            const existingChangeIndex = prevChanges.findIndex(change => change.uid === uid);
            if (existingChangeIndex !== -1) {
                const updatedChanges = [...prevChanges];
                updatedChanges[existingChangeIndex].isAdmin = isChecked;
                return updatedChanges;
            }
            return [...prevChanges, { uid, isAdmin: isChecked }];
        });
    };

    const saveChanges = async () => {
        try {
            const orgDoc = await getOrg(orgId);
            const orgData = orgDoc.data();
            let updatedAdmins = orgData.Admins || [];
            let updatedMembers = orgData.Members || [];
    
            changes.forEach(change => {
                const adminRef = getUserRef(change.uid);
                if (change.isAdmin) {
                    if (!updatedAdmins.some(admin => admin.id === change.uid)) {
                        updatedAdmins.push(adminRef);
                        // Remove from members if present
                        updatedMembers = updatedMembers.filter(member => member.id !== change.uid);
                    }
                } else {
                    updatedAdmins = updatedAdmins.filter(admin => admin.id !== change.uid);
                    // Add back to members if not present
                    if (!updatedMembers.some(member => member.id === change.uid)) {
                        updatedMembers.push(adminRef);
                    }
                }
            });
    
            await updateOrgAdmins(orgId, updatedAdmins, updatedMembers);
    
            setAdminList(updatedAdmins.map(admin => admin.id));
            setChanges([]);
            toast({
                title: "Changes saved",
                description: "Admin statuses have been updated.",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            console.error('Error saving changes:', error);
            toast({
                title: "Error",
                description: "There was an error saving the changes.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };
    

    const discardChanges = () => {
        setChanges([]);
    };
    
    const handleRemovePerson = (uid, name) => {
        onOpen();
        setRemoveUser({ uid, name });
    };

    return (
        <>
            <OrgNavbar orgName={org.Name}/>
            <Box color={textPrimary} display='flex' flexDirection='row' justifyContent='center' alignItems='center' marginTop='20px' marginBottom='20px'>
                <Spacer/>
                <Image
                    objectFit='cover'
                    maxW='30%'
                    src={org.Image}
                    alt='Org Image'
                    borderRadius='20px'
                    fallbackSrc='/images/serena.png' 
                />
                <Spacer/>
                <VStack>
                    <Input 
                        isInvalid={isNameInvalid} 
                        placeholder={org.Name} 
                        isRequired
                        value={orgName}
                        onChange={(e) => setOrgName(e.target.value)}
                    />
                    <Divider/>
                    <Input 
                        isInvalid={isCodeInvalid} 
                        placeholder={org.Code}
                        isRequired
                        value={orgCode}
                        onChange={(e) => setOrgCode(e.target.value)}
                    />
                    <Divider/>
                </VStack>
                <Spacer/>
            </Box>
            
            <Box color={textPrimary} display='flex' flexDirection='row' justifyContent='center' alignItems='center' marginTop='20px' marginBottom='20px'>
                <TableContainer maxH='24vh' overflowY='auto'>
                    <Table size='sm'>
                        <Thead>
                            <Tr>
                                <Th>Member</Th>
                                <Th>Admin</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {people.map((person, index) => (
                                <Tr key={index}>
                                    <Td>{person.Name}</Td>
                                    <Td>
                                        <Switch 
                                            isChecked={changes.some(change => change.uid === person.uid) ? changes.find(change => change.uid === person.uid).isAdmin : adminList.includes(person.uid)}
                                            onChange={(e) => handleAdminToggle(person.uid, e.target.checked)}
                                        />
                                        <Button colorScheme="red" size="sm" onClick={() => handleRemovePerson(person.uid, person.Name)}>
                                            Remove
                                        </Button>
                                    </Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </TableContainer>
            </Box>
            <Box display='flex' justifyContent='center' alignItems='center' marginTop='20px'>
                <Button colorScheme="blue" onClick={saveChanges} m={2}>Save Changes</Button>
                <Button colorScheme="red" onClick={discardChanges} m={2}>Discard Changes</Button>
            </Box>
            <RemoveUserAlert isOpen={isOpen} onOpen={onOpen} onClose={onClose} name={removeUser.name} orgId={orgId} uid={removeUser.uid} />
        </>
    );
}

export default OrgEditPage;
