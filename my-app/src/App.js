import { BrowserRouter, Routes, Route } from "react-router-dom"
import './App.css';
import Home from "./pages/Home";
import Login from './pages/Login';
import CustomerHome from "./pages/customer/CustomerHome";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="" element={<Home />} />
          <Route path="/login" element={<Login />}/>
          <Route path="/customer" element={<CustomerHome />}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
