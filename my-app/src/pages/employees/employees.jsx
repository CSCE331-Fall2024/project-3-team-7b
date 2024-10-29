import ManagerBanner from '../manager/managerBanner';
import { ThemeProvider } from '@mui/material/styles';
//import styles from "./employees.module.css";
import theme from "../../createTheme"

function Employees(){
    return (
        <ThemeProvider theme={theme}>
            <div>
                <ManagerBanner/>
            </div>
       </ThemeProvider>
    );
}

export default Employees;