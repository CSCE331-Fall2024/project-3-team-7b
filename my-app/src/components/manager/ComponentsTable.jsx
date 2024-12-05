import React from "react";
import "./Manager.css";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useEnlarge } from "../../EnlargeContext";

const ComponentsTable = ({data, rowSelect}) => {
    const { isEnlarged } = useEnlarge();

    return(
        <div className="total">
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={isEnlarged ? { fontSize: '1rem'} : {}}> Name </TableCell>
                            <TableCell sx={isEnlarged ? { fontSize: '1rem'} : {}}> Category </TableCell>
                            <TableCell sx={isEnlarged ? { fontSize: '1rem'} : {}}> Availability </TableCell>
                            <TableCell sx={isEnlarged ? { fontSize: '1rem'} : {}}> Premium </TableCell>
                            <TableCell sx={isEnlarged ? { fontSize: '1rem'} : {}}> Seasonal </TableCell>
                            <TableCell sx={isEnlarged ? { fontSize: '1rem'} : {}}> Allergens </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((item) => (
                            <TableRow key={item.item_name} style={{
                                backgroundColor: item.availability ? 'white' : 'lightcoral'
                            }} onClick={() => rowSelect(item)}>
                                <TableCell sx={isEnlarged ? { fontSize: '1rem'} : {}}>{item.component_name}</TableCell>
                                <TableCell sx={isEnlarged ? { fontSize: '1rem'} : {}}>{item.category}</TableCell>
                                <TableCell sx={isEnlarged ? { fontSize: '1rem'} : {}}>{item.availability ? "Yes" : "No"}</TableCell>
                                <TableCell sx={isEnlarged ? { fontSize: '1rem'} : {}}>{item.premium ? "Yes" : "No"}</TableCell>
                                <TableCell sx={isEnlarged ? { fontSize: '1rem'} : {}}>{item.seasonal ? "Yes" : "No"}</TableCell>
                                <TableCell sx={isEnlarged ? { fontSize: '1rem'} : {}}>{item.allergens}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default ComponentsTable;