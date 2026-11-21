import {
  FilePlus2,
  MapPinned,
  BellRing,
  Users,
} from "lucide-react";

function Features() {
  const features = [
    {
      icon: <FilePlus2 size={28} />,
      title: "Report Issues Easily",
      description:
        "Report civic problems quickly with clear details and supporting information.",
    },
    {
      icon: <MapPinned size={28} />,
      title: "Track Progress",
      description:
        "Stay updated on your reported issues from submission to resolution.",
    },
    {
      icon: <BellRing size={28} />,
      title: "Get Updates",
      description:
        "Receive notifications when the status of your issue changes.",
    },
    {
      icon: <Users size={28} />,
      title: "Build Better Communities",
      description:
        "Connect citizens and authorities to make communities cleaner and safer.",
    },
  ];

  return (
    <section className="features" id="features">
      <div className="features-container">

        {/* HEADING */}
        <div className="features-heading">
          <p>WHY RESOLVEX?</p>

          <h2>
            Everything you need to
            <span> make a difference.</span>
          </h2>

          <div className="features-heading-line"></div>

          <p className="features-subtitle">
            A simple platform that helps citizens report problems
            and authorities resolve them efficiently.
          </p>
        </div>

        {/* FEATURE CARDS */}
        <div className="features-grid">
          {features.map((feature, index) => (
            <div className="feature-card" key={index}>

              <div className="feature-icon">
                {feature.icon}
              </div>

              <h3>{feature.title}</h3>

              <p>{feature.description}</p>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default Features;