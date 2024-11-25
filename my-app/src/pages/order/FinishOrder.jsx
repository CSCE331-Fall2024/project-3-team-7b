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

    // const submitOrder = async() => {
    //     const baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';
    //     try {
    //         axios.put('${baseURL}/api/orders/submit', {
    //             params: {
    //                 orderID: orderID,
    //                 employeeID: employeeID,
    //                 numItems: numItems,
    //                 orderTotal: orderTotal
    //             }
    //         });
    //         axios.put('${baseURL}/api/orderxmenu_item/submit', {
    //             params: {
    //                 ID: menuItemTableID,
    //                 orderID: orderID,
    //                 itemID: itemID
    //             }
    //         })
    //         axios.put('${baseURL}/api/orderxcomponent/submit', {
    //             params: {
    //                 ID: componentTableID,
    //                 orderID: orderID,
    //                 componentID: componentID
    //             }
    //         })

    //         axios.put('${baseURL}/api/transactions/submit', {
    //             params: {
    //                 transactionID: transactionID,
    //                 orderID: orderID,
    //                 employeeID: employeeID,
    //                 paymentMethod: paymentMethod,
    //                 amount: orderTotal,
    //                 timestamp: timestamp,
    //                 status: "Complete"
    //             }
    //         });
    //     }
    // }


    // Place the order and clear redux storage for new order
    const placeOrder = async() => {
        const baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';
        let orderID;
        let transactionID;
        let employeeID;
        const numItems = subtotals.length;
        const orderTotal = sum(subtotals) * 1.0875;
        const paymentMethod = Math.random() < 0.5 ? "card" : "digital wallet";
        const timestamp = "CURRENT_TIMESTAMP";
        const status = "Complete";

        // get last order id
        try {
            const response = await axios.get(`${baseURL}/api/orderID`);
            orderID = parseInt(response.data) + 1;
        } catch (error) {
            console.error("Error fetching order ID");
        }

        // get last transaction id
        try {
            const response = await axios.get(`${baseURL}/api/transactionID`);
            transactionID = parseInt(response.data) + 1;
        } catch (error) {
            console.error("Error fetching transaction ID");
        }

        // if cashier view, get id
        // else, set id to 0
        if (view == "cashier") {
            try {
                const response = await axios.get(`${baseURL}/bruh`);
                employeeID = parseInt(response.data);
            } catch (error) {
                console.error("Error fetching employee ID");
            }
        }
        else {
            employeeID = 0;
        }

        console.log(baseURL, orderID, transactionID, employeeID, numItems, orderTotal, paymentMethod, timestamp, status);

        // insert into order table
        // insert into orderxmenu_item table
        // insert into orderxcomponents table

        // insert into transactions table

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