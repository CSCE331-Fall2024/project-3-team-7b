// your-react-project/src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./manager.css"

function ManagerHome() {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:5001/api/employees');
            setData(response.data);
        } catch (error) {
            console.error(error);
        }
        };

        fetchData();
    }, []);
  
    return (
        <div>
            <h1>Data from PostgreSQL:</h1>
            <ul>
                {data.map((item) => (
                <li key={item.employeeid}>{item.name}</li>
                ))}
            </ul>
        </div>
    );
}

export default ManagerHome;
