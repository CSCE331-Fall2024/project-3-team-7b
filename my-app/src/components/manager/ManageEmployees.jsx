import { Button } from "@mui/material";
import "./Manager.css"
import { Typography, Box } from '@mui/material';
import { useState, useEffect } from "react";
import axios from 'axios';
//TODO: IN PROGRESS
// Purpose: Displays the highest and lowest performing items

function ManageEmployees(props) {
    const selectedEmployee = props.data;
    const [highestData, setHighestData] = useState([]);
    const [lowestData, setLowestData] = useState([]);
    const [components, setComponents] = useState([]);

    // retreives all necessary data (highest/lowest performing items & component names)
    const fetchData = async () => {
        const baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';
        try {
            const [highestResponse, lowestResponse, componentResponse] = await Promise.all([
                axios.get(`${baseURL}/api/fetch-highest`),
                axios.get(`${baseURL}/api/fetch-lowest`),
                axios.get(`${baseURL}/api/components`)
            ]);
            setHighestData(highestResponse.data);
            setLowestData(lowestResponse.data);
            setComponents(componentResponse.data);
        } catch (error) {
            console.error("Error fetching item performance data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // allows easy lookup of component names by ID
    const componentNameMap = components.reduce((map, component) => {
        map[component.componentid] = component.component_name;
        return map;
    }, {});

    return (
        <div className="item-performance">
            {/* Fetch highest performing items from database */}
            <div className="highest-perf">
                <Box className="employee-details" mt={4} p={2} bgcolor="background.paper" borderRadius={4}>
                    <Typography variant="h6">{selectedEmployee.name}</Typography>
                    <Typography>Role: {selectedEmployee.role}</Typography>
                    <Typography>Shift Schedule: {selectedEmployee.shift_schedule}</Typography>
                    <Typography>Username: {selectedEmployee.username}</Typography>
                </Box>
            </div>


            <div className="lowest-perf">
                <h3 className="item-label">LOWEST PERFORMING ITEMS</h3>

                {/* displays lowest performing items in a table */}
                <table className="item-table">
                    <thead>
                        <tr>
                            <th>Component Name</th>
                            <th>Component ID</th>
                            <th>Count</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lowestData.map((item, index) => (
                            <tr key={index}>
                                <td>{componentNameMap[item.componentid] || "N/A"}</td>
                                <td>{item.componentid}</td>
                                <td>{item.count}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <Button variant="contained" onClick={fetchData}> Refresh Items </Button>
            </div>
        </div>
    )
}

export default ManageEmployees;