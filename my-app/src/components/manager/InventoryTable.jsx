import React from "react";
import styles from "./InventoryTable.module.css";

const InventoryTable = ({data, rowColor}) => {
    return(
        <table>
            <thead>
                <tr>
                    {Object.keys(data[0]||{}).map((key) => (
                        <th key={key}>
                            {key}
                        </th>
                    ))}
                </tr>
            </thead> 
            <tbody>
                {data.map((row, index) => (
                    <tr key={index}
                        className={rowColor[row.item_name] ? styles.highlight : ''}>
                        {Object.values(row).map((value, i) => (
                            <td key={i}>
                                {value}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default InventoryTable;