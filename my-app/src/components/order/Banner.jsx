import banner from "../../images/banner.PNG"
import Button from '@mui/material/Button';
import Select from '@mui/material/Select'
import { MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import React, { useState } from 'react';
import "./orderComponents.css"

// Purpose: banner to be displayed at the top of all ordering pages
function Banner(props){
    const navigate = useNavigate();
    const [selectedLanguage, setSelectedLanguage] = useState("en");
    const view = props.view;
    const setAuthentication = props.setAuthentication;

    // console.log(view);

    // handles logout function for cashiers & managers
    const logout = () => {
        navigate("/");
        setAuthentication(false);
    }

    return (
        <div className="banner">
            <div className="accesible-buttons">
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={selectedLanguage}
                    label="SELECT A LANGUAGE"
                    // onChange={translateText}
                    // variant="contained"
                >
                    <MenuItem value={'en'}>English</MenuItem>
                    <MenuItem value={'span'}>Spanish</MenuItem>
                </Select>
                <Button variant="contained">ENLARGE TEXT</Button>
            </div>

            {/* Overall banner content */}
            <img className="banner-image" src={banner} alt="Panda Express Banner w/ Logo" ></img>

            {/* only displays logout button for cashiers and managers */}
            { (view === "cashier" || view === "manager") && (
                <div>
                    <Button variant="contained" onClick={logout}>Logout</Button>
                </div>
            )}
            
        </div>
    );
}

export default Banner;
