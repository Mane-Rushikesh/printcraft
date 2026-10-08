import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  ShoppingBag,
  Banknote,
  CreditCard,
  Smartphone,
  ShieldCheck,
  Lock,
  CheckCircle2,
  Truck,
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

  // =========================
  // EMPTY CART
  // =========================

  if (cart.length === 0) {
    return (
      <div className="cart-page empty-cart">

        <ShoppingBag size={60} />

        <h1>Your Cart is Empty</h1>

        <p>
          Add some products before checkout.
        </p>

        <Link to="/" className="primary-button">
          Continue Shopping
        </Link>

      </div>
    );
  }

  // =========================
  // LOGIN REQUIRED
  // =========================

  if (!token) {
    return (
      <div className="cart-page empty-cart">

        <Lock size={50} />

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

  // =========================
  // PLACE ORDER
  // =========================

  const handlePlaceOrder = async () => {
    try {

      // Card and UPI are selectable,
      // but actual payment gateway is not connected yet.
      if (
        paymentMethod === "card" ||
        paymentMethod === "upi"
      ) {
        alert(
          "Online payment is selected. Card and UPI payment gateway will be connected next."
        );

        return;
      }

      setPlacingOrder(true);

      const user = JSON.parse(
        localStorage.getItem("user")
      );

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
          data.message ||
            "Failed to place order"
        );
      }

      // Clear cart after successful order
      clearCart();

      alert(
        `Order placed successfully!\n\nOrder ID: ${data.orderId}\nPayment: Cash on Delivery`
      );

      navigate(
        `/orders/${data.orderId}`
      );

    } catch (error) {

      console.error(
        "Order Error:",
        error
      );

      alert(
        error.message ||
          "Failed to place order"
      );

    } finally {

      setPlacingOrder(false);

    }
  };

  // =========================
  // PAYMENT METHOD
  // =========================

  const paymentMethods = [
    {
      id: "cod",
      title: "Cash on Delivery",
      description:
        "Pay when your order arrives",
      icon: Banknote,
      badge: "Available",
    },

    {
      id: "card",
      title: "Credit / Debit Card",
      description:
        "Visa, Mastercard & other cards",
      icon: CreditCard,
      badge: "Online",
    },

    {
      id: "upi",
      title: "UPI Payment",
      description:
        "Google Pay, PhonePe, Paytm & more",
      icon: Smartphone,
      badge: "Online",
    },
  ];

  return (
    <div className="checkout-page">

      {/* =========================
          TOP BAR
      ========================= */}

      <div className="checkout-top">

        <Link
          to="/cart"
          className="checkout-back"
        >
          <ArrowLeft size={18} />

          Back to Cart
        </Link>

        <div className="checkout-security">

          <ShieldCheck size={18} />

          Secure Checkout

        </div>

      </div>

      {/* =========================
          HEADER
      ========================= */}

      <div className="checkout-header">

        <div>

          <span className="checkout-brand">
            PRINTCRAFT
          </span>

          <h1>
            Checkout
          </h1>

          <p>
            Complete your order securely
            and choose your preferred
            payment method.
          </p>

        </div>

        <div className="checkout-step">

          <div className="step active">
            <CheckCircle2 size={18} />
            Cart
          </div>

          <div className="step-line"></div>

          <div className="step active">
            <CheckCircle2 size={18} />
            Checkout
          </div>

          <div className="step-line"></div>

          <div className="step">
            <Truck size={18} />
            Delivery
          </div>

        </div>

      </div>

      {/* =========================
          MAIN CONTENT
      ========================= */}

      <div className="checkout-layout">

        {/* =========================
            LEFT SIDE
        ========================= */}

        <div className="checkout-left">

          {/* ORDER ITEMS */}

          <section className="checkout-card">

            <div className="checkout-card-title">

              <div>

                <span>
                  YOUR ORDER
                </span>

                <h2>
                  Order Items
                </h2>

              </div>

              <strong>
                {cartCount}{" "}
                {cartCount === 1
                  ? "Item"
                  : "Items"}
              </strong>

            </div>

            <div className="checkout-items">

              {cart.map((item) => (

                <div
                  className="checkout-item"
                  key={item.id}
                >

                  <div className="checkout-product-image">

                    <img
                      src={item.image}
                      alt={item.name}
                    />

                  </div>

                  <div className="checkout-product-info">

                    <span>
                      {item.category}
                    </span>

                    <h3>
                      {item.name}
                    </h3>

                    <p>
                      ₹{item.price} ×{" "}
                      {item.quantity}
                    </p>

                  </div>

                  <strong className="checkout-product-total">
                    ₹
                    {(
                      item.price *
                      item.quantity
                    ).toFixed(2)}
                  </strong>

                </div>

              ))}

            </div>

          </section>

          {/* PAYMENT */}

          <section className="checkout-card payment-card">

            <div className="checkout-card-title">

              <div>

                <span>
                  PAYMENT
                </span>

                <h2>
                  Choose Payment Method
                </h2>

              </div>

              <ShieldCheck
                size={25}
              />

            </div>

            <div className="payment-methods">

              {paymentMethods.map(
                (method) => {

                  const Icon =
                    method.icon;

                  const selected =
                    paymentMethod ===
                    method.id;

                  return (

                    <button
                      type="button"
                      key={method.id}
                      className={`payment-method ${
                        selected
                          ? "selected"
                          : ""
                      }`}
                      onClick={() =>
                        setPaymentMethod(
                          method.id
                        )
                      }
                    >

                      <div className="payment-icon">

                        <Icon size={25} />

                      </div>

                      <div className="payment-info">

                        <div className="payment-name">

                          <strong>
                            {method.title}
                          </strong>

                          <span className="payment-badge">
                            {method.badge}
                          </span>

                        </div>

                        <p>
                          {
                            method.description
                          }
                        </p>

                      </div>

                      <div
                        className={`payment-radio ${
                          selected
                            ? "checked"
                            : ""
                        }`}
                      >
                        {selected && (
                          <CheckCircle2
                            size={18}
                          />
                        )}
                      </div>

                    </button>

                  );
                }
              )}

            </div>

            {/* Selected payment message */}

            <div className="payment-note">

              {paymentMethod ===
                "cod" && (
                <>
                  <Banknote
                    size={19}
                  />

                  <span>
                    You will pay
                    <strong>
                      {" "}₹
                      {cartTotal}
                    </strong>{" "}
                    when your order is
                    delivered.
                  </span>
                </>
              )}

              {paymentMethod ===
                "card" && (
                <>
                  <CreditCard
                    size={19}
                  />

                  <span>
                    Card payment will
                    be processed securely
                    through our online
                    payment gateway.
                  </span>
                </>
              )}

              {paymentMethod ===
                "upi" && (
                <>
                  <Smartphone
                    size={19}
                  />

                  <span>
                    Pay securely using
                    your preferred UPI
                    application.
                  </span>
                </>
              )}

            </div>

          </section>

        </div>

        {/* =========================
            RIGHT SIDE
        ========================= */}

        <aside className="checkout-right">

          <div className="checkout-summary">

            <div className="summary-heading">

              <span>
                SUMMARY
              </span>

              <h2>
                Order Summary
              </h2>

            </div>

            <div className="summary-row">

              <span>
                Items
              </span>

              <strong>
                {cartCount}
              </strong>

            </div>

            <div className="summary-row">

              <span>
                Subtotal
              </span>

              <strong>
                ₹{cartTotal}
              </strong>

            </div>

            <div className="summary-row">

              <span>
                Delivery
              </span>

              <strong className="free">
                FREE
              </strong>

            </div>

            <div className="summary-divider"></div>

            <div className="summary-total">

              <div>

                <span>
                  Total Amount
                </span>

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
                ? "Processing..."
                : paymentMethod === "cod"
                ? "Place Order"
                : "Continue to Payment"}

            </button>

            <div className="secure-message">

              <Lock size={16} />

              <span>
                Secure & encrypted
                checkout
              </span>

            </div>

          </div>

          {/* BENEFITS */}

          <div className="checkout-benefits">

            <div className="checkout-benefit">

              <div className="benefit-small-icon">
                <ShieldCheck
                  size={20}
                />
              </div>

              <div>

                <strong>
                  Secure Payment
                </strong>

                <span>
                  Your payment information
                  is protected.
                </span>

              </div>

            </div>

            <div className="checkout-benefit">

              <div className="benefit-small-icon">
                <Truck size={20} />
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

              <div className="benefit-small-icon">
                <CheckCircle2
                  size={20}
                />
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
  );
}

export default Checkout;