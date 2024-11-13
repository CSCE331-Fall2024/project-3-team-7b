// MenuDisplay.js
import React from "react";
import "./orderComponents.css";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

// Purpose: Displays everything the user has selected for the order

// Dynamically load all images from a folder
const importAll = (r) => {
    return r.keys().map(r);
}

// Import all images from the images folder (you can adjust the path)
const images = importAll(require.context("../../images/small_menu", false, /\.(png)$/));

function OrderArea(props) {
    const subtotal = props.subtotal;
    const tax = props.tax;
    const total = props.total;
    const order = props.order;
    const view = props.view;
    const navigate = useNavigate();

    // Navigates user to complete the order
    const finishOrder = () => {
        navigate("/" + view + "/order/finish");
    }

    // Brings user back to "Start Order" page
    const cancelOrder = () => {
        navigate("/" + view);
    }

    return (
        <div className="order-area">
            <div className="order-list">
                {/* Lists contents of current order */}
                <h3>Current Order:</h3>
                <p>{order}</p>
                
                {/* Calulates and displays the price of the order */}
                <div className="totals">
                    <p>Subtotal: ${subtotal}</p>
                    <p>Tax: ${tax}</p>
                    <p>Total: ${total}</p>
                </div>
            </div>
            <div>
                <Button variant="contained" color="secondary" onClick={cancelOrder}>Cancel Order</Button>
                <Button variant="contained" onClick={finishOrder}>Finish Order</Button>
            </div>
        </div>
    );
}

export default OrderArea;
