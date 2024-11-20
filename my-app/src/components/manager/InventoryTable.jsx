import React from "react";
import "./Manager.css";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const InventoryTable = ({data, rowSelect}) => {
    return(
        <div className="total">
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell> Item </TableCell>
                            <TableCell> Quantity </TableCell>
                            <TableCell> Unit </TableCell>
                            <TableCell> Supplier </TableCell>
                            <TableCell> Threshold </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((item) => (
                            <TableRow key={item.item_name} style={{
                                backgroundColor: item.needs_restock ? 'lightcoral' : 'white'
                            }} onClick={() => rowSelect(item)}>
                                <TableCell>{item.item_name}</TableCell>
                                <TableCell>{parseFloat(item.quantity).toFixed(2)}</TableCell>
                                <TableCell>{item.unit}</TableCell>
                                <TableCell>{item.supplier}</TableCell>
                                <TableCell>{item.threshold}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default InventoryTable;