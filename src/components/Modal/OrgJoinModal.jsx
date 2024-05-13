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
} from '@chakra-ui/react'
import { checkIfOrgAlreadyJoined, handleJoinOrg } from '../.././Firebase'

function OrgJoinModal({ isOpen, onClose }) {
  const theme = useTheme();
  const { colorMode } = useColorMode();
  const primary = colorMode === "light" ? theme.colors.primary.light : theme.colors.primary.dark;
  const textPrimary = colorMode === "light" ? theme.colors.textPrimary.light : theme.colors.textPrimary.dark;
  const overlayColor = colorMode === "light" ? theme.colors.overlay.light : theme.colors.overlay.dark;
  const [orgCode, setOrgCode] = useState('');
  const [isInvalid, setIsInvalid] = useState(false);
  const [showAlreadyInError, setShowAlreadyInError] = useState(false);
  const [showNoOrgError, setShowNoOrgError] = useState(false);

  const resetStates = async () => {
    setShowNoOrgError(false);
    setShowAlreadyInError(false);
  }

  const joinOrg = async () => {
    try {
        if (orgCode.length === 6) {
            const alrJoined = await checkIfOrgAlreadyJoined(orgCode);
            console.log(alrJoined)
            if (!alrJoined) {
                const joined = await handleJoinOrg(orgCode);
                if (joined) {
                    onClose();
                    setShowNoOrgError(false);
                    setShowAlreadyInError(false);
                } else {
                    setShowNoOrgError(true);
                    setShowAlreadyInError(false);
                }
            } else {
                // already joined
                setShowAlreadyInError(true);
                setShowNoOrgError(false);
            }
        } else {
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
          <ModalCloseButton color={textPrimary} onClick={resetStates}/>
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
                    {showAlreadyInError && (
                        <Text color='red' whiteSpace="pre-line">
                            {"You are already in this organization!"}
                        </Text>
                    )}
                    {showNoOrgError && (
                        <Text color='red' whiteSpace="pre-line">
                            {"The code is invalid!"}
                        </Text>
                    )}
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
