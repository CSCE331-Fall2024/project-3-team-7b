import ManagerBanner from '../manager/managerBanner';
import React, {useEffect, useState} from "react";
import { ThemeProvider } from '@mui/material/styles';
import styles from "./inventory.module.css";
import theme from "../../createTheme"
import axios from "axios";
import InventoryTable from '../../components/manager/InventoryTable';


function Inventory(props){
    const[inventory, setInventory] = useState([]);
    const[whichRow, setRow] = useState(null);
    const[error, setError] = useState('');
    const[newItemID, setItemID] = useState(null);
    const[data, setData] = useState({
        name: '',
        quant: '',
        unit: '',
        sup: '',
        thresh: ''
    });

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

    const updateInventory = async (itemID, newData) => {
        try{
            const response = await axios.put(`http://localhost:5001/api/inventory/${itemID}`, newData);
        } catch(error){
            console.error("Unable to update item");
        }
    };

    const getInventoryID = async () =>{
        try{
            const response = await axios.get("http://localhost:5001/api/inventoryID");
            return response.data;
        } catch (error){
            console.error("Unable to get new ItemID");
            return null;
        }
    };

    const addInventory = async (newData) => {
        try{
            const response = await axios.post(`http://localhost:5001/api/inventory/add`, newData);
            return response.data;
        } catch(error){
            console.error("Unable to add inventory item");
        }
    };
    
    const getRow = (row) =>{
        if(whichRow && whichRow.item_name == row.item_name){
            setRow(null);
        }
        else{
            setRow(row);
            setData({
                name: row.item_name,
                quant: row.quantity,
                unit: row.unit,
                sup: row.supplier,
                thresh: row.threshold
            });
        }
    };

    const input = (e) => {
        const {name, value} = e.target;
        setData((original) => ({
            ...original,
            [name] : value
        }));
    };

    const updateButton = async () => {
        const newData = {
            item_name: data.name,
            quantity: data.quant,
            unit: data.unit,
            supplier: data.sup,
            threshold: data.thresh,
            needs_restock: data.quant < data.thresh
        };

        if(isNaN(parseFloat(data.quant))){
            setError('Please input a valid quantity');
            return;
        }

        if(isNaN(parseFloat(data.thresh))){
            setError('Please input a valid threshold');
            return;
        }
        setError('');

        try{
            await updateInventory(whichRow.item_name, newData);

            setInventory((prev) =>
                prev.map((item) =>
                   item.item_name == whichRow.item_name ? {...item, ...newData} : item 
                )
            );
        } catch (error){
        console.error("Can't update item: ", error);
        }
    }

    const addButton = async () => {
        console.log("current data: ", data);

        const newID = await getInventoryID();
        
        console.log("returned id: ", newID);
        if(newID == null){
            setError("Can't get the new ID");
            return;
        }
        console.log("after data: ", data);
        try {
            const newData = {
                itemID: (parseInt(newID) + 1),
                item_name: data.name,
                quantity: parseFloat(data.quant),
                unit: data.unit,
                supplier: data.sup,
                needs_restock: parseFloat(data.quant) < parseFloat(data.thresh),
                threshold: parseInt(data.thresh),
            };
    
            if(data.name == ''){
                setError('Please input a valid name');
                return;
            }
            if(isNaN(parseFloat(data.quant))){
                setError('Please input a valid quantity');
                return;
            }
            if(data.unit == ''){
                setError('Please input a valid unit');
                return;
            }
            if(data.sup == ''){
                setError('Please input a valid supplier');
                return;
            }
            if(isNaN(parseFloat(data.thresh))){
                setError('Please input a valid threshold');
                return;
            }
            setError('');
            console.log("up to here", newData);
        
            // Send POST request to API
            const response = await axios.post('http://localhost:5001/api/inventory/add', newData);
        
            // Handle the response (if item was successfully added)
            console.log('Item added successfully:', response.data);
          } catch (error) {
            // Handle errors
            console.error('Error adding item:', error);
          }
    }

    const view = props.view;
    const setAuthentication = props.setAuthentication;

    return (
        <ThemeProvider theme={theme}>
            <div>
                <ManagerBanner view={view} setAuthentication={setAuthentication}/>
            </div>
            <div className={styles['divider']}>
                <div className={styles['table-container']}> 
                    <InventoryTable data={inventory} rowSelect={getRow}/>
                </div>
                <div className={styles['editor-container']}>
                    <div className={styles['text-boxes']}>
                        {error && <p className={styles['error']}>{error}</p>}
                        <input type="text" name='name' onChange={input} placeholder='Item' value={data.name}/>
                        <input type="text" name='quant' onChange={input} placeholder='Quantity' value={data.quant}/>
                        <input type="text" name='unit' onChange={input} placeholder='Unit' value={data.unit}/>
                        <input type="text" name='sup' onChange={input} placeholder='Supplier' value={data.sup}/>
                        <input type="text" name='thresh' onChange={input} placeholder='Threshold' value={data.thresh}/>
                    </div>
                    <div className={styles['buttons']}>
                        <button onClick={updateButton}>Update</button>
                        <button onClick={addButton}>Add</button>
                        <button>Delete</button>
                    </div>
                </div>
            </div>
       </ThemeProvider>
    );
}

export default Inventory;
