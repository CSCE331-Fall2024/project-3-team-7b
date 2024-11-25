import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Typography, Box, Modal } from "@mui/material";
import "./orderComponents.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { flushSync } from 'react-dom';
import { useEnlarge } from '../../EnlargeContext';

// Purpose: Displays individual items such as orange chicken, dr. pepper, cream cheese rangoons, etc

// Dynamically load all images from a folder
const importAll = (r) => {
    return r.keys().map((fileName) => {
        return {
            src: r(fileName), // The image source
            name: fileName.replace('./', '') // The file name without the leading './'
        };
    });
}

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '35vw',
    bgcolor: 'background.paper',
    border: '1px solid',
    borderRadius: '25px',
    boxShadow: 24,
    p: 4,
};

function SelectItem(props) {
    // Fetch current values of subtotal, order, and if order is complete (valid) from redux storage
    const subtotals = useSelector((state) => state.orders.at(0));
    const orders = useSelector((state) => state.orders.at(1));
    const isComplete = useSelector((state) => state.isComplete);
    const item = parseInt(props.item, 10);

    const view = props.view;
    const navigate = useNavigate();

    const [numSides, setNumSides] = useState(0);
    const [numEntrees, setNumEntrees] = useState(0);

    const [disableBack, setDisableBack] = useState(true);
    const [disableSides, setDisableSides] = useState(false);
    const [disableEntrees, setDisableEntrees] = useState(false);

    // context to know if text should be enlarged
    const { isEnlarged } = useEnlarge();

    // for popup to select size of a la carte, drinks, and appetizers
    const [openItem, setOpenItem] = React.useState(null);
    const handleOpen = (itemId) => setOpenItem(itemId); 
    const handleClose = () => setOpenItem(null);

    let maxSides = 1;
    let maxEntrees = 1;
    if (item === 1 || item === 7 || item === 8) {
        maxEntrees = 1;
    }
    else if (item === 2 || item === 9) {
        maxEntrees = 2;
    }
    else if (item === 3 || item === 10 || item === 11) {
        maxEntrees = 3;
    }
    else if (item === 13 || item === 15 || item === 19) {
        maxSides = 0;
    }
    else if (item === 23) {
        maxSides = 0;
        maxEntrees = 0;
    }

    const [compData, setCompData] = useState([]);
    const [menuData, setMenuData] = useState([]);

    // Fetch component and menu data concurrently
    useEffect(() => {
        const fetchData = async () => {
            try {
                const baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';

                // Use Promise.all to fetch both data sources at the same time
                const [compResponse, menuResponse] = await Promise.all([
                    axios.get(`${baseURL}/api/components`),
                    axios.get(`${baseURL}/api/menu_items`)
                ]);

                setCompData(compResponse.data);
                setMenuData(menuResponse.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);

    // Create a dictionary with `itemid` as keys for easy lookup
    const compItemsDictionary = compData.reduce((dict, item) => {
        dict[item.componentid] = item;
        return dict;
    }, {});

    const menuItemsDictionary = menuData.reduce((dict, item) => {
        dict[item.itemid] = item;
        return dict;
    }, {});

    // Update values of subtotal, order, and isComplete in redux storage
    const dispatch = useDispatch();
    const handleUpdate = (newSubtotals, newOrders, tempNumSides, maxSides, tempNumEntrees, maxEntrees) => {
        const isComplete = tempNumSides >= maxSides && tempNumEntrees >= maxEntrees;
        dispatch({type: "write", data: {orders: [[...newSubtotals], [...newOrders]], isComplete: isComplete}});
    }

    // Navigates user to the next stage of the order
    let tempNumSides = numSides;
    let tempNumEntrees = numEntrees;
    const handleOrder = (index) => {
        index = parseInt(index);

        if (index === 6 || index === 7 || index === 12 || index === 13) { // Side
            tempNumSides += 1;
            setNumSides(current => current + 1);
            if (tempNumSides >= maxSides) {
                setDisableSides(true); // Disable choosing more sides
            }
        }
        else { // Entree or other (drink, etc.)
            tempNumEntrees += 1;
            setNumEntrees(current => current + 1);
            if (tempNumEntrees >= maxEntrees) {
                setDisableEntrees(true); // Disable choosing more entrees
            }
        }

        if (tempNumSides >= maxSides && tempNumEntrees >= maxEntrees) {
            // console.log(tempNumEntrees, maxEntrees, tempNumSides, maxSides);
            setDisableBack(false); // Let user go back to add more food items
        }

        const isPremium = compItemsDictionary[index].premium;
        if (isPremium === true) {
            subtotals[subtotals.length - 1] += 1.25;
            const premiumLabel = [compItemsDictionary[parseInt(index)].component_name + " +$1.25"];
            orders.at(-1).push(premiumLabel);
        }
        else {
            orders.at(-1).push(compItemsDictionary[parseInt(index)].component_name);
        }
        
        handleUpdate(subtotals, orders, tempNumSides, maxSides, tempNumEntrees, maxEntrees);
    }

    const handleSize = (size, index) => {
        setDisableBack(false); // Let user go back to add more food items
        index = parseInt(index);
        const component = compItemsDictionary[index].component_name;

        let itemID = 0;

        let sizeOfOrder = [];
        if (size === "S") {
            sizeOfOrder = ["Small " + component]

            // connects component w/ small drink menu item
            if (index >= 22 && index <= 26){
                itemID = 17;
            }
            // connects component w/ small appetizer
            else if (index === 8 || index === 9 || index === 11 || index === 21){
                itemID = 12;
            }
            else {
                itemID = 14;
            }
        }
        else if (size === "M") {
            sizeOfOrder = ["Medium " + component]

            // connects component w/ medium drink menu item
            if (index >= 22 && index <= 26){
                itemID = 18;
            }
            else {
                itemID = 15;
            }
        }
        else {
            sizeOfOrder = ["Large " + component]

            // connects component w/ large drink menu item
            if (index >= 22 && index <= 26){
                itemID = 19;
            }
            // connects component w/ large appetizer
            else if (index === 8 || index === 9 || index === 11 || index === 21){
                itemID = 12;
            }
            else {
                itemID = 16;
            }
        }

        const isPremium = compItemsDictionary[index].premium;
        if (isPremium === true) {
            const premiumLabel = [sizeOfOrder + " +$1.25"];
            orders.at(-1).push(premiumLabel);
        }
        else {
            orders.at(-1).push(sizeOfOrder);
        }

        subtotals.push(parseFloat(menuItemsDictionary[itemID].price));
        if (isPremium === true) {
            subtotals[subtotals.length - 1] += 1.25;
        }
        tempNumSides = maxSides;
        tempNumEntrees = maxEntrees;
        handleUpdate(subtotals, orders, tempNumSides, maxSides, tempNumEntrees, maxEntrees);
    }

    // Import all images from the images folder (you can adjust the path)
    // Sides
    const sideImages = importAll(
        require.context("../../images/components/sides", false, /\.(png)$/)
    )
        .filter(
            (imageObj) =>
                compItemsDictionary[parseInt(imageObj.name.split(".")[0], 10)]
        ) // Filter out images without a match
        .sort((a, b) => {
            const idA = parseInt(a.name.split(".")[0], 10);
            const idB = parseInt(b.name.split(".")[0], 10);
            return idA - idB;
        });

    // Entrees
    const entreeImages = importAll(
        require.context("../../images/components/entrees", false, /\.(png)$/)
    )
        .filter(
            (imageObj) =>
                compItemsDictionary[parseInt(imageObj.name.split(".")[0], 10)]
        ) // Filter out images without a match
        .sort((a, b) => {
            const idA = parseInt(a.name.split(".")[0], 10);
            const idB = parseInt(b.name.split(".")[0], 10);
            return idA - idB;
        });

    // Drinks
    const drinkImages = importAll(
        require.context("../../images/components/drinks", false, /\.(png)$/)
    )
        .filter(
            (imageObj) =>
                compItemsDictionary[parseInt(imageObj.name.split(".")[0], 10)]
        ) // Filter out images without a match
        .sort((a, b) => {
            const idA = parseInt(a.name.split(".")[0], 10);
            const idB = parseInt(b.name.split(".")[0], 10);
            return idA - idB;
        });

    // Appetizers
    const appetizerImages = importAll(
        require.context("../../images/components/appetizers", false, /\.(png)$/)
    )
        .filter(
            (imageObj) =>
                compItemsDictionary[parseInt(imageObj.name.split(".")[0], 10)]
        ) // Filter out images without a match
        .sort((a, b) => {
            const idA = parseInt(a.name.split(".")[0], 10);
            const idB = parseInt(b.name.split(".")[0], 10);
            return idA - idB;
        });

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

    // A La Carte Options
    const aLaCarteimages = importAll(
        require.context("../../images/components/a_la_carte", false, /\.(png)$/)
    )
        .filter(
            (imageObj) =>
                compItemsDictionary[parseInt(imageObj.name.split(".")[0], 10)]
        ) // Filter out images without a match
        .sort((a, b) => {
            const idA = parseInt(a.name.split(".")[0], 10);
            const idB = parseInt(b.name.split(".")[0], 10);
            return idA - idB;
        });

    // Navigates user back to the main menu
    const backToMenu = () => {
        navigate("/" + view + "/order", {state: {view: view}})
    }

    // write code to determine number of entrees that can be selected
    return (
        <div className="menu-display">
            {/* BACK BUTTON */}
            <div>
                <Button variant="contained" color="secondary" onClick={backToMenu} disabled={disableBack}>ADD TO ORDER</Button>
            </div>

            {/* SIDES */}
            { (item <= 11) && (
                <div className="item-type"> 
                    <div className="labels">   
                        <h2>Select Your Side:</h2>
                    </div>
                    <div className="menu-display">
                        {sideImages.map((imageObj, index) => {
                            const itemId = parseInt(imageObj.name.split(".")[0], 10);
                            const itemName = compItemsDictionary[itemId]?.component_name || "Unknown Item";
                
                            return (
                                <button key={index} className={`menu-button ${isEnlarged ? 'enlarged' : ''}`} onClick={() => handleOrder(imageObj.name)} disabled={disableSides}>
                                    <img src={imageObj.src} alt={`Menu Item ${index + 1}`} className={`menu-image ${isEnlarged ? 'enlarged' : ''}`} />
                                    {itemName}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* ENTREES */}
            { (item <= 3 || (item >= 7 && item <= 11)) && ( 
                <div className="item-type"> 
                    <div className="labels">   
                        <h2>Select Your Entree(s):</h2>
                    </div>
                    <div className="menu-display">
                        {entreeImages.map((imageObj, index) => {
                            const itemId = parseInt(imageObj.name.split(".")[0], 10);
                            const itemName = compItemsDictionary[itemId]?.component_name || "Unknown Item";
                
                            return (
                                <button key={index} className={`menu-button ${isEnlarged ? 'enlarged' : ''}`} onClick={() => handleOrder(imageObj.name)} disabled={disableEntrees}>
                                    <img src={imageObj.src} alt={`Entree Item ${index + 1}`} className={`menu-image ${isEnlarged ? 'enlarged' : ''}`} />
                                    {itemName}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* DRINKS */}
            { ((item >= 4 && item <=10 )|| item === 19) && ( 
                <div className="item-type"> 
                    <div className="labels">   
                        <h2>Select Your Drink:</h2>
                    </div>
                    <div className="menu-display">
                        {drinkImages.map((imageObj, index) => {
                            const itemId = parseInt(imageObj.name.split(".")[0], 10);
                            const itemName = compItemsDictionary[itemId]?.component_name || "Unknown Item";
                            if (item === 19) {
                                return (
                                    <div key={index}>
                                        <button 
                                            className={`menu-button ${isEnlarged ? 'enlarged' : ''}`} 
                                            onClick={() => handleOpen(itemId)} // Pass the item's ID
                                            disabled={disableEntrees}
                                        >
                                            <img 
                                                src={imageObj.src} 
                                                alt={`Drinks  ${index + 1}`} 
                                                className={`menu-image ${isEnlarged ? 'enlarged' : ''}`} 
                                            />
                                            {itemName}
                                        </button>
                                        <Modal
                                            open={openItem === itemId} // Check if this item's modal should be open
                                            onClose={handleClose}
                                            aria-labelledby="modal-modal-title"
                                            aria-describedby="modal-modal-description"
                                        >
                                            <Box sx={style}>
                                                <Typography id="modal-modal-title" variant="h4" component="h2" sx={{ textAlign: 'center' }}>
                                                    Select A Size:
                                                </Typography>
                                                <Button variant='contained' onClick={() => handleSize("S", itemId)}>S</Button>
                                                <Button variant='contained' onClick={() => handleSize("M", itemId)}>M</Button>
                                                <Button variant='contained' onClick={() => handleSize("L", itemId)}>L</Button>
                                            </Box>
                                        </Modal>
                                    </div>
                                );
                            }
                            return (
                                <button key={index} className={`menu-button ${isEnlarged ? 'enlarged' : ''}`} onClick={() => handleOrder(imageObj.name)} disabled={disableEntrees}>
                                    <img src={imageObj.src} alt={`Drink Item ${index + 1}`} className={`menu-image ${isEnlarged ? 'enlarged' : ''}`} />
                                    {itemName}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
            
            {/* APPETIZERS */}
            { (item === 13) && ( 
                <div className="item-type"> 
                    <div className="labels">   
                        <h2>Select Your Appetizer:</h2>
                    </div>
                    <div className="menu-display">
                        {appetizerImages.map((imageObj, index) => {
                            const itemId = parseInt(imageObj.name.split(".")[0], 10);
                            const itemName = compItemsDictionary[itemId]?.component_name || "Unknown Item";

                            return (
                                <div key={index}>
                                    <button 
                                        className={`menu-button ${isEnlarged ? 'enlarged' : ''}`} 
                                        onClick={() => handleOpen(itemId)} // Pass the item's ID
                                        disabled={disableEntrees}
                                    >
                                        <img 
                                            src={imageObj.src} 
                                            alt={`Appetizer Item ${index + 1}`} 
                                            className={`menu-image ${isEnlarged ? 'enlarged' : ''}`} 
                                        />
                                        {itemName}
                                    </button>
                                    <Modal
                                        open={openItem === itemId} // Check if this item's modal should be open
                                        onClose={handleClose}
                                        aria-labelledby="modal-modal-title"
                                        aria-describedby="modal-modal-description"
                                    >
                                        <Box sx={style}>
                                            <Typography id="modal-modal-title" variant="h4" component="h2" sx={{ textAlign: 'center' }}>
                                                Select A Size:
                                            </Typography>
                                            <Button variant='contained' onClick={() => handleSize("S", itemId)}>S</Button>
                                            <Button variant='contained' onClick={() => handleSize("L", itemId)}>L</Button>
                                        </Box>
                                    </Modal>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

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
                                <button key={index} className={`menu-button ${isEnlarged ? 'enlarged' : ''}`} onClick={() => handleOrder(imageObj.name)} disabled={disableEntrees}>
                                    <img src={imageObj.src} alt={`Panda Cub Meal ${index + 1}`} className={`menu-image ${isEnlarged ? 'enlarged' : ''}`} />
                                    {itemName}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* A LA CARTE */}
            { (item === 15) && ( 
                <div className="item-type"> 
                    <div className="labels">   
                        <h2>Select Your Item:</h2>
                    </div>
                    <div className="menu-display">
                        {aLaCarteimages.map((imageObj, index) => {
                            const itemId = parseInt(imageObj.name.split(".")[0], 10);
                            const itemName = compItemsDictionary[itemId]?.component_name || "Unknown Item";
                
                            return (
                                <div key={index}>
                                    <button 
                                        className={`menu-button ${isEnlarged ? 'enlarged' : ''}`} 
                                        onClick={() => handleOpen(itemId)} // Pass the item's ID
                                        disabled={disableEntrees}
                                    >
                                        <img 
                                            src={imageObj.src} 
                                            alt={`A La Carte Item  ${index + 1}`} 
                                            className={`menu-image ${isEnlarged ? 'enlarged' : ''}`} 
                                        />
                                        {itemName}
                                    </button>
                                    <Modal
                                        open={openItem === itemId} // Check if this item's modal should be open
                                        onClose={handleClose}
                                        aria-labelledby="modal-modal-title"
                                        aria-describedby="modal-modal-description"
                                    >
                                        <Box sx={style}>
                                            <Typography id="modal-modal-title" variant="h4" component="h2" sx={{ textAlign: 'center' }}>
                                                Select A Size:
                                            </Typography>
                                            <Button variant='contained' onClick={() => handleSize("S", itemId)}>S</Button>
                                            <Button variant='contained' onClick={() => handleSize("M", itemId)}>M</Button>
                                            <Button variant='contained' onClick={() => handleSize("L", itemId)}>L</Button>
                                        </Box>
                                    </Modal>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

        </div>
    );
}

export default SelectItem;
