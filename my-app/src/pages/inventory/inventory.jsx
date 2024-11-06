import ManagerBanner from '../manager/managerBanner';
import React, {useEffect, useState} from "react";
import { ThemeProvider } from '@mui/material/styles';
import styles from "./inventory.module.css";
import theme from "../../createTheme"
import axios from "axios";
import InventoryTable from '../../components/manager/InventoryTable';


function Inventory(props){
    const[inventory, setInventory] = useState([]);
    const[thresholds, setThresholds] = useState([]);
    useEffect(() => {
        const getInventory = async () => {
            try{
                const response = await axios.get("http://localhost:5001/api/inventory");
                setInventory(response.data);

                const threshold = await Promise.all(
                    response.data.map(async (item) => {
                        const need = await axios.get(`http://localhost:5001/api/threshold/${item.item_name}`);
                        return {itemName: item.item_name, highlight: need.data.needs_restock};
                    })
                );

                const updateColor = threshold.reduce((acc, {itemName, highlight}) =>{
                    acc[itemName] = highlight;
                    return acc;
                }, {});

                setThresholds(updateColor);
                
            } catch(error){
                console.error("Error getting inventory information: ", error);
            }
        };

        getInventory();
    }, []);
    

    const view = props.view;
    const setAuthentication = props.setAuthentication;

    return (
        <ThemeProvider theme={theme}>
            <div>
                <ManagerBanner view={view} setAuthentication={setAuthentication}/>
            </div>
            <div className={styles['divider']}>
                <div className={styles['table-container']}> 
                    <InventoryTable data={inventory} rowColor={thresholds} />
                </div>
                <div className={styles['editor-container']}>
                    bye
                </div>
            </div>
       </ThemeProvider>
    );
}

export default Inventory;
