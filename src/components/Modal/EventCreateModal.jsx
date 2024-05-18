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
import { handleCreateEvent } from '../.././Firebase'

function EventCreateModal({ isOpen, onClose, orgId, setEvents }) {
	const theme = useTheme();
	const { colorMode } = useColorMode();
	const primary = colorMode === "light" ? theme.colors.primary.light : theme.colors.primary.dark;
	const textPrimary = colorMode === "light" ? theme.colors.textPrimary.light : theme.colors.textPrimary.dark;
	const overlayColor = colorMode === "light" ? theme.colors.overlay.light : theme.colors.overlay.dark;
	const [eventName, setEventName] = useState('');
    const [eventTime, setEventTime] = useState('');
    const [eventLocation, setEventLocation] = useState('');
	const [eventImage, setEventImage] = useState(null);
	const [isNameInvalid, setIsNameInvalid] = useState(false);
	const toast = useToast();

    const resetStates = async () => {
        setIsNameInvalid(false);
    }

    const createEvent = async () => {
        try {
			const loadingToast = toast({
				title: 'Creating event',
				description: 'Please wait...',
				status: 'info',
				duration: null, 
				isClosable: false,
			});
			
			if (eventName && eventName.length > 0) {
                const created = await handleCreateEvent(orgId, eventImage, eventName, eventLocation, eventTime, setEvents);
                if (created) {
                    toast.close(loadingToast);
                    toast({
                        title: 'Event created',
                        description: `'${eventName}' at '${eventLocation}' on '${eventTime}' created successfully!`,
                        status: 'success',
                        duration: 5000,
                        isClosable: true,
                    });
                    onClose(); 
                } else {
                    toast.close(loadingToast);
                    toast({
                        title: 'Event creation failed',
                        status: 'error',
                        duration: 5000,
                        isClosable: true,
                    });
                }
			} else {
				toast.close(loadingToast);
				toast({
					title: 'Organization creation failed',
					description: `The name '${eventName}' is invalid.`,
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

	const handleImageChange = (e) => {
        const file = e.target.files[0];
        setEventImage(file);
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
          <ModalHeader color={textPrimary}>Create Event</ModalHeader>
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
                        placeholder='Event Name' 
                        isRequired
                        value={eventName}
                        onChange={(e) => setEventName(e.target.value)}
                    />
                    <Divider/>
                    <Input 
                        placeholder='Event Time' 
                        type="datetime-local" 
                        isRequired
                        value={eventTime}
                        onChange={(e) => setEventTime(e.target.value)}
                    />
                    <Divider/>
                    <Input 
                        placeholder='Event Location' 
                        isRequired
                        value={eventLocation}
                        onChange={(e) => setEventLocation(e.target.value)}
                    />
                </VStack>
            </Center>
          </ModalBody>

          <ModalFooter>
            <Button variant='normal' mr={3} onClick={createEvent}>
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default EventCreateModal;
