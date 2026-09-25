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
  CheckCircle2,
  XCircle,
  Search,
  Building2,
  UserCheck,
  RefreshCw,
} from "lucide-react";

import api from "../services/api";
import monsoon from "../assets/monsoon.jpg";

function ChallengeDetails() {
  const { id } = useParams();

  const [challenge, setChallenge] = useState(null);
  const [locationName, setLocationName] = useState("Loading location...");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [actionLoading, setActionLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [actionError, setActionError] = useState("");

  const [showRejectBox, setShowRejectBox] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const [matches, setMatches] = useState([]);
  const [matchesLoading, setMatchesLoading] = useState(false);
  const [matchesLoaded, setMatchesLoaded] = useState(false);

  const [assigningHeiId, setAssigningHeiId] = useState(null);

  // =========================================================
  // FETCH CHALLENGE
  // =========================================================

  const fetchChallenge = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get(`/challenges/${id}`);

      console.log("CHALLENGE DETAILS:", res.data);

      const challengeData = res.data.challenge || res.data;

      console.log(
        "COMPLETE CHALLENGE:",
        JSON.stringify(challengeData, null, 2)
      );

      setChallenge(challengeData);

      // -------------------------------------------------------
      // Reverse geocode location
      // -------------------------------------------------------

      const coordinates = challengeData.location?.coordinates;

      if (
        Array.isArray(coordinates) &&
        coordinates.length === 2
      ) {
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

  useEffect(() => {
    fetchChallenge();
  }, [id]);

  // =========================================================
  // VALIDATE CHALLENGE
  // =========================================================

  const handleValidate = async () => {
    try {
      setActionLoading(true);
      setActionError("");
      setSuccessMessage("");

      const res = await api.patch(
        `/challenges/${id}/validate`,
        {
          isValidated: true,
          notes: "Challenge validated by Government.",
        }
      );

      console.log("VALIDATE RESPONSE:", res.data);

      setSuccessMessage(
        "Challenge validated successfully."
      );

      setChallenge(
        res.data.challenge || challenge
      );
    } catch (err) {
      console.error("Validate challenge error:", err);

      setActionError(
        err.response?.data?.message ||
          "Failed to validate challenge."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // =========================================================
  // REJECT CHALLENGE
  // =========================================================

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      setActionError(
        "Please enter a rejection reason."
      );
      return;
    }

    try {
      setActionLoading(true);
      setActionError("");
      setSuccessMessage("");

      const res = await api.patch(
        `/challenges/${id}/validate`,
        {
          isValidated: false,
          notes: rejectionReason.trim(),
          rejectionReason: rejectionReason.trim(),
        }
      );

      console.log("REJECT RESPONSE:", res.data);

      setSuccessMessage(
        "Challenge rejected successfully."
      );

      setChallenge(
        res.data.challenge || challenge
      );

      setShowRejectBox(false);
      setRejectionReason("");
    } catch (err) {
      console.error("Reject challenge error:", err);

      setActionError(
        err.response?.data?.message ||
          "Failed to reject challenge."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // =========================================================
  // FIND MATCHING HEIs
  // =========================================================

  const handleFindMatches = async () => {
    try {
      setMatchesLoading(true);
      setActionError("");
      setSuccessMessage("");

      const res = await api.get(
        `/challenges/${id}/matches`
      );

      console.log("HEI MATCHES:", res.data);

      setMatches(res.data.matches || []);
      setMatchesLoaded(true);

      if (!res.data.matches?.length) {
        setSuccessMessage(
          "No matching HEIs were found."
        );
      }
    } catch (err) {
      console.error(
        "Find HEI matches error:",
        err
      );

      setActionError(
        err.response?.data?.message ||
          "Failed to find matching HEIs."
      );
    } finally {
      setMatchesLoading(false);
    }
  };

  // =========================================================
  // ASSIGN HEI
  // =========================================================

  const handleAssignHEI = async (heiId) => {
    if (!heiId) return;

    try {
      setAssigningHeiId(heiId);
      setActionError("");
      setSuccessMessage("");

      const res = await api.patch(
        `/challenges/${id}/assign`,
        {
          heiId,
        }
      );

      console.log("ASSIGN HEI RESPONSE:", res.data);

      setSuccessMessage(
        "Challenge assigned to HEI successfully."
      );

      setChallenge(
        res.data.challenge || challenge
      );

      // Refresh challenge so the populated HEI
      // information is shown.
      await fetchChallenge();
    } catch (err) {
      console.error(
        "Assign challenge error:",
        err
      );

      setActionError(
        err.response?.data?.message ||
          "Failed to assign challenge to HEI."
      );
    } finally {
      setAssigningHeiId(null);
    }
  };

  // =========================================================
  // LOADING
  // =========================================================

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

  // =========================================================
  // ERROR
  // =========================================================

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
  const heiAcceptance =
    challenge.heiAcceptance || {};

  // =========================================================
  // FORMATTING
  // =========================================================

  const formattedDate = challenge.createdAt
    ? new Date(
        challenge.createdAt
      ).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Not available";

  const expertise =
    Array.isArray(ai.requiredExpertise)
      ? ai.requiredExpertise.join(", ")
      : ai.requiredExpertise ||
        "Not available";

  const technologies =
    Array.isArray(ai.technologies)
      ? ai.technologies.join(", ")
      : ai.technologies ||
        "Not available";

  const status =
    challenge.status || "SUBMITTED";

  const isSubmitted =
    status === "SUBMITTED";

  const isValidated =
    status === "VALIDATED";

  const isRejected =
    status === "REJECTED";

  const isMatched =
    status === "MATCHED";

  const isInProject =
    status === "IN_PROJECT";

  return (
    <>
      <style>{styles(monsoon)}</style>

      <div className="details-page">
        <div className="details-container">

          {/* Back Button */}
          <Link
            to="/admin"
            className="back-btn"
          >
            <ArrowLeft size={18} />
            <span>Back to Admin Dashboard</span>
          </Link>

          {/* Header */}
          <div className="details-header">
            <div className="header-content">

              <span className="badge">
                <ShieldCheck size={15} />
                {status}
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

          {/* Success */}
          {successMessage && (
            <div className="message success-message">
              <CheckCircle2 size={18} />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Error */}
          {actionError && (
            <div className="message error-message">
              <XCircle size={18} />
              <span>{actionError}</span>
            </div>
          )}

          {/* Information Cards */}
          <div className="info-grid">

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

            <div className="card info-card">
              <div className="icon-box green-icon">
                <Calendar size={20} />
              </div>

              <div className="info-card-content">
                <span className="card-label">
                  Created
                </span>

                <p>{formattedDate}</p>
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

              <div className="analysis-item">
                <span>Summary</span>

                <p>
                  {ai.summary ||
                    "Not available"}
                </p>
              </div>

              <div className="analysis-item">
                <span>Impact</span>

                <p>
                  {ai.impactLevel ||
                    "Not available"}
                </p>
              </div>

              <div className="analysis-item">
                <span>Expertise Required</span>

                <p>{expertise}</p>
              </div>

              <div className="analysis-item">
                <span>Technologies</span>

                <p>{technologies}</p>
              </div>

            </div>
          </div>

          {/* GOVERNMENT REVIEW */}
          <div className="large-card">

            <div className="section-heading">

              <div className="section-icon shield-icon">
                <ShieldCheck size={19} />
              </div>

              <div>
                <h2>Government Review</h2>

                <p>
                  Validate or reject this societal challenge
                </p>
              </div>

            </div>

            <div className="review-status">
              <div>
                <span className="card-label">
                  Current Status
                </span>

                <strong className={`status-${status.toLowerCase()}`}>
                  {status}
                </strong>
              </div>

              {validation.validationNotes && (
                <div>
                  <span className="card-label">
                    Government Remarks
                  </span>

                  <p>
                    {validation.validationNotes}
                  </p>
                </div>
              )}

              {validation.rejectionReason && (
                <div>
                  <span className="card-label">
                    Rejection Reason
                  </span>

                  <p>
                    {validation.rejectionReason}
                  </p>
                </div>
              )}
            </div>

            {/* Only allow decision on submitted challenges */}
            {isSubmitted && (
              <div className="action-area">

                <button
                  className="action-btn validate-btn"
                  onClick={handleValidate}
                  disabled={actionLoading}
                >
                  <CheckCircle2 size={18} />

                  {actionLoading
                    ? "Processing..."
                    : "Validate Challenge"}
                </button>

                <button
                  className="action-btn reject-btn"
                  onClick={() =>
                    setShowRejectBox(
                      !showRejectBox
                    )
                  }
                  disabled={actionLoading}
                >
                  <XCircle size={18} />
                  Reject Challenge
                </button>

              </div>
            )}

            {showRejectBox && isSubmitted && (
              <div className="reject-box">

                <label>
                  Rejection Reason
                </label>

                <textarea
                  value={rejectionReason}
                  onChange={(e) =>
                    setRejectionReason(
                      e.target.value
                    )
                  }
                  placeholder="Enter the reason for rejecting this challenge..."
                  rows={4}
                />

                <div className="reject-actions">

                  <button
                    className="secondary-btn"
                    onClick={() => {
                      setShowRejectBox(false);
                      setRejectionReason("");
                    }}
                  >
                    Cancel
                  </button>

                  <button
                    className="action-btn reject-btn"
                    onClick={handleReject}
                    disabled={actionLoading}
                  >
                    <XCircle size={17} />

                    {actionLoading
                      ? "Rejecting..."
                      : "Confirm Rejection"}
                  </button>

                </div>

              </div>
            )}

            {isRejected && (
              <div className="decision-box rejected-box">
                <XCircle size={20} />

                <div>
                  <strong>
                    This challenge has been rejected.
                  </strong>

                  <p>
                    {validation.rejectionReason ||
                      "No rejection reason provided."}
                  </p>
                </div>
              </div>
            )}

            {isValidated && (
              <div className="decision-box validated-box">
                <CheckCircle2 size={20} />

                <div>
                  <strong>
                    Challenge validated.
                  </strong>

                  <p>
                    You can now find matching HEIs
                    and assign the challenge.
                  </p>
                </div>
              </div>
            )}

          </div>

          {/* HEI MATCHING */}
          {(isValidated ||
            isMatched ||
            isInProject) && (
            <div className="large-card">

              <div className="section-heading">

                <div className="section-icon hei-icon">
                  <Building2 size={19} />
                </div>

                <div>
                  <h2>HEI Matching</h2>

                  <p>
                    Find institutions that match the
                    challenge requirements
                  </p>
                </div>

              </div>

              {/* Assigned HEI */}
              {challenge.assignedHEI && (
                <div className="assigned-box">

                  <div className="assigned-icon">
                    <UserCheck size={21} />
                  </div>

                  <div className="assigned-info">
                    <span className="card-label">
                      Assigned HEI
                    </span>

                    <strong>
                      {challenge.assignedHEI.name ||
                        "Assigned HEI"}
                    </strong>

                    {challenge.assignedHEI.type && (
                      <p>
                        {challenge.assignedHEI.type}
                      </p>
                    )}
                  </div>

                  <div className="assignment-status">
                    <span className="card-label">
                      HEI Response
                    </span>

                    <strong>
                      {heiAcceptance.status ||
                        "PENDING"}
                    </strong>
                  </div>

                </div>
              )}

              {/* HEI Response */}
              {isMatched &&
                heiAcceptance.status ===
                  "REJECTED" && (
                  <div className="decision-box rejected-box">

                    <XCircle size={20} />

                    <div>
                      <strong>
                        HEI rejected the assignment
                      </strong>

                      <p>
                        {heiAcceptance.remarks ||
                          "No remarks provided."}
                      </p>

                      <small>
                        You can assign this challenge
                        to another HEI.
                      </small>
                    </div>

                  </div>
                )}

              {isMatched &&
                heiAcceptance.status ===
                  "PENDING" && (
                  <div className="decision-box pending-box">

                    <RefreshCw size={19} />

                    <div>
                      <strong>
                        Waiting for HEI response
                      </strong>

                      <p>
                        The assigned HEI has not
                        responded yet.
                      </p>
                    </div>

                  </div>
                )}

              {isInProject &&
                heiAcceptance.status ===
                  "ACCEPTED" && (
                  <div className="decision-box validated-box">

                    <CheckCircle2 size={20} />

                    <div>
                      <strong>
                        HEI accepted the challenge
                      </strong>

                      <p>
                        This challenge has entered
                        the project stage.
                      </p>

                      {heiAcceptance.remarks && (
                        <small>
                          Remarks:{" "}
                          {heiAcceptance.remarks}
                        </small>
                      )}
                    </div>

                  </div>
                )}

              {/* Find matches button */}
              {!challenge.assignedHEI && (
                <button
                  className="match-btn"
                  onClick={handleFindMatches}
                  disabled={matchesLoading}
                >
                  <Search size={18} />

                  {matchesLoading
                    ? "Finding Matching HEIs..."
                    : matchesLoaded
                    ? "Refresh HEI Matches"
                    : "Find Matching HEIs"}
                </button>
              )}

              {/* Matches */}
              {matchesLoaded && (
                <div className="matches-container">

                  <div className="matches-heading">
                    <h3>
                      Matching HEIs
                    </h3>

                    <span>
                      {matches.length} found
                    </span>
                  </div>

                  {matches.length === 0 ? (
                    <div className="empty-matches">
                      No matching HEIs found.
                    </div>
                  ) : (
                    <div className="matches-list">

                      {matches.map(
                        (match, index) => {

                          const hei =
                            match.hei || {};

                          return (
                            <div
                              className="match-card"
                              key={
                                hei._id ||
                                hei.id ||
                                index
                              }
                            >

                              <div className="match-main">

                                <div className="match-icon">
                                  <Building2 size={21} />
                                </div>

                                <div>
                                  <h3>
                                    {hei.name ||
                                      "Unnamed HEI"}
                                  </h3>

                                  {hei.type && (
                                    <p>
                                      {hei.type}
                                    </p>
                                  )}
                                </div>

                              </div>

                              <div className="score-box">

                                <span>
                                  Match Score
                                </span>

                                <strong>
                                  {match.score ??
                                    "N/A"}
                                </strong>

                              </div>

                              <div className="match-details">

                                {Array.isArray(
                                  match.expertiseMatches
                                ) &&
                                  match.expertiseMatches
                                    .length > 0 && (
                                    <div>
                                      <span>
                                        Expertise Match
                                      </span>

                                      <p>
                                        {match
                                          .expertiseMatches
                                          .join(", ")}
                                      </p>
                                    </div>
                                  )}

                                {Array.isArray(
                                  match.technologyMatches
                                ) &&
                                  match
                                    .technologyMatches
                                    .length > 0 && (
                                    <div>
                                      <span>
                                        Technology Match
                                      </span>

                                      <p>
                                        {match
                                          .technologyMatches
                                          .join(", ")}
                                      </p>
                                    </div>
                                  )}

                              </div>

                              <button
                                className="assign-btn"
                                onClick={() =>
                                  handleAssignHEI(
                                    hei._id ||
                                      hei.id
                                  )
                                }
                                disabled={
                                  !(
                                    hei._id ||
                                    hei.id
                                  ) ||
                                  assigningHeiId ===
                                    (hei._id ||
                                      hei.id)
                                }
                              >
                                <UserCheck
                                  size={17}
                                />

                                {assigningHeiId ===
                                (hei._id ||
                                  hei.id)
                                  ? "Assigning..."
                                  : "Assign HEI"}
                              </button>

                            </div>
                          );
                        }
                      )}

                    </div>
                  )}

                </div>
              )}

            </div>
          )}

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
                  Government review and assignment details
                </p>
              </div>

            </div>

            <div className="remarks-grid">

              <div className="remarks-content">
                <span>
                  Government Remarks
                </span>

                <p>
                  {validation.validationNotes ||
                    "No remarks"}
                </p>
              </div>

              <div className="remarks-content">
                <span>
                  HEI Response
                </span>

                <p>
                  {heiAcceptance.remarks ||
                    "No HEI response yet"}
                </p>
              </div>

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

    .message {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 14px 16px;
      margin-bottom: 20px;
      border-radius: 13px;
      font-size: 13px;
      font-weight: 700;
      backdrop-filter: blur(14px);
    }

    .success-message {
      color: #bbf7d0;
      background: rgba(34,197,94,.12);
      border: 1px solid rgba(34,197,94,.25);
    }

    .error-message {
      color: #fecaca;
      background: rgba(239,68,68,.12);
      border: 1px solid rgba(239,68,68,.25);
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

    .hei-icon {
      color: #059669;
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

    .review-status {
      display: grid;
      grid-template-columns: 180px 1fr;
      gap: 20px;
      padding: 18px;
      border: 1px solid rgba(255,255,255,.09);
      border-radius: 15px;
      background: rgba(255,255,255,.045);
      margin-bottom: 18px;
    }

    .review-status strong {
      color: #f8fafc;
      font-size: 14px;
    }

    .review-status p {
      margin: 0;
      color: rgba(241,245,249,.82);
      font-size: 13px;
      line-height: 1.6;
    }

    .status-submitted {
      color: #fde68a !important;
    }

    .status-validated {
      color: #86efac !important;
    }

    .status-rejected {
      color: #fca5a5 !important;
    }

    .status-matched {
      color: #93c5fd !important;
    }

    .status-in_project {
      color: #c4b5fd !important;
    }

    .action-area {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }

    .action-btn,
    .match-btn,
    .assign-btn,
    .secondary-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      border: 0;
      border-radius: 11px;
      padding: 11px 17px;
      font-family: inherit;
      font-size: 12px;
      font-weight: 800;
      cursor: pointer;
      transition: .2s ease;
    }

    .action-btn:disabled,
    .match-btn:disabled,
    .assign-btn:disabled {
      opacity: .55;
      cursor: not-allowed;
    }

    .validate-btn {
      color: #052e16;
      background: #86efac;
    }

    .validate-btn:hover:not(:disabled) {
      transform: translateY(-1px);
      background: #a7f3d0;
    }

    .reject-btn {
      color: #450a0a;
      background: #fca5a5;
    }

    .reject-btn:hover:not(:disabled) {
      transform: translateY(-1px);
      background: #fecaca;
    }

    .reject-box {
      margin-top: 18px;
      padding: 18px;
      border: 1px solid rgba(248,113,113,.22);
      border-radius: 15px;
      background: rgba(127,29,29,.13);
    }

    .reject-box label {
      display: block;
      margin-bottom: 9px;
      color: #fecaca;
      font-size: 12px;
      font-weight: 800;
    }

    .reject-box textarea {
      width: 100%;
      box-sizing: border-box;
      resize: vertical;
      padding: 13px;
      border-radius: 11px;
      border: 1px solid rgba(255,255,255,.12);
      outline: none;
      color: #f8fafc;
      background: rgba(0,0,0,.18);
      font-family: inherit;
      font-size: 13px;
      line-height: 1.5;
    }

    .reject-box textarea:focus {
      border-color: rgba(248,113,113,.45);
    }

    .reject-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 12px;
    }

    .secondary-btn {
      color: #e2e8f0;
      background: rgba(255,255,255,.08);
      border: 1px solid rgba(255,255,255,.12);
    }

    .decision-box {
      display: flex;
      align-items: flex-start;
      gap: 13px;
      padding: 16px;
      margin-top: 18px;
      border-radius: 14px;
      border: 1px solid rgba(255,255,255,.10);
    }

    .decision-box strong {
      display: block;
      margin-bottom: 5px;
      color: #f8fafc;
      font-size: 13px;
    }

    .decision-box p {
      margin: 0;
      color: rgba(241,245,249,.76);
      font-size: 12px;
      line-height: 1.6;
    }

    .decision-box small {
      display: block;
      margin-top: 7px;
      color: rgba(241,245,249,.55);
      line-height: 1.5;
    }

    .validated-box {
      color: #86efac;
      background: rgba(34,197,94,.08);
      border-color: rgba(34,197,94,.20);
    }

    .rejected-box {
      color: #fca5a5;
      background: rgba(239,68,68,.08);
      border-color: rgba(239,68,68,.20);
    }

    .pending-box {
      color: #fde68a;
      background: rgba(234,179,8,.08);
      border-color: rgba(234,179,8,.20);
    }

    .match-btn {
      color: #dbeafe;
      background: rgba(37,99,235,.18);
      border: 1px solid rgba(96,165,250,.28);
    }

    .match-btn:hover:not(:disabled) {
      transform: translateY(-1px);
      background: rgba(37,99,235,.28);
    }

    .matches-container {
      margin-top: 22px;
    }

    .matches-heading {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 15px;
      margin-bottom: 13px;
    }

    .matches-heading h3 {
      margin: 0;
      color: #f8fafc;
      font-size: 15px;
      font-weight: 800;
    }

    .matches-heading span {
      padding: 5px 9px;
      border-radius: 999px;
      color: #bfdbfe;
      background: rgba(96,165,250,.10);
      font-size: 11px;
      font-weight: 800;
    }

    .matches-list {
      display: grid;
      gap: 12px;
    }

    .match-card {
      display: grid;
      grid-template-columns: minmax(220px, 1fr) 110px minmax(200px, 1fr) auto;
      align-items: center;
      gap: 17px;
      padding: 17px;
      border: 1px solid rgba(255,255,255,.09);
      border-radius: 15px;
      background: rgba(255,255,255,.045);
    }

    .match-main {
      display: flex;
      align-items: center;
      gap: 12px;
      min-width: 0;
    }

    .match-icon,
    .assigned-icon {
      display: grid;
      place-items: center;
      flex: 0 0 auto;
      width: 43px;
      height: 43px;
      border-radius: 12px;
      color: #86efac;
      background: rgba(34,197,94,.10);
      border: 1px solid rgba(34,197,94,.18);
    }

    .match-main h3 {
      margin: 0 0 4px;
      color: #f8fafc;
      font-size: 13px;
      font-weight: 800;
    }

    .match-main p {
      margin: 0;
      color: rgba(226,232,240,.58);
      font-size: 11px;
    }

    .score-box {
      text-align: center;
    }

    .score-box span,
    .match-details span {
      display: block;
      margin-bottom: 4px;
      color: rgba(226,232,240,.55);
      font-size: 10px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: .05em;
    }

    .score-box strong {
      color: #93c5fd;
      font-size: 18px;
      font-weight: 800;
    }

    .match-details {
      display: grid;
      gap: 7px;
      min-width: 0;
    }

    .match-details p {
      margin: 0;
      color: rgba(241,245,249,.72);
      font-size: 11px;
      line-height: 1.4;
      overflow-wrap: anywhere;
    }

    .assign-btn {
      color: #052e16;
      background: #86efac;
      white-space: nowrap;
    }

    .assign-btn:hover:not(:disabled) {
      transform: translateY(-1px);
      background: #a7f3d0;
    }

    .assigned-box {
      display: grid;
      grid-template-columns: auto 1fr auto;
      align-items: center;
      gap: 13px;
      padding: 17px;
      margin-bottom: 17px;
      border: 1px solid rgba(34,197,94,.18);
      border-radius: 15px;
      background: rgba(34,197,94,.07);
    }

    .assigned-info strong {
      display: block;
      color: #f8fafc;
      font-size: 14px;
    }

    .assigned-info p {
      margin: 4px 0 0;
      color: rgba(226,232,240,.58);
      font-size: 11px;
    }

    .assignment-status {
      text-align: right;
    }

    .assignment-status strong {
      color: #f8fafc;
      font-size: 12px;
    }

    .empty-matches {
      padding: 25px;
      text-align: center;
      color: rgba(226,232,240,.60);
      border: 1px dashed rgba(255,255,255,.14);
      border-radius: 14px;
      font-size: 13px;
    }

    .remarks-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 15px;
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

    @media (max-width: 1050px) {
      .match-card {
        grid-template-columns: 1fr 100px;
      }

      .match-details {
        grid-column: 1 / -1;
      }

      .assign-btn {
        justify-self: end;
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

      .analysis-grid,
      .remarks-grid {
        grid-template-columns: 1fr;
      }

      .large-card {
        padding: 22px 19px;
      }

      .review-status {
        grid-template-columns: 1fr;
      }

      .match-card {
        grid-template-columns: 1fr;
      }

      .score-box {
        text-align: left;
      }

      .assign-btn {
        justify-self: stretch;
      }

      .assigned-box {
        grid-template-columns: auto 1fr;
      }

      .assignment-status {
        grid-column: 1 / -1;
        text-align: left;
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

      .action-area {
        flex-direction: column;
      }

      .action-area .action-btn {
        width: 100%;
      }
    }
  `;
}

export default ChallengeDetails;
