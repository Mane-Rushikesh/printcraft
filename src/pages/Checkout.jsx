import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ShoppingBag,
  Banknote,
  CreditCard,
  Smartphone,
  ShieldCheck,
  Truck,
  CheckCircle,
  Lock,
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

  if (cart.length === 0) {
    return (
      <div className="checkout-empty">
        <ShoppingBag size={60} />

        <h1>Your Cart is Empty</h1>

        <p>Add some products before checkout.</p>

        <Link to="/" className="primary-button">
          Continue Shopping
        </Link>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="checkout-empty">
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
        `Order placed successfully! Order ID: ${data.orderId}`
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
    <div className="checkout-page">

      {/* Top */}

      <div className="checkout-container">

        <Link to="/cart" className="checkout-back">
          <ArrowLeft size={18} />
          Back to Cart
        </Link>

        <div className="checkout-heading">
          <div>
            <span>PRINTCRAFT</span>

            <h1>Checkout</h1>

            <p>
              Complete your order securely
            </p>
          </div>

          <div className="checkout-items-count">
            <ShoppingBag size={20} />
            {cartCount}{" "}
            {cartCount === 1 ? "Item" : "Items"}
          </div>
        </div>

        <div className="checkout-layout">

          {/* LEFT */}

          <div className="checkout-left">

            {/* Order Items */}

            <section className="checkout-card">

              <div className="checkout-card-title">
                <ShoppingBag size={21} />

                <div>
                  <h2>Order Items</h2>
                  <p>Your selected products</p>
                </div>
              </div>

              <div className="checkout-products">

                {cart.map((item) => (
                  <div
                    className="checkout-product"
                    key={item.id}
                  >

                    <img
                      src={item.image}
                      alt={item.name}
                    />

                    <div className="checkout-product-info">

                      <span>
                        {item.category}
                      </span>

                      <h3>
                        {item.name}
                      </h3>

                      <p>
                        ₹{item.price} × {item.quantity}
                      </p>

                    </div>

                    <strong>
                      ₹{item.price * item.quantity}
                    </strong>

                  </div>
                ))}

              </div>

            </section>

            {/* Payment */}

            <section className="checkout-card">

              <div className="checkout-card-title">
                <CreditCard size={21} />

                <div>
                  <h2>Choose Payment Method</h2>

                  <p>
                    Select your preferred payment option
                  </p>
                </div>
              </div>

              <div className="payment-methods">

                {/* COD */}

                <button
                  type="button"
                  className={`payment-option ${
                    paymentMethod === "cod"
                      ? "selected"
                      : ""
                  }`}
                  onClick={() =>
                    setPaymentMethod("cod")
                  }
                >

                  <div className="payment-icon">
                    <Banknote size={25} />
                  </div>

                  <div className="payment-content">
                    <strong>
                      Cash on Delivery
                    </strong>

                    <span>
                      Pay when your order arrives
                    </span>
                  </div>

                  {paymentMethod === "cod" && (
                    <CheckCircle
                      className="payment-check"
                      size={22}
                    />
                  )}

                </button>

                {/* CARD */}

                <button
                  type="button"
                  className={`payment-option ${
                    paymentMethod === "card"
                      ? "selected"
                      : ""
                  }`}
                  onClick={() =>
                    setPaymentMethod("card")
                  }
                >

                  <div className="payment-icon">
                    <CreditCard size={25} />
                  </div>

                  <div className="payment-content">
                    <strong>
                      Credit / Debit Card
                    </strong>

                    <span>
                      Visa, Mastercard & other cards
                    </span>
                  </div>

                  {paymentMethod === "card" && (
                    <CheckCircle
                      className="payment-check"
                      size={22}
                    />
                  )}

                </button>

                {/* UPI */}

                <button
                  type="button"
                  className={`payment-option ${
                    paymentMethod === "upi"
                      ? "selected"
                      : ""
                  }`}
                  onClick={() =>
                    setPaymentMethod("upi")
                  }
                >

                  <div className="payment-icon">
                    <Smartphone size={25} />
                  </div>

                  <div className="payment-content">
                    <strong>
                      UPI Payment
                    </strong>

                    <span>
                      Google Pay, PhonePe, Paytm & more
                    </span>
                  </div>

                  {paymentMethod === "upi" && (
                    <CheckCircle
                      className="payment-check"
                      size={22}
                    />
                  )}

                </button>

              </div>

              <div className="payment-info">

                <ShieldCheck size={19} />

                <span>
                  Your payment information is secure
                  and protected.
                </span>

              </div>

            </section>

          </div>

          {/* RIGHT */}

          <aside className="checkout-right">

            <div className="checkout-summary">

              <div className="summary-header">
                <div>
                  <span>SUMMARY</span>
                  <h2>Order Summary</h2>
                </div>

                <ShoppingBag size={23} />
              </div>

              <div className="summary-row">
                <span>Items</span>
                <strong>{cartCount}</strong>
              </div>

              <div className="summary-row">
                <span>Subtotal</span>
                <strong>
                  ₹{cartTotal}
                </strong>
              </div>

              <div className="summary-row">
                <span>Delivery</span>
                <strong className="free">
                  FREE
                </strong>
              </div>

              <div className="summary-line"></div>

              <div className="summary-total">
                <div>
                  <span>Total Amount</span>
                  <small>
                    Inclusive of all charges
                  </small>
                </div>

                <strong>
                  ₹{cartTotal}
                </strong>
              </div>

              <button
                className="place-order-button"
                onClick={handlePlaceOrder}
                disabled={placingOrder}
              >
                {placingOrder
                  ? "Placing Order..."
                  : "Continue to Payment"}
              </button>

              <div className="secure-checkout">
                <Lock size={16} />
                Secure & encrypted checkout
              </div>

            </div>

            {/* Benefits */}

            <div className="checkout-benefits">

              <div className="checkout-benefit">

                <div className="benefit-circle">
                  <ShieldCheck size={21} />
                </div>

                <div>
                  <strong>
                    Secure Payment
                  </strong>

                  <span>
                    Your payment information is protected.
                  </span>
                </div>

              </div>

              <div className="checkout-benefit">

                <div className="benefit-circle">
                  <Truck size={21} />
                </div>

                <div>
                  <strong>
                    Reliable Delivery
                  </strong>

                  <span>
                    Safe delivery across India.
                  </span>
                </div>

              </div>

              <div className="checkout-benefit">

                <div className="benefit-circle">
                  <CheckCircle size={21} />
                </div>

                <div>
                  <strong>
                    Quality Guaranteed
                  </strong>

                  <span>
                    Professional printing quality.
                  </span>
                </div>

              </div>

            </div>

          </aside>

        </div>

      </div>

    </div>
  );
}

export default Checkout;