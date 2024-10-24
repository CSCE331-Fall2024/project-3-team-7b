

import React from "react";
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

// Import all images from the images folder (you can adjust the path)
const images = importAll(require.context("../../images/small_menu", false, /\.(png)$/));

function MenuDisplay() {
    const navigate = useNavigate();
    
    const directOrder = (index) => {
        navigate("/customer/order/select", { state: { item: index } });
    }
    return (
        <div className="menu-display">
            {images.map((imageObj, index) => (
                <button key={index} className="menu-button" onClick={() => directOrder(imageObj.name)}>
                    <img src={imageObj.src} alt={`Menu Item ${index + 1}`} className="menu-image" />
                </button>
            ))}
        </div>
    );
}

export default MenuDisplay;
