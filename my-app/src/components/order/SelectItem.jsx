import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from "@mui/material";
import "./orderComponents.css";
import { useNavigate } from "react-router-dom";

// Purpose: Displays individual items such as orange chicken, dr. pepper, cream cheese rangoons, etc

// Dynamically load all images from a folder
const importAll = (r) => {
    return r.keys().map((fileName) => {
        return {
            src: r(fileName), // The image source
            name: fileName.replace('./', '') // The file name without the leading './'
        };
    });
}

function SelectItem(props) {
    console.log(props.item);
    const item = parseInt(props.item, 10);
    const view = props.view;
    const navigate = useNavigate();

    const [compData, setCompData] = useState([]);
    const [menuData, setMenuData] = useState([]);

    // Fetch component and menu data concurrently
    useEffect(() => {
        const fetchData = async () => {
            try {
                const baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';

                // Use Promise.all to fetch both data sources at the same time
                const [compResponse, menuResponse] = await Promise.all([
                    axios.get(`${baseURL}/api/components`),
                    axios.get(`${baseURL}/api/menu_items`)
                ]);

                setCompData(compResponse.data);
                setMenuData(menuResponse.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);

    // Create a dictionary with `itemid` as keys for easy lookup
    const compItemsDictionary = compData.reduce((dict, item) => {
        dict[item.componentid] = item;
        return dict;
    }, {});

    const menuItemsDictionary = menuData.reduce((dict, item) => {
        dict[item.itemid] = item;
        return dict;
    }, {});


    // Import all images from the images folder (you can adjust the path)
    // Sides
    const sideImages = importAll(
        require.context("../../images/components/sides", false, /\.(png)$/)
    )
        .filter(
            (imageObj) =>
                compItemsDictionary[parseInt(imageObj.name.split(".")[0], 10)]
        ) // Filter out images without a match
        .sort((a, b) => {
            const idA = parseInt(a.name.split(".")[0], 10);
            const idB = parseInt(b.name.split(".")[0], 10);
            return idA - idB;
        });

    // Entrees
    const entreeImages = importAll(
        require.context("../../images/components/entrees", false, /\.(png)$/)
    )
        .filter(
            (imageObj) =>
                compItemsDictionary[parseInt(imageObj.name.split(".")[0], 10)]
        ) // Filter out images without a match
        .sort((a, b) => {
            const idA = parseInt(a.name.split(".")[0], 10);
            const idB = parseInt(b.name.split(".")[0], 10);
            return idA - idB;
        });

    // Drinks
    const drinkImages = importAll(
        require.context("../../images/components/drinks", false, /\.(png)$/)
    )
        .filter(
            (imageObj) =>
                compItemsDictionary[parseInt(imageObj.name.split(".")[0], 10)]
        ) // Filter out images without a match
        .sort((a, b) => {
            const idA = parseInt(a.name.split(".")[0], 10);
            const idB = parseInt(b.name.split(".")[0], 10);
            return idA - idB;
        });

    // Appetizers
    const appetizerImages = importAll(
        require.context("../../images/components/appetizers", false, /\.(png)$/)
    )
        .filter(
            (imageObj) =>
                compItemsDictionary[parseInt(imageObj.name.split(".")[0], 10)]
        ) // Filter out images without a match
        .sort((a, b) => {
            const idA = parseInt(a.name.split(".")[0], 10);
            const idB = parseInt(b.name.split(".")[0], 10);
            return idA - idB;
        });

    // Panda Cub Meals
    const cubImages = importAll(
        require.context("../../images/components/panda_cub_meals", false, /\.(png)$/)
    )
        .filter(
            (imageObj) =>
                menuItemsDictionary[parseInt(imageObj.name.split(".")[0], 10)]
        ) // Filter out images without a match
        .sort((a, b) => {
            const idA = parseInt(a.name.split(".")[0], 10);
            const idB = parseInt(b.name.split(".")[0], 10);
            return idA - idB;
        });

    // A La Carte Options
    const aLaCarteimages = importAll(
        require.context("../../images/components/a_la_carte", false, /\.(png)$/)
    )
        .filter(
            (imageObj) =>
                compItemsDictionary[parseInt(imageObj.name.split(".")[0], 10)]
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
                            const itemName = compItemsDictionary[itemId]?.component_name || "Unknown Item";
                
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
                            const itemName = compItemsDictionary[itemId]?.component_name || "Unknown Item";
                
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
            { (item === 19) && ( 
                <div className="item-type"> 
                    <div className="labels">   
                        <h2>Select Your Drink:</h2>
                    </div>
                    <div className="menu-display">
                        {drinkImages.map((imageObj, index) => {
                            const itemId = parseInt(imageObj.name.split(".")[0], 10);
                            const itemName = compItemsDictionary[itemId]?.component_name || "Unknown Item";
                
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
            { (item === 13) && ( 
                <div className="item-type"> 
                    <div className="labels">   
                        <h2>Select Your Appetizer:</h2>
                    </div>
                    <div className="menu-display">
                        {appetizerImages.map((imageObj, index) => {
                            const itemId = parseInt(imageObj.name.split(".")[0], 10);
                            const itemName = compItemsDictionary[itemId]?.component_name || "Unknown Item";
                
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

            {/* PANDA CUB MEALS */}
            { (item === 5) && ( 
                <div className="item-type"> 
                    <div className="labels">   
                        <h2>Select Your Meal:</h2>
                    </div>
                    <div className="menu-display">
                        {cubImages.map((imageObj, index) => {
                            const itemId = parseInt(imageObj.name.split(".")[0], 10);
                            const itemName = menuItemsDictionary[itemId]?.item_name || "Unknown Item";
                
                            return (
                                <button key={index} className="menu-button">
                                    <img src={imageObj.src} alt={`Panda Cub Meal ${index + 1}`} className="menu-image" />
                                    {itemName}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* A LA CARTE */}
            { (item === 15) && ( 
                <div className="item-type"> 
                    <div className="labels">   
                        <h2>Select Your Item:</h2>
                    </div>
                    <div className="menu-display">
                        {aLaCarteimages.map((imageObj, index) => {
                            const itemId = parseInt(imageObj.name.split(".")[0], 10);
                            const itemName = compItemsDictionary[itemId]?.component_name || "Unknown Item";
                
                            return (
                                <button key={index} className="menu-button">
                                    <img src={imageObj.src} alt={`A La Carte Item ${index + 1}`} className="menu-image" />
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
