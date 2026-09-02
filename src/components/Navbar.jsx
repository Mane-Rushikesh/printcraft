import {
  ShoppingCart,
  User,
  Menu,
  X,
  LogOut,
} from "lucide-react";

import { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import { useCart } from "../context/CartContext";

function Navbar() {
  const [open, setOpen] = useState(false);

  const { cartCount } = useCart();

  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  // ===============================
  // LOGOUT
  // ===============================
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  // ===============================
  // HOME SECTION NAVIGATION
  // ===============================
  const handleSectionClick = (sectionId) => {
    setOpen(false);

    // If already on Home page
    if (window.location.pathname === "/") {
      const section = document.getElementById(sectionId);

      if (section) {
        section.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }

      return;
    }

    // If on another page, first go Home
    navigate("/");

    // Wait for Home page to render
    setTimeout(() => {
      const section = document.getElementById(sectionId);

      if (section) {
        section.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 300);
  };

  return (
    <nav className="navbar">

      <div className="nav-container">

        {/* ===============================
            LOGO
        =============================== */}

        <Link
          to="/"
          className="logo"
          onClick={() => setOpen(false)}
        >
          Print<span>Craft</span>
        </Link>


        {/* ===============================
            NAVIGATION LINKS
        =============================== */}

        <div
          className={`nav-links ${
            open ? "active" : ""
          }`}
        >

          <button
      
            
            onClick={() =>
              handleSectionClick("home")
            }
          >
            Home
          </button>


          <button
            type="button"
            className="nav-link-button"
            onClick={() =>
              handleSectionClick("categories")
            }
          >
            Categories
          </button>


          <button
            type="button"
            className="nav-link-button"
            onClick={() =>
              handleSectionClick("products")
            }
          >
            Products
          </button>


          <button
            type="button"
            className="nav-link-button"
            onClick={() =>
              handleSectionClick("about")
            }
          >
            About
          </button>


          <button
            type="button"
            className="nav-link-button"
            onClick={() =>
              handleSectionClick("contact")
            }
          >
            Contact
          </button>

        </div>


        {/* ===============================
            RIGHT SIDE ACTIONS
        =============================== */}

        <div className="nav-actions">

          {/* CART */}

          <Link
            to="/cart"
            className="cart-button"
          >
            <ShoppingCart size={21} />

            {cartCount > 0 && (
              <span className="cart-count">
                {cartCount}
              </span>
            )}
          </Link>


          {/* LOGGED IN USER */}

          {token ? (
            <>

              <span className="user-name">
                <User size={18} />

                {user?.name || "User"}
              </span>


              {/* MY ORDERS
                  Hidden for admin */}

              {user?.role !== "admin" && (
                <Link
                  to="/orders"
                  className="login-button"
                >
                  My Orders
                </Link>
              )}


              {/* LOGOUT */}

              <button
                className="logout-button"
                onClick={handleLogout}
              >
                <LogOut size={18} />
                Logout
              </button>

            </>
          ) : (

            /* LOGIN */

            <Link
              to="/login"
              className="login-button"
            >
              <User size={18} />
              Login
            </Link>

          )}


          {/* MOBILE MENU */}

          <button
            type="button"
            className="menu-button"
            onClick={() =>
              setOpen(!open)
            }
          >
            {open ? (
              <X size={22} />
            ) : (
              <Menu size={22} />
            )}
          </button>

        </div>

      </div>

    </nav>
  );
}

export default Navbar;