import React from 'react';
import './App.css';
import { useTheme } from '@chakra-ui/react'; 
import { Pages } from './Routes';

function App() {
  const theme = useTheme(); 
  const primaryColor = theme.colors.primary;

  return (
    <div className="App">
        <header className="App-header" style={{ background: primaryColor }}>
            <div className="container">
                <Pages/>
            </div>
        </header>
    </div>
  );
}

export default App;
