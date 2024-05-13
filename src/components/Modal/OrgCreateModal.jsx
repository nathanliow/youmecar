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
    VStack,
    Divider,
    Text
} from '@chakra-ui/react'
import { handleCreateOrg } from '../.././Firebase'

function OrgCreateModal({ isOpen, onClose }) {
  const theme = useTheme();
  const { colorMode } = useColorMode();
  const primary = colorMode === "light" ? theme.colors.primary.light : theme.colors.primary.dark;
  const textPrimary = colorMode === "light" ? theme.colors.textPrimary.light : theme.colors.textPrimary.dark;
  const overlayColor = colorMode === "light" ? theme.colors.overlay.light : theme.colors.overlay.dark;
  const [orgName, setOrgName] = useState('');
  const [orgCode, setOrgCode] = useState('');
  const [isNameInvalid, setIsNameInvalid] = useState(false);
  const [isCodeInvalid, setIsCodeInvalid] = useState(false);
  const [showExistsError, setShowExistsError] = useState(false);

    const resetStates = async () => {
        setIsNameInvalid(false);
        setIsCodeInvalid(false);
        setShowExistsError(false);
    }
    const createOrg = async () => {
        try {
        // Regular expression for alphanumeric characters
        const alphanumericRegex = /^[a-zA-Z0-9]+$/;
        
        if (orgName && orgName.length > 0) {
            // Check if the join code is valid
            if (orgCode.match(alphanumericRegex) && orgCode.length === 6) {
                const joined = await handleCreateOrg(orgName, orgCode);
                if (joined) {
                    onClose(); 
                    setIsCodeInvalid(false); 
                    setIsNameInvalid(false); 
                } else {
                    setShowExistsError(true);
                }
            } else {
                setIsCodeInvalid(true); 
                setIsNameInvalid(false); 
            }
        } else {
            setIsNameInvalid(true); 
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
          <ModalHeader color={textPrimary}>Create Organization</ModalHeader>
          <ModalCloseButton color={textPrimary} onClick={resetStates}/>
          <ModalBody>
            <Center>
                <VStack>
                    <Input 
                        isInvalid={isNameInvalid} 
                        placeholder='Organization Name' 
                        isRequired
                        value={orgName}
                        onChange={(e) => setOrgName(e.target.value)}
                    />
                    <Divider/>
                    <Input 
                        isInvalid={isCodeInvalid} 
                        placeholder='Join Code (Optional)'
                        value={orgCode}
                        onChange={(e) => setOrgCode(e.target.value)}
                    />
                    <Text whiteSpace="pre-line">
                        {"- Must be alphanumeric (a, B, 1, 2, etc.)\n- Must be 6 characters long"}
                    </Text>
                    {showExistsError && (
                    <Text color='red' whiteSpace="pre-line">
                        {"Organization with that name or code already exists!"}
                    </Text>
                    )}
                </VStack>
            </Center>
          </ModalBody>

          <ModalFooter>
            <Button variant='normal' mr={3} onClick={createOrg}>
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default OrgCreateModal;
