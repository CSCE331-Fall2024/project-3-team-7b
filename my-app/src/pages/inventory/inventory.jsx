import ManagerBanner from '../manager/managerBanner';
import React, {useEffect, useState} from "react";
import { ThemeProvider } from '@mui/material/styles';
import styles from "./inventory.module.css";
import theme from "../../createTheme"
import axios from "axios";
import InventoryTable from '../../components/manager/InventoryTable';


function Inventory(props){
    //stores the inventory in inventory table and function used to set the inventory
    const[inventory, setInventory] = useState([]);
    //contains the data for the row that is selected within the table, function used to fund the selected row
    const[whichRow, setRow] = useState(null);
    //used to store the error message for invalid user input, function used to set this message
    const[error, setError] = useState('');
    //boolean value used to rerender the table once a new inventory item has been added
    const[render, setRender] = useState(false);
    //data variable storing all of the data in a given row, function used to set the data variable
    const[data, setData] = useState({
        name: '',
        quant: '',
        unit: '',
        sup: '',
        thresh: ''
    });

    useEffect(() => {
        //gets all of the inventory from the inventory table within the database
        const getInventory = async () => {
            try{
                const response = await axios.get("http://localhost:5001/api/inventory");
                setInventory(response.data);
                
            } catch(error){
                console.error("Error getting inventory information: ", error);
            }
        };


        getInventory();
    }, [render]);

    //call to update specified inventory item to new data
    const updateInventory = async (itemID, newData) => {
        try{
            const response = await axios.put(`http://localhost:5001/api/inventory/${itemID}`, newData);
        } catch(error){
            console.error("Unable to update item");
        }
    };

    //retrieves the maximum inventory ID from the inventory table within the database
    const getInventoryID = async () =>{
        try{
            const response = await axios.get("http://localhost:5001/api/inventoryID");
            return response.data;
        } catch (error){
            console.error("Unable to get new ItemID");
            return null;
        }
    };

    //call to add new inventory item to inventory table within the databse
    const addInventory = async (newData) => {
        try{
            const response = await axios.post(`http://localhost:5001/api/inventory/add/${newData.itemID}`, newData);
            return response.data;
        } catch(error){
            console.error("Fails post: ", error);
        }
    };

    // deletes specified inventory item within the inventory table of the database
    const deleteInventory = async(itemName) => {
        try{
            const response = await axios.delete(`http://localhost:5001/api/inventory/delete/${itemName}`);
            console.log("Inventory item deleted")
        } catch(error){
            console.log("Error deleting inventory item: ", error);
        }
    };

    //checks whether specified inventory item already exists given its name
    const doesInventoryExist = async(itemName) => {
        try{
            const response = await axios.get(`http://localhost:5001/api/inventory/check/${itemName}`)
            return response.data;
        } catch (error){
            console.log("Error checking item: ", error);
        }
    }
    
    //function used to get all of the data associated with a given row
    const getRow = (row) =>{
        //this conditional is used to give deselection functionality
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

    //handles user input in the editor panel 
    const input = (e) => {
        const {name, value} = e.target;
        setData((original) => ({
            ...original,
            [name] : value
        }));
    };

    //function that is called once the update button is clicked
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
    };

    //function that is called when add button is clicked
    const addButton = async () => {
        console.log("current data: ", data);

        const newID = await getInventoryID();
        
        console.log("returned id: ", newID);
        if(newID == null){
            setError("Can't get the new ID");
            return;
        }
        setError('');
        
        const ex = await doesInventoryExist(data.name);
        if(ex){
            setError("Please create a new item");
            return;
        }
        setError('');

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

            const additional = await addInventory(newData);
            setInventory((prev) =>
                [...prev, additional]
            );
          } catch (error) {
            // Handle errors
            console.error('Error adding item:', error);
          }
    };

    //function that is called once the delete button is clicked
    const deleteButton = async () =>{
        const deleteName = data.name;
        try{
            const ex = await doesInventoryExist(deleteName);
            console.log("exists: ", ex);

            if(!ex){
                setError("Please select an iventory item");
                return;
            }
            setError('');
            await deleteInventory(deleteName);
            setRender((prev) => !prev);

        } catch (error){
            console.log(error);
        }
    };

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
                        <button onClick={deleteButton}>Delete</button>
                    </div>
                </div>
            </div>
       </ThemeProvider>
    );
}

export default Inventory;
