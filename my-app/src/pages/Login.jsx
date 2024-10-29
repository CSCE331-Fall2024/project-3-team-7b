import logo from "../images/logo.png"
import { Button } from '@mui/material';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import './Login.css';
import theme from "../createTheme"
import axios from 'axios';

function Login({ onLogin, userType }) {
    console.log("here");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [data, setData] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:5001/api/employees');
                setData(response.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, []);

    const handleLogin = () => {
        // Find the user in the data array by matching the entered username
        console.log(data);
        const user = data.find((user) => user.username === username && user.role === userType);
        console.log(user);
        console.log(password);

        if (user && user.password === password) {
            onLogin(user.role); // Set authentication state
            if (userType === "Manager") {
                navigate("/manager");
            } else if (userType === "Cashier") {
                navigate("/cashier");
            }
        } else {
            alert("Invalid username, password, or role.");
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <div className="login-container">
                <div className="login-box">
                    <img className="logo" src={logo} alt="Panda Express Banner" />
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
                    <Button variant="contained" color="primary" className="login-button" onClick={handleLogin}>
                        Login
                    </Button>
                </div>
            </div>
        </ThemeProvider>
    );
}

export default Login;
