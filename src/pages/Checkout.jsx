import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";

function Checkout() {
  const navigate = useNavigate();

  const {
    cart,
    cartCount,
    cartTotal,
    clearCart,
  } = useCart();

  const token = localStorage.getItem("token");

  // Cart empty
  if (cart.length === 0) {
    return (
      <div className="cart-page empty-cart">
        <ShoppingBag size={60} />

        <h1>Your Cart is Empty</h1>

        <p>Add some products before checkout.</p>

        <Link to="/" className="primary-button">
          Continue Shopping
        </Link>
      </div>
    );
  }

  // Login required
  if (!token) {
    return (
      <div className="cart-page empty-cart">

        <h1>Please Login</h1>

        <p>
          You need to login before placing an order.
        </p>

        <Link to="/login" className="primary-button">
          Login
        </Link>

      </div>
    );
  }

 const handlePlaceOrder = async () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    const response = await fetch(
      "https://printcraft-backend.onrender.com/api/orders",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: user.id,
          items: cart,
          total_amount: cartTotal,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to place order"
      );
    }

    // Empty cart after successful order
    clearCart();

    alert(
      `Order placed successfully! Order ID: ${data.orderId}`
    );

    navigate(`/orders/${data.orderId}`);

  } catch (error) {
    console.error("Order Error:", error);

    alert(
      error.message || "Failed to place order"
    );
  }
};
  return (
    <div className="cart-page">

      <Link to="/cart" className="back-link">
        <ArrowLeft size={18} />
        Back to Cart
      </Link>

      <div className="cart-header">
        <div>
          <span>PRINTCRAFT</span>
          <h1>Checkout</h1>
        </div>

        <p>
          {cartCount} {cartCount === 1 ? "item" : "items"}
        </p>
      </div>

      <div className="cart-layout">

        {/* Order Items */}

        <div className="cart-items">

          <h2>Order Items</h2>

          {cart.map((item) => (
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

        {/* Order Summary */}

        <div className="cart-summary">

          <h2>Order Summary</h2>

          <div className="summary-row">
            <span>Items</span>
            <span>{cartCount}</span>
          </div>

          <div className="summary-row">
            <span>Subtotal</span>
            <strong>₹{cartTotal}</strong>
          </div>

          <div className="summary-row">
            <span>Delivery</span>
            <span>Free</span>
          </div>

          <hr />

          <div className="summary-total">
            <span>Total</span>
            <strong>₹{cartTotal}</strong>
          </div>

          <button
            className="checkout-button"
            onClick={handlePlaceOrder}
          >
            Place Order
          </button>

        </div>

      </div>

    </div>
  );
}

export default Checkout;