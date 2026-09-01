import { Link, useNavigate } from "react-router-dom";
import {
  UserPlus,
  User,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
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

    if (error) {
      setError("");
    }
  };

  // ===============================
  // REGISTER
  // ===============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    // Password confirmation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name.trim(),
            email: formData.email.trim(),
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Registration failed"
        );
      }

      alert("Account created successfully!");

      navigate("/login");
    } catch (error) {
      console.error(
        "Register Error:",
        error
      );

      setError(
        error.message ||
          "Unable to create account"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      {/* ===============================
          REGISTER CARD
      =============================== */}

      <div className="auth-card">

        {/* HEADER */}
        <div className="auth-header">

          <div className="auth-icon">
            <UserPlus size={26} />
          </div>

          <span className="auth-eyebrow">
            GET STARTED
          </span>

          <h1>
            Create Your Account
          </h1>

          <p>
            Join PrintCraft and start shopping
            your favorite products.
          </p>

        </div>

        {/* ERROR */}
        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        {/* ===============================
            REGISTER FORM
        =============================== */}

        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >

          {/* FULL NAME */}
          <div className="form-group">

            <label htmlFor="name">
              Full Name
            </label>

            <div className="auth-input-wrapper">

              <User
                size={18}
                className="auth-input-icon"
              />

              <input
                id="name"
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                autoComplete="name"
                required
              />

            </div>

          </div>

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
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
                minLength={6}
                required
              />

            </div>

            <small className="input-hint">
              Password must be at least 6 characters.
            </small>

          </div>

          {/* CONFIRM PASSWORD */}
          <div className="form-group">

            <label htmlFor="confirmPassword">
              Confirm Password
            </label>

            <div className="auth-input-wrapper">

              <Lock
                size={18}
                className="auth-input-icon"
              />

              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
                required
              />

            </div>

          </div>

          {/* REGISTER BUTTON */}
          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading ? (
              "Creating Account..."
            ) : (
              <>
                Create Account
                <ArrowRight size={18} />
              </>
            )}
          </button>

        </form>

        {/* SECURITY */}
        <div className="auth-security">

          <ShieldCheck size={17} />

          <span>
            Your account information is securely protected.
          </span>

        </div>

        {/* FOOTER */}
        <div className="auth-footer">

          <span>
            Already have an account?
          </span>

          <Link to="/login">
            Login
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Register;