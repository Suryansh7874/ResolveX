import React from "react";
import {
  ArrowLeft,
  ShieldCheck,
  Sparkles,
  Users,
  Building2,
  GraduationCap,
  Lightbulb,
  Target,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import monsoon from "../assets/monsoon.jpg";

function Aboutus() {
  return (
    <div className="about-page">
      {/* Background */}
      <div className="about-overlay"></div>

      <div className="about-container">
        {/* Back Button */}
        <Link to="/" className="back-button">
          <ArrowLeft size={18} />
          Back to Home
        </Link>

        {/* Hero Section */}
        <section className="about-hero">
          <div className="hero-badge">
            <Sparkles size={16} />
            Societal Innovation Collaboration Portal
          </div>

          <h1>
            Turning <span>Challenges</span> Into Solutions
          </h1>

          <p>
            ResolveX connects communities, government bodies, educational
            institutions, and industry partners to transform real-world
            challenges into meaningful and scalable solutions.
          </p>

          <div className="hero-actions">
            <Link to="/challenges" className="primary-btn">
              Explore Challenges
              <ArrowRight size={18} />
            </Link>

            <a href="#how-it-works" className="secondary-btn">
              How It Works
            </a>
          </div>
        </section>

        {/* Mission */}
        <section className="glass-section">
          <div className="section-heading">
            <div className="section-icon">
              <Target size={24} />
            </div>

            <div>
              <p className="section-label">OUR MISSION</p>
              <h2>Building a bridge between problems and solutions</h2>
            </div>
          </div>

          <p className="section-description">
            Many challenges faced by communities require collaboration between
            people who understand the problem and those who have the knowledge,
            technology, and resources to solve it. ResolveX provides a
            structured platform for bringing these stakeholders together.
          </p>

          <div className="mission-grid">
            <div className="mission-card">
              <Lightbulb size={25} />
              <h3>Identify</h3>
              <p>
                Capture real-world challenges along with evidence, location,
                context, and relevant information.
              </p>
            </div>

            <div className="mission-card">
              <Sparkles size={25} />
              <h3>Analyze</h3>
              <p>
                Use intelligent analysis to understand the challenge, its
                category, priority, expertise, and technology requirements.
              </p>
            </div>

            <div className="mission-card">
              <Users size={25} />
              <h3>Collaborate</h3>
              <p>
                Connect suitable educational institutions, faculty, students,
                government bodies, and industry partners.
              </p>
            </div>

            <div className="mission-card">
              <CheckCircle2 size={25} />
              <h3>Transform</h3>
              <p>
                Move promising ideas through proposals, development,
                validation, pilots, and implementation.
              </p>
            </div>
          </div>
        </section>

        {/* Stakeholders */}
        <section className="glass-section">
          <div className="section-heading">
            <div className="section-icon">
              <Users size={24} />
            </div>

            <div>
              <p className="section-label">THE ECOSYSTEM</p>
              <h2>One platform, multiple stakeholders</h2>
            </div>
          </div>

          <div className="stakeholder-grid">
            <div className="stakeholder-card">
              <div className="stakeholder-icon">
                <Users size={28} />
              </div>
              <h3>Citizens & Communities</h3>
              <p>
                Bring forward challenges and provide evidence, context, and
                local insights.
              </p>
            </div>

            <div className="stakeholder-card">
              <div className="stakeholder-icon">
                <Building2 size={28} />
              </div>
              <h3>Government Bodies</h3>
              <p>
                Validate challenges, provide administrative context, and help
                move suitable solutions toward implementation.
              </p>
            </div>

            <div className="stakeholder-card">
              <div className="stakeholder-icon">
                <GraduationCap size={28} />
              </div>
              <h3>Educational Institutions</h3>
              <p>
                Bring faculty expertise and student teams to work on relevant
                societal challenges.
              </p>
            </div>

            <div className="stakeholder-card">
              <div className="stakeholder-icon">
                <Lightbulb size={28} />
              </div>
              <h3>Industry & Innovation Partners</h3>
              <p>
                Support promising solutions with technology, expertise,
                resources, and collaboration opportunities.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="glass-section" id="how-it-works">
          <div className="section-heading">
            <div className="section-icon">
              <ShieldCheck size={24} />
            </div>

            <div>
              <p className="section-label">HOW RESOLVEX WORKS</p>
              <h2>From a challenge to meaningful action</h2>
            </div>
          </div>

          <div className="timeline">
            <div className="timeline-item">
              <div className="timeline-number">01</div>
              <div>
                <h3>Challenge Submission</h3>
                <p>
                  A citizen, community, PRI, ULB, or government stakeholder
                  submits a real-world challenge with supporting information.
                </p>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-number">02</div>
              <div>
                <h3>Intelligent Analysis</h3>
                <p>
                  The submitted challenge can be analyzed to identify relevant
                  categories, priority, expertise, technologies, and keywords.
                </p>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-number">03</div>
              <div>
                <h3>Government Validation</h3>
                <p>
                  Relevant government authorities review and validate the
                  challenge before it moves forward.
                </p>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-number">04</div>
              <div>
                <h3>HEI Matching</h3>
                <p>
                  Suitable higher educational institutions can be matched with
                  challenges according to relevant expertise and requirements.
                </p>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-number">05</div>
              <div>
                <h3>Team & Proposal</h3>
                <p>
                  Faculty and student teams can collaborate on proposals and
                  develop a structured approach to solving the challenge.
                </p>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-number">06</div>
              <div>
                <h3>Prototype to Implementation</h3>
                <p>
                  Selected solutions can progress through milestones such as
                  prototyping, piloting, validation, and deployment.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why ResolveX */}
        <section className="glass-section why-section">
          <div className="section-heading">
            <div className="section-icon">
              <Sparkles size={24} />
            </div>

            <div>
              <p className="section-label">WHY RESOLVEX</p>
              <h2>Creating a structured path for innovation</h2>
            </div>
          </div>

          <div className="why-grid">
            <div>
              <h3>Evidence-driven challenges</h3>
              <p>
                Challenges can be supported with location, documentation,
                descriptions, and other relevant evidence.
              </p>
            </div>

            <div>
              <h3>Cross-sector collaboration</h3>
              <p>
                ResolveX brings different stakeholders into a common
                collaboration workflow.
              </p>
            </div>

            <div>
              <h3>Structured progress</h3>
              <p>
                Projects can move through defined stages rather than remaining
                as isolated ideas or complaints.
              </p>
            </div>

            <div>
              <h3>Innovation with impact</h3>
              <p>
                The platform is designed to connect technical capabilities
                with challenges that matter to communities.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="about-cta">
          <div>
            <p className="section-label">READY TO EXPLORE?</p>
            <h2>Discover challenges that can become solutions.</h2>
            <p>
              Explore the challenges being brought forward and discover where
              collaboration can create meaningful impact.
            </p>
          </div>

          <Link to="/challenges" className="cta-button">
            View Challenges
            <ArrowRight size={18} />
          </Link>
        </section>

        {/* Footer */}
        <footer className="about-footer">
          <div>
            <strong>ResolveX</strong>
            <span> • Societal Innovation Collaboration Portal</span>
          </div>

          <p>
            Connecting challenges, knowledge, and innovation.
          </p>
        </footer>
      </div>

      <style>{`
        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        .about-page {
          min-height: 100vh;
          position: relative;
          overflow-x: hidden;
          background-image: url(${monsoon});
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
          font-family: "Manrope", sans-serif;
          color: #f8fafc;
        }

        .about-overlay {
          position: fixed;
          inset: 0;
          background:
            linear-gradient(
              135deg,
              rgba(7, 20, 29, 0.88),
              rgba(10, 31, 42, 0.76),
              rgba(7, 17, 25, 0.9)
            );
          z-index: 0;
          pointer-events: none;
        }

        .about-container {
          position: relative;
          z-index: 1;
          width: min(1180px, 92%);
          margin: 0 auto;
          padding: 28px 0 50px;
        }

        .back-button {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: rgba(255, 255, 255, 0.82);
          text-decoration: none;
          font-size: 14px;
          font-weight: 600;
          padding: 10px 15px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.07);
          border: 1px solid rgba(255, 255, 255, 0.13);
          backdrop-filter: blur(12px);
          transition: 0.25s ease;
        }

        .back-button:hover {
          background: rgba(255, 255, 255, 0.13);
          transform: translateX(-3px);
        }

        .about-hero {
          text-align: center;
          max-width: 900px;
          margin: 85px auto 100px;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 9px 16px;
          border-radius: 30px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(15px);
          color: #dceef4;
          font-size: 13px;
          font-weight: 700;
          margin-bottom: 25px;
        }

        .about-hero h1 {
          margin: 0;
          font-size: clamp(42px, 6vw, 72px);
          line-height: 1.04;
          letter-spacing: -2.5px;
          font-weight: 800;
        }

        .about-hero h1 span {
          background: linear-gradient(90deg, #b9f3ff, #74d8e8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .about-hero > p {
          max-width: 760px;
          margin: 28px auto 0;
          font-size: 17px;
          line-height: 1.8;
          color: rgba(235, 248, 251, 0.75);
        }

        .hero-actions {
          display: flex;
          justify-content: center;
          gap: 14px;
          margin-top: 34px;
          flex-wrap: wrap;
        }

        .primary-btn,
        .secondary-btn,
        .cta-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          text-decoration: none;
          border-radius: 13px;
          padding: 13px 20px;
          font-size: 14px;
          font-weight: 700;
          transition: 0.25s ease;
        }

        .primary-btn {
          background: rgba(176, 231, 241, 0.95);
          color: #09202a;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.18);
        }

        .primary-btn:hover {
          transform: translateY(-2px);
          background: #d4f6fb;
        }

        .secondary-btn {
          color: white;
          background: rgba(255, 255, 255, 0.07);
          border: 1px solid rgba(255, 255, 255, 0.16);
          backdrop-filter: blur(12px);
        }

        .secondary-btn:hover {
          background: rgba(255, 255, 255, 0.13);
        }

        .glass-section {
          margin-bottom: 28px;
          padding: 38px;
          border-radius: 25px;
          background: rgba(10, 29, 39, 0.55);
          border: 1px solid rgba(255, 255, 255, 0.12);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
          backdrop-filter: blur(18px);
        }

        .section-heading {
          display: flex;
          align-items: flex-start;
          gap: 17px;
          margin-bottom: 22px;
        }

        .section-icon {
          width: 48px;
          height: 48px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 14px;
          background: rgba(171, 229, 239, 0.11);
          border: 1px solid rgba(180, 235, 244, 0.18);
          color: #b9edf5;
        }

        .section-label {
          margin: 0 0 7px;
          color: #a9e8f1;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1.5px;
        }

        .section-heading h2 {
          margin: 0;
          font-size: 28px;
          line-height: 1.25;
          letter-spacing: -0.7px;
        }

        .section-description {
          max-width: 900px;
          color: rgba(235, 248, 251, 0.72);
          line-height: 1.8;
          margin: 0 0 30px 65px;
        }

        .mission-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 15px;
        }

        .mission-card {
          padding: 23px;
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.055);
          border: 1px solid rgba(255, 255, 255, 0.09);
          transition: 0.25s ease;
        }

        .mission-card:hover,
        .stakeholder-card:hover {
          transform: translateY(-4px);
          background: rgba(255, 255, 255, 0.085);
          border-color: rgba(180, 235, 244, 0.22);
        }

        .mission-card svg {
          color: #b7edf5;
          margin-bottom: 15px;
        }

        .mission-card h3,
        .stakeholder-card h3,
        .timeline-item h3,
        .why-grid h3 {
          margin: 0 0 9px;
          font-size: 16px;
        }

        .mission-card p,
        .stakeholder-card p,
        .timeline-item p,
        .why-grid p {
          margin: 0;
          color: rgba(235, 248, 251, 0.63);
          font-size: 13px;
          line-height: 1.7;
        }

        .stakeholder-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 15px;
        }

        .stakeholder-card {
          padding: 25px;
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.09);
          transition: 0.25s ease;
        }

        .stakeholder-icon {
          width: 52px;
          height: 52px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 15px;
          margin-bottom: 18px;
          background: rgba(171, 229, 239, 0.1);
          color: #b7edf5;
        }

        .timeline {
          margin-top: 30px;
          position: relative;
          display: grid;
          gap: 17px;
        }

        .timeline-item {
          display: flex;
          gap: 20px;
          padding: 21px;
          border-radius: 17px;
          background: rgba(255, 255, 255, 0.045);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .timeline-number {
          width: 43px;
          height: 43px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          background: rgba(176, 231, 241, 0.11);
          color: #b8edf5;
          font-size: 12px;
          font-weight: 800;
        }

        .why-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
          margin-top: 28px;
        }

        .why-grid > div {
          padding: 22px;
          border-left: 2px solid rgba(174, 231, 240, 0.35);
          background: rgba(255, 255, 255, 0.04);
          border-radius: 0 15px 15px 0;
        }

        .about-cta {
          margin-top: 40px;
          padding: 38px;
          border-radius: 25px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 30px;
          background: linear-gradient(
            120deg,
            rgba(117, 205, 220, 0.14),
            rgba(255, 255, 255, 0.055)
          );
          border: 1px solid rgba(181, 235, 243, 0.17);
          backdrop-filter: blur(18px);
        }

        .about-cta h2 {
          margin: 0 0 10px;
          font-size: 27px;
        }

        .about-cta p:last-child {
          margin: 0;
          color: rgba(235, 248, 251, 0.65);
          line-height: 1.7;
          max-width: 650px;
        }

        .cta-button {
          flex-shrink: 0;
          background: rgba(176, 231, 241, 0.95);
          color: #09202a;
        }

        .cta-button:hover {
          transform: translateY(-2px);
          background: #d4f6fb;
        }

        .about-footer {
          padding: 32px 5px 10px;
          display: flex;
          justify-content: space-between;
          gap: 20px;
          color: rgba(235, 248, 251, 0.55);
          font-size: 12px;
        }

        .about-footer strong {
          color: rgba(255, 255, 255, 0.88);
          font-size: 15px;
        }

        .about-footer p {
          margin: 0;
        }

        @media (max-width: 900px) {
          .mission-grid,
          .stakeholder-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .section-description {
            margin-left: 0;
          }

          .about-cta {
            flex-direction: column;
            align-items: flex-start;
          }
        }

        @media (max-width: 600px) {
          .about-container {
            width: 94%;
          }

          .about-hero {
            margin: 60px auto 70px;
          }

          .about-hero h1 {
            font-size: 42px;
          }

          .glass-section {
            padding: 24px;
          }

          .mission-grid,
          .stakeholder-grid,
          .why-grid {
            grid-template-columns: 1fr;
          }

          .section-heading h2 {
            font-size: 23px;
          }

          .about-cta {
            padding: 27px;
          }

          .about-cta h2 {
            font-size: 23px;
          }

          .about-footer {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}

export default Aboutus;

