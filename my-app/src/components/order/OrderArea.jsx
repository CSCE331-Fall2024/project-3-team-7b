// MenuDisplay.js
import React, { useState } from "react";
import "./orderComponents.css";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';

// Purpose: Displays everything the user has selected for the order

// Dynamically load all images from a folder
const importAll = (r) => {
    return r.keys().map(r);
}

// Import all images from the images folder (you can adjust the path)
const images = importAll(require.context("../../images/small_menu", false, /\.(png)$/));

function OrderArea(props) {
    const subtotal = useSelector((state) => state.subtotal);
    const tax = subtotal * 0.0875;
    const total = subtotal + tax;
    const order = useSelector((state) => state.order);
    const view = props.view;
    const navigate = useNavigate();

    // Navigates user to complete the order
    const finishOrder = () => {
        navigate("/" + view + "/order/finish");
    }

    // Brings user back to "Start Order" page
    const dispatch = useDispatch();
    const cancelOrder = () => {
        dispatch({type: "write", data: {subtotal: 0.00, order: ""}});
        navigate("/" + view);
    }
    
    const formmatedSubtotal = subtotal.toFixed(2);
    const formmatedTax = tax.toFixed(2);
    const formattedTotal = total.toFixed(2);
    const formattedOrder = order.replaceAll("\n", "<br />").replaceAll("\t", "&nbsp;&nbsp;&nbsp;&nbsp;");
    return (
        <div className="order-area">
            <div className="order-list">
                {/* Lists contents of current order */}
                <h3>Current Order:</h3>
                <p dangerouslySetInnerHTML={{__html: formattedOrder}}></p>
                
                {/* Calulates and displays the price of the order */}
                <div className="totals">
                    <p>Subtotal: ${formmatedSubtotal}</p>
                    <p>Tax: ${formmatedTax}</p>
                    <p>Total: ${formattedTotal}</p>
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
