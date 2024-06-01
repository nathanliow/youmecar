import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    AlertDialogCloseButton,
    Button,
    useToast,
    useTheme,
    useColorMode
  } from '@chakra-ui/react'
import { leaveOrg } from './.././Firebase'  

function RemoveOrgAlert({ isOpen, onClose, orgName, orgId, uid, setActiveOrgs }) {
    const theme = useTheme();
    const { colorMode } = useColorMode();
    const toast = useToast();
	const primary = colorMode === "light" ? theme.colors.primary.light : theme.colors.primary.dark;
	const textPrimary = colorMode === "light" ? theme.colors.textPrimary.light : theme.colors.textPrimary.dark;
	const overlayColor = colorMode === "light" ? theme.colors.overlay.light : theme.colors.overlay.dark;

    const removeOrg = async () => {
        try {
            const loadingToast = toast({
				title: `Leaving ${orgName}`,
				description: 'Please wait...',
				status: 'info',
				duration: null, 
				isClosable: false,
			});
            const removed = await leaveOrg(orgId, uid, setActiveOrgs);
            if (removed) {
                toast.close(loadingToast);
                toast({
                    title: `Successfully left ${orgName}!`,
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                });
                onClose();
            } else {
                toast.close(loadingToast);
                toast({
                    title: `Failed to leave ${orgName}.`,
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            }
        } catch (error) {
        // Handle error
        } 
    }

    return (
      <>
        <AlertDialog
          motionPreset='slideInBottom'
          onClose={onClose}
          isOpen={isOpen}
          isCentered
        >
          <AlertDialogOverlay bg={overlayColor}/>
  
          <AlertDialogContent background={primary} color={textPrimary} maxWidth='90vw'>
            <AlertDialogHeader>Leave organization?</AlertDialogHeader>
            <AlertDialogCloseButton />
            <AlertDialogBody >
              Are you sure you want to leave {orgName}?
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button onClick={onClose}>
                No
              </Button>
              <Button onClick={removeOrg} colorScheme='red' ml={3}>
                Yes
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    )
  }

export default RemoveOrgAlert;