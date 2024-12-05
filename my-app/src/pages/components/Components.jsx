import ManagerBanner from '../manager/ManagerBanner';
import { ThemeProvider } from '@mui/material/styles';
import React, {useEffect, useState} from "react";
//import styles from "./employees.module.css";
import ComponentsTable from '../../components/manager/ComponentsTable';
import styles from "./components.module.css"
import theme from "../../createTheme"
import axios from "axios";
import { Button, MenuItem } from '@mui/material';
import { FormControl, Box, TextField } from '@mui/material';

function Components(props){
    const view = props.view;
    const setAuthentication = props.setAuthentication;

    //stores the components in components table and function used to set the components
    const[components, setComponents] = useState([]);
    //contains the data for the row that is selected within the table, function used to find the selected row
    const[whichRow, setRow] = useState(null);
    //stores error message output for invalid requests, function used to set the error message
    const[error, setError] = useState(false);
    const[nameError, setNameError] = useState(false);
    const[catError, setCatError] = useState(false);
    const[availError, setAvailError] = useState(false);
    const[premError, setPremError] = useState(false);
    const[seasError, setSeasError] = useState(false);
    const[allerError, setAllerError] = useState(false);
    const[addError, setAddError] = useState(false);
    //boolean value used to rerender the table once new components have been added
    const[render, setRender] = useState(false);
    //data variable storing all of the data in any given row, function used to set that data variable
    const[data, setData] = useState({
        name: '',
        cat: '',
        avail: '',
        prem: '',
        seas: '',
        aller: ''
    });

    useEffect(() => {
        // retrieves all of the components from the components table within the database
        const getComponents = async () => {
            try{
                const baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';
                const response = await axios.get(`${baseURL}/api/components`);
                setComponents(response.data);
                
            } catch(error){
                console.error("Error getting inventory information: ", error);
            }
        };


        getComponents();
    }, [render]);

    //function used to get all of the data associated with a given row
    const getRow = (row) =>{
        //this conditional is used to give deselection functionality - if you click a selected row again, it becomes deselected
        if(whichRow && whichRow.component_name == row.component_name){
            setRow(null);
            setData({
                name: '',
                cat: '',
                avail: '',
                prem: '',
                seas: '',
                aller: ''
            });
        }
        else{
            setRow(row);
            setData({
                name: row.component_name,
                cat: row.category,
                avail: row.availability ? "True" : "False",
                prem: row.premium ? "True" : "False",
                seas: row.seasonal ? "True" : "False",
                aller: row.allergens
            });
        }
        setError(false);
        setNameError(false);
        setCatError(false);
        setAvailError(false);
        setPremError(false);
        setSeasError(false);
        setAllerError(false);
        setAddError(false);
    }; 

    //handles user input in the editor panel 
    const input = (e) => {
        const {name, value} = e.target;
        setData((original) => ({
            ...original,
            [name] : value
        }));
    };

    //function returns whether given component exists in the db
    const doesComponentExist = async(compName) => {
        try{
            const baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';
            const response = await axios.get(`${baseURL}/api/components/check/${compName}`)
            return response.data;
        } catch (error){
            console.log("Error checking item: ", error);
        }
    };

    // call that takes in the componentID and updated data and sends to database
    const updateComponent = async (compName, newData) => {
        try{
            const baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';
            const response = await axios.put(`${baseURL}/api/components/${compName}`, newData);
        } catch(error){
            console.error("Unable to update item");
        }
    };

    //returns the maximum componentID in the components table
    const getComponentID = async () =>{
        try{
            const baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';
            const response = await axios.get(`${baseURL}/api/componentID`);
            return response.data;
        } catch (error){
            console.error("Unable to get new componentID", error);
            return null;
        }
    };

    // call that takes in all of the required data and creates a new component within the database
    const addComponent = async (newData) => {
        // console.log("Date we sending: ", newData);
        try{
            const baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';
            const response = await axios.post(`${baseURL}/api/components/add/${newData.compID}`, newData);
            return response.data;
        } catch(error){
            console.error("Fails post: ", error);
        }
    };

    // call that requests specified component to be deleted from components table
    const deleteComponent = async(compName) => {
        try{
            const baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';
            const response = await axios.delete(`${baseURL}/api/components/delete/${compName}`);
            console.log("Component deleted")
        } catch(error){
            console.log("Error deleting component: ", error);
        }
    };


    //function to call when update button is pressed
    const updateButton = async () => {
        setError(false);
        setNameError(false);
        setCatError(false);
        setAvailError(false);
        setPremError(false);
        setSeasError(false);
        setAllerError(false);
        setAddError(false);

        if(whichRow == null){
            setError(true);
            return;
        }
        const exist = await doesComponentExist(whichRow.component_name);
        if(!exist){
            setError(true);
            return;
        }
        setError(false);
        if(data.name === ""){
            setNameError(true);
            return;
        }
        setNameError(false);
        if(data.cat === ""){
            setCatError(true);
        }
        setCatError(false);
        if(data.avail === ""){
            setAvailError(true);
        }
        setAvailError(false);
        if(data.prem === ""){
            setPremError(true);
            return;
        }
        setPremError(false);
        if(data.seas === ""){
            setSeasError(true);
        }
        setSeasError(false);
        if(data.aller === ""){
            setAllerError(true);
        }
        setAllerError(false);

        const newData = {
            component_name: data.name,
            category: data.cat,
            availability: data.avail == "True",
            premium: data.prem == "True",
            seasonal: data.seas == "True",
            allergens: data.aller
        };
        if(newData.component_name == ''){
            setNameError(true);
            return;
        }
        // console.log(newData);

        try{
            await updateComponent(whichRow.component_name, newData);

            setComponents((prev) =>
                prev.map((comp) =>
                   comp.component_name == whichRow.component_name ? {...comp, ...newData} : comp 
                )
            );
            alert(data.name + " Successfully Updated!")
        } catch (error){
        console.error("Can't update item: ", error);
        }

    };

    // function that is called when add button is pressed
    const addButton = async () => {
        setError(false);
        setNameError(false);
        setCatError(false);
        setAvailError(false);
        setPremError(false);
        setSeasError(false);
        setAllerError(false);
        setAddError(false);

        // console.log("current data: ", data);
        if(data.name === null || data.name === ""){
            setNameError(true);
            return;
        }
        setNameError(false);

        const ex = await doesComponentExist(data.name);
        if(ex){
            setAddError(true);
            return;
        }
        setAddError(false);

        if(data.cat === ""){
            setCatError(true);
            return
        }
        setCatError(false);

        if(data.avail === null || data.avail === ""){
            setAvailError(true);
            return;
        }
        setAvailError(false);

        if(data.prem === null || data.prem === ""){
            setPremError(true);
            return;
        }
        setPremError(false);

        if(data.seas === null || data.seas === ""){
            setSeasError(true);
            return;
        }
        setSeasError(false);

        if(data.aller === null || data.aller === ""){
            setAllerError(true);
            return;
        }
        setAllerError(false);

        const newID = await getComponentID();
        
        // console.log("returned id: ", newID);
        if(newID == null){
            alert("Unable to retrieve new id")
            return;
        }

        try {
            const newData = {
                compID: (parseInt(newID) + 1),
                component_name: data.name,
                category: data.cat,
                availability: data.avail == "True",
                premium: data.prem == "True",
                seasonal: data.seas == "True",
                allrgens: data.aller
            };
            // console.log(newData);

            const additional = await addComponent(newData);
            setComponents((prev) =>
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
        setNameError(false);
        setCatError(false);
        setAvailError(false);
        setPremError(false);
        setSeasError(false);
        setAllerError(false);
        setAddError(false);

        try{
            console.log("this has been clicked");
            console.log(data.name);
            const ex = await doesComponentExist(data.name);
            console.log("Delete item exists? ", ex);
            if(!ex){
                setError(true);
                return;
            }
            console.log("passed");
            setError(false);
            await deleteComponent(data.name);
            setRender((prev) => !prev);
            setData({
                name: '',
                cat: '',
                avail: '',
                prem: '',
                seas: '',
                aller: ''
            });
            alert(data.name + " Successfully Deleted!")
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
                    <ComponentsTable data={components} rowSelect={getRow}/>
                </div>
                <div className={styles['editor-container']}>
                    <div className={styles["modify-components"]}>
                        {/* Component textbox */}
                        <FormControl sx={{ mb: 2 }} fullWidth>
                            <TextField
                                name="name"
                                label="Component"
                                onChange={input}
                                value={data.name}
                                error={error || addError || nameError}
                                helperText={error ? "Please select an item" : nameError ? "Please input a valid name" : addError ? "Please create a new item" : ""}
                            />

                        </FormControl>
                        {/* Category dropdown */}
                        <FormControl sx={{ mb: 2 }} fullWidth>
                            <TextField
                                name="cat"
                                select
                                label="Category"
                                onChange={input}
                                value={data.cat}
                                error={catError}
                                helperText={catError ? "Please select a category" : ""}
                            >
                                <MenuItem key="Appetizer" value="Appetizer">Appetizer</MenuItem>
                                <MenuItem key="Main Course" value="Main Course">Main Course</MenuItem>
                                <MenuItem key="Side" value="Side">Side</MenuItem>
                                <MenuItem key="Beverage" value="Beverage">Beverage</MenuItem>
                                <MenuItem key="Dessert" value="Dessert">Dessert</MenuItem>
                            </TextField>
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
                        {/* Premium dropdown */}
                        <FormControl sx={{ mb: 2 }} fullWidth>
                            <TextField
                                name="prem"
                                select
                                label="Premium"
                                onChange={input}
                                value={data.prem}
                                error={premError}
                                helperText={premError ? "Please select if this item is premium" : ""}
                            >
                                <MenuItem key="True" value="True">Yes</MenuItem>
                                <MenuItem key="False" value="False">No</MenuItem>
                            </TextField>
                        </FormControl>
                        {/* Seasonal dropdown */}
                        <FormControl sx={{ mb: 2 }} fullWidth>
                            <TextField
                                name="seas"
                                select
                                label="Seasonal"
                                onChange={input}
                                value={data.seas}
                                error={seasError}
                                helperText={seasError ? "Please select if this item is seasonal" : ""}
                            >
                                <MenuItem key="True" value="True">Yes</MenuItem>
                                <MenuItem key="False" value="False">No</MenuItem>
                            </TextField>
                        </FormControl>
                        <FormControl sx={{ mb: 2 }} fullWidth>
                            <TextField
                                name="name"
                                label="Allergens"
                                onChange={input}
                                value={data.name}
                                error={error || addError || allerError}
                                helperText={error ? "Please select an item" : allerError ? "Please input valid allergens" : addError ? "Please create a new item" : ""}
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

    export default Components;
