import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ===============================
  // HANDLE INPUT CHANGE
  // ===============================
  const handleChange = (e) => {
    setFormData((current) => ({
      ...current,
      [e.target.name]: e.target.value,
    }));

    // Remove error when user starts typing
    if (error) {
      setError("");
    }
  };

  // ===============================
  // LOGIN
  // ===============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Login failed"
        );
      }

      // Save JWT token
      localStorage.setItem(
        "token",
        data.token
      );

      // Save user information
      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      alert("Login successful!");

      // Go to home page
      navigate("/");
    } catch (error) {
      console.error("Login Error:", error);

      setError(
        error.message || "Unable to login"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      {/* ===============================
          AUTH CARD
      =============================== */}

      <div className="auth-card">

        {/* HEADER */}
        <div className="auth-header">

          <div className="auth-icon">
            <User size={26} />
          </div>

          <span className="auth-eyebrow">
            WELCOME BACK
          </span>

          <h1>
            Login to PrintCraft
          </h1>

          <p>
            Access your account and manage
            your orders with ease.
          </p>

        </div>

        {/* ERROR */}
        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        {/* ===============================
            LOGIN FORM
        =============================== */}

        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >

          {/* EMAIL */}
          <div className="form-group">

            <label htmlFor="email">
              Email Address
            </label>

            <div className="auth-input-wrapper">

              <Mail
                size={18}
                className="auth-input-icon"
              />

              <input
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />

            </div>

          </div>

          {/* PASSWORD */}
          <div className="form-group">

            <label htmlFor="password">
              Password
            </label>

            <div className="auth-input-wrapper">

              <Lock
                size={18}
                className="auth-input-icon"
              />

              <input
                id="password"
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                required
              />

            </div>

          </div>

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading ? (
              "Logging in..."
            ) : (
              <>
                Login
                <ArrowRight size={18} />
              </>
            )}
          </button>

        </form>

        {/* SECURITY MESSAGE */}
        <div className="auth-security">

          <ShieldCheck size={17} />

          <span>
            Your account information is securely protected.
          </span>

        </div>

        {/* FOOTER */}
        <div className="auth-footer">

          <span>
            Don't have an account?
          </span>

          <Link to="/register">
            Create Account
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Login;