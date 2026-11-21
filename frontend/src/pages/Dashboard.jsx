import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ClipboardList,
  Clock3,
  CheckCircle2,
  FolderKanban,
  MapPin,
  CalendarDays,
  ArrowUpRight,
  AlertCircle,
  RefreshCw,
  User,
} from "lucide-react";

import api from "../services/api";
import monsoonBg from "../assets/monsoon.jpg";

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [stats, setStats] = useState({
    total: 0,
    underReview: 0,
    inProject: 0,
    resolved: 0,
  });

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (!token) {
        navigate("/login");
        return;
      }

      if (!storedUser) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      const currentUser = JSON.parse(storedUser);

      if (!currentUser?.id && !currentUser?._id) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }

      setUser(currentUser);

      // New Challenge API
      const response = await api.get("/challenges/my");

      const myChallenges = response.data?.challenges || [];

      setChallenges(myChallenges);

      // Calculate dashboard statistics
      const total = myChallenges.length;

      const underReview = myChallenges.filter(
        (challenge) =>
          challenge.status === "SUBMITTED" ||
          challenge.status === "UNDER_REVIEW"
      ).length;

      const inProject = myChallenges.filter(
        (challenge) =>
          challenge.status === "MATCHED" ||
          challenge.status === "IN_PROJECT"
      ).length;

      const resolved = myChallenges.filter(
        (challenge) => challenge.status === "RESOLVED"
      ).length;

      setStats({
        total,
        underReview,
        inProject,
        resolved,
      });
    } catch (err) {
      console.error("Failed to fetch dashboard:", err);

      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }

      setError(
        err.response?.data?.message ||
          "Unable to load your dashboard. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // Helpers
  // --------------------------------------------------

  const getUserName = () => {
    if (!user) return "User";

    return (
      user.name ||
      user.fullName ||
      user.username ||
      user.email?.split("@")[0] ||
      "User"
    );
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "RESOLVED":
        return "status-resolved";

      case "IN_PROJECT":
        return "status-progress";

      case "MATCHED":
        return "status-matched";

      case "VALIDATED":
        return "status-validated";

      case "UNDER_REVIEW":
        return "status-review";

      case "REJECTED":
        return "status-rejected";

      case "SUBMITTED":
      default:
        return "status-pending";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "SUBMITTED":
        return "Submitted";

      case "UNDER_REVIEW":
        return "Under Review";

      case "VALIDATED":
        return "Validated";

      case "MATCHED":
        return "Matched";

      case "IN_PROJECT":
        return "In Project";

      case "RESOLVED":
        return "Resolved";

      case "REJECTED":
        return "Rejected";

      default:
        return status || "Unknown";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "RESOLVED":
        return <CheckCircle2 size={14} />;

      case "IN_PROJECT":
      case "MATCHED":
        return <FolderKanban size={14} />;

      case "VALIDATED":
        return <CheckCircle2 size={14} />;

      case "REJECTED":
        return <AlertCircle size={14} />;

      default:
        return <Clock3 size={14} />;
    }
  };

  const getDomain = (domain) => {
    if (!domain) return "Other";

    return domain
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case "CRITICAL":
        return "priority-critical";

      case "HIGH":
        return "priority-high";

      case "LOW":
        return "priority-low";

      case "MEDIUM":
      default:
        return "priority-medium";
    }
  };

  const getLocation = (location) => {
    if (!location) return "Location not specified";

    // If backend later provides an address
    if (location.address) {
      return location.address;
    }

    // GeoJSON format: [longitude, latitude]
    if (
      Array.isArray(location.coordinates) &&
      location.coordinates.length >= 2
    ) {
      const [longitude, latitude] = location.coordinates;

      return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
    }

    return "Location not specified";
  };

  const formatDate = (date) => {
    if (!date) return "Date unavailable";

    try {
      return new Date(date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "Date unavailable";
    }
  };

  // --------------------------------------------------
  // Loading State
  // --------------------------------------------------

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-overlay"></div>

        <div className="dashboard-container loading-container">
          <div className="loading-card">
            <RefreshCw className="loading-icon" size={32} />
            <h2>Loading Dashboard...</h2>
            <p>Fetching your submitted challenges.</p>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // Main Dashboard
  // --------------------------------------------------

  return (
    <div
      className="dashboard-page"
      style={{
        backgroundImage: `
          linear-gradient(
            rgba(8, 20, 35, 0.60),
            rgba(8, 20, 35, 0.72)
          ),
          url(${monsoonBg})
        `,
      }}
    >
      <div className="dashboard-container">
        {/* ================= HEADER ================= */}

        <div className="dashboard-header">
          <div>
            <p className="dashboard-eyebrow">ResolveX Dashboard</p>

            <h1>
              Welcome back,{" "}
              <span>{getUserName()}</span>
            </h1>

            <p className="dashboard-subtitle">
              Track your challenges and see how they move toward solutions.
            </p>
          </div>

          <div className="profile-card">
            <div className="profile-icon">
              <User size={22} />
            </div>

            <div className="profile-info">
              <strong>{getUserName()}</strong>

              <span>
                {user?.email || "ResolveX Citizen"}
              </span>
            </div>
          </div>
        </div>

        {/* ================= ERROR ================= */}

        {error && (
          <div className="dashboard-error">
            <div className="error-content">
              <AlertCircle size={20} />

              <span>{error}</span>
            </div>

            <button onClick={loadDashboard}>
              <RefreshCw size={15} />
              Retry
            </button>
          </div>
        )}

        {/* ================= STATS ================= */}

        <div className="stats-grid">
          {/* Total */}
          <div className="stat-card">
            <div className="stat-icon stat-icon-total">
              <ClipboardList size={25} />
            </div>

            <div>
              <p>Total Challenges</p>
              <h2>{stats.total}</h2>
              <span>Submitted by you</span>
            </div>
          </div>

          {/* Under Review */}
          <div className="stat-card">
            <div className="stat-icon stat-icon-pending">
              <Clock3 size={25} />
            </div>

            <div>
              <p>Under Review</p>
              <h2>{stats.underReview}</h2>
              <span>Awaiting validation</span>
            </div>
          </div>

          {/* In Project */}
          <div className="stat-card">
            <div className="stat-icon stat-icon-progress">
              <FolderKanban size={25} />
            </div>

            <div>
              <p>In Project</p>
              <h2>{stats.inProject}</h2>
              <span>Being worked on</span>
            </div>
          </div>

          {/* Resolved */}
          <div className="stat-card">
            <div className="stat-icon stat-icon-resolved">
              <CheckCircle2 size={25} />
            </div>

            <div>
              <p>Resolved</p>
              <h2>{stats.resolved}</h2>
              <span>Successfully resolved</span>
            </div>
          </div>
        </div>

        {/* ================= MAIN CONTENT ================= */}

        <div className="section-card">
          <div className="section-header">
            <div>
              <p className="section-eyebrow">Your Contributions</p>

              <h2>My Submitted Challenges</h2>

              <p>
                Challenges you have submitted through ResolveX.
              </p>
            </div>

            <Link to="/challenges/:id" className="view-all-link">
              View All
              <ArrowUpRight size={17} />
            </Link>
          </div>

          {/* Empty State */}

          {challenges.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <ClipboardList size={32} />
              </div>

              <h3>No challenges submitted yet</h3>

              <p>
                Have a problem or challenge in your community?
                Submit it and let ResolveX connect it with potential
                solutions.
              </p>

              <Link to="/report-issue" className="primary-button">
                Submit a Challenge
                <ArrowUpRight size={17} />
              </Link>
            </div>
          ) : (
            <div className="challenge-list">
              {challenges.map((challenge) => (
                <div
                  className="challenge-card"
                  key={challenge._id}
                >
                  {/* Challenge Main Information */}

                  <div className="challenge-main">
                    <div className="challenge-title-row">
                      <h3>
                        {challenge.title || "Untitled Challenge"}
                      </h3>

                      <span
                        className={`status-badge ${getStatusClass(
                          challenge.status
                        )}`}
                      >
                        {getStatusIcon(challenge.status)}
                        {getStatusLabel(challenge.status)}
                      </span>
                    </div>

                    <p className="challenge-description">
                      {challenge.description
                        ? challenge.description.length > 180
                          ? `${challenge.description.slice(0, 180)}...`
                          : challenge.description
                        : "No description available."}
                    </p>

                    <div className="challenge-meta">
                      <span>
                        <ClipboardList size={15} />
                        {getDomain(challenge.domain)}
                      </span>

                      <span>
                        <MapPin size={15} />
                        {getLocation(challenge.location)}
                      </span>

                      <span>
                        <CalendarDays size={15} />
                        {formatDate(challenge.createdAt)}
                      </span>
                    </div>
                  </div>

                  {/* Challenge Side Information */}

                  <div className="challenge-side">
                    {challenge.priority && (
                      <span
                        className={`priority-badge ${getPriorityClass(
                          challenge.priority
                        )}`}
                      >
                        {challenge.priority}
                      </span>
                    )}

                    <Link
                      to={`/challenges/${challenge._id}`}
                      className="challenge-link"
                    >
                      View Details
                      <ArrowUpRight size={16} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ================= QUICK ACTION ================= */}

        <div className="quick-action-card">
          <div>
            <p className="section-eyebrow">Make an Impact</p>

            <h2>Know a challenge in your community?</h2>

            <p>
              Share it with ResolveX and help connect real-world
              problems with universities, experts and potential
              solutions.
            </p>
          </div>

          <Link to="/report-issue" className="primary-button">
            Submit Challenge
            <ArrowUpRight size={18} />
          </Link>
        </div>
      </div>

      {/* ================= CSS ================= */}

      <style>{`
        * {
          box-sizing: border-box;
        }

        .dashboard-page {
          min-height: 90vh;
          color: #f8fafc;
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
          position: relative;
          padding: 30px 20px 50px;
        }

        .dashboard-page::before {
          content: "";
          position: fixed;
          inset: 0;
          background: linear-gradient(
            rgba(8, 20, 35, 0.08),
            rgba(8, 20, 35, 0.18)
          );
          pointer-events: none;
          z-index: 0;
        }

        .dashboard-container {
          position: relative;
          z-index: 1;
          max-width: 1250px;
          margin: 0 auto;
        }

        /* ================= HEADER ================= */

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 25px;
          margin-bottom: 30px;
        }

        .dashboard-eyebrow,
        .section-eyebrow {
          margin: 0 0 7px;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: #bae6fd;
        }

        .dashboard-header h1 {
          margin: 0;
          font-size: clamp(28px, 4vw, 40px);
          line-height: 1.15;
          font-weight: 750;
          letter-spacing: -0.7px;
        }

        .dashboard-header h1 span {
          color: #7dd3fc;
        }

        .dashboard-subtitle {
          margin: 10px 0 0;
          color: rgba(241, 245, 249, 0.78);
          font-size: 15px;
        }

        /* ================= PROFILE ================= */

        .profile-card {
          min-width: 230px;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 13px 16px;
          border-radius: 16px;

          background: rgba(255, 255, 255, 0.10);
          border: 1px solid rgba(255, 255, 255, 0.25);

          backdrop-filter: blur(5px);
          -webkit-backdrop-filter: blur(5px);

          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
        }

        .profile-icon {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;

          background: rgba(125, 211, 252, 0.18);
          border: 1px solid rgba(125, 211, 252, 0.35);
          color: #bae6fd;
        }

        .profile-info {
          display: flex;
          flex-direction: column;
          gap: 3px;
          min-width: 0;
        }

        .profile-info strong {
          font-size: 14px;
          color: #f8fafc;
        }

        .profile-info span {
          font-size: 12px;
          color: rgba(226, 232, 240, 0.7);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 170px;
        }

        /* ================= STATS ================= */

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 18px;
          margin-bottom: 30px;
        }

        .stat-card {
          border-radius: 16px;
          padding: 22px;
          min-height: 145px;

          display: flex;
          align-items: center;
          gap: 16px;

          background: rgba(255, 255, 255, 0.10);
          border: 1px solid rgba(255, 255, 255, 0.25);

          backdrop-filter: blur(5px);
          -webkit-backdrop-filter: blur(5px);

          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);

          transition:
            transform 0.2s ease,
            background 0.2s ease;
        }

        .stat-card:hover {
          transform: translateY(-3px);
          background: rgba(255, 255, 255, 0.13);
        }

        .stat-icon {
          width: 48px;
          height: 48px;
          min-width: 48px;
          border-radius: 13px;

          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-icon-total {
          background: rgba(56, 189, 248, 0.18);
          color: #7dd3fc;
        }

        .stat-icon-pending {
          background: rgba(251, 191, 36, 0.18);
          color: #fbbf24;
        }

        .stat-icon-progress {
          background: rgba(167, 139, 250, 0.18);
          color: #c4b5fd;
        }

        .stat-icon-resolved {
          background: rgba(74, 222, 128, 0.18);
          color: #86efac;
        }

        .stat-card p {
          margin: 0 0 5px;
          font-size: 13px;
          color: rgba(226, 232, 240, 0.72);
        }

        .stat-card h2 {
          margin: 0;
          font-size: 29px;
          line-height: 1;
          color: #ffffff;
        }

        .stat-card span {
          display: block;
          margin-top: 7px;
          font-size: 11px;
          color: rgba(226, 232, 240, 0.55);
        }

        /* ================= SECTION ================= */

        .section-card {
          background: rgba(255, 255, 255, 0.10);
          border: 1px solid rgba(255, 255, 255, 0.25);

          backdrop-filter: blur(5px);
          -webkit-backdrop-filter: blur(5px);

          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);

          border-radius: 18px;
          padding: 25px;
          margin-bottom: 24px;
        }

        .section-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 22px;
        }

        .section-header h2 {
          margin: 0;
          font-size: 22px;
          color: #ffffff;
        }

        .section-header > div > p:last-child {
          margin: 6px 0 0;
          font-size: 13px;
          color: rgba(226, 232, 240, 0.68);
        }

        .view-all-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;

          color: #7dd3fc;
          text-decoration: none;
          font-size: 13px;
          font-weight: 600;

          white-space: nowrap;
        }

        .view-all-link:hover {
          color: #bae6fd;
        }

        /* ================= CHALLENGE LIST ================= */

        .challenge-list {
          display: flex;
          flex-direction: column;
          gap: 13px;
        }

        .challenge-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;

          padding: 18px 19px;
          border-radius: 14px;

          background: rgba(15, 23, 42, 0.28);
          border: 1px solid rgba(255, 255, 255, 0.13);

          transition:
            background 0.2s ease,
            transform 0.2s ease;
        }

        .challenge-card:hover {
          background: rgba(255, 255, 255, 0.08);
          transform: translateY(-1px);
        }

        .challenge-main {
          flex: 1;
          min-width: 0;
        }

        .challenge-title-row {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .challenge-title-row h3 {
          margin: 0;
          font-size: 16px;
          font-weight: 650;
          color: #ffffff;
        }

        .challenge-description {
          margin: 8px 0 11px;
          color: rgba(226, 232, 240, 0.68);
          font-size: 13px;
          line-height: 1.55;
          max-width: 850px;
        }

        .challenge-meta {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 15px;
        }

        .challenge-meta span {
          display: inline-flex;
          align-items: center;
          gap: 5px;

          font-size: 11px;
          color: rgba(226, 232, 240, 0.58);
        }

        .challenge-meta svg {
          color: #7dd3fc;
        }

        /* ================= STATUS ================= */

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;

          padding: 5px 9px;
          border-radius: 999px;

          font-size: 10px;
          font-weight: 700;
          white-space: nowrap;

          border: 1px solid transparent;
        }

        .status-pending {
          color: #fcd34d;
          background: rgba(251, 191, 36, 0.13);
          border-color: rgba(251, 191, 36, 0.25);
        }

        .status-review {
          color: #93c5fd;
          background: rgba(59, 130, 246, 0.14);
          border-color: rgba(59, 130, 246, 0.25);
        }

        .status-validated {
          color: #67e8f9;
          background: rgba(34, 211, 238, 0.13);
          border-color: rgba(34, 211, 238, 0.25);
        }

        .status-matched {
          color: #c4b5fd;
          background: rgba(139, 92, 246, 0.14);
          border-color: rgba(139, 92, 246, 0.25);
        }

        .status-progress {
          color: #c4b5fd;
          background: rgba(167, 139, 250, 0.14);
          border-color: rgba(167, 139, 250, 0.25);
        }

        .status-resolved {
          color: #86efac;
          background: rgba(34, 197, 94, 0.14);
          border-color: rgba(34, 197, 94, 0.25);
        }

        .status-rejected {
          color: #fca5a5;
          background: rgba(239, 68, 68, 0.14);
          border-color: rgba(239, 68, 68, 0.25);
        }

        /* ================= PRIORITY ================= */

        .challenge-side {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 10px;
          flex-shrink: 0;
        }

        .priority-badge {
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.6px;
        }

        .priority-critical {
          color: #fca5a5;
          background: rgba(239, 68, 68, 0.15);
        }

        .priority-high {
          color: #fdba74;
          background: rgba(249, 115, 22, 0.15);
        }

        .priority-medium {
          color: #fcd34d;
          background: rgba(234, 179, 8, 0.15);
        }

        .priority-low {
          color: #86efac;
          background: rgba(34, 197, 94, 0.15);
        }

        .challenge-link {
          display: inline-flex;
          align-items: center;
          gap: 5px;

          color: #bae6fd;
          text-decoration: none;
          font-size: 11px;
          font-weight: 650;
          white-space: nowrap;
        }

        .challenge-link:hover {
          color: #ffffff;
        }

        /* ================= EMPTY ================= */

        .empty-state {
          text-align: center;
          padding: 45px 20px 35px;
          border-radius: 14px;
          background: rgba(15, 23, 42, 0.20);
          border: 1px dashed rgba(255, 255, 255, 0.18);
        }

        .empty-icon {
          width: 65px;
          height: 65px;
          margin: 0 auto 15px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 18px;
          color: #7dd3fc;
          background: rgba(56, 189, 248, 0.13);
        }

        .empty-state h3 {
          margin: 0 0 8px;
          color: #ffffff;
          font-size: 18px;
        }

        .empty-state p {
          max-width: 550px;
          margin: 0 auto 20px;

          color: rgba(226, 232, 240, 0.65);
          font-size: 13px;
          line-height: 1.6;
        }

        /* ================= QUICK ACTION ================= */

        .quick-action-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 25px;

          padding: 23px 25px;
          border-radius: 18px;

          background: rgba(14, 165, 233, 0.11);
          border: 1px solid rgba(125, 211, 252, 0.25);

          backdrop-filter: blur(5px);
          -webkit-backdrop-filter: blur(5px);

          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
        }

        .quick-action-card h2 {
          margin: 0;
          font-size: 19px;
          color: #ffffff;
        }

        .quick-action-card p:last-child {
          margin: 6px 0 0;
          color: rgba(226, 232, 240, 0.65);
          font-size: 12px;
          line-height: 1.5;
          max-width: 700px;
        }

        .primary-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;

          padding: 11px 17px;
          border-radius: 10px;

          color: #082f49;
          background: #bae6fd;

          text-decoration: none;
          font-size: 12px;
          font-weight: 750;

          white-space: nowrap;

          transition:
            transform 0.2s ease,
            background 0.2s ease;
        }

        .primary-button:hover {
          transform: translateY(-2px);
          background: #e0f2fe;
        }

        /* ================= ERROR ================= */

        .dashboard-error {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;

          margin-bottom: 20px;
          padding: 13px 15px;

          border-radius: 12px;

          background: rgba(239, 68, 68, 0.13);
          border: 1px solid rgba(248, 113, 113, 0.25);

          color: #fecaca;
        }

        .error-content {
          display: flex;
          align-items: center;
          gap: 9px;
          font-size: 13px;
        }

        .dashboard-error button {
          display: inline-flex;
          align-items: center;
          gap: 6px;

          border: 1px solid rgba(255, 255, 255, 0.18);
          border-radius: 8px;

          padding: 7px 10px;

          color: #ffffff;
          background: rgba(255, 255, 255, 0.08);

          cursor: pointer;
          font-size: 11px;
        }

        /* ================= LOADING ================= */

        .loading-container {
          min-height: calc(100vh - 160px);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .loading-card {
          text-align: center;
          padding: 35px 45px;
          border-radius: 18px;

          background: rgba(255, 255, 255, 0.10);
          border: 1px solid rgba(255, 255, 255, 0.25);

          backdrop-filter: blur(5px);
          -webkit-backdrop-filter: blur(5px);
        }

        .loading-icon {
          animation: spin 1s linear infinite;
          color: #7dd3fc;
        }

        .loading-card h2 {
          margin: 15px 0 5px;
          font-size: 18px;
        }

        .loading-card p {
          margin: 0;
          color: rgba(226, 232, 240, 0.65);
          font-size: 13px;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        /* ================= RESPONSIVE ================= */

        @media (max-width: 1000px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 760px) {
          .dashboard-page {
            padding: 15px 14px 35px;
          }

          .dashboard-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .profile-card {
            width: 100%;
          }

          .challenge-card {
            align-items: flex-start;
            flex-direction: column;
          }

          .challenge-side {
            width: 100%;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
          }

          .quick-action-card {
            flex-direction: column;
            align-items: flex-start;
          }

          .quick-action-card .primary-button {
            width: 100%;
          }
        }

        @media (max-width: 560px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }

          .stat-card {
            min-height: 125px;
          }

          .section-card {
            padding: 18px;
          }

          .section-header {
            flex-direction: column;
          }

          .challenge-meta {
            flex-direction: column;
            align-items: flex-start;
            gap: 7px;
          }

          .challenge-title-row {
            align-items: flex-start;
            flex-direction: column;
          }

          .dashboard-error {
            align-items: flex-start;
            flex-direction: column;
          }

          .dashboard-error button {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}

export default Dashboard;