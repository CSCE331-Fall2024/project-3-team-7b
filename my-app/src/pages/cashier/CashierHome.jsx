import logo from "../../images/logo.png";
import Button from '@mui/material/Button';
import { ThemeProvider } from '@mui/material/styles';
import { useNavigate } from "react-router-dom";
import "./cashier.css";
import theme from "../../createTheme";

function CashierHome(){
    const navigate = useNavigate();
    
    const startTransaction = () => {
        navigate("/cashier/order"); // Adjust route as needed for starting a transaction
    }

    const goBack = () => {
        navigate("/"); // Adjust route to go back to the main home page
    }

    return (
        <ThemeProvider theme={theme}>
            <div>
                <div>
                    <Button className="translate-button" variant="contained">Select A Language</Button>
                </div>

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
                    <div className="summary-div">
                        <h1>Transaction Summary:</h1>
                        <div>
                            <p>Details for the current or last transaction</p>
                        </div>
                        <div>
                            <h3>Top-Selling Item of the Day:</h3>
                        </div>
                    </div>
                </div>
            </div>
       </ThemeProvider>
    );
}

export default CashierHome;
