import React, { useEffect, useState } from "react";
import API_BASE_URL from "../API";
import "./Customers.css";

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  // Fetch customers
  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/customers`);
      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      console.error("Error fetching customers:", error);
      alert("Failed to load customers. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Handle form change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add customer
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      alert("Customer name is required.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/customers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) throw new Error("Failed to add customer");

      setForm({ name: "", email: "", phone: "" });
      fetchCustomers();

      alert("✅ Customer added successfully!");
    } catch (error) {
      console.error("Error adding customer:", error);
      alert("❌ Failed to add customer. Please try again.");
    }
  };

  // Delete customer
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this customer? This cannot be undone.")) return;

    try {
      await fetch(`${API_BASE_URL}/customers/${id}`, { method: "DELETE" });
      fetchCustomers();
    } catch (error) {
      console.error("Error deleting customer:", error);
      alert("Failed to delete customer. Please try again.");
    }
  };

  return (
    <div className="customers-container">
      <h2 className="page-title">Customer Management</h2>

      {/* Add Customer Form */}
      <div className="form-card">
        <h3 className="form-title">Add New Customer</h3>
        <form onSubmit={handleSubmit} className="customer-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name-input">Name *</label>
              <input
                id="name-input"
                type="text"
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="email-input">Email</label>
              <input
                id="email-input"
                type="email"
                name="email"
                placeholder="customer1@gmail.com"
                value={form.email}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="phone-input">Phone</label>
            <input
              id="phone-input"
              type="text"
              name="phone"
              placeholder="+266 5759 6697"
              value={form.phone}
              onChange={handleChange}
              className="form-input"
            />
          </div>
          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? "Adding..." : "Add Customer"}
          </button>
        </form>
      </div>

      {/* Customer List */}
      <div className="table-card">
        <div className="table-header">
          <h3 className="table-title">Customer List</h3>
          {isLoading && <div className="spinner"></div>}
        </div>

        {customers.length === 0 ? (
          <div className="empty-state">
            <p>👥 No customers yet — add your first loyal customer above!</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="customers-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c, index) => (
                  <tr key={c.id} className="fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                    <td className="name-cell">{c.name}</td>
                    <td className="email-cell">{c.email || "— Not provided —"}</td>
                    <td className="phone-cell">{c.phone || "— Not provided —"}</td>
                    <td className="action-cell">
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="btn-delete"
                        aria-label={`Delete customer ${c.name}`}
                      >
                        Delete
                      </button>
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

export default Customers;