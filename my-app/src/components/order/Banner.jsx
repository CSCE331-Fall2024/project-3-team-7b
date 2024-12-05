import banner from "../../images/banner.PNG"
import Button from '@mui/material/Button';
import { useNavigate } from "react-router-dom";
import React from 'react';
import "./orderComponents.css"
import { useEnlarge } from "../../EnlargeContext";
import Weather from "../customer/Weather";

// Purpose: banner to be displayed at the top of all ordering pages

function Banner(props) {
    const navigate = useNavigate();

    const { isEnlarged, setIsEnlarged } = useEnlarge();

    const view = props.view;
    const setAuthentication = props.setAuthentication;


    // handles logout function for cashiers & managers
    const logout = () => {
        navigate("/");
        setAuthentication(false);
    }

    const toggleTextSize = () => {
        setIsEnlarged((prev) => !prev);
    };

    return (
        <div className={`banner ${isEnlarged ? 'large-text' : ''}`}>
            <div className="accesible-buttons">
                <Button variant="contained" onClick={toggleTextSize}>
                    {isEnlarged ? 'NORMAL TEXT' : 'ENLARGE TEXT'}
                </Button>
            </div>

            {/* Overall banner content */}
            <img className="banner-image" src={banner} alt="Panda Express Banner w/ Logo" ></img>

            {/* only displays logout button for cashiers and managers */}
            {(view === "cashier" || view === "manager") && (
                <div className="logout-button">
                    <Button sx={isEnlarged ? { fontSize: '1rem' } : {}} variant="contained" onClick={logout}>Logout</Button>
                </div>
            )}

            {/* only displays weater for customers */}
            {(view === "customer") && (
                <div className="weather-card">
                    <Weather isBanner={true} />
                </div>
            )}

        </div>
    );
}

export default Banner;
