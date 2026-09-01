import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

function AdminDashboard() {
  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const token = localStorage.getItem("token");

  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalCustomers: 0,
    pendingOrders: 0,
    totalSales: 0,
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/admin/dashboard",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch dashboard"
          );
        }

        setStats(data.stats);
        setRecentOrders(data.recentOrders);

      } catch (error) {
        console.error(
          "Dashboard Error:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === "admin" && token) {
      fetchDashboard();
    } else {
      setLoading(false);
    }
  }, [token, user?.role]);

  // ===============================
  // ACCESS CHECK
  // ===============================
  if (!user || user.role !== "admin") {
    return (
      <div className="cart-page empty-cart">
        <h1>Access Denied</h1>

        <p>
          You are not authorized to access
          the admin panel.
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
        <h1>Loading Dashboard...</h1>
      </div>
    );
  }

  return (
    <div className="cart-page">

      {/* HEADER */}
      <div className="cart-header">
        <div>
          <span>PRINTCRAFT ADMIN</span>

          <h1>Admin Dashboard</h1>
        </div>
      </div>

      {/* WELCOME */}
      <div className="cart-summary">
        <h2>
          Welcome, {user.name}
        </h2>

        <p>
          You are logged in as an administrator.
        </p>
      </div>

      {/* STATS */}
      <div className="cart-layout">

        <div className="cart-summary">
          <h2>{stats.totalProducts}</h2>
          <p>Total Products</p>
        </div>

        <div className="cart-summary">
          <h2>{stats.totalOrders}</h2>
          <p>Total Orders</p>
        </div>

        <div className="cart-summary">
          <h2>{stats.totalCustomers}</h2>
          <p>Total Customers</p>
        </div>

        <div className="cart-summary">
          <h2>{stats.pendingOrders}</h2>
          <p>Pending Orders</p>
        </div>

        <div className="cart-summary">
          <h2>
            ₹{Number(stats.totalSales).toFixed(2)}
          </h2>

          <p>Total Sales</p>
        </div>

      </div>

      {/* ADMIN ACTIONS */}
      <div className="cart-layout">

        <div className="cart-summary">
          <h2>Products</h2>

          <p>
            Manage your PrintCraft products.
          </p>

          <Link
            to="/admin/products"
            className="checkout-button"
          >
            Manage Products
          </Link>
        </div>

        <div className="cart-summary">
          <h2>Orders</h2>

          <p>
            View and manage customer orders.
          </p>

          <Link
            to="/admin/orders"
            className="checkout-button"
          >
            Manage Orders
          </Link>
        </div>

      </div>

      {/* RECENT ORDERS */}
      <div className="cart-items">

        <h2>Recent Orders</h2>

        {recentOrders.length === 0 ? (
          <p>No orders yet.</p>
        ) : (
          recentOrders.map((order) => (
            <div
              className="cart-item"
              key={order.id}
            >

              <div className="cart-item-info">

                <span>
                  ORDER #{order.id}
                </span>

                <h3>
                  {order.customer_name}
                </h3>

                <p>
                  {order.customer_email}
                </p>

                <p>
                  {new Date(
                    order.created_at
                  ).toLocaleDateString("en-IN")}
                </p>

              </div>

              <div className="cart-item-right">

                <strong>
                  ₹{Number(
                    order.total_amount
                  ).toFixed(2)}
                </strong>

                <p>
                  {order.status}
                </p>

              </div>

            </div>
          ))
        )}

      </div>

    </div>
  );
}

export default AdminDashboard;