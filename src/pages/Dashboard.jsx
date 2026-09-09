
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ClipboardList,
  Clock3,
  CheckCircle2,
  AlertCircle,
  Plus,
  ArrowRight,
  MapPin,
  Loader2,
  UserRound,
} from "lucide-react";

import api from "../services/api";
import monsoonBg from "../assets/monsoon.jpg";

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
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

      // -----------------------------
      // CHECK LOGIN
      // -----------------------------
      if (!token) {
        navigate("/login");
        return;
      }

      // -----------------------------
      // GET CURRENT USER
      // -----------------------------
      let currentUser = null;

      if (storedUser) {
        try {
          currentUser = JSON.parse(storedUser);
        } catch (err) {
          console.error("Invalid user data in localStorage");
        }
      }

      if (!currentUser?.id) {
        console.error("Current user ID not found");

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
        return;
      }

      setUser(currentUser);

      console.log("CURRENT LOGGED-IN USER:", currentUser);

      // -----------------------------
      // FETCH ISSUES
      // -----------------------------
      const response = await api.get("/issues", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("ALL ISSUES FROM BACKEND:", response.data);

      const allIssues = Array.isArray(response.data?.issues)
        ? response.data.issues
        : [];

      // -----------------------------
      // IMPORTANT:
      // ONLY SHOW ISSUES REPORTED
      // BY CURRENT USER
      // -----------------------------
      const myIssues = allIssues.filter((issue) => {
        return String(issue.reportedBy) === String(currentUser.id);
      });

      console.log("CURRENT USER ID:", currentUser.id);
      console.log("MY ISSUES:", myIssues);

      setIssues(myIssues);

      // -----------------------------
      // CALCULATE STATS
      // -----------------------------
      const total = myIssues.length;

      const pending = myIssues.filter((issue) => {
        const status = String(issue.status || "").toUpperCase();

        return (
          status === "REPORTED" ||
          status === "PENDING" ||
          status === "ASSIGNED"
        );
      }).length;

      const inProgress = myIssues.filter((issue) => {
        const status = String(issue.status || "").toUpperCase();

        return (
          status === "IN_PROGRESS" ||
          status === "IN PROGRESS" ||
          status === "INPROCESS"
        );
      }).length;

      const resolved = myIssues.filter((issue) => {
        const status = String(issue.status || "").toUpperCase();

        return (
          status === "RESOLVED" ||
          status === "COMPLETED"
        );
      }).length;

      setStats({
        total,
        pending,
        inProgress,
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
          "Unable to load dashboard data."
      );

      setIssues([]);

      setStats({
        total: 0,
        pending: 0,
        inProgress: 0,
        resolved: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------
  // USER NAME
  // --------------------------------
  const getUserName = () => {
    return (
      user?.name ||
      user?.fullName ||
      user?.username ||
      "User"
    );
  };

  // --------------------------------
  // STATUS
  // --------------------------------
  const getStatusClass = (status) => {
    const normalized = String(status || "").toUpperCase();

    if (
      normalized === "RESOLVED" ||
      normalized === "COMPLETED"
    ) {
      return "status resolved";
    }

    if (
      normalized === "IN_PROGRESS" ||
      normalized === "IN PROGRESS" ||
      normalized === "INPROCESS"
    ) {
      return "status progress";
    }

    return "status pending";
  };

  const getStatusText = (status) => {
    if (!status) return "Reported";

    return String(status)
      .replace(/_/g, " ")
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) =>
        char.toUpperCase()
      );
  };

  // --------------------------------
  // LOCATION
  // --------------------------------
  const getLocation = (issue) => {
    if (!issue?.location) {
      return "Location unavailable";
    }

    if (issue.location.address) {
      return issue.location.address;
    }

    if (
      Array.isArray(issue.location.coordinates) &&
      issue.location.coordinates.length >= 2
    ) {
      const [longitude, latitude] =
        issue.location.coordinates;

      return `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
    }

    return "Location unavailable";
  };

  // --------------------------------
  // DATE
  // --------------------------------
  const formatDate = (date) => {
    if (!date) return "Date unavailable";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Date unavailable";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // --------------------------------
  // CATEGORY
  // --------------------------------
  const getCategory = (issue) => {
    if (!issue?.category) return "Civic Issue";

    return String(issue.category)
      .replace(/_/g, " ")
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) =>
        char.toUpperCase()
      );
  };

  return (
    <div className="dashboard-page">

     <style>{`

  * {
    box-sizing: border-box;
  }

  /* =========================
     DASHBOARD BACKGROUND
  ========================= */

  .dashboard-page {
    min-height: 100vh;

    background-image:
      linear-gradient(
        rgba(8, 20, 18, 0.45),
        rgba(8, 20, 18, 0.60)
      ),
      url(${monsoonBg});

    background-size: cover;
    background-position: center;
    background-attachment: fixed;

    color: #ffffff;

    font-family: Inter, Arial, sans-serif;

    padding: 32px 5%;
  }


  .dashboard-container {
    max-width: 1250px;
    margin: 0 auto;
  }


  /* =========================
     GLASS EFFECT
  ========================= */

  .profile-card,
  .stat-card,
  .section-card {

    background: rgba(255, 255, 255, 0.14);

    border: 1px solid
      rgba(255, 255, 255, 0.25);

    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(12px);

    box-shadow:
      0 8px 32px
      rgba(0, 0, 0, 0.18);

  }


  /* =========================
     HEADER
  ========================= */

  .dashboard-header {

    display: flex;

    justify-content: space-between;

    align-items: center;

    gap: 20px;

    margin-bottom: 30px;

  }


  .welcome-section h1 {

    margin: 0;

    font-size: 32px;

    font-weight: 700;

    color: #ffffff;

    text-shadow:
      0 2px 10px
      rgba(0, 0, 0, 0.35);

  }


  .welcome-section p {

    margin: 8px 0 0;

    color:
      rgba(255, 255, 255, 0.85);

    font-size: 15px;

  }


  .header-right {

    display: flex;

    align-items: center;

    gap: 12px;

  }


  /* =========================
     PROFILE CARD
  ========================= */

  .profile-card {

    display: flex;

    align-items: center;

    gap: 12px;

    padding: 10px 16px;

    border-radius: 14px;

  }


  .profile-icon {

    width: 42px;

    height: 42px;

    border-radius: 50%;

    display: flex;

    align-items: center;

    justify-content: center;

    background:
      rgba(255, 255, 255, 0.18);

    color: #ffffff;

    border: 1px solid
      rgba(255, 255, 255, 0.25);

  }


  .profile-info strong {

    display: block;

    font-size: 14px;

    color: white;

  }


  .profile-info span {

    display: block;

    color:
      rgba(255, 255, 255, 0.75);

    font-size: 12px;

    margin-top: 2px;

  }


  /* =========================
     REPORT BUTTON
  ========================= */

  .report-button {

    display: inline-flex;

    align-items: center;

    justify-content: center;

    gap: 8px;

    background:
      rgba(37, 99, 235, 0.85);

    backdrop-filter: blur(5px);

    color: white;

    text-decoration: none;

    padding: 12px 18px;

    border-radius: 10px;

    font-size: 14px;

    font-weight: 600;

    transition: 0.25s ease;

    border: 1px solid
      rgba(255, 255, 255, 0.25);

    box-shadow:
      0 6px 20px
      rgba(0, 0, 0, 0.18);

  }


  .report-button:hover {

    background:
      rgba(37, 99, 235, 1);

    transform: translateY(-2px);

  }


  /* =========================
     STATS
  ========================= */

  .stats-grid {

    display: grid;

    grid-template-columns:
      repeat(4, 1fr);

    gap: 18px;

    margin-bottom: 30px;

  }


  .stat-card {

    border-radius: 16px;

    padding: 22px;

    display: flex;

    align-items: center;

    gap: 16px;

    transition: 0.25s ease;

  }


  .stat-card:hover {

    transform: translateY(-4px);

    background:
      rgba(255, 255, 255, 0.20);

  }


  .stat-icon {

    width: 48px;

    height: 48px;

    border-radius: 12px;

    display: flex;

    align-items: center;

    justify-content: center;

    background:
      rgba(255, 255, 255, 0.15);

    border: 1px solid
      rgba(255, 255, 255, 0.18);

  }


  .stat-card:nth-child(1)
  .stat-icon {

    color: #60a5fa;

  }


  .stat-card:nth-child(2)
  .stat-icon {

    color: #fbbf24;

  }


  .stat-card:nth-child(3)
  .stat-icon {

    color: #c084fc;

  }


  .stat-card:nth-child(4)
  .stat-icon {

    color: #5eead4;

  }


  .stat-label {

    color:
      rgba(255, 255, 255, 0.75);

    font-size: 13px;

    margin-bottom: 5px;

  }


  .stat-number {

    font-size: 26px;

    font-weight: 700;

    color: white;

  }


  /* =========================
     MY ISSUES SECTION
  ========================= */

  .section-card {

    border-radius: 18px;

    overflow: hidden;

  }


  .section-header {

    padding: 20px 22px;

    border-bottom:
      1px solid
      rgba(255, 255, 255, 0.15);

    display: flex;

    align-items: center;

    justify-content: space-between;

  }


  .section-header h2 {

    margin: 0;

    font-size: 19px;

    color: white;

  }


  .section-header p {

    margin: 5px 0 0;

    color:
      rgba(255, 255, 255, 0.70);

    font-size: 13px;

  }


  .view-all {

    color: #93c5fd;

    text-decoration: none;

    font-size: 13px;

    font-weight: 600;

    display: flex;

    align-items: center;

    gap: 5px;

    transition: 0.2s;

  }


  .view-all:hover {

    color: white;

  }


  /* =========================
     ISSUES
  ========================= */

  .issues-list {

    padding: 8px 22px 20px;

  }


  .issue-item {

    padding: 18px 0;

    border-bottom:
      1px solid
      rgba(255, 255, 255, 0.12);

    display: flex;

    align-items: center;

    justify-content: space-between;

    gap: 20px;

  }


  .issue-item:last-child {

    border-bottom: none;

  }


  .issue-main {

    min-width: 0;

    flex: 1;

  }


  .issue-title-row {

    display: flex;

    align-items: center;

    gap: 10px;

    margin-bottom: 7px;

    flex-wrap: wrap;

  }


  .issue-title {

    font-size: 16px;

    font-weight: 650;

    color: white;

  }


  .issue-description {

    color:
      rgba(255, 255, 255, 0.78);

    font-size: 13px;

    margin: 0 0 8px;

    line-height: 1.5;

  }


  .issue-meta {

    display: flex;

    flex-wrap: wrap;

    gap: 14px;

    color:
      rgba(255, 255, 255, 0.65);

    font-size: 12px;

  }


  .issue-meta span {

    display: flex;

    align-items: center;

    gap: 5px;

  }


  /* =========================
     CATEGORY
  ========================= */

  .category {

    font-size: 11px;

    color: white;

    background:
      rgba(255, 255, 255, 0.12);

    border:
      1px solid
      rgba(255, 255, 255, 0.18);

    padding: 5px 9px;

    border-radius: 20px;

  }


  /* =========================
     STATUS
  ========================= */

  .status {

    display: inline-flex;

    align-items: center;

    padding: 5px 10px;

    border-radius: 20px;

    font-size: 11px;

    font-weight: 650;

    white-space: nowrap;

  }


  .status.pending {

    color: #fef3c7;

    background:
      rgba(217, 119, 6, 0.35);

    border:
      1px solid
      rgba(251, 191, 36, 0.30);

  }


  .status.progress {

    color: #ede9fe;

    background:
      rgba(124, 58, 237, 0.35);

    border:
      1px solid
      rgba(192, 132, 252, 0.30);

  }


  .status.resolved {

    color: #d1fae5;

    background:
      rgba(5, 150, 105, 0.35);

    border:
      1px solid
      rgba(94, 234, 212, 0.30);

  }


  /* =========================
     EMPTY STATE
  ========================= */

  .empty-state {

    text-align: center;

    padding: 55px 20px;

  }


  .empty-icon {

    width: 58px;

    height: 58px;

    border-radius: 50%;

    background:
      rgba(255, 255, 255, 0.14);

    border:
      1px solid
      rgba(255, 255, 255, 0.25);

    color: #93c5fd;

    display: flex;

    align-items: center;

    justify-content: center;

    margin: 0 auto 15px;

  }


  .empty-state h3 {

    margin: 0 0 7px;

    font-size: 17px;

    color: white;

  }


  .empty-state p {

    margin: 0 auto 18px;

    max-width: 420px;

    color:
      rgba(255, 255, 255, 0.72);

    font-size: 13px;

    line-height: 1.6;

  }


  /* =========================
     LOADING
  ========================= */

  .loading-state {

    min-height: 300px;

    display: flex;

    flex-direction: column;

    align-items: center;

    justify-content: center;

    color:
      rgba(255, 255, 255, 0.85);

    gap: 12px;

  }


  .loading-spinner {

    animation:
      spin 1s linear infinite;

  }


  @keyframes spin {

    from {

      transform: rotate(0deg);

    }

    to {

      transform: rotate(360deg);

    }

  }


  /* =========================
     ERROR
  ========================= */

  .error-box {

    background:
      rgba(127, 29, 29, 0.65);

    backdrop-filter:
      blur(5px);

    border:
      1px solid
      rgba(254, 202, 202, 0.35);

    color: white;

    border-radius: 12px;

    padding: 14px 16px;

    margin-bottom: 20px;

    font-size: 13px;

  }


  .retry-button {

    margin-top: 10px;

    border: none;

    background:
      rgba(255, 255, 255, 0.20);

    color: white;

    padding: 8px 14px;

    border-radius: 8px;

    cursor: pointer;

    font-size: 12px;

  }


  /* =========================
     RESPONSIVE
  ========================= */

  @media (max-width: 1000px) {

    .stats-grid {

      grid-template-columns:
        repeat(2, 1fr);

    }


    .dashboard-header {

      align-items: flex-start;

      flex-direction: column;

    }


    .header-right {

      width: 100%;

    }

  }


  @media (max-width: 600px) {

    .dashboard-page {

      padding: 24px 16px;

      background-attachment: scroll;

    }


    .stats-grid {

      grid-template-columns: 1fr;

    }


    .header-right {

      flex-direction: column;

      align-items: stretch;

    }


    .profile-card {

      width: 100%;

    }


    .issue-item {

      align-items: flex-start;

      flex-direction: column;

    }


    .welcome-section h1 {

      font-size: 26px;

    }

  }

`}</style>

      <div className="dashboard-container">

        {/* ================= HEADER ================= */}

        <div className="dashboard-header">

          <div className="welcome-section">
            <h1>
              Welcome back, {loading ? "User" : getUserName()}!👋
            </h1>
{/*             
              Track and manage the civic issues you have reported. */}
            
          </div>

          <div className="header-right">

            <div className="profile-card">

              <div className="profile-icon">
                <UserRound size={19} />
              </div>

              <div className="profile-info">
                <strong>{getUserName()}</strong>
                <span>Citizen</span>
              </div>

            </div>

            <Link
              to="/report-issue"
              className="report-button"
            >
              <Plus size={17} />
              Report Issue
            </Link>

          </div>

        </div>

        {/* ================= ERROR ================= */}

        {error && (
          <div className="error-box">

            {error}

            <br />

            <button
              className="retry-button"
              onClick={loadDashboard}
            >
              Try Again
            </button>

          </div>
        )}

        {/* ================= STATS ================= */}

        <div className="stats-grid">

          {/* TOTAL */}

          <div className="stat-card">

            <div className="stat-icon">
              <ClipboardList size={23} />
            </div>

            <div>
              <div className="stat-label">
                Total Issues
              </div>

              <div className="stat-number">
                {loading ? "—" : stats.total}
              </div>
            </div>

          </div>

          {/* PENDING */}

          <div className="stat-card">

            <div className="stat-icon">
              <Clock3 size={23} />
            </div>

            <div>
              <div className="stat-label">
                Pending
              </div>

              <div className="stat-number">
                {loading ? "—" : stats.pending}
              </div>
            </div>

          </div>

          {/* IN PROGRESS */}

          <div className="stat-card">

            <div className="stat-icon">
              <AlertCircle size={23} />
            </div>

            <div>
              <div className="stat-label">
                In Progress
              </div>

              <div className="stat-number">
                {loading ? "—" : stats.inProgress}
              </div>
            </div>

          </div>

          {/* RESOLVED */}

          <div className="stat-card">

            <div className="stat-icon">
              <CheckCircle2 size={23} />
            </div>

            <div>
              <div className="stat-label">
                Resolved
              </div>

              <div className="stat-number">
                {loading ? "—" : stats.resolved}
              </div>
            </div>

          </div>

        </div>

        {/* ================= MY ISSUES ================= */}

        <div className="section-card">

          <div className="section-header">

            <div>
              <h2>My Reported Issues</h2>

              <p>
                Issues reported by you
              </p>
            </div>

            {issues.length > 0 && (
              <Link
                to="/issues"
                className="view-all"
              >
                View All
                <ArrowRight size={14} />
              </Link>
            )}

          </div>

          {/* LOADING */}

          {loading ? (

            <div className="loading-state">

              <Loader2
                size={28}
                className="loading-spinner"
              />

              <span>
                Loading your issues...
              </span>

            </div>

          ) : issues.length === 0 ? (

            /* EMPTY */

            <div className="empty-state">

              <div className="empty-icon">
                <ClipboardList size={26} />
              </div>

              <h3>
                No issues reported yet
              </h3>

              <p>
                You haven't reported any civic issues yet.
                Report a problem in your area and help make
                your community better.
              </p>

              <Link
                to="/report-issue"
                className="report-button"
              >
                <Plus size={17} />
                Report Your First Issue
              </Link>

            </div>

          ) : (

            /* ISSUES */

            <div className="issues-list">

              {issues.slice(0, 5).map((issue) => (

                <div
                  className="issue-item"
                  key={issue._id}
                >

                  <div className="issue-main">

                    <div className="issue-title-row">

                      <span className="issue-title">
                        {issue.title || "Civic Issue"}
                      </span>

                      <span className="category">
                        {getCategory(issue)}
                      </span>

                      <span
                        className={getStatusClass(
                          issue.status
                        )}
                      >
                        {getStatusText(issue.status)}
                      </span>

                    </div>

                    <p className="issue-description">
                      {issue.description ||
                        "No description available."}
                    </p>

                    <div className="issue-meta">

                      <span>
                        <MapPin size={13} />

                        {getLocation(issue)}
                      </span>

                      <span>
                        <Clock3 size={13} />

                        {formatDate(issue.createdAt)}
                      </span>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>

    </div>
  );
}

export default Dashboard;