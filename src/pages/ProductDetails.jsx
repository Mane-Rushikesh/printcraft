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

  // Customization
  const [brideName, setBrideName] = useState("");
  const [groomName, setGroomName] = useState("");
  const [weddingDate, setWeddingDate] = useState("");
  const [venue, setVenue] = useState("");
  const [selectedDesign, setSelectedDesign] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        // Remove trailing slash and /api if already present
        const API_URL = (
          import.meta.env.VITE_API_URL ||
          "https://printcraft-backend.onrender.com"
        )
          .replace(/\/$/, "")
          .replace(/\/api$/, "");

        const response = await fetch(
          `${API_URL}/api/products/${id}`
        );

        if (!response.ok) {
          throw new Error("Product not found");
        }

        const data = await response.json();

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

  if (loading) {
    return (
      <div className="product-details-page product-loading">
        <div className="loading-spinner"></div>
        <p>Loading product...</p>
      </div>
    );
  }

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

  // Check whether this is a wedding card
  const isWeddingCard =
    product.category?.toLowerCase().includes("wedding") ||
    product.name?.toLowerCase().includes("wedding");

  const handleAddToCart = () => {
    if (isWeddingCard) {
      if (!brideName.trim() || !groomName.trim()) {
        alert("Please enter Bride Name and Groom Name.");
        return;
      }

      addToCart({
        ...product,
        customization: {
          brideName,
          groomName,
          weddingDate,
          venue,
          design: selectedDesign,
        },
      });

      alert("Customized wedding card added to cart!");
      return;
    }

    addToCart(product);
  };

  return (
    <main className="product-details-page">
      <div className="product-details-container">

        {/* Back */}
        <Link to="/" className="product-back-link">
          <ArrowLeft size={17} />
          Back to Products
        </Link>

        {/* Main Product */}
        <section className="product-details-main">

          {/* Product Image / Preview */}
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

            <h1>{product.name}</h1>

            <p className="product-details-description">
              {product.description}
            </p>

            <div className="product-details-price">
              <span>Starting from</span>

              <strong>
                ₹{product.price}
              </strong>
            </div>

            {/* ============================= */}
            {/* WEDDING CARD CUSTOMIZATION */}
            {/* ============================= */}

            {isWeddingCard && (
              <div
                style={{
                  marginTop: "25px",
                  padding: "22px",
                  borderRadius: "16px",
                  background: "#fafafa",
                  border: "1px solid #e5e5e5",
                }}
              >
                <h2
                  style={{
                    marginTop: 0,
                    marginBottom: "6px",
                    fontSize: "22px",
                  }}
                >
                  Customize Your Wedding Card
                </h2>

                <p
                  style={{
                    color: "#666",
                    marginBottom: "20px",
                  }}
                >
                  Enter your details and choose your preferred design.
                </p>

                {/* Bride */}
                <div style={{ marginBottom: "14px" }}>
                  <label
                    style={{
                      display: "block",
                      fontWeight: "600",
                      marginBottom: "6px",
                    }}
                  >
                    Bride Name
                  </label>

                  <input
                    type="text"
                    placeholder="Enter bride name"
                    value={brideName}
                    onChange={(e) => setBrideName(e.target.value)}
                    style={inputStyle}
                  />
                </div>

                {/* Groom */}
                <div style={{ marginBottom: "14px" }}>
                  <label
                    style={{
                      display: "block",
                      fontWeight: "600",
                      marginBottom: "6px",
                    }}
                  >
                    Groom Name
                  </label>

                  <input
                    type="text"
                    placeholder="Enter groom name"
                    value={groomName}
                    onChange={(e) => setGroomName(e.target.value)}
                    style={inputStyle}
                  />
                </div>

                {/* Date */}
                <div style={{ marginBottom: "14px" }}>
                  <label
                    style={{
                      display: "block",
                      fontWeight: "600",
                      marginBottom: "6px",
                    }}
                  >
                    Wedding Date
                  </label>

                  <input
                    type="date"
                    value={weddingDate}
                    onChange={(e) => setWeddingDate(e.target.value)}
                    style={inputStyle}
                  />
                </div>

                {/* Venue */}
                <div style={{ marginBottom: "20px" }}>
                  <label
                    style={{
                      display: "block",
                      fontWeight: "600",
                      marginBottom: "6px",
                    }}
                  >
                    Venue
                  </label>

                  <input
                    type="text"
                    placeholder="Enter wedding venue"
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    style={inputStyle}
                  />
                </div>

                {/* Designs */}
                <h3 style={{ marginBottom: "12px" }}>
                  Choose Your Design
                </h3>

                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    flexWrap: "wrap",
                  }}
                >
                  {[1, 2, 3].map((design) => (
                    <button
                      key={design}
                      type="button"
                      onClick={() => setSelectedDesign(design)}
                      style={{
                        padding: "10px 16px",
                        borderRadius: "8px",
                        border:
                          selectedDesign === design
                            ? "2px solid #ff5a00"
                            : "1px solid #ccc",
                        background:
                          selectedDesign === design
                            ? "#fff3eb"
                            : "#fff",
                        cursor: "pointer",
                        fontWeight: "600",
                      }}
                    >
                      Design {design}
                    </button>
                  ))}
                </div>

                {/* Live Preview */}
                <div style={{ marginTop: "25px" }}>
                  <h3>Live Preview</h3>

                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      maxWidth: "380px",
                      height: "230px",
                      margin: "0 auto",
                      overflow: "hidden",
                      borderRadius: "12px",
                      background: "#f5ead8",
                      border:
                        selectedDesign === 1
                          ? "5px solid #c89b3c"
                          : selectedDesign === 2
                          ? "5px solid #d89b9b"
                          : "5px solid #6d4c41",
                      boxShadow:
                        "0 8px 25px rgba(0,0,0,0.15)",
                    }}
                  >
                    <img
                      src={product.image}
                      alt="Wedding card preview"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        opacity: 0.32,
                      }}
                    />

                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center",
                        padding: "20px",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "14px",
                          fontWeight: "700",
                          letterSpacing: "2px",
                          marginBottom: "8px",
                        }}
                      >
                        WEDDING INVITATION
                      </div>

                      <div
                        style={{
                          fontSize: "24px",
                          fontWeight: "700",
                        }}
                      >
                        {groomName || "Groom"}{" "}
                        <span>♥</span>{" "}
                        {brideName || "Bride"}
                      </div>

                      <div
                        style={{
                          marginTop: "10px",
                          fontSize: "14px",
                        }}
                      >
                        {weddingDate
                          ? new Date(
                              weddingDate
                            ).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })
                          : "Wedding Date"}
                      </div>

                      <div
                        style={{
                          marginTop: "5px",
                          fontSize: "13px",
                        }}
                      >
                        {venue || "Wedding Venue"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Add Cart */}
            <button
              className="product-details-cart-button"
              onClick={handleAddToCart}
              style={{
                marginTop: "20px",
              }}
            >
              <ShoppingCart size={19} />

              {isWeddingCard
                ? "Customize & Add to Cart"
                : "Add to Cart"}
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

const inputStyle = {
  width: "100%",
  padding: "11px 12px",
  border: "1px solid #ccc",
  borderRadius: "8px",
  fontSize: "15px",
  boxSizing: "border-box",
  outline: "none",
};

export default ProductDetails;