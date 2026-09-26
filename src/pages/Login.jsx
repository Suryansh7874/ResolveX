import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  KeyRound,
  Eye,
  EyeOff,
  UserCircle,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Sparkles,
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
      console.log("LOGIN REQUEST:", formData.email);

      const data = await loginUser(formData);

      console.log("LOGIN RESPONSE:", data);

      // Make sure backend returned token and user
      if (!data?.token || !data?.user) {
        setError("Login response is missing user or token.");
        return;
      }

      // Store login data
      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      const role = data.user.role;

      console.log("LOGGED IN USER:", data.user);
      console.log("USER ROLE:", role);

      // Role-based navigation
      if (role === "CITIZEN") {
        navigate("/dashboard");
      } else if (role === "OFFICER") {
        navigate("/officer");
      } else if (role === "GOVERNMENT") {
        navigate("/admin");
      } else if (role === "HEI_ADMIN") {
        navigate("/hei");
      } else {
        setError(
          `Login successful, but role "${role}" is not configured.`
        );
      }

    } catch (err) {
      console.error("LOGIN ERROR:", err);

      console.error(
        "LOGIN ERROR RESPONSE:",
        err.response?.data
      );

      setError(
        err.response?.data?.message ||
        "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      
<style>{`
  * {
    box-sizing: border-box;
  }

  .login-page {
    min-height: 100vh;
    width: 100%;
    display: flex;
    position: relative;
    overflow: hidden;
    font-family: "Manrope", "Inter", sans-serif;
    background:
      linear-gradient(
        135deg,
        rgba(5, 20, 38, 0.97),
        rgba(8, 38, 61, 0.94)
      ),
      url("/monsoon.jpg");
    background-size: cover;
    background-position: center;
    color: #ffffff;
  }

  .login-page * {
    color: inherit;
  }

  .login-page::before {
    content: "";
    position: absolute;
    inset: 0;
    background:
      radial-gradient(
        circle at 15% 20%,
        rgba(52, 152, 219, 0.22),
        transparent 30%
      ),
      radial-gradient(
        circle at 85% 80%,
        rgba(0, 210, 190, 0.16),
        transparent 28%
      );
    pointer-events: none;
  }

  .login-page::after {
    content: "";
    position: absolute;
    width: 420px;
    height: 420px;
    right: -170px;
    top: -150px;
    border-radius: 50%;
    border: 1px solid rgba(255,255,255,0.08);
    box-shadow:
      0 0 0 50px rgba(255,255,255,0.025),
      0 0 0 100px rgba(255,255,255,0.018);
    pointer-events: none;
  }

  /* LEFT */

  .login-welcome {
    width: 50%;
    min-height: 100vh;
    padding: 70px 8%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: relative;
    z-index: 2;
    color: #ffffff;
  }

  .welcome-content {
    max-width: 600px;
    animation: loginFadeUp 0.8s ease;
  }

  .brand-pill {
    display: inline-flex;
    align-items: center;
    gap: 9px;
    padding: 9px 15px;
    margin-bottom: 28px;
    border-radius: 999px;
    background: rgba(255,255,255,0.09);
    border: 1px solid rgba(255,255,255,0.14);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    color: #e9fbff !important;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.5px;
  }

  .brand-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #62dfd0;
    box-shadow: 0 0 14px rgba(98,223,208,0.9);
  }

  .login-welcome h1 {
    margin: 0;
    font-size: clamp(48px, 5vw, 76px);
    line-height: 0.98;
    letter-spacing: -3px;
    font-weight: 800;
    color: #ffffff !important;
  }

  .login-welcome h1 span {
    display: block;
    margin-top: 8px;
    background: linear-gradient(
      90deg,
      #65dfd0,
      #7dbdff
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .welcome-description {
    margin-top: 28px;
    max-width: 480px;
    font-size: 17px;
    line-height: 1.8;
    color: #dbeaf5 !important;
  }

  .welcome-description strong {
    color: #ffffff !important;
    font-weight: 800;
  }

  /* FEATURE CARDS */

  .login-features {
    display: flex;
    gap: 13px;
    margin-top: 42px;
    flex-wrap: wrap;
  }

  .feature-card {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 15px;
    border-radius: 13px;
    background: rgba(255,255,255,0.075);
    border: 1px solid rgba(255,255,255,0.11);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    color: #eaf7ff !important;
    font-size: 12px;
    font-weight: 700;
  }

  .feature-icon {
    width: 29px;
    height: 29px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 9px;
    background: rgba(76,211,195,0.14);
    color: #69ded0 !important;
  }

  .login-grid {
    position: absolute;
    left: 7%;
    bottom: 8%;
    width: 240px;
    height: 130px;
    opacity: 0.25;
    background-image:
      linear-gradient(
        rgba(110,210,230,0.25) 1px,
        transparent 1px
      ),
      linear-gradient(
        90deg,
        rgba(110,210,230,0.25) 1px,
        transparent 1px
      );
    background-size: 24px 24px;
    mask-image: linear-gradient(
      to right,
      black,
      transparent
    );
    -webkit-mask-image: linear-gradient(
      to right,
      black,
      transparent
    );
  }

  /* RIGHT */

  .login-form-section {
    width: 50%;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 45px 7%;
    position: relative;
    z-index: 3;
    color: #ffffff;
  }

  .login-form-container {
    width: 100%;
    max-width: 475px;
    padding: 42px 42px 36px;
    border-radius: 28px;
    background: rgba(7, 25, 43, 0.82);
    border: 1px solid rgba(255,255,255,0.16);
    box-shadow:
      0 30px 80px rgba(0,0,0,0.42),
      inset 0 1px 0 rgba(255,255,255,0.08);
    backdrop-filter: blur(25px);
    -webkit-backdrop-filter: blur(25px);
    animation: loginFadeUp 0.8s ease 0.12s both;
    color: #ffffff;
  }

  .login-user-icon {
    width: 62px;
    height: 62px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 18px;
    margin-bottom: 20px;
    background: linear-gradient(
      135deg,
      rgba(82,216,199,0.18),
      rgba(91,151,255,0.18)
    );
    border: 1px solid rgba(111,226,214,0.22);
    color: #75e2d4 !important;
    box-shadow:
      0 10px 30px rgba(0,0,0,0.18);
  }

  .login-form-container h2 {
    margin: 0;
    font-size: 28px;
    letter-spacing: 1.5px;
    font-weight: 800;
    color: #ffffff !important;
  }

  .login-subtitle {
    margin: 8px 0 30px;
    color: #bcd0df !important;
    font-size: 14px;
  }

  /* FORM */

  .login-field {
    margin-bottom: 21px;
  }

  .login-field label {
    display: block;
    margin-bottom: 9px;
    color: #e8f3fa !important;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.3px;
  }

  .login-input-wrapper {
    min-height: 54px;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 0 15px;
    border-radius: 14px;
    background: rgba(255,255,255,0.075);
    border: 1px solid rgba(255,255,255,0.15);
    color: #b9d0df !important;
    transition:
      border-color 0.25s ease,
      background 0.25s ease,
      box-shadow 0.25s ease;
  }

  .login-input-wrapper:focus-within {
    background: rgba(255,255,255,0.09);
    border-color: #5ed8ca;
    box-shadow:
      0 0 0 4px rgba(91,211,201,0.09),
      0 8px 25px rgba(0,0,0,0.12);
  }

  .login-input-wrapper input {
    width: 100%;
    border: none;
    outline: none;
    background: transparent !important;
    color: #ffffff !important;
    caret-color: #67ded0;
    font-family: inherit;
    font-size: 14px;
  }

  .login-input-wrapper input:-webkit-autofill,
  .login-input-wrapper input:-webkit-autofill:hover,
  .login-input-wrapper input:-webkit-autofill:focus {
    -webkit-text-fill-color: #ffffff !important;
    -webkit-box-shadow: 0 0 0 1000px rgba(7,25,43,0.95) inset !important;
    transition: background-color 5000s ease-in-out 0s;
  }

  .login-input-wrapper input::placeholder {
    color: #8fa7b8 !important;
    opacity: 1;
  }

  .password-toggle {
    border: none;
    outline: none;
    background: transparent;
    color: #a9c1d0 !important;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    padding: 3px;
  }

  .password-toggle:hover {
    color: #6cddd0 !important;
  }

  /* OPTIONS */

  .login-options {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    margin: 4px 0 22px;
  }

  .remember-me {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    color: #b9cedc !important;
    font-size: 12px;
  }

  .remember-me span {
    color: #b9cedc !important;
  }

  .remember-me input {
    appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 5px;
    border: 1px solid rgba(255,255,255,0.25);
    background: rgba(255,255,255,0.08);
    cursor: pointer;
    position: relative;
  }

  .remember-me input:checked {
    background: #50cfc0;
    border-color: #50cfc0;
  }

  .remember-me input:checked::after {
    content: "✓";
    position: absolute;
    left: 3px;
    top: -1px;
    color: #082331 !important;
    font-size: 11px;
    font-weight: 900;
  }

  .forgot-password {
    color: #70dfd2 !important;
    font-size: 12px;
    font-weight: 700;
    text-decoration: none;
  }

  .forgot-password:hover {
    color: #a5eee6 !important;
  }

  /* ERROR */

  .login-error {
    margin: 0 0 16px;
    padding: 11px 13px;
    border-radius: 11px;
    border: 1px solid rgba(255,92,92,0.3);
    background: rgba(255,75,75,0.09);
    color: #ffaaaa !important;
    font-size: 12px;
    line-height: 1.5;
  }

  /* LOGIN BUTTON */

  .login-button {
    width: 100%;
    min-height: 54px;
    border: none;
    border-radius: 14px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 9px;
    background: linear-gradient(
      135deg,
      #51d4c4,
      #619fff
    );
    color: #062033 !important;
    font-family: inherit;
    font-size: 13px;
    font-weight: 900;
    letter-spacing: 1.2px;
    box-shadow:
      0 12px 28px rgba(68,178,188,0.24);
    transition:
      transform 0.2s ease,
      box-shadow 0.2s ease,
      filter 0.2s ease;
  }

  .login-button svg {
    color: #062033 !important;
  }

  .login-button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow:
      0 16px 35px rgba(68,178,188,0.32);
    filter: brightness(1.06);
  }

  .login-button:disabled {
    cursor: not-allowed;
    opacity: 0.65;
  }

  /* DIVIDER */

  .continue-divider {
    display: flex;
    align-items: center;
    gap: 13px;
    margin: 27px 0 19px;
    color: #829aaa !important;
    font-size: 11px;
  }

  .continue-divider span {
    color: #829aaa !important;
    white-space: nowrap;
  }

  .continue-divider::before,
  .continue-divider::after {
    content: "";
    height: 1px;
    flex: 1;
    background: rgba(255,255,255,0.12);
  }

  /* GOOGLE */

  .google-button {
    width: 100%;
    min-height: 50px;
    border: 1px solid rgba(255,255,255,0.15);
    border-radius: 13px;
    background: rgba(255,255,255,0.055);
    color: #e7f2f8 !important;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 11px;
    cursor: pointer;
    font-family: inherit;
    font-size: 13px;
    font-weight: 700;
    transition:
      background 0.2s ease,
      border-color 0.2s ease,
      transform 0.2s ease;
  }

  .google-button span:last-child {
    color: #e7f2f8 !important;
  }

  .google-button:hover {
    background: rgba(255,255,255,0.09);
    border-color: rgba(255,255,255,0.22);
    transform: translateY(-1px);
  }

  .google-icon {
    width: 25px;
    height: 25px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 7px;
    background: #ffffff;
    color: #4285f4 !important;
    font-weight: 900;
    font-size: 15px;
    font-family: Arial, sans-serif;
  }

  /* SIGN UP */

  .signup-row {
    margin-top: 25px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 6px;
    color: #9fb5c5 !important;
    font-size: 12px;
  }

  .signup-row span {
    color: #9fb5c5 !important;
  }

  .signup-row a {
    color: #70dfd2 !important;
    font-weight: 800;
    text-decoration: none;
  }

  .signup-row a:hover {
    color: #a5eee6 !important;
    text-decoration: underline;
  }

  /* ANIMATION */

  @keyframes loginFadeUp {
    from {
      opacity: 0;
      transform: translateY(18px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* RESPONSIVE */

  @media (max-width: 900px) {
    .login-page {
      flex-direction: column;
      overflow-y: auto;
    }

    .login-welcome {
      width: 100%;
      min-height: auto;
      padding: 55px 8% 25px;
    }

    .login-welcome h1 {
      font-size: 48px;
    }

    .welcome-description {
      font-size: 15px;
    }

    .login-features {
      margin-top: 25px;
    }

    .login-grid {
      display: none;
    }

    .login-form-section {
      width: 100%;
      min-height: auto;
      padding: 25px 8% 55px;
    }

    .login-form-container {
      max-width: 560px;
    }
  }

  @media (max-width: 520px) {
    .login-welcome {
      padding: 40px 22px 20px;
    }

    .login-welcome h1 {
      font-size: 42px;
      letter-spacing: -2px;
    }

    .welcome-description {
      margin-top: 20px;
      font-size: 14px;
    }

    .login-features {
      display: none;
    }

    .login-form-section {
      padding: 20px 18px 40px;
    }

    .login-form-container {
      padding: 30px 22px 27px;
      border-radius: 23px;
    }

    .login-form-container h2 {
      font-size: 24px;
    }

    .login-options {
      align-items: flex-start;
    }
  }
`}</style>



      <main className="login-page">

        {/* LEFT SIDE */}
        <section className="login-welcome">

          <div className="welcome-content">

            <div className="brand-pill">
              <span className="brand-dot"></span>
              RESOLVEX · CIVIC COLLABORATION
            </div>

            
<h1>
  Welcome to
  <span>ResolveX</span>
</h1>

<p className="welcome-description">
  One platform connecting
  <br />
  <strong>people, institutions & solutions.</strong>
  <br />
  Collaborate, track progress and turn
  civic challenges into real-world impact.
</p>



            <div className="login-features">

              <div className="feature-card">
                <span className="feature-icon">
                  <MapPin size={15} />
                </span>
                Report Challenges
              </div>

              <div className="feature-card">
                <span className="feature-icon">
                  <Sparkles size={15} />
                </span>
                AI-Powered
              </div>

              <div className="feature-card">
                <span className="feature-icon">
                  <ShieldCheck size={15} />
                </span>
                Verified Solutions
              </div>

            </div>

          </div>

          <div className="login-grid"></div>

        </section>

        {/* RIGHT SIDE */}
        <section className="login-form-section">

          <div className="login-form-container">

            <div className="login-user-icon">
              <UserCircle size={40} strokeWidth={1.7} />
            </div>

            <h2>USER LOGIN</h2>

            <p className="login-subtitle">
              Welcome back. Continue your ResolveX journey.
            </p>

            <form onSubmit={handleSubmit}>

              {/* EMAIL */}
              <div className="login-field">

                <label>Email / Username</label>

                <div className="login-input-wrapper">

                  <Mail size={19} />

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

                  <KeyRound size={19} />

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
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
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
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
                      setRememberMe(
                        e.target.checked
                      )
                    }
                  />

                  <span>
                    Remember me
                  </span>

                </label>

                <Link
                  to="/forgot-password"
                  className="forgot-password"
                >
                  Forgot Password?
                </Link>

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
                {loading
                  ? "LOGGING IN..."
                  : "LOGIN"}

                {!loading && (
                  <ArrowRight size={17} />
                )}
              </button>

            </form>

            {/* DIVIDER */}
            <div className="continue-divider">
              <span>
                or continue with
              </span>
            </div>

            {/* GOOGLE */}
            <button
              type="button"
              className="google-button"
            >
              <span className="google-icon">
                G
              </span>

              <span>
                Continue with Google
              </span>
            </button>

            {/* SIGN UP */}
            <div className="signup-row">

              <span>
                Don't have an account?
              </span>

              <Link to="/register">
                Sign up
              </Link>

            </div>

          </div>

        </section>

      </main>
    </>
  );
}

export default Login;

