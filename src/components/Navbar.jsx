import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../services/authService";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="brand">
        <div className="brand-icon">R</div>

        <div>
          <h2>ResolveX</h2>
          <span>Report • Track • Resolve</span>
        </div>
      </Link>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/about">About us</Link>
        <Link to="/how-it-works">How it Works</Link>
        <Link to="/contact">Contact</Link>

        {token ? (
          <>
            <Link to="/dashboard">Dashboard</Link>

            <button
              className="nav-logout"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="login-link">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;