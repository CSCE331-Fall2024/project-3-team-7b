import { Button } from "@mui/material";
import "./Manager.css"
import { useState, useEffect } from "react";
import axios from 'axios';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from "@mui/material/TableSortLabel";
import Paper from '@mui/material/Paper';
import { useEnlarge } from "../../EnlargeContext";

// Purpose: Displays the highest and lowest performing items

function ItemPerfomance() {
    const [highestData, setHighestData] = useState([]);
    const [lowestData, setLowestData] = useState([]);
    const [components, setComponents] = useState([]);

    const { isEnlarged } = useEnlarge();

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
                <h3 className={`${isEnlarged ? 'label-enlarged' : 'item-label'}`}>HIGHEST PERFORMING ITEMS</h3>
                
                {/* displays highest performing items in a table */}
                <div className="item-table">
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={isEnlarged ? { fontSize: '1rem'} : {}}> Component Name </TableCell>
                                    <TableCell sx={isEnlarged ? { fontSize: '1rem'} : {}}> Component ID </TableCell>
                                    <TableCell sx={isEnlarged ? { fontSize: '1rem'} : {}}> Component Count </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {highestData.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell sx={isEnlarged ? { fontSize: '1rem'} : {}}>{componentNameMap[item.componentid] || "N/A"}</TableCell>
                                        <TableCell sx={isEnlarged ? { fontSize: '1rem'} : {}}>{item.componentid}</TableCell>
                                        <TableCell sx={isEnlarged ? { fontSize: '1rem'} : {}}>{item.count}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
                <Button variant="contained" onClick={fetchData}> Refresh Items </Button>
            </div>


            <div className="lowest-perf">
                <h3 className={`${isEnlarged ? 'label-enlarged' : 'item-label'}`}>LOWEST PERFORMING ITEMS</h3>

                {/* displays lowest performing items in a table */}
                <div className="item-table">
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={isEnlarged ? { fontSize: '1rem'} : {}}> Component Name </TableCell>
                                    <TableCell sx={isEnlarged ? { fontSize: '1rem'} : {}}> Component ID </TableCell>
                                    <TableCell sx={isEnlarged ? { fontSize: '1rem'} : {}}> Component Count </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {lowestData.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell sx={isEnlarged ? { fontSize: '1rem'} : {}}>{componentNameMap[item.componentid] || "N/A"}</TableCell>
                                        <TableCell sx={isEnlarged ? { fontSize: '1rem'} : {}}>{item.componentid}</TableCell>
                                        <TableCell sx={isEnlarged ? { fontSize: '1rem'} : {}}>{item.count}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
                <Button variant="contained" onClick={fetchData}> Refresh Items </Button>
            </div>
        </div>
    )
}

export default ItemPerfomance;