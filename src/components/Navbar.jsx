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

    setOpen(false);

    navigate("/login");
  };


  // ===============================
  // HOME SECTION NAVIGATION
  // ===============================

  const handleSectionClick = (sectionId) => {

    setOpen(false);

    // Already on Home page
    if (window.location.pathname === "/") {

      const section =
        document.getElementById(sectionId);

      if (section) {

        section.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });

      }

      return;
    }


    // Go to Home first
    navigate("/");


    // Wait for Home to render
    setTimeout(() => {

      const section =
        document.getElementById(sectionId);

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


          {/* HOME */}

          <button
            type="button"
            className="nav-link-button"
            onClick={() =>
              handleSectionClick("home")
            }
          >
            Home
          </button>


          {/* CATEGORIES */}

          <button
            type="button"
            className="nav-link-button"
            onClick={() =>
              handleSectionClick("categories")
            }
          >
            Categories
          </button>


          {/* PRODUCTS */}

          <button
            type="button"
            className="nav-link-button"
            onClick={() =>
              handleSectionClick("products")
            }
          >
            Products
          </button>


          {/* ABOUT */}

          <button
            type="button"
            className="nav-link-button"
            onClick={() =>
              handleSectionClick("about")
            }
          >
            About
          </button>


          {/* CONTACT */}

          <button
            type="button"
            className="nav-link-button"
            onClick={() =>
              handleSectionClick("contact")
            }
          >
            Contact
          </button>


          {/* =================================
              MOBILE ACCOUNT MENU
          ================================= */}

          {/* MOBILE ACCOUNT MENU */}
<div className="mobile-account-links">

  {token ? (
    <>
      {/* My Orders - normal user only */}
      {user?.role !== "admin" && (
        <Link
          to="/orders"
          className="mobile-menu-link"
          onClick={() => setOpen(false)}
        >
          My Orders
        </Link>
      )}

      {/* Logout */}
      <button
        type="button"
        className="mobile-menu-link mobile-logout"
        onClick={handleLogout}
      >
        <LogOut size={17} />
        Logout
      </button>
    </>
  ) : (
    /* Login - logged out user */
    <Link
      to="/login"
      className="mobile-menu-link mobile-login"
      onClick={() => setOpen(false)}
    >
      <User size={17} />
      Login
    </Link>
  )}

</div>

        </div>


        {/* ===============================
            RIGHT SIDE ACTIONS
        =============================== */}

        <div className="nav-actions">


          {/* CART */}

          <Link
            to="/cart"
            className="cart-button"
            onClick={() => setOpen(false)}
          >

            <ShoppingCart size={21} />

            {cartCount > 0 && (

              <span className="cart-count">
                {cartCount}
              </span>

            )}

          </Link>


          {/* ===============================
              DESKTOP USER
          =============================== */}

          {token ? (

            <>


              {/* USER NAME */}

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
                  onClick={() =>
                    setOpen(false)
                  }
                >
                  My Orders
                </Link>

              )}


              {/* DESKTOP LOGOUT */}

              <button
                type="button"
                className="logout-button"
                onClick={handleLogout}
              >
                <LogOut size={18} />
                Logout
              </button>


            </>

          ) : (


            /* ===============================
               LOGIN
            =============================== */

            <Link
              to="/login"
              className="login-button"
              onClick={() => setOpen(false)}
            >
              <User size={18} />
              Login
            </Link>

          )}


          {/* ===============================
              MOBILE MENU BUTTON
          =============================== */}

          <button
            type="button"
            className="menu-button"
            aria-label={
              open
                ? "Close menu"
                : "Open menu"
            }
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