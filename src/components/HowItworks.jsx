import {
  FilePlus2,
  SearchCheck,
  BadgeCheck,
} from "lucide-react";

function HowItworks() {
  const steps = [
    {
      number: "01",
      icon: <FilePlus2 size={30} />,
      title: "Report an Issue",
      description:
        "Describe the problem and submit your civic issue in just a few simple steps.",
    },
    {
      number: "02",
      icon: <SearchCheck size={30} />,
      title: "Track Progress",
      description:
        "Follow your report and receive updates as the issue moves forward.",
    },
    {
      number: "03",
      icon: <BadgeCheck size={30} />,
      title: "Issue Resolved",
      description:
        "Authorities take action and the issue is resolved for a better community.",
    },
  ];

  return (
    <section className="how-it-works" id="how-it-works">
      <div className="how-container">

        {/* HEADING */}
        <div className="how-heading">
          <p>HOW IT WORKS</p>

          <h2>
            From problem to
            <span> solution.</span>
          </h2>

          <div className="how-heading-line"></div>

          <p className="how-subtitle">
            ResolveX makes reporting and resolving civic issues
            simple, transparent, and efficient.
          </p>
        </div>


        {/* STEPS */}
        <div className="steps-grid">
          {steps.map((step, index) => (
            <div className="step-card" key={index}>

              <span className="step-number">
                {step.number}
              </span>

              <div className="step-icon">
                {step.icon}
              </div>

              <h3>{step.title}</h3>

              <p>{step.description}</p>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default HowItworks;