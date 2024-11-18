import ManagerBanner from '../manager/managerBanner';
import { ThemeProvider } from '@mui/material/styles';
import React, {useEffect, useState} from "react";
import styles from "./items.module.css"
import theme from "../../createTheme"
import axios from "axios";
import ItemsTable from '../../components/manager/ItemsTable';

function Items(props){
    const view = props.view;
    const setAuthentication = props.setAuthentication;

    //stores the menu items in the menu items table and function used to set the menu items
    const[menu, setItems] = useState([]);
    //contains the data for the row that is selected within the table, function used to find the selected row
    const[whichRow, setRow] = useState(null);
    //stores error message output for invalid requests, function used to set the error message
    const[error, setError] = useState('');
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
                const response = await axios.get("http://localhost:5001/api/menu");
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
            const response = await axios.get(`http://localhost:5001/api/menu/check/${itemName}`)
            return response.data;
        } catch (error){
            console.log("Error checking item: ", error);
        }
    };

    // call that takes in the componentID and updated data and sends to database
    const updateItem = async (itemName, newData) => {
        try{
            const response = await axios.put(`http://localhost:5001/api/menu/${itemName}`, newData);
        } catch(error){
            console.error("Unable to update item");
        }
    };

    //returns the maximum componentID in the components table
    const getItemID = async () =>{
        try{
            const response = await axios.get("http://localhost:5001/api/menuID");
            return response.data;
        } catch (error){
            console.error("Unable to get new componentID", error);
            return null;
        }
    };

    // call that takes in all of the required data and creates a new menu item within the database
    const addItem = async (newData) => {
        console.log("Date we sending: ", newData);
        try{
            const response = await axios.post(`http://localhost:5001/api/menu/add/${newData.itemID}`, newData);
            return response.data;
        } catch(error){
            console.error("Fails post: ", error);
        }
    };

    // call that requests specified item to be deleted from menu_items table
    const deleteItem = async(itemName) => {
        try{
            const response = await axios.delete(`http://localhost:5001/api/menu/delete/${itemName}`);
            console.log("Meny item deleted")
        } catch(error){
            console.log("Error deleting inventory item: ", error);
        }
    };

    //function to call when update button is pressed
    const updateButton = async () => {
        const exist = await doesItemExist(whichRow.item_name);
        if(whichRow == null || !exist){
            setError("Please select a item to update");
            return;
        }
        const newData = {
            item_name: data.name,
            price: data.price,
            availability: data.avail == "True"
        };
        if(newData.item_name == ''){
            setError('Please input a valid item name')
            return;
        }
        if(isNaN(parseFloat(data.price))){
            setError('Please input a valid price');
            return;
        }
        setError('');
        console.log(newData);

        try{
            await updateItem(whichRow.item_name, newData);

            setItems((prev) =>
                prev.map((it) =>
                   it.item_name == whichRow.item_name ? {...it, ...newData} : it 
                )
            );
        } catch (error){
        console.error("Can't update item: ", error);
        }

    };

    // function that is called when add button is pressed
    const addButton = async () => {
        console.log("current data: ", data);
        if(data.name == null || data.name == ""){
            setError('Please input a valid name');
            return;
        }

        const ex = await doesItemExist(data.name);
        if(ex){
            setError("Please create a new item");
            return;
        }

        if(isNaN(parseFloat(data.price))){
            setError('Please input a valid price');
            return;
        }

        if(data.avail == null || data.avail == ""){
            setError('Please select if this component is available');
            return;
        }

        const newID = await getItemID();
        
        console.log("returned id: ", newID);
        if(newID == null){
            setError("Can't get the new ID");
            return;
        }
        setError('');

        try {
            const newData = {
                itemID: (parseInt(newID) + 1),
                item_name: data.name,
                price: data.price,
                availability: data.avail == "True"
            };
            console.log(newData);

            const additional = await addItem(newData);
            setItems((prev) =>
                [...prev, additional]
            );
          } catch (error) {
            // Handle errors
            console.error('Error adding item:', error);
          }
    };

    //function that is called when delete button is clicked
    const deleteButton = async () =>{
        try{
            const ex = await doesItemExist(data.name);
            console.log("Delete item exists? ", ex);
            if(!ex){
                setError("Please select an item");
                return;
            }
            setError('');
            await deleteItem(data.name);
            setRender((prev) => !prev);

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
                    <div className={styles['text-boxes']}>
                        {error && <p className={styles['error']}>{error}</p>}
                        <input type="text" name='name' onChange={input} placeholder='Menu Item' value={data.name}/>
                        <input type="number" name='price' onChange={input} placeholder='Price' value={data.price}/>
                        <select name="avail" onChange={input} placeholder={""} value={data.avail}>
                            <option value="" disabled>Is this available?</option>
                            <option value="True">Yes</option>
                            <option value="False">No</option>
                        </select>
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

export default Items;