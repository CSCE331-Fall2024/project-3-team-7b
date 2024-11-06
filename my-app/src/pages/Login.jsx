import logo from "../images/logo.png"
// import { Form } from '@mui/material';
import { Button } from '@mui/material';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import './Login.css';
import theme from "../createTheme"
import axios from 'axios';

// Purpose: Provides login logic for managers and cashiers

function Login({ onLogin, userType }) {
    console.log("here");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [data, setData] = useState([]);
    const navigate = useNavigate();

    // Makes API call to retreive all data of employees
    useEffect(() => {
        const fetchData = async () => {
            try {
                const baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';
                const response = await axios.get(`${baseURL}/api/employees`);
                setData(response.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, []);

    // Authenticates the user's login credentials
    const handleLogin = (event) => {
        event.preventDefault()
        
        // Find the user in the data array by matching the entered username
        const user = data.find((user) => user.username === username && user.role === userType);

        // If user is correctly authenticated
        if (user && user.password === password) {
            onLogin(user.role); // Set authentication state
            if (userType === "Manager") {
                navigate("/manager");
            } else if (userType === "Cashier") {
                navigate("/cashier");
            }
        }
        // If authentication was invalid 
        else {
            alert("Invalid username, password, or role.");
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <div className="login-container">
                <div className="login-box">
                    <form onSubmit={handleLogin}>
                        <img className="logo" src={logo} alt="Panda Express Banner" />
                        <h1 className="login-title">Login</h1>

                        {/* Takes in input for the username */}
                        <input
                            type="text"
                            className="login-input"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />

                        {/* Takes in input for the password */}
                        <input
                            type="password"
                            className="login-input"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        {/* Login Button */}
                        <Button type="submit" variant="contained" color="primary" className="login-button">
                            Login
                        </Button>
                    </form>
                </div>
            </div>
        </ThemeProvider>
    );
}

export default Login;
