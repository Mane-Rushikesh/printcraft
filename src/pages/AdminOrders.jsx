import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  RefreshCw,
  User,
  Mail,
  CalendarDays,
} from "lucide-react";
import { useEffect, useState } from "react";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const token = localStorage.getItem("token");

  // ===============================
  // FETCH ALL ORDERS
  // ===============================
  const fetchOrders = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/orders/admin/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch orders"
        );
      }

      setOrders(data);
    } catch (error) {
      console.error("Admin Orders Error:", error);

      alert(
        error.message || "Failed to fetch orders"
      );
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // LOAD ORDERS
  // ===============================
  useEffect(() => {
    if (user?.role === "admin" && token) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, []);

  // ===============================
  // UPDATE ORDER STATUS
  // ===============================
  const handleStatusChange = async (
    orderId,
    newStatus
  ) => {
    try {
      setUpdating(orderId);

      const response = await fetch(
        `http://localhost:5000/api/orders/admin/${orderId}/status`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update order status"
        );
      }

      // Update UI immediately
      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.id === orderId
            ? {
                ...order,
                status: newStatus,
              }
            : order
        )
      );
    } catch (error) {
      console.error(
        "Update Status Error:",
        error
      );

      alert(
        error.message ||
          "Failed to update order status"
      );
    } finally {
      setUpdating(null);
    }
  };

  // ===============================
  // ACCESS DENIED
  // ===============================
  if (!user || user.role !== "admin") {
    return (
      <div className="cart-page empty-cart">
        <Package size={60} />

        <h1>Access Denied</h1>

        <p>
          You are not authorized to access this page.
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
        <RefreshCw
          size={45}
          className="loading-icon"
        />

        <h1>Loading Orders...</h1>

        <p>
          Please wait while we load customer orders.
        </p>
      </div>
    );
  }

  // ===============================
  // MAIN UI
  // ===============================
  return (
    <div className="admin-orders-page">

      {/* BACK */}
      <Link
        to="/admin"
        className="back-link"
      >
        <ArrowLeft size={18} />
        Back to Admin Dashboard
      </Link>

      {/* HEADER */}
      <div className="admin-orders-header">

        <div>
          <span className="admin-page-label">
            PRINTCRAFT ADMIN
          </span>

          <h1>All Orders</h1>

          <p>
            Manage and update customer orders.
          </p>
        </div>

        <div className="admin-orders-count">
          <strong>{orders.length}</strong>

          <span>
            {orders.length === 1
              ? "Order"
              : "Orders"}
          </span>
        </div>

      </div>

      {/* EMPTY */}
      {orders.length === 0 ? (
        <div className="admin-empty-orders">

          <Package size={60} />

          <h2>No Orders Yet</h2>

          <p>
            Customer orders will appear here
            when someone places an order.
          </p>

        </div>
      ) : (

        /* ORDER LIST */
        <div className="admin-orders-list">

          {orders.map((order) => (

            <div
              className="admin-order-card"
              key={order.id}
            >

              {/* ORDER INFORMATION */}
              <div className="admin-order-info">

                <span className="admin-order-number">
                  ORDER #{order.id}
                </span>

                <h3>
                  {order.customer_name}
                </h3>

                <div className="admin-customer-detail">

                  <User size={15} />

                  <span>
                    Customer ID: {order.user_id}
                  </span>

                </div>

                <div className="admin-customer-detail">

                  <Mail size={15} />

                  <span>
                    {order.customer_email}
                  </span>

                </div>

                <div className="admin-customer-detail">

                  <CalendarDays size={15} />

                  <span>
                    {new Date(
                      order.created_at
                    ).toLocaleDateString(
                      "en-IN",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }
                    )}
                  </span>

                </div>

              </div>

              {/* ORDER RIGHT SIDE */}
              <div className="admin-order-right">

                <div className="admin-order-price">
                  ₹
                  {Number(
                    order.total_amount
                  ).toLocaleString("en-IN")}
                </div>

                <label>
                  Order Status
                </label>

                <select
                  className="admin-status-select"
                  value={order.status}
                  disabled={
                    updating === order.id
                  }
                  onChange={(e) =>
                    handleStatusChange(
                      order.id,
                      e.target.value
                    )
                  }
                >
                  <option value="Pending">
                    Pending
                  </option>

                  <option value="Processing">
                    Processing
                  </option>

                  <option value="Shipped">
                    Shipped
                  </option>

                  <option value="Delivered">
                    Delivered
                  </option>

                  <option value="Cancelled">
                    Cancelled
                  </option>
                </select>

                {updating === order.id && (
                  <span className="status-updating">
                    Updating...
                  </span>
                )}

              </div>

            </div>

          ))}

        </div>
      )}

    </div>
  );
}

export default AdminOrders;