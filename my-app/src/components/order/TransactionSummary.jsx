import { MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./orderComponents.css"
import { useEnlarge } from "../../EnlargeContext";
import axios from 'axios';

// Purpose: Displays how much in sales were made during the current day for the cashier

function TransactionSummary(props){
    const navigate = useNavigate();

    const { isEnlarged, setIsEnlarged } = useEnlarge();
    const [sales, setSales] = useState(0);

    //function to get the total sales per hour
    const getTopItem = async () =>{
        try{
            // UNCOMMENT THIS IF WE ACTUALLY WANT TO USE THE CURRENT DATE
            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const day = String(today.getDate()).padStart(2, '0');
            const date = `${year}-${month}-${day}`;

            // const date = '2023-10-30'

            const baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';
            // makes the API call with the correct parameters
            const response = await axios.get(`${baseURL}/api/transactionSummary`, {
                params: { todayDate: date },
            });
            console.log(response.data);
            
            setSales(response.data);
            // console.log(sales);

              
        } catch (error){
            console.error("Unable to get today's sales total", error);
            return null;
        }
    };

    useEffect(() => {
        getTopItem();
    }, []);

    return (
        <div>
            <p>${sales}</p>
        </div>
    );
}

export default TransactionSummary;
