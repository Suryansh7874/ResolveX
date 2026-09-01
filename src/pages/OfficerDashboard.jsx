

import { useEffect, useState } from "react";
import api from "../services/api";

function OfficerDashboard() {
  const [officer, setOfficer] = useState(null);
  const [issues, setIssues] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState(null);

  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [error, setError] = useState("");

  /* =========================================================
     FETCH OFFICER DASHBOARD
  ========================================================= */

  useEffect(() => {
    fetchOfficerDashboard();
  }, []);

  const fetchOfficerDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Authentication token not found. Please login again.");
        return;
      }

      const response = await api.get("/officer/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("OFFICER DASHBOARD:", response.data);

      const dashboard = response.data?.data;

      if (!dashboard) {
        setError("Invalid dashboard response from server.");
        return;
      }

      setOfficer(dashboard.officer || null);

      const formattedIssues = (dashboard.issues || []).map(formatIssue);

      setIssues(formattedIssues);

      if (formattedIssues.length > 0) {
        fetchIssueDetails(formattedIssues[0]._id);
      } else {
        setSelectedIssue(null);
      }
    } catch (err) {
      console.error("Officer dashboard error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load officer dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     FORMAT ISSUE
  ========================================================= */

  const formatIssue = (issue) => {
    return {
      ...issue,

      _id: issue?._id,

      displayId: issue?._id
        ? `#${issue._id.toString().slice(-6).toUpperCase()}`
        : "#----",

      title: issue?.title || "Untitled Issue",

      description:
        issue?.description || "No description available.",

      category: issue?.category || "Unknown",

      priority: issue?.priority || "MEDIUM",

      status: issue?.status || "REPORTED",

      media: Array.isArray(issue?.media)
        ? issue.media
        : [],

      location: issue?.location || null,

      reportedBy: issue?.reportedBy || null,

      assignedTo: issue?.assignedTo || null,
    };
  };

  /* =========================================================
     FETCH ISSUE DETAILS
  ========================================================= */

  const fetchIssueDetails = async (issueId) => {
    if (!issueId) return;

    try {
      setDetailsLoading(true);

      const token = localStorage.getItem("token");

      if (!token) return;

      const response = await api.get(
        `/officer/issues/${issueId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("OFFICER ISSUE DETAILS:", response.data);

      const issue =
        response.data?.issue ||
        response.data?.data?.issue ||
        response.data?.data;

      if (issue) {
        setSelectedIssue(formatIssue(issue));
      }
    } catch (err) {
      console.error("Issue details error:", err);

      setSelectedIssue((previous) => {
        if (previous?._id === issueId) {
          return previous;
        }

        const localIssue = issues.find(
          (item) => item._id === issueId
        );

        return localIssue || previous;
      });
    } finally {
      setDetailsLoading(false);
    }
  };

  /* =========================================================
     SELECT ISSUE
  ========================================================= */

  const handleSelectIssue = (issue) => {
    setSelectedIssue(issue);
    fetchIssueDetails(issue._id);
  };

  /* =========================================================
     STATUS UPDATE
  ========================================================= */

  const handleStatusUpdate = async () => {
    if (!selectedIssue) return;

    let newStatus = "";

    if (selectedIssue.status === "ASSIGNED") {
      newStatus = "IN_PROGRESS";
    } else if (selectedIssue.status === "IN_PROGRESS") {
      newStatus = "RESOLVED";
    } else {
      return;
    }

    try {
      setUpdatingStatus(true);

      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login again.");
        return;
      }

      const response = await api.post(
        `/issues/${selectedIssue._id}/status`,
        {
          status: newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("STATUS UPDATE:", response.data);

      const updatedIssue =
        response.data?.issue ||
        response.data?.data?.issue ||
        response.data?.data;

      if (updatedIssue) {
        const formattedUpdatedIssue =
          formatIssue(updatedIssue);

        setSelectedIssue(formattedUpdatedIssue);

        setIssues((previousIssues) =>
          previousIssues.map((issue) =>
            issue._id === selectedIssue._id
              ? {
                  ...issue,
                  ...formattedUpdatedIssue,
                }
              : issue
          )
        );
      } else {
        setSelectedIssue((previous) => ({
          ...previous,
          status: newStatus,
        }));

        setIssues((previousIssues) =>
          previousIssues.map((issue) =>
            issue._id === selectedIssue._id
              ? {
                  ...issue,
                  status: newStatus,
                }
              : issue
          )
        );
      }
    } catch (err) {
      console.error("STATUS UPDATE ERROR:", err);

      alert(
        err.response?.data?.message ||
          "Unable to update issue status."
      );
    } finally {
      setUpdatingStatus(false);
    }
  };

  /* =========================================================
     STATUS HELPERS
  ========================================================= */

  const normalizeValue = (value) => {
    return String(value || "")
      .trim()
      .toUpperCase()
      .replaceAll(" ", "_");
  };

  const getStatusClass = (status) => {
    const normalized = normalizeValue(status);

    switch (normalized) {
      case "ASSIGNED":
        return "status-assigned";

      case "IN_PROGRESS":
      case "INPROGRESS":
        return "status-progress";

      case "RESOLVED":
        return "status-resolved";

      case "VERIFIED":
        return "status-verified";

      case "REPORTED":
        return "status-reported";

      default:
        return "status-reported";
    }
  };

  const getPriorityClass = (priority) => {
    const normalized = normalizeValue(priority);

    switch (normalized) {
      case "CRITICAL":
        return "priority-critical";

      case "HIGH":
        return "priority-high";

      case "MEDIUM":
        return "priority-medium";

      case "LOW":
        return "priority-low";

      default:
        return "priority-medium";
    }
  };

  const formatStatus = (status) => {
    if (!status) return "Unknown";

    return String(status)
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  const formatCategory = (category) => {
    if (!category) return "Unknown";

    return String(category)
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  /* =========================================================
     MEDIA URL
     
     IMPORTANT:
     Backend is NOT being changed.
     
     We intentionally convert:
     
     http://localhost:5000/uploads/file.jpg
     
     INTO:
     
     /uploads/file.jpg
     
     Vite will proxy /uploads to localhost:5000.
  ========================================================= */

  const getMediaUrl = (url) => {
    if (!url) return "";

    const stringUrl = String(url).trim();

    if (!stringUrl) return "";

    // Backend gives full URL
    if (
      stringUrl.startsWith("http://localhost:5000") ||
      stringUrl.startsWith("https://localhost:5000")
    ) {
      return stringUrl.replace(
        /^https?:\/\/localhost:5000/,
        ""
      );
    }

    // Backend gives localhost:5173 URL
    if (stringUrl.includes("localhost:5173")) {
      const path = stringUrl.split("localhost:5173")[1];

      return path.startsWith("/")
        ? path
        : `/${path}`;
    }

    // Already a relative uploads path
    if (stringUrl.startsWith("/")) {
      return stringUrl;
    }

    // uploads/file.jpg
    return `/${stringUrl}`;
  };

  /* =========================================================
     MEDIA ERROR
  ========================================================= */

  const handleMediaError = (event, mediaUrl) => {
    console.error("IMAGE LOAD ERROR:", mediaUrl);

    event.currentTarget.style.display = "none";

    const parent = event.currentTarget.parentElement;

    if (parent) {
      parent.classList.add("media-error-container");

      const errorDiv = document.createElement("div");

      errorDiv.className = "media-error";

      errorDiv.innerHTML = `
        <span>🖼️</span>
        <small>Image unavailable</small>
      `;

      parent.appendChild(errorDiv);
    }
  };

  /* =========================================================
     LOCATION
  ========================================================= */

  const getCoordinates = () => {
    const coordinates =
      selectedIssue?.location?.coordinates;

    if (
      !Array.isArray(coordinates) ||
      coordinates.length < 2
    ) {
      return null;
    }

    const longitude = Number(coordinates[0]);
    const latitude = Number(coordinates[1]);

    if (
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude)
    ) {
      return null;
    }

    return {
      latitude,
      longitude,
    };
  };

  const openGoogleMaps = () => {
    const coordinates = getCoordinates();

    if (!coordinates) {
      alert("Location coordinates are not available.");
      return;
    }

    const { latitude, longitude } = coordinates;

    window.open(
      `https://www.google.com/maps?q=${latitude},${longitude}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  /* =========================================================
     COUNTS
  ========================================================= */

  const assignedCount = issues.filter(
    (issue) =>
      normalizeValue(issue.status) === "ASSIGNED"
  ).length;

  const inProgressCount = issues.filter((issue) => {
    const status = normalizeValue(issue.status);

    return (
      status === "IN_PROGRESS" ||
      status === "INPROGRESS"
    );
  }).length;

  const resolvedCount = issues.filter(
    (issue) =>
      normalizeValue(issue.status) === "RESOLVED"
  ).length;

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <>
        <style>{`
          .loading-page {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f8fafc;
            font-family: Inter, Arial, sans-serif;
          }

          .loading-box {
            background: white;
            padding: 35px 45px;
            border-radius: 16px;
            border: 1px solid #e5e7eb;
            box-shadow: 0 5px 25px rgba(15, 23, 42, 0.08);
            text-align: center;
          }

          .spinner {
            width: 35px;
            height: 35px;
            border: 4px solid #dbeafe;
            border-top-color: #2563eb;
            border-radius: 50%;
            animation: officerSpin 0.8s linear infinite;
            margin: 0 auto 15px;
          }

          @keyframes officerSpin {
            to {
              transform: rotate(360deg);
            }
          }

          .loading-box p {
            margin: 0;
            color: #64748b;
            font-size: 14px;
          }
        `}</style>

        <div className="loading-page">
          <div className="loading-box">
            <div className="spinner"></div>
            <p>Loading officer dashboard...</p>
          </div>
        </div>
      </>
    );
  }

  /* =========================================================
     ERROR
  ========================================================= */

  if (error) {
    return (
      <>
        <style>{`
          .error-page {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f8fafc;
            font-family: Inter, Arial, sans-serif;
          }

          .error-box {
            width: min(450px, 90%);
            background: white;
            border: 1px solid #fecaca;
            border-radius: 16px;
            padding: 35px;
            text-align: center;
            box-shadow: 0 8px 30px rgba(15, 23, 42, 0.06);
          }

          .error-icon {
            font-size: 42px;
            margin-bottom: 15px;
          }

          .error-box h2 {
            margin: 0 0 10px;
            color: #b91c1c;
          }

          .error-box p {
            color: #64748b;
            font-size: 14px;
            line-height: 1.6;
          }

          .retry-button {
            margin-top: 15px;
            border: none;
            background: #2563eb;
            color: white;
            padding: 11px 20px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
          }

          .retry-button:hover {
            background: #1d4ed8;
          }
        `}</style>

        <div className="error-page">
          <div className="error-box">
            <div className="error-icon">⚠️</div>

            <h2>Unable to load dashboard</h2>

            <p>{error}</p>

            <button
              className="retry-button"
              onClick={fetchOfficerDashboard}
            >
              Try Again
            </button>
          </div>
        </div>
      </>
    );
  }

  /* =========================================================
     MAIN UI
  ========================================================= */

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          font-family: Inter, Arial, sans-serif;
          background: #f8fafc;
          color: #111827;
        }

        .officer-page {
          min-height: 100vh;
          background: #f8fafc;
        }

        /* ================= NAVBAR ================= */

        .officer-navbar {
          min-height: 72px;
          background: #ffffff;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 42px;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 19px;
          font-weight: 700;
          color: #111827;
        }

        .brand-logo {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #eff6ff;
          font-size: 21px;
        }

        .officer-nav-right {
          display: flex;
          align-items: center;
          gap: 22px;
        }

        .notification-btn {
          width: 40px;
          height: 40px;
          border: 1px solid #e5e7eb;
          background: white;
          border-radius: 10px;
          font-size: 18px;
          cursor: pointer;
        }

        .notification-btn:hover {
          background: #f8fafc;
        }

        .officer-account {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .officer-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #e0ecff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
        }

        .officer-name {
          margin: 0;
          font-size: 14px;
          font-weight: 600;
        }

        .officer-id {
          margin: 2px 0 0;
          color: #64748b;
          font-size: 12px;
        }

        .dropdown-arrow {
          font-size: 18px;
          color: #64748b;
        }

        /* ================= MAIN ================= */

        .officer-container {
          max-width: 1380px;
          margin: auto;
          padding: 32px 38px 50px;
        }

        .page-heading {
          margin-bottom: 25px;
        }

        .page-heading h1 {
          margin: 0;
          font-size: 30px;
          font-weight: 700;
        }

        .page-heading p {
          margin-top: 7px;
          color: #64748b;
          font-size: 14px;
        }

        /* ================= CARDS ================= */

        .dashboard-card {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
        }

        /* ================= TOP ================= */

        .top-grid {
          display: grid;
          grid-template-columns: 1fr 1.25fr;
          gap: 20px;
          margin-bottom: 20px;
        }

        .profile-card {
          min-height: 170px;
          padding: 25px;
          display: flex;
          align-items: center;
          gap: 22px;
        }

        .profile-avatar {
          width: 100px;
          height: 100px;
          flex-shrink: 0;
          border-radius: 50%;
          background: #eaf2ff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 48px;
        }

        .profile-content h2 {
          margin: 0;
          font-size: 20px;
        }

        .welcome-text {
          margin: 7px 0 18px;
          color: #64748b;
          font-size: 14px;
        }

        .profile-info {
          display: flex;
          gap: 12px;
        }

        .info-box {
          min-width: 125px;
          padding: 10px 14px;
          background: #f8fafc;
          border-radius: 9px;
        }

        .info-box span {
          display: block;
          color: #64748b;
          font-size: 12px;
          margin-bottom: 4px;
        }

        .info-box strong {
          color: #2563eb;
          font-size: 14px;
        }

        /* ================= SUMMARY ================= */

        .summary-card {
          padding: 25px;
        }

        .summary-card h2 {
          margin: 0 0 20px;
          font-size: 18px;
        }

        .summary-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .summary-item {
          padding: 18px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 13px;
        }

        .assigned-summary {
          background: #eff6ff;
        }

        .progress-summary {
          background: #fff7ed;
        }

        .resolved-summary {
          background: #f0fdf4;
        }

        .summary-icon {
          font-size: 23px;
        }

        .summary-item strong {
          display: block;
          font-size: 25px;
        }

        .summary-item span {
          font-size: 12px;
          color: #64748b;
        }

        /* ================= SECTION ================= */

        .section-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
        }

        .section-heading h2 {
          margin: 0;
          font-size: 19px;
        }

        .section-heading p {
          margin: 5px 0 0;
          color: #64748b;
          font-size: 13px;
        }

        .issue-count {
          padding: 7px 12px;
          background: #eff6ff;
          color: #2563eb;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          white-space: nowrap;
        }

        /* ================= ISSUES ================= */

        .issues-card {
          padding: 25px;
          margin-bottom: 20px;
        }

        .table-container {
          margin-top: 20px;
          overflow-x: auto;
        }

        .issues-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 720px;
        }

        .issues-table th {
          text-align: left;
          padding: 13px 12px;
          background: #f8fafc;
          color: #64748b;
          font-size: 12px;
          font-weight: 600;
        }

        .issues-table td {
          padding: 15px 12px;
          border-bottom: 1px solid #eef2f7;
          font-size: 13px;
        }

        .issues-table tbody tr {
          cursor: pointer;
          transition: 0.2s;
        }

        .issues-table tbody tr:hover {
          background: #f8fbff;
        }

        .selected-row {
          background: #f0f7ff;
        }

        .issue-id {
          color: #2563eb;
          font-weight: 600;
          white-space: nowrap;
        }

        .issue-title {
          font-weight: 600;
          min-width: 180px;
        }

        .category-badge {
          display: inline-block;
          padding: 5px 9px;
          background: #f1f5f9;
          border-radius: 6px;
          color: #475569;
          font-size: 11px;
        }

        .priority-badge,
        .status-badge {
          display: inline-block;
          padding: 5px 9px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 600;
          white-space: nowrap;
        }

        .priority-critical {
          background: #fef2f2;
          color: #b91c1c;
        }

        .priority-high {
          background: #fef2f2;
          color: #dc2626;
        }

        .priority-medium {
          background: #fff7ed;
          color: #ea580c;
        }

        .priority-low {
          background: #f0fdf4;
          color: #16a34a;
        }

        .status-assigned {
          background: #eff6ff;
          color: #2563eb;
        }

        .status-progress {
          background: #fff7ed;
          color: #d97706;
        }

        .status-resolved {
          background: #f0fdf4;
          color: #16a34a;
        }

        .status-verified {
          background: #f5f3ff;
          color: #7c3aed;
        }

        .status-reported {
          background: #f1f5f9;
          color: #475569;
        }

        .arrow-cell {
          color: #64748b;
          font-size: 18px !important;
          text-align: right;
        }

        /* ================= BOTTOM ================= */

        .bottom-grid {
          display: grid;
          grid-template-columns: 1.4fr 1fr;
          gap: 20px;
          margin-bottom: 20px;
        }

        .details-card,
        .location-card {
          padding: 25px;
        }

        .details-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 15px;
          padding-bottom: 18px;
          border-bottom: 1px solid #e5e7eb;
        }

        .details-header h2,
        .location-card h2 {
          margin: 0;
          font-size: 19px;
        }

        .issue-number {
          color: #64748b;
          font-size: 12px;
          white-space: nowrap;
        }

        .detail-section {
          padding: 17px 0;
          border-bottom: 1px solid #eef2f7;
        }

        .detail-section:last-child {
          border-bottom: none;
        }

        .detail-label {
          display: block;
          color: #64748b;
          font-size: 12px;
          margin-bottom: 7px;
        }

        .detail-section h3 {
          margin: 0;
          font-size: 15px;
        }

        .detail-section p {
          margin: 0;
          color: #475569;
          font-size: 13px;
          line-height: 1.6;
        }

        .detail-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        /* ================= MEDIA ================= */

        .media-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }

        .media-item {
          width: 130px;
          height: 100px;
          border-radius: 10px;
          overflow: hidden;
          border: 1px solid #e2e8f0;
          background: #f8fafc;
          position: relative;
        }

        .issue-media {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .media-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .media-error-container {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .media-error {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 5px;
          color: #64748b;
          font-size: 12px;
          text-align: center;
        }

        .media-error span {
          font-size: 22px;
        }

        .media-error small {
          font-size: 10px;
        }

        .no-media {
          padding: 15px;
          color: #64748b;
          font-size: 13px;
          background: #f8fafc;
          border-radius: 8px;
        }

        /* ================= REPORTED BY ================= */

        .reported-section strong {
          display: inline-block;
          margin-right: 8px;
        }

        .citizen-label {
          font-size: 11px;
          color: #64748b;
        }

        .object-id {
          color: #475569;
          font-family: monospace;
          font-size: 12px;
        }

        /* ================= MAP ================= */

        .location-card {
          display: flex;
          flex-direction: column;
        }

        .map-container {
          margin-top: 20px;
        }

        .map-background {
          position: relative;
          height: 300px;
          overflow: hidden;
          border-radius: 12px;
          background:
            linear-gradient(
              25deg,
              transparent 45%,
              #d1d5db 46%,
              #d1d5db 50%,
              transparent 51%
            ),
            linear-gradient(
              155deg,
              transparent 42%,
              #d1d5db 43%,
              #d1d5db 47%,
              transparent 48%
            ),
            #eef2f0;
        }

        .map-road {
          position: absolute;
          background: #ffffff;
          border: 1px solid #d1d5db;
        }

        .road-one {
          width: 120%;
          height: 28px;
          top: 45%;
          left: -10%;
          transform: rotate(-12deg);
        }

        .road-two {
          width: 30px;
          height: 120%;
          left: 55%;
          top: -10%;
          transform: rotate(22deg);
        }

        .road-three {
          width: 100%;
          height: 18px;
          top: 65%;
          left: 5%;
          transform: rotate(8deg);
        }

        .map-pin {
          position: absolute;
          top: 48%;
          left: 52%;
          transform: translate(-50%, -50%);
          font-size: 40px;
          z-index: 2;
        }

        .map-label {
          position: absolute;
          top: 25%;
          left: 50%;
          transform: translateX(-50%);
          background: #ffffff;
          padding: 10px 14px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          font-size: 11px;
          z-index: 3;
          white-space: nowrap;
          max-width: 80%;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .location-address {
          display: flex;
          gap: 10px;
          align-items: flex-start;
          margin-top: 15px;
        }

        .location-address p {
          margin: 0;
          color: #475569;
          font-size: 13px;
          line-height: 1.5;
        }

        .coordinates {
          margin-top: 6px !important;
          font-size: 11px !important;
          color: #94a3b8 !important;
        }

        .maps-button {
          width: 100%;
          margin-top: 15px;
          padding: 12px;
          background: #ffffff;
          border: 1px solid #2563eb;
          color: #2563eb;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
        }

        .maps-button:hover {
          background: #eff6ff;
        }

        .maps-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* ================= STATUS ================= */

        .status-card {
          padding: 25px;
        }

        .status-flow {
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 30px auto;
          max-width: 700px;
        }

        .status-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          min-width: 120px;
          color: #94a3b8;
          font-size: 12px;
        }

        .step-circle {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          border: 2px solid #cbd5e1;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
        }

        .status-step.active {
          color: #2563eb;
        }

        .status-step.active .step-circle {
          background: #2563eb;
          border-color: #2563eb;
          color: white;
        }

        .flow-line {
          width: 100px;
          height: 2px;
          background: #e2e8f0;
          margin-bottom: 25px;
        }

        .flow-line.active {
          background: #2563eb;
        }

        .update-status-button {
          display: block;
          width: 280px;
          margin: auto;
          padding: 13px 20px;
          border: none;
          border-radius: 8px;
          background: #2563eb;
          color: white;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
        }

        .update-status-button:hover {
          background: #1d4ed8;
        }

        .update-status-button:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        .resolved-message {
          text-align: center;
          color: #16a34a;
          font-weight: 600;
          padding: 13px;
        }

        .no-selection {
          padding: 50px 20px;
          text-align: center;
          color: #64748b;
        }

        /* ================= RESPONSIVE ================= */

        @media (max-width: 1000px) {
          .top-grid,
          .bottom-grid {
            grid-template-columns: 1fr;
          }

          .summary-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 700px) {
          .officer-navbar {
            padding: 0 18px;
          }

          .officer-container {
            padding: 25px 18px;
          }

          .officer-name,
          .officer-id {
            display: none;
          }

          .profile-card {
            align-items: flex-start;
          }

          .profile-info {
            flex-direction: column;
          }

          .summary-grid {
            grid-template-columns: 1fr;
          }

          .detail-row {
            grid-template-columns: 1fr;
          }

          .status-flow {
            flex-direction: column;
            gap: 10px;
          }

          .flow-line {
            width: 2px;
            height: 35px;
            margin: 0;
          }

          .update-status-button {
            width: 100%;
          }

          .details-header {
            align-items: flex-start;
            flex-direction: column;
          }
        }
      `}</style>

      <div className="officer-page">

        {/* =====================================================
            NAVBAR
        ===================================================== */}

        <header className="officer-navbar">

          <div className="brand">
            <div className="brand-logo">
              🏛
            </div>

            <span>Civic Issue Tracker</span>
          </div>

          <div className="officer-nav-right">

            <button
              className="notification-btn"
              type="button"
              aria-label="Notifications"
            >
              🔔
            </button>

            <div className="officer-account">

              <div className="officer-avatar">
                👨‍💼
              </div>

              <div>
                <p className="officer-name">
                  {officer?.name || "Officer"}
                </p>

                <p className="officer-id">
                  {officer?._id
                    ? `ID: ${officer._id
                        .toString()
                        .slice(-6)}`
                    : "OFFICER"}
                </p>
              </div>

              <span className="dropdown-arrow">
                ⌄
              </span>

            </div>

          </div>

        </header>

        <main className="officer-container">

          {/* =====================================================
              HEADING
          ===================================================== */}

          <div className="page-heading">

            <h1>Officer Dashboard</h1>

            <p>
              Manage and resolve your assigned civic issues
            </p>

          </div>

          {/* =====================================================
              PROFILE + SUMMARY
          ===================================================== */}

          <div className="top-grid">

            <section className="dashboard-card profile-card">

              <div className="profile-avatar">
                👨‍💼
              </div>

              <div className="profile-content">

                <h2>
                  Welcome,{" "}
                  {officer?.name || "Officer"}!
                </h2>

                <p className="welcome-text">
                  Glad to see you back.
                </p>

                <div className="profile-info">

                  <div className="info-box">

                    <span>Role</span>

                    <strong>
                      {officer?.role || "OFFICER"}
                    </strong>

                  </div>

                  <div className="info-box">

                    <span>Department</span>

                    <strong>
                      {officer?.departmentId?.departmentName ||
                        officer?.departmentName ||
                        "Assigned Department"}
                    </strong>

                  </div>

                </div>

              </div>

            </section>

            <section className="dashboard-card summary-card">

              <h2>Work Summary</h2>

              <div className="summary-grid">

                <div className="summary-item assigned-summary">

                  <div className="summary-icon">
                    📋
                  </div>

                  <div>
                    <strong>{assignedCount}</strong>
                    <span>Assigned</span>
                  </div>

                </div>

                <div className="summary-item progress-summary">

                  <div className="summary-icon">
                    ◷
                  </div>

                  <div>
                    <strong>{inProgressCount}</strong>
                    <span>In Progress</span>
                  </div>

                </div>

                <div className="summary-item resolved-summary">

                  <div className="summary-icon">
                    ✓
                  </div>

                  <div>
                    <strong>{resolvedCount}</strong>
                    <span>Resolved</span>
                  </div>

                </div>

              </div>

            </section>

          </div>

          {/* =====================================================
              ASSIGNED ISSUES
          ===================================================== */}

          <section className="dashboard-card issues-card">

            <div className="section-heading">

              <div>
                <h2>Assigned Issues</h2>

                <p>
                  Issues assigned to you
                </p>
              </div>

              <span className="issue-count">
                {issues.length}{" "}
                {issues.length === 1
                  ? "Issue"
                  : "Issues"}
              </span>

            </div>

            <div className="table-container">

              {issues.length === 0 ? (

                <div className="no-selection">

                  🎉

                  <br />
                  <br />

                  No issues are currently assigned
                  to you.

                </div>

              ) : (

                <table className="issues-table">

                  <thead>

                    <tr>
                      <th>ID</th>
                      <th>Title</th>
                      <th>Category</th>
                      <th>Priority</th>
                      <th>Status</th>
                      <th></th>
                    </tr>

                  </thead>

                  <tbody>

                    {issues.map((issue) => (

                      <tr
                        key={issue._id}
                        onClick={() =>
                          handleSelectIssue(issue)
                        }
                        className={
                          selectedIssue?._id === issue._id
                            ? "selected-row"
                            : ""
                        }
                      >

                        <td className="issue-id">
                          {issue.displayId}
                        </td>

                        <td className="issue-title">
                          {issue.title}
                        </td>

                        <td>
                          <span className="category-badge">
                            {formatCategory(
                              issue.category
                            )}
                          </span>
                        </td>

                        <td>
                          <span
                            className={`priority-badge ${getPriorityClass(
                              issue.priority
                            )}`}
                          >
                            {String(
                              issue.priority || "MEDIUM"
                            ).toUpperCase()}
                          </span>
                        </td>

                        <td>
                          <span
                            className={`status-badge ${getStatusClass(
                              issue.status
                            )}`}
                          >
                            {formatStatus(
                              issue.status
                            )}
                          </span>
                        </td>

                        <td className="arrow-cell">
                          →
                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              )}

            </div>

          </section>

          {/* =====================================================
              DETAILS + LOCATION
          ===================================================== */}

          {selectedIssue && (

            <div className="bottom-grid">

              {/* ================= ISSUE DETAILS ================= */}

              <section className="dashboard-card details-card">

                <div className="details-header">

                  <h2>Issue Details</h2>

                  <span className="issue-number">
                    Issue ID:{" "}
                    {selectedIssue.displayId}
                  </span>

                </div>

                {detailsLoading ? (

                  <div className="no-selection">
                    Loading issue details...
                  </div>

                ) : (

                  <>

                    <div className="detail-section">

                      <span className="detail-label">
                        Title
                      </span>

                      <h3>
                        {selectedIssue.title}
                      </h3>

                    </div>

                    <div className="detail-section">

                      <span className="detail-label">
                        Description
                      </span>

                      <p>
                        {selectedIssue.description}
                      </p>

                    </div>

                    <div className="detail-row">

                      <div className="detail-section">

                        <span className="detail-label">
                          Category
                        </span>

                        <strong>
                          {formatCategory(
                            selectedIssue.category
                          )}
                        </strong>

                      </div>

                      <div className="detail-section">

                        <span className="detail-label">
                          Priority
                        </span>

                        <span
                          className={`priority-badge ${getPriorityClass(
                            selectedIssue.priority
                          )}`}
                        >
                          {String(
                            selectedIssue.priority ||
                              "MEDIUM"
                          ).toUpperCase()}
                        </span>

                      </div>

                    </div>

                    {/* ================= MEDIA ================= */}

                    <div className="detail-section">

                      <span className="detail-label">
                        Images / Videos
                      </span>

                      <div className="media-grid">

                        {selectedIssue.media?.length > 0 ? (

                          selectedIssue.media.map(
                            (media, index) => {

                              const mediaUrl =
                                getMediaUrl(
                                  media?.url
                                );

                              console.log(
                                "MEDIA URL:",
                                mediaUrl
                              );

                              const mediaType =
                                String(
                                  media?.type || ""
                                ).toLowerCase();

                              const isVideo =
                                mediaType === "video" ||
                                mediaType.startsWith(
                                  "video/"
                                );

                              return (

                                <div
                                  className="media-item"
                                  key={
                                    media?._id ||
                                    index
                                  }
                                >

                                  {isVideo ? (

                                    <video
                                      src={mediaUrl}
                                      controls
                                      className="media-video"
                                      onLoadedData={() => {
                                        console.log(
                                          "VIDEO LOADED:",
                                          mediaUrl
                                        );
                                      }}
                                      onError={() => {
                                        console.error(
                                          "VIDEO LOAD ERROR:",
                                          mediaUrl
                                        );
                                      }}
                                    />

                                  ) : (

                                    <img
                                      src={mediaUrl}
                                      alt={`Issue media ${
                                        index + 1
                                      }`}
                                      className="issue-media"
                                      onLoad={() => {
                                        console.log(
                                          "IMAGE LOADED SUCCESSFULLY:",
                                          mediaUrl
                                        );
                                      }}
                                      onError={(event) =>
                                        handleMediaError(
                                          event,
                                          mediaUrl
                                        )
                                      }
                                    />

                                  )}

                                </div>

                              );
                            }
                          )

                        ) : (

                          <div className="no-media">
                            No images or videos available
                          </div>

                        )}

                      </div>

                    </div>

                    {/* ================= REPORTED BY ================= */}

                    <div className="detail-section reported-section">

                      <span className="detail-label">
                        Reported By
                      </span>

                      {selectedIssue.reportedBy &&
                      typeof selectedIssue.reportedBy ===
                        "object" ? (

                        <>

                          <strong>
                            {selectedIssue.reportedBy.name ||
                              selectedIssue.reportedBy.fullName ||
                              "Citizen"}
                          </strong>

                          <span className="citizen-label">
                            Citizen
                          </span>

                        </>

                      ) : (

                        <span className="object-id">
                          {selectedIssue.reportedBy
                            ? String(
                                selectedIssue.reportedBy
                              )
                            : "Citizen information unavailable"}
                        </span>

                      )}

                    </div>

                    {/* ================= ASSIGNMENT ================= */}

                    <div className="detail-section">

                      <span className="detail-label">
                        Assignment
                      </span>

                      <p>
                        Assigned to:{" "}

                        <strong>
                          {selectedIssue.assignedTo &&
                          typeof selectedIssue.assignedTo ===
                            "object"
                            ? selectedIssue.assignedTo.name ||
                              officer?.name ||
                              "You"
                            : officer?.name ||
                              "You"}
                        </strong>
                      </p>

                    </div>

                  </>

                )}

              </section>

              {/* ================= LOCATION ================= */}

              <section className="dashboard-card location-card">

                <h2>Location</h2>

                <div className="map-container">

                  <div className="map-background">

                    <div className="map-road road-one"></div>

                    <div className="map-road road-two"></div>

                    <div className="map-road road-three"></div>

                    <div className="map-pin">
                      📍
                    </div>

                    <div className="map-label">
                      {selectedIssue.title}
                    </div>

                  </div>

                </div>

                <div className="location-address">

                  <span>📍</span>

                  <div>

                    {getCoordinates() ? (

                      <>

                        <p>
                          Issue location
                        </p>

                        <p className="coordinates">

                          Latitude:{" "}
                          {getCoordinates().latitude}

                          <br />

                          Longitude:{" "}
                          {getCoordinates().longitude}

                        </p>

                      </>

                    ) : (

                      <p>
                        Location coordinates are unavailable.
                      </p>

                    )}

                  </div>

                </div>

                <button
                  className="maps-button"
                  onClick={openGoogleMaps}
                  disabled={!getCoordinates()}
                  type="button"
                >
                  Open in Google Maps ↗
                </button>

              </section>

            </div>

          )}

          {/* =====================================================
              STATUS
          ===================================================== */}

          {selectedIssue && (

            <section className="dashboard-card status-card">

              <div className="section-heading">

                <div>

                  <h2>Update Status</h2>

                  <p>
                    Keep the citizen informed about issue progress
                  </p>

                </div>

              </div>

              <div className="status-flow">

                {/* ASSIGNED */}

                <div
                  className={`status-step ${
                    ["ASSIGNED", "IN_PROGRESS", "INPROGRESS", "RESOLVED"].includes(
                      normalizeValue(selectedIssue.status)
                    )
                      ? "active"
                      : ""
                  }`}
                >

                  <div className="step-circle">
                    1
                  </div>

                  <span>Assigned</span>

                </div>

                <div
                  className={`flow-line ${
                    ["IN_PROGRESS", "INPROGRESS", "RESOLVED"].includes(
                      normalizeValue(selectedIssue.status)
                    )
                      ? "active"
                      : ""
                  }`}
                ></div>

                {/* IN PROGRESS */}

                <div
                  className={`status-step ${
                    ["IN_PROGRESS", "INPROGRESS", "RESOLVED"].includes(
                      normalizeValue(selectedIssue.status)
                    )
                      ? "active"
                      : ""
                  }`}
                >

                  <div className="step-circle">
                    2
                  </div>

                  <span>In Progress</span>

                </div>

                <div
                  className={`flow-line ${
                    normalizeValue(selectedIssue.status) ===
                    "RESOLVED"
                      ? "active"
                      : ""
                  }`}
                ></div>

                {/* RESOLVED */}

                <div
                  className={`status-step ${
                    normalizeValue(selectedIssue.status) ===
                    "RESOLVED"
                      ? "active"
                      : ""
                  }`}
                >

                  <div className="step-circle">
                    3
                  </div>

                  <span>Resolved</span>

                </div>

              </div>

              {normalizeValue(selectedIssue.status) !==
              "RESOLVED" ? (

                <button
                  className="update-status-button"
                  onClick={handleStatusUpdate}
                  disabled={
                    updatingStatus ||
                    ![
                      "ASSIGNED",
                      "IN_PROGRESS",
                      "INPROGRESS",
                    ].includes(
                      normalizeValue(selectedIssue.status)
                    )
                  }
                  type="button"
                >

                  {updatingStatus
                    ? "Updating..."
                    : normalizeValue(
                        selectedIssue.status
                      ) === "ASSIGNED"
                    ? "Mark as In Progress"
                    : "Mark as Resolved"}

                </button>

              ) : (

                <div className="resolved-message">
                  ✓ This issue has been resolved.
                </div>

              )}

            </section>

          )}

        </main>

      </div>
    </>
  );
}

export default OfficerDashboard;

