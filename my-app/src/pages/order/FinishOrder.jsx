import { Button } from "@mui/material";
import Banner from "../../components/order/Banner";
import { ThemeProvider } from "@emotion/react";
import theme from "../../createTheme"
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { useEnlarge } from "../../EnlargeContext";

function FinishOrder(props) {
    const orders = useSelector((state) => state.orders.at(1));
    const view = props.view;
    const setAuthentication = props.setAuthentication;
  
    // context to know if text should be enlarged
    const { isEnlarged } = useEnlarge();

    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Place the order and clear redux storage for new order
    const placeOrder = () => {
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