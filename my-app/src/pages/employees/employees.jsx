import ManagerBanner from '../manager/managerBanner';
import { ThemeProvider } from '@mui/material/styles';
import theme from "../../createTheme";
import { Select, MenuItem, FormControl, InputLabel, Typography, Box, TextField, Modal, Button } from '@mui/material';
import { useState, useEffect } from 'react';
import axios from 'axios';
import profileImage from '../../images/profile.png';
import "./employees.css";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '35vw',
    bgcolor: 'background.paper',
    border: '1px solid',
    borderRadius: '25px',
    boxShadow: 24,
    p: 4,
};

function Employees(props) {
    const view = props.view;
    const setAuthentication = props.setAuthentication;

    // Update employee form
    const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
    const [selectedRole, setSelectedRole] = useState("");
    const [selectedShift, setSelectedShift] = useState("");
    const [selectedUser, setSelectedUser] = useState("");
    const [selectedPass, setSelectedPass] = useState("");

    // All employee Data
    const [data, setData] = useState([]);

    // Add Emlpoyee Modal
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [newName, setNewName] = useState("");
    const [newRole, setNewRole] = useState("");
    const [newShift, setNewShift] = useState("");
    const [newUser, setNewUser] = useState("");
    const [newPass, setNewPass] = useState("");

    // Fetch all employee data on component load
    const fetchData = async () => {
        try {
            const baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';
            const response = await axios.get(`${baseURL}/api/employees`);
            setData(response.data);
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);

    // Find the selected employee details
    const selectedEmployee = data.find(emp => emp.employeeid === selectedEmployeeId);

    // Update selected employee
    const handleEmployeeChange = (event) => {
        const employeeId = parseInt(event.target.value, 10); // Convert to integer
        setSelectedEmployeeId(employeeId);
        const employee = data.find(emp => emp.employeeid === employeeId);
        console.log(employee)
        setSelectedRole(employee?.role || "");
        setSelectedShift(employee?.shift_schedule || "");
        setSelectedUser(employee?.username || "");
        setSelectedPass(employee?.password || "");
    };

    // Update role change
    const handleRoleChange = (event) => {
        setSelectedRole(event.target.value);
    };

    // Update shift change
    const handleShiftChange = (event) => {
        setSelectedShift(event.target.value);
    };

    // Update username change
    const handleUserChange = (event) => {
        setSelectedUser(event.target.value);
    };

    // Update password change
    const handlePassChange = (event) => {
        setSelectedPass(event.target.value);
    };

    // Update new name change
    const handleNewNameChange = (event) => {
        setNewName(event.target.value);
    };

    // Update new role change
    const handleNewRoleChange = (event) => {
        setNewRole(event.target.value);
    };

    // Update new shift change
    const handleNewShiftChange = (event) => {
        setNewShift(event.target.value);
    };

    // Update new username change
    const handleNewUserChange = (event) => {
        setNewUser(event.target.value);
    };

    // Update new password change
    const handleNewPassChange = (event) => {
        setNewPass(event.target.value);
    };

    // Function to update the selected employee's data
    const handleSave = async () => {
        try {
            const baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';
            await axios.put(`${baseURL}/api/employees/${selectedEmployeeId}`, {
                name: selectedEmployee.name,
                role: selectedRole,
                shift_schedule: selectedShift,
                username: selectedUser,
                password: selectedPass,
            });
            alert("Employee updated successfully");
            fetchData(); // Refresh data to see updated employee
        } catch (error) {
            console.error("Error updating employee:", error);
        }
    };

    // Function to delete the selected employee
    const handleTerminate = async () => {
        try {
            const baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';
            await axios.delete(`${baseURL}/api/employees/${selectedEmployeeId}`);
            alert("Employee terminated successfully");
            setSelectedEmployeeId(""); // Clear selection
            fetchData(); // Refresh data to remove deleted employee
        } catch (error) {
            console.error("Error deleting employee:", error);
        }
    };

    // Function to cancel employee addition
    const handleCancel = () => {
        setNewName("");
        setNewRole("");
        setNewShift("");
        setNewUser("");
        setNewPass("");
        handleClose();
    };

    // Function to add a new employee with a new employeeID
    const handleAddEmployee = async () => {
        // Find the maximum employeeID and add 1 for the new employeeID
        const newEmployeeId = data.length > 0 ? Math.max(...data.map(emp => emp.employeeid)) + 1 : 1;

        try {
            const baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';
            await axios.post(`${baseURL}/api/employees`, {
                employeeid: newEmployeeId, // New employeeID based on max + 1
                role: newRole,     // TODO: Replace with actual new employee state variables
                shift_schedule: newShift,
                username: newUser,
                password: newPass,
                name: newName
            });
            alert("New employee added successfully");
            handleCancel();
            fetchData(); // Refresh data to include the new employee
        } catch (error) {
            console.error("Error adding employee:", error);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <div>
                <ManagerBanner view={view} setAuthentication={setAuthentication} />

                {/* Dropdown to select an employee */}
                <div className="employee-select">
                    <div className="employee-dropdown">
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
                        </FormControl></div>
                    <Button variant="outlined" onClick={handleOpen}>+&nbsp;Add&nbsp;Employee</Button>
                    <Modal
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={style}>
                            <Typography id="modal-modal-title" variant="h4" component="h2" sx={{ textAlign: 'center' }}>
                                Add a New Employee
                            </Typography>
                            <div className="add-employee">
                                {/* Name textbox */}
                                <FormControl sx={{ mb: 2 }} fullWidth>
                                    <TextField
                                        id="outlined-basic"
                                        label="Name"
                                        onChange={handleNewNameChange}
                                        value={newName}
                                        helperText="Please enter the employee's name"
                                    />
                                </FormControl>
                                {/* Role dropdown */}
                                <FormControl sx={{ mb: 2 }} fullWidth>
                                    <TextField
                                        id="filled-select-role"
                                        select
                                        label="Role"
                                        onChange={handleNewRoleChange}
                                        value={newRole}
                                        helperText="Please select the desired role"
                                    >
                                        <MenuItem key="Manager" value="Manager">Manager</MenuItem>
                                        <MenuItem key="Cashier" value="Cashier">Cashier</MenuItem>
                                        <MenuItem key="Chef" value="Chef">Chef</MenuItem>
                                    </TextField>
                                </FormControl>
                                {/* Shift dropdown */}
                                <FormControl sx={{ mb: 2 }} fullWidth>
                                    <TextField
                                        id="filled-select-shift"
                                        select
                                        label="Shift"
                                        onChange={handleNewShiftChange}
                                        value={newShift}
                                        helperText="Please select the desired shift"
                                    >
                                        <MenuItem key="Weekend" value="Weekend">Weekend</MenuItem>
                                        <MenuItem key="Weekdays" value="Weekdays">Weekdays</MenuItem>
                                    </TextField>
                                </FormControl>
                                {/* Username textbox */}
                                <FormControl sx={{ mb: 2 }} fullWidth>
                                    <TextField
                                        id="outlined-basic"
                                        label="Username"
                                        onChange={handleNewUserChange}
                                        value={newUser}
                                        helperText="Please enter the desired username"
                                    />
                                </FormControl>
                                {/* Password textbox */}
                                <FormControl sx={{ mb: 2 }} fullWidth>
                                    <TextField id="outlined-basic"
                                        label="Password"
                                        onChange={handleNewPassChange}
                                        value={newPass}
                                        helperText="Please enter the desired password"
                                    />
                                </FormControl>
                                {/* Buttons */}
                                <Box
                                    sx={{
                                        width: '100%',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        mt: 2
                                    }}
                                >
                                    <Button variant="outlined" onClick={handleAddEmployee}>Submit</Button>
                                    <Button variant="contained" onClick={handleCancel}>Cancel</Button>
                                </Box>
                            </div>
                        </Box>
                    </Modal>
                </div>

                {/* Display selected employee details */}
                {selectedEmployee && (
                    <>
                        <div className="employee-container">
                            <div className="employee-data">
                                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                                    <img src={profileImage} alt="Employee Profile" style={{ width: '250px', height: '250px', borderRadius: '50%' }} />
                                </div>
                                <Box className="employee-details" mt={4} p={2} bgcolor="background.paper" borderRadius={4}>
                                    <Typography variant="h4">{selectedEmployee.name}</Typography>
                                    <Typography variant="h6">Role: {selectedEmployee.role}</Typography>
                                    <Typography variant="h6">Shift Schedule: {selectedEmployee.shift_schedule}</Typography>
                                    <Typography variant="h6">Username: {selectedEmployee.username}</Typography>
                                </Box>
                            </div>
                            <div className="modify-employee">
                                {/* Role dropdown */}
                                <FormControl sx={{ mb: 2 }} fullWidth>
                                    <TextField
                                        id="filled-select-role"
                                        select
                                        label="Role"
                                        onChange={handleRoleChange}
                                        value={selectedRole}
                                        helperText="Please select the desired role"
                                    >
                                        <MenuItem key="Manager" value="Manager">Manager</MenuItem>
                                        <MenuItem key="Cashier" value="Cashier">Cashier</MenuItem>
                                        <MenuItem key="Chef" value="Chef">Chef</MenuItem>
                                    </TextField>
                                </FormControl>
                                {/* Shift dropdown */}
                                <FormControl sx={{ mb: 2 }} fullWidth>
                                    <TextField
                                        id="filled-select-shift"
                                        select
                                        label="Shift"
                                        onChange={handleShiftChange}
                                        value={selectedShift}
                                        helperText="Please select the desired shift"
                                    >
                                        <MenuItem key="Weekend" value="Weekend">Weekend</MenuItem>
                                        <MenuItem key="Weekdays" value="Weekdays">Weekdays</MenuItem>
                                    </TextField>
                                </FormControl>
                                {/* Username textbox */}
                                <FormControl sx={{ mb: 2 }} fullWidth>
                                    <TextField
                                        id="outlined-basic"
                                        label="Username"
                                        onChange={handleUserChange}
                                        value={selectedUser}
                                        helperText="Please enter the desired username"
                                    />

                                </FormControl>
                                {/* Password textbox */}
                                <FormControl sx={{ mb: 2 }} fullWidth>
                                    <TextField id="outlined-basic"
                                        label="Password"
                                        onChange={handlePassChange}
                                        value={selectedPass}
                                        helperText="Please enter the desired password"
                                    />
                                </FormControl>
                                {/* Buttons */}
                                <Box
                                    sx={{
                                        width: '100%',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        mt: 2
                                    }}
                                >
                                    <Button variant="outlined" onClick={handleSave}>Save</Button>
                                    <Button variant="contained" onClick={handleTerminate}>Terminate</Button>
                                </Box>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </ThemeProvider>
    );
}

export default Employees;