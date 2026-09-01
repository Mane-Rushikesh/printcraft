import { Link } from "react-router-dom";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
} from "lucide-react";
import { useCart } from "../context/CartContext";

function Cart() {
  const {
    cart,
    cartCount,
    cartTotal,
    removeFromCart,
    decreaseQuantity,
    addToCart,
    clearCart,
  } = useCart();

  // Empty Cart
  if (cart.length === 0) {
    return (
      <div className="cart-page empty-cart">
        <ShoppingBag size={60} />

        <h1>Your Cart is Empty</h1>

        <p>
          Looks like you haven't added any products yet.
        </p>

        <Link to="/" className="primary-button">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-page">

      {/* Header */}
      <div className="cart-header">
        <div>
          <span>YOUR SHOPPING CART</span>

          <h1>Cart</h1>
        </div>

        <p>
          {cartCount}{" "}
          {cartCount === 1 ? "item" : "items"}
        </p>
      </div>

      {/* Cart Layout */}
      <div className="cart-layout">

        {/* Cart Items */}
        <div className="cart-items">

          {cart.map((item) => (
            <div
              className="cart-item"
              key={item.id}
            >

              {/* Product Image */}
              <img
                src={item.image}
                alt={item.name}
              />

              {/* Product Information */}
              <div className="cart-item-info">

                <span>
                  {item.category}
                </span>

                <h3>
                  {item.name}
                </h3>

                <p>
                  ₹{item.price} × {item.quantity}
                </p>

                {/* Quantity */}
                <div className="quantity-controls">

                  <button
                    type="button"
                    onClick={() =>
                      decreaseQuantity(item.id)
                    }
                  >
                    <Minus size={16} />
                  </button>

                  <strong>
                    {item.quantity}
                  </strong>

                  <button
                    type="button"
                    onClick={() =>
                      addToCart(item)
                    }
                  >
                    <Plus size={16} />
                  </button>

                </div>

              </div>

              {/* Price + Remove */}
              <div className="cart-item-right">

                <strong>
                  ₹{item.price * item.quantity}
                </strong>

                <button
                  type="button"
                  className="remove-button"
                  onClick={() =>
                    removeFromCart(item.id)
                  }
                  aria-label={`Remove ${item.name}`}
                >
                  <Trash2 size={18} />
                </button>

              </div>

            </div>
          ))}

          {/* Clear Cart */}
          <button
            type="button"
            className="clear-cart"
            onClick={clearCart}
          >
            Clear Cart
          </button>

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
            <strong>
              ₹{cartTotal}
            </strong>
          </div>

          <div className="summary-row">
            <span>Delivery</span>
            <span>
              Calculated at checkout
            </span>
          </div>

          <hr />

          <div className="summary-total">
            <span>Total</span>

            <strong>
              ₹{cartTotal}
            </strong>
          </div>

          <Link
            to="/checkout"
            className="checkout-button"
          >
            Proceed to Checkout
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

export default Cart;