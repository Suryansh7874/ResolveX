import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  ShieldCheck,
  Sparkles,
  Layers3,
  Flag,
} from "lucide-react";

import api from "../services/api";
import monsoon from "../assets/monsoon.jpg";

function ChallengeDetails() {
  const { id } = useParams();

  const [challenge, setChallenge] = useState(null);
  const [locationName, setLocationName] = useState("Loading location...");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const res = await api.get(`/challenges/${id}`);

        console.log("CHALLENGE DETAILS:", res.data);

        const challengeData = res.data.challenge || res.data;

        console.log(
          "COMPLETE CHALLENGE:",
          JSON.stringify(challengeData, null, 2)
        );

        console.log(
          "CREATED AT:",
          challengeData.createdAt
        );

        console.log(
          "DOMAIN:",
          challengeData.domain
        );

        console.log(
          "AI ANALYSIS:",
          challengeData.aiAnalysis
        );

        console.log(
          "LOCATION DETAILS:",
          JSON.stringify(challengeData.location, null, 2)
        );

        setChallenge(challengeData);

        // -----------------------------------------
        // Reverse geocode location
        // -----------------------------------------

        const coordinates = challengeData.location?.coordinates;

        if (
          Array.isArray(coordinates) &&
          coordinates.length === 2
        ) {
          // GeoJSON format = [longitude, latitude]
          const longitude = coordinates[0];
          const latitude = coordinates[1];

          try {
            const locationResponse = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`,
              {
                headers: {
                  Accept: "application/json",
                },
              }
            );

            if (!locationResponse.ok) {
              throw new Error("Unable to fetch location");
            }

            const locationData =
              await locationResponse.json();

            console.log(
              "REVERSE GEOCODE RESPONSE:",
              locationData
            );

            const address = locationData.address || {};

            const city =
              address.city ||
              address.town ||
              address.village ||
              address.municipality ||
              address.county;

            const state = address.state;

            if (city && state) {
              setLocationName(`${city}, ${state}`);
            } else if (city) {
              setLocationName(city);
            } else if (state) {
              setLocationName(state);
            } else if (locationData.display_name) {
              setLocationName(locationData.display_name);
            } else {
              setLocationName("Location available");
            }
          } catch (locationError) {
            console.error(
              "Reverse geocoding failed:",
              locationError
            );

            setLocationName("Location available");
          }
        } else if (
          typeof challengeData.location === "string"
        ) {
          setLocationName(challengeData.location);
        } else {
          setLocationName("Location not available");
        }
      } catch (err) {
        console.error("Challenge fetch error:", err);

        setError(
          err.response?.data?.message ||
            "Unable to load challenge"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchChallenge();
  }, [id]);

  // -----------------------------------------
  // Loading
  // -----------------------------------------

  if (loading) {
    return (
      <>
        <style>{styles(monsoon)}</style>

        <div className="details-page">
          <div className="state-card">
            <div className="state-spinner" />
            <span>Loading challenge...</span>
          </div>
        </div>
      </>
    );
  }

  // -----------------------------------------
  // Error
  // -----------------------------------------

  if (error) {
    return (
      <>
        <style>{styles(monsoon)}</style>

        <div className="details-page">
          <div className="state-card error-state">
            <ShieldCheck size={22} />
            <span>{error}</span>
          </div>
        </div>
      </>
    );
  }

  // -----------------------------------------
  // No challenge
  // -----------------------------------------

  if (!challenge) {
    return (
      <>
        <style>{styles(monsoon)}</style>

        <div className="details-page">
          <div className="state-card">
            <ShieldCheck size={22} />
            <span>Challenge not found</span>
          </div>
        </div>
      </>
    );
  }

  const ai = challenge.aiAnalysis || {};
  const validation = challenge.validation || {};

  // -----------------------------------------
  // Format date
  // -----------------------------------------

  const formattedDate = challenge.createdAt
    ? new Date(challenge.createdAt).toLocaleDateString(
        "en-IN",
        {
          day: "numeric",
          month: "short",
          year: "numeric",
        }
      )
    : "Not available";

  // -----------------------------------------
  // Format arrays
  // -----------------------------------------

  const expertise =
    Array.isArray(ai.requiredExpertise)
      ? ai.requiredExpertise.join(", ")
      : ai.requiredExpertise || "Not available";

  const technologies =
    Array.isArray(ai.technologies)
      ? ai.technologies.join(", ")
      : ai.technologies || "Not available";

  return (
    <>
      <style>{styles(monsoon)}</style>

      <div className="details-page">
        <div className="details-container">

          {/* Back Button */}
          <Link
            to="/admin/challenges"
            className="back-btn"
          >
            <ArrowLeft size={18} />
            <span>Back to Challenges</span>
          </Link>

          {/* Header */}
          <div className="details-header">
            <div className="header-content">

              <span className="badge">
                <ShieldCheck size={15} />
                {challenge.status || "Pending"}
              </span>

              <h1>
                {challenge.title ||
                  "Untitled Challenge"}
              </h1>

              <p>
                {challenge.description ||
                  "No description available"}
              </p>

            </div>
          </div>

          {/* Information Cards */}
          <div className="info-grid">

            {/* Domain */}
            <div className="card info-card">

              <div className="icon-box blue-icon">
                <Layers3 size={20} />
              </div>

              <div className="info-card-content">

                <span className="card-label">
                  Domain
                </span>

                <p>
                  {challenge.domain ||
                    "Not available"}
                </p>

              </div>
            </div>

            {/* Priority */}
            <div className="card info-card">

              <div className="icon-box yellow-icon">
                <Flag size={20} />
              </div>

              <div className="info-card-content">

                <span className="card-label">
                  Priority
                </span>

                <p>
                  {challenge.priority ||
                    "MEDIUM"}
                </p>

              </div>
            </div>

            {/* Location */}
            <div className="card info-card">

              <div className="icon-box purple-icon">
                <MapPin size={20} />
              </div>

              <div className="info-card-content">

                <span className="card-label">
                  Location
                </span>

                <p className="location-text">
                  {locationName}
                </p>

              </div>
            </div>

            {/* Created */}
            <div className="card info-card">

              <div className="icon-box green-icon">
                <Calendar size={20} />
              </div>

              <div className="info-card-content">

                <span className="card-label">
                  Created
                </span>

                <p>
                  {formattedDate}
                </p>

              </div>
            </div>

          </div>

          {/* AI Analysis */}
          <div className="large-card">

            <div className="section-heading">

              <div className="section-icon spark-icon">
                <Sparkles size={19} />
              </div>

              <div>
                <h2>AI Analysis</h2>

                <p>
                  AI-generated insights for this challenge
                </p>
              </div>

            </div>

            <div className="analysis-grid">

              {/* Summary */}
              <div className="analysis-item">

                <span>Summary</span>

                <p>
                  {ai.summary ||
                    "Not available"}
                </p>

              </div>

              {/* Impact */}
              <div className="analysis-item">

                <span>Impact</span>

                <p>
                  {ai.impactLevel ||
                    "Not available"}
                </p>

              </div>

              {/* Expertise */}
              <div className="analysis-item">

                <span>Expertise Required</span>

                <p>
                  {expertise}
                </p>

              </div>

              {/* Technologies */}
              <div className="analysis-item">

                <span>Technologies</span>

                <p>
                  {technologies}
                </p>

              </div>

            </div>
          </div>

          {/* Challenge Information */}
          <div className="large-card remarks-card">

            <div className="section-heading">

              <div className="section-icon shield-icon">
                <ShieldCheck size={19} />
              </div>

              <div>

                <h2>
                  Challenge Information
                </h2>

                <p>
                  Government review and remarks
                </p>

              </div>

            </div>

            <div className="remarks-content">

              <span>
                Government Remarks
              </span>

              <p>
                {validation.validationNotes ||
                  "No remarks"}
              </p>

            </div>

          </div>

        </div>
      </div>
    </>
  );
}

function styles(monsoonBg) {
  return `
    @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');

    .details-page {
      min-height: 100vh;
      box-sizing: border-box;
      padding: 38px 5% 80px;
      color: #f8fafc;
      font-family: "Manrope", Arial, sans-serif;
      background:
        linear-gradient(
          135deg,
          rgba(5, 15, 27, 0.72),
          rgba(9, 24, 40, 0.82)
        ),
        url(${monsoonBg});
      background-size: cover;
      background-position: center;
      background-attachment: fixed;
    }

    .details-container {
      width: min(1180px, 100%);
      margin: 0 auto;
    }

    .back-btn {
      display: inline-flex;
      align-items: center;
      gap: 9px;
      width: fit-content;
      margin-bottom: 24px;
      padding: 10px 15px;
      color: #dbeafe;
      text-decoration: none;
      font-size: 13px;
      font-weight: 700;
      border: 1px solid rgba(255,255,255,.12);
      border-radius: 12px;
      background: rgba(255,255,255,.07);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      transition: .22s ease;
    }

    .back-btn:hover {
      transform: translateX(-2px);
      border-color: rgba(96,165,250,.42);
      background: rgba(255,255,255,.11);
      color: #ffffff;
    }

    .details-header,
    .card,
    .large-card {
      border: 1px solid rgba(255,255,255,.115);
      background:
        linear-gradient(
          145deg,
          rgba(255,255,255,.115),
          rgba(255,255,255,.045)
        );
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      box-shadow: 0 22px 60px rgba(0,0,0,.16);
    }

    .details-header {
      position: relative;
      overflow: hidden;
      padding: 32px 34px;
      border-radius: 20px;
      margin-bottom: 22px;
    }

    .details-header::after {
      content: "";
      position: absolute;
      width: 220px;
      height: 220px;
      right: -95px;
      top: -110px;
      border-radius: 50%;
      background: rgba(96,165,250,.10);
      border: 1px solid rgba(255,255,255,.07);
      box-shadow: 0 0 0 25px rgba(96,165,250,.035);
      pointer-events: none;
    }

    .header-content {
      position: relative;
      z-index: 1;
      max-width: 920px;
    }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      margin-bottom: 14px;
      padding: 7px 12px;
      border-radius: 999px;
      color: #dbeafe;
      background: rgba(96,165,250,.13);
      border: 1px solid rgba(96,165,250,.22);
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: .06em;
    }

    .details-header h1 {
      margin: 0 0 12px;
      font-size: clamp(28px, 4vw, 42px);
      line-height: 1.12;
      font-weight: 800;
      letter-spacing: -.03em;
      color: #f8fafc;
    }

    .details-header p {
      margin: 0;
      max-width: 900px;
      color: rgba(226,232,240,.78);
      font-size: 14px;
      line-height: 1.75;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 16px;
      margin-bottom: 22px;
    }

    .card {
      min-width: 0;
      border-radius: 17px;
    }

    .info-card {
      display: flex;
      align-items: flex-start;
      gap: 14px;
      min-height: 112px;
      padding: 18px;
      box-sizing: border-box;
    }

    .icon-box,
    .section-icon {
      flex: 0 0 auto;
      display: grid;
      place-items: center;
      border-radius: 13px;
      border: 1px solid rgba(255,255,255,.20);
      background: rgba(241,247,255,.92);
      color: #2563eb;
    }

    .icon-box {
      width: 46px;
      height: 46px;
    }

    .blue-icon {
      color: #2563eb;
    }

    .yellow-icon {
      color: #d97706;
    }

    .purple-icon {
      color: #7c3aed;
    }

    .green-icon {
      color: #059669;
    }

    .info-card-content {
      min-width: 0;
    }

    .card-label {
      display: block;
      margin: 2px 0 7px;
      color: rgba(226,232,240,.62);
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: .07em;
    }

    .info-card p {
      margin: 0;
      color: #f8fafc;
      font-size: 14px;
      line-height: 1.5;
      font-weight: 700;
      overflow-wrap: anywhere;
    }

    .location-text {
      color: #f8fafc;
    }

    .large-card {
      border-radius: 19px;
      padding: 26px 28px;
      margin-bottom: 22px;
    }

    .section-heading {
      display: flex;
      align-items: center;
      gap: 13px;
      margin-bottom: 23px;
      padding-bottom: 17px;
      border-bottom: 1px solid rgba(255,255,255,.10);
    }

    .section-icon {
      width: 43px;
      height: 43px;
    }

    .spark-icon {
      color: #7c3aed;
    }

    .shield-icon {
      color: #2563eb;
    }

    .section-heading h2 {
      margin: 0 0 4px;
      color: #f8fafc;
      font-size: 18px;
      line-height: 1.25;
      font-weight: 800;
    }

    .section-heading p {
      margin: 0;
      color: rgba(226,232,240,.60);
      font-size: 11px;
      line-height: 1.4;
    }

    .analysis-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 15px;
    }

    .analysis-item {
      min-width: 0;
      padding: 18px;
      border: 1px solid rgba(255,255,255,.09);
      border-radius: 15px;
      background: rgba(255,255,255,.045);
    }

    .analysis-item span,
    .remarks-content > span {
      display: block;
      margin-bottom: 8px;
      color: #bfdbfe;
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: .07em;
    }

    .analysis-item p,
    .remarks-content p {
      margin: 0;
      color: rgba(241,245,249,.86);
      font-size: 13px;
      line-height: 1.75;
      overflow-wrap: anywhere;
    }

    .remarks-content {
      padding: 18px;
      border: 1px solid rgba(255,255,255,.09);
      border-radius: 15px;
      background: rgba(255,255,255,.045);
    }

    .state-card {
      width: min(520px, 100%);
      margin: 18vh auto 0;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      padding: 24px;
      box-sizing: border-box;
      color: #f8fafc;
      font-size: 14px;
      font-weight: 700;
      text-align: center;
      border-radius: 17px;
      border: 1px solid rgba(255,255,255,.115);
      background:
        linear-gradient(
          145deg,
          rgba(255,255,255,.115),
          rgba(255,255,255,.045)
        );
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      box-shadow: 0 22px 60px rgba(0,0,0,.16);
    }

    .error-state {
      color: #fecaca;
    }

    .state-spinner {
      width: 17px;
      height: 17px;
      border-radius: 50%;
      border: 2px solid rgba(255,255,255,.22);
      border-top-color: #60a5fa;
      animation: challenge-spin .8s linear infinite;
    }

    @keyframes challenge-spin {
      to {
        transform: rotate(360deg);
      }
    }

    @media (max-width: 1000px) {
      .details-page {
        padding: 32px 25px 65px;
      }

      .info-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }

    @media (max-width: 700px) {
      .details-page {
        padding: 26px 16px 50px;
        background-attachment: scroll;
      }

      .details-header {
        padding: 25px 22px;
        border-radius: 17px;
      }

      .details-header h1 {
        font-size: 28px;
      }

      .details-header p {
        font-size: 13px;
      }

      .analysis-grid {
        grid-template-columns: 1fr;
      }

      .large-card {
        padding: 22px 19px;
      }
    }

    @media (max-width: 520px) {
      .info-grid {
        grid-template-columns: 1fr;
      }

      .back-btn {
        font-size: 12px;
      }

      .section-heading h2 {
        font-size: 16px;
      }

      .analysis-item,
      .remarks-content {
        padding: 15px;
      }
    }
  `;
}

export default ChallengeDetails;