import { Button } from "@mui/material";
import Banner from "../../components/order/Banner";
import { ThemeProvider } from "@emotion/react";
import theme from "../../createTheme"
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';

function FinishOrder(props) {
    const view = props.view;
    const setAuthentication = props.setAuthentication;
    const order = useSelector((state) => state.order);
    const navigate = useNavigate();

    const placeOrder = () => {
        navigate("/" + view + "/order/confirmation");
    }

    const cancelOrder = () => {
        navigate("/" + view);
    }

    // Format order to be displayed in the HTML code
    const formattedOrder = order.replaceAll("\n", "<br />").replaceAll("\t", "&nbsp;&nbsp;&nbsp;&nbsp;");
    return (
        <ThemeProvider theme={theme}>
            <div className="finish">
                <div className="banner">
                    <Banner view={view} setAuthentication={setAuthentication}/>
                </div>
                <div className="finish-content">
                    <div className="finish-order-content">
                        <h2>Current Order:</h2>
                        <p dangerouslySetInnerHTML={{__html: formattedOrder}}></p>
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