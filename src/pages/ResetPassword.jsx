import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  KeyRound,
  Eye,
  EyeOff,
  UserCircle,
} from "lucide-react";

import {
  verifyResetOTP,
  resetPassword,
} from "../services/authService";

function ResetPassword() {
  const navigate = useNavigate();

  const [email] = useState(
    sessionStorage.getItem("resetEmail") || ""
  );

  const [otp, setOtp] = useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [otpVerified, setOtpVerified] =
    useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // =========================
  // VERIFY OTP
  // =========================

  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await verifyResetOTP({
        email,
        otp,
      });

      setOtpVerified(true);

      setSuccess(
        "OTP verified successfully."
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Invalid or expired OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // RESET PASSWORD
  // =========================

  const handleResetPassword = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (newPassword.length < 8) {
      setError(
        "Password must be at least 8 characters long."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(
        "Passwords do not match."
      );
      return;
    }

    setLoading(true);

    try {
      await resetPassword({
        email,
        newPassword,
      });

      sessionStorage.removeItem(
        "resetEmail"
      );

      setSuccess(
        "Password reset successfully."
      );

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to reset password"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // NO EMAIL
  // =========================

  if (!email) {
    return (
      <main className="login-page">

        <section className="login-form-section">

          <div className="login-form-container">

            <div className="login-user-icon">
              <UserCircle size={52} />
            </div>

            <h2>RESET PASSWORD</h2>

            <p className="login-subtitle">
              Please start the password reset
              process again.
            </p>

            <Link
              to="/forgot-password"
              className="login-button"
              style={{
                display: "block",
                textAlign: "center",
                textDecoration: "none",
              }}
            >
              FORGOT PASSWORD
            </Link>

          </div>

        </section>

      </main>
    );
  }

  return (
    <main className="login-page">

      {/* LEFT SIDE */}
      <section className="login-welcome">

        <div className="welcome-content">

          <h1>
            Reset
            <span>Password</span>
          </h1>

          <p>
            Secure your account
            <br />
            with a new
            <br />
            password.
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
            <KeyRound size={52} />
          </div>

          <h2>
            {otpVerified
              ? "NEW PASSWORD"
              : "VERIFY OTP"}
          </h2>

          <p className="login-subtitle">
            {otpVerified
              ? "Create a new password"
              : `OTP sent to ${email}`}
          </p>

          {/* ========================= */}
          {/* OTP FORM */}
          {/* ========================= */}

          {!otpVerified && (

            <form onSubmit={handleVerifyOTP}>

              <div className="login-field">

                <label>OTP</label>

                <div className="login-input-wrapper">

                  <KeyRound size={22} />

                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) =>
                      setOtp(
                        e.target.value.replace(
                          /\D/g,
                          ""
                        )
                      )
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

              {success && (
                <p className="login-success">
                  {success}
                </p>
              )}

              <button
                type="submit"
                className="login-button"
                disabled={loading}
              >
                {loading
                  ? "VERIFYING..."
                  : "VERIFY OTP"}
              </button>

            </form>
          )}

          {/* ========================= */}
          {/* NEW PASSWORD FORM */}
          {/* ========================= */}

          {otpVerified && (

            <form onSubmit={handleResetPassword}>

              {/* NEW PASSWORD */}

              <div className="login-field">

                <label>New Password</label>

                <div className="login-input-wrapper">

                  <KeyRound size={22} />

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) =>
                      setNewPassword(
                        e.target.value
                      )
                    }
                    required
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>

                </div>

              </div>

              {/* CONFIRM PASSWORD */}

              <div className="login-field">

                <label>
                  Confirm Password
                </label>

                <div className="login-input-wrapper">

                  <KeyRound size={22} />

                  <input
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) =>
                      setConfirmPassword(
                        e.target.value
                      )
                    }
                    required
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>

                </div>

              </div>

              {error && (
                <p className="login-error">
                  {error}
                </p>
              )}

              {success && (
                <p className="login-success">
                  {success}
                </p>
              )}

              <button
                type="submit"
                className="login-button"
                disabled={loading}
              >
                {loading
                  ? "RESETTING..."
                  : "RESET PASSWORD"}
              </button>

            </form>
          )}

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

export default ResetPassword;

