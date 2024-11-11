import React from "react";
import styles from "./InventoryTable.module.css";

const InventoryTable = ({data, rowSelect}) => {
    return(
        <table className={styles.total}>
            <thead>
                <th className={styles.item}> Item</th>
                <th className={styles.quantity}>Quantity</th>
                <th className={styles.unit}>Unit</th>
                <th className={styles.supplier}>Supplier</th>
                <th className={styles.threshold}>Threshold</th>
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