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
import Inventory from "./pages/inventory/inventory";
import Trends from "./pages/trends/trends";
import Items from "./pages/items/items";
import Employees from "./pages/employees/employees";
import { useState } from "react";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState("");
  // Function to set user as authenticated after login
  const handleLogin = (role) => {
    setIsAuthenticated(true);
    setUserRole(role);
  };

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="" element={<Home />} />
          <Route 
            path="/login/manager" 
            element={<Login onLogin={handleLogin} userType="Manager" />} 
          />
          <Route 
            path="/login/cashier" 
            element={<Login onLogin={handleLogin} userType="Cashier" />} 
          />
          <Route path="/customer" element={<CustomerHome />}/>
          <Route path="/customer/order" element={<MenuSelection view="customer" />}/>
          <Route path="/customer/order/select" element={<ItemSelection view="customer"/>}/>
          <Route path="/customer/order/finish" element={<FinishOrder view="customer"/>}/>
          <Route path="/customer/order/confirmation" element={<OrderConfirmation view="customer"/>}/>
            
          {/* Protected Cashier Route */}
          <Route 
            path="/cashier" 
            element={isAuthenticated && userRole === "Cashier" ? <CashierHome /> : <Navigate to="/login/cashier" replace />}
          />
          <Route path="/cashier/order/" element={<MenuSelection view="cashier" setAuthentication={setIsAuthenticated}/>}/>
          <Route path="/cashier/order/select" element={<ItemSelection view="cashier" setAuthentication={setIsAuthenticated}/>}/>
          <Route path="/cashier/order/finish" element={<FinishOrder view="cashier" setAuthentication={setIsAuthenticated}/>}/>
          <Route path="/cashier/order/confirmation" element={<OrderConfirmation view="cashier" setAuthentication={setIsAuthenticated}/>}/>
     
          <Route 
            path="/manager" 
            element={isAuthenticated && userRole === "Manager" ? <ManagerHome /> : <Navigate to="/login/manager" replace />}
          />
          <Route path="/manager/inventory" element={<Inventory view="manager" setAuthentication={setIsAuthenticated}/>}/>
          <Route path="/manager/trends" element={<Trends view="manager" setAuthentication={setIsAuthenticated}/>}/>
          <Route path="/manager/items" element={<Items view="manager" setAuthentication={setIsAuthenticated}/>}/>
          <Route path="/manager/employees" element={<Employees view="manager" setAuthentication={setIsAuthenticated}/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;