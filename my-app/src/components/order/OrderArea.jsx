// MenuDisplay.js
import React from "react";
import "./orderComponents.css";
import { Button } from "@mui/material";
import { useState } from 'react';
import { useNavigate } from "react-router-dom";

// Dynamically load all images from a folder
const importAll = (r) => {
    return r.keys().map(r);
}

// Import all images from the images folder (you can adjust the path)
const images = importAll(require.context("../../images/small_menu", false, /\.(png)$/));

function OrderArea() {
    const navigate = useNavigate();
    const [subtotal, setSubtotal] = useState(0.00);
    const [tax, setTax] = useState(0.00);
    const [total, setTotal] = useState(0.00);

    const finishOrder = () => {
        navigate("/customer/order/finish");
    }

    return (
        <div className="order-area">
            <div className="order-list">
                <h3>Current Order:</h3>
                
                <div className="totals">
                    <p>Subtotal: ${subtotal}</p>
                    <p>Tax: ${tax}</p>
                    <p>Total: ${total}</p>
                </div>
            </div>
            <div>
                <Button variant="contained" color="secondary">Cancel Order</Button>
                <Button variant="contained" onClick={finishOrder}>Finish Order</Button>
            </div>
        </div>
    );
}

export default OrderArea;
