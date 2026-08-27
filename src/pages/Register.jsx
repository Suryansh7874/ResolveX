import { useState } from "react";
import { Link } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
} from "lucide-react";

import { registerUser } from "../services/authService";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    // confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    // Check password
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      // Send data to backend
      const data = await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: "CITIZEN",
      });

      setMessage(
        data.message || "Registration successful"
      );

      // Clear form after successful registration
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

    } catch (err) {
      console.log("Registration error:", err);

      setError(
        err.response?.data?.message ||
          "Registration failed"
      );
    }
  };

  return (
    <main className="auth-page">

      <section className="register-card">

        {/* Icon */}
        <div className="auth-icon">
          <User size={22} />
        </div>

        {/* Heading */}
        <h1>Create Account</h1>

        <p className="auth-subtitle">
          Join ResolveX to report and track issues
          in your city.
        </p>

        <form onSubmit={handleSubmit}>

          {/* ================= NAME ================= */}

          <div className="form-group">

            <label>Full Name</label>

            <div className="input-wrapper">

              <User size={18} />

              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
              />

            </div>

          </div>


          {/* ================= EMAIL ================= */}

          <div className="form-group">

            <label>Email Address</label>

            <div className="input-wrapper">

              <Mail size={18} />

              <input
                type="email"
                name="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleChange}
                required
              />

            </div>

          </div>


          {/* ================= PASSWORD ================= */}

          <div className="form-group">

            <label>Password</label>

            <div className="input-wrapper">

              <Lock size={18} />

              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />

            </div>

          </div>


          {/* ================= CONFIRM PASSWORD ================= */}

          <div className="form-group">

            <label>Confirm Password</label>

            <div className="input-wrapper">

              <Lock size={18} />

              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />

            </div>

          </div>


          {/* ================= ERROR ================= */}

          {error && (
            <p className="form-error">
              {error}
            </p>
          )}


          {/* ================= SUCCESS ================= */}

          {message && (
            <p className="form-success">
              {message}
            </p>
          )}


          {/* ================= SUBMIT ================= */}

          <button
            type="submit"
            className="primary-btn"
          >
            Create Account
          </button>

        </form>


        {/* ================= DIVIDER ================= */}

        <div className="or-divider">
          <span>or</span>
        </div>


        {/* ================= LOGIN ================= */}

        <p className="auth-footer">

          Already have an account?{" "}

          <Link to="/login">
            Login
          </Link>

        </p>

      </section>

    </main>
  );
}

export default Register;