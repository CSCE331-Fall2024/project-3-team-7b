import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import './App.css';
import Home from "./pages/Home";
import Login from './pages/Login';
import CustomerHome from "./pages/customer/CustomerHome";
import MenuSelection from "./pages/order/MenuSelection"
import ItemSelection from "./pages/order/ItemSelection";
import FinishOrder from "./pages/order/FinishOrder";
import OrderConfirmation from "./pages/order/OrderConfirmation";
import ManagerHome from "./pages/manager/ManagerHome";
import CashierHome from "./pages/cashier/CashierHome";
import Inventory from "./pages/inventory/Inventory";
import Trends from "./pages/trends/Trends";
import Items from "./pages/items/Items";
import Employees from "./pages/employees/Employees";
import MenuBoard from "./pages/menuboard/MenuBoard";
import Components from "./pages/components/Components";
import { useState} from "react";
import MealOptions from "./pages/order/MealOptions";
import { EnlargeProvider} from './EnlargeContext';


// Purpose: directs the webpage to a specific route and renders the proper page

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [employeeID, setEmployeeID] = useState(-1);

  // Function to set user as authenticated after login
  const handleLogin = (role, employeeID) => {
    setIsAuthenticated(true);
    setUserRole(role);
    setEmployeeID(employeeID);
  };

  return (
    <div>
      <EnlargeProvider>
        <BrowserRouter>
          <Routes>
            <Route path="" element={<Home />} />

            {/* 2 different login pages for manager & cashier */}
            <Route 
              path="/login/manager" 
              element={ <Login onLogin={handleLogin} userType="Manager" /> } 
            />
            <Route 
              path="/login/cashier" 
              element={ <Login onLogin={handleLogin} userType="Cashier" /> } 
            />

            {/* Pages related to the customer view */}
            <Route path="/customer" element={<CustomerHome />}/>
            <Route path="/customer/order" element={<MenuSelection view="customer" employeeID={employeeID}/>}/>
            <Route path="/customer/order/select" element={<ItemSelection view="customer" employeeID={employeeID}/>}/>
            <Route path="/customer/order/choose-meal" element={<MealOptions view="customer" employeeID={employeeID}/>}/>
            <Route path="/customer/order/finish" element={<FinishOrder view="customer" employeeID={employeeID}/>}/>
            <Route path="/customer/order/confirmation" element={<OrderConfirmation view="customer" employeeID={employeeID}/>}/>
              
            {/* Pages related to the cashier view */}
            <Route 
              path="/cashier" 
              element={isAuthenticated && userRole === "Cashier" ? <CashierHome /> : <Navigate to="/login/cashier" replace />}
            />
            <Route path="/cashier/order/" element={<MenuSelection view="cashier" setAuthentication={setIsAuthenticated} employeeID={employeeID}/>}/>
            <Route path="/cashier/order/select" element={<ItemSelection view="cashier" setAuthentication={setIsAuthenticated} employeeID={employeeID}/>}/>
            <Route path="/cashier/order/choose-meal" element={<MealOptions view="cashier" setAuthentication={setIsAuthenticated} employeeID={employeeID}/>}/>
            <Route path="/cashier/order/finish" element={<FinishOrder view="cashier" setAuthentication={setIsAuthenticated} employeeID={employeeID}/>}/>
            <Route path="/cashier/order/confirmation" element={<OrderConfirmation view="cashier" setAuthentication={setIsAuthenticated} employeeID={employeeID}/>}/>
      
            {/* Pages related to the manager view */}
            <Route 
              path="/manager" 
              element={isAuthenticated && userRole === "Manager" ? <ManagerHome /> : <Navigate to="/login/manager" replace />}
            />
            <Route path="/manager/inventory" element={<Inventory view="manager" setAuthentication={setIsAuthenticated}/>}/>
            <Route path="/manager/trends" element={<Trends view="manager" setAuthentication={setIsAuthenticated}/>}/>
            <Route path="/manager/items" element={<Items view="manager" setAuthentication={setIsAuthenticated}/>}/>
            <Route path="/manager/employees" element={<Employees view="manager" setAuthentication={setIsAuthenticated}/>}/>

            <Route path="/menu" element={<MenuBoard />}/>
            <Route path="/manager/components" element={<Components view="manager" setAuthentication={setIsAuthenticated}/>}/>
            

          </Routes>
        
        </BrowserRouter>
      </EnlargeProvider>
    </div>
  );
}

export default App;