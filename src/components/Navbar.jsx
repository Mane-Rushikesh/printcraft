import { ShoppingCart, User, Menu, X, LogOut } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Navbar() {
  const [open, setOpen] = useState(false);

  const { cartCount } = useCart();

  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="nav-container">

        <Link to="/" className="logo">
          Print<span>Craft</span>
        </Link>

        <div className={`nav-links ${open ? "active" : ""}`}>

          <a href="#home" onClick={() => setOpen(false)}>
            Home
          </a>

          <a href="#categories" onClick={() => setOpen(false)}>
            Categories
          </a>

          <a href="#products" onClick={() => setOpen(false)}>
            Products
          </a>

          <a href="#about" onClick={() => setOpen(false)}>
            About
          </a>

          <a href="#contact" onClick={() => setOpen(false)}>
            Contact
          </a>

        </div>

        <div className="nav-actions">

          <Link to="/cart" className="cart-button">
            <ShoppingCart size={21} />

            {cartCount > 0 && (
              <span className="cart-count">
                {cartCount}
              </span>
            )}
          </Link>

          {token ? (
            <>
              <span className="user-name">
                <User size={18} />
                {user?.name || "User"}
              </span>
              {user?.role !== "admin" && (
  <Link
    to="/orders"
    className="login-button"
  >
    My Orders
  </Link>
)}
              <button
                className="logout-button"
                onClick={handleLogout}
              >
                <LogOut size={18} />
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="login-button">
              <User size={18} />
              Login
            </Link>
            
          )}

          <button
            className="menu-button"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>

        </div>

      </div>
    </nav>
  );
}

export default Navbar;