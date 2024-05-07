import { Drawer, DrawerBody, DrawerFooter, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton } from '@chakra-ui/react'

function ProfileDrawer({ isOpen, onClose }) {
  return (
    <Drawer isOpen={isOpen} placement='right' onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Create your account</DrawerHeader>

        <DrawerBody>
            
        </DrawerBody>

        <DrawerFooter>
            
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default ProfileDrawer;
