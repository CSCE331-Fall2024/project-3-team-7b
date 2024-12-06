import ManagerBanner from '../manager/ManagerBanner';
import React, {useEffect, useState} from "react";
import { ThemeProvider } from '@mui/material/styles';
import styles from "./inventory.module.css";
import theme from "../../createTheme"
import axios from "axios";
import InventoryTable from '../../components/manager/InventoryTable';
import { Button } from '@mui/material';
import { FormControl, Box, TextField } from '@mui/material';


function Inventory(props){
    //stores the inventory in inventory table and function used to set the inventory
    const[inventory, setInventory] = useState([]);
    //contains the data for the row that is selected within the table, function used to fund the selected row
    const[whichRow, setRow] = useState(null);
    //used to store the error message for invalid user input, function used to set this message
    const[error, setError] = useState(false);
    const[nameError, setNameError] = useState(false);
    const[addError, setAddError] = useState(false);
    const[quantError, setQuantError] = useState(false);
    const[unitError, setUnitError] = useState(false);
    const[supError, setSupError] = useState(false);
    const[threshError, setThreshError] = useState(false);
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
                const baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';
                const response = await axios.get(`${baseURL}/api/inventory`);
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
            const baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';
            const response = await axios.put(`${baseURL}/api/inventory/${itemID}`, newData);
        } catch(error){
            console.error("Unable to update item");
        }
    };

    //retrieves the maximum inventory ID from the inventory table within the database
    const getInventoryID = async () =>{
        try{
            const baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';
            const response = await axios.get(`${baseURL}/api/inventoryID`);
            return response.data;
        } catch (error){
            console.error("Unable to get new ItemID");
            return null;
        }
    };

    //call to add new inventory item to inventory table within the databse
    const addInventory = async (newData) => {
        try{
            const baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';
            const response = await axios.post(`${baseURL}/api/inventory/add/${newData.itemID}`, newData);
            return response.data;
        } catch(error){
            console.error("Fails post: ", error);
        }
    };

    // deletes specified inventory item within the inventory table of the database
    const deleteInventory = async(itemName) => {
        try{
            const baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';
            //retrieve the inventoryid of the inventory item
            const response = await axios.get(`${baseURL}/api/inventory/itemID/${itemName}`);
            console.log("itemid: ", response.data);

            //delete the entries that contain this itemid in the junction tables
            const resp = await axios.delete(`${baseURL}/api/inventory/deletemxi/${response.data.itemid}`);
            console.log("resp: ", resp);

            const re = await axios.delete(`${baseURL}/api/inventory/deletecxi/${response.data.itemid}`);
            console.log("re: ", re);

            const r = await axios.delete(`${baseURL}/api/inventory/delete/${itemName}`);
            console.log("r: ", r);
            console.log("Inventory item deleted");
        } catch(error){
            console.log("Error deleting inventory item: ", error);
        }
    };

    //checks whether specified inventory item already exists given its name
    const doesInventoryExist = async(itemName) => {
        try{
            const baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';
            const response = await axios.get(`${baseURL}/api/inventory/check/${itemName}`)
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
            setData({
                name: '',
                quant: '',
                unit: '',
                sup: '',
                thresh: ''
            });
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

        // reset error states
        setError(false);
        setAddError(false);
        setNameError(false);
        setQuantError(false);
        setUnitError(false);
        setSupError(false);
        setThreshError(false);
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
        //reset error states
        setError(false);
        setAddError(false);
        setNameError(false);
        setQuantError(false);
        setUnitError(false);
        setSupError(false);
        setThreshError(false);

        //make sure a row is selected
        if(whichRow == null){
            setError(true);
            return;
        }
        setError(false);

        // make sure valid name is inputted
        if(data.name == ""){
            setNameError(true);
        }
        setNameError(false);
        
        //make sure quantity is specified
        if(data.quant == ""){
            setQuantError(true);
            return;
        }

        //make sure unit is specified
        if(data.unit == ""){
            setUnitError(true);
            return;
        }

        //make sure supplier is specified
        if(data.sup == ""){
            setSupError(true);
            return;
        }
        setSupError(false);

        //make sure threshold is specified
        if(data.thresh == ""){
            setThreshError(true);
            return;
        }
        setThreshError(false);

        const newData = {
            item_name: data.name,
            quantity: data.quant,
            unit: data.unit,
            supplier: data.sup,
            threshold: data.thresh,
            needs_restock: data.quant < data.thresh
        };

        //make quantity is a valid number
        if(isNaN(parseFloat(data.quant))){
            setQuantError(true);
            return;
        }
        setQuantError(false);

        //make sure threshold is a valid number
        if(isNaN(parseFloat(data.thresh))){
            setThreshError(true);
            return;
        }
        setThreshError(false);

        try{
            //update the inventory with new values
            await updateInventory(whichRow.item_name, newData);

            //update the inventory table
            setInventory((prev) =>
                prev.map((item) =>
                   item.item_name == whichRow.item_name ? {...item, ...newData} : item 
                )
            );
            alert(data.name + " Successfully Updated!");
        } catch (error){
        console.error("Can't update item: ", error);
        }
    };

    //function that is called when add button is clicked
    const addButton = async () => {
        //reset all of the error states
        setError(false);
        setAddError(false);
        setNameError(false);
        setQuantError(false);
        setUnitError(false);
        setSupError(false);
        setThreshError(false);

        // make sure valid name is input
        if(data.name == ""){
            setNameError(true);
            return;
        }
        setNameError(false);
        
        // make sure valid quantity is given
        if(data.quant == ""){
            setQuantError(true);
            return;
        }

        // make sure valid unit provided
        if(data.unit == ""){
            setUnitError(true);
            return;
        }

        //make sure valid supplier is given
        if(data.sup == ""){
            setSupError(true);
            return;
        }
        setSupError(false);

        //make sure valid threshold is given
        if(data.thresh == ""){
            setThreshError(true);
            return;
        }
        setThreshError(false);

        //obtain new inventory_id for new item
        const newID = await getInventoryID();
        
        // console.log("returned id: ", newID);
        if(newID == null){
            alert("Unable to retrieve new id");
            return;
        }
        setError('');
        
        // chack to see if inventory item already exists
        const ex = await doesInventoryExist(data.name);
        if(ex){
            setAddError(true);
            return;
        }
        setAddError(false);

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

            //make sure quantity is a valid number
            if(isNaN(parseFloat(data.quant))){
                setQuantError(true);
                return;
            }
            setQuantError(false);
            
            //make sure threshold is a valid number
            if(isNaN(parseFloat(data.thresh))){
                setThreshError(true);
                return;
            }
            setThreshError(false);

            //add new inventory item to the database
            const additional = await addInventory(newData);

            //update the table with new iteam
            setInventory((prev) =>
                [...prev, additional]
            );

            alert(data.name + " Successfully Added!");
          } catch (error) {
            // Handle errors
            console.error('Error adding item:', error);
          }
    };

    //function that is called once the delete button is clicked
    const deleteButton = async () =>{
        //reset error states
        setError(false);
        setAddError(false);
        setNameError(false);
        setQuantError(false);
        setUnitError(false);
        setSupError(false);
        setThreshError(false);

        //make valid name is given
        if(data.name == null || data.name == ""){
            setError(true);
            return;
        }

        const deleteName = data.name;
        try{
            //make sure item being deleted exists
            const ex = await doesInventoryExist(deleteName);
            if(!ex){
                setError(true);
                return;
            }
            setError(false);
            
            //delete the inventory
            await deleteInventory(deleteName);

            //remove the item from the database
            setRender((prev) => !prev);
            setData({
                name: '',
                quant: '',
                unit: '',
                sup: '',
                thresh: ''
            });

            alert(data.name + "Successfully Removed!")

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
                    <div className={styles['modify-inventory']}>
                        <FormControl sx={{ mb: 2 }} fullWidth>
                            <TextField
                                name="name"
                                label="Inventory Item"
                                onChange={input}
                                value={data.name}
                                error={error || addError || nameError}
                                helperText={error ? "Please select an item" : addError ? "Please create a new item" : nameError ? "Please input a valid name" : ""}
                            />

                        </FormControl>
                        {/* Quantity Textbox */}
                        <FormControl sx={{ mb: 2 }} fullWidth>
                            <TextField
                                name="quant"
                                label="Quantity"
                                type="number"
                                onChange={input}
                                value={data.quant}
                                error={quantError}
                                helperText={quantError ? "Please enter a valid quantity" : ""}
                                inputProps={{
                                    step: "0.01",
                                    min: "0",
                                }}
                            />

                        </FormControl>
                        {/* Unit textbox */}
                        <FormControl sx={{ mb: 2 }} fullWidth>
                            <TextField
                                name="unit"
                                label="Unit"
                                onChange={input}
                                value={data.unit}
                                error={unitError}
                                helperText={unitError ? "Please enter valid units" : ""}
                            />

                        </FormControl>
                        {/* Supplier textbox */}
                        <FormControl sx={{ mb: 2 }} fullWidth>
                            <TextField
                                name="sup"
                                label="Supplier"
                                onChange={input}
                                value={data.sup}
                                error={supError}
                                helperText={supError ? "Please enter a valid supplier" : ""}
                            />

                        </FormControl>
                        {/* Threshold textbox */}
                        <FormControl sx={{ mb: 2 }} fullWidth>
                            <TextField
                                name="thresh"
                                label="Threshold"
                                type="number"
                                onChange={input}
                                value={data.thresh}
                                error={threshError}
                                helperText={threshError ? "Please enter a valid threshold" : ""}
                                inputProps={{
                                    step: "0.01",
                                    min: "0",
                                }}
                            />
                        </FormControl>
                        
                        {/* Buttons */}
                        <Box
                            sx={{
                                width: '100%',
                                display: 'flex',
                                justifyContent: 'space-between',
                                mt: 2
                            }}
                        >
                            <Button variant="outlined" onClick={updateButton}>Update</Button>
                            <Button variant="contained" onClick={addButton}>Add</Button>
                            <Button variant="contained" onClick={deleteButton}>Delete</Button>
                        </Box>
                    </div>
                </div>
            </div>
       </ThemeProvider>
    );
}

export default Inventory;
