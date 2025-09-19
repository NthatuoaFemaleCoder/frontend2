import React, { useEffect, useState } from "react";
import API_BASE_URL from "../API";
import "./Inventory.css";

function Inventory() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState("");
  const [action, setAction] = useState("add"); // "add" or "deduct"
  const [isLoading, setIsLoading] = useState(false);

  // Fetch products from backend
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/products`);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Update stock
  const handleUpdateStock = async (e) => {
    e.preventDefault();
    if (!selectedProduct || !quantity || parseInt(quantity) <= 0) {
      alert("Please select a product and enter a valid quantity.");
      return;
    }

    try {
      await fetch(`${API_BASE_URL}/api/inventory/${selectedProduct}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: parseInt(quantity), action }),
      });

      setQuantity("");
      setSelectedProduct("");
      fetchProducts();
    } catch (error) {
      console.error("Error updating inventory:", error);
      alert("Failed to update inventory. Please try again.");
    }
  };

  return (
    <div className="inventory-container">
      <h2 className="page-title">Inventory Management</h2>

      {/* Update Stock Form */}
      <div className="form-card">
        <h3 className="form-title">Update Stock</h3>
        <form onSubmit={handleUpdateStock} className="stock-form">
          <div className="form-group">
            <label htmlFor="product-select">Product</label>
            <select
              id="product-select"
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              required
              className="form-select"
            >
              <option value="">Select Product</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="quantity-input">Quantity</label>
            <input
              id="quantity-input"
              type="number"
              placeholder="Enter quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min="1"
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="action-select">Action</label>
            <select
              id="action-select"
              value={action}
              onChange={(e) => setAction(e.target.value)}
              required
              className="form-select"
            >
              <option value="add">Add Stock</option>
              <option value="deduct">Deduct Stock</option>
            </select>
          </div>

          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? "Updating..." : "Update Stock"}
          </button>
        </form>
      </div>

      {/* Current Inventory Table */}
      <div className="table-card">
        <div className="table-header">
          <h3 className="table-title">Current Stock Levels</h3>
          {isLoading && <div className="spinner"></div>}
        </div>

        {products.length === 0 ? (
          <div className="empty-state">
            <p>No products available. Add products first.</p>
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
                  <tr key={p.id} className="fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                    <td>{p.name}</td>
                    <td>{p.category || "—"}</td>
                    <td className="quantity-cell">{p.quantity}</td>
                    <td>
                      <span className={`status-badge ${
                        p.quantity > 10 ? "in-stock" :
                        p.quantity > 0 ? "low-stock" :
                        "out-of-stock"
                      }`}>
                        {p.quantity > 10 ? "In Stock" :
                         p.quantity > 0 ? "Low Stock" :
                         "Out of Stock"}
                      </span>
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

export default Inventory;
