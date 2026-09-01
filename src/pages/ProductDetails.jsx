import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ShoppingCart,
  ArrowLeft,
  CheckCircle,
  Truck,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

import { useCart } from "../context/CartContext";

function ProductDetails() {
  const { id } = useParams();

  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const API_URL =
          import.meta.env.VITE_API_URL || "http://localhost:5000";

        const response = await fetch(
          `${API_URL}/api/products/${id}`
        );

        if (!response.ok) {
          throw new Error("Product not found");
        }

        const data = await response.json();

        // Supports both:
        // { product: {...} }
        // and direct product object
        setProduct(data.product || data);
      } catch (err) {
        console.error("Product details error:", err);
        setError("Unable to load product details.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  /* Loading */

  if (loading) {
    return (
      <div className="product-details-page product-loading">
        <div className="loading-spinner"></div>
        <p>Loading product...</p>
      </div>
    );
  }

  /* Error */

  if (error || !product) {
    return (
      <div className="product-details-page product-error">
        <div className="product-error-icon">
          <ShoppingCart size={35} />
        </div>

        <h1>Product Not Found</h1>

        <p>
          Sorry, we couldn't find the product you're looking for.
        </p>

        <Link to="/" className="product-back-button">
          <ArrowLeft size={18} />
          Back to Products
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
    <main className="product-details-page">

      {/* Back */}

      <div className="product-details-container">

        <Link to="/" className="product-back-link">
          <ArrowLeft size={17} />
          Back to Products
        </Link>

        {/* Main Product */}

        <section className="product-details-main">

          {/* Product Image */}

          <div className="product-details-image">

            <img
              src={product.image}
              alt={product.name}
            />

          </div>

          {/* Product Information */}

          <div className="product-details-info">

            <span className="product-details-category">
              {product.category}
            </span>

            <h1>
              {product.name}
            </h1>

            <p className="product-details-description">
              {product.description}
            </p>

            <div className="product-details-price">

              <span>Starting from</span>

              <strong>
                ₹{product.price}
              </strong>

            </div>

            {/* Add Cart */}

            <button
              className="product-details-cart-button"
              onClick={handleAddToCart}
            >
              <ShoppingCart size={19} />
              Add to Cart
            </button>

            {/* Features */}

            <div className="product-details-features">

              <div className="product-feature">

                <div className="product-feature-icon">
                  <CheckCircle size={20} />
                </div>

                <div>
                  <strong>Premium Quality</strong>
                  <span>
                    High-quality printing materials
                  </span>
                </div>

              </div>

              <div className="product-feature">

                <div className="product-feature-icon">
                  <Sparkles size={20} />
                </div>

                <div>
                  <strong>Custom Design</strong>
                  <span>
                    Designed according to your requirements
                  </span>
                </div>

              </div>

              <div className="product-feature">

                <div className="product-feature-icon">
                  <Truck size={20} />
                </div>

                <div>
                  <strong>Fast Delivery</strong>
                  <span>
                    Reliable delivery across India
                  </span>
                </div>

              </div>

            </div>

          </div>

        </section>

        {/* Bottom Information */}

        <section className="product-details-benefits">

          <div className="benefit-item">

            <div className="benefit-icon">
              <ShieldCheck size={22} />
            </div>

            <div>
              <h3>Quality Guaranteed</h3>
              <p>
                Every product is carefully printed
                and professionally finished.
              </p>
            </div>

          </div>

          <div className="benefit-item">

            <div className="benefit-icon">
              <Truck size={22} />
            </div>

            <div>
              <h3>Reliable Delivery</h3>
              <p>
                Your custom prints are safely packed
                and delivered across India.
              </p>
            </div>

          </div>

          <div className="benefit-item">

            <div className="benefit-icon">
              <Sparkles size={22} />
            </div>

            <div>
              <h3>Made For You</h3>
              <p>
                Create personalized products that
                match your exact requirements.
              </p>
            </div>

          </div>

        </section>

      </div>

    </main>
  );
}

export default ProductDetails;