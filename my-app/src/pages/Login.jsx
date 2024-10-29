import logo from "../images/logo.png"
import { Button } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import './Login.css';
import theme from "../createTheme"

function Login({ onLogin }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = () => {
        // Placeholder logic for authentication
        if (username === "admin" && password === "password") {
            onLogin(); // Set authentication state in App
            navigate("/cashier"); // Redirect to Cashier page after login
        } else {
            alert("Invalid username or password.");
        }
    };

    return (

        <ThemeProvider theme={theme}>
            <div className="login-container">
                <div className="login-box">
                    <img className="logo" src={logo} alt="Panda Express Banner"></img>
                    <h1 className="login-title">Login</h1>
                    <input
                        type="text"
                        className="login-input"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        type="password"
                        className="login-input"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button variant="contained" color='primary' className="login-button" onClick={handleLogin}>
                        Login
                    </Button>
                </div>
            </div>
        </ThemeProvider>
    );
}

export default Login;
