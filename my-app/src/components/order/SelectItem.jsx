import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from "@mui/material";
import "./orderComponents.css";
import { useNavigate } from "react-router-dom";

// Purpose: Displays individual items such as orange chicken, dr. pepper, cream cheese rangoons, etc

// Dynamically load all images from a folder
const importImages = (r) => {
    return r.keys().map((fileName) => {
        return {
            src: r(fileName), // The image source
            name: fileName.replace('./', '') // The file name without the leading './'
        };
    });
}

function SelectItem(props) {
    console.log(props.item);
    const item = props.item;
    const view = props.view;
    const navigate = useNavigate();

    const [data, setData] = useState([]);

    // Makes API call to retreive component information
    useEffect(() => {
        const fetchData = async () => {
            try {
                const baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';
                const response = await axios.get(`${baseURL}/api/components`);
                setData(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);

    // Create a dictionary with `itemid` as keys for easy lookup
    const itemsDictionary = data.reduce((dict, item) => {
        dict[item.componentid] = item;
        return dict;
    }, {});


    // Import all images from the images folder (you can adjust the path)
    // Sides
    const sideImages = importImages(
        require.context("../../images/components/sides", false, /\.(png)$/)
    )
        .filter(
            (imageObj) =>
                itemsDictionary[parseInt(imageObj.name.split(".")[0], 10)]
        ) // Filter out images without a match
        .sort((a, b) => {
            const idA = parseInt(a.name.split(".")[0], 10);
            const idB = parseInt(b.name.split(".")[0], 10);
            return idA - idB;
        });

    // Entrees
    const entreeImages = importImages(
        require.context("../../images/components/entrees", false, /\.(png)$/)
    )
        .filter(
            (imageObj) =>
                itemsDictionary[parseInt(imageObj.name.split(".")[0], 10)]
        ) // Filter out images without a match
        .sort((a, b) => {
            const idA = parseInt(a.name.split(".")[0], 10);
            const idB = parseInt(b.name.split(".")[0], 10);
            return idA - idB;
        });

    // Drinks
    const drinkImages = importImages(
        require.context("../../images/components/drinks", false, /\.(png)$/)
    )
        .filter(
            (imageObj) =>
                itemsDictionary[parseInt(imageObj.name.split(".")[0], 10)]
        ) // Filter out images without a match
        .sort((a, b) => {
            const idA = parseInt(a.name.split(".")[0], 10);
            const idB = parseInt(b.name.split(".")[0], 10);
            return idA - idB;
        });

    // Appetizers
    const appetizerImages = importImages(
        require.context("../../images/components/appetizers", false, /\.(png)$/)
    )
        .filter(
            (imageObj) =>
                itemsDictionary[parseInt(imageObj.name.split(".")[0], 10)]
        ) // Filter out images without a match
        .sort((a, b) => {
            const idA = parseInt(a.name.split(".")[0], 10);
            const idB = parseInt(b.name.split(".")[0], 10);
            return idA - idB;
        });


    // Navigates user back to the main menu
    const backToMenu = () => {
        navigate("/" + view + "/order", {state: {view: view}})
    }

    // write code to determine number of entrees that can be selected
    return (
        <div className="menu-display">
            {/* BACK BUTTON */}
            <div>
                <Button variant="contained" color="secondary" onClick={backToMenu}>BACK TO MENU</Button>
            </div>

            {/* SIDES */}
            { (item <= 3 || item === 9 || item === 11) && (
                <div className="item-type"> 
                    <div className="labels">   
                        <h2>Select Your Side:</h2>
                    </div>
                    <div className="menu-display">
                        {sideImages.map((imageObj, index) => {
                            const itemId = parseInt(imageObj.name.split(".")[0], 10);
                            const itemName = itemsDictionary[itemId]?.component_name || "Unknown Item";
                
                            return (
                                <button key={index} className="menu-button">
                                    <img src={imageObj.src} alt={`Menu Item ${index + 1}`} className="menu-image" />
                                    {itemName}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* ENTREES */}
            { (item <= 3 || item === 9 || item === 11) && ( 
                <div className="item-type"> 
                    <div className="labels">   
                        <h2>Select Your Entree(s):</h2>
                    </div>
                    <div className="menu-display">
                        {entreeImages.map((imageObj, index) => {
                            const itemId = parseInt(imageObj.name.split(".")[0], 10);
                            const itemName = itemsDictionary[itemId]?.component_name || "Unknown Item";
                
                            return (
                                <button key={index} className="menu-button">
                                    <img src={imageObj.src} alt={`Entree Item ${index + 1}`} className="menu-image" />
                                    {itemName}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* DRINKS */}
            { (item === 19 ) && ( 
                <div className="item-type"> 
                    <div className="labels">   
                        <h2>Select Your Drink:</h2>
                    </div>
                    <div className="menu-display">
                        {drinkImages.map((imageObj, index) => {
                            const itemId = parseInt(imageObj.name.split(".")[0], 10);
                            const itemName = itemsDictionary[itemId]?.component_name || "Unknown Item";
                
                            return (
                                <button key={index} className="menu-button">
                                    <img src={imageObj.src} alt={`Drink Item ${index + 1}`} className="menu-image" />
                                    {itemName}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
            
            {/* APPETIZERS */}
            { (item === 13 ) && ( 
                <div className="item-type"> 
                    <div className="labels">   
                        <h2>Select Your Appetizer:</h2>
                    </div>
                    <div className="menu-display">
                        {appetizerImages.map((imageObj, index) => {
                            const itemId = parseInt(imageObj.name.split(".")[0], 10);
                            const itemName = itemsDictionary[itemId]?.component_name || "Unknown Item";
                
                            return (
                                <button key={index} className="menu-button">
                                    <img src={imageObj.src} alt={`Appetizer Item ${index + 1}`} className="menu-image" />
                                    {itemName}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        
        </div>
    );
}

export default SelectItem;
