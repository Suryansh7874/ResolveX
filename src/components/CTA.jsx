import { Link } from "react-router-dom";
import { ArrowRight, Megaphone } from "lucide-react";

function CTA() {
  return (
    <section className="cta-section">
      <div className="cta-container">

        <div className="cta-icon">
          <Megaphone size={32} />
        </div>

        <div className="cta-content">
          <p className="cta-tag">YOUR VOICE MATTERS</p>

          <h2>
            See a problem?
            <span> Take action.</span>
          </h2>

          <p>
            Join ResolveX and help build cleaner, safer,
            and better communities.
          </p>
        </div>

        <Link
          to="/register"
          className="cta-button"
        >
          Report an Issue
          <ArrowRight size={18} />
        </Link>

      </div>
    </section>
  );
}

export default CTA;