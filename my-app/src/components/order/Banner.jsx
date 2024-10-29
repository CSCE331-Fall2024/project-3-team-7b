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

    async function translateText() {
    const apiKey = 'AIzaSyAFi_eWEJWwh-Jm4HA5KZcQr0klUHLDklo';  // Replace with your actual API key
    const text = document.getElementById("textToTranslate").innerText;
    const targetLanguage = document.getElementById("languageSelect").value;

    const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;
    const data = {
        q: text,
        target: targetLanguage,
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        const result = await response.json();
        document.getElementById("translatedText").innerText = result.data.translations[0].translatedText;
    } catch (error) {
        console.error("Error with translation:", error);
    }
}

    

    return (
        <div className="banner">
            <img className="banner-image" src={banner} alt="Panda Express Banner w/ Logo" ></img>
            <div className="accesible-buttons">
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={selectedLanguage}
                    label="SELECT A LANGUAGE"
                    onChange={translateText}
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
