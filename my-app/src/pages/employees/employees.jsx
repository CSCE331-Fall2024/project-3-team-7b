import ManagerBanner from '../manager/managerBanner';
import { ThemeProvider } from '@mui/material/styles';
import theme from "../../createTheme";
import { Select, MenuItem, FormControl, InputLabel, Typography, Box } from '@mui/material';
import { useState, useEffect } from 'react';
import axios from 'axios';
import "./employees.css";
import ManageEmployees from '../../components/manager/ManageEmployees';

function Employees(props) {
    const view = props.view;
    const setAuthentication = props.setAuthentication;
    const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
    const [data, setData] = useState([]);

    // Fetch all employee data on component load
    useEffect(() => {
        const fetchData = async () => {
            try {
                const baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';
                const response = await axios.get(`${baseURL}/api/employees`);
                setData(response.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, []);

    // Update selected employee
    const handleEmployeeChange = (event) => {
        setSelectedEmployeeId(event.target.value);
    };

    // Find the selected employee details
    const selectedEmployee = data.find(emp => emp.employeeid === selectedEmployeeId);

    return (
        <ThemeProvider theme={theme}>
            <div>
                <ManagerBanner view={view} setAuthentication={setAuthentication} />

                {/* Dropdown to select an employee */}
                <div className="employee-select">
                    <FormControl fullWidth>
                        <InputLabel>Select An Employee</InputLabel>
                        <Select
                            label="Select An Employee"
                            onChange={handleEmployeeChange}
                            value={selectedEmployeeId}
                        >
                            {data.map((employee) => (
                                <MenuItem key={employee.employeeid} value={employee.employeeid}>
                                    {employee.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>

                {/* Display selected employee details */}
                {selectedEmployee && (
                    <div className="employee-container">
                        <ManageEmployees data={selectedEmployee}/>
                    </div>
                )}
            </div>
       </ThemeProvider>
    );
}

export default Employees;