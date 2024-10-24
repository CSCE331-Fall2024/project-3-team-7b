import { Button } from "@mui/material";
import Banner from "../../components/order/Banner";
import { ThemeProvider } from "@emotion/react";
import theme from "../../createTheme"
import { useNavigate } from "react-router-dom";

function OrderConfirmation() {
    const orderNumber = 123456;
    const navigate = useNavigate();

    const newOrder = () => {
        navigate("/customer");
    }

    return (
        <ThemeProvider theme={theme}>
            <div className="finish">
                <div className="banner">
                    <Banner />
                </div>
                <div className="finish-content">
                    <div className="order-confirmation">
                        <h2>ORDER PLACED!</h2>
                        <h4>YOUR ORDER # IS:</h4>
                        <h2>{orderNumber}</h2>
                        <h4>YOUR FOOD WILL BE OUT SHORTLY!</h4>
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