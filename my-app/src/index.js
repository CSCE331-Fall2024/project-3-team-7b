import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import store from './store';
import { Provider } from 'react-redux';
import { EnlargeProvider } from './EnlargeContext';
import { GoogleOAuthProvider } from '@react-oauth/google';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <React.StrictMode>
      <EnlargeProvider>
        <GoogleOAuthProvider clientId="870342903927-3lqp8kfhv0labcj2a8fg56epsdc2dpmr.apps.googleusercontent.com">
          <App />
        </GoogleOAuthProvider>
      </EnlargeProvider>
    </React.StrictMode>
  </Provider>
);
