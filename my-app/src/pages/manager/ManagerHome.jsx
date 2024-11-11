import banner from '../../images/banner.PNG';
import Button from '@mui/material/Button';
import { ThemeProvider } from '@mui/material/styles';
import { useNavigate } from "react-router-dom";
import "./ManagerHome.css";
import theme from "../../createTheme"

function ManagerHome(){
    const navigate = useNavigate();
    
    const handleTrends = () => {
        navigate("/manager/trends");
    }
    const handleInventory = () => {
        navigate("/manager/inventory");
    }
    const handleItems = () => {
        navigate("/manager/items");
    }
    const handleEmployees = () => {
        navigate("/manager/employees");
    }
    const handleComponents = () => {
        navigate("/manager/components");
    }
    return (
        <ThemeProvider theme={theme}>
            <div>
                <div className="banner-div">
                    <img className="main-banner" src={banner} alt="Panda Express Banner"></img>
                </div>

                <div className="button-div">
                    <Button className="man-home-buttons" variant="contained" onClick={handleTrends}>
                        Trends
                    </Button>
                    <Button className="man-home-buttons" variant="contained" onClick={handleItems}>
                        Items
                    </Button>
                    <Button className="man-home-buttons" variant="contained" onClick={handleComponents}>
                        Components
                    </Button>
                    <Button className="man-home-buttons" variant="contained" onClick={handleInventory}>
                        Inventory
                    </Button>
                    <Button className="man-home-buttons" variant="contained" onClick={handleEmployees}>
                        Employees
                    </Button>
                </div>
            </div>
       </ThemeProvider>
    );
}

export default ManagerHome;
