import banner from "../images/banner.PNG"
import Button from '@mui/material/Button';
import { ThemeProvider } from '@mui/material/styles';
import { useNavigate } from "react-router-dom";
import "./Home.css"
import theme from "../createTheme"

// Purpose: Overall home page to allow user to choose between the 4 views
// The four views include:
// 1. Customer
// 2. Cashier
// 3. Manager
// 4. Menu Board

function Home(){
    const navigate = useNavigate();
    
    // Navigates user to correct view
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
            {/* Content of Page */}
            <div>
                <div className="banner-div">
                    <img className="main-banner" src={banner} alt="Panda Express Banner"></img>
                </div>

                {/* Buttons for the views */}
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
