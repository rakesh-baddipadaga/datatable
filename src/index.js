import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* wraping the component inside the Mantineprovider */}
    <MantineProvider >
      <App />
    </MantineProvider>
  </React.StrictMode>
);

reportWebVitals();
