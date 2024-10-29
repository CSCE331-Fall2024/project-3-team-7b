import ManagerBanner from '../manager/managerBanner';
import { ThemeProvider } from '@mui/material/styles';
//import styles from "./inventory.module.css";
import theme from "../../createTheme"

function Inventory(){
    return (
        <ThemeProvider theme={theme}>
            <div>
                <ManagerBanner/>
            </div>
       </ThemeProvider>
    );
}

export default Inventory;
