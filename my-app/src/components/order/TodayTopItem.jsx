import { MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./orderComponents.css"
import { useEnlarge } from "../../EnlargeContext";
import axios from 'axios';

// Purpose: banner to be displayed at the top of all ordering pages
function TodayTopItem(props){
    const navigate = useNavigate();

    const { isEnlarged, setIsEnlarged } = useEnlarge();
    const [topItem, setTopItem] = useState("");

    //function to get the total sales per hour
    const getTopItem = async () =>{
        try{
            // UNCOMMENT THIS IF WE ACTUALLY WANT TO USE THE CURRENT DATE
            // const today = new Date();
            // const year = today.getFullYear();
            // const month = String(today.getMonth() + 1).padStart(2, '0');
            // const day = String(today.getDate()).padStart(2, '0');
            // const date = `${year}-${month}-${day}`;

            const date = '2023-10-30'

            const baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';
            // makes the API call with the correct parameters
            const response = await axios.get(`${baseURL}/api/todayTopItem`, {
                params: { todayDate: date },
            });
            
            setTopItem(response.data);
            console.log(topItem);

              
        } catch (error){
            console.error("Unable to get today's top item", error);
            return null;
        }
    };

    useEffect(() => {
        getTopItem();
    }, []);

    return (
        <div>
            {topItem}
        </div>
    );
}

export default TodayTopItem;
