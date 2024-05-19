import React, { useState, useEffect } from 'react';
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
} from '@chakra-ui/react';
import OrgNavbar from '../components/Navbar/OrgNavbar.jsx';
import { getUser, getUserRef, updateUser } from '../Firebase'; // Ensure this imports the function to update the user in Firestore

function ProfilePage() {
    const theme = useTheme();
    const { colorMode } = useColorMode();
    const [userName, setUserName] = useState('');
    const [userImage, setUserImage] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [user, setUser] = useState(null);
    const [isNameInvalid, setIsNameInvalid] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const textPrimary = colorMode === 'light' ? theme.colors.textPrimary.light : theme.colors.textPrimary.dark;
    const toast = useToast();

    useEffect(() => {
        async function fetchUser() {
        try {
            const uid = JSON.parse(localStorage.getItem('currentUser')).uid;
            const userRef = await getUserRef(uid);
            const userDoc = await getUser(userRef);
            
            setUser(userDoc.data());
            setUserName(userDoc.data().Name);
            setUserImage(userDoc.data().Pfp);
        } catch (error) {
            console.error('Error fetching user:', error);
        }
        }
        fetchUser();
    }, []);

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

            // check if nothing changed
            if (userName === user.Name && userImage === user.Pfp && !imageFile) {
                toast({
                    title: "No changes to be saved.",
                    status: "info",
                    duration: 5000,
                    isClosable: true,
                });
                return;
            }

            const updatedFields = { Name: userName, Pfp: imageFile };

            await updateUser(user.uid, updatedFields);

            // Update the profile screen after update
            const uid = user.uid;
            const userRef = await getUserRef(uid);
            const userDoc = await getUser(userRef);
            
            setUser(userDoc.data());
            setUserName(userDoc.data().Name);
            setUserImage(userDoc.data().Pfp);
            triggerRefresh();

            setIsNameInvalid(false);
            toast({
                title: 'Changes saved',
                description: 'Changes have been saved and updated.',
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

        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
            <Box display="flex" flexDirection="row" justifyContent="center" alignItems="center" marginBottom="10px">
                <Button variant="saveChanges" onClick={saveChanges} m={2}>Save Changes</Button>
                <Button variant="discardChanges" onClick={discardChanges} m={2}>Discard Changes</Button>
            </Box>
        </Box>
    </>
  );
}

export default ProfilePage;