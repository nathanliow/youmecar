import React, { useState, useEffect, useRef } from 'react';
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
  IconButton,
  useDisclosure,
} from '@chakra-ui/react';
import { CiCircleRemove } from "react-icons/ci"
import OrgNavbar from '../components/Navbar/OrgNavbar.jsx';
import { getUser, getUserRef, updateUser, getActiveOrgs } from '../Firebase'; 
import RemoveOrgAlert from '../components/RemoveOrgAlert.jsx'
import PickCarModal from '../components/Modal/PickCarModal.jsx'

function ProfilePage() {
    const theme = useTheme();
    const { colorMode } = useColorMode();
    const [userName, setUserName] = useState('');
    const [userImage, setUserImage] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [user, setUser] = useState(null);
    const [isNameInvalid, setIsNameInvalid] = useState(false);
    const [isCarCapInvalid, setIsCarCapInvalid] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [activeOrgs, setActiveOrgs] = useState([]);
    const [car, setCar] = useState([]);
    const [removeOrg, setRemoveOrg] = useState({ orgId: '', orgName: '' });
    const { isOpen: isPickCarOpen, onOpen: onPickCarOpen, onClose: onPickCarClose } = useDisclosure();
    const { isOpen: isRemoveOrgOpen, onOpen: onRemoveOrgOpen, onClose: onRemoveOrgClose } = useDisclosure();
    const hasFetchedUser = useRef(false);
    const hasFetchedOrgs = useRef(false);

    const textPrimary = colorMode === 'light' ? theme.colors.textPrimary.light : theme.colors.textPrimary.dark;
    const toast = useToast();

    useEffect(() => {
        async function fetchUser() {
            if (!hasFetchedUser.current) {
                try {
                    const uid = JSON.parse(localStorage.getItem('currentUser')).uid;
                    const userRef = await getUserRef(uid);
                    const userDoc = await getUser(userRef);
                    
                    setUser(userDoc.data());
                    setUserName(userDoc.data().Name);
                    setUserImage(userDoc.data().Pfp);
                    setActiveOrgs(userDoc.data().ActiveOrgs);
                    setCar(userDoc.data().Car);
                    hasFetchedUser.current = true;
                } catch (error) {
                    console.error('Error fetching user:', error);
                }
            }
        }
        fetchUser();
    }, []);

    useEffect(() => {
        async function fetchOrgs() {
            if (!hasFetchedOrgs.current && activeOrgs) {
                try {
                    const orgsSnapshot = await getActiveOrgs();
                    const orgs = orgsSnapshot.map(doc => doc.data());
                    setActiveOrgs(orgs);
                    hasFetchedOrgs.current = true;
                } catch (error) {
                    console.error('Error fetching organizations:', error);
                }
            }
        }
        fetchOrgs();
        
    }, [activeOrgs]);

    const handleRemoveOrg = (orgId, orgName) => {
        onRemoveOrgOpen();
        setRemoveOrg({ orgId, orgName });
    };

    const triggerRefresh = () => {
        setRefresh(prev => !prev);
    };

    const handleInputChange = (setter, value) => {
        setter(value);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImageFile(file);
    };

    const handleCarCapacityChange = (value) => {
        setCar(prevCar => [prevCar[0], value]);
    };

    const saveChanges = async () => {
        try {
            // check if name field is empty or is the same already
            if (!userName) {
                setIsNameInvalid(true);
                toast({
                    title: 'Error',
                    description: `${userName} is an invalid name.`,
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
                return;
            }

            // check if negative car capacity
            if (car[1] < 0) {
                setIsCarCapInvalid(true);
                toast({
                    title: 'Error',
                    description: `${car[1]} is an invalid car capacity.`,
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
                return;
            }

            // check if nothing changed
            if (userName === user.Name && userImage === user.Pfp && !imageFile && user.Car[1] === car[1]) {
                toast({
                    title: "No changes to be saved.",
                    status: "info",
                    duration: 5000,
                    isClosable: true,
                });
                return;
            }

            const updatedFields = { Name: userName, Pfp: imageFile, Car: car };

            await updateUser(user.uid, updatedFields);

            // Update the profile screen after update
            const uid = user.uid;
            const userRef = await getUserRef(uid);
            const userDoc = await getUser(userRef);
            
            setUser(userDoc.data());
            setUserName(userDoc.data().Name);
            setUserImage(userDoc.data().Pfp);
            setActiveOrgs(userDoc.data().ActiveOrgs);
            setCar(userDoc.data().Car);
            triggerRefresh();

            setIsNameInvalid(false);
            setIsCarCapInvalid(false);
            toast({
                title: 'Changes saved',
                description: 'Changes have been saved.',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
        } catch (error) {
            console.error('Error saving changes:', error);
            toast({
                title: 'Error',
                description: 'There was an error saving the changes.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    const discardChanges = () => {
        setUserName(user.Name);
        setCar(user.Car);
    };

  return (
    <>
        <OrgNavbar orgName='' navigateTo="/home" refresh={refresh}/>
        <Box
            color={textPrimary}
            display="flex"
            flexDirection="row"
            justifyContent="center"
            alignItems="center"
            marginTop="20px"
            marginBottom="20px"
        >
            <Spacer />
            <Image
                objectFit="cover"
                maxW="30%"
                src={userImage}
                alt="User Profile Picture"
                borderRadius="20px"
                fallbackSrc="/images/serena.png"
            />
            <Spacer />
            <VStack maxWidth="50vw">
                <Input
                    type="file"
                    accept="image/*"
                    size="xs"
                    border="0px"
                    onChange={handleImageChange}
                />
                <Divider />
                <Input
                    isInvalid={isNameInvalid}
                    placeholder="Name"
                    isRequired
                    value={userName}
                    onChange={(e) => handleInputChange(setUserName, e.target.value)}
                />
            </VStack>
            <Spacer />
        </Box>

        <Box
            color={textPrimary}
            display="flex"
            flexDirection="row"
            justifyContent="center"
            alignItems="center"
            marginTop="20px"
            marginBottom="20px"
        >
            <Spacer />
            <Image
                objectFit="cover"
                maxW="30%"
                src={car[0]}
                alt="User Car Picture"
                borderRadius="20px"
                fallbackSrc="/cars/light_sedan.png"
                onClick={onPickCarOpen}
                cursor="pointer"
            />
            <Spacer />
            <VStack maxWidth="50vw">
                <Input
                    placeholder="Car Capacity"
                    isInvalid={isCarCapInvalid}
                    type="number"
                    isRequired
                    value={car[1]}
                    onChange={(e) => handleCarCapacityChange(e.target.value)}
                />
            </VStack>
            <Spacer />
        </Box>

        <Box color={textPrimary} display='flex' flexDirection='row' justifyContent='center' alignItems='center' marginTop='20px' marginBottom='20px'>
                <TableContainer maxH='40vh' overflowY='auto'>
                    <Table variant='MemberDisplay' size='sm'>
                        <Thead>
                            <Tr>
                                <Th>Organization</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {activeOrgs.map((org, index) => (
                                <Tr key={index}>
                                    <Td>{org.Name}</Td>
                                    <Td>
                                        <IconButton
                                            variant='back'
                                            aria-label='Remove Button'
                                            icon={<CiCircleRemove/>}
                                            onClick={() => handleRemoveOrg(org.id, org.Name)}
                                        />
                                    </Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </TableContainer>
            </Box>

        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
            <Box display="flex" flexDirection="row" justifyContent="center" alignItems="center" marginBottom="10px">
                <Button variant="saveChanges" onClick={saveChanges} m={2}>Save Changes</Button>
                <Button variant="discardChanges" onClick={discardChanges} m={2}>Discard Changes</Button>
            </Box>
        </Box>

        <RemoveOrgAlert isOpen={isRemoveOrgOpen} onOpen={onRemoveOrgOpen} onClose={onRemoveOrgClose} orgName={removeOrg.orgName} orgId={removeOrg.orgId} uid={JSON.parse(localStorage.getItem('currentUser')).uid} setActiveOrgs={setActiveOrgs}/>
        <PickCarModal isOpen={isPickCarOpen} onOpen={onPickCarOpen} onClose={onPickCarClose} setCar={setCar} originalCar={car[0]}/>
    </>
  );
}

export default ProfilePage;