import React, { useEffect, useState } from "react";
import API_BASE_URL from "../API";
import "./Dashboard.css";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from "recharts";

function Dashboard() {
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [prodRes, salesRes, custRes] = await Promise.all([
        fetch(`${API_BASE_URL}/products`),
        fetch(`${API_BASE_URL}/sales`),
        fetch(`${API_BASE_URL}/customers`)
      ]);

      const [prodData, salesData, custData] = await Promise.all([
        prodRes.json(),
        salesRes.json(),
        custRes.json()
      ]);

      setProducts(prodData);
      setSales(salesData);
      setCustomers(custData);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      alert("Failed to load dashboard data. Please refresh.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Prepare chart data
  const salesByProduct = products.map((p) => {
    const totalSold = sales
      .filter((s) => s.productId === p.id)
      .reduce((sum, s) => sum + parseInt(s.quantity || 0), 0);
    return { name: p.name, sold: totalSold };
  });

  const stockDistribution = products.map((p) => ({
    name: p.name,
    value: parseInt(p.quantity) || 0,
  }));

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f7f", "#a4de6c"];

  return (
    <div className="dashboard-container">
      <h2 className="page-title">Dashboard</h2>

      {isLoading && (
        <div className="loading-section">
          <div className="spinner-large"></div>
          <p>Loading your dashboard...</p>
        </div>
      )}

      {!isLoading && (
        <>
          {/* Quick Stats Cards */}
          <div className="stats-grid fade-in">
            <div className="stat-card 1">
              <div className="stat-icon" style={{ backgroundColor: "orange" }}>
                📦
              </div>
              <h3 className="stat-title ">Total Products</h3>
              <p className="stat-value" style={{ color: "#8884d8" }}>{products.length}</p>
            </div>
            <div className="stat-card 2">
              <div className="stat-icon" style={{ backgroundColor: "#82ca9d" }}>
                👥
              </div>
              <h3 className="stat-title ">Total Customers</h3>
              <p className="stat-value" style={{ color: "" }}>{customers.length}</p>
            </div>
            <div className="stat-card  ">
              <div className="stat-icon" style={{ backgroundColor: "red" }}>
                💰
              </div>
              <h3 className="stat-title">Total Sales</h3>
              <p className="stat-value" style={{ color: "#ffc658" }}>{sales.length}</p>
            </div>
          </div>

          {/* Sales by Product Chart */}
          <div className="chart-card fade-in" style={{ animationDelay: "0.3s" }}>
            <h3 className="chart-title">Sales by Product</h3>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={salesByProduct} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <XAxis dataKey="name" tick={{ fill: '#666' }} />
                  <YAxis tick={{ fill: '#666' }} />
                  <Tooltip 
                    wrapperStyle={{ 
                      backgroundColor: "red", 
                      border: '1px solid #ddd', 
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }} 
                  />
                  <Legend />
                  <Bar dataKey="sold" fill="#8884d8" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Stock Distribution Chart */}
          <div className="chart-card fade-in" style={{ animationDelay: "0.5s" }}>
            <h3 className="chart-title">Stock Distribution</h3>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={stockDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    labelLine={true}
                  >
                    {stockDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    wrapperStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #ddd', 
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Footer */}
          <div className="footer">
            Wings Cafe by Nthatuoa
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;