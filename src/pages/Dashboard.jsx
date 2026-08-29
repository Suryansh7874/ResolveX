
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Bell,
  ChevronRight,
  Clock3,
  CheckCircle2,
  FileText,
  MapPin,
  Plus,
  ArrowUpRight,
} from "lucide-react";

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ================= GET LOGGED-IN USER =================
 useEffect(() => {
  const verifyUser = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      // Get the full user information saved during login
      const savedUser = localStorage.getItem("user");

      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);

        console.log("User from localStorage:", parsedUser);

        setUser(parsedUser);
      }

      // Only use /auth/me to verify that the token is valid
      const response = await fetch(
        "http://localhost:5000/api/auth/me",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      console.log("Response from /auth/me:", data);

      if (!response.ok) {
        throw new Error(
          data.message || "Authentication failed"
        );
      }

    } catch (error) {
      console.error("Authentication failed:", error);

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  verifyUser();
}, [navigate]);

  // ================= LOADING =================
  if (loading) {
    return (
      <>
        <style>{`
          .dashboard-loading {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: Arial, sans-serif;
            color: #12324a;
            font-size: 18px;
          }
        `}</style>

        <div className="dashboard-loading">
          Loading dashboard...
        </div>
      </>
    );
  }

  // ================= ISSUE DATA =================
  // Issue APIs are not connected yet.
  // Therefore we do NOT use fake/dummy issues here.
  const issues = [];

  // These will automatically become real values
  // when the issue API is connected.
  const totalIssues = issues.length;

  const inProgressIssues = issues.filter(
    (issue) => issue.status === "In Progress"
  ).length;

  const resolvedIssues = issues.filter(
    (issue) => issue.status === "Resolved"
  ).length;

  const impact =
    totalIssues > 0
      ? Math.round((resolvedIssues / totalIssues) * 100)
      : 0;

  return (
    <>
      {/* =====================================================
          CSS - KEPT IN THE SAME FILE
      ====================================================== */}

      <style>{`

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          font-family: Arial, Helvetica, sans-serif;
          background: #f5f8fa;
          color: #12324a;
        }

        a {
          text-decoration: none;
          color: inherit;
        }

        button {
          font-family: inherit;
        }

        /* ================= NAVBAR ================= */

        .dashboard {
          min-height: 100vh;
          background: #f5f8fa;
        }

        .dashboard-navbar {
          height: 76px;
          background: white;
          border-bottom: 1px solid #e5eaee;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 42px;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .dashboard-brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .brand-logo {
          width: 43px;
          height: 43px;
          border-radius: 50%;
          background: #19a9df;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          font-weight: 700;
        }

        .brand-text h2 {
          margin: 0;
          font-size: 21px;
          color: #102f47;
        }

        .brand-text span {
          display: block;
          margin-top: 2px;
          font-size: 10px;
          color: #71808c;
          letter-spacing: 0.3px;
        }

        .dashboard-nav-links {
          display: flex;
          align-items: center;
          gap: 32px;
          margin-left: auto;
          margin-right: 35px;
        }

        .dashboard-nav-links a {
          font-size: 14px;
          color: #516473;
          transition: 0.2s ease;
        }

        .dashboard-nav-links a:hover,
        .dashboard-nav-links a.active {
          color: #139fd3;
        }

        .dashboard-nav-actions {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .notification-btn {
          width: 40px;
          height: 40px;
          border: 1px solid #e0e7eb;
          border-radius: 50%;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #163d57;
          cursor: pointer;
          position: relative;
        }

        .notification-dot {
          width: 7px;
          height: 7px;
          background: #ef5b63;
          border-radius: 50%;
          position: absolute;
          top: 8px;
          right: 8px;
        }

        .profile-mini {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .profile-avatar {
          width: 39px;
          height: 39px;
          border-radius: 50%;
          background: #dff4fb;
          color: #149fd2;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
        }

        .profile-mini strong {
          display: block;
          font-size: 13px;
          color: #183b54;
        }

        .profile-mini span {
          display: block;
          font-size: 10px;
          color: #7a8993;
          margin-top: 2px;
          text-transform: capitalize;
        }

        /* ================= MAIN CONTENT ================= */

        .dashboard-content {
          max-width: 1380px;
          margin: 0 auto;
          padding: 42px 45px 90px;
        }

        /* ================= WELCOME ================= */

        .welcome-section {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 34px;
        }

        .welcome-label {
          margin: 0 0 8px;
          color: #159fd2;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 1.2px;
        }

        .welcome-section h1 {
          margin: 0;
          font-size: 32px;
          color: #12324a;
          line-height: 1.2;
        }

        .welcome-description {
          margin: 10px 0 0;
          color: #71818d;
          font-size: 14px;
        }

        .report-button {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #159fd2;
          color: white;
          border-radius: 9px;
          padding: 13px 20px;
          font-size: 14px;
          font-weight: 600;
          transition: 0.2s ease;
        }

        .report-button:hover {
          background: #0c8fbe;
          transform: translateY(-1px);
        }

        /* ================= STATS ================= */

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 30px;
        }

        .stat-card {
          background: white;
          border: 1px solid #e3eaee;
          border-radius: 14px;
          padding: 23px;
          display: flex;
          align-items: center;
          gap: 17px;
          min-height: 132px;
          box-shadow: 0 3px 12px rgba(20, 55, 75, 0.03);
        }

        .stat-icon {
          width: 47px;
          height: 47px;
          min-width: 47px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-icon.blue {
          background: #e7f5fb;
          color: #159fd2;
        }

        .stat-icon.orange {
          background: #fff1e4;
          color: #ec963f;
        }

        .stat-icon.green {
          background: #e7f7ef;
          color: #36a66d;
        }

        .stat-icon.purple {
          background: #f1eafd;
          color: #8d68c9;
        }

        .stat-info span {
          display: block;
          font-size: 13px;
          color: #71818d;
          margin-bottom: 5px;
        }

        .stat-info strong {
          display: block;
          font-size: 27px;
          color: #12324a;
        }

        .stat-info small {
          display: block;
          font-size: 10px;
          color: #8a979f;
          margin-top: 4px;
        }

        /* ================= LOWER GRID ================= */

        .dashboard-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 350px;
          gap: 24px;
          align-items: start;
        }

        .issues-panel,
        .notifications-card {
          background: white;
          border: 1px solid #e3eaee;
          border-radius: 14px;
          box-shadow: 0 3px 12px rgba(20, 55, 75, 0.03);
        }

        .issues-panel {
          padding: 25px;
        }

        .panel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 20px;
        }

        .panel-header h2 {
          margin: 0;
          font-size: 19px;
          color: #12324a;
        }

        .panel-header p {
          margin: 6px 0 0;
          font-size: 12px;
          color: #82909a;
        }

        .panel-header > a {
          display: flex;
          align-items: center;
          gap: 4px;
          color: #159fd2;
          font-size: 12px;
          font-weight: 600;
        }

        /* ================= ISSUE CARDS ================= */

        .issues-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .issue-card {
          border: 1px solid #e7ecef;
          border-radius: 10px;
          padding: 15px;
          display: flex;
          align-items: center;
          gap: 14px;
          transition: 0.2s ease;
        }

        .issue-card:hover {
          border-color: #cbdde5;
          transform: translateY(-1px);
        }

        .issue-icon {
          width: 42px;
          height: 42px;
          min-width: 42px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .issue-icon.progress {
          background: #fff2e3;
          color: #e89138;
        }

        .issue-icon.resolved {
          background: #e6f7ee;
          color: #36a56b;
        }

        .issue-icon.submitted {
          background: #eaf5fb;
          color: #159fd2;
        }

        .issue-info {
          flex: 1;
          min-width: 0;
        }

        .issue-title-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .issue-title-row h3 {
          margin: 0;
          font-size: 14px;
          color: #193d56;
        }

        .issue-status {
          padding: 4px 8px;
          border-radius: 20px;
          font-size: 9px;
          font-weight: 600;
        }

        .issue-status.progress {
          background: #fff0df;
          color: #db8129;
        }

        .issue-status.resolved {
          background: #e6f7ee;
          color: #32915f;
        }

        .issue-status.submitted {
          background: #e8f5fb;
          color: #168db8;
        }

        .issue-meta {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-top: 7px;
          color: #87949d;
          font-size: 10px;
        }

        .issue-meta span {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .issue-id {
          display: block;
          margin-top: 5px;
          color: #a0aab0;
          font-size: 9px;
        }

        .issue-arrow {
          width: 34px;
          height: 34px;
          border: 0;
          background: #f4f8fa;
          color: #547080;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        /* ================= EMPTY STATE ================= */

        .empty-issues {
          border: 1px dashed #d9e2e7;
          border-radius: 10px;
          padding: 45px 20px;
          text-align: center;
        }

        .empty-issues-icon {
          width: 50px;
          height: 50px;
          margin: 0 auto 12px;
          border-radius: 50%;
          background: #edf7fb;
          color: #159fd2;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .empty-issues h3 {
          margin: 0;
          font-size: 14px;
          color: #28485c;
        }

        .empty-issues p {
          margin: 7px 0 18px;
          color: #89969e;
          font-size: 11px;
        }

        .empty-issues a {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #159fd2;
          color: white;
          padding: 9px 15px;
          border-radius: 7px;
          font-size: 11px;
          font-weight: 600;
        }

        /* ================= SIDEBAR ================= */

        .dashboard-sidebar {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .quick-card {
          background: #123a54;
          color: white;
          border-radius: 14px;
          padding: 25px;
        }

        .quick-icon {
          width: 42px;
          height: 42px;
          border-radius: 10px;
          background: rgba(255,255,255,0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
        }

        .quick-card h3 {
          margin: 0;
          font-size: 18px;
        }

        .quick-card p {
          margin: 9px 0 20px;
          color: #c3d4de;
          font-size: 12px;
          line-height: 1.6;
        }

        .quick-card a {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: white;
          color: #123a54;
          border-radius: 7px;
          padding: 9px 13px;
          font-size: 11px;
          font-weight: 600;
        }

        /* ================= NOTIFICATIONS ================= */

        .notifications-card {
          padding: 22px;
        }

        .panel-header.small {
          padding-bottom: 14px;
        }

        .panel-header.small h2 {
          font-size: 16px;
        }

        .notification-item {
          display: flex;
          gap: 10px;
          padding: 13px 0;
          border-top: 1px solid #edf0f2;
        }

        .notification-icon {
          width: 31px;
          height: 31px;
          min-width: 31px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .notification-icon.green {
          background: #e7f7ef;
          color: #35a46a;
        }

        .notification-icon.blue {
          background: #e9f5fb;
          color: #159fd2;
        }

        .notification-icon.purple {
          background: #f0eafa;
          color: #8c69c9;
        }

        .notification-item p {
          margin: 0;
          font-size: 11px;
          line-height: 1.4;
          color: #466071;
        }

        .notification-item span {
          display: block;
          margin-top: 4px;
          font-size: 9px;
          color: #9aa5ac;
        }

        /* ================= MOBILE NAV ================= */

        .mobile-bottom-nav {
          display: none;
        }

        /* ================= RESPONSIVE ================= */

        @media (max-width: 1050px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .dashboard-grid {
            grid-template-columns: 1fr;
          }

          .dashboard-sidebar {
            display: grid;
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 760px) {
          .dashboard-navbar {
            height: 65px;
            padding: 0 18px;
          }

          .dashboard-nav-links {
            display: none;
          }

          .profile-mini > div:last-child {
            display: none;
          }

          .dashboard-content {
            padding: 28px 16px 90px;
          }

          .welcome-section {
            flex-direction: column;
            align-items: flex-start;
            gap: 18px;
          }

          .welcome-section h1 {
            font-size: 25px;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .dashboard-sidebar {
            display: flex;
          }

          .issue-title-row {
            align-items: flex-start;
            flex-direction: column;
            gap: 5px;
          }

          .issue-meta {
            flex-wrap: wrap;
            gap: 8px;
          }

          .mobile-bottom-nav {
            position: fixed;
            display: flex;
            left: 0;
            right: 0;
            bottom: 0;
            height: 68px;
            background: white;
            border-top: 1px solid #e3eaee;
            justify-content: space-around;
            align-items: center;
            z-index: 200;
          }

          .mobile-bottom-nav a {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 3px;
            color: #82909a;
            font-size: 9px;
          }

          .mobile-bottom-nav .mobile-nav-active {
            color: #159fd2;
          }

          .mobile-report {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background: #159fd2;
            color: white !important;
            display: flex !important;
            align-items: center;
            justify-content: center;
            margin-top: -20px;
            box-shadow: 0 4px 12px rgba(21,159,210,0.25);
          }

          .mobile-avatar {
            width: 21px;
            height: 21px;
            border-radius: 50%;
            background: #dff4fb;
            color: #159fd2;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 9px;
            font-weight: 700;
          }
        }

      `}</style>

      <div className="dashboard">

        {/* ================= NAVBAR ================= */}

        <header className="dashboard-navbar">

          <Link to="/dashboard" className="dashboard-brand">

            <div className="brand-logo">
              R
            </div>

            <div className="brand-text">
              <h2>ResolveX</h2>
              <span>Report • Track • Resolve</span>
            </div>

          </Link>

          <nav className="dashboard-nav-links">

            <Link
              to="/dashboard"
              className="active"
            >
              Dashboard
            </Link>

            <Link to="/my-issues">
              My Issues
            </Link>

            <Link to="/report">
              Report Issue
            </Link>

            <Link to="/about">
              About
            </Link>

          </nav>

          <div className="dashboard-nav-actions">

            <button className="notification-btn">
              <Bell size={19} />
              <span className="notification-dot"></span>
            </button>

            <div className="profile-mini">

              <div className="profile-avatar">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>

              <div>
                <strong>
                  {user?.name || "User"}
                </strong>

                <span>
                  {user?.role || "Citizen"} Account
                </span>
              </div>

            </div>

          </div>

        </header>

        {/* ================= MAIN CONTENT ================= */}

        <main className="dashboard-content">

          {/* ================= WELCOME ================= */}

          <section className="welcome-section">

            <div>

              <p className="welcome-label">
                CITIZEN DASHBOARD
              </p>

              <h1>
                Welcome back, {user?.name || "User"}! 👋
              </h1>

              <p className="welcome-description">
                Report problems, track your issues,
                and help make your city better.
              </p>

            </div>

            <Link
              to="/report"
              className="report-button"
            >
              <Plus size={20} />
              Report an Issue
            </Link>

          </section>

          {/* ================= USER INFORMATION ================= */}

          <section
            style={{
              background: "white",
              border: "1px solid #e3eaee",
              borderRadius: "14px",
              padding: "18px 22px",
              marginBottom: "25px",
              display: "flex",
              flexWrap: "wrap",
              gap: "28px",
              boxShadow: "0 3px 12px rgba(20, 55, 75, 0.03)",
            }}
          >

            <div>
              <span
                style={{
                  display: "block",
                  fontSize: "10px",
                  color: "#8a979f",
                  marginBottom: "4px",
                }}
              >
                NAME
              </span>

              <strong
                style={{
                  fontSize: "13px",
                  color: "#183b54",
                }}
              >
                {user?.name || "—"}
              </strong>
            </div>

            <div>
              <span
                style={{
                  display: "block",
                  fontSize: "10px",
                  color: "#8a979f",
                  marginBottom: "4px",
                }}
              >
                EMAIL
              </span>

              <strong
                style={{
                  fontSize: "13px",
                  color: "#183b54",
                }}
              >
                {user?.email || "—"}
              </strong>
            </div>

            <div>
              <span
                style={{
                  display: "block",
                  fontSize: "10px",
                  color: "#8a979f",
                  marginBottom: "4px",
                }}
              >
                PHONE
              </span>

              <strong
                style={{
                  fontSize: "13px",
                  color: "#183b54",
                }}
              >
                {user?.phone || "—"}
              </strong>
            </div>

          </section>

          {/* ================= STATS ================= */}

          <section className="stats-grid">

            <div className="stat-card">

              <div className="stat-icon blue">
                <FileText size={22} />
              </div>

              <div className="stat-info">

                <span>
                  Total Issues
                </span>

                <strong>
                  {totalIssues}
                </strong>

                <small>
                  Issues reported by you
                </small>

              </div>

            </div>

            <div className="stat-card">

              <div className="stat-icon orange">
                <Clock3 size={22} />
              </div>

              <div className="stat-info">

                <span>
                  In Progress
                </span>

                <strong>
                  {inProgressIssues}
                </strong>

                <small>
                  Currently being resolved
                </small>

              </div>

            </div>

            <div className="stat-card">

              <div className="stat-icon green">
                <CheckCircle2 size={22} />
              </div>

              <div className="stat-info">

                <span>
                  Resolved
                </span>

                <strong>
                  {resolvedIssues}
                </strong>

                <small>
                  Issues successfully resolved
                </small>

              </div>

            </div>

            <div className="stat-card">

              <div className="stat-icon purple">
                <MapPin size={22} />
              </div>

              <div className="stat-info">

                <span>
                  Your Impact
                </span>

                <strong>
                  {impact}%
                </strong>

                <small>
                  Resolution success rate
                </small>

              </div>

            </div>

          </section>

          {/* ================= LOWER AREA ================= */}

          <section className="dashboard-grid">

            {/* ================= RECENT ISSUES ================= */}

            <div className="issues-panel">

              <div className="panel-header">

                <div>

                  <h2>
                    Recent Issues
                  </h2>

                  <p>
                    Track the latest issues you've reported.
                  </p>

                </div>

                <Link to="/my-issues">

                  View all

                  <ChevronRight size={16} />

                </Link>

              </div>

              <div className="issues-list">

                {issues.length === 0 ? (

                  <div className="empty-issues">

                    <div className="empty-issues-icon">
                      <FileText size={22} />
                    </div>

                    <h3>
                      No issues reported yet
                    </h3>

                    <p>
                      Once you report an issue,
                      it will appear here.
                    </p>

                    <Link to="/report">
                      <Plus size={14} />
                      Report an Issue
                    </Link>

                  </div>

                ) : (

                  issues.map((issue) => (
                    <div
                      className="issue-card"
                      key={issue.id}
                    >

                      <div
                        className={`issue-icon ${issue.statusClass}`}
                      >
                        <FileText size={20} />
                      </div>

                      <div className="issue-info">

                        <div className="issue-title-row">

                          <h3>
                            {issue.title}
                          </h3>

                          <span
                            className={`issue-status ${issue.statusClass}`}
                          >
                            {issue.status}
                          </span>

                        </div>

                        <div className="issue-meta">

                          <span>
                            {issue.category}
                          </span>

                          <span>
                            <MapPin size={13} />
                            {issue.location}
                          </span>

                          <span>
                            {issue.date}
                          </span>

                        </div>

                        <span className="issue-id">
                          Issue #{issue.id}
                        </span>

                      </div>

                      <button className="issue-arrow">
                        <ArrowUpRight size={18} />
                      </button>

                    </div>
                  ))

                )}

              </div>

            </div>

            {/* ================= RIGHT SIDEBAR ================= */}

            <aside className="dashboard-sidebar">

              {/* QUICK ACTION */}

              <div className="quick-card">

                <div className="quick-icon">
                  <Plus size={22} />
                </div>

                <h3>
                  Spot something wrong?
                </h3>

                <p>
                  Help your community by reporting
                  a civic issue.
                </p>

                <Link to="/report">
                  Report an Issue
                  <ArrowUpRight size={16} />
                </Link>

              </div>

              {/* NOTIFICATIONS */}

              <div className="notifications-card">

                <div className="panel-header small">

                  <div>
                    <h2>
                      Notifications
                    </h2>
                  </div>

                  <Bell size={18} />

                </div>

                {/* No fake notifications */}
                <div
                  style={{
                    padding: "20px 0 8px",
                    textAlign: "center",
                    color: "#89969e",
                    fontSize: "11px",
                  }}
                >
                  No new notifications
                </div>

              </div>

            </aside>

          </section>

        </main>

        {/* ================= MOBILE NAV ================= */}

        <nav className="mobile-bottom-nav">

          <Link
            to="/dashboard"
            className="mobile-nav-active"
          >
            <FileText size={20} />
            <span>Home</span>
          </Link>

          <Link to="/my-issues">
            <Clock3 size={20} />
            <span>Issues</span>
          </Link>

          <Link
            to="/report"
            className="mobile-report"
          >
            <Plus size={25} />
          </Link>

          <Link to="/notifications">
            <Bell size={20} />
            <span>Alerts</span>
          </Link>

          <Link to="/profile">
            <div className="mobile-avatar">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <span>
              Profile
            </span>
          </Link>

        </nav>

      </div>
    </>
  );
}

export default Dashboard;