import React from "react";
import "./Manager.css";

const ItemsTable = ({data, rowSelect}) => {
    return(
        <table className="total">
            <thead>
                <th className="menuitem"> Item</th>
                <th className="price">Price</th>
                <th className="availability">Availability</th>
            </thead>
            <tbody>
                {data.map((item) => (
                    <tr key={item.item_name} style={{
                        backgroundColor: item.availability ? 'white' : 'lightcoral'
                    }} onClick={() => rowSelect(item)}>
                        <td>{item.item_name}</td>
                        <td>{item.price}</td>
                        <td>{item.availability ? "Yes" : "No"}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default ItemsTable;