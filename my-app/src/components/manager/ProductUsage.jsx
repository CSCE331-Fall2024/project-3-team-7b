import { Button } from "@mui/material";
import "./Manager.css"
import { useState, useEffect } from "react";
import axios from 'axios';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

// Purpose: Displays the highest and lowest performing items

function ProductUsage() {
    const [selectedStart, setSelectedStart] = useState(null);
    const [selectedEnd, setSelectedEnd] = useState(null);

    // const [productUsageData, setProductUsageData] = useState([]);

    // // retreives all necessary data (highest/lowest performing items & component names)
    // const fetchData = async () => {
    //     const baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';
    //     try {
    //         const [usageResponse] = await Promise.all([
    //             axios.get(`${baseURL}/api/product-usage`),
    //         ]);
    //         setProductUsageData(usageResponse.data);
    //     } catch (error) {
    //         console.error("Error fetching item performance data:", error);
    //     }
    // };

    // useEffect(() => {
    //     fetchData();
    // }, []);

    const handleStartChange = (startDate) => {
        setSelectedStart(startDate);
        console.log("Selected date:", startDate);
    }

    const handleEndChange = (endDate) => {
        setSelectedEnd(endDate);
        console.log("Selected date:", endDate);
    }

    const generateReport = async () => {
        if (selectedStart === null || selectedEnd === null) {
            alert("Please fill out both dates.");
        }
        else if (selectedStart > selectedEnd) {
            alert("Start date cannot be later than end date.");
        }
        else {
            const baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';
        
            try {
                // Format the dates to a suitable format for the API (e.g., "YYYY-MM-DD")
                const formattedStart = selectedStart.format("YYYY-MM-DD");
                const formattedEnd = selectedEnd.format("YYYY-MM-DD");

                // Make an API call with axios, including the start and end dates as query parameters
                const response = await axios.get(`${baseURL}/api/product-usage`, {
                    params: {
                        startDate: formattedStart,
                        endDate: formattedEnd
                    }
                });

                // Handle the response data as needed (for example, setting it to state)
                console.log("Report Data:", response.data);
                // setProductUsageData(response.data);
            } catch (error) {
                console.error("Error generating report:", error);
            }
        }
    }

    return (
        <div className="product-usage">
            <div className="date-select">
                <h3>Select a Start Date: </h3>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker 
                        value={selectedStart}
                        onChange={handleStartChange}
                        slotProps={{
                            textField: {
                              helperText: 'Start Date',
                            },
                          }}
                    />
                </LocalizationProvider>
            </div>

            <div className="date-select">
                <h3>Select an End Date: </h3>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker 
                        value={selectedEnd}
                        onChange={handleEndChange}
                        slotProps={{
                            textField: {
                              helperText: 'End Date',
                            },
                          }}
                    />
                </LocalizationProvider>
            </div>

            <div>
                <Button variant="contained" onClick={generateReport}>Generate Report</Button>
            </div>
            
        </div>
    )
}

export default ProductUsage;