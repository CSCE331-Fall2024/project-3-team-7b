// MenuDisplay.js
import React from "react";
import "./orderComponents.css";

// Dynamically load all images from a folder
const importAll = (r) => {
    return r.keys().map(r);
}

// Import all images from the images folder (you can adjust the path)
const images = importAll(require.context("../../images/menu_items", false, /\.(png)$/));

console.log(images);

function MenuDisplay() {
    return (
        <div className="menu-display">
            {images.length > 0 ? (
                images.map((image, index) => (
                    <button key={index} className="menu-button">
                        <img src={image} alt={`Menu Item ${index + 1}`} className="menu-image" />
                        <p>Item {index + 1}</p>
                    </button>
                ))
            ) : (
                <p>No images found</p>
            )}
        </div>
    );
}

export default MenuDisplay;
