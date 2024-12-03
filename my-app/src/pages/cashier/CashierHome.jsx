import logo from "../../images/logo.png";
import Button from '@mui/material/Button';
import { ThemeProvider } from '@mui/material/styles';
import { useNavigate } from "react-router-dom";
import "./cashier.css";
import theme from "../../createTheme";
import { useDispatch, useSelector } from 'react-redux';
import TodayTopItem from "../../components/order/TodayTopItem";
import TransactionSummary from "../../components/order/TransactionSummary";

// Purpose: Overall home page for the cashiers

function CashierHome() {
    // Fetch current values of subtotal and order from redux storage
    const navigate = useNavigate();
    const subtotal = useSelector((state) => state.subtotal);
    const order = useSelector((state) => state.order);
    
    // Navigates cashier to start an order
    const startTransaction = () => {
        navigate("/cashier/order", {state: {view: "cashier"}});
    }

    // Navigates back to overall home page
    const goBack = () => {
        navigate("/"); 
    }

    return (
        <ThemeProvider theme={theme}>
            <div>
                {/* Accessibility features */}
                <div>
                    <Button className="translate-button" variant="contained">Select A Language</Button>
                </div>

                {/* Main content of page */}
                <div className="cashier-content-div">
                    <div className="logo-div">
                        <img className="logo" src={logo} alt="Panda Express Banner"></img>
                    </div>
                    <div>
                        <Button className="start-transaction-button" variant="contained" onClick={startTransaction}>Start Transaction</Button>
                    </div>
                    <div>
                        <Button className="back-button" variant="contained" onClick={goBack}>Back</Button>
                    </div>

                    {/* Customized information + details */}
                    <div className="summary-div">
                        <h1>Transaction Summary:</h1>
                        <div>
                            <h3>Total Sales Made Today:</h3>
                            <TransactionSummary />
                        </div>
                        <div>
                            <h3>Top-Selling Item of the Day:</h3>
                            <TodayTopItem />
                        </div>
                    </div>
                </div>
            </div>
       </ThemeProvider>
    );
}

export default CashierHome;
