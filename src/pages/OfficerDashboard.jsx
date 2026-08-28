import { useState } from "react";

function OfficerDashboard() {
  const [selectedIssue, setSelectedIssue] = useState({
    id: "#1001",
    title: "Pothole on MG Road",
    description:
      "Large pothole causing difficulty for vehicles. Needs repair as soon as possible.",
    category: "Pothole",
    priority: "High",
    status: "Assigned",
    location: "MG Road, Near City Hospital, Prayagraj, UP",
    reportedBy: "Rahul Sharma",
    assignedTo: "Officer Kumar",
  });

  const [issues, setIssues] = useState([
    {
      id: "#1001",
      title: "Pothole on MG Road",
      category: "Pothole",
      priority: "High",
      status: "Assigned",
      location: "MG Road, Prayagraj",
      reportedBy: "Rahul Sharma",
    },
    {
      id: "#1002",
      title: "Broken Street Light",
      category: "Street Light",
      priority: "Medium",
      status: "In Progress",
      location: "Civil Lines, Prayagraj",
      reportedBy: "Ankit Verma",
    },
    {
      id: "#1003",
      title: "Water Leakage",
      category: "Water Leakage",
      priority: "High",
      status: "In Progress",
      location: "George Town, Prayagraj",
      reportedBy: "Priya Singh",
    },
    {
      id: "#1004",
      title: "Damaged Road",
      category: "Road Damage",
      priority: "High",
      status: "Assigned",
      location: "Naini, Prayagraj",
      reportedBy: "Aman Gupta",
    },
    {
      id: "#1005",
      title: "Garbage Accumulation",
      category: "Cleanliness",
      priority: "Low",
      status: "Assigned",
      location: "Tagore Town, Prayagraj",
      reportedBy: "Neha Sharma",
    },
  ]);

  const handleSelectIssue = (issue) => {
    setSelectedIssue(issue);
  };

  const handleStatusUpdate = () => {
    let newStatus;

    if (selectedIssue.status === "Assigned") {
      newStatus = "In Progress";
    } else if (selectedIssue.status === "In Progress") {
      newStatus = "Resolved";
    } else {
      return;
    }

    setSelectedIssue((prev) => ({
      ...prev,
      status: newStatus,
    }));

    setIssues((prevIssues) =>
      prevIssues.map((issue) =>
        issue.id === selectedIssue.id
          ? { ...issue, status: newStatus }
          : issue
      )
    );
  };

  const assignedCount = issues.filter(
    (issue) => issue.status === "Assigned"
  ).length;

  const inProgressCount = issues.filter(
    (issue) => issue.status === "In Progress"
  ).length;

  const resolvedCount = issues.filter(
    (issue) => issue.status === "Resolved"
  ).length;

  const getStatusClass = (status) => {
    if (status === "Assigned") return "status-assigned";
    if (status === "In Progress") return "status-progress";
    if (status === "Resolved") return "status-resolved";
    return "";
  };

  const getPriorityClass = (priority) => {
    if (priority === "High") return "priority-high";
    if (priority === "Medium") return "priority-medium";
    if (priority === "Low") return "priority-low";
    return "";
  };

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
          height: 72px;
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
          font-size: 26px;
        }

        .officer-nav-right {
          display: flex;
          align-items: center;
          gap: 22px;
        }

        .notification-btn {
          border: none;
          background: transparent;
          font-size: 20px;
          cursor: pointer;
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

          box-shadow:
            0 2px 8px rgba(15, 23, 42, 0.04);
        }

        /* ================= PROFILE + SUMMARY ================= */

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
          min-width: 120px;
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

        /* ================= SECTION HEADING ================= */

        .section-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
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
        }

        /* ================= ISSUES TABLE ================= */

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
        }

        .issue-title {
          font-weight: 600;
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

        .arrow-cell {
          color: #64748b;
          font-size: 18px !important;
        }

        /* ================= DETAILS + LOCATION ================= */

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
          gap: 10px;
        }

        .media-placeholder {
          width: 90px;
          height: 70px;

          border-radius: 8px;

          background: #e2e8f0;

          display: flex;
          align-items: center;
          justify-content: center;

          font-size: 25px;

          color: #64748b;
        }

        .reported-section strong {
          display: inline-block;
          margin-right: 8px;
        }

        .citizen-label {
          font-size: 11px;
          color: #64748b;
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

          box-shadow:
            0 2px 8px rgba(0, 0, 0, 0.1);

          font-size: 11px;

          z-index: 3;

          white-space: nowrap;
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

        .resolved-message {
          text-align: center;

          color: #16a34a;

          font-weight: 600;

          padding: 13px;
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

        }

      `}</style>

      <div className="officer-page">

        {/* NAVBAR */}
        <header className="officer-navbar">

          <div className="brand">
            <div className="brand-logo">🏛</div>
            <span>Civic Issue Tracker</span>
          </div>

          <div className="officer-nav-right">

            <button className="notification-btn">
              🔔
            </button>

            <div className="officer-account">

              <div className="officer-avatar">
                👨‍💼
              </div>

              <div>
                <p className="officer-name">
                  Officer Kumar
                </p>

                <p className="officer-id">
                  OFF12345
                </p>
              </div>

              <span className="dropdown-arrow">
                ⌄
              </span>

            </div>

          </div>

        </header>


        <main className="officer-container">

          {/* HEADING */}

          <div className="page-heading">

            <h1>
              Officer Dashboard
            </h1>

            <p>
              Manage and resolve your assigned civic issues
            </p>

          </div>


          {/* PROFILE + SUMMARY */}

          <div className="top-grid">

            <section className="dashboard-card profile-card">

              <div className="profile-avatar">
                👨‍💼
              </div>

              <div className="profile-content">

                <h2>
                  Welcome, Officer Kumar!
                </h2>

                <p className="welcome-text">
                  Glad to see you back.
                </p>

                <div className="profile-info">

                  <div className="info-box">
                    <span>Role</span>
                    <strong>Officer</strong>
                  </div>

                  <div className="info-box">
                    <span>Department</span>
                    <strong>Roads</strong>
                  </div>

                </div>

              </div>

            </section>


            <section className="dashboard-card summary-card">

              <h2>
                Work Summary
              </h2>

              <div className="summary-grid">

                <div className="summary-item assigned-summary">

                  <div className="summary-icon">
                    📋
                  </div>

                  <div>
                    <strong>
                      {assignedCount}
                    </strong>

                    <span>
                      Assigned
                    </span>
                  </div>

                </div>


                <div className="summary-item progress-summary">

                  <div className="summary-icon">
                    ◷
                  </div>

                  <div>
                    <strong>
                      {inProgressCount}
                    </strong>

                    <span>
                      In Progress
                    </span>
                  </div>

                </div>


                <div className="summary-item resolved-summary">

                  <div className="summary-icon">
                    ✓
                  </div>

                  <div>
                    <strong>
                      {resolvedCount}
                    </strong>

                    <span>
                      Resolved
                    </span>
                  </div>

                </div>

              </div>

            </section>

          </div>


          {/* ASSIGNED ISSUES */}

          <section className="dashboard-card issues-card">

            <div className="section-heading">

              <div>

                <h2>
                  Assigned Issues
                </h2>

                <p>
                  Issues assigned to you
                </p>

              </div>

              <span className="issue-count">
                {issues.length} Issues
              </span>

            </div>


            <div className="table-container">

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
                      key={issue.id}
                      onClick={() =>
                        handleSelectIssue(issue)
                      }
                      className={
                        selectedIssue.id === issue.id
                          ? "selected-row"
                          : ""
                      }
                    >

                      <td className="issue-id">
                        {issue.id}
                      </td>

                      <td className="issue-title">
                        {issue.title}
                      </td>

                      <td>
                        <span className="category-badge">
                          {issue.category}
                        </span>
                      </td>

                      <td>

                        <span
                          className={`priority-badge ${getPriorityClass(
                            issue.priority
                          )}`}
                        >
                          {issue.priority}
                        </span>

                      </td>

                      <td>

                        <span
                          className={`status-badge ${getStatusClass(
                            issue.status
                          )}`}
                        >
                          {issue.status}
                        </span>

                      </td>

                      <td className="arrow-cell">
                        →
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </section>


          {/* DETAILS + LOCATION */}

          <div className="bottom-grid">

            <section className="dashboard-card details-card">

              <div className="details-header">

                <h2>
                  Issue Details
                </h2>

                <span className="issue-number">
                  Issue ID: {selectedIssue.id}
                </span>

              </div>


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
                    {selectedIssue.category}
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
                    {selectedIssue.priority}
                  </span>

                </div>

              </div>


              <div className="detail-section">

                <span className="detail-label">
                  Images / Videos
                </span>

                <div className="media-grid">

                  <div className="media-placeholder">
                    🖼
                  </div>

                  <div className="media-placeholder">
                    🖼
                  </div>

                  <div className="media-placeholder">
                    🖼
                  </div>

                </div>

              </div>


              <div className="detail-section reported-section">

                <span className="detail-label">
                  Reported By
                </span>

                <strong>
                  {selectedIssue.reportedBy}
                </strong>

                <span className="citizen-label">
                  Citizen
                </span>

              </div>


              <div className="detail-section">

                <span className="detail-label">
                  Assignment
                </span>

                <p>
                  Assigned to:{" "}
                  <strong>
                    {selectedIssue.assignedTo}
                  </strong>
                </p>

              </div>

            </section>


            {/* LOCATION */}

            <section className="dashboard-card location-card">

              <h2>
                Location
              </h2>

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

                <p>
                  {selectedIssue.location}
                </p>

              </div>


              <button className="maps-button">
                Open in Google Maps ↗
              </button>

            </section>

          </div>


          {/* STATUS */}

          <section className="dashboard-card status-card">

            <div className="section-heading">

              <div>

                <h2>
                  Update Status
                </h2>

                <p>
                  Keep the citizen informed about issue progress
                </p>

              </div>

            </div>


            <div className="status-flow">

              <div
                className={`status-step ${
                  selectedIssue.status === "Assigned" ||
                  selectedIssue.status === "In Progress" ||
                  selectedIssue.status === "Resolved"
                    ? "active"
                    : ""
                }`}
              >

                <div className="step-circle">
                  1
                </div>

                <span>
                  Assigned
                </span>

              </div>


              <div className="flow-line"></div>


              <div
                className={`status-step ${
                  selectedIssue.status === "In Progress" ||
                  selectedIssue.status === "Resolved"
                    ? "active"
                    : ""
                }`}
              >

                <div className="step-circle">
                  2
                </div>

                <span>
                  In Progress
                </span>

              </div>


              <div className="flow-line"></div>


              <div
                className={`status-step ${
                  selectedIssue.status === "Resolved"
                    ? "active"
                    : ""
                }`}
              >

                <div className="step-circle">
                  3
                </div>

                <span>
                  Resolved
                </span>

              </div>

            </div>


            {selectedIssue.status !== "Resolved" ? (

              <button
                className="update-status-button"
                onClick={handleStatusUpdate}
              >
                Mark as{" "}
                {selectedIssue.status === "Assigned"
                  ? "In Progress"
                  : "Resolved"}
              </button>

            ) : (

              <div className="resolved-message">
                ✓ This issue has been resolved.
              </div>

            )}

          </section>

        </main>

      </div>
    </>
  );
}

export default OfficerDashboard;