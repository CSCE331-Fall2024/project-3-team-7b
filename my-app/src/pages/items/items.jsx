import ManagerBanner from '../manager/managerBanner';
import { ThemeProvider } from '@mui/material/styles';
//import styles from "./items.module.css";
import theme from "../../createTheme"

function Items(){
    return (
        <ThemeProvider theme={theme}>
            <div>
                <ManagerBanner/>
            </div>
       </ThemeProvider>
    );
}

export default Items;