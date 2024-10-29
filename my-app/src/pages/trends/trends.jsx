import ManagerBanner from '../manager/managerBanner';
import { ThemeProvider } from '@mui/material/styles';
// import styles from "./trends.module.css";
import theme from "../../createTheme"

function Trends(){
    return (
        <ThemeProvider theme={theme}>
            <div>
                <ManagerBanner/>
            </div>
       </ThemeProvider>
    );
}

export default Trends;
