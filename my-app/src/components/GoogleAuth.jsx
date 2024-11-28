import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';

function GoogleAuth() {
  const navigate = useNavigate();

  const handleLogin = (credentialResponse) => {
    try {
      const decodedCredentialResponse = jwtDecode(credentialResponse.credential);
      const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds

      // Check if the token is expired
      if (decodedCredentialResponse.exp < currentTime) {
        console.log("Token has expired");
        return;
      }

      // Token is valid, navigate to the cashier page
      console.log("User logged in", decodedCredentialResponse);
      navigate('/cashier');
    } catch (error) {
      console.log('Error decoding the token:', error);
      alert("Login failed. Please try again.");
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleLogin}
      onError={() => {
        console.log('Login Failed');
        alert("Login failed. Please try again.");
      }}
    />
  );
}

export default GoogleAuth;
