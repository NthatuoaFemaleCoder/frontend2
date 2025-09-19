import React, { useEffect, useState } from "react";
import API_BASE_URL from "../API";
import "./Sales.css";

function Sales() {
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [sales, setSales] = useState([]);
  const [form, setForm] = useState({
    productId: "",
    customerId: "",
    quantity: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  // Fetch products, customers & sales
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [prodRes, custRes, salesRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/products`),
        fetch(`${API_BASE_URL}/api/customers`),
        fetch(`${API_BASE_URL}/api/sales`),
      ]);

      const [prodData, custData, salesData] = await Promise.all([
        prodRes.json(),
        custRes.json(),
        salesRes.json(),
      ]);

      setProducts(prodData);
      setCustomers(custData);
      setSales(salesData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle form change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Record sale
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.productId || !form.quantity || parseInt(form.quantity) <= 0) {
      console.error("Invalid product or quantity");
      return;
    }

    const selectedProduct = products.find((p) => p.id === form.productId);
    if (!selectedProduct) {
      console.error("Invalid product selected");
      return;
    }

    if (parseInt(form.quantity) > selectedProduct.quantity) {
      console.error(`Not enough stock! Only ${selectedProduct.quantity} units available.`);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/sales`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) throw new Error("Failed to record sale");

      setForm({ productId: "", customerId: "", quantity: "" });
      fetchData(); // Refresh data
    } catch (error) {
      console.error("Error recording sale:", error);
    }
  };

  // Helper to get product name
  const getProductName = (productId) => {
    return products.find((p) => p.id === productId)?.name || "Unknown Product";
  };

  // Helper to get customer name
  const getCustomerName = (customerId) => {
    if (!customerId) return "Walk-in Customer";
    return customers.find((c) => c.id === customerId)?.name || "Unknown Customer";
  };

  return (
    <div className="sales-container">
      <h2 className="page-title">Sales Management</h2>

      {/* Record Sale Form */}
      <div className="form-card">
        <h3 className="form-title">Record New Sale</h3>
        <form onSubmit={handleSubmit} className="sale-form">
          <div className="form-group">
            <label htmlFor="product-select">Product *</label>
            <select
              id="product-select"
              name="productId"
              value={form.productId}
              onChange={handleChange}
              required
              className="form-select"
            >
              <option value="">Select Product</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (Stock: {p.quantity})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="quantity-input">Quantity *</label>
            <input
              id="quantity-input"
              type="number"
              name="quantity"
              placeholder="Enter quantity"
              value={form.quantity}
              onChange={handleChange}
              min="1"
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="customer-select">Customer (Optional)</label>
            <select
              id="customer-select"
              name="customerId"
              value={form.customerId}
              onChange={handleChange}
              className="form-select"
            >
              <option value="">Walk-in Customer</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? "Recording..." : "Record Sale"}
          </button>
        </form>
      </div>

      {/* Sales Records Table */}
      <div className="table-card">
        <div className="table-header">
          <h3 className="table-title">Sales Records</h3>
          {isLoading && <div className="spinner"></div>}
        </div>

        {sales.length === 0 ? (
          <div className="empty-state">
            <p>📭 No sales recorded yet — make your first sale above!</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="sales-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Customer</th>
                  <th>Quantity</th>
                  <th>Date & Time</th>
                </tr>
              </thead>
              <tbody>
                {sales.map((s, index) => (
                  <tr
                    key={index}
                    className="fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <td className="product-cell">{getProductName(s.productId)}</td>
                    <td className="customer-cell">{getCustomerName(s.customerId)}</td>
                    <td className="quantity-cell">
                      <span className="quantity-badge">{s.quantity}</span>
                    </td>
                    <td className="date-cell">
                      {new Date(s.date).toLocaleString("en-ZA", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Sales;
