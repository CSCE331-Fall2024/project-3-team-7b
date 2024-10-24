import { Button } from "@mui/material";
import Banner from "../../components/order/Banner";
import { ThemeProvider } from "@emotion/react";
import theme from "../../createTheme"

function FinishOrder() {
    return (
        <ThemeProvider theme={theme}>
            <div className="finish">
                <div className="banner">
                    <Banner />
                </div>
                <div className="finish-content">
                    <div className="finish-order-content">
                        <h2>Current Order:</h2>
                    </div>
                    <div className="finish-buttons">
                        <Button variant="contained" color="secondary">Cancel Order</Button>
                        <Button variant="contained">Pay Now</Button>
                    </div>
                </div>
                
            </div>
        </ThemeProvider>
    );
}

export default FinishOrder