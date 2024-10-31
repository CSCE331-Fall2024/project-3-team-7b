import ManagerBanner from '../manager/managerBanner';
import Table from '../../components/table';
import React, {useEffect, useState} from "react";
import { ThemeProvider } from '@mui/material/styles';
import styles from "./inventory.module.css";
import theme from "../../createTheme"
import axios from "axios";


function Inventory(props){
    // const[inventory, setInventory] = useState([]);
    // useEffect(() => {
    //     const getInventory = async () => {
    //         try{
    //             const response = await axios.get("http://localhost:5001/api/Inventory");
    //             console.log("inventory: ", response.data);
    //             setInventory(response.data);
                
    //         } catch(error){
    //             console.error("Error getting inventory information: ", error);
    //         }
    //     };

    //     getInventory();
    // }, []);
    

    const view = props.view;
    const setAuthentication = props.setAuthentication;

    return (
        <ThemeProvider theme={theme}>
            <div>
                <ManagerBanner view={view} setAuthentication={setAuthentication}/>
            </div>
            <div className={styles['divider']}>
                <div className={styles['table-container']}> 
                    {/* <Table data={inventory}/> */}
                </div>
                <div className={styles['editor-container']}>
                    bye
                </div>
            </div>
       </ThemeProvider>
    );
}

export default Inventory;
