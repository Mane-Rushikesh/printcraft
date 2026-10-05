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

  /* =========================
     CUSTOMIZATION STATES
  ========================= */

  const [design, setDesign] = useState(1);

  const [name, setName] = useState("");
  const [name2, setName2] = useState("");
  const [eventName, setEventName] = useState("");
  const [age, setAge] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [venue, setVenue] = useState("");
  const [message, setMessage] = useState("");

  /* =========================
     FETCH PRODUCT
  ========================= */

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

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

  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <div className="product-details-page product-loading">
        <div className="loading-spinner"></div>
        <p>Loading product...</p>
      </div>
    );
  }

  /* =========================
     ERROR
  ========================= */

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

  /* =========================
     PRODUCT TYPE
  ========================= */

  const category = (
    product.category ||
    ""
  ).toLowerCase();

  const productName = (
    product.name ||
    ""
  ).toLowerCase();

  const isWedding =
    category.includes("wedding") ||
    productName.includes("wedding");

  const isInvitation =
    category.includes("invitation") ||
    productName.includes("invitation");

  const isBirthday =
    category.includes("birthday") ||
    productName.includes("birthday");

  const isBabyShower =
    category.includes("baby") ||
    productName.includes("baby shower");

  const isParty =
    category.includes("party") ||
    productName.includes("party");

  const isCard =
    isWedding ||
    isInvitation ||
    isBirthday ||
    isBabyShower ||
    isParty ||
    category.includes("card");

  /* =========================
     CUSTOMIZATION TITLE
  ========================= */

  let customizationTitle = "Customize Your Product";

  if (isWedding) {
    customizationTitle = "Customize Your Wedding Card";
  } else if (isInvitation) {
    customizationTitle = "Customize Your Invitation Card";
  } else if (isBirthday) {
    customizationTitle = "Customize Your Birthday Card";
  } else if (isBabyShower) {
    customizationTitle = "Customize Your Baby Shower Card";
  } else if (isParty) {
    customizationTitle = "Customize Your Party Card";
  }

  /* =========================
     ADD TO CART
  ========================= */

  const handleAddToCart = () => {
    if (!isCard) {
      addToCart(product);
      return;
    }

    /* Wedding validation */

    if (isWedding) {
      if (!name.trim() || !name2.trim()) {
        alert("Please enter Bride Name and Groom Name.");
        return;
      }
    }

    /* Invitation / Party validation */

    if (isInvitation || isParty) {
      if (!eventName.trim()) {
        alert("Please enter the event name.");
        return;
      }
    }

    /* Birthday validation */

    if (isBirthday) {
      if (!name.trim()) {
        alert("Please enter the name.");
        return;
      }
    }

    /* Baby Shower validation */

    if (isBabyShower) {
      if (!name.trim()) {
        alert("Please enter the parents' names.");
        return;
      }
    }

    const customization = {
      design,

      name,
      name2,
      eventName,
      age,
      date,
      time,
      venue,
      message,
    };

    addToCart({
      ...product,
      customization,
    });

    alert("Your customized product has been added to cart!");
  };

  /* =========================
     DESIGN INFORMATION
  ========================= */

  const designStyles = {
    1: {
      background:
        "linear-gradient(135deg, #f8e7bd, #fff8e8)",
      border: "6px solid #c49a45",
      heading: "#7b5722",
      text: "#4f402b",
      label: "Royal Gold",
    },

    2: {
      background:
        "linear-gradient(135deg, #f7dfe5, #fff5f7)",
      border: "6px solid #d28b9b",
      heading: "#9b4961",
      text: "#65414b",
      label: "Floral Elegant",
    },

    3: {
      background:
        "linear-gradient(135deg, #dce8df, #f5faf6)",
      border: "6px solid #54745f",
      heading: "#345340",
      text: "#43564a",
      label: "Modern Green",
    },
  };

  const currentDesign = designStyles[design];

  /* =========================
     PREVIEW CONTENT
  ========================= */

  const getPreviewHeading = () => {
    if (isWedding) {
      return "WEDDING INVITATION";
    }

    if (isBirthday) {
      return "YOU'RE INVITED";
    }

    if (isBabyShower) {
      return "BABY SHOWER";
    }

    if (isParty) {
      return "LET'S CELEBRATE";
    }

    if (isInvitation) {
      return "YOU'RE INVITED";
    }

    return "PRINTCRAFT";
  };

  const getPreviewNames = () => {
    if (isWedding) {
      return (
        <>
          {name || "Bride"} <span>♥</span>{" "}
          {name2 || "Groom"}
        </>
      );
    }

    if (isBirthday) {
      return name || "Birthday Celebration";
    }

    if (isBabyShower) {
      return name || "Parents' Names";
    }

    if (isInvitation || isParty) {
      return eventName || "Your Event";
    }

    return product.name;
  };

  const getPreviewDate = () => {
    if (!date) return "Event Date";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );
  };

  /* =========================
     INPUT COMPONENT
  ========================= */

  const InputField = ({
    label,
    value,
    onChange,
    placeholder,
    type = "text",
  }) => {
    return (
      <div style={fieldWrapper}>
        <label style={labelStyle}>
          {label}
        </label>

        <input
          type={type}
          value={value}
          onChange={(e) =>
            onChange(e.target.value)
          }
          placeholder={placeholder}
          style={inputStyle}
        />
      </div>
    );
  };

  return (
    <main className="product-details-page">
      <div className="product-details-container">

        {/* =========================
            BACK
        ========================= */}

        <Link
          to="/"
          className="product-back-link"
        >
          <ArrowLeft size={17} />
          Back to Products
        </Link>

        {/* =========================
            MAIN PRODUCT
        ========================= */}

        <section className="product-details-main">

          {/* PRODUCT IMAGE */}

          <div className="product-details-image">
            <img
              src={product.image}
              alt={product.name}
            />
          </div>

          {/* PRODUCT INFO */}

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

            {/* =========================
                CUSTOMIZATION
            ========================= */}

            {isCard && (
              <div style={customizationBox}>

                <h2 style={customizationTitleStyle}>
                  {customizationTitle}
                </h2>

                <p style={helperText}>
                  Personalize your design before
                  adding it to your cart.
                </p>

                {/* WEDDING */}

                {isWedding && (
                  <>
                    <InputField
                      label="Bride Name"
                      value={name}
                      onChange={setName}
                      placeholder="Enter bride name"
                    />

                    <InputField
                      label="Groom Name"
                      value={name2}
                      onChange={setName2}
                      placeholder="Enter groom name"
                    />
                  </>
                )}

                {/* INVITATION / PARTY */}

                {(isInvitation || isParty) && (
                  <>
                    <InputField
                      label="Event Name"
                      value={eventName}
                      onChange={setEventName}
                      placeholder="Birthday Party, Engagement, Anniversary..."
                    />

                    <InputField
                      label="Host Name"
                      value={name}
                      onChange={setName}
                      placeholder="Enter host name"
                    />
                  </>
                )}

                {/* BIRTHDAY */}

                {isBirthday && (
                  <>
                    <InputField
                      label="Name"
                      value={name}
                      onChange={setName}
                      placeholder="Enter birthday person's name"
                    />

                    <InputField
                      label="Age"
                      value={age}
                      onChange={setAge}
                      placeholder="Enter age"
                      type="number"
                    />
                  </>
                )}

                {/* BABY SHOWER */}

                {isBabyShower && (
                  <>
                    <InputField
                      label="Parents' Names"
                      value={name}
                      onChange={setName}
                      placeholder="Enter parents' names"
                    />

                    <InputField
                      label="Baby Name (Optional)"
                      value={name2}
                      onChange={setName2}
                      placeholder="Enter baby name"
                    />
                  </>
                )}

                {/* COMMON DATE */}

                <InputField
                  label="Date"
                  value={date}
                  onChange={setDate}
                  type="date"
                />

                {/* COMMON TIME */}

                <InputField
                  label="Time"
                  value={time}
                  onChange={setTime}
                  placeholder="Example: 7:00 PM"
                />

                {/* COMMON VENUE */}

                <InputField
                  label="Venue"
                  value={venue}
                  onChange={setVenue}
                  placeholder="Enter venue"
                />

                {/* MESSAGE */}

                <div style={fieldWrapper}>
                  <label style={labelStyle}>
                    Message
                  </label>

                  <textarea
                    value={message}
                    onChange={(e) =>
                      setMessage(e.target.value)
                    }
                    placeholder="Enter your invitation message"
                    rows="3"
                    style={{
                      ...inputStyle,
                      resize: "vertical",
                    }}
                  />
                </div>

                {/* =========================
                    DESIGNS
                ========================= */}

                <h3 style={designHeading}>
                  Choose Your Design
                </h3>

                <div style={designGrid}>

                  {Object.entries(designStyles).map(
                    ([number, style]) => (
                      <button
                        key={number}
                        type="button"
                        onClick={() =>
                          setDesign(Number(number))
                        }
                        style={{
                          ...designButton,
                          border:
                            design === Number(number)
                              ? `3px solid ${style.heading}`
                              : "1px solid #ddd",
                          background:
                            design === Number(number)
                              ? "#fffaf5"
                              : "#fff",
                        }}
                      >

                        <div
                          style={{
                            ...miniDesign,
                            background:
                              style.background,
                            border: `3px solid ${style.heading}`,
                          }}
                        >
                          <span
                            style={{
                              color: style.heading,
                              fontWeight: "700",
                              fontSize: "11px",
                            }}
                          >
                            {style.label}
                          </span>
                        </div>

                        <span>
                          Design {number}
                        </span>
                      </button>
                    )
                  )}

                </div>

                {/* =========================
                    LIVE PREVIEW
                ========================= */}

                <div style={previewSection}>

                  <h3>
                    Live Preview
                  </h3>

                  <div
                    style={{
                      ...previewCard,
                      background:
                        currentDesign.background,
                      border:
                        currentDesign.border,
                    }}
                  >

                    <div style={previewOverlay}>

                      <div
                        style={{
                          ...previewSmallHeading,
                          color:
                            currentDesign.heading,
                        }}
                      >
                        {getPreviewHeading()}
                      </div>

                      <div
                        style={{
                          ...previewMainText,
                          color:
                            currentDesign.heading,
                        }}
                      >
                        {getPreviewNames()}
                      </div>

                      <div
                        style={{
                          ...previewText,
                          color:
                            currentDesign.text,
                        }}
                      >
                        {getPreviewDate()}
                      </div>

                      {time && (
                        <div
                          style={{
                            ...previewText,
                            color:
                              currentDesign.text,
                          }}
                        >
                          {time}
                        </div>
                      )}

                      <div
                        style={{
                          ...previewText,
                          color:
                            currentDesign.text,
                        }}
                      >
                        {venue || "Your Venue"}
                      </div>

                      {message && (
                        <div
                          style={{
                            marginTop: "10px",
                            fontSize: "12px",
                            color:
                              currentDesign.text,
                            maxWidth: "280px",
                          }}
                        >
                          {message}
                        </div>
                      )}

                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* =========================
                ADD TO CART
            ========================= */}

            <button
              className="product-details-cart-button"
              onClick={handleAddToCart}
              style={{
                marginTop: "20px",
              }}
            >
              <ShoppingCart size={19} />

              {isCard
                ? "Customize & Add to Cart"
                : "Add to Cart"}
            </button>

            {/* =========================
                FEATURES
            ========================= */}

            <div className="product-details-features">

              <div className="product-feature">
                <div className="product-feature-icon">
                  <CheckCircle size={20} />
                </div>

                <div>
                  <strong>
                    Premium Quality
                  </strong>

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
                  <strong>
                    Custom Design
                  </strong>

                  <span>
                    Personalized according to
                    your requirements
                  </span>
                </div>
              </div>

              <div className="product-feature">
                <div className="product-feature-icon">
                  <Truck size={20} />
                </div>

                <div>
                  <strong>
                    Fast Delivery
                  </strong>

                  <span>
                    Reliable delivery across India
                  </span>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* =========================
            BOTTOM BENEFITS
        ========================= */}

        <section className="product-details-benefits">

          <div className="benefit-item">

            <div className="benefit-icon">
              <ShieldCheck size={22} />
            </div>

            <div>
              <h3>
                Quality Guaranteed
              </h3>

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
              <h3>
                Reliable Delivery
              </h3>

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
              <h3>
                Made For You
              </h3>

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

/* =====================================================
   STYLES
===================================================== */

const customizationBox = {
  marginTop: "25px",
  padding: "22px",
  borderRadius: "18px",
  background: "#fafafa",
  border: "1px solid #e5e5e5",
};

const customizationTitleStyle = {
  marginTop: 0,
  marginBottom: "6px",
  fontSize: "23px",
};

const helperText = {
  color: "#666",
  marginBottom: "22px",
  fontSize: "14px",
};

const fieldWrapper = {
  marginBottom: "15px",
};

const labelStyle = {
  display: "block",
  fontWeight: "600",
  marginBottom: "6px",
  fontSize: "14px",
};

const inputStyle = {
  width: "100%",
  padding: "11px 12px",
  border: "1px solid #ccc",
  borderRadius: "8px",
  fontSize: "15px",
  boxSizing: "border-box",
  outline: "none",
  background: "#fff",
};

const designHeading = {
  marginTop: "24px",
  marginBottom: "12px",
};

const designGrid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(3, minmax(0, 1fr))",
  gap: "10px",
};

const designButton = {
  padding: "8px",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "600",
  textAlign: "center",
};

const miniDesign = {
  height: "75px",
  borderRadius: "6px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: "8px",
};

const previewSection = {
  marginTop: "28px",
};

const previewCard = {
  position: "relative",
  width: "100%",
  maxWidth: "420px",
  minHeight: "280px",
  margin: "15px auto 0",
  borderRadius: "16px",
  overflow: "hidden",
  boxShadow:
    "0 10px 30px rgba(0,0,0,0.15)",
  boxSizing: "border-box",
};

const previewOverlay = {
  minHeight: "280px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  padding: "25px",
  boxSizing: "border-box",
};

const previewSmallHeading = {
  fontSize: "13px",
  fontWeight: "700",
  letterSpacing: "2px",
  marginBottom: "12px",
};

const previewMainText = {
  fontSize: "26px",
  fontWeight: "700",
  marginBottom: "10px",
};

const previewText = {
  fontSize: "13px",
  marginTop: "3px",
};

export default ProductDetails;