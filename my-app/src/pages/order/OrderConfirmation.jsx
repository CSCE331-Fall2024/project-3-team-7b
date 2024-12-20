import { Button } from "@mui/material";
import Banner from "../../components/order/Banner";
import { ThemeProvider } from "@emotion/react";
import theme from "../../createTheme"
import { useNavigate } from "react-router-dom";
import { useEnlarge } from "../../EnlargeContext";
import { useState, useEffect } from 'react';
import axios from 'axios';

// Purpose: page to display order confirmation information

function OrderConfirmation(props) {
    const [orderNumber, setOrderNumber] = useState("");
    // get new order id
    useEffect(() => {
        const getOrderNumber = async() => {
            try {
                const baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';
                const response = await axios.get(`${baseURL}/api/orderID`);
                setOrderNumber(response.data);
            } catch (error) {
                setOrderNumber("123456");
                console.error("Error fetching order ID");
            }
        };
        getOrderNumber();
    }, []);

    const view = props.view;
    const setAuthentication = props.setAuthentication;

    // context to know if text should be enlarged
    const { isEnlarged } = useEnlarge();

    const navigate = useNavigate();

    const newOrder = () => {
        navigate("/" + view);
    }

    return (
        <ThemeProvider theme={theme}>
            <div className="finish">
                <div className="banner">
                    <Banner view={view} setAuthentication={setAuthentication}/>
                </div>
                <div className="finish-content">
                    <div className="order-confirmation">
                        <h2 className={`${isEnlarged ? 'h2-enlarged' : ''}`} >ORDER PLACED!</h2>
                        <h4 className={`${isEnlarged ? 'h4-enlarged' : ''}`} >YOUR ORDER # IS:</h4>
                        <h2 className={`${isEnlarged ? 'h2-enlarged' : ''}`} >{orderNumber}</h2>
                        <h4 className={`${isEnlarged ? 'h4-enlarged' : ''}`} >YOUR FOOD WILL BE OUT SHORTLY!</h4>
                    </div>
                    <div className="finish-buttons">
                        <Button variant="contained" onClick={newOrder}>NEW ORDER</Button>
                    </div>
                </div>
                
            </div>
        </ThemeProvider>
    );
}

export default OrderConfirmation