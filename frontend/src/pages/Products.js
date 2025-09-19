import React, { useEffect, useState } from "react";
import API_BASE_URL from "../API";
import "./Products.css";

function Products() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    quantity: ""
  });
  const [editingId, setEditingId] = useState(null);
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

  // Handle input change
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // Add or Update product
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingId
        ? `${API_BASE_URL}/api/products/${editingId}`
        : `${API_BASE_URL}/api/products`;

      const method = editingId ? "PUT" : "POST";

      await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      setForm({ name: "", description: "", category: "", price: "", quantity: "" });
      setEditingId(null);
      fetchProducts();
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  // Delete product
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await fetch(`${API_BASE_URL}/api/products/${id}`, { method: "DELETE" });
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  // Start editing
  const handleEdit = (product) => {
    setForm(product);
    setEditingId(product.id);
  };

  return (
    <div className="products-container">
      <h2 className="page-title">Product Management</h2>

      {/* Product Form */}
      <div className="form-card">
        <h3 className="form-title">{editingId ? "Edit Product" : "Add New Product"}</h3>
        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-row">
            <input
              type="text"
              name="name"
              placeholder="Product Name"
              value={form.name}
              onChange={handleChange}
              required
              className="form-input"
            />
            <input
              type="text"
              name="category"
              placeholder="Category"
              value={form.category}
              onChange={handleChange}
              className="form-input"
            />
          </div>
          <div className="form-row">
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={form.price}
              onChange={handleChange}
              required
              className="form-input"
            />
            <input
              type="number"
              name="quantity"
              placeholder="Initial Quantity"
              value={form.quantity}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>
          <textarea
            name="description"
            placeholder="Description (optional)"
            value={form.description}
            onChange={handleChange}
            rows="3"
            className="form-input full-width"
          ></textarea>
          <button type="submit" className="submit-btn">
            {editingId ? "Update Product" : "Add Product"}
          </button>
        </form>
      </div>

      {/* Product List */}
      <div className="table-card">
        <div className="table-header">
          <h3 className="table-title">Products List</h3>
          {isLoading && <div className="spinner"></div>}
        </div>

        {products.length === 0 ? (
          <div className="empty-state">
            <p>No products available — add one above!</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="products-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p, index) => (
                  <tr key={p.id} className="fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                    <td>{p.name}</td>
                    <td>{p.description || "—"}</td>
                    <td>{p.category || "—"}</td>
                    <td className="price-cell">R{parseFloat(p.price).toFixed(2)}</td>
                    <td>
                      <span className={`quantity-badge ${
                        p.quantity > 10 ? "in-stock" :
                        p.quantity > 0 ? "low-stock" :
                        "out-of-stock"
                      }`}>
                        {p.quantity}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          onClick={() => handleEdit(p)}
                          className="btn-edit"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="btn-delete"
                        >
                          Delete
                        </button>
                      </div>
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

export default Products;
