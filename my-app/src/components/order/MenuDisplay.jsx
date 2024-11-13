import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import "./orderComponents.css";

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
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const subtotal = props.subtotal;
    const tax = props.tax;
    const total = props.total;
    const order = props.order;

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
    
    // Navigates user to the next stage of the order
    const directOrder = (index) => {
        props.update(1, 1, 1, "a");
        navigate("/customer/order/select", { state: { item: index, subtotal: subtotal, tax: tax, total:total, order: order, update: props.update } });
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
        // Displats all the buttons for menu items w/ corresponding names
        <div className="menu-display">
            {sortedImages.map((imageObj, index) => {
                const itemId = parseInt(imageObj.name.split(".")[0], 10);
                const itemName = itemsDictionary[itemId]?.item_name || "Unknown Item";
                
                return (
                    <button key={index} className="menu-button" onClick={() => directOrder(imageObj.name)}>
                        <img src={imageObj.src} alt={`Menu Item ${index + 1}`} className="menu-image" />
                        {itemName}
                    </button>
                );
            })}
        </div>
    );
}

export default MenuDisplay;
