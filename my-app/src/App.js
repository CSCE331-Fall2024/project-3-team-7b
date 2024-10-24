import { BrowserRouter, Routes, Route } from "react-router-dom"
import './App.css';
import Home from "./pages/Home";
import Login from './pages/Login';
import CustomerHome from "./pages/customer/CustomerHome";
import MenuItem from "./pages/order/MenuItem"
import ItemSelection from "./pages/order/ItemSelection";
import FinishOrder from "./pages/order/FinishOrder";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="" element={<Home />} />
          <Route path="/login" element={<Login />}/>
          <Route path="/customer" element={<CustomerHome />}/>
          <Route path="/customer/order" element={<MenuItem />}/>
          <Route path="/customer/order/select" element={<ItemSelection />}/>
          <Route path="/customer/order/finish" element={<FinishOrder />}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
