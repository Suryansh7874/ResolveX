import React from "react";

const ChallengeDetails = () => {
  const challenge = {
    id: "RX-2026-001",
    title: "Reducing Plastic Waste in Urban Areas",
    domain: "Environment",
    status: "Under Review",
    submittedBy: "Citizen",
    submittedOn: "12 September 2026",
    location: "Prayagraj, Uttar Pradesh",

    description:
      "Urban areas are facing increasing challenges due to plastic waste. This challenge aims to identify practical and technology-driven solutions for reducing plastic waste, improving waste collection and encouraging sustainable practices.",

    subDomain: "Waste Management",
    priority: "High",
    impact: "High",
    innovation: "Medium",

    expertise: [
      "Artificial Intelligence",
      "IoT",
      "Environmental Science",
    ],

    technologies: ["AI/ML", "IoT", "Data Analytics"],
  };

  const progressSteps = [
    "Submitted",
    "AI Analysis",
    "Government Review",
    "HEI Matching",
    "Team Formation",
    "Project",
    "Prototype",
    "Pilot",
    "Validation",
  ];

  const cardStyle = {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    padding: "26px",
    marginBottom: "20px",
    border: "1px solid #e5e7eb",
    boxShadow: "0 4px 18px rgba(15, 23, 42, 0.05)",
  };

  const sectionTitleStyle = {
    fontSize: "19px",
    margin: "0 0 20px 0",
    color: "#111827",
    fontWeight: "700",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)",
        padding: "32px",
        fontFamily:
          "Inter, Arial, Helvetica, sans-serif",
        color: "#111827",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {/* Back Button */}
        <button
          onClick={() => window.history.back()}
          style={{
            background: "transparent",
            border: "none",
            color: "#2563eb",
            fontSize: "14px",
            fontWeight: "600",
            cursor: "pointer",
            padding: "6px 0",
            marginBottom: "18px",
          }}
        >
          ← Back to Challenges
        </button>

        {/* HERO HEADER */}
        <div
          style={{
            position: "relative",
            overflow: "hidden",
            background:
              "linear-gradient(135deg, #ffffff 0%, #f8fbff 100%)",
            borderRadius: "20px",
            padding: "32px",
            marginBottom: "22px",
            border: "1px solid #dbeafe",
            boxShadow:
              "0 10px 30px rgba(37, 99, 235, 0.08)",
          }}
        >
          {/* Decorative circle */}
          <div
            style={{
              position: "absolute",
              width: "180px",
              height: "180px",
              borderRadius: "50%",
              background:
                "rgba(37, 99, 235, 0.06)",
              right: "-60px",
              top: "-70px",
            }}
          />

          <div
            style={{
              position: "relative",
              zIndex: 1,
            }}
          >
            {/* Badges */}
            <div
              style={{
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
                marginBottom: "15px",
              }}
            >
              <span
                style={{
                  backgroundColor: "#dbeafe",
                  color: "#1d4ed8",
                  padding: "7px 13px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: "700",
                }}
              >
                {challenge.domain}
              </span>

              <span
                style={{
                  backgroundColor: "#fef3c7",
                  color: "#92400e",
                  padding: "7px 13px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: "700",
                }}
              >
                ● {challenge.status}
              </span>
            </div>

            <h1
              style={{
                fontSize: "32px",
                lineHeight: "1.2",
                margin: "0 0 12px 0",
                color: "#0f172a",
                maxWidth: "800px",
                fontWeight: "750",
              }}
            >
              {challenge.title}
            </h1>

            <p
              style={{
                margin: 0,
                color: "#64748b",
                fontSize: "14px",
              }}
            >
              Challenge ID{" "}
              <strong style={{ color: "#334155" }}>
                {challenge.id}
              </strong>
            </p>
          </div>
        </div>

        {/* BASIC INFORMATION */}
        <div style={cardStyle}>
          <h2 style={sectionTitleStyle}>
            Basic Information
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(210px, 1fr))",
              gap: "14px",
            }}
          >
            {[
              {
                icon: "👤",
                label: "Submitted By",
                value: challenge.submittedBy,
              },
              {
                icon: "📅",
                label: "Submitted On",
                value: challenge.submittedOn,
              },
              {
                icon: "📍",
                label: "Location",
                value: challenge.location,
              },
            ].map((item, index) => (
              <div
                key={index}
                style={{
                  padding: "17px",
                  backgroundColor: "#f8fafc",
                  borderRadius: "12px",
                  border: "1px solid #e5e7eb",
                }}
              >
                <div
                  style={{
                    fontSize: "19px",
                    marginBottom: "8px",
                  }}
                >
                  {item.icon}
                </div>

                <p
                  style={{
                    margin: "0 0 5px 0",
                    color: "#64748b",
                    fontSize: "12px",
                    fontWeight: "600",
                    textTransform: "uppercase",
                    letterSpacing: "0.4px",
                  }}
                >
                  {item.label}
                </p>

                <p
                  style={{
                    margin: 0,
                    color: "#1e293b",
                    fontSize: "14px",
                    fontWeight: "600",
                  }}
                >
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* DESCRIPTION */}
        <div style={cardStyle}>
          <h2 style={sectionTitleStyle}>
            Challenge Description
          </h2>

          <div
            style={{
              backgroundColor: "#f8fafc",
              borderLeft: "4px solid #2563eb",
              borderRadius: "8px",
              padding: "18px 20px",
            }}
          >
            <p
              style={{
                color: "#475569",
                lineHeight: "1.8",
                margin: 0,
                fontSize: "15px",
              }}
            >
              {challenge.description}
            </p>
          </div>
        </div>

        {/* AI ANALYSIS */}
        <div style={cardStyle}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            <h2
              style={{
                ...sectionTitleStyle,
                marginBottom: 0,
              }}
            >
              AI Analysis
            </h2>

            <span
              style={{
                backgroundColor: "#ecfdf5",
                color: "#047857",
                padding: "6px 11px",
                borderRadius: "20px",
                fontSize: "11px",
                fontWeight: "700",
              }}
            >
              ✓ AI ANALYZED
            </span>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "14px",
            }}
          >
            {[
              ["Domain", challenge.domain],
              ["Sub-domain", challenge.subDomain],
              ["Priority", challenge.priority],
              ["Impact", challenge.impact],
              [
                "Innovation Potential",
                challenge.innovation,
              ],
            ].map(([label, value], index) => (
              <div
                key={index}
                style={{
                  padding: "18px",
                  borderRadius: "12px",
                  background:
                    "linear-gradient(135deg, #f8fafc, #ffffff)",
                  border: "1px solid #e2e8f0",
                }}
              >
                <p
                  style={{
                    margin: "0 0 9px 0",
                    color: "#64748b",
                    fontSize: "12px",
                    fontWeight: "600",
                  }}
                >
                  {label}
                </p>

                <p
                  style={{
                    margin: 0,
                    color: "#0f172a",
                    fontSize: "15px",
                    fontWeight: "700",
                  }}
                >
                  {value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* EXPERTISE + TECHNOLOGIES */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "20px",
          }}
        >
          {/* Expertise */}
          <div style={cardStyle}>
            <h2 style={sectionTitleStyle}>
              Required Expertise
            </h2>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
              }}
            >
              {challenge.expertise.map(
                (item, index) => (
                  <span
                    key={index}
                    style={{
                      backgroundColor: "#eff6ff",
                      color: "#1d4ed8",
                      border:
                        "1px solid #dbeafe",
                      padding: "9px 13px",
                      borderRadius: "20px",
                      fontSize: "13px",
                      fontWeight: "600",
                    }}
                  >
                    {item}
                  </span>
                )
              )}
            </div>
          </div>

          {/* Technologies */}
          <div style={cardStyle}>
            <h2 style={sectionTitleStyle}>
              Suggested Technologies
            </h2>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
              }}
            >
              {challenge.technologies.map(
                (item, index) => (
                  <span
                    key={index}
                    style={{
                      backgroundColor: "#ecfdf5",
                      color: "#047857",
                      border:
                        "1px solid #d1fae5",
                      padding: "9px 13px",
                      borderRadius: "20px",
                      fontSize: "13px",
                      fontWeight: "600",
                    }}
                  >
                    {item}
                  </span>
                )
              )}
            </div>
          </div>
        </div>

        {/* SUPPORTING EVIDENCE */}
        <div style={cardStyle}>
          <h2 style={sectionTitleStyle}>
            Supporting Evidence
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "16px",
            }}
          >
            <div
              style={{
                border: "1px dashed #cbd5e1",
                borderRadius: "12px",
                padding: "30px",
                textAlign: "center",
                backgroundColor: "#f8fafc",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  margin: "0 auto 12px",
                  borderRadius: "12px",
                  backgroundColor: "#dbeafe",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "22px",
                }}
              >
                📷
              </div>

              <p
                style={{
                  margin: 0,
                  color: "#475569",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                Challenge Image
              </p>

              <p
                style={{
                  margin: "6px 0 0",
                  color: "#94a3b8",
                  fontSize: "12px",
                }}
              >
                Uploaded evidence
              </p>
            </div>

            <div
              style={{
                border: "1px dashed #cbd5e1",
                borderRadius: "12px",
                padding: "30px",
                textAlign: "center",
                backgroundColor: "#f8fafc",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  margin: "0 auto 12px",
                  borderRadius: "12px",
                  backgroundColor: "#dcfce7",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "22px",
                }}
              >
                📄
              </div>

              <p
                style={{
                  margin: 0,
                  color: "#475569",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                Supporting Document
              </p>

              <p
                style={{
                  margin: "6px 0 0",
                  color: "#94a3b8",
                  fontSize: "12px",
                }}
              >
                Additional evidence
              </p>
            </div>
          </div>
        </div>

        {/* PROGRESS */}
        <div
          style={{
            ...cardStyle,
            overflowX: "auto",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "30px",
            }}
          >
            <div>
              <h2
                style={{
                  ...sectionTitleStyle,
                  marginBottom: "5px",
                }}
              >
                Challenge Progress
              </h2>

              <p
                style={{
                  margin: 0,
                  color: "#64748b",
                  fontSize: "13px",
                }}
              >
                Current stage: Government Review
              </p>
            </div>

            <span
              style={{
                backgroundColor: "#eff6ff",
                color: "#1d4ed8",
                padding: "7px 12px",
                borderRadius: "20px",
                fontSize: "12px",
                fontWeight: "700",
              }}
            >
              Stage 3 of 9
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              minWidth: "950px",
              padding: "0 8px",
            }}
          >
            {progressSteps.map(
              (step, index) => (
                <React.Fragment key={index}>
                  {/* Step */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      minWidth: "78px",
                    }}
                  >
                    <div
                      style={{
                        width: "38px",
                        height: "38px",
                        borderRadius: "50%",
                        backgroundColor:
                          index <= 2
                            ? "#2563eb"
                            : "#e2e8f0",
                        color:
                          index <= 2
                            ? "#ffffff"
                            : "#64748b",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "13px",
                        fontWeight: "700",
                        boxShadow:
                          index <= 2
                            ? "0 4px 12px rgba(37, 99, 235, 0.25)"
                            : "none",
                        border:
                          index === 2
                            ? "4px solid #dbeafe"
                            : "none",
                      }}
                    >
                      {index < 2 ? "✓" : index + 1}
                    </div>

                    <span
                      style={{
                        marginTop: "10px",
                        fontSize: "11px",
                        color:
                          index <= 2
                            ? "#1d4ed8"
                            : "#64748b",
                        fontWeight:
                          index <= 2
                            ? "700"
                            : "500",
                        textAlign: "center",
                        lineHeight: "1.3",
                        maxWidth: "80px",
                      }}
                    >
                      {step}
                    </span>
                  </div>

                  {/* Connector */}
                  {index <
                    progressSteps.length - 1 && (
                    <div
                      style={{
                        height: "3px",
                        flex: 1,
                        minWidth: "35px",
                        marginTop: "17px",
                        borderRadius: "5px",
                        backgroundColor:
                          index < 2
                            ? "#2563eb"
                            : "#e2e8f0",
                      }}
                    />
                  )}
                </React.Fragment>
              )
            )}
          </div>
        </div>

        {/* WHAT HAPPENS NEXT */}
        <div
          style={{
            background:
              "linear-gradient(135deg, #eff6ff, #f8fbff)",
            border:
              "1px solid #bfdbfe",
            borderRadius: "16px",
            padding: "26px",
            marginBottom: "20px",
            boxShadow:
              "0 5px 20px rgba(37, 99, 235, 0.06)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "15px",
            }}
          >
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "12px",
                backgroundColor: "#dbeafe",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "20px",
                flexShrink: 0,
              }}
            >
              →
            </div>

            <div>
              <h2
                style={{
                  margin: "0 0 8px",
                  fontSize: "19px",
                  color: "#1e3a8a",
                }}
              >
                What Happens Next?
              </h2>

              <p
                style={{
                  margin: 0,
                  color: "#475569",
                  lineHeight: "1.7",
                  fontSize: "14px",
                }}
              >
                This challenge is currently under
                Government Review. Once validated,
                it will move to{" "}
                <strong>HEI Matching</strong>,
                where suitable institutions can be
                identified.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengeDetails;