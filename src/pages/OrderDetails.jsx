import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  CheckCircle,
  Clock,
  Truck,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";

function OrderDetails() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Please login to view this order.");
          setLoading(false);
          return;
        }

        const response = await fetch(
          `http://localhost:5000/api/orders/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch order details"
          );
        }

        setOrder(data.order);
        setItems(data.items || []);
      } catch (error) {
        console.error("Order Details Error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

  // Loading
  if (loading) {
    return (
      <div className="cart-page empty-cart">
        <Package size={55} />

        <h1>Loading Order...</h1>

        <p>Please wait while we fetch your order details.</p>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="cart-page empty-cart">
        <XCircle size={55} />

        <h1>Unable to Load Order</h1>

        <p>{error}</p>

        <Link to="/orders" className="primary-button">
          Back to My Orders
        </Link>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="cart-page empty-cart">
        <Package size={55} />

        <h1>Order Not Found</h1>

        <Link to="/orders" className="primary-button">
          Back to My Orders
        </Link>
      </div>
    );
  }

  const getStatusIcon = () => {
    switch (order.status) {
      case "Delivered":
        return <CheckCircle size={22} />;

      case "Shipped":
        return <Truck size={22} />;

      case "Processing":
        return <Package size={22} />;

      case "Cancelled":
        return <XCircle size={22} />;

      default:
        return <Clock size={22} />;
    }
  };

  return (
    <div className="cart-page order-details-page">

      {/* Back */}

      <Link to="/orders" className="back-link">
        <ArrowLeft size={18} />
        Back to My Orders
      </Link>

      {/* Header */}

      <div className="cart-header">
        <div>
          <span>PRINTCRAFT</span>

          <h1>Order #{order.id}</h1>

          <p>
            Placed on{" "}
            {new Date(order.created_at).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>

        <div className="order-status">
          {getStatusIcon()}

          <strong>{order.status}</strong>
        </div>
      </div>

      <div className="cart-layout">

        {/* Order Items */}

        <div className="cart-items">

          <h2>Order Items</h2>

          {items.map((item) => (
            <div className="cart-item" key={item.id}>

              <img
                src={item.image}
                alt={item.name}
              />

              <div className="cart-item-info">

                <span>{item.category}</span>

                <h3>{item.name}</h3>

                <p>
                  ₹{item.price} × {item.quantity}
                </p>

              </div>

              <div className="cart-item-right">

                <strong>
                  ₹{item.price * item.quantity}
                </strong>

              </div>

            </div>
          ))}

        </div>

        {/* Summary */}

        <div className="cart-summary">

          <h2>Order Summary</h2>

          <div className="summary-row">
            <span>Order ID</span>

            <strong>#{order.id}</strong>
          </div>

          <div className="summary-row">
            <span>Items</span>

            <span>{items.length}</span>
          </div>

          <div className="summary-row">
            <span>Status</span>

            <strong>{order.status}</strong>
          </div>

          <hr />

          <div className="summary-total">

            <span>Total</span>

            <strong>
              ₹{order.total_amount}
            </strong>

          </div>

          <Link
            to="/orders"
            className="checkout-button"
          >
            View My Orders
          </Link>

          <Link
            to="/"
            className="continue-shopping"
          >
            Continue Shopping
          </Link>

        </div>

      </div>

    </div>
  );
}

export default OrderDetails;