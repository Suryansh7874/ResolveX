import LandingNavbar from "../components/LandingNavbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import HowItworks from "../components/HowItworks";
import CTA from "../components/CTA";
import Footer from "../components/Footer";

function LandingPage() {
  return (
    <>
    <LandingNavbar />
      <Hero />
      <Features />
      <HowItworks />
      <CTA />
      <Footer />
    </>
  );
}

export default LandingPage;