import React, { useEffect, useState } from "react";
import {Bar} from "react-chartjs-2";
import axios from "axios";
import {
    Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend,
} from "chart.js";

// Purpose: double bar graph for all of the payments of the current day

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function PaymentsBarGraph(){
    // variables to store and set the number of transactions using card
    const [cardSales, setCard] = useState([]);
    // variables to store and set the number of transactions using digital wallet
    const [digitalWallet, setDigitalWallet] = useState([]);

    const c = "card";

    //call to api to get number of transactions using card
    const getCardSales = async () =>{
        try{
            // UNCOMMENT THIS IF WE ACTUALLY WANT TO USE THE CURRENT DATE
            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const day = String(today.getDate()).padStart(2, '0');
            const todayDate = `${year}-${month}-${day}`;

            const baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';
            // makes the API call with the correct parameters
            const response = await axios.get(`${baseURL}/api/todayPayments/${c}`, {
                params: { date: todayDate },
            });

            const cards = response.data.map(cardNum => Number(cardNum) || 0);
            setCard(cards);
        } catch (error){
            console.error("Unable to get today's card payments", error);
            return null;
        }
    };

    const dw = "digital wallet";

    //call to api to retrieve number of transactions using digital wallet
    const getDigitalSales = async () =>{
        try{
            // UNCOMMENT THIS IF WE ACTUALLY WANT TO USE THE CURRENT DATE
            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const day = String(today.getDate()).padStart(2, '0');
            const todayDate = `${year}-${month}-${day}`;

            const baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';
            // makes the API call with the correct parameters
            const response = await axios.get(`${baseURL}/api/todayPayments/${dw}`, {
                params: { date: todayDate },
            });
            
            //place 0 if nothing is returned
            const digitals = response.data.map(dwCount => Number(dwCount) || 0);
            setDigitalWallet(digitals);
        } catch (error){
            console.error("Unable to get today's digital wallet payments", error);
            return null;
        }
    }

    useEffect(() => {
        getCardSales();
        getDigitalSales();
    }, []);
    
    //labels for hours
    const labels = ["10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM"];
    const data = {
        labels: labels,
        datasets: [
            {
                label: "Card",
                data: cardSales,
                backgroundColor: "rgba(75, 192, 192, 0.7)",
                borderColor: "rgb(75, 192, 192)",
                borderWidth: 1,
            },
            {
                label: "Digital Wallet",
                data: digitalWallet,
                backgroundColor: "rgba(192, 75, 192, 0.7)",
                borderColor: "rgb(192, 75, 192)",
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            title:{
                display: true,
                text: "Payment Methods per Hour",
                font: {
                    size: 20
                },
            },
            legend:{
                position: "top",
                align: "end",
            },
        },
        scales: {
            x : {
                title: {
                    display: true,
                    text: "Time of Day",
                    font: {
                        size: 16,
                    },
                },
            },
            y : {
                title: {
                    display: true,
                    text: "Number of Transactions",
                    font: {
                        size: 16,
                    },
                },
            },
        },
    };

    //set loading status if still retrieving payment data
    if(cardSales.length === 0 || digitalWallet.length === 0){
        return <p>Loading sales</p>
    }
    return <Bar data={data} options={options}/>
}
export default PaymentsBarGraph;