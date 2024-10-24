import { BrowserRouter, Routes, Route } from "react-router-dom"
import './App.css';
import Home from "./pages/Home";
import Login from './pages/Login';
import CustomerHome from "./pages/customer/CustomerHome";
import MenuItem from "./pages/order/MenuItem"

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="" element={<Home />} />
          <Route path="/login" element={<Login />}/>
          <Route path="/customer" element={<CustomerHome />}/>
          <Route path="/customer/order" element={<MenuItem />}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
