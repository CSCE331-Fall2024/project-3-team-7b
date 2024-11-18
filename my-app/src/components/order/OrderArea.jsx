// MenuDisplay.js
import React, { useState } from "react";
import "./orderComponents.css";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { useEnlarge } from "../../EnlargeContext";

// Purpose: Displays everything the user has selected for the order

// Dynamically load all images from a folder
const importAll = (r) => {
    return r.keys().map(r);
}

// Import all images from the images folder (you can adjust the path)
const images = importAll(require.context("../../images/small_menu", false, /\.(png)$/));

function OrderArea(props) {
    // Fetch current values of subtotal and order from redux storage
    const subtotal = useSelector((state) => state.subtotal);
    const tax = subtotal * 0.0875;
    const total = subtotal + tax;
    const order = useSelector((state) => state.order);
    const view = props.view;
    const navigate = useNavigate();

    // context to know if text should be enlarged
    const { isEnlarged } = useEnlarge();

    // Navigates user to complete the order
    const finishOrder = () => {
        navigate("/" + view + "/order/finish");
    }

    // Brings user back to "Start Order" page
    // Update values of subtotal and order in redux storage
    const dispatch = useDispatch();
    const cancelOrder = () => {
        dispatch({type: "write", data: {subtotal: 0.00, order: ""}});
        navigate("/" + view);
    }
    
    // Format subtotal, tax, and order to be displayed in the HTML code
    const formmatedSubtotal = subtotal.toFixed(2);
    const formmatedTax = tax.toFixed(2);
    const formattedTotal = total.toFixed(2);
    const formattedOrder = order.replaceAll("\n", "<br />").replaceAll("\t", "&nbsp;&nbsp;&nbsp;&nbsp;");
    return (
        <div className="order-area">
            <div className="order-list">
                {/* Lists contents of current order */}
                <h3>Current Order:</h3>
                <p className={`${isEnlarged ? 'totals-enlarged' : ''}`} dangerouslySetInnerHTML={{__html: formattedOrder}}></p>
                
                {/* Calulates and displays the price of the order */}
                <div className="totals">
                    <p className={`${isEnlarged ? 'totals-enlarged' : ''}`}>Subtotal: ${formmatedSubtotal}</p>
                    <p className={`${isEnlarged ? 'totals-enlarged' : ''}`}>Tax: ${formmatedTax}</p>
                    <p className={`${isEnlarged ? 'totals-enlarged' : ''}`}>Total: ${formattedTotal}</p>
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
