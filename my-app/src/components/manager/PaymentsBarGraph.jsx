import React, { useEffect, useState } from "react";
import {Bar} from "react-chartjs-2";
import axios from "axios";
import {
    Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function PaymentsBarGraph(){
    // variables to store and set the number of transactions using card
    const [cardSales, setCard] = useState([]);
    // variables to store and set the number of transactions using digital wallet
    const [digitalWallet, setDigitalWallet] = useState([]);

    console.log("here 1");
    const c = "card";

    //call to api to get number of transactions using card
    const getCardSales = async () =>{
        try{
            console.log("Here 2");
            const response = await axios.get(`http://localhost:5001/api/todayPayments/${c}`);
            const cards = response.data.map(cardNum => Number(cardNum) || 0);
            setCard(cards);
            console.log(cards);
        } catch (error){
            console.error("Unable to get today's card payments", error);
            return null;
        }
    };

    const dw = "digital wallet";

    //call to api to retrieve number of transactions using digital wallet
    const getDigitalSales = async () =>{
        try{
            const response = await axios.get(`http://localhost:5001/api/todayPayments/${dw}`);
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
    
    console.log(cardSales);
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

    //set loading status if still retrieving payment data
    if(cardSales.length === 0 || digitalWallet.length === 0){
        return <p>Loading sales</p>
    }
    return <Bar data={data}/>
}
export default PaymentsBarGraph;