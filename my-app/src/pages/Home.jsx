import banner from "../images/banner.PNG"
import Button from '@mui/material/Button';
import { ThemeProvider } from '@mui/material/styles';
import { useNavigate } from "react-router-dom";
import "./Home.css"
import theme from "../createTheme"

function Home(){
    const navigate = useNavigate();
    
    const handleCustomerView = () => {
        navigate("/customer");
    }
    const handleCashierView = () => {
        navigate("/cashier");
    }
    const handleManagerView = () => {
        navigate("/manager");
    }
    const handleMenuView = () => {
        navigate("/menu");
    }
    return (
        <ThemeProvider theme={theme}>
            <div>
                <div className="banner-div">
                    <img className="main-banner" src={banner} alt="Panda Express Banner"></img>
                </div>

                <div className="button-div">
                    <Button className="home-buttons" variant="contained" onClick={handleCustomerView}>
                        Customer View
                    </Button>
                    <Button className="home-buttons" variant="contained" onClick={handleCashierView}>
                        Cashier View
                        </Button>
                    <Button className="home-buttons" variant="contained" onClick={handleManagerView}>
                        Manager View
                        </Button>
                    <Button className="home-buttons" variant="contained" onClick={handleMenuView}>
                        Menu View
                        </Button>
                </div>
            </div>
       </ThemeProvider>
    );
}

export default Home;
