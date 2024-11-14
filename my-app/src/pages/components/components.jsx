import ManagerBanner from '../manager/managerBanner';
import { ThemeProvider } from '@mui/material/styles';
import React, {useEffect, useState} from "react";
//import styles from "./employees.module.css";
import ComponentsTable from '../../components/manager/ComponentsTable';
import styles from "./components.module.css"
import theme from "../../createTheme"
import axios from "axios";

function Components(props){
    const view = props.view;
    const setAuthentication = props.setAuthentication;

    const[components, setComponents] = useState([]);
    const[whichRow, setRow] = useState(null);
    const[error, setError] = useState('');
    const[render, setRender] = useState(false);
    const[data, setData] = useState({
        name: '',
        cat: '',
        avail: '',
        prem: '',
        seas: ''
    });

    useEffect(() => {
        const getComponents = async () => {
            try{
                const response = await axios.get("http://localhost:5001/api/components");
                setComponents(response.data);
                
            } catch(error){
                console.error("Error getting inventory information: ", error);
            }
        };


        getComponents();
    }, [render]);

    const getRow = (row) =>{
        if(whichRow && whichRow.component_name == row.component_name){
            setRow(null);
            setData({
                name: '',
                cat: '',
                avail: '',
                prem: '',
                seas: ''
            });
        }
        else{
            setRow(row);
            setData({
                name: row.component_name,
                cat: row.category,
                avail: row.availability ? "True" : "False",
                prem: row.premium ? "True" : "False",
                seas: row.seasonal ? "True" : "False"
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

    //function returns whether given component exists in the db
    const doesComponentExist = async(compName) => {
        try{
            const response = await axios.get(`http://localhost:5001/api/components/check/${compName}`)
            return response.data;
        } catch (error){
            console.log("Error checking item: ", error);
        }
    };

    // call that takes in the componentID and updated data and sends to database
    const updateComponent = async (compName, newData) => {
        try{
            const response = await axios.put(`http://localhost:5001/api/components/${compName}`, newData);
        } catch(error){
            console.error("Unable to update item");
        }
    };

    const getComponentID = async () =>{
        try{
            const response = await axios.get("http://localhost:5001/api/componentID");
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
            const response = await axios.post(`http://localhost:5001/api/components/add/${newData.compID}`, newData);
            return response.data;
        } catch(error){
            console.error("Fails post: ", error);
        }
    };

    const deleteComponent = async(compName) => {
        try{
            const response = await axios.delete(`http://localhost:5001/api/components/delete/${compName}`);
            // console.log("Inventory item deleted")
        } catch(error){
            console.log("Error deleting inventory item: ", error);
        }
    };


    //function to call when update button is pressed
    const updateButton = async () => {
        if(whichRow == null){
            setError("Please select a component to update");
            return;
        }
        const exist = await doesComponentExist(whichRow.component_name);
        setError('');
        const newData = {
            component_name: data.name,
            category: data.cat,
            availability: data.avail == "True",
            premium: data.prem == "True",
            seasonal: data.seas == "True"
        };
        if(newData.component_name == ''){
            setError('Please input a valid component name')
            return;
        }
        setError('');
        // console.log(newData);

        try{
            await updateComponent(whichRow.component_name, newData);

            setComponents((prev) =>
                prev.map((comp) =>
                   comp.component_name == whichRow.component_name ? {...comp, ...newData} : comp 
                )
            );
        } catch (error){
        console.error("Can't update item: ", error);
        }

    };

    const addButton = async () => {
        // console.log("current data: ", data);
        if(data.name == null || data.name == ""){
            setError('Please input a valid name');
            return;
        }

        const ex = await doesComponentExist(data.name);
        if(ex){
            setError("Please create a new item");
            return;
        }

        if(data.cat == ""){
            setError('Please select a category');
            return
        }

        if(data.avail == null || data.avail == ""){
            setError('Please select if this component is available');
            return;
        }

        if(data.prem == null || data.prem == ""){
            setError('Please select if this component is premium');
            return;
        }

        if(data.seas == null || data.seas == ""){
            setError('Please select if this component is seasonal');
            return;
        }

        const newID = await getComponentID();
        
        // console.log("returned id: ", newID);
        if(newID == null){
            setError("Can't get the new ID");
            return;
        }
        setError('');

        try {
            const newData = {
                compID: (parseInt(newID) + 1),
                component_name: data.name,
                category: data.cat,
                availability: data.avail == "True",
                premium: data.prem == "True",
                seasonal: data.seas == "True"
            };
            // console.log(newData);

            const additional = await addComponent(newData);
            setComponents((prev) =>
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
            const ex = await doesComponentExist(data.name);
            // console.log("Delete item exists? ", ex);
            if(!ex){
                setError("Please select a component");
                return;
            }
            setError('');
            await deleteComponent(data.name);
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
                    <ComponentsTable data={components} rowSelect={getRow}/>
                </div>
                <div className={styles['editor-container']}>
                    <div className={styles['text-boxes']}>
                        {error && <p className={styles['error']}>{error}</p>}
                        <input type="text" name='name' onChange={input} placeholder='Component' value={data.name}/>
                        <select name ="cat" onChange={input} value={data.cat}>
                            <option value="" disabled>Select Category</option>
                            <option value="Appetizer">Appetizer</option>
                            <option value="Main Course">Main Course</option>
                            <option value="Side">Side</option>
                            <option value="Beverage">Beverage</option>
                            <option value="Dessert">Dessert</option>
                        </select>
                        <select name="avail" onChange={input} placeholder={""} value={data.avail}>
                            <option value="" disabled>Is this available?</option>
                            <option value="True">Yes</option>
                            <option value="False">No</option>
                        </select>
                        <select name="prem" onChange={input} placeholder={""} value={data.prem}>
                            <option value="" disabled>Is this premium?</option>
                            <option value="True">Yes</option>
                            <option value="False">No</option>
                        </select>
                        <select name="seas" onChange={input} placeholder={""} value={data.seas}>
                            <option value="" disabled>Is this seasonal?</option>
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

export default Components;