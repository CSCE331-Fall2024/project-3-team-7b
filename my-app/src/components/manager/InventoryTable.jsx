import React from "react";
import "./Manager.css";

const InventoryTable = ({data, rowSelect}) => {
    return(
        <table className="total">
            <thead>
                <th className="item"> Item</th>
                <th className="quantity">Quantity</th>
                <th className="unit">Unit</th>
                <th className="supplier">Supplier</th>
                <th className="threshold">Threshold</th>
            </thead>
            <tbody>
                {data.map((item) => (
                    <tr key={item.item_name} style={{
                        backgroundColor: item.needs_restock ? 'lightcoral' : 'white'
                    }} onClick={() => rowSelect(item)}>
                        {/* {console.log(item.item_name + ": " + item.needs_restock)} */}
                        <td>{item.item_name}</td>
                        <td>{parseFloat(item.quantity).toFixed(2)}</td>
                        <td>{item.unit}</td>
                        <td>{item.supplier}</td>
                        <td>{item.threshold}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default InventoryTable;