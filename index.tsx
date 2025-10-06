
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Dynamically load the Google Maps script using an environment variable
if (!process.env.GOOGLE_MAPS_API_KEY) {
  throw new Error("GOOGLE_MAPS_API_KEY environment variable not set. Please check your .env file.");
}
const script = document.createElement('script');
script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_MAPS_API_KEY}&loading=async`;
document.head.appendChild(script);

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);