import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  KeyRound,
  Eye,
  EyeOff,
  UserCircle,
} from "lucide-react";

import { loginUser } from "../services/authService";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const data = await loginUser(formData);


// Store login data
localStorage.setItem(
  "token",
  data.token
);

localStorage.setItem(
  "user",
  JSON.stringify(data.user)
);


const role = data.user.role;
      if (role === "CITIZEN") {
        navigate("/dashboard");
      } else if (role === "OFFICER") {
        navigate("/officer");
      } else if (role === "ADMIN") {
        navigate("/admin");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed"
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
            Welcome
            <span>Citizen!</span>
          </h1>

          <p>
            Report issue, track
            <br />
            progress and help
            <br />
            build a better city.
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

          <h2>USER LOGIN</h2>

          <p className="login-subtitle">
            Login to your account
          </p>

          <form onSubmit={handleSubmit}>

            {/* EMAIL */}
            <div className="login-field">
              <label>Email / Username</label>

              <div className="login-input-wrapper">
                <Mail size={22} />

                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            {/* PASSWORD */}
            <div className="login-field">
              <label>Password</label>

              <div className="login-input-wrapper">
                <KeyRound size={22} />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(!showPassword)
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

            {/* OPTIONS */}
            <div className="login-options">

              <label className="remember-me">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) =>
                    setRememberMe(e.target.checked)
                  }
                />

                <span>Remember me</span>
              </label>

              <button
                type="button"
                className="forgot-password"
              >
                Forgot Password?
              </button>

            </div>

            {/* ERROR */}
            {error && (
              <p className="login-error">
                {error}
              </p>
            )}

            {/* LOGIN */}
            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading ? "LOGGING IN..." : "LOGIN"}
            </button>

          </form>

          {/* DIVIDER */}
          <div className="continue-divider">
            <span>or continue with</span>
          </div>

          {/* GOOGLE */}
          <button
            type="button"
            className="google-button"
          >
            <span className="google-icon">G</span>
            <span>Continue with Google</span>
          </button>

          {/* SIGN UP */}
          <div className="signup-row">
            <span>Don't have an account?</span>

            <Link to="/register">
              Sign up
            </Link>
          </div>

        </div>
      </section>

    </main>
  );
}

export default Login;