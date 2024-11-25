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

// Sum up all elements of an array
const sum = (array) => {
    let current_sum = 0;
    for (let i = 0; i < array.length; i++) {
        current_sum += array.at(i);
    }
    return current_sum;
}

// Import all images from the images folder (you can adjust the path)
const images = importAll(require.context("../../images/small_menu", false, /\.(png)$/));

function OrderArea(props) {
    // Fetch current values of subtotal, order, and if order is complete (valid) from redux storage
    const state = useSelector((state) => state);
    const subtotals = useSelector((state) => state.orders.at(0));
    let subtotal = sum(subtotals);
    let tax = subtotal * 0.0875;
    let total = subtotal + tax;
    const orders = useSelector((state) => state.orders.at(1));
    const isComplete = useSelector((state) => state.isComplete);
    console.log(isComplete);

    const view = props.view;
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // context to know if text should be enlarged
    const { isEnlarged } = useEnlarge();

    // Navigates user to complete the order
    const finishOrder = () => {
        navigate("/" + view + "/order/finish");
    }

    // Brings user back to "Start Order" page
    // Cancel the order and clear redux storage for new order
    const cancelOrder = () => {
        dispatch({type: "write", data: {orders: [[], []], isComplete: false}});
        navigate("/" + view);
    }

    // Removes the last item
    const removeItem = () => {
        const newSubtotals = subtotals.slice(0, -1);
        const newOrders = orders.slice(0, -1);
        const isComplete = newSubtotals.length != 0;
        dispatch({type: "write", data: {orders: [[...newSubtotals], [...newOrders]], isComplete: isComplete}});
    }

    const duplicateItem = () => {
        subtotals.push(subtotals.at(-1));
        orders.push(orders.at(-1));
        const isComplete = subtotals.length != 0;
        dispatch({type: "write", data: {orders: [[...subtotals], [...orders]], isComplete: isComplete}});
    }

    // Overrides the toString() method of the order array so that the current order can be converted to a string for HTML code
    console.log(orders);
    orders.toString = function toString() {
        let string = "";
        for (let i = 0; i < this.length; i++) {
            string += this.at(i).at(0);
            for (let j = 1; j < this.at(i).length; j++) {
                string += "\n\t" + this.at(i).at(j);
            }
            string += "\n";
        }
        return string;
    }
    
    // Format subtotal, tax, and order to be displayed in the HTML code
    const formmatedSubtotal = subtotal.toFixed(2);
    const formmatedTax = tax.toFixed(2);
    const formattedTotal = total.toFixed(2);
    const formattedOrders = orders.toString().replaceAll("\n", "<br />").replaceAll("\t", "&nbsp;&nbsp;&nbsp;&nbsp;");
    return (
        <div className="order-area">
            <div className="order-list">
                {/* Lists contents of current order */}
                <h3 className={`${isEnlarged ? 'label-h3-enlarged' : ''}`}>Current Order:</h3>
                <p className={`${isEnlarged ? 'totals-enlarged' : ''}`} dangerouslySetInnerHTML={{__html: formattedOrders}}></p>
                
                {/* Calulates and displays the price of the order */}
                <div className="totals">
                    <p className={`${isEnlarged ? 'totals-enlarged' : ''}`}>Subtotal: ${formmatedSubtotal}</p>
                    <p className={`${isEnlarged ? 'totals-enlarged' : ''}`}>Tax: ${formmatedTax}</p>
                    <p className={`${isEnlarged ? 'totals-enlarged' : ''}`}>Total: ${formattedTotal}</p>
                </div>
            </div>
            <div>
                <Button variant="contained" color="secondary" onClick={removeItem} disabled={!isComplete}>Remove Last Item</Button>
                <Button variant="contained" color="secondary" onClick={cancelOrder}>Cancel Order</Button>
                <Button variant="contained" onClick={duplicateItem} disabled={!isComplete}>Duplicate Last Item</Button>
                <Button variant="contained" onClick={finishOrder} disabled={!isComplete}>Finish Order</Button>
            </div>
        </div>
    );
}

export default OrderArea;
