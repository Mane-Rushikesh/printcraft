import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  Package,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    category: "",
    name: "",
    description: "",
    price: "",
    image: "",
  });

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const token = localStorage.getItem("token");

  const API_URL = "http://localhost:5000/api/products";

  // ===============================
  // FETCH PRODUCTS
  // ===============================
  const fetchProducts = async () => {
    try {
      setLoading(true);

      const response = await fetch(API_URL);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch products"
        );
      }

      setProducts(data);
    } catch (error) {
      console.error("Products Error:", error);
      alert(error.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "admin") {
      fetchProducts();
    } else {
      setLoading(false);
    }
  }, []);

  // ===============================
  // FORM CHANGE
  // ===============================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  // ===============================
  // OPEN ADD FORM
  // ===============================
  const handleAddProduct = () => {
    setEditingId(null);

    setFormData({
      category: "",
      name: "",
      description: "",
      price: "",
      image: "",
    });

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ===============================
  // ADD / UPDATE PRODUCT
  // ===============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("Please login again.");
      return;
    }

    try {
      setSaving(true);

      const url = editingId
        ? `${API_URL}/${editingId}`
        : API_URL;

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          category: formData.category.trim(),
          name: formData.name.trim(),
          description: formData.description.trim(),
          price: Number(formData.price),
          image: formData.image.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Operation failed"
        );
      }

      alert(
        editingId
          ? "Product updated successfully!"
          : "Product added successfully!"
      );

      resetForm();

      await fetchProducts();
    } catch (error) {
      console.error("Product Save Error:", error);

      alert(
        error.message || "Failed to save product"
      );
    } finally {
      setSaving(false);
    }
  };

  // ===============================
  // EDIT PRODUCT
  // ===============================
  const handleEdit = (product) => {
    setEditingId(product.id);

    setFormData({
      category: product.category || "",
      name: product.name || "",
      description: product.description || "",
      price: product.price || "",
      image: product.image || "",
    });

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ===============================
  // DELETE PRODUCT
  // ===============================
  const handleDelete = async (productId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) {
      return;
    }

    if (!token) {
      alert("Please login again.");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete product"
        );
      }

      alert("Product deleted successfully!");

      setProducts((currentProducts) =>
        currentProducts.filter(
          (product) => product.id !== productId
        )
      );
    } catch (error) {
      console.error(
        "Delete Product Error:",
        error
      );

      alert(
        error.message ||
          "Failed to delete product"
      );
    }
  };

  // ===============================
  // RESET FORM
  // ===============================
  const resetForm = () => {
    setFormData({
      category: "",
      name: "",
      description: "",
      price: "",
      image: "",
    });

    setEditingId(null);
    setShowForm(false);
  };

  // ===============================
  // ACCESS DENIED
  // ===============================
  if (!user || user.role !== "admin") {
    return (
      <div className="cart-page empty-cart">
        <h1>Access Denied</h1>

        <p>
          You are not authorized to access
          this page.
        </p>

        <Link
          to="/"
          className="primary-button"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  // ===============================
  // LOADING
  // ===============================
  if (loading) {
    return (
      <div className="cart-page empty-cart">
        <Package size={60} />

        <h1>Loading Products...</h1>

        <p>
          Please wait while products are loading.
        </p>
      </div>
    );
  }

  // ===============================
  // MAIN UI
  // ===============================
  return (
    <div className="cart-page">

      {/* BACK BUTTON */}
      <Link
        to="/admin"
        className="back-link"
      >
        <ArrowLeft size={18} />
        Back to Admin Dashboard
      </Link>

      {/* HEADER */}
      <div className="cart-header">
        <div>
          <span>PRINTCRAFT ADMIN</span>

          <h1>Manage Products</h1>
        </div>

        <button
          className="checkout-button"
          onClick={
            showForm
              ? resetForm
              : handleAddProduct
          }
        >
          {showForm ? (
            <>
              <X size={18} />
              Close Form
            </>
          ) : (
            <>
              <Plus size={18} />
              Add Product
            </>
          )}
        </button>
      </div>

      {/* ===============================
          PRODUCT FORM
      =============================== */}

      {showForm && (
        <div className="cart-summary admin-product-form">

          <div className="form-header">
            <div>
              <span>PRODUCT MANAGEMENT</span>

              <h2>
                {editingId
                  ? "Edit Product"
                  : "Add New Product"}
              </h2>
            </div>

            <button
              type="button"
              className="remove-button"
              onClick={resetForm}
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>

            {/* CATEGORY */}
            <div className="form-group">
              <label htmlFor="category">
                Category
              </label>

              <input
                id="category"
                type="text"
                name="category"
                placeholder="Example: Mug"
                value={formData.category}
                onChange={handleChange}
                required
              />
            </div>

            {/* PRODUCT NAME */}
            <div className="form-group">
              <label htmlFor="name">
                Product Name
              </label>

              <input
                id="name"
                type="text"
                name="name"
                placeholder="Enter product name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* DESCRIPTION */}
            <div className="form-group">
              <label htmlFor="description">
                Description
              </label>

              <textarea
                id="description"
                name="description"
                placeholder="Enter product description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
              />
            </div>

            {/* PRICE */}
            <div className="form-group">
              <label htmlFor="price">
                Price
              </label>

              <input
                id="price"
                type="number"
                name="price"
                placeholder="Enter price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                required
              />
            </div>

            {/* IMAGE */}
            <div className="form-group">
              <label htmlFor="image">
                Image URL
              </label>

              <input
                id="image"
                type="text"
                name="image"
                placeholder="Paste image URL"
                value={formData.image}
                onChange={handleChange}
              />
            </div>

            {/* BUTTONS */}
            <div className="form-actions">

              <button
                type="submit"
                className="checkout-button"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editingId
                  ? "Update Product"
                  : "Add Product"}
              </button>

              <button
                type="button"
                className="clear-cart"
                onClick={resetForm}
                disabled={saving}
              >
                Cancel
              </button>

            </div>

          </form>
        </div>
      )}

      {/* ===============================
          PRODUCTS LIST
      =============================== */}

      <div className="admin-products-section">

        <div className="section-heading">
          <div>
            <span>PRODUCT CATALOG</span>

            <h2>
              All Products
            </h2>
          </div>

          <p>
            {products.length}{" "}
            {products.length === 1
              ? "product"
              : "products"}{" "}
            available
          </p>
        </div>

        {products.length === 0 ? (
          <div className="empty-cart">

            <Package size={60} />

            <h2>
              No Products Found
            </h2>

            <p>
              Add your first PrintCraft product.
            </p>

            <button
              className="primary-button"
              onClick={handleAddProduct}
            >
              <Plus size={17} />
              Add Product
            </button>

          </div>
        ) : (
          <div className="cart-items">

            {products.map((product) => (
              <div
                className="cart-item admin-product-item"
                key={product.id}
              >

                {/* PRODUCT IMAGE */}
                <img
                  src={product.image}
                  alt={product.name}
                  onError={(e) => {
                    e.currentTarget.style.display =
                      "none";
                  }}
                />

                {/* PRODUCT INFO */}
                <div className="cart-item-info">

                  <span>
                    {product.category}
                  </span>

                  <h3>
                    {product.name}
                  </h3>

                  <p>
                    {product.description ||
                      "No description available."}
                  </p>

                  <strong>
                    ₹
                    {Number(
                      product.price
                    ).toFixed(2)}
                  </strong>

                </div>

                {/* ACTIONS */}
                <div className="cart-item-right admin-product-actions">

                  <button
                    className="checkout-button"
                    onClick={() =>
                      handleEdit(product)
                    }
                  >
                    <Pencil size={17} />
                    Edit
                  </button>

                  <button
                    className="remove-button"
                    onClick={() =>
                      handleDelete(product.id)
                    }
                    title="Delete Product"
                  >
                    <Trash2 size={18} />
                  </button>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>

    </div>
  );
}

export default AdminProducts;