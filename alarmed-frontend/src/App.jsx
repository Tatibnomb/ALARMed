import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Medications from "./pages/Medications";
import AddMedication from "./pages/AddMedication";
import History from "./pages/History";

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/medications" element={<Medications />} />
          <Route path="/add-medication" element={<AddMedication />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;