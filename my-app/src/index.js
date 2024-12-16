import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import store from './store';
import { Provider } from 'react-redux';
import { EnlargeProvider } from './EnlargeContext';
import { GoogleOAuthProvider } from '@react-oauth/google';

const root = ReactDOM.createRoot(document.getElementById('root'));

// Access the environment variable
const googleClientId = process.env.REACT_APP_GOOGLE_AUTH_KEY;

if (!googleClientId) {
  console.error('Google Auth Client ID is not defined. Please check your .env file.');
}


root.render(
  <Provider store={store}>
    <React.StrictMode>
      <EnlargeProvider>
        <GoogleOAuthProvider clientId={googleClientId}>
          <App />
        </GoogleOAuthProvider>
      </EnlargeProvider>
    </React.StrictMode>
  </Provider>
);
