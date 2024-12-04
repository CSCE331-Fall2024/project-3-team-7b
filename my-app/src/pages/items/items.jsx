import ManagerBanner from '../manager/ManagerBanner';
import { ThemeProvider } from '@mui/material/styles';
import React, {useEffect, useState} from "react";
import styles from "./items.module.css"
import theme from "../../createTheme"
import axios from "axios";
import ItemsTable from '../../components/manager/ItemsTable';
import { Button, MenuItem } from '@mui/material';
import { FormControl, Box, TextField } from '@mui/material';

function Items(props){
    const view = props.view;
    const setAuthentication = props.setAuthentication;

    //stores the menu items in the menu items table and function used to set the menu items
    const[menu, setItems] = useState([]);
    //contains the data for the row that is selected within the table, function used to find the selected row
    const[whichRow, setRow] = useState(null);
    //stores error message output for invalid requests, function used to set the error message
    const[error, setError] = useState(false);
    const[nameError, setNameError] = useState(false);
    const[addError, setAddError] = useState(false);
    const[priceError, setPriceError] = useState(false);
    const[availError, setAvailError] = useState(false);
    //boolean value used to rerender the table once new menu items have been added
    const[render, setRender] = useState(false);
    //data variable storing all of the data in any given row, function used to set that data variable
    const[data, setData] = useState({
        name: '',
        price: '',
        avail: ''
    });

    useEffect(() => {
        // retrieves all of the components from the components table within the database
        const getItems = async () => {
            try{
                const baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';
                const response = await axios.get(`${baseURL}/api/menu`);
                setItems(response.data);
                
            } catch(error){
                console.error("Error getting inventory information: ", error);
            }
        };


        getItems();
    }, [render]);

    //function used to get all of the data associated with a given row
    const getRow = (row) =>{
        //this conditional is used to give deselection functionality - if you click a selected row again, it becomes deselected
        if(whichRow && whichRow.item_name == row.item_name){
            setRow(null);
            setData({
                name: '',
                price: '',
                avail: ''
            });
        }
        else{
            setRow(row);
            setData({
                name: row.item_name,
                price: row.price,
                avail: row.availability ? "True" : "False"
            });
        }
        setError(false);
        setAddError(false);
        setPriceError(false);
        setNameError(false);
        setAvailError(false);
    };

    //handles user input in the editor panel 
    const input = (e) => {
        const {name, value} = e.target;
        setData((original) => ({
            ...original,
            [name] : value
        }));
    };

    //function returns whether given menu item exists in the menu_items table within the db
    const doesItemExist = async(itemName) => {
        try{
            const baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';
            const response = await axios.get(`${baseURL}/api/menu/check/${itemName}`)
            return response.data;
        } catch (error){
            console.log("Error checking item: ", error);
        }
    };

    // call that takes in the componentID and updated data and sends to database
    const updateItem = async (itemName, newData) => {
        try{
            const baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';
            const response = await axios.put(`${baseURL}/api/menu/${itemName}`, newData);
        } catch(error){
            console.error("Unable to update item");
        }
    };

    //returns the maximum componentID in the components table
    const getItemID = async () =>{
        try{
            const baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';
            const response = await axios.get(`${baseURL}/api/menuID`);
            return response.data;
        } catch (error){
            console.error("Unable to get new componentID", error);
            return null;
        }
    };

    // call that takes in all of the required data and creates a new menu item within the database
    const addItem = async (newData) => {
        try{
            const baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';
            const response = await axios.post(`${baseURL}/api/menu/add/${newData.itemID}`, newData);
            return response.data;
        } catch(error){
            console.error("Fails post: ", error);
        }
    };

    // call that requests specified item to be deleted from menu_items table
    const deleteItem = async(itemName) => {
        try{
            const baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';
            const response = await axios.delete(`${baseURL}/api/menu/delete/${itemName}`);
            console.log("Menu item deleted")
        } catch(error){
            console.log("Error deleting inventory item: ", error);
        }
    };

    //function to call when update button is pressed
    const updateButton = async () => {
        setError(false);
        setAddError(false);
        setPriceError(false);
        setNameError(false);
        setAvailError(false);
        if(whichRow == null){
            setError(true);
            return;
        }
        const exist = await doesItemExist(whichRow.item_name);
        if(!exist){
            setError(true);
            return;
        }
        setError(false);
        if(data.avail == ""){
            setAvailError(true);
            return;
        }
        setAvailError(false);

        const newData = {
            item_name: data.name,
            price: data.price,
            availability: data.avail == "True"
        };

        if(newData.item_name == ''){
            setNameError(true);
            return;
        }
        setNameError(false);
        if(isNaN(parseFloat(data.price))){
            setPriceError(true);
            return;
        }
        setPriceError(false);

        try{
            await updateItem(whichRow.item_name, newData);

            setItems((prev) =>
                prev.map((it) =>
                   it.item_name == whichRow.item_name ? {...it, ...newData} : it 
                )
            );
            alert(data.name + " Successfully Updated!");
        } catch (error){
        console.error("Can't update item: ", error);
        }

    };

    // function that is called when add button is pressed
    const addButton = async () => {
        setError(false);
        setAddError(false);
        setPriceError(false);
        setNameError(false);
        setAvailError(false);
        if(data.name == null || data.name == ""){
            setNameError(true);
            return;
        }
        setNameError(false);

        const ex = await doesItemExist(data.name);
        if(ex){
            setAddError(true);
            return;
        }
        setAddError(false);

        if(isNaN(parseFloat(data.price))){
            setPriceError(true);
            return;
        }
        setPriceError(false);

        if(data.avail == null || data.avail == ""){
            setAvailError(true);
            return;
        }
        setAvailError(false);

        const newID = await getItemID();
        
        if(newID == null){
            alert("Unable to return new id");
            return;
        }

        try {
            const newData = {
                itemID: (parseInt(newID) + 1),
                item_name: data.name,
                price: data.price,
                availability: data.avail == "True"
            };

            const additional = await addItem(newData);
            setItems((prev) =>
                [...prev, additional]
            );
            alert(data.name + " Successfully Added!");
          } catch (error) {
            // Handle errors
            console.error('Error adding item:', error);
          }
    };

    //function that is called when delete button is clicked
    const deleteButton = async () =>{
        setError(false);
        setAddError(false);
        setPriceError(false);
        setNameError(false);
        setAvailError(false);
        try{
            const ex = await doesItemExist(data.name);
            if(!ex){
                setError(true);
                return;
            }
            setError(false);
            await deleteItem(data.name);
            setRender((prev) => !prev);
            setData({
                name: '',
                price: '',
                avail: ''
            });
            alert(data.name + " Successfully Removed!");

        } catch (error){
            console.log(error);
        }
    };
    
    return (
        <ThemeProvider theme={theme}>
            <div>
                <ManagerBanner view={view} setAuthentication={setAuthentication}/>
            </div>
            <div className={styles['divider']}>
                <div className={styles['table-container']}>
                    <ItemsTable data={menu} rowSelect={getRow}/>
                </div>
                <div className={styles['editor-container']}>
                     <div className={styles["modify-items"]}>
                        {/* Item textbox */}
                        <FormControl sx={{ mb: 2 }} fullWidth>
                            <TextField
                                name="name"
                                label="Item"
                                onChange={input}
                                value={data.name}
                                error={error || nameError || addError}
                                helperText={error ? "Please select an item" : nameError ? "Please input a valid name" : addError ? "Please create a new item" :""}
                            />

                        </FormControl>
                        {/* Price dropdown */}
                        <FormControl sx={{ mb: 2 }} fullWidth>
                            <TextField
                                name="price"
                                label="Price"
                                type="number"
                                onChange={input}
                                value={data.price}
                                error={priceError}
                                helperText={priceError ? "Please enter a valid price" : ""}
                                inputProps={{
                                    step: "0.01",
                                    min: "0",
                                }}
                            />

                        </FormControl>
                        {/* Availiable dropdown */}
                        <FormControl sx={{ mb: 2 }} fullWidth>
                            <TextField
                                name="avail"
                                select
                                label="Availability"
                                onChange={input}
                                value={data.avail}
                                error={availError}
                                helperText={availError ? "Please select the availability" : ""}
                            >
                                <MenuItem key="True" value="True">Yes</MenuItem>
                                <MenuItem key="False" value="False">No</MenuItem>
                            </TextField>
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

export default Items;