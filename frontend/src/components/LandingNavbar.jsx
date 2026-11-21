import { Link } from "react-router-dom";

function LandingNavbar() {
  return (
    <nav className="landing-navbar">

      {/* Logo */}
      <Link to="/" className="landing-brand">
        <div className="landing-brand-icon">
          R
        </div>

        <div className="landing-brand-text">
          <h2>ResolveX</h2>
          <span>Report • Track • Resolve</span>
        </div>
      </Link>


      {/* Navigation Links */}
      <div className="landing-nav-links">
        <a href="#home">Home</a>
        <a href="#how-it-works">How It Works</a>
        <a href="#features">Features</a>
      </div>


      {/* Buttons */}
      <div className="landing-nav-buttons">
        <Link
          to="/login"
          className="landing-login-btn"
        >
          Login
        </Link>

        <Link
          to="/register"
          className="landing-start-btn"
        >
          Get Started
        </Link>
      </div>

    </nav>
  );
}

export default LandingNavbar;