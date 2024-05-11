import { defineStyle, defineStyleConfig } from '@chakra-ui/react';
import { theme } from '@chakra-ui/react';

const menu = defineStyle({
  color: "black",
  background: "white", 
  _hover: {
    background: "#E8E8E8",
  },

  _dark: {
    color: "white",
    background: "black", 
  }
});

const back = defineStyle({
  fontSize: "30px",
  color: "black",
  background: "white", 
  _hover: {
    background: "#E8E8E8",
  },

  _dark: {
    color: "white",
    background: "black", 
  }
});

const darkMode = defineStyle({
  fontSize: "30px",
  color: "black",
  background: "white", 
  _hover: {
    background: "#E8E8E8",
  },

  _dark: {
    color: "white",
    background: "black", 
  }
});

const logOut = defineStyle({
  fontSize: "30px",
  color: "black",
  background: "white", 
  _hover: {
    background: "#E8E8E8",
  },

  _dark: {
    color: "white",
    background: "black", 
  }
});

export const ButtonStyle = defineStyleConfig({ variants: { menu, back, darkMode, logOut } });
