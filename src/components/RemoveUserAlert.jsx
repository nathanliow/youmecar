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
  import { removeUserFromOrg } from './.././Firebase'  

function RemoveUserAlert({ isOpen, onClose, name, orgId, uid, setPeople }) {
    const theme = useTheme();
    const { colorMode } = useColorMode();
    const toast = useToast();
	const primary = colorMode === "light" ? theme.colors.primary.light : theme.colors.primary.dark;
	const textPrimary = colorMode === "light" ? theme.colors.textPrimary.light : theme.colors.textPrimary.dark;
	const overlayColor = colorMode === "light" ? theme.colors.overlay.light : theme.colors.overlay.dark;

    const removeUser = async () => {
        try {
            const loadingToast = toast({
				title: `Removing ${name}`,
				description: 'Please wait...',
				status: 'info',
				duration: null, 
				isClosable: false,
			});
            const removed = await removeUserFromOrg(orgId, uid, setPeople);
            if (removed) {
                toast.close(loadingToast);
                toast({
                    title: `Successfully removed ${name}!`,
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                });
                onClose();
            } else {
                toast.close(loadingToast);
                toast({
                    title: `Failed to remove ${name}.`,
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
  
          <AlertDialogContent background={primary} color={textPrimary}>
            <AlertDialogHeader>Remove user?</AlertDialogHeader>
            <AlertDialogCloseButton />
            <AlertDialogBody >
              Are you sure you want to remove {name}?
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button onClick={onClose}>
                No
              </Button>
              <Button onClick={removeUser} colorScheme='red' ml={3}>
                Yes
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    )
  }

export default RemoveUserAlert;