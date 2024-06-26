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
	InputGroup,
	InputRightElement,
    VStack,
    Divider,
    Text,
    useToast
} from '@chakra-ui/react'
import { handleCreateOrg } from '../.././Firebase'

function OrgCreateModal({ isOpen, onClose, setActiveOrgs }) {
	const theme = useTheme();
	const { colorMode } = useColorMode();
	const primary = colorMode === "light" ? theme.colors.primary.light : theme.colors.primary.dark;
	const textPrimary = colorMode === "light" ? theme.colors.textPrimary.light : theme.colors.textPrimary.dark;
	const overlayColor = colorMode === "light" ? theme.colors.overlay.light : theme.colors.overlay.dark;
	const [orgName, setOrgName] = useState('');
	const [orgCode, setOrgCode] = useState('');
	const [orgImage, setOrgImage] = useState(null);
	const [isNameInvalid, setIsNameInvalid] = useState(false);
	const [isCodeInvalid, setIsCodeInvalid] = useState(false);
	const toast = useToast();

    const resetStates = async () => {
        setIsNameInvalid(false);
        setIsCodeInvalid(false);
    }

    const createOrg = async () => {
        try {
			// Regular expression for alphanumeric characters
			const alphanumericRegex = /^[a-zA-Z0-9]+$/;
			const loadingToast = toast({
				title: 'Creating organization',
				description: 'Please wait...',
				status: 'info',
				duration: null, 
				isClosable: false,
			});
			
			if (orgName && orgName.length > 0) {
				// Check if the join code is valid
				if (orgCode.match(alphanumericRegex) && orgCode.length === 6) {
					const created = await handleCreateOrg(orgImage, orgName, orgCode, setActiveOrgs);
					if (created) {
						toast.close(loadingToast);
						toast({
							title: 'Organization created',
							description: `Organization '${orgName}' with code '${orgCode}' created successfully!`,
							status: 'success',
							duration: 5000,
							isClosable: true,
						});
						onClose(); 
						setIsCodeInvalid(false); 
						setIsNameInvalid(false); 
					} else {
						toast.close(loadingToast);
						toast({
							title: 'Organization creation failed',
							description: `Organization with code '${orgCode}' already exists.`,
							status: 'error',
							duration: 5000,
							isClosable: true,
						});
					}
				} else {
					toast.close(loadingToast);
					toast({
						title: 'Organization creation failed',
						description: `The code '${orgCode}' is invalid.`,
						status: 'error',
						duration: 5000,
						isClosable: true,
					});
					setIsCodeInvalid(true); 
					setIsNameInvalid(false); 
				}
			} else {
				toast.close(loadingToast);
				toast({
					title: 'Organization creation failed',
					description: `The name '${orgName}' is invalid.`,
					status: 'error',
					duration: 5000,
					isClosable: true,
				});
				setIsNameInvalid(true); 
			}

        } catch (error) {
        // Handle error
        }
    };

	const handleAutoGenerateCode = () => {
		const alphanumericChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		let autoGeneratedCode = '';
		for (let i = 0; i < 6; i++) {
			autoGeneratedCode += alphanumericChars.charAt(Math.floor(Math.random() * alphanumericChars.length));
		}
		setOrgCode(autoGeneratedCode);
	};

	const handleImageChange = (e) => {
        const file = e.target.files[0];
        setOrgImage(file);
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
                        placeholder='Organization Image' 
						type="file" 
						accept="image/*" 
						size='xs'
						border="0px" 
						onChange={handleImageChange}
                    />
					<Divider/>
                    <Input 
                        isInvalid={isNameInvalid} 
                        placeholder='Organization Name' 
                        isRequired
                        value={orgName}
                        onChange={(e) => setOrgName(e.target.value)}
                    />
                    <Divider/>
					<InputGroup>
						<Input 
							isInvalid={isCodeInvalid} 
							placeholder='Join Code'
							value={orgCode}
							onChange={(e) => setOrgCode(e.target.value)}
						/>
						<InputRightElement width='70px' marginRight='5px'>
							<Button variant='normal' size='xs' onClick={handleAutoGenerateCode}>
								Auto-Gen
							</Button>
						</InputRightElement>
					</InputGroup>
                    <Text whiteSpace="pre-line">
                        {"- Must be alphanumeric (a, B, 1, 2, etc.)\n- Must be 6 characters long"}
                    </Text>
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
