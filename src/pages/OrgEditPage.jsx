import React, { useState, useEffect, useRef } from 'react'
import { 
    useTheme, 
    useColorMode, 
    Button,
    useDisclosure,
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
    IconButton
} from '@chakra-ui/react'
import { CiCircleRemove } from "react-icons/ci"
import OrgNavbar from '.././components/Navbar/OrgNavbar.jsx'
import { getOrg, getUser, getUsersInfo, updateOrg, getUserRef, getOrgPeople, checkIfOrgExists } from '.././Firebase'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import RemoveUserAlert from '../components/RemoveUserAlert.jsx'
import OrgAddMemberModal from '../components/Modal/OrgAddMemberModal'

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
    const [orgImage, setOrgImage] = useState(null);
    const [removeUser, setRemoveUser] = useState({ uid: null, name: '' });
    const textPrimary = colorMode === "light" ? theme.colors.textPrimary.light : theme.colors.textPrimary.dark;
    const navigate = useNavigate();
    const toast = useToast();
    const toastShownRef = useRef(false);
    const { isOpen: isRemoveUserOpen, onOpen: onRemoveUserOpen, onClose: onRemoveUserClose } = useDisclosure();
    const { isOpen: isAddMemberOpen, onOpen: onAddMemberOpen, onClose: onAddMemberClose } = useDisclosure();

    useEffect(() => {
        async function fetchOrg() {
        try {
            const orgDoc = await getOrg(orgId);
            const uid = (JSON.parse(localStorage.getItem('currentUser'))).uid;
            const adminPromises = orgDoc.data().Admins.map(ref => getUser(ref));
            const adminDocs = await Promise.all(adminPromises);
            const adminUIDs = adminDocs.map(doc => doc.data().uid);
            setOrg(orgDoc.data());
            setOrgName(orgDoc.data().Name);
            setOrgCode(orgDoc.data().Code);
            setOrgImage(orgDoc.data().Image);
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

            // check if orgCode isn't 6 in length
            if (orgCode.length !== 6 || !orgCode.match(alphanumericRegex)) {
                setIsCodeInvalid(true);
                toast({
                    title: "Error",
                    description: `The code '${orgCode}' is invalid.`,
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
                return;
            }

            // check if an org already has the changed code
            const querySnapshotCode = await checkIfOrgExists(orgCode);
            const orgExists = (!querySnapshotCode.empty);
            if (orgExists) {
                setIsCodeInvalid(true);
                toast({
                    title: "Error",
                    description: `There is already an organization with code '${orgCode}'.`,
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
                return;
            }
            
            const orgDoc = await getOrg(orgId);
            const orgData = orgDoc.data();
            let updatedAdmins = orgData.Admins || [];
            let updatedMembers = orgData.Members || [];
            let updatedFields = {};

            changes.forEach(change => {
                if (change.uid) {
                    const adminRef = getUserRef(change.uid);
                    if (change.isAdmin) {
                        if (!updatedAdmins.some(admin => admin.id === change.uid)) {
                            updatedAdmins.push(adminRef);
                            updatedMembers = updatedMembers.filter(member => member.id !== change.uid);
                        }
                    } else {
                        updatedAdmins = updatedAdmins.filter(admin => admin.id !== change.uid);
                        if (!updatedMembers.some(member => member.id === change.uid)) {
                            updatedMembers.push(adminRef);
                        }
                    }
                } else {
                    updatedFields[change.field] = change.value;
                }
            });
    
            await updateOrg(orgId, {
                ...updatedFields,
                updatedAdmins: updatedAdmins,
                updatedMembers: updatedMembers,
            });

            setAdminList(updatedAdmins.map(admin => admin.id));
            setChanges([]);

            // Fetch updated users and update the people state
            const uid = (JSON.parse(localStorage.getItem('currentUser'))).uid;
            const people = await getOrgPeople(orgId);
            const updatedOrgDoc = await getOrg(orgId);
            const updatedAdminPromises = updatedOrgDoc.data().Admins.map(ref => getUser(ref));
            const updatedAdminDocs = await Promise.all(updatedAdminPromises);
            const updatedAdminUIDs = updatedAdminDocs.map(doc => doc.data().uid);

            setOrg(updatedOrgDoc.data());
            setOrgName(updatedOrgDoc.data().Name);
            setOrgCode(updatedOrgDoc.data().Code);
            setOrgImage(updatedOrgDoc.data().Image);
            setIsAdmin(updatedAdminUIDs.includes(uid))
            setPeople(people);
            setIsCodeInvalid(false);

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
        setOrgName(org.Name);
        setOrgCode(org.Code);
        setOrgImage(org.Image);
        setIsCodeInvalid(false);
    };
    
    const handleRemovePerson = (uid, name) => {
        onRemoveUserOpen();
        setRemoveUser({ uid, name });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        handleInputChange(setOrgImage, file, 'Image');
    };

    return (
        <>
            <OrgNavbar orgName={org.Name} navigateTo={`/${orgId}`}/>
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
                <VStack maxWidth='50vw'>
                    <Input 
                        placeholder='Organization Image' 
						type="file" 
						accept="image/*" 
						size='xs'
						border="0px" 
						onChange={handleImageChange}
                    />
                    <Divider/>
                    <Input 
                        placeholder={org.Name} 
                        isRequired
                        value={orgName}
                        onChange={(e) => handleInputChange(setOrgName, e.target.value, 'Name')}
                    />
                    <Divider/>
                    <Input 
                        isInvalid={isCodeInvalid} 
                        placeholder={org.Code}
                        isRequired
                        value={orgCode}
                        onChange={(e) => handleInputChange(setOrgCode, e.target.value, 'Code')}
                    />
                    <Divider/>
                </VStack>
                <Spacer/>
            </Box>
            
            <Box color={textPrimary} display='flex' flexDirection='row' justifyContent='center' alignItems='center' marginTop='20px' marginBottom='20px'>
                <TableContainer maxH='40vh' overflowY='auto'>
                    <Table variant='MemberDisplay' size='sm'>
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
                                            paddingLeft='5px'
                                            paddingRight='20px'
                                        />
                                        <IconButton
                                            variant='back'
                                            aria-label='Back Button'
                                            icon={<CiCircleRemove/>}
                                            onClick={() => handleRemovePerson(person.uid, person.Name)}
                                        />
                                    </Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </TableContainer>
            </Box>

            
            <Box display='flex' flexDirection='column' justifyContent='center' alignItems='center'>
                <Box display='flex' justifyContent='center' alignItems='center' marginBottom='10px'>
                    <Button variant='normal' onClick={onAddMemberOpen}> Add Member </Button>
                </Box>
                <Box display='flex' flexDirection='row' justifyContent='center' alignItems='center' marginBottom='10px'>
                    <Button variant='saveChanges' onClick={saveChanges} m={2}>Save Changes</Button>
                    <Button variant='discardChanges' onClick={discardChanges} m={2}>Discard Changes</Button>
                </Box>
                
            </Box>
            <RemoveUserAlert isOpen={isRemoveUserOpen} onOpen={onRemoveUserOpen} onClose={onRemoveUserClose} name={removeUser.name} orgId={orgId} uid={removeUser.uid} setPeople={setPeople}/>
            <OrgAddMemberModal isOpen={isAddMemberOpen} onOpen={onAddMemberOpen} onClose={onAddMemberClose} orgId={orgId} setPeople={setPeople}/>
        </>
    );
}

export default OrgEditPage;
