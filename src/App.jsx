import React from 'react';
import './App.css';
import { useTheme, useColorMode } from '@chakra-ui/react'; 
import { Pages } from './Routes';

function App() {
  const theme = useTheme(); 
  const { colorMode } = useColorMode();
  const primary = colorMode === "light" ? theme.colors.primary.light : theme.colors.primary.dark;

  return (
    <div className="App">
        <header className="App-header" style={{ background: primary }}>
            <div className="container">
                <Pages/>
            </div>
        </header>
    </div>
  );
}

export default App;
