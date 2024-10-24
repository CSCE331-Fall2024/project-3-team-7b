import React from "react";
import "./orderComponents.css";

// Dynamically load all images from a folder
const importImages = (r) => {
    return r.keys().map((fileName) => {
        return {
            src: r(fileName), // The image source
            name: fileName.replace('./', '') // The file name without the leading './'
        };
    });
}

// Import all images from the images folder (you can adjust the path)
const sideImages = importImages(require.context("../../images/components/sides", false, /\.(png)$/));
const entreeImages = importImages(require.context("../../images/components/entrees", false, /\.(png)$/));

function SelectItem({item}) {

    // write code to determine number of entrees that can be selected
    return (
        <div className="menu-display">
            <div className="menu-display">
            {item <= 3 && ( // Ensure item is destructured and checked properly
                <div>
                    <div className="item-type"> 
                        <h2>Select Your Side</h2>
                        <div className="menu-display">
                            {sideImages.map((imageObj, index) => (
                                <button key={index} className="menu-button">
                                    <img src={imageObj.src} alt={`Side Item ${index + 1}`} className="menu-image" />
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="item-type"> 
                        <h2>Select Your Entree(s)</h2>
                        <div className="menu-display">
                            {entreeImages.map((imageObj, index) => (
                                <button key={index} className="menu-button">
                                    <img src={imageObj.src} alt={`Entree Item ${index + 1}`} className="menu-image" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
        
        </div>
    );
}

export default SelectItem;
