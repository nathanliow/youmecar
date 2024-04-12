import React from 'react';
import './App.css';
import RideCard from './components/Card/RideCard';

function App() {
  return (
    <div className="App">
        <header className="App-header">
            <RideCard 
                name="John Ahn" 
                time="1:25 PM" 
                numRiders="4" 
                maxRiders="4"
                riders={["Nathan Liow", "Serena Oh", "Joe Mama", "Mama Joe"]}
            />
            <p>
            Component above! LOL
            </p>
        </header>
    </div>
  );
}

export default App;
