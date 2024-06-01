import React, { useState, useEffect } from 'react'
import { 
    useTheme, 
    useColorMode, 
    Button,
    Grid, 
    Image,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Center,
    useToast,
} from '@chakra-ui/react'

function PickCarModal({ isOpen, onClose, setCar, originalCar }) {
    const theme = useTheme();
    const { colorMode } = useColorMode();
    const primary = colorMode === "light" ? theme.colors.primary.light : theme.colors.primary.dark;
    const textPrimary = colorMode === "light" ? theme.colors.textPrimary.light : theme.colors.textPrimary.dark;
    const overlayColor = colorMode === "light" ? theme.colors.overlay.light : theme.colors.overlay.dark;
    const [selectedCar, setSelectedCar] = useState(originalCar);
    const toast = useToast();

    const carOptions = [
        "/cars/light_sedan.png",
        "/cars/light_suv.png",
        "/cars/light_van.png",
        "/cars/dark_sedan.png",
        "/cars/dark_suv.png",
        "/cars/dark_van.png"
    ];

    const handleCarSelect = (car) => {
        setSelectedCar(car);
        setCar(prevCar => [car, prevCar[1]]);
    };

    useEffect(() => {
        if (originalCar) {
            setSelectedCar(originalCar);
        }
    }, [originalCar]);

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
                <ModalHeader color={textPrimary}>Choose vehicle</ModalHeader>
                <ModalCloseButton color={textPrimary}/>
                <ModalBody>
                    <Center>
                        <Grid templateColumns='repeat(3, 2fr)' gap={6}>
                            {carOptions.map((car, index) => (
                                <Image
                                    key={index}
                                    objectFit="cover"
                                    src={car}
                                    alt={`Car ${index + 1}`}
                                    borderRadius="20px"
                                    fallbackSrc={car}
                                    border={selectedCar === car ? `2px solid ${textPrimary}` : `2px solid ${primary}`}
                                    cursor="pointer"
                                    onClick={() => handleCarSelect(car)}
                                />
                            ))}
                        </Grid>
                    </Center>
                </ModalBody>

                <ModalFooter>
                </ModalFooter>
            </ModalContent>
        </Modal>
        </>
    )
}

export default PickCarModal;
