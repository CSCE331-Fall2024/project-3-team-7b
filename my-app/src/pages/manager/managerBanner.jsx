import Banner from '../../components/order/Banner';
import { Button } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { useNavigate } from "react-router-dom";
import styles from "./managerBanner.module.css";
import theme from '../../createTheme';

function ManagerBanner(props){
    const navigate = useNavigate();
    const view = props.view;
    const setAuthentication = props.setAuthentication;
    
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

    return (
        <ThemeProvider theme={theme}>
            <div>
                <div className={styles['banner']}>
                    <Banner view={view} setAuthentication={setAuthentication} />
                </div>

                <div className={styles["button-div"]}>
                    <Button className={styles["home-buttons"]} variant="contained" onClick={handleTrends}>
                        Trends
                    </Button>
                    <Button className={styles["home-buttons"]} variant="contained" onClick={handleInventory}>
                        Inventory
                        </Button>
                    <Button className={styles["home-buttons"]} variant="contained" onClick={handleItems}>
                        Items
                        </Button>
                    <Button className={styles["home-buttons"]} variant="contained" onClick={handleEmployees}>
                        Employees
                        </Button>
                </div>
            </div>
       </ThemeProvider>
    );
}

export default ManagerBanner;