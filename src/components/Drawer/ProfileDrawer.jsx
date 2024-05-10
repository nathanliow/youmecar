import { 
  Drawer, 
  DrawerHeader,
  DrawerBody, 
  DrawerFooter, 
  DrawerOverlay,
  DrawerContent, 
  DrawerCloseButton, 
  IconButton,
} from '@chakra-ui/react'
import { ReactComponent as ProfileIcon1 } from "../../public/profileIcons/profileIcon1.svg";
import { IoMdPerson, IoMdSettings, IoMdMoon } from "react-icons/io";

function ProfileDrawer({ isOpen, onClose }) {
  const handleProfileClick = () => {
    console.log("Profile Page clicked!");
  };

  const handleSettingsClick = () => {
      console.log("Settings clicked!");
  };

  return (
    <Drawer isOpen={isOpen} placement='right' onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader></DrawerHeader>
        <DrawerBody display="flex" flexDirection="column" alignItems="center">
          <div style={{ marginTop: '30px' }}> 
            <ProfileIcon1 width="100px" height="100px" />
          </div>
          <div style={{ marginTop: '10px', fontSize: '24px' }}> 
            Nathan Liow
          </div>
          <div style={{ fontSize: '16px' }}> 
            @nathanliow7456
          </div>
          <div style={{ fontSize: '16px' }}> 
            <span style={{ fontWeight: 'bold' }}>130</span> Friends
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', marginTop: '30px', fontSize: '20px', alignSelf: 'flex-start', marginLeft: '10px' }}>
            <button onClick={handleProfileClick} style={{ display: 'flex', alignItems: 'center' }}>
              <IoMdPerson style={{ marginRight: '20px' }} />
              Profile
            </button>
            <button onClick={handleSettingsClick} style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
              <IoMdSettings style={{ marginRight: '20px' }} />
              Settings
            </button>
          </div>
        </DrawerBody>

        <DrawerFooter justifyContent='left'>
          <IconButton
            variant='darkMode'
            aria-label='Toggle Dark Mode'
            icon={<IoMdMoon />}
          />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default ProfileDrawer;
