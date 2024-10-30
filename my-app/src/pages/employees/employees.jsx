import ManagerBanner from '../manager/managerBanner';
import { ThemeProvider } from '@mui/material/styles';
//import styles from "./employees.module.css";
import theme from "../../createTheme"

function Employees(props){
    const view = props.view;
    const setAuthentication = props.setAuthentication;

    return (
        <ThemeProvider theme={theme}>
            <div>
                <ManagerBanner view={view} setAuthentication={setAuthentication}/>
            </div>
       </ThemeProvider>
    );
}

export default Employees;