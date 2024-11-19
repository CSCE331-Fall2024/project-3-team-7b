import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from "@mui/material";
import "./orderComponents.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { flushSync } from 'react-dom';

// Purpose: Displays meal options such as bowl/plate/bigger plate bundle

// Dynamically load all images from a folder
const importAll = (r) => {
    return r.keys().map((fileName) => {
        return {
            src: r(fileName), // The image source
            name: fileName.replace('./', '') // The file name without the leading './'
        };
    });
}

function ChooseMeal(props) {
    // Fetch current values of subtotal and order from redux storage
    const subtotals = useSelector((state) => state.orders.at(0));
    const orders = useSelector((state) => state.orders.at(1));
    const item = parseInt(props.item, 10);


    const view = props.view;
    const navigate = useNavigate();

    const [menuData, setMenuData] = useState([]);

    // Fetch menu item data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';

                const [menuResponse] = await Promise.all([
                    axios.get(`${baseURL}/api/menu_items`)
                ]);

                setMenuData(menuResponse.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);

    // Create a dictionary with `itemid` as keys for easy lookup
    const menuItemsDictionary = menuData.reduce((dict, item) => {
        dict[item.itemid] = item;
        return dict;
    }, {});

    const dispatch = useDispatch();
    const handleUpdate = (newSubtotals, newOrders) => {
        dispatch({type: "write", data: {orders: [newSubtotals, newOrders]}});
    }

    // Navigates user to the next stage of the order
    const handleOrder = (index) => {
        handleUpdate(subtotals, orders.at(-1).push(menuItemsDictionary[parseInt(index)].item_name));

        navigate("/customer/order/select", {state: {item: index, view: view}});
    }

    // Navigates user back to the main menu
    const backToMenu = () => {
        navigate("/" + view + "/order", {state: {view: view}})
    }

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

    // Panda Bundle Options
    const bundleImages = importAll(
        require.context("../../images/full_menu_items/bundles", false, /\.(png)$/)
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

    // write code to determine number of entrees that can be selected
    return (
        <div className="menu-display">
            {/* BACK BUTTON */}
            <div>
                <Button variant="contained" color="secondary" onClick={backToMenu}>BACK TO MENU / ADD TO ORDER</Button>
            </div>

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
                                <button key={index} className="menu-button" onClick={() => handleOrder(imageObj.name)}>
                                    <img src={imageObj.src} alt={`Panda Cub Meal ${index + 1}`} className="menu-image" />
                                    {itemName}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* BUNDLES */}
            { (item === 9) && ( 
                <div className="item-type"> 
                    <div className="labels">   
                        <h2>Select Your Bundle:</h2>
                    </div>
                    <div className="menu-display">
                        {bundleImages.map((imageObj, index) => {
                            const itemId = parseInt(imageObj.name.split(".")[0], 10);
                            const itemName = menuItemsDictionary[itemId]?.item_name || "Unknown Item";
                
                            return (
                                <button key={index} className="menu-button" onClick={() => handleOrder(imageObj.name)}>
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

export default ChooseMeal;
