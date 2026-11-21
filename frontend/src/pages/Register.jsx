import { useState } from "react";
import { Link } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

import { registerUser } from "../services/authService";
import monsoonBg from "../assets/monsoon.jpg";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
    setMessage("");
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
        password: formData.password,
        role: "CITIZEN",
      });

      setMessage(data.message || "Registration successful");

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
          "Registration failed. Please try again."
      );
    }
  };

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }

        .auth-page {
          min-height: 100vh;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          position: relative;
          overflow: hidden;

          background-image:
  linear-gradient(
    135deg,
    rgba(8, 18, 27, 0.82),
    rgba(14, 27, 38, 0.72),
    rgba(12, 31, 39, 0.78)
  ),
  url(${monsoonBg});

          background-size: cover;
          background-position: center;
          background-attachment: fixed;
        }

        /* Soft atmospheric glow */
        .auth-page::before {
          content: "";
          position: absolute;
          width: 500px;
          height: 500px;
          border-radius: 50%;
          background: rgba(77, 145, 170, 0.13);
          filter: blur(80px);
          top: -180px;
          left: -160px;
          pointer-events: none;
        }

        .auth-page::after {
          content: "";
          position: absolute;
          width: 420px;
          height: 420px;
          border-radius: 50%;
          background: rgba(52, 91,112, 0.20);
          filter: blur(90px);
          bottom: -180px;
          right: -120px;
          pointer-events: none;
        }

        .register-card {
          width: 100%;
          max-width: 500px;
          position: relative;
          z-index: 2;

          padding: 38px 40px 34px;

          border-radius: 28px;

          background: rgba(15, 24, 32, 0.78);
          border: 1px solid rgba(255, 255, 255, 0.16);

          backdrop-filter: blur(22px);
          -webkit-backdrop-filter: blur(22px);

          box-shadow:
            0 30px 80px rgba(0, 0, 0, 0.38),
            inset 0 1px 0 rgba(255, 255, 255, 0.12);

          color: #ffffff;

          animation: registerCardIn 0.65s ease-out;
        }

        @keyframes registerCardIn {
          from {
            opacity: 0;
            transform: translateY(24px) scale(0.98);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .auth-icon {
          width: 58px;
          height: 58px;
          margin: 0 auto 18px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 18px;

          color: #d8fff4;

          background:
            linear-gradient(
              145deg,
              rgba(81, 181, 154, 0.3),
              rgba(26, 99, 82, 0.55)
            );

          border: 1px solid rgba(160, 235, 214, 0.25);

          box-shadow:
            0 10px 30px rgba(0, 0, 0, 0.22),
            inset 0 1px 0 rgba(255, 255, 255, 0.12);
        }

        .register-card h1 {
          margin: 0;
          text-align: center;

          font-size: 31px;
          line-height: 1.2;
          font-weight: 750;
          letter-spacing: -0.7px;

          color: #ffffff;
        }

        .auth-subtitle {
          margin: 11px auto 29px;
          max-width: 390px;

          text-align: center;

          color: rgba(231, 248, 243, 0.76);

          font-size: 14px;
          line-height: 1.6;
        }

        form {
          width: 100%;
        }

        .form-group {
          margin-bottom: 18px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;

          color: rgba(239, 255, 250, 0.9);

          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.15px;
        }

        .input-wrapper {
          width: 100%;
          height: 52px;

          display: flex;
          align-items: center;

          padding: 0 15px;

          border-radius: 14px;

          background: rgba(255, 255, 255, 0.075);

          border: 1px solid rgba(255, 255, 255, 0.15);

          transition:
            border-color 0.2s ease,
            background 0.2s ease,
            box-shadow 0.2s ease,
            transform 0.2s ease;
        }

        .input-wrapper svg {
          flex-shrink: 0;
          color: rgba(178, 235, 219, 0.72);

          transition: color 0.2s ease;
        }

        .input-wrapper:focus-within {
          background: rgba(255, 255, 255, 0.105);

          border-color: rgba(120, 219, 190, 0.72);

          box-shadow:
            0 0 0 3px rgba(84, 188, 158, 0.12),
            0 8px 25px rgba(0, 0, 0, 0.12);

          transform: translateY(-1px);
        }

        .input-wrapper:focus-within svg {
          color: #9cebd2;
        }

        .input-wrapper input {
          width: 100%;
          height: 100%;

          margin-left: 11px;

          border: none;
          outline: none;

          background: transparent;

          color: #ffffff;

          font-size: 14px;
          font-family: inherit;
        }

        .input-wrapper input::placeholder {
          color: rgba(219, 241, 235, 0.43);
        }

        .input-wrapper input:-webkit-autofill,
        .input-wrapper input:-webkit-autofill:hover,
        .input-wrapper input:-webkit-autofill:focus {
          -webkit-text-fill-color: #ffffff;
          -webkit-box-shadow: 0 0 0 1000px rgba(20, 67, 57, 0.95) inset;
          transition: background-color 5000s ease-in-out 0s;
        }

        .password-wrapper {
          padding-right: 8px;
        }

        .password-toggle {
          width: 38px;
          height: 38px;

          display: flex;
          align-items: center;
          justify-content: center;

          border: none;
          border-radius: 10px;

          background: transparent;
          color: rgba(205, 239, 230, 0.65);

          cursor: pointer;

          transition:
            background 0.2s ease,
            color 0.2s ease;
        }

        .password-toggle:hover {
          background: rgba(255, 255, 255, 0.08);
          color: #b7f5e1;
        }

        .form-error,
        .form-success {
          margin: 8px 0 17px;
          padding: 11px 13px;

          border-radius: 11px;

          font-size: 13px;
          line-height: 1.45;
        }

        .form-error {
          color: #ffd9d9;
          background: rgba(180, 45, 45, 0.18);
          border: 1px solid rgba(255, 126, 126, 0.24);
        }

        .form-success {
          color: #d9ffef;
          background: rgba(45, 157, 119, 0.17);
          border: 1px solid rgba(111, 224, 188, 0.25);
        }

        .primary-btn {
          width: 100%;
          height: 53px;

          margin-top: 4px;

          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;

          border: none;
          border-radius: 14px;

          background:
            linear-gradient(
              135deg,
              #4b9a9b 0%,
              #347b85 50%,
              #285f6c 100%
            );

          color: #ffffff;

          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.15px;

          cursor: pointer;

          box-shadow:
            0 12px 28px rgba(21, 91, 72, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.18);

          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            filter 0.2s ease;
        }

        .primary-btn::after {
          content: "→";

          font-size: 18px;
          line-height: 1;

          transition: transform 0.2s ease;
        }

        .primary-btn:hover {
          transform: translateY(-2px);

          filter: brightness(1.08);

          box-shadow:
            0 17px 34px rgba(18, 89, 70, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }

        .primary-btn:hover::after {
          transform: translateX(4px);
        }

        .primary-btn:active {
          transform: translateY(0);
        }

        .or-divider {
          display: flex;
          align-items: center;
          gap: 13px;

          margin: 25px 0 20px;

          color: rgba(219, 241, 235, 0.45);

          font-size: 12px;
        }

        .or-divider::before,
        .or-divider::after {
          content: "";
          height: 1px;
          flex: 1;

          background:
            linear-gradient(
              90deg,
              transparent,
              rgba(255, 255, 255, 0.16)
            );
        }

        .or-divider::after {
          background:
            linear-gradient(
              90deg,
              rgba(255, 255, 255, 0.16),
              transparent
            );
        }

        .or-divider span {
          padding: 0 2px;
        }

        .auth-footer {
          margin: 0;

          text-align: center;

          color: rgba(225, 243, 238, 0.65);

          font-size: 13px;
        }

        .auth-footer a {
          margin-left: 4px;

          color: #9be5cf;

          font-weight: 700;
          text-decoration: none;

          transition:
            color 0.2s ease,
            text-shadow 0.2s ease;
        }

        .auth-footer a:hover {
          color: #c2f8e7;
          text-shadow: 0 0 14px rgba(126, 224, 193, 0.35);
        }

        /* Small security hint */
        .security-note {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;

          margin-top: 18px;

          color: rgba(211, 239, 232, 0.42);

          font-size: 11px;
        }

        .security-note svg {
          color: rgba(135, 218, 190, 0.65);
        }

        @media (max-width: 600px) {
          .auth-page {
            padding: 24px 15px;
          }

          .register-card {
            padding: 30px 23px 27px;
            border-radius: 23px;
          }

          .register-card h1 {
            font-size: 27px;
          }

          .auth-subtitle {
            font-size: 13px;
            margin-bottom: 24px;
          }

          .input-wrapper {
            height: 50px;
          }
        }

        @media (max-height: 750px) {
          .auth-page {
            align-items: flex-start;
            padding-top: 25px;
            padding-bottom: 25px;
          }

          .register-card {
            padding-top: 28px;
            padding-bottom: 25px;
          }

          .form-group {
            margin-bottom: 14px;
          }
        }
      `}</style>

      <div className="auth-page">
        <section className="register-card">

          {/* Icon */}
          <div className="auth-icon">
            <User size={24} strokeWidth={2} />
          </div>

          {/* Heading */}
          <h1>Create Account</h1>

          <p className="auth-subtitle">
            Join ResolveX and become part of a smarter,
            community-driven way to solve civic challenges.
          </p>

          <form onSubmit={handleSubmit}>

            {/* NAME */}
            <div className="form-group">
              <label htmlFor="name">Full Name</label>

              <div className="input-wrapper">
                <User size={18} />

                <input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* EMAIL */}
            <div className="form-group">
              <label htmlFor="email">Email Address</label>

              <div className="input-wrapper">
                <Mail size={18} />

                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="form-group">
              <label htmlFor="password">Password</label>

              <div className="input-wrapper password-wrapper">
                <Lock size={18} />

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword((prev) => !prev)
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="form-group">
              <label htmlFor="confirmPassword">
                Confirm Password
              </label>

              <div className="input-wrapper password-wrapper">
                <Lock size={18} />

                <input
                  id="confirmPassword"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowConfirmPassword((prev) => !prev)
                  }
                  aria-label={
                    showConfirmPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* ERROR */}
            {error && (
              <p className="form-error">
                {error}
              </p>
            )}

            {/* SUCCESS */}
            {message && (
              <p className="form-success">
                {message}
              </p>
            )}

            {/* SUBMIT */}
            <button
              type="submit"
              className="primary-btn"
            >
              Create Account
            </button>
          </form>

          {/* DIVIDER */}
          <div className="or-divider">
            <span>or</span>
          </div>

          {/* LOGIN */}
          <p className="auth-footer">
            Already have an account?{" "}
            <Link to="/login">
              Login
            </Link>
          </p>

          {/* Security */}
          <div className="security-note">
            <ShieldCheck size={13} />
            <span>Your account information is securely handled</span>
          </div>

        </section>
      </div>
    </>
  );
}

export default Register;

