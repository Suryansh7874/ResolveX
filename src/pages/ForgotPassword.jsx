import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, KeyRound, UserCircle } from "lucide-react";

import { forgotPassword } from "../services/authService";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await forgotPassword(email);

      // Store email temporarily for the OTP page
      sessionStorage.setItem("resetEmail", email);

      navigate("/reset-password");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to process password reset request"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">

      {/* LEFT SIDE */}
      <section className="login-welcome">
        <div className="welcome-content">
          <h1>
            Forgot
            <span>Password?</span>
          </h1>

          <p>
            Don't worry.
            <br />
            We'll help you
            <br />
            recover your account.
          </p>
        </div>

        <div className="city">

          <div className="building building-1">
            <div className="windows">
              <i></i>
              <i></i>
              <i></i>
              <i></i>
            </div>
          </div>

          <div className="building building-2">
            <div className="windows">
              <i></i>
              <i></i>
              <i></i>
              <i></i>
              <i></i>
              <i></i>
            </div>
          </div>

          <div className="building building-3">
            <div className="windows">
              <i></i>
              <i></i>
              <i></i>
              <i></i>
            </div>
          </div>

          <div className="building building-4">
            <div className="windows">
              <i></i>
              <i></i>
              <i></i>
              <i></i>
              <i></i>
            </div>
          </div>

          <div className="road"></div>

        </div>
      </section>

      {/* RIGHT SIDE */}
      <section className="login-form-section">
        <div className="login-form-container">

          <div className="login-user-icon">
            <UserCircle size={52} />
          </div>

          <h2>FORGOT PASSWORD</h2>

          <p className="login-subtitle">
            Enter your registered email
          </p>

          <form onSubmit={handleSubmit}>

            <div className="login-field">

              <label>Email</label>

              <div className="login-input-wrapper">

                <Mail size={22} />

                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  required
                />

              </div>

            </div>

            {error && (
              <p className="login-error">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading
                ? "SENDING OTP..."
                : "SEND OTP"}
            </button>

          </form>

          <div className="signup-row">
            <Link to="/login">
              ← Back to Login
            </Link>
          </div>

        </div>
      </section>

    </main>
  );
}

export default ForgotPassword;
