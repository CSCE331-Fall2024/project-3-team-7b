import { Button } from "@mui/material";
import React from "react";
import "./orderComponents.css";
import { useNavigate } from "react-router-dom";

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
const drinkImages = importImages(require.context("../../images/components/drinks", false, /\.(png)$/));
const appetizerImages = importImages(require.context("../../images/components/appetizers", false, /\.(png)$/));


function SelectItem(props) {
    console.log(props.item);
    const item = props.item;
    const view = props.view;
    const navigate = useNavigate();

    const backToMenu = () => {
        navigate("/" + view + "/order", {state: {view: view}})
    }

    // write code to determine number of entrees that can be selected
    return (
        <div className="menu-display">
            {/* BACK BUTTON */}
            <div>
                <Button variant="contained" color="secondary" onClick={backToMenu}>BACK TO MENU</Button>
            </div>
            {/* SIDES */}
            { (item <= 3 || item === 9 || item === 11) && (
                <div className="item-type"> 
                    <div className="labels">   
                        <h2>Select Your Side:</h2>
                    </div>
                    <div className="menu-display">
                        {sideImages.map((imageObj, index) => (
                            <button key={index} className="menu-button">
                                <img src={imageObj.src} alt={`Side Item ${index + 1}`} className="menu-image" />
                            </button>
                        ))}
                    </div>
                </div>
            )}
            {/* ENTREES */}
            { (item <= 3 || item === 9 || item === 11) && ( 
                <div className="item-type"> 
                    <div className="labels">   
                        <h2>Select Your Entree(s):</h2>
                    </div>
                    <div className="menu-display">
                        {entreeImages.map((imageObj, index) => (
                            <button key={index} className="menu-button">
                                <img src={imageObj.src} alt={`Entree Item ${index + 1}`} className="menu-image" />
                            </button>
                        ))}
                    </div>
                </div>
            )}
            {/* DRINKS */}
            { (item === 19 ) && ( 
                <div className="item-type"> 
                    <div className="labels">   
                        <h2>Select Your Drink:</h2>
                    </div>
                    <div className="menu-display">
                        {drinkImages.map((imageObj, index) => (
                            <button key={index} className="menu-button">
                                <img src={imageObj.src} alt={`Entree Item ${index + 1}`} className="menu-image" />
                            </button>
                        ))}
                    </div>
                </div>
            )}
            {/* APPETIZERS */}
            { (item === 13 ) && ( 
                <div className="item-type"> 
                    <div className="labels">   
                        <h2>Select Your Appetizer:</h2>
                    </div>
                    <div className="menu-display">
                        {appetizerImages.map((imageObj, index) => (
                            <button key={index} className="menu-button">
                                <img src={imageObj.src} alt={`Entree Item ${index + 1}`} className="menu-image" />
                            </button>
                        ))}
                    </div>
                </div>
            )}
        
        </div>
    );
}

export default SelectItem;
