import React from "react";
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";

// Import your components
import Dashboard from "./pages/Dashboard.js";
import Products from "./pages/Products.js";
import Inventory from "./pages/Inventory.js";
import Sales from "./pages/Sales.js";
import Customers from "./pages/Customers.js";
import Reports from "./pages/Reports.js";

import "./App.css";

function App() {
  return (
    <Router>
      <div className="app-container">
        <nav className="navbar">
          <ul>
            <li><NavLink to="/" end>Dashboard</NavLink></li>
            <li><NavLink to="/products">Products</NavLink></li>
            <li><NavLink to="/inventory">Inventory</NavLink></li>
            <li><NavLink to="/sales">Sales</NavLink></li>
            <li><NavLink to="/customers">Customers</NavLink></li>
            <li><NavLink to="/reports">Reports</NavLink></li>
          </ul>
        </nav>

        <div className="page-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/reports" element={<Reports />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;