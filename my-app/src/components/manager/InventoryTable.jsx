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

const InventoryTable = ({data, rowSelect}) => {
    const { isEnlarged } = useEnlarge();

    return(
        <div className="total">
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={isEnlarged ? { fontSize: '1rem'} : {}}> Item </TableCell>
                            <TableCell sx={isEnlarged ? { fontSize: '1rem'} : {}}> Quantity </TableCell>
                            <TableCell sx={isEnlarged ? { fontSize: '1rem'} : {}}> Unit </TableCell>
                            <TableCell sx={isEnlarged ? { fontSize: '1rem'} : {}}> Supplier </TableCell>
                            <TableCell sx={isEnlarged ? { fontSize: '1rem'} : {}}> Threshold </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((item) => (
                            <TableRow key={item.item_name} style={{
                                backgroundColor: item.needs_restock ? 'lightcoral' : 'white'
                            }} onClick={() => rowSelect(item)}>
                                <TableCell sx={isEnlarged ? { fontSize: '1rem'} : {}}>{item.item_name}</TableCell>
                                <TableCell sx={isEnlarged ? { fontSize: '1rem'} : {}}>{parseFloat(item.quantity).toFixed(2)}</TableCell>
                                <TableCell sx={isEnlarged ? { fontSize: '1rem'} : {}}>{item.unit}</TableCell>
                                <TableCell sx={isEnlarged ? { fontSize: '1rem'} : {}}>{item.supplier}</TableCell>
                                <TableCell sx={isEnlarged ? { fontSize: '1rem'} : {}}>{item.threshold}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default InventoryTable;