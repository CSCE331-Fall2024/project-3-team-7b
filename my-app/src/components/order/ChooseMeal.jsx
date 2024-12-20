import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardActionArea, CardMedia, Button, Typography } from "@mui/material";
import "./orderComponents.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { flushSync } from 'react-dom';
import { useEnlarge } from '../../EnlargeContext';
import Magnifier from "react-magnifier";

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

    // context to know if text should be enlarged
    const { isEnlarged } = useEnlarge();

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
        const itemId = parseInt(index);

        subtotals.push(parseFloat(menuItemsDictionary[itemId].price));
        
        if (orders.length === 0) {
            orders.push([]); // Add an empty array if orders is empty or last element isn't an array
        }
        orders.at(-1).push(menuItemsDictionary[parseInt(itemId)].item_name);
        handleUpdate(subtotals, orders);


        if (view === "cashier") {
            navigate("/cashier/order/select", {state: {item: index, view: view}});
        }
        else {
            navigate("/customer/order/select", {state: {item: index, view: view}});
        }
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
                                <Card
                                    key={index}
                                    className={`item-card ${isEnlarged ? 'enlarged' : ''}`}
                                    onClick={() => handleOrder(imageObj.name)} 
                                >
                                    <CardActionArea>
                                        <div className="image-container">
                                            {/* <CardMedia
                                                component="img"
                                                image={imageObj.src}
                                                alt={`Panda Cub Meal ${index + 1}`}
                                                className={`card-image ${isEnlarged ? 'enlarged' : ''}`}
                                            /> */}
                                            <Magnifier 
                                                src={imageObj.src} 
                                                className={`card-image ${isEnlarged ? 'enlarged' : ''}`}
                                            />
                                        </div>
                                    <div className="menu-card-content">
                                        <Typography className={`item-name ${isEnlarged ? 'enlarged' : ''}`}>
                                        {itemName}
                                        </Typography>
                                    </div>
                                    </CardActionArea>
                                </Card>
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
                                <Card
                                    key={index}
                                    className={`item-card ${isEnlarged ? 'enlarged' : ''}`}
                                    onClick={() => handleOrder(imageObj.name)} 
                                >
                                    <CardActionArea>
                                        <div className="image-container">
                                            {/* <CardMedia
                                                component="img"
                                                image={imageObj.src}
                                                alt={`Panda Bundle ${index + 1}`}
                                                className={`card-image ${isEnlarged ? 'enlarged' : ''}`}
                                            /> */}
                                            <Magnifier 
                                                src={imageObj.src} 
                                                className={`card-image ${isEnlarged ? 'enlarged' : ''}`}
                                            />
                                        </div>
                                    <div className="menu-card-content">
                                        <Typography className={`item-name ${isEnlarged ? 'enlarged' : ''}`}>
                                        {itemName}
                                        </Typography>
                                    </div>
                                    </CardActionArea>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            )}

        </div>
    );
}

export default ChooseMeal;
