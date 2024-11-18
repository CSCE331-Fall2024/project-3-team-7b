import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import "./orderComponents.css";
import { useDispatch, useSelector } from 'react-redux';
import { useEnlarge } from '../../EnlargeContext';

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
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const view = props.view;
    const subtotal = useSelector((state) => state.subtotal);
    const order = useSelector((state) => state.order);
    
    // context to know if text should be enlarged
    const { isEnlarged } = useEnlarge();

    // Makes API call to retreive menu item information
    useEffect(() => {
        const fetchData = async () => {
            try {
                const baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';
                const response = await axios.get(`${baseURL}/api/menu_items`);
                setData(response.data);
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
    
    // Update values of subtotal and order in redux storage
    const dispatch = useDispatch();
    const handleUpdate = (new_subtotal, new_order) => {
        dispatch({type: "write", data: {subtotal: new_subtotal, order: new_order}});
    }

    // Navigates user to the next stage of the order
    const handleOrder = (index) => {
        handleUpdate(subtotal + parseFloat(itemsDictionary[parseInt(index)].price), order + "\n" + itemsDictionary[parseInt(index)].item_name);
        if (index === "9.png" || index === "5.png"){
            navigate("/customer/order/choose-meal", {state: {item: index, view: view}});
        }
        else {
            navigate("/customer/order/select", {state: {item: index, view: view}});
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
                    itemId === 23 ? "Catering" :
                    itemsDictionary[itemId]?.item_name || "Unknown Item";

                
                return (
                    <button key={index} className={`menu-button ${isEnlarged ? 'enlarged' : ''}`} onClick={() => handleOrder(imageObj.name)}>
                        <img src={imageObj.src} alt={`Menu Item ${index + 1}`} className={`menu-image ${isEnlarged ? 'enlarged' : ''}`} />
                        {itemName}
                    </button>
                );
            })}
        </div>
    );
}

export default MenuDisplay;
