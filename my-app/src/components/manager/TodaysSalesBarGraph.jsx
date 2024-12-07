import React, { useEffect, useState } from "react";
// npm install react-chartjs-2 chart.js --save
import {Bar} from "react-chartjs-2";
import axios from "axios";
import {
    Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function TodaysSalesBarGraph(){
    // variables to set and store the numbers of sales
    const [sales, setSales] = useState([]);

    //function to get the total sales per hour
    const getSales = async () =>{
        try{
            // UNCOMMENT THIS IF WE ACTUALLY WANT TO USE THE CURRENT DATE
            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const day = String(today.getDate()).padStart(2, '0');
            const date = `${year}-${month}-${day}`;

            const baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';
            // makes the API call with the correct parameters
            const response = await axios.get(`${baseURL}/api/todaySales`, {
                params: { date: date },
            });

            // places 0 if nothing is returned
            const nums = response.data.map(hour => Number(hour.sum) || 0);
            setSales(nums);
        } catch (error){
            console.error("Unable to get today's sales", error);
            return null;
        }
    };

    useEffect(() => {
        getSales();
    }, []);
    
    const labels = ["10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM"];
    const data = {
        labels: labels,
        datasets: [
            {
                label: "Total Sales",
                data: sales,
                backgroundColor: "rgba(75, 192, 192, 0.7)",
                borderColor: "rgb(75, 192, 192)",
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            title:{
                display: true,
                text: "Total Sales per Hour",
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
                    text: "Total Sales",
                    font: {
                        size: 16,
                    },
                },
            },
        },
    };

    // waits for the sales to be retrieved before displaying the data
    if(sales.length == 0){
        return <p>Loading sales</p>
    }
    return <Bar data={data} options={options}/>
}
export default TodaysSalesBarGraph;