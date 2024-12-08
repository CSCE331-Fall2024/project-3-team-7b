import { Button } from "@mui/material";
import Banner from "../../components/order/Banner";
import { ThemeProvider } from "@emotion/react";
import theme from "../../createTheme"
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { useEnlarge } from "../../EnlargeContext";
import axios from 'axios';

function FinishOrder(props) {
    const subtotals = useSelector((state) => state.orders.at(0));
    const orders = useSelector((state) => state.orders.at(1));
    const view = props.view;
    const setAuthentication = props.setAuthentication;
    const employeeID = props.employeeID;
  
    // context to know if text should be enlarged
    const { isEnlarged } = useEnlarge();

    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Sum up all elements of an array
    const sum = (array) => {
        let current_sum = 0;
        for (let i = 0; i < array.length; i++) {
            current_sum += array.at(i);
        }
        return current_sum;
    }

    // Place the order and clear redux storage for new order
    const placeOrder = async() => {
        const baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';
        let orderID;
        let transactionID;
        const numItems = subtotals.length;
        const orderTotal = sum(subtotals) * 1.0875;
        const paymentMethod = Math.random() < 0.5 ? "card" : "digital wallet";

        // get new order id
        try {
            const response = await axios.get(`${baseURL}/api/orderID`);
            orderID = parseInt(response.data) + 1;
        } catch (error) {
            console.error("Error fetching order ID");
        }

        // get new transaction id
        try {
            const response = await axios.get(`${baseURL}/api/transactionID`);
            transactionID = parseInt(response.data) + 1;
        } catch (error) {
            console.error("Error fetching transaction ID");
        }

        // insert into orders table
        try {
            const order = {orderID: orderID, employeeID: employeeID, numItems: numItems, orderTotal: orderTotal};
            const response = await axios.post(`${baseURL}/api/orders/add`, order);
        } catch (error) {
            console.error("Error adding to orders table");
        }

        // insert into transactions table
        try {
            const transaction = {transactionID: transactionID, orderID: orderID, employeeID: employeeID, paymentMethod: paymentMethod, orderTotal: orderTotal};
            const response = await axios.post(`${baseURL}/api/transactions/add`, transaction)
        } catch (error) {
            console.error("Error adding to transactions table")
        }

        // insert into orderxmenu_item table
        // insert into orderxcomponents table

        

        // decrement inventory

        // decrement inventory plastics


        dispatch({type: "write", data: {orders: [[], []], isComplete: false}});
        navigate("/" + view + "/order/confirmation");
    }

    // Cancel the order and clear redux storage for new order
    const cancelOrder = () => {
        dispatch({type: "write", data: {orders: [[], []], isComplete: false}});
        navigate("/" + view);
    }

    // Overrides the toString() method of the order array so that the current order can be converted to a string for HTML code
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

    // Format order to be displayed in the HTML code
    const formattedOrder = orders.toString().replaceAll("\n", "<br />").replaceAll("\t", "&nbsp;&nbsp;&nbsp;&nbsp;");
    return (
        <ThemeProvider theme={theme}>
            <div className="finish">
                <div className="banner">
                    <Banner view={view} setAuthentication={setAuthentication}/>
                </div>
                <div className="finish-content">
                    <div className="finish-order-content">
                        <h2 className={`${isEnlarged ? 'h2-enlarged' : ''}`}>Current Order:</h2>
                        <p className={`${isEnlarged ? 'p-enlarged' : ''}`} dangerouslySetInnerHTML={{__html: formattedOrder}}></p>
                    </div>
                    <div className="finish-buttons">
                        <Button variant="contained" color="secondary" onClick={cancelOrder}>Cancel Order</Button>
                        <Button variant="contained" onClick={placeOrder}>Pay Now</Button>
                    </div>
                </div>
                
            </div>
        </ThemeProvider>
    );
}

export default FinishOrder