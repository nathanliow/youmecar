import { Drawer, DrawerBody, DrawerFooter, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton } from '@chakra-ui/react'

function RideDrawer({ isOpen, onClose }) {
  return (
    <Drawer isOpen={isOpen} placement='bottom' onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />

        <DrawerBody>
            
        </DrawerBody>

        <DrawerFooter>
            
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default RideDrawer;
