import React, { useState } from 'react'
import { 
    useTheme, 
    useColorMode, 
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Center,
    Input,
    useToast,
} from '@chakra-ui/react'
import { handleAddUserToOrg } from '../.././Firebase'

function OrgAddMemberModal({ isOpen, onClose, orgId, setPeople }) {
	const theme = useTheme();
	const { colorMode } = useColorMode();
	const primary = colorMode === "light" ? theme.colors.primary.light : theme.colors.primary.dark;
	const textPrimary = colorMode === "light" ? theme.colors.textPrimary.light : theme.colors.textPrimary.dark;
	const overlayColor = colorMode === "light" ? theme.colors.overlay.light : theme.colors.overlay.dark;
	const [memberEmail, setMemberEmail] = useState('');
	const toast = useToast();

    const addMember = async () => {
        try {
            const loadingToast = toast({
              title: 'Adding member',
              description: 'Please wait...',
              status: 'info',
              duration: null, 
              isClosable: false,
            });
            
				const joined = await handleAddUserToOrg(orgId, memberEmail, setPeople);
				if (joined === 0) {
					toast.close(loadingToast);
					toast({
						title: 'Added member!',
						description: `User with '${memberEmail}' joined successfully!`,
						status: 'success',
						duration: 5000,
						isClosable: true,
					});
					onClose(); 
				} else if (joined === 1) {
					toast.close(loadingToast);
					toast({
						title: 'Failed to add member.',
						description: `No user using '${memberEmail}'`,
						status: 'error',
						duration: 5000,
						isClosable: true,
					});
				} else if (joined === 2) {
					toast.close(loadingToast);
					toast({
						title: 'Failed to add member.',
						description: `Member using '${memberEmail}' has already joined.`,
						status: 'error',
						duration: 5000,
						isClosable: true,
					});
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
          <ModalHeader color={textPrimary}>Add Member</ModalHeader>
          <ModalCloseButton color={textPrimary}/>
          <ModalBody>
            <Center>
                <Input 
                    placeholder='Member Email' 
                    isRequired
                    value={memberEmail}
                    onChange={(e) => setMemberEmail(e.target.value)}
                />
            </Center>
          </ModalBody>

          <ModalFooter>
            <Button variant='normal' mr={3} onClick={addMember}>
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default OrgAddMemberModal;
