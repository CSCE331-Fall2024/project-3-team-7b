import { Button } from "@mui/material";
import "./Manager.css"
import { useState, useEffect } from "react";
import axios from 'axios';

// Purpose: Displays the highest and lowest performing items

function ItemPerfomance() {
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
                <h3 className="item-label">HIGHEST PERFORMING ITEMS</h3>
                
                {/* displays highest performing items in a table */}
                <table className="item-table">
                    <thead>
                        <tr>
                            <th>Component Name</th>
                            <th>Component ID</th>
                            <th>Count</th>
                        </tr>
                    </thead>
                    <tbody>
                        {highestData.map((item, index) => (
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

export default ItemPerfomance;