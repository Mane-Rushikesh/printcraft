import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ShoppingBag,
  Banknote,
  CreditCard,
  Smartphone,
} from "lucide-react";

import { useCart } from "../context/CartContext";

function Checkout() {
  const navigate = useNavigate();

  const {
    cart,
    cartCount,
    cartTotal,
    clearCart,
  } = useCart();

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [placingOrder, setPlacingOrder] = useState(false);

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
      if (paymentMethod !== "cod") {
        alert(
          "Online Card and UPI payment will be available after payment gateway setup."
        );
        return;
      }

      setPlacingOrder(true);

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
            payment_method: paymentMethod,
            payment_status: "pending",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to place order"
        );
      }

      clearCart();

      alert(
        `Order placed successfully!\nOrder ID: ${data.orderId}\nPayment: Cash on Delivery`
      );

      navigate(`/orders/${data.orderId}`);
    } catch (error) {
      console.error("Order Error:", error);

      alert(
        error.message || "Failed to place order"
      );
    } finally {
      setPlacingOrder(false);
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

          {/* Payment Methods */}

          <div className="payment-section">

            <h3>Payment Method</h3>

            {/* COD */}

            <label
              className={`payment-option ${
                paymentMethod === "cod"
                  ? "selected"
                  : ""
              }`}
            >
              <input
                type="radio"
                name="payment"
                value="cod"
                checked={paymentMethod === "cod"}
                onChange={(e) =>
                  setPaymentMethod(e.target.value)
                }
              />

              <Banknote size={22} />

              <div>
                <strong>Cash on Delivery</strong>
                <span>
                  Pay when your order is delivered
                </span>
              </div>
            </label>

            {/* Card */}

            <label
              className={`payment-option disabled ${
                paymentMethod === "card"
                  ? "selected"
                  : ""
              }`}
            >
              <input
                type="radio"
                name="payment"
                value="card"
                disabled
                checked={paymentMethod === "card"}
                onChange={(e) =>
                  setPaymentMethod(e.target.value)
                }
              />

              <CreditCard size={22} />

              <div>
                <strong>Credit / Debit Card</strong>
                <span>
                  Online payment coming soon
                </span>
              </div>
            </label>

            {/* UPI */}

            <label
              className={`payment-option disabled ${
                paymentMethod === "upi"
                  ? "selected"
                  : ""
              }`}
            >
              <input
                type="radio"
                name="payment"
                value="upi"
                disabled
                checked={paymentMethod === "upi"}
                onChange={(e) =>
                  setPaymentMethod(e.target.value)
                }
              />

              <Smartphone size={22} />

              <div>
                <strong>UPI</strong>
                <span>
                  Google Pay, PhonePe, Paytm and more
                </span>
              </div>
            </label>

          </div>

          {/* Place Order */}

          <button
            className="checkout-button"
            onClick={handlePlaceOrder}
            disabled={placingOrder}
          >
            {placingOrder
              ? "Placing Order..."
              : "Place Order"}
          </button>

        </div>

      </div>

    </div>
  );
}

export default Checkout;