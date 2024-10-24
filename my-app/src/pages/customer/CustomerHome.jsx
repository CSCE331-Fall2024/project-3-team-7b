import logo from "../../images/logo.png"
import Button from '@mui/material/Button';
import { ThemeProvider } from '@mui/material/styles';
import { useNavigate } from "react-router-dom";
import "./customer.css"
import theme from "../../createTheme"

function CustomerHome(){
    const navigate = useNavigate();
    
    const startOrder = () => {
        navigate("/customer/order");
    }

    return (
        <ThemeProvider theme={theme}>
            <div>
                <div>
                    <Button className="translate-button" variant="contained">Select A Language</Button>
                </div>

                <div className="customer-content-div">
                    <div className="logo-div">
                        <img className="logo" src={logo} alt="Panda Express Banner"></img>
                    </div>
                    <div>
                    <Button className="order-button" variant="contained" onClick={startOrder}>Start Order</Button>
                    </div>
                    <div className="weather-div">
                        <h1>Today's Weather:</h1>
                        <div>
                            <p>Something that shows the current weather</p>
                        </div>
                        <div>
                            <h3>Item of the Day:</h3>
                        </div>
                    </div>
                </div>
            </div>
       </ThemeProvider>
    );
}

export default CustomerHome;
