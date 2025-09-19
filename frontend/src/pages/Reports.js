import React, { useEffect, useState } from "react";
import API_BASE_URL from "../API";
import "./Reports.css";

function Reports() {
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch products & sales
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [prodRes, salesRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/products`),
        fetch(`${API_BASE_URL}/api/sales`),
      ]);

      const [prodData, salesData] = await Promise.all([
        prodRes.json(),
        salesRes.json(),
      ]);

      setProducts(prodData);
      setSales(salesData);
    } catch (error) {
      console.error("Error fetching reports data:", error);
      alert("Failed to load reports. Please refresh.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Compute total sales
  const totalSales = sales.length;
  const totalQuantitySold = sales.reduce(
    (sum, s) => sum + parseInt(s.quantity || 0),
    0
  );

  // Low stock products (less than 5)
  const lowStock = products.filter((p) => parseInt(p.quantity || 0) < 5);

  // Helper: Format number with commas
  const formatNumber = (num) => {
    return new Intl.NumberFormat().format(num);
  };

  return (
    <div className="reports-container">
      <h2 className="page-title">Reports & Analytics</h2>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="loading-overlay">
          <div className="spinner-large"></div>
          <p>Loading reports...</p>
        </div>
      )}

      {/* Sales Summary Card */}
      <div className="summary-card fade-in">
        <h3 className="card-title">📊 Sales Summary</h3>
        <div className="summary-grid">
          <div className="summary-item">
            <div className="summary-label">Total Sales Transactions</div>
            <div className="summary-value">{formatNumber(totalSales)}</div>
          </div>
          <div className="summary-item">
            <div className="summary-label">Total Quantity Sold</div>
            <div className="summary-value">{formatNumber(totalQuantitySold)}</div>
          </div>
        </div>
      </div>

      {/* Inventory Overview Card */}
      <div className="table-card fade-in" style={{ animationDelay: "0.2s" }}>
        <div className="table-header">
          <h3 className="table-title">📦 Inventory Overview</h3>
          {isLoading && <div className="spinner"></div>}
        </div>

        {products.length === 0 ? (
          <div className="empty-state">
            <p>No products available to display inventory.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="inventory-table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th>Stock Quantity</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p, index) => (
                  <tr
                    key={p.id}
                    className="fade-in-row"
                    style={{ animationDelay: `${(index + 1) * 0.1}s` }}
                  >
                    <td>{p.name}</td>
                    <td>{p.category || "—"}</td>
                    <td className="quantity-cell">{p.quantity}</td>
                    <td>
                      <span
                        className={`status-badge ${
                          p.quantity >= 10
                            ? "in-stock"
                            : p.quantity > 0
                            ? "low-stock"
                            : "out-of-stock"
                        }`}
                      >
                        {p.quantity >= 10
                          ? "In Stock"
                          : p.quantity > 0
                          ? "Low Stock"
                          : "Out of Stock"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Low Stock Alerts Card */}
      <div className="alert-card fade-in" style={{ animationDelay: "0.4s" }}>
        <h3 className="card-title">⚠️ Low Stock Alerts</h3>
        {lowStock.length > 0 ? (
          <ul className="alert-list">
            {lowStock.map((p, index) => (
              <li
                key={p.id}
                className="alert-item fade-in"
                style={{ animationDelay: `${(index + 1) * 0.1}s` }}
              >
                <strong>{p.name}</strong> — only{" "}
                <span className="alert-quantity">{p.quantity}</span> left!
              </li>
            ))}
          </ul>
        ) : (
          <div className="success-state">
            <p>✅ All products are sufficiently stocked. Great job!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Reports;
