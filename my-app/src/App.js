import { BrowserRouter, Routes, Route } from "react-router-dom"
import './App.css';
import Login from './Login';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
