import { useCallback, useState } from 'react';
import logo from "../../images/logo.png"
import Button from '@mui/material/Button';
import { ThemeProvider } from '@mui/material/styles';
import { useNavigate } from "react-router-dom";
import "./customer.css"
import theme from "../../createTheme"
import { useDispatch, useSelector } from 'react-redux';

// Purpose: Overall home page for the customers

function CustomerHome() {
    const navigate = useNavigate();
    const subtotal = useSelector((state) => state.subtotal);
    const order = useSelector((state) => state.order);

    // Navigates customer to start their order
    const startOrder = () => {
        navigate("/customer/order", {state: {view: "customer"}});
    }

    return (
        <ThemeProvider theme={theme}>
            <div>
                {/* Accessibility features */}
                <div>
                    <Button className="translate-button" variant="contained">Select A Language</Button>
                </div>

                {/* Main content of page */}
                <div className="customer-content-div">
                    <div className="logo-div">
                        <img className="logo" src={logo} alt="Panda Express Banner"></img>
                    </div>

                    <div>
                        <Button className="order-button" variant="contained" onClick={startOrder}>Start Order</Button>
                    </div>

                    {/* Content to display whether & item of day */}
                    <div className="weather-div">
                        <h1>Today's Weather:</h1>
                        
                        <div>
                            <p>Something that shows the current weather</p>
                        </div>
                        <div>
                            <h3>Item of the Day:</h3>
                        </div>
                    </div>
                </div>
            </div>
       </ThemeProvider>
    );
}

export default CustomerHome;
