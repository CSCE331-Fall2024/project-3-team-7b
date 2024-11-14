import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from "@mui/material";
import "./orderComponents.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { flushSync } from 'react-dom';

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
    // Fetch current values of subtotal and order from redux storage
    const item = parseInt(props.item, 10);

    const view = props.view;
    const navigate = useNavigate();
    const subtotal = useSelector((state) => state.subtotal);
    const order = useSelector((state) => state.order);

    const [numSides, setNumSides] = useState(0);
    const [numEntrees, setNumEntrees] = useState(0);

    const [disableBack, setDisableBack] = useState(true);
    const [disableSides, setDisableSides] = useState(false);
    const [disableEntrees, setDisableEntrees] = useState(false);

    let maxSides = 1;
    let maxEntrees = 1;
    if (item === 1 || item === 7 || item === 8) {
        maxEntrees = 1;
    }
    else if (item === 2 || item === 9) {
        maxEntrees = 2;
    }
    else if (item === 3 || item === 10 || item === 11) {
        maxEntrees = 3;
    }
    else if (item === 13 || item === 15 || item === 19) {
        maxSides = 0;
    }
    else if (item === 23) {
        maxSides = 0;
        maxEntrees = 0;
    }

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

    const dispatch = useDispatch();
    const handleUpdate = (new_subtotal, new_order) => {
        dispatch({type: "write", data: {subtotal: new_subtotal, order: new_order}});
    }

    // Navigates user to the next stage of the order
    let tempNumSides = numSides;
    let tempNumEntrees = numEntrees;
    const handleOrder = (index) => {
        if (parseInt(index) == 6 || parseInt(index) == 7 || parseInt(index) == 12 || parseInt(index) == 13) { // Side
            tempNumSides += 1;
            setNumSides(current => current + 1);
            if (tempNumSides >= maxSides) {
                setDisableSides(true); // Disable choosing more sides
            }
        }
        else { // Entree or other (drink, etc.)
            tempNumEntrees += 1;
            setNumEntrees(current => current + 1);
            if (tempNumEntrees >= maxEntrees) {
                setDisableEntrees(true); // Disable choosing more entrees
            }
        }

        if (tempNumSides >= maxSides && tempNumEntrees >= maxEntrees) {
            // console.log(tempNumEntrees, maxEntrees, tempNumSides, maxSides);
            setDisableBack(false); // Let user go back to add more food items
        }
        handleUpdate(subtotal, order + "\n\t" + compItemsDictionary[parseInt(index)].component_name);
    }

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
        require.context("../../images/full_menu_items/panda_cub_meals", false, /\.(png)$/)
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
                <Button variant="contained" color="secondary" onClick={backToMenu} disabled={disableBack}>BACK TO MENU / ADD TO ORDER</Button>
            </div>

            {/* SIDES */}
            { (item <= 11) && (
                <div className="item-type"> 
                    <div className="labels">   
                        <h2>Select Your Side:</h2>
                    </div>
                    <div className="menu-display">
                        {sideImages.map((imageObj, index) => {
                            const itemId = parseInt(imageObj.name.split(".")[0], 10);
                            const itemName = compItemsDictionary[itemId]?.component_name || "Unknown Item";
                
                            return (
                                <button key={index} className="menu-button" onClick={() => handleOrder(imageObj.name)} disabled={disableSides}>
                                    <img src={imageObj.src} alt={`Menu Item ${index + 1}`} className="menu-image" />
                                    {itemName}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* ENTREES */}
            { (item <= 3 || (item >= 7 && item <= 11)) && ( 
                <div className="item-type"> 
                    <div className="labels">   
                        <h2>Select Your Entree(s):</h2>
                    </div>
                    <div className="menu-display">
                        {entreeImages.map((imageObj, index) => {
                            const itemId = parseInt(imageObj.name.split(".")[0], 10);
                            const itemName = compItemsDictionary[itemId]?.component_name || "Unknown Item";
                
                            return (
                                <button key={index} className="menu-button" onClick={() => handleOrder(imageObj.name)} disabled={disableEntrees}>
                                    <img src={imageObj.src} alt={`Entree Item ${index + 1}`} className="menu-image" />
                                    {itemName}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* DRINKS */}
            { ((item >= 4 && item <=10 )|| item === 19) && ( 
                <div className="item-type"> 
                    <div className="labels">   
                        <h2>Select Your Drink:</h2>
                    </div>
                    <div className="menu-display">
                        {drinkImages.map((imageObj, index) => {
                            const itemId = parseInt(imageObj.name.split(".")[0], 10);
                            const itemName = compItemsDictionary[itemId]?.component_name || "Unknown Item";
                
                            return (
                                <button key={index} className="menu-button" onClick={() => handleOrder(imageObj.name)} disabled={disableEntrees}>
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
                                <button key={index} className="menu-button" onClick={() => handleOrder(imageObj.name)} disabled={disableEntrees}>
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
                                <button key={index} className="menu-button" onClick={() => handleOrder(imageObj.name)} disabled={disableEntrees}>
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
                                <button key={index} className="menu-button" onClick={() => handleOrder(imageObj.name)} disabled={disableEntrees}>
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
