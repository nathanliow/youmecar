import React, { useState } from 'react'
import { 
    useTheme, 
    useColorMode, 
    Button,
    HStack,
    VStack,
    PinInput,
    PinInputField,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Center,
    Text,
    useToast,
} from '@chakra-ui/react'
import { checkIfOrgAlreadyJoined, handleJoinOrg } from '../.././Firebase'

function OrgJoinModal({ isOpen, onClose, setActiveOrgs }) {
    const theme = useTheme();
    const { colorMode } = useColorMode();
    const primary = colorMode === "light" ? theme.colors.primary.light : theme.colors.primary.dark;
    const textPrimary = colorMode === "light" ? theme.colors.textPrimary.light : theme.colors.textPrimary.dark;
    const overlayColor = colorMode === "light" ? theme.colors.overlay.light : theme.colors.overlay.dark;
    const [orgCode, setOrgCode] = useState('');
    const [isInvalid, setIsInvalid] = useState(false);
    const toast = useToast();

    const resetState = async () => {
        setIsInvalid(false);
    }

  const joinOrg = async () => {
    try {
        const loadingToast = toast({
			title: 'Joining organization',
			description: 'Please wait...',
			status: 'info',
			duration: null, 
			isClosable: false,
		});
      
        if (orgCode.length === 6) {
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            const alrJoined = await checkIfOrgAlreadyJoined(orgCode, currentUser);
            if (!alrJoined) {
                const joined = await handleJoinOrg(orgCode, setActiveOrgs);
                if (joined) {
                    toast.close(loadingToast);
                    toast({
                        title: 'Organization joined',
                        description: `Organization joined successfully!`,
                        status: 'success',
                        duration: 5000,
                        isClosable: true,
                    });
                    onClose();
                } else {
                    toast.close(loadingToast);
                    toast({
                        title: 'Organization join failed',
                        description: `Organization with code '${orgCode}' doesn't exist.`,
                        status: 'error',
                        duration: 5000,
                        isClosable: true,
                    });
                }
            } else {
                toast.close(loadingToast);
                toast({
                    title: 'Organization join failed',
                    description: `You are already in organization with code '${orgCode}'.`,
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            }
        } else {
            toast.close(loadingToast);
            toast({
                title: 'Invalid code',
                description: `All fields must be filled.`,
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
            setIsInvalid(true); 
        }
    } catch (error) {
      // Handle error
    }
  };

  return (
    <>
      <Modal 
        isOpen={isOpen} 
        onClose={onClose}
        isCentered
        motionPreset='slideInBottom'
    >
        <ModalOverlay 
            bg={overlayColor}
        />
        <ModalContent
            width='95%'
            background={primary}
        >
          <ModalHeader color={textPrimary}>Enter Organization Code</ModalHeader>
          <ModalCloseButton color={textPrimary} onClick={resetState}/>
          <ModalBody>
            <Center>
                <VStack>
                    <HStack>
                        <PinInput isInvalid={isInvalid} type='alphanumeric' value={orgCode} onChange={(value) => {setOrgCode(value)}}>
                            <PinInputField/>
                            <PinInputField/>
                            <PinInputField/>
                            <PinInputField/>
                            <PinInputField/>
                            <PinInputField/>
                        </PinInput>
                    </HStack>
                </VStack>
            </Center>
          </ModalBody>

          <ModalFooter>
            <Button variant='normal' mr={3} onClick={joinOrg}>
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default OrgJoinModal;
