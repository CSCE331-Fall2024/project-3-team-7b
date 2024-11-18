import React, { useEffect, useState } from "react";
// npm install react-chartjs-2 chart.js --save
import {Bar} from "react-chartjs-2";
import axios from "axios";
import {
    Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function TodaysSalesBarGraph(){
    const [sales, setSales] = useState([]);
    console.log("here 1");
    const getSales = async () =>{
        try{
            console.log("Here 2");
            const response = await axios.get("http://localhost:5001/api/todaySales");
            const nums = response.data.map(hour => Number(hour.sum) || 0);
            setSales(nums);
            console.log("here 4");
        } catch (error){
            console.error("Unable to get today's sales", error);
            return null;
        }
    };

    useEffect(() => {
        getSales();
    }, []);
    
    console.log(sales);
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
    if(sales.length == 0){
        return <p>Loading sales</p>
    }
    return <Bar data={data}/>
}
export default TodaysSalesBarGraph;