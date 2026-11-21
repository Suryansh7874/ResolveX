import { Link } from "react-router-dom";
import { ArrowRight, MapPin } from "lucide-react";
import { Sprout } from 'lucide-react';
import monsoonBg from "../assets/monsoon.jpg";

function Hero() {
  return (
    <section
      className="hero"
      style={{
        backgroundImage: `url(${monsoonBg})`,
      }}
    >
      {/* DARK OVERLAY */}
      <div className="hero-overlay"></div>

      <div className="hero-container">

        {/* LEFT CONTENT */}
        <div className="hero-content">

          <p className="hero-tagline">
            A CLEANER. SAFER. STRONGER TOMORROW
          </p>

          <h1>
            Report Issues.
            <br />

            Track Progress.
            <br />

            <span>Build Better</span>
            <br />

            <span>Communities.</span>
          </h1>

          <p className="hero-description">
            ResolveX connects citizens and authorities to report,
            track, and resolve civic issues efficiently.
          </p>

          <div className="hero-buttons">

            <Link
              to="/login"
              className="hero-primary-btn"
            >
              Report an Issue
              <ArrowRight size={18} />
            </Link>

            <a
              href="#how-it-works"
              className="hero-secondary-btn"
            >
              Learn More
            </a>

          </div>

        </div>


        {/* RIGHT QUOTE CARD */}
        <div className="hero-quote-card">

          <div className="quote-icon">
            <Sprout size={38} />
          </div>

          <h2>
            "Small reports
            <br />
            make a big difference."
          </h2>

          <div className="quote-line"></div>

          <p>
            Cleaner cities begin with aware citizens
            and quick action.
          </p>

          <div className="quote-progress">
            <span className="progress-active"></span>
            <span></span>
            <span></span>
          </div>

        </div>

      </div>

    </section>
  );
}

export default Hero;