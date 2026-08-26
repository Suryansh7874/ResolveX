import { useState } from "react";
import { Link } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  Lock,
} from "lucide-react";

import { registerUser } from "../services/authService";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
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

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const data = await registerUser({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });

      setMessage(
        data.message || "Registration successful"
      );

      setFormData({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Registration failed"
      );
    }
  };

  return (
    <main className="auth-page">
      <section className="register-card">

        <div className="auth-icon">
          <User size={22} />
        </div>

        <h1>Create Account</h1>

        <p className="auth-subtitle">
          Join ResolveX to report and track issues in your city.
        </p>

        <form onSubmit={handleSubmit}>

          {/* Name */}
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

          {/* Email */}
          <div className="form-group">
            <label>Email Address</label>

            <div className="input-wrapper">
              <Mail size={18} />

              <input
                type="email"
                name="email"
                placeholder="Enter your Email Address"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Phone */}
          <div className="form-group">
            <label>Phone Number</label>

            <div className="input-wrapper">
              <Phone size={18} />

              <input
                type="tel"
                name="phone"
                placeholder="Enter your Phone number"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="form-group">
            <label>Password</label>

            <div className="input-wrapper">
              <Lock size={18} />

              <input
                type="password"
                name="password"
                placeholder="Enter your Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label>Confirm Password</label>

            <div className="input-wrapper">
              <Lock size={18} />

              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm your Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {error && (
            <p className="form-error">
              {error}
            </p>
          )}

          {message && (
            <p className="form-success">
              {message}
            </p>
          )}

          <button
            type="submit"
            className="primary-btn"
          >
            Create Account
          </button>

        </form>

        <div className="or-divider">
          <span>or</span>
        </div>

        <p className="auth-footer">
          Already have an account?{" "}
          <Link to="/login">Login</Link>
        </p>

      </section>
    </main>
  );
}

export default Register;