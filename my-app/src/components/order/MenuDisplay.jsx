import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import "./orderComponents.css";

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

function MenuDisplay() {
    const navigate = useNavigate();
    const [data, setData] = useState([]);

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
    
    const directOrder = (index) => {
        navigate("/customer/order/select", { state: { item: index } });
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
