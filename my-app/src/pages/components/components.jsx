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
        }
        else{
            setRow(row);
            setData({
                name: row.component_name,
                cat: row.category,
                avail: row.availability,
                prem: row.premium,
                seas: row.seasonal
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
                        <select name="avail" onChange={input} value={data.avail ? "True" : "False"}>
                            <option value="" disabled>Is this available?</option>
                            <option value="True">Yes</option>
                            <option value="False">No</option>
                        </select>
                        <select name="prem" onChange={input} value={data.prem ? "True" : "False"}>
                            <option value="" disabled>Is this premium?</option>
                            <option value="True">Yes</option>
                            <option value="False">No</option>
                        </select>
                        <select name="avail" onChange={input} value={data.seas ? "True" : "False"}>
                            <option value="" disabled>Is this seasonal?</option>
                            <option value="True">Yes</option>
                            <option value="False">No</option>
                        </select>
                    </div>
                    <div className={styles['buttons']}>
                        <button>Update</button>
                        <button>Add</button>
                        <button>Delete</button>
                    </div>
                </div>
            </div>
       </ThemeProvider>
    );
}

export default Components;