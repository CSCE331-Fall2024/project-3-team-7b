import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import "./orderComponents.css";
import { useDispatch, useSelector } from 'react-redux';
import { useEnlarge } from '../../EnlargeContext';
import { Card, CardActionArea, CardMedia, Typography } from "@mui/material";
import Magnifier from "react-magnifier";

// Purpose: Displays the menu items such as bowls, plates, etc

// Dynamically load all images from a folder
const importAll = (r) => {
    return r.keys().map((fileName) => {
        return {
            src: r(fileName), // The image source
            name: fileName.replace('./', '') // The file name without the leading './'
        };
    });
}

// Import all images from the images folder (adjust the path if necessary)
const images = importAll(require.context("../../images/small_menu", false, /\.(png)$/));

function MenuDisplay(props) {
    // Fetch current values of subtotal and order from redux storage
    const subtotals = useSelector((state) => state.orders.at(0));
    const orders = useSelector((state) => state.orders.at(1));
    const isComplete = useSelector((state) => state.isComplete);
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const view = props.view;

    // context to know if text should be enlarged
    const { isEnlarged, setIsEnlarged } = useEnlarge();

    // Makes API call to retreive menu item information
    useEffect(() => {
        const fetchData = async () => {
            try {
                const baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';
                const response = await axios.get(`${baseURL}/api/menu_items`);
                setData(response.data);

                console.log(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);

    // Create a dictionary with `itemid` as keys for easy lookup
    const itemsDictionary = data.reduce((dict, item) => {
        dict[item.itemid] = item;
        return dict;
    }, {});

    console.log(itemsDictionary);
    
    // Update values of subtotal, order, and isComplete in redux storage
    const dispatch = useDispatch();
    const handleUpdate = (newSubtotals, newOrders) => {
        dispatch({type: "write", data: {orders: [[...newSubtotals], [...newOrders]], isComplete: false}});
    }

    // Navigates user to the next stage of the order
    const handleOrder = (index) => {
        const itemId = parseInt(index);
        const itemName = 
            itemId === 5 ? ["Panda Cub Meal"] :
            itemId === 9 ? ["Panda Bundles"] :
            itemId === 13 ? ["Appetizers and More"] :
            itemId === 15 ? ["A La Carte"] :
            itemId === 19 ? ["Drinks"] :
            [itemsDictionary[itemId]?.item_name || "Unknown Item"];

        // only updates the price if the there are no further menu choices
        // ex: won't update price for items where you have to choose the size
        if (!((itemId >= 12) || (itemId >= 5 && itemId <= 10))){
            subtotals.push(parseFloat(itemsDictionary[itemId].price));
        }
        
        orders.push(itemName);
        handleUpdate(subtotals, orders);
        if (view === "cashier") {
            if (index === "9.png" || index === "5.png"){
                navigate("/cashier/order/choose-meal", {state: {item: index, view: view}});
            }
            else {
                navigate("/cashier/order/select", {state: {item: index, view: view}});
            }
        }
        else {
            if (index === "9.png" || index === "5.png"){
                navigate("/customer/order/choose-meal", {state: {item: index, view: view}});
            }
            else {
                navigate("/customer/order/select", {state: {item: index, view: view}});
            }
        }
    }

    // Sort images based on `itemid`
    const sortedImages = images
        .filter(imageObj => itemsDictionary[parseInt(imageObj.name.split(".")[0], 10)]) // Filter out images without a match
        .sort((a, b) => {
            const idA = parseInt(a.name.split(".")[0], 10);
            const idB = parseInt(b.name.split(".")[0], 10);
            return idA - idB;
        });

    return (
        // Displays all the buttons for menu items w/ corresponding names
        <div className="menu-display">
            {sortedImages.map((imageObj, index) => {
                const itemId = parseInt(imageObj.name.split(".")[0], 10);
                const itemName = 
                    itemId === 5 ? "Panda Cub Meal" :
                    itemId === 9 ? "Panda Bundles" :
                    itemId === 13 ? "Appetizers and More" :
                    itemId === 15 ? "A La Carte" :
                    itemId === 19 ? "Drinks" :
                    itemsDictionary[itemId]?.item_name || "Unknown Item";

                
                return (
                    <div>
                    <Card
                        key={index}
                        className= "item-card"
                        onClick={() => {handleOrder(imageObj.name); }}
                    >
                        <CardActionArea>
                            <div className="image-container">
                                <Magnifier 
                                    src={imageObj.src} 
                                    className={`card-image ${isEnlarged ? 'enlarged' : ''}`}
                                />
                            </div>
                            <div className="item-card-content">
                                <Typography className={`item-name ${isEnlarged ? 'enlarged' : ''}`}>
                                    {itemName}
                                </Typography>
                            </div>
                        </CardActionArea>
                    </Card>
                    </div>
                );
            })}
        </div>
    );
}

export default MenuDisplay;
