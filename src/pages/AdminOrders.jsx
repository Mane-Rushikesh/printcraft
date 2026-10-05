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

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);

        // Get fresh values from localStorage
        const storedUser = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        const user = storedUser
          ? JSON.parse(storedUser)
          : null;

        console.log("ADMIN USER:", user);
        console.log("ADMIN ROLE:", user?.role);
        console.log("TOKEN EXISTS:", !!token);

        if (!user || user.role !== "admin") {
          console.error("Admin access denied");
          setLoading(false);
          return;
        }

        if (!token) {
          console.error("JWT token missing");
          setLoading(false);
          return;
        }

        const response = await fetch(
          "https://printcraft-backend.onrender.com/api/orders/admin/all",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();

        console.log("ADMIN ORDERS RESPONSE:", data);
        console.log("STATUS:", response.status);

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch orders"
          );
        }

        setOrders(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Admin Orders Error:", error);
        alert(error.message || "Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleStatusChange = async (
    orderId,
    newStatus
  ) => {
    try {
      setUpdating(orderId);

      const token = localStorage.getItem("token");

      const response = await fetch(
        `https://printcraft-backend.onrender.com/api/orders/admin/${orderId}/status`,
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
      console.error("Update Status Error:", error);

      alert(
        error.message ||
          "Failed to update order status"
      );
    } finally {
      setUpdating(null);
    }
  };

  const storedUser = localStorage.getItem("user");
  const user = storedUser
    ? JSON.parse(storedUser)
    : null;

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

  return (
    <div className="admin-orders-page">

      <Link
        to="/admin"
        className="back-link"
      >
        <ArrowLeft size={18} />
        Back to Admin Dashboard
      </Link>

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
        <div className="admin-orders-list">

          {orders.map((order) => (
            <div
              className="admin-order-card"
              key={order.id}
            >

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
                    ).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>

              </div>

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