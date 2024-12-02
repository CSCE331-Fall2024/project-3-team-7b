import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';

// Purpose: Allows users to login with their Google accounts

function GoogleAuth({ onLogin, userType }) {
    const navigate = useNavigate();

    const handleLogin = useCallback (async (credentialResponse) => {
        try {
            const decodedCredentialResponse = jwtDecode(credentialResponse.credential);

            const baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';
            const response = await axios.get(`${baseURL}/api/employees`);
            const employees = response.data;

            const email = decodedCredentialResponse.email;
            // console.log(email);

            // Check if the email exists in the data array
            const user = employees.find((user) => user.username === email);

            if (user) {
                // Check the user's role
                if (userType === "Cashier" ? (user.role === userType || user.role === "Manager") : user.role === userType) {
                    // console.log('User authenticated:', user);
                    // console.log("user type: " + userType.toLowerCase())
                    onLogin(userType);
                    navigate(`/${userType.toLowerCase()}`); // Redirect based on role
                } else {
                    alert("User role mismatch.");
                }
            } else {
                alert("Email not found in the system.");
            }
        } catch (error) {
            console.error('Google Login failed:', error);
            alert('Login failed. Please try again.');
        }
    }, [userType, navigate]);

    return (
        <GoogleLogin
            onSuccess={handleLogin}
            onError={() => {
                console.log('Google Login failed.');
                alert('Google Login failed. Please try again.');
            }}
        />
    );
}

export default GoogleAuth;
