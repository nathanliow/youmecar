import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';
import { ChakraProvider } from '@chakra-ui/react'
import LightTheme from './styles/themes/LightTheme.js'
import DarkTheme from './styles/themes/DarkTheme.js'
import app from './Firebase';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ChakraProvider theme={LightTheme}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </ChakraProvider>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
