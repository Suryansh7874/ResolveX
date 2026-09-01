
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ClipboardList,
  Users,
  UserCog,
  AlertCircle,
  CheckCircle2,
  Clock3,
  ArrowUpRight,
  MapPin,
  Loader2,
  RefreshCw,
  UserPlus,
} from "lucide-react";

import api from "../services/api";

function AdminDashboard() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  // =========================================================
  // FETCH ISSUES
  // =========================================================

  const fetchIssues = async () => {
    try {
      setError("");

      const response = await api.get("/issues");

      console.log("ISSUES FROM BACKEND:", response.data);

      const fetchedIssues = response.data?.issues || [];

      setIssues(Array.isArray(fetchedIssues) ? fetchedIssues : []);
    } catch (err) {
      console.error("Failed to fetch issues:", err);

      setError(
        err.response?.data?.message ||
          "Failed to fetch issues. Please try again."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  // =========================================================
  // REFRESH
  // =========================================================

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchIssues();
  };

  // =========================================================
  // NORMALIZE STATUS
  // =========================================================

  const normalizeStatus = (status) => {
    return String(status || "")
      .trim()
      .toLowerCase()
      .replace(/[\s-]+/g, "_");
  };

  // =========================================================
  // CHECK ASSIGNMENT
  // =========================================================

  const isAssigned = (issue) => {
    if (!issue) return false;

    const status = normalizeStatus(issue.status);

    const possibleAssignmentValues = [
      issue.assignedTo,
      issue.assignedOfficer,
      issue.officer,
      issue.assigned_to,
      issue.assignedOfficerId,
      issue.officerId,
    ];

    const hasAssignedOfficer = possibleAssignmentValues.some((value) => {
      if (value === null || value === undefined || value === "") {
        return false;
      }

      if (typeof value === "object") {
        if (Array.isArray(value)) {
          return value.length > 0;
        }

        return (
          Object.keys(value).length > 0 &&
          Boolean(
            value._id ||
              value.id ||
              value.name ||
              value.email
          )
        );
      }

      return true;
    });

    return (
      hasAssignedOfficer ||
      status === "assigned" ||
      status === "in_progress" ||
      status === "inprogress"
    );
  };

  // =========================================================
  // STATISTICS
  // =========================================================

  const totalIssues = issues.length;

  const reportedIssues = issues.filter((issue) => {
    const status = normalizeStatus(issue.status);

    return (
      status === "reported" ||
      status === "pending" ||
      status === "submitted"
    );
  }).length;

  const assignedIssues = issues.filter((issue) =>
    isAssigned(issue)
  ).length;

  const inProgressIssues = issues.filter((issue) => {
    const status = normalizeStatus(issue.status);

    return (
      status === "in_progress" ||
      status === "inprogress"
    );
  }).length;

  const resolvedIssues = issues.filter((issue) => {
    const status = normalizeStatus(issue.status);

    return (
      status === "resolved" ||
      status === "completed" ||
      status === "closed"
    );
  }).length;

  const awaitingAssignment = issues.filter(
    (issue) => !isAssigned(issue)
  ).length;

  // =========================================================
  // STATUS HELPERS
  // =========================================================

  const getStatusLabel = (status) => {
    const normalized = normalizeStatus(status);

    if (normalized === "reported") return "Reported";
    if (normalized === "verified") return "Verified";
    if (normalized === "assigned") return "Assigned";

    if (
      normalized === "in_progress" ||
      normalized === "inprogress"
    ) {
      return "In Progress";
    }

    if (
      normalized === "resolved" ||
      normalized === "completed" ||
      normalized === "closed"
    ) {
      return "Resolved";
    }

    return status || "Unknown";
  };

  const getStatusClass = (status) => {
    const normalized = normalizeStatus(status);

    if (normalized === "reported") {
      return "status-reported";
    }

    if (normalized === "verified") {
      return "status-verified";
    }

    if (normalized === "assigned") {
      return "status-assigned";
    }

    if (
      normalized === "in_progress" ||
      normalized === "inprogress"
    ) {
      return "status-progress";
    }

    if (
      normalized === "resolved" ||
      normalized === "completed" ||
      normalized === "closed"
    ) {
      return "status-resolved";
    }

    return "status-default";
  };

  // =========================================================
  // RECENT ISSUES
  // =========================================================

  const recentIssues = [...issues]
    .sort((a, b) => {
      const dateA = new Date(
        a.createdAt || a.created_at || 0
      ).getTime();

      const dateB = new Date(
        b.createdAt || b.created_at || 0
      ).getTime();

      return dateB - dateA;
    })
    .slice(0, 5);

  // =========================================================
  // DATE
  // =========================================================

  const formatDate = (date) => {
    if (!date) return "Recently";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return "Recently";
    }

    return parsed.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // =========================================================
  // LOCATION
  // =========================================================

  const getLocation = (issue) => {
    if (!issue) return "Location not available";

    if (typeof issue.location === "string") {
      return issue.location;
    }

    if (issue.location?.address) {
      return issue.location.address;
    }

    if (issue.location?.name) {
      return issue.location.name;
    }

    if (issue.location?.coordinates) {
      const coordinates = issue.location.coordinates;

      if (
        Array.isArray(coordinates) &&
        coordinates.length >= 2
      ) {
        return `${coordinates[1].toFixed(4)}, ${coordinates[0].toFixed(4)}`;
      }
    }

    if (issue.address) {
      return issue.address;
    }

    return "Location not available";
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }

        .admin-page {
          min-height: 100vh;
          background: #f6f9fc;
          padding: 36px 45px 60px;
          color: #173f5f;
        }

        .admin-container {
          max-width: 1180px;
          margin: 0 auto;
        }

        /* HEADER */

        .admin-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 34px;
          gap: 20px;
        }

        .admin-header-label {
          color: #009bd5;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-bottom: 12px;
        }

        .admin-title {
          margin: 0;
          font-size: 40px;
          line-height: 1.15;
          color: #153f61;
          font-weight: 750;
        }

        .admin-subtitle {
          margin: 10px 0 0;
          color: #71879a;
          font-size: 17px;
        }

        /* REFRESH */

        .refresh-btn {
          border: 1px solid #d8e4ed;
          background: white;
          color: #008dcc;
          border-radius: 11px;
          padding: 12px 18px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 650;
          cursor: pointer;
          transition: 0.2s ease;
        }

        .refresh-btn:hover:not(:disabled) {
          background: #f8fcff;
          border-color: #bdd9e6;
        }

        .refresh-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .spin {
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        /* ERROR */

        .error-box {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px 17px;
          margin-bottom: 24px;
          border: 1px solid #f1caca;
          background: #fff5f5;
          color: #b42318;
          border-radius: 12px;
          font-size: 14px;
        }

        /* STATS */

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 25px;
        }

        .stat-card {
          background: white;
          border: 1px solid #dce7ef;
          border-radius: 18px;
          padding: 23px;
          min-height: 145px;
          display: flex;
          align-items: center;
          gap: 17px;
          box-shadow:
            0 3px 12px rgba(18, 63, 101, 0.035);
        }

        .stat-icon {
          width: 59px;
          height: 59px;
          border-radius: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .stat-icon.blue {
          background: #e3f6fc;
          color: #009bd6;
        }

        .stat-icon.orange {
          background: #fff2db;
          color: #e99a00;
        }

        .stat-icon.purple {
          background: #eee7ff;
          color: #7956d5;
        }

        .stat-icon.green {
          background: #ddf7ed;
          color: #08ad75;
        }

        .stat-info {
          min-width: 0;
        }

        .stat-info span {
          display: block;
          color: #71889c;
          font-size: 14px;
          margin-bottom: 8px;
        }

        .stat-info strong {
          display: block;
          color: #153f61;
          font-size: 35px;
          line-height: 1;
          font-weight: 750;
        }

        /* MAIN GRID */

        .dashboard-grid {
          display: grid;
          grid-template-columns: 0.95fr 1.35fr;
          gap: 22px;
          margin-bottom: 22px;
        }

        .dashboard-card {
          background: white;
          border: 1px solid #dce7ef;
          border-radius: 18px;
          padding: 24px;
          box-shadow:
            0 3px 12px rgba(18, 63, 101, 0.035);
        }

        .section-heading,
        .panel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          margin-bottom: 22px;
        }

        .section-heading h2,
        .panel-header h2 {
          margin: 0;
          color: #153f61;
          font-size: 19px;
          font-weight: 700;
        }

        .section-heading p,
        .panel-header p {
          margin: 6px 0 0;
          color: #7d92a3;
          font-size: 13px;
        }

        .view-all {
          color: #008dcc;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 13px;
          font-weight: 650;
        }

        .view-all:hover {
          text-decoration: underline;
        }

        /* STATUS */

        .status-row {
          margin-bottom: 20px;
        }

        .status-row:last-child {
          margin-bottom: 0;
        }

        .status-row-top {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .status-name {
          color: #5f778b;
          font-size: 14px;
        }

        .status-count {
          color: #153f61;
          font-weight: 700;
          font-size: 14px;
        }

        .progress-track {
          width: 100%;
          height: 8px;
          border-radius: 20px;
          background: #edf2f6;
          overflow: hidden;
        }

        .progress-bar {
          height: 100%;
          border-radius: 20px;
          background: #08a7db;
        }

        .progress-orange {
          background: #eba022;
        }

        .progress-purple {
          background: #7c57d9;
        }

        .progress-green {
          background: #0ab77b;
        }

        /* RECENT ISSUES */

        .issues-list {
          display: flex;
          flex-direction: column;
        }

        .issue-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          padding: 14px 0;
          border-bottom: 1px solid #edf1f4;
        }

        .issue-item:first-child {
          padding-top: 0;
        }

        .issue-item:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .issue-main {
          min-width: 0;
          flex: 1;
        }

        .issue-title {
          color: #16466b;
          font-size: 14px;
          font-weight: 650;
          margin-bottom: 6px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .issue-location {
          display: flex;
          align-items: center;
          gap: 4px;
          color: #8297a8;
          font-size: 12px;
        }

        .issue-right {
          text-align: right;
          flex-shrink: 0;
        }

        .status-badge {
          display: inline-flex;
          padding: 5px 9px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 700;
        }

        .status-reported {
          background: #fff2d9;
          color: #bd7900;
        }

        .status-verified {
          background: #e7f0ff;
          color: #3d70b5;
        }

        .status-assigned {
          background: #eee6ff;
          color: #704cc7;
        }

        .status-progress {
          background: #e1f5fc;
          color: #007fa9;
        }

        .status-resolved {
          background: #dcf7ed;
          color: #008b60;
        }

        .status-default {
          background: #edf2f5;
          color: #62798b;
        }

        .issue-date {
          margin-top: 6px;
          color: #94a5b3;
          font-size: 11px;
        }

        .empty-state {
          min-height: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #8398a9;
          font-size: 14px;
        }

        /* QUICK ACTIONS */

        .quick-actions {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 15px;
        }

        .action-card {
          display: flex;
          align-items: center;
          gap: 13px;
          padding: 18px;
          border: 1px solid #dce7ef;
          border-radius: 14px;
          text-decoration: none;
          background: white;
          transition: 0.2s ease;
        }

        .action-card:hover {
          transform: translateY(-2px);
          box-shadow:
            0 7px 18px rgba(18, 63, 101, 0.06);
        }

        .action-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: #e3f6fc;
          color: #009bd6;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .action-text {
          flex: 1;
        }

        .action-title {
          color: #153f61;
          font-size: 14px;
          font-weight: 700;
        }

        .action-description {
          color: #8498a8;
          font-size: 12px;
          margin-top: 3px;
        }

        .action-arrow {
          color: #8da0af;
        }

        /* ASSIGNMENT */

        .assignment-panel {
          margin-top: 22px;
        }

        .assignment-summary {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        .assignment-left {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .assignment-icon {
          width: 48px;
          height: 48px;
          border-radius: 13px;
          background: #fff2db;
          color: #e99a00;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .assignment-number {
          color: #153f61;
          font-size: 27px;
          font-weight: 750;
        }

        .assignment-label {
          color: #788fa1;
          font-size: 13px;
          margin-top: 2px;
        }

        .assign-link {
          background: #009bd6;
          color: white;
          text-decoration: none;
          border-radius: 9px;
          padding: 10px 15px;
          font-size: 13px;
          font-weight: 650;
        }

        .assign-link:hover {
          background: #0088be;
        }

        /* RESPONSIVE */

        @media (max-width: 1050px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .dashboard-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 700px) {
          .admin-page {
            padding: 25px 16px 45px;
          }

          .admin-header {
            flex-direction: column;
            align-items: stretch;
          }

          .admin-title {
            font-size: 31px;
          }

          .refresh-btn {
            justify-content: center;
          }

          .quick-actions {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 500px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }

          .assignment-summary {
            flex-direction: column;
            align-items: stretch;
          }

          .assign-link {
            text-align: center;
          }

          .issue-item {
            align-items: flex-start;
          }

          .issue-right {
            max-width: 110px;
          }
        }
      `}</style>

      <main className="admin-page">
        <div className="admin-container">

          {/* HEADER */}

          <header className="admin-header">
            <div>
              <div className="admin-header-label">
                Overview
              </div>

              <h1 className="admin-title">
                Admin Dashboard
              </h1>

              <p className="admin-subtitle">
                Monitor civic issues and track their resolution status.
              </p>
            </div>

            <button
              className="refresh-btn"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw
                size={17}
                className={refreshing ? "spin" : ""}
              />

              {refreshing
                ? "Refreshing..."
                : "Refresh"}
            </button>
          </header>

          {/* ERROR */}

          {error && (
            <div className="error-box">
              <AlertCircle size={19} />
              <span>{error}</span>
            </div>
          )}

          {/* STATS */}

          <section className="stats-grid">

            <div className="stat-card">
              <div className="stat-icon blue">
                <ClipboardList size={27} />
              </div>

              <div className="stat-info">
                <span>Total Issues</span>

                <strong>
                  {loading ? "—" : totalIssues}
                </strong>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon orange">
                <Clock3 size={27} />
              </div>

              <div className="stat-info">
                <span>Reported</span>

                <strong>
                  {loading ? "—" : reportedIssues}
                </strong>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon purple">
                <Users size={27} />
              </div>

              <div className="stat-info">
                <span>Assigned</span>

                <strong>
                  {loading ? "—" : assignedIssues}
                </strong>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon green">
                <CheckCircle2 size={27} />
              </div>

              <div className="stat-info">
                <span>Resolved</span>

                <strong>
                  {loading ? "—" : resolvedIssues}
                </strong>
              </div>
            </div>

          </section>

          {/* ISSUE STATUS + RECENT ISSUES */}

          <section className="dashboard-grid">

            {/* ISSUE STATUS */}

            <section className="dashboard-card">

              <div className="section-heading">
                <div>
                  <h2>Issue Status</h2>

                  <p>
                    Current status of all reported issues.
                  </p>
                </div>
              </div>

              {loading ? (
                <div className="empty-state">
                  <Loader2
                    size={22}
                    className="spin"
                  />
                </div>
              ) : (
                <>
                  <div className="status-row">
                    <div className="status-row-top">
                      <span className="status-name">
                        Reported
                      </span>

                      <span className="status-count">
                        {reportedIssues}
                      </span>
                    </div>

                    <div className="progress-track">
                      <div
                        className="progress-bar progress-orange"
                        style={{
                          width: `${
                            totalIssues
                              ? (reportedIssues /
                                  totalIssues) *
                                100
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="status-row">
                    <div className="status-row-top">
                      <span className="status-name">
                        Assigned
                      </span>

                      <span className="status-count">
                        {assignedIssues}
                      </span>
                    </div>

                    <div className="progress-track">
                      <div
                        className="progress-bar progress-purple"
                        style={{
                          width: `${
                            totalIssues
                              ? (assignedIssues /
                                  totalIssues) *
                                100
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="status-row">
                    <div className="status-row-top">
                      <span className="status-name">
                        In Progress
                      </span>

                      <span className="status-count">
                        {inProgressIssues}
                      </span>
                    </div>

                    <div className="progress-track">
                      <div
                        className="progress-bar"
                        style={{
                          width: `${
                            totalIssues
                              ? (inProgressIssues /
                                  totalIssues) *
                                100
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="status-row">
                    <div className="status-row-top">
                      <span className="status-name">
                        Resolved
                      </span>

                      <span className="status-count">
                        {resolvedIssues}
                      </span>
                    </div>

                    <div className="progress-track">
                      <div
                        className="progress-bar progress-green"
                        style={{
                          width: `${
                            totalIssues
                              ? (resolvedIssues /
                                  totalIssues) *
                                100
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                </>
              )}

            </section>

            {/* RECENT ISSUES */}

            <section className="dashboard-card">

              <div className="panel-header">
                <div>
                  <h2>Recent Issues</h2>

                  <p>
                    Latest civic issues reported.
                  </p>
                </div>

                <Link
                  to="/admin/issues"
                  className="view-all"
                >
                  View all
                  <ArrowUpRight size={15} />
                </Link>
              </div>

              {loading ? (
                <div className="empty-state">
                  <Loader2
                    size={22}
                    className="spin"
                  />
                </div>
              ) : recentIssues.length === 0 ? (
                <div className="empty-state">
                  No issues reported yet.
                </div>
              ) : (
                <div className="issues-list">

                  {recentIssues.map((issue) => (
                    <div
                      className="issue-item"
                      key={
                        issue._id ||
                        issue.id
                      }
                    >

                      <div className="issue-main">

                        <div className="issue-title">
                          {issue.title ||
                            issue.category ||
                            issue.description ||
                            "Civic Issue"}
                        </div>

                        <div className="issue-location">
                          <MapPin size={13} />

                          {getLocation(issue)}
                        </div>

                      </div>

                      <div className="issue-right">

                        <span
                          className={`status-badge ${getStatusClass(
                            issue.status
                          )}`}
                        >
                          {getStatusLabel(
                            issue.status
                          )}
                        </span>

                        <div className="issue-date">
                          {formatDate(
                            issue.createdAt ||
                              issue.created_at
                          )}
                        </div>

                      </div>

                    </div>
                  ))}

                </div>
              )}

            </section>

          </section>

          {/* QUICK ACTIONS */}

          <section className="dashboard-card">

            <div className="section-heading">
              <div>
                <h2>Quick Actions</h2>

                <p>
                  Quickly access admin management pages.
                </p>
              </div>
            </div>

            <div className="quick-actions">

              <Link
                to="/admin/issues"
                className="action-card"
              >
                <div className="action-icon">
                  <ClipboardList size={22} />
                </div>

                <div className="action-text">
                  <div className="action-title">
                    Manage Issues
                  </div>

                  <div className="action-description">
                    View and manage civic issues
                  </div>
                </div>

                <ArrowUpRight
                  size={18}
                  className="action-arrow"
                />
              </Link>

              <Link
                to="/admin/officers"
                className="action-card"
              >
                <div className="action-icon">
                  <UserCog size={22} />
                </div>

                <div className="action-text">
                  <div className="action-title">
                    Manage Officers
                  </div>

                  <div className="action-description">
                    Assign and manage officers
                  </div>
                </div>

                <ArrowUpRight
                  size={18}
                  className="action-arrow"
                />
              </Link>

              <Link
                to="/admin/citizens"
                className="action-card"
              >
                <div className="action-icon">
                  <Users size={22} />
                </div>

                <div className="action-text">
                  <div className="action-title">
                    View Citizens
                  </div>

                  <div className="action-description">
                    View registered citizens
                  </div>
                </div>

                <ArrowUpRight
                  size={18}
                  className="action-arrow"
                />
              </Link>

            </div>

          </section>

          {/* ISSUES AWAITING ASSIGNMENT */}

          <section className="dashboard-card assignment-panel">

            <div className="section-heading">

              <div>
                <h2>
                  Issues Awaiting Assignment
                </h2>

                <p>
                  Issues that currently don't have an officer.
                </p>
              </div>

              <Link
                to="/admin/issues"
                className="view-all"
              >
                Manage
                <ArrowUpRight size={15} />
              </Link>

            </div>

            <div className="assignment-summary">

              <div className="assignment-left">

                <div className="assignment-icon">
                  <UserPlus size={23} />
                </div>

                <div>

                  <div className="assignment-number">
                    {loading
                      ? "—"
                      : awaitingAssignment}
                  </div>

                  <div className="assignment-label">
                    {awaitingAssignment === 1
                      ? "issue needs officer assignment"
                      : "issues need officer assignment"}
                  </div>

                </div>

              </div>

              {awaitingAssignment > 0 && (
                <Link
                  to="/admin/issues"
                  className="assign-link"
                >
                  Assign Officers
                </Link>
              )}

            </div>

          </section>

        </div>
      </main>
    </>
  );
}

export default AdminDashboard;

