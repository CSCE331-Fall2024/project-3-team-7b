import ManagerBanner from '../manager/managerBanner';
import { ThemeProvider } from '@mui/material/styles';
// import styles from "./trends.module.css";
import theme from "../../createTheme"
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';

function Trends(props){
    const view = props.view;
    const setAuthentication = props.setAuthentication;

    return (
        <ThemeProvider theme={theme}>
            <div>
                <ManagerBanner view={view} setAuthentication={setAuthentication}/>
                <FormControl fullWidth>
                    <InputLabel>Select A Trend</InputLabel>
                    <Select
                        label="Select A Trend"
                    >
                        <MenuItem>Item Performance</MenuItem>
                        <MenuItem>Product Usage Chart</MenuItem>
                        <MenuItem>X Report</MenuItem>
                        <MenuItem>Y Report</MenuItem>
                        <MenuItem>Sales Report</MenuItem>
                    </Select>
                </FormControl>
            </div>
       </ThemeProvider>
    );
}

export default Trends;
