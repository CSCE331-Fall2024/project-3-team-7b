import React from "react";
import "./Manager.css";

const ComponentsTable = ({data, rowSelect}) => {
    return(
        <table className="total">
            <thead>
                <th className="component"> Component</th>
                <th className="category">Quantity</th>
                <th className="availability">Availability</th>
                <th className="premium">Premium</th>
                <th className="seasonal">Seasonal</th>
            </thead>
            <tbody>
                {data.map((item) => (
                    <tr key={item.item_name} style={{
                        backgroundColor: item.availability ? 'white' : 'lightcoral'
                    }} onClick={() => rowSelect(item)}>
                        <td>{item.component_name}</td>
                        <td>{item.category}</td>
                        <td>{item.availability ? "Yes" : "No"}</td>
                        <td>{item.premium ? "Yes" : "No"}</td>
                        <td>{item.seasonal ? "Yes" : "No"}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default ComponentsTable;