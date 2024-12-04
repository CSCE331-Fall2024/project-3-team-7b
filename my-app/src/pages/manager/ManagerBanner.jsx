import Banner from '../../components/order/Banner';
import { Button } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { useNavigate } from "react-router-dom";
import styles from "./managerBanner.module.css";
import theme from '../../createTheme';
import { useEnlarge } from "../../EnlargeContext";

function ManagerBanner(props){
    const navigate = useNavigate();
    const view = props.view;
    const setAuthentication = props.setAuthentication;

    const { isEnlarged } = useEnlarge();
    
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
                <div className={styles['banner']}>
                    <Banner view={view} setAuthentication={setAuthentication} />
                </div>

                <div className={styles["button-div"]}>
                    <Button sx={isEnlarged ? { fontSize: '1rem'} : {}} className={styles["man-home-buttons"]} variant="contained" onClick={handleTrends}>
                        Trends
                    </Button>
                    <Button  sx={isEnlarged ? { fontSize: '1rem'} : {}} className={styles["man-home-buttons"]} variant="contained" onClick={handleItems}>
                        Items
                    </Button>
                    <Button sx={isEnlarged ? { fontSize: '1rem'} : {}} className={styles["man-home-buttons"]} variant="contained" onClick={handleComponents}>
                        Components
                    </Button>
                    <Button sx={isEnlarged ? { fontSize: '1rem'} : {}} className={styles["man-home-buttons"]} variant="contained" onClick={handleInventory}>
                        Inventory
                    </Button>
                    <Button sx={isEnlarged ? { fontSize: '1rem'} : {}} className={styles["man-home-buttons"]} variant="contained" onClick={handleEmployees}>
                        Employees
                    </Button>
                </div>
            </div>
       </ThemeProvider>
    );
}

export default ManagerBanner;
