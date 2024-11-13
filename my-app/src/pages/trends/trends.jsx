import ManagerBanner from '../manager/managerBanner';
import { ThemeProvider } from '@mui/material/styles';
// import styles from "./trends.module.css";
import theme from "../../createTheme"
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useState } from 'react';
import ItemPerfomance from '../../components/manager/ItemPerfomance';
import "./trends.css"
import ProductUsage from '../../components/manager/ProductUsage';
import SalesReport from '../../components/manager/SalesReport';

// Purpose: Displays the different trends a manager can view

function Trends(props){
    const view = props.view;
    const setAuthentication = props.setAuthentication;
    const [trend, setTrend] = useState("");

    // Updates the trend selected
    const changeTrend = (event) => {
        setTrend(event.target.value);
    }

    return (
        <ThemeProvider theme={theme}>
            <div >
                <ManagerBanner view={view} setAuthentication={setAuthentication}/>

                {/* Dropdown to select which trend to view */}
                <div className="trend-select">
                    <FormControl fullWidth>
                        <InputLabel>Select A Trend</InputLabel>
                        <Select
                            label="Select A Trend"
                            onChange={changeTrend}
                            value={trend}
                        >
                            <MenuItem value="item-performance">Item Performance</MenuItem>
                            <MenuItem value="product-usage">Product Usage Chart</MenuItem>
                            <MenuItem value="x-report">Today's Sales Report by Hour</MenuItem>
                            <MenuItem value="y-report">End of Day Report</MenuItem>
                            <MenuItem value="sales-report">Custom Sales Report</MenuItem>
                        </Select>
                    </FormControl>
                </div>

                {/* Actually displays the corresponding trend */}
                { trend === "item-performance" && (
                    <div className="performance-container">
                        <ItemPerfomance />
                    </div>
                )}
                { trend === "product-usage" && (
                    <div className="performance-container">
                        <ProductUsage />
                    </div>
                )}
                { trend === "sales-report" && (
                    <div className="performance-container">
                        <SalesReport />
                    </div>
                )}
            </div>
       </ThemeProvider>
    );
}

export default Trends;
