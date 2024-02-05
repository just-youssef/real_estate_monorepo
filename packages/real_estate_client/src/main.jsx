import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Flowbite } from 'flowbite-react';
import { StoreProvider } from './components';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <StoreProvider>
      <Flowbite>
        <App />
      </Flowbite>
    </StoreProvider>
  </React.StrictMode>,
)
