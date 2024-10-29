import banner from "../../images/banner.PNG"
import Button from '@mui/material/Button';
import Select from '@mui/material/Select'
import { MenuItem } from "@mui/material";
// import { useNavigate } from "react-router-dom";
import React, { useState } from 'react';
import "./orderComponents.css"

function Banner(){
    // const navigate = useNavigate();
    const [selectedLanguage, setSelectedLanguage] = useState("en");

    

    return (
        <div className="banner">
            <img className="banner-image" src={banner} alt="Panda Express Banner w/ Logo" ></img>
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
        </div>
    );
}

export default Banner;
