import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import './App.css';
import Home from "./pages/Home";
import Login from './pages/Login';
import CustomerHome from "./pages/customer/CustomerHome";
import MenuSelection from "./pages/order/MenuSelection"
import ItemSelection from "./pages/order/ItemSelection";
import FinishOrder from "./pages/order/FinishOrder";
import OrderConfirmation from "./pages/order/OrderConfirmation";
import CashierHome from "./pages/cashier/CashierHome";
import ManagerHome from "./pages/manager/ManagerHome";
import Inventory from "./pages/inventory/inventory";
import Trends from "./pages/trends/trends";
import Items from "./pages/items/items";
import Employees from "./pages/employees/employees";
import { useState } from "react";
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // Function to set user as authenticated after login
  const handleLogin = () => {
    setIsAuthenticated(true);
  };
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="" element={<Home />} />
          <Route 
            path="/login" 
            element={<Login onLogin={handleLogin} />} // Pass the handleLogin function here
          />
          <Route path="/customer" element={<CustomerHome />}/>
          <Route path="/customer/order" element={<MenuSelection />}/>
          <Route path="/customer/order/select" element={<ItemSelection />}/>
          <Route path="/customer/order/finish" element={<FinishOrder />}/>
          <Route path="/customer/order/confirmation" element={<OrderConfirmation />}/>
          {/* Protected Cashier Route */}
          <Route
            path="/cashier"
            element={isAuthenticated ? <CashierHome /> : <Navigate to="/login" replace />}
          />
          <Route path="/cashier/order/" element={<MenuSelection />}/>
          <Route path="/manager/" element={<ManagerHome />}/>
          <Route path="/manager/inventory" element={<Inventory />}/>
          <Route path="/manager/trends" element={<Trends />}/>
          <Route path="/manager/items" element={<Items />}/>
          <Route path="/manager/employees" element={<Employees />}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
