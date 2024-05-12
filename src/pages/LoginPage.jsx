import React from 'react'
import { useTheme, useColorMode } from '@chakra-ui/react'
import { handleGoogleSignIn, handleSignOut } from './../Firebase'

function LoginPage() {
  const theme = useTheme();
  const { colorMode } = useColorMode();
  const textPrimary = colorMode === "light" ? theme.colors.textPrimary.light : theme.colors.textPrimary.dark;

  const handleClick = async () => {
    try {
      await handleGoogleSignIn();
      // Handle successful sign-in, such as redirecting to another page
    } catch (error) {
      console.error('Error signing in:', error);
      // Handle sign-in error, such as displaying an error message
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <button style={{ color: textPrimary }} onClick={handleClick}>
        Google Sign In
      </button>
      <button style={{ color: textPrimary }} onClick={handleSignOut}>
        Sign Out
      </button>
    </div>
  );
}

export default LoginPage;
