import React from "react";
import "./Manager.css";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const ItemsTable = ({data, rowSelect}) => {
    return(
        <div className="total">
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell> Item </TableCell>
                            <TableCell> Price </TableCell>
                            <TableCell> Availability </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((item) => (
                            <TableRow key={item.item_name} style={{
                                backgroundColor: item.availability ? 'white' : 'lightcoral'
                            }} onClick={() => rowSelect(item)}>
                                <TableCell>{item.item_name}</TableCell>
                                <TableCell>{item.price}</TableCell>
                                <TableCell>{item.availability ? "Yes" : "No"}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default ItemsTable;