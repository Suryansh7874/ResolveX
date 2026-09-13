import { Link } from "react-router-dom";
import { MapPin, Mail } from "lucide-react";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* BRAND */}
        <div className="footer-brand">
          <div className="footer-logo">R</div>

          <h2>ResolveX</h2>

          <p>
            Empowering citizens to report, track,
            and resolve civic issues.
          </p>
        </div>


        {/* QUICK LINKS */}
        <div className="footer-links">
          <h3>Quick Links</h3>

          <Link to="/">Home</Link>
          <Link to="/about">About Us</Link>
          <a href="#how-it-works">How It Works</a>
          <Link to="/contact">Contact</Link>
        </div>


        {/* CONTACT */}
        <div className="footer-contact">
          <h3>Get in Touch</h3>

          <p>
            <MapPin size={16} />
            Building Better Communities
          </p>

          <p>
            <Mail size={16} />
            support@resolvex.in
          </p>
        </div>

      </div>


      {/* BOTTOM */}
      <div className="footer-bottom">
        <p>
          © 2026 ResolveX. Built for better communities.
        </p>
      </div>

    </footer>
  );
}

export default Footer;