import { Button } from "@mui/material";
import "./Manager.css"
import { useState, useEffect } from "react";
import axios from 'axios';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from "@mui/material/TableSortLabel";
import Paper from '@mui/material/Paper';
import { useEnlarge } from "../../EnlargeContext";

// Purpose: Displays the amount of each item sold in a time period

function SalesReport() {
    const [selectedStart, setSelectedStart] = useState(null);
    const [selectedEnd, setSelectedEnd] = useState(null);
    const [productUsageData, setProductUsageData] = useState([]);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('itemid');

    const { isEnlarged } = useEnlarge();

    // changes the start date
    const handleStartChange = (startDate) => {
        setSelectedStart(startDate);
    }

    // changes the end date
    const handleEndChange = (endDate) => {
        setSelectedEnd(endDate);
    }

    // retreives the sales report in the timeframe by calling API
    const generateSalesReport = async () => {
        if (selectedStart === null || selectedEnd === null) {
            alert("Please fill out both dates.");
        }
        else if (selectedStart > selectedEnd) {
            alert("Start date cannot be later than end date.");
        }
        else {
            const baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';
        
            try {
                // formats the dates to a suitable format for the API (e.g., "YYYY-MM-DD")
                const formattedStart = selectedStart.format("YYYY-MM-DD");
                const formattedEnd = selectedEnd.format("YYYY-MM-DD");


                // makes the API call with the correct parameters
                const response = await axios.get(`${baseURL}/api/sales-report`, {
                    params: {
                        startDate: formattedStart,
                        endDate: formattedEnd
                    }
                });

                // sets the state of the data
                setProductUsageData(response.data);
            } catch (error) {
                console.error("Error generating report:", error);
            }
        }
    }

    // sorts the table based on column
    const handleSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
        const sortedData = [...productUsageData].sort((a, b) => {
            if (a[property] < b[property]) return order === 'asc' ? -1 : 1;
            if (a[property] > b[property]) return order === 'asc' ? 1 : -1;
            return 0;
        });
        setProductUsageData(sortedData);
    };

    return (
        <div className="product-usage">
            <div className="data-select-container">
                {/* Allows user to select start date with date picker */}
                <div className="date-select">
                    <h3 className={`${isEnlarged ? 'label-enlarged' : 'item-label'}`}>Select a Start Date: </h3>
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

                {/* Allows user to select end date with date picker */}
                <div className="date-select">
                    <h3 className={`${isEnlarged ? 'label-enlarged' : 'item-label'}`}>Select an End Date: </h3>
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

                {/* Button to generate the table */}
                <div>
                    <Button variant="contained" onClick={generateSalesReport}>Generate Sales Report</Button>
                </div>
            </div>

            {/* table to display the product usage */}
            <div className="usage-chart">
                {productUsageData.length > 0 && (
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow component="th">
                                <TableCell sx={isEnlarged ? { fontSize: '1rem'} : {}}>
                                <TableSortLabel
                                            active={orderBy === 'component_name'}
                                            direction={orderBy === 'component_name' ? order : 'asc'}
                                            onClick={() => handleSort('component_name')}
                                            hideSortIcon={false}
                                        >
                                            Component Name
                                        </TableSortLabel>
                                </TableCell>
                                <TableCell align="right" sx={isEnlarged ? { fontSize: '1rem'} : {}}>
                                    <TableSortLabel
                                        active={orderBy === 'order_count'}
                                        direction={orderBy === 'order_count' ? order : 'asc'}
                                        onClick={() => handleSort('order_count')}
                                        hideSortIcon={false}
                                    >
                                        Order Count
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell align="right" sx={isEnlarged ? { fontSize: '1rem'} : {}}>
                                    <TableSortLabel
                                        active={orderBy === 'total_sales'}
                                        direction={orderBy === 'total_used' ? order : 'asc'}
                                        onClick={() => handleSort('total_sales')}
                                        hideSortIcon={false}
                                    >
                                        Total Sales
                                    </TableSortLabel>
                                </TableCell>
                                
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {productUsageData.map((item, index) => (
                            <TableRow
                                key={index}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell scope="row" sx={isEnlarged ? { fontSize: '1rem'} : {}}> {item.component_name} </TableCell>
                                <TableCell align="right" sx={isEnlarged ? { fontSize: '1rem'} : {}}>{item.order_count}</TableCell>
                                <TableCell align="right" sx={isEnlarged ? { fontSize: '1rem'} : {}}>{item.total_sales}</TableCell>
                            </TableRow>
                            ))}
                        </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </div>
            
        </div>
    )
}

export default SalesReport;