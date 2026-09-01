import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (!user?.id) {
          return;
        }

       const token = localStorage.getItem("token");

const response = await fetch(
  `http://localhost:5000/api/orders/user/${user.id}`,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch orders");
        }

        setOrders(data);
      } catch (error) {
        console.error("Orders Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user?.id]);

  if (!user) {
    return (
      <div className="cart-page empty-cart">
        <ShoppingBag size={60} />

        <h1>Please Login</h1>

        <p>Login to view your orders.</p>

        <Link to="/login" className="primary-button">
          Login
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="cart-page empty-cart">
        <h1>Loading Orders...</h1>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="cart-page empty-cart">
        <ShoppingBag size={60} />

        <h1>No Orders Yet</h1>

        <p>You haven't placed any orders yet.</p>

        <Link to="/" className="primary-button">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-page">

      <div className="cart-header">
        <div>
          <span>PRINTCRAFT</span>
          <h1>My Orders</h1>
        </div>

        <p>
          {orders.length}{" "}
          {orders.length === 1 ? "order" : "orders"}
        </p>
      </div>

      <div className="cart-items">

        {orders.map((order) => (
          <Link
  to={`/orders/${order.id}`}
  className="cart-item"
  key={order.id}
>

            <div className="cart-item-info">

              <span>ORDER #{order.id}</span>

              <h3>
                ₹{order.total_amount}
              </h3>

              <p>
                Date:{" "}
                {new Date(order.created_at).toLocaleDateString("en-IN")}
              </p>

            </div>

            <div className="cart-item-right">
  <span>Order Status</span>
  <strong>{order.status}</strong>
</div>

          </Link>
        ))}

      </div>

    </div>
  );
}

export default MyOrders;