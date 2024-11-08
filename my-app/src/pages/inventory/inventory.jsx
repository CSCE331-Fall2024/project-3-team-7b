import ManagerBanner from '../manager/managerBanner';
import React, {useEffect, useState} from "react";
import { ThemeProvider } from '@mui/material/styles';
import styles from "./inventory.module.css";
import theme from "../../createTheme"
import axios from "axios";
import InventoryTable from '../../components/manager/InventoryTable';


function Inventory(props){
    const[inventory, setInventory] = useState([]);
    //const[thresholds, setThresholds] = useState([]);
    useEffect(() => {
        const getInventory = async () => {
            try{
                const response = await axios.get("http://localhost:5001/api/inventory");
                setInventory(response.data);
                
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
                    <InventoryTable data={inventory}/>
                </div>
                <div className={styles['editor-container']}>
                    <div className={styles['text-boxes']}>
                        <input type="text" placeholder='Item'/>
                        <input type="text" placeholder='Quantity'/>
                        <input type="text" placeholder='Unit'/>
                        <input type="text" placeholder='Supplier'/>
                        <input type="text" placeholder='Threshold'/>
                    </div>
                    <div className={styles['buttons']}>
                        <button>Save</button>
                        <button>Add</button>
                        <button>Delete</button>
                    </div>
                </div>
            </div>
       </ThemeProvider>
    );
}

export default Inventory;
