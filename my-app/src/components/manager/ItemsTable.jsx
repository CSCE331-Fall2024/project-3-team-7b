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

const ItemsTable = ({data, rowSelect}) => {
    const { isEnlarged } = useEnlarge();

    return(
        <div className="total">
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={isEnlarged ? { fontSize: '1rem'} : {}}> Item </TableCell>
                            <TableCell sx={isEnlarged ? { fontSize: '1rem'} : {}}> Price </TableCell>
                            <TableCell sx={isEnlarged ? { fontSize: '1rem'} : {}}> Availability </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((item) => (
                            <TableRow key={item.item_name} style={{
                                backgroundColor: item.availability ? 'white' : 'lightcoral'
                            }} onClick={() => rowSelect(item)}>
                                <TableCell sx={isEnlarged ? { fontSize: '1rem'} : {}}>{item.item_name}</TableCell>
                                <TableCell sx={isEnlarged ? { fontSize: '1rem'} : {}}>{item.price}</TableCell>
                                <TableCell sx={isEnlarged ? { fontSize: '1rem'} : {}}>{item.availability ? "Yes" : "No"}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default ItemsTable;