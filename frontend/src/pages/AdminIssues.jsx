import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  Filter,
  MapPin,
  UserRound,
  Clock3,
  CheckCircle2,
  AlertCircle,
  UserPlus,
  X,
  Image as ImageIcon,
  Video,
} from "lucide-react";

import api from "../services/api";

function AdminIssues() {
  const [issues, setIssues] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [selectedOfficer, setSelectedOfficer] = useState("");

  const [assigning, setAssigning] = useState(false);

  /* =====================================================
     FETCH ISSUES
  ===================================================== */

  const fetchIssues = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/issues");

      console.log("ISSUES FROM BACKEND:", response.data);

      setIssues(response.data?.issues || []);
    } catch (err) {
      console.error("Failed to fetch issues:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load issues. Please check the backend."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  /* =====================================================
     ASSIGN MODAL
  ===================================================== */

  const openAssignModal = (issue) => {
    setSelectedIssue(issue);
    setSelectedOfficer("");
    setShowAssignModal(true);
  };

  const closeAssignModal = () => {
    setShowAssignModal(false);
    setSelectedIssue(null);
    setSelectedOfficer("");
  };

  /* =====================================================
     ASSIGN OFFICER
  ===================================================== */

  const handleAssignOfficer = async () => {
    if (!selectedIssue || !selectedOfficer.trim()) {
      alert("Please enter the officer ID.");
      return;
    }

    try {
      setAssigning(true);

      const response = await api.post(
        `/issues/${selectedIssue._id}/assign`,
        {
          officerId: selectedOfficer.trim(),
        }
      );

      const updatedIssue = response.data?.issue;

      if (updatedIssue) {
        setIssues((currentIssues) =>
          currentIssues.map((issue) =>
            issue._id === updatedIssue._id
              ? updatedIssue
              : issue
          )
        );
      }

      closeAssignModal();

      alert("Officer assigned successfully.");
    } catch (err) {
      console.error("Assignment failed:", err);

      alert(
        err.response?.data?.message ||
          "Failed to assign officer."
      );
    } finally {
      setAssigning(false);
    }
  };

  /* =====================================================
     FILTER
  ===================================================== */

  const filteredIssues = issues.filter((issue) => {
    const searchText = `
      ${issue.title || ""}
      ${issue.description || ""}
      ${issue.category || ""}
      ${issue.priority || ""}
    `.toLowerCase();

    const matchesSearch = searchText.includes(
      search.toLowerCase()
    );

    const matchesStatus =
      statusFilter === "ALL" ||
      issue.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  /* =====================================================
     STATUS ICON
  ===================================================== */

  const getStatusIcon = (status) => {
    switch (status) {
      case "RESOLVED":
        return <CheckCircle2 size={17} />;

      case "IN_PROGRESS":
        return <AlertCircle size={17} />;

      case "ASSIGNED":
        return <UserRound size={17} />;

      case "VERIFIED":
        return <CheckCircle2 size={17} />;

      default:
        return <Clock3 size={17} />;
    }
  };

  /* =====================================================
     STATUS CLASS
  ===================================================== */

  const getStatusClass = (status) => {
    switch (status) {
      case "RESOLVED":
        return "resolved";

      case "IN_PROGRESS":
        return "progress";

      case "ASSIGNED":
        return "assigned";

      case "VERIFIED":
        return "verified";

      default:
        return "reported";
    }
  };

  /* =====================================================
     MEDIA URL
  ===================================================== */

  const getMediaUrl = (url) => {
    if (!url) return "";

    if (
      url.startsWith("http://") ||
      url.startsWith("https://")
    ) {
      return url;
    }

    if (url.startsWith("/uploads")) {
      return `http://localhost:5000${url}`;
    }

    return `http://localhost:5000/uploads/${url}`;
  };

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <>
      {/* =================================================
          PAGE CSS
      ================================================= */}

      <style>{`

        * {
          box-sizing: border-box;
        }

        .admin-dashboard {
          min-height: 100vh;
          background: #f5f7fb;
          color: #172033;
        }

        /* =================================================
           NAVBAR
        ================================================= */

        .admin-navbar {
          height: 72px;
          background: #ffffff;
          border-bottom: 1px solid #e5e9f0;

          display: flex;
          align-items: center;

          padding: 0 36px;
          gap: 30px;

          position: sticky;
          top: 0;
          z-index: 50;
        }

        .admin-brand {
          display: flex;
          align-items: center;
          gap: 11px;

          min-width: 210px;

          text-decoration: none;
          color: inherit;
        }

        .admin-logo {
          width: 40px;
          height: 40px;

          border-radius: 10px;

          background: #2563eb;
          color: white;

          display: flex;
          align-items: center;
          justify-content: center;

          font-size: 19px;
          font-weight: 800;
        }

        .admin-brand h2 {
          margin: 0;
          font-size: 19px;
          line-height: 1.2;
        }

        .admin-brand span {
          display: block;

          margin-top: 3px;

          color: #8a93a3;
          font-size: 10px;
        }

        .admin-nav-links {
          display: flex;
          align-items: center;
          gap: 5px;

          flex: 1;
        }

        .admin-nav-links a {
          padding: 9px 14px;

          border-radius: 8px;

          color: #667085;

          text-decoration: none;

          font-size: 13px;
          font-weight: 600;

          transition: 0.2s ease;
        }

        .admin-nav-links a:hover {
          background: #f1f5f9;
          color: #2563eb;
        }

        .admin-nav-links a.active {
          background: #eff6ff;
          color: #2563eb;
        }

        .admin-nav-right {
          display: flex;
          align-items: center;
          gap: 9px;
        }

        .admin-avatar {
          width: 37px;
          height: 37px;

          border-radius: 50%;

          background: #e8f0ff;
          color: #2563eb;

          display: flex;
          align-items: center;
          justify-content: center;

          font-weight: 700;
          font-size: 14px;
        }

        .admin-profile strong {
          display: block;
          font-size: 12px;
        }

        .admin-profile small {
          display: block;

          margin-top: 2px;

          color: #8a93a3;
          font-size: 10px;
        }

        /* =================================================
           MAIN CONTENT
        ================================================= */

        .admin-content {
          width: min(1180px, calc(100% - 40px));

          margin: 0 auto;

          padding: 34px 0 60px;
        }

        /* =================================================
           PAGE HEADER
        ================================================= */

        .issues-page-header {
          margin-bottom: 24px;
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;

          margin-bottom: 12px;

          color: #64748b;

          text-decoration: none;

          font-size: 12px;
          font-weight: 600;

          transition: 0.2s;
        }

        .back-link:hover {
          color: #2563eb;
        }

        .issues-page-header h1 {
          margin: 0;

          font-size: 29px;
          letter-spacing: -0.5px;
        }

        .issues-page-header p {
          margin: 7px 0 0;

          color: #7a8494;

          font-size: 13px;
        }

        /* =================================================
           FILTER BAR
        ================================================= */

        .issue-filter-bar {
          background: white;

          border: 1px solid #e4e8ef;
          border-radius: 12px;

          padding: 13px;

          display: flex;
          gap: 11px;

          margin-bottom: 24px;

          box-shadow:
            0 2px 8px rgba(15, 23, 42, 0.03);
        }

        .issue-search {
          height: 41px;

          flex: 1;

          display: flex;
          align-items: center;

          gap: 9px;

          padding: 0 12px;

          border: 1px solid #dfe4ec;
          border-radius: 8px;

          color: #8993a3;
        }

        .issue-search input {
          width: 100%;

          border: none;
          outline: none;

          background: transparent;

          color: #172033;

          font-size: 13px;
        }

        .issue-search input::placeholder {
          color: #9aa3b2;
        }

        .issue-filter {
          min-width: 175px;
          height: 41px;

          display: flex;
          align-items: center;

          gap: 7px;

          padding: 0 11px;

          border: 1px solid #dfe4ec;
          border-radius: 8px;

          color: #687386;
        }

        .issue-filter select {
          width: 100%;

          border: none;
          outline: none;

          background: transparent;

          color: #344054;

          font-size: 12px;

          cursor: pointer;
        }

        /* =================================================
           COUNT
        ================================================= */

        .issues-count {
          margin-bottom: 11px;

          color: #7b8494;

          font-size: 12px;
        }

        .issues-count strong {
          color: #172033;
          font-size: 13px;
        }

        /* =================================================
           ISSUE CARD
        ================================================= */

        .admin-full-issue {
          background: #ffffff;

          border: 1px solid #e3e7ee;
          border-radius: 14px;

          padding: 20px;

          margin-bottom: 14px;

          display: flex;
          gap: 15px;

          box-shadow:
            0 3px 12px rgba(15, 23, 42, 0.035);

          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }

        .admin-full-issue:hover {
          transform: translateY(-1px);

          box-shadow:
            0 7px 22px rgba(15, 23, 42, 0.07);
        }

        .admin-full-issue-icon {
          flex-shrink: 0;

          width: 37px;
          height: 37px;

          border-radius: 9px;

          display: flex;
          align-items: center;
          justify-content: center;
        }

        .admin-full-issue-icon.resolved {
          background: #ecfdf3;
          color: #16a34a;
        }

        .admin-full-issue-icon.progress {
          background: #fff7ed;
          color: #ea580c;
        }

        .admin-full-issue-icon.assigned {
          background: #eff6ff;
          color: #2563eb;
        }

        .admin-full-issue-icon.verified {
          background: #f0fdf4;
          color: #16a34a;
        }

        .admin-full-issue-icon.reported {
          background: #fef2f2;
          color: #dc2626;
        }

        /* =================================================
           DETAILS
        ================================================= */

        .full-issue-details {
          flex: 1;
          min-width: 0;
        }

        .full-issue-top {
          display: flex;

          justify-content: space-between;
          align-items: flex-start;

          gap: 15px;
        }

        .issue-id {
          color: #98a2b3;

          font-size: 10px;
          font-weight: 600;
        }

        .full-issue-top h2 {
          margin: 4px 0 0;

          color: #172033;

          font-size: 18px;
          line-height: 1.35;
        }

        /* =================================================
           STATUS
        ================================================= */

        .admin-status {
          flex-shrink: 0;

          padding: 5px 10px;

          border-radius: 20px;

          font-size: 9px;
          font-weight: 700;

          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        .admin-status.resolved {
          background: #ecfdf3;
          color: #15803d;
        }

        .admin-status.progress {
          background: #fff7ed;
          color: #c2410c;
        }

        .admin-status.assigned {
          background: #eff6ff;
          color: #1d4ed8;
        }

        .admin-status.verified {
          background: #f0fdf4;
          color: #15803d;
        }

        .admin-status.reported {
          background: #fef2f2;
          color: #b91c1c;
        }

        /* =================================================
           DESCRIPTION
        ================================================= */

        .issue-description {
          margin: 11px 0;

          color: #667085;

          font-size: 12px;
          line-height: 1.6;

          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;

          overflow: hidden;
        }

        /* =================================================
           META
        ================================================= */

        .full-issue-meta {
          display: flex;
          flex-wrap: wrap;

          gap: 8px 17px;

          padding: 10px 0;

          border-top: 1px solid #eef1f5;
          border-bottom: 1px solid #eef1f5;
        }

        .full-issue-meta span {
          display: inline-flex;
          align-items: center;

          gap: 5px;

          color: #667085;

          font-size: 11px;
        }

        /* =================================================
           MEDIA
        ================================================= */

        .issue-media-section {
          margin-top: 16px;
        }

        .issue-media-section > strong {
          display: block;

          margin-bottom: 8px;

          color: #344054;

          font-size: 11px;
        }

        .issue-media-grid {
          display: flex;
          flex-wrap: wrap;

          gap: 9px;
        }

        /*
          IMPORTANT:
          Images are restricted to 150 x 115.
          They will no longer become huge.
        */

        .issue-media-item {
          width: 150px;
          height: 115px;

          position: relative;

          overflow: hidden;

          border-radius: 9px;

          background: #f1f3f6;

          border: 1px solid #e1e5eb;

          flex-shrink: 0;
        }

        .issue-media-item img,
        .issue-media-item video {
          width: 100%;
          height: 100%;

          display: block;

          object-fit: cover;
        }

        .issue-media-item > span {
          position: absolute;

          left: 6px;
          bottom: 6px;

          display: inline-flex;
          align-items: center;

          gap: 4px;

          padding: 4px 7px;

          border-radius: 5px;

          background: rgba(0, 0, 0, 0.68);

          color: white;

          font-size: 9px;
          font-weight: 600;
        }

        .issue-media-item.media-error {
          display: flex;

          align-items: center;
          justify-content: center;
        }

        .issue-media-item.media-error::before {
          content: "Image unavailable";

          color: #98a2b3;

          font-size: 10px;
        }

        /* =================================================
           ASSIGNMENT
        ================================================= */

        .issue-assignment {
          margin-top: 14px;

          padding: 10px 12px;

          border-radius: 9px;

          background: #f8fafc;

          display: flex;

          align-items: center;
          justify-content: space-between;

          gap: 15px;
        }

        .assignment-person {
          display: flex;
          align-items: center;

          gap: 8px;

          color: #64748b;
        }

        .assignment-person > div {
          display: flex;

          flex-direction: column;

          gap: 2px;
        }

        .assignment-person small {
          color: #98a2b3;
          font-size: 9px;
        }

        .assignment-person strong {
          color: #344054;
          font-size: 11px;
        }

        .assign-button {
          border: none;

          background: #2563eb;
          color: white;

          padding: 7px 11px;

          border-radius: 7px;

          display: inline-flex;
          align-items: center;

          gap: 5px;

          font-size: 11px;
          font-weight: 600;

          cursor: pointer;

          transition: 0.2s ease;
        }

        .assign-button:hover {
          background: #1d4ed8;
        }

        /* =================================================
           REPORTED BY
        ================================================= */

        .issue-reported-by {
          margin-top: 10px;

          display: flex;
          align-items: center;

          gap: 7px;
        }

        .issue-reported-by small {
          color: #98a2b3;

          font-size: 9px;
        }

        .issue-reported-by span {
          color: #475467;

          font-size: 10px;
        }

        /* =================================================
           LOADING
        ================================================= */

        .admin-loading {
          background: white;

          border: 1px solid #e4e8ef;
          border-radius: 12px;

          padding: 45px;

          text-align: center;

          color: #667085;

          font-size: 13px;
        }

        /* =================================================
           ERROR
        ================================================= */

        .admin-error {
          margin-bottom: 20px;

          padding: 12px 14px;

          border-radius: 9px;

          background: #fef2f2;
          border: 1px solid #fecaca;

          color: #b91c1c;

          font-size: 12px;
        }

        /* =================================================
           EMPTY
        ================================================= */

        .no-issues {
          background: white;

          border: 1px solid #e4e8ef;

          border-radius: 14px;

          padding: 55px 25px;

          text-align: center;
        }

        .empty-issue-icon {
          width: 48px;
          height: 48px;

          margin: 0 auto 12px;

          border-radius: 50%;

          background: #f1f5f9;

          color: #94a3b8;

          display: flex;
          align-items: center;
          justify-content: center;
        }

        .no-issues h3 {
          margin: 0;

          font-size: 16px;
        }

        .no-issues p {
          margin: 6px 0 0;

          color: #8a93a3;

          font-size: 12px;
        }

        /* =================================================
           MODAL
        ================================================= */

        .modal-overlay {
          position: fixed;

          inset: 0;

          background: rgba(15, 23, 42, 0.48);

          display: flex;

          align-items: center;
          justify-content: center;

          padding: 20px;

          z-index: 100;
        }

        .assign-modal {
          width: min(460px, 100%);

          background: white;

          border-radius: 15px;

          padding: 22px;

          box-shadow:
            0 20px 60px rgba(15, 23, 42, 0.22);
        }

        .modal-header {
          display: flex;

          align-items: flex-start;
          justify-content: space-between;

          gap: 15px;

          margin-bottom: 18px;
        }

        .modal-header h2 {
          margin: 0;

          font-size: 19px;
        }

        .modal-header p {
          margin: 5px 0 0;

          color: #8a93a3;

          font-size: 11px;
          line-height: 1.5;
        }

        .modal-close {
          width: 32px;
          height: 32px;

          border: none;

          border-radius: 7px;

          background: #f1f5f9;

          color: #64748b;

          display: flex;
          align-items: center;
          justify-content: center;

          cursor: pointer;
        }

        .modal-close:hover {
          background: #e2e8f0;
        }

        .selected-issue {
          padding: 12px;

          margin-bottom: 17px;

          border-radius: 9px;

          background: #f8fafc;

          border: 1px solid #e7ebf0;
        }

        .selected-issue small {
          display: block;

          color: #98a2b3;

          font-size: 9px;
        }

        .selected-issue strong {
          display: block;

          margin-top: 4px;

          color: #344054;

          font-size: 12px;
        }

        .selected-issue span {
          display: block;

          margin-top: 4px;

          color: #8a93a3;

          font-size: 9px;
        }

        .modal-label {
          display: block;

          margin-bottom: 6px;

          color: #344054;

          font-size: 11px;
          font-weight: 600;
        }

        .officer-select {
          width: 100%;

          height: 40px;

          padding: 0 11px;

          border: 1px solid #d9dee7;

          border-radius: 8px;

          outline: none;

          font-size: 12px;

          color: #172033;
        }

        .officer-select:focus {
          border-color: #2563eb;

          box-shadow:
            0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        .assignment-note {
          margin: 8px 0 0;

          color: #98a2b3;

          font-size: 9px;

          line-height: 1.5;
        }

        .modal-actions {
          display: flex;

          justify-content: flex-end;

          gap: 8px;

          margin-top: 20px;
        }

        .cancel-button,
        .confirm-assign-button {
          height: 37px;

          padding: 0 14px;

          border-radius: 7px;

          font-size: 11px;
          font-weight: 600;

          cursor: pointer;
        }

        .cancel-button {
          border: 1px solid #dfe4ec;

          background: white;

          color: #667085;
        }

        .cancel-button:hover {
          background: #f8fafc;
        }

        .confirm-assign-button {
          border: none;

          background: #2563eb;

          color: white;
        }

        .confirm-assign-button:hover:not(:disabled) {
          background: #1d4ed8;
        }

        .confirm-assign-button:disabled {
          opacity: 0.55;

          cursor: not-allowed;
        }

        /* =================================================
           RESPONSIVE
        ================================================= */

        @media (max-width: 900px) {

          .admin-navbar {
            padding: 0 20px;
            gap: 15px;
          }

          .admin-brand {
            min-width: auto;
          }

          .admin-profile {
            display: none;
          }

          .admin-nav-links a {
            padding: 8px 9px;
            font-size: 12px;
          }

        }

        @media (max-width: 700px) {

          .admin-navbar {
            height: auto;

            padding: 13px 16px;

            flex-wrap: wrap;
          }

          .admin-brand {
            flex: 1;
          }

          .admin-nav-links {
            order: 3;

            width: 100%;

            overflow-x: auto;
          }

          .admin-content {
            width: calc(100% - 24px);

            padding-top: 24px;
          }

          .issue-filter-bar {
            flex-direction: column;
          }

          .issue-filter {
            width: 100%;
          }

          .admin-full-issue {
            padding: 16px;

            gap: 10px;
          }

          .full-issue-top {
            flex-direction: column;
          }

          .admin-status {
            align-self: flex-start;
          }

          .issue-assignment {
            align-items: flex-start;
            flex-direction: column;
          }

          .assign-button {
            width: 100%;

            justify-content: center;
          }

        }

        @media (max-width: 480px) {

          .admin-full-issue {
            flex-direction: column;
          }

          .admin-full-issue-icon {
            width: 34px;
            height: 34px;
          }

          .issue-media-item {
            width: 135px;
            height: 105px;
          }

          .issues-page-header h1 {
            font-size: 25px;
          }

        }

      `}</style>

      <div className="admin-dashboard">

        {/* =================================================
            NAVBAR
        ================================================= */}

        <header className="admin-navbar">

          <Link to="/admin" className="admin-brand">

            <div className="admin-logo">
              R
            </div>

            <div>
              <h2>ResolveX</h2>

              <span>
                Administration Portal
              </span>
            </div>

          </Link>

          <nav className="admin-nav-links">

            <Link to="/admin">
              Dashboard
            </Link>

            <Link
              to="/admin/issues"
              className="active"
            >
              Issues
            </Link>

            <Link to="/admin/officers">
              Officers
            </Link>

            <Link to="/admin/citizens">
              Citizens
            </Link>

          </nav>

          <div className="admin-nav-right">

            <div className="admin-avatar">
              A
            </div>

            <div className="admin-profile">

              <strong>Admin</strong>

              <small>
                Administrator
              </small>

            </div>

          </div>

        </header>


        {/* =================================================
            MAIN CONTENT
        ================================================= */}

        <main className="admin-content">

          <section className="issues-page-header">

            <div>

              <Link
                to="/admin"
                className="back-link"
              >
                <ArrowLeft size={15} />
                Back to Dashboard
              </Link>

              <h1>
                Issue Management
              </h1>

              <p>
                Review civic issues, uploaded evidence
                and officer assignments.
              </p>

            </div>

          </section>


          {/* =================================================
              FILTER BAR
          ================================================= */}

          <section className="issue-filter-bar">

            <div className="issue-search">

              <Search size={17} />

              <input
                type="text"
                placeholder="Search issues..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

            </div>

            <div className="issue-filter">

              <Filter size={16} />

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value)
                }
              >

                <option value="ALL">
                  All Statuses
                </option>

                <option value="REPORTED">
                  Reported
                </option>

                <option value="VERIFIED">
                  Verified
                </option>

                <option value="ASSIGNED">
                  Assigned
                </option>

                <option value="IN_PROGRESS">
                  In Progress
                </option>

                <option value="RESOLVED">
                  Resolved
                </option>

              </select>

            </div>

          </section>


          {/* ERROR */}

          {error && (
            <div className="admin-error">
              {error}
            </div>
          )}


          {/* LOADING */}

          {loading ? (

            <div className="admin-loading">
              Loading issues...
            </div>

          ) : filteredIssues.length === 0 ? (

            <div className="no-issues">

              <div className="empty-issue-icon">
                <AlertCircle size={25} />
              </div>

              <h3>
                No issues found
              </h3>

              <p>
                There are no issues matching
                your search or filter.
              </p>

            </div>

          ) : (

            <section className="admin-full-issues">

              <div className="issues-count">

                <strong>
                  {filteredIssues.length}
                </strong>

                {" "}issues found

              </div>


              {filteredIssues.map((issue) => (

                <article
                  className="admin-full-issue"
                  key={issue._id}
                >

                  {/* STATUS ICON */}

                  <div
                    className={`admin-full-issue-icon ${getStatusClass(
                      issue.status
                    )}`}
                  >
                    {getStatusIcon(issue.status)}
                  </div>


                  {/* DETAILS */}

                  <div className="full-issue-details">

                    {/* TOP */}

                    <div className="full-issue-top">

                      <div>

                        <span className="issue-id">
                          #{issue._id?.slice(-6)}
                        </span>

                        <h2>
                          {issue.title ||
                            "Untitled Issue"}
                        </h2>

                      </div>

                      <span
                        className={`admin-status ${getStatusClass(
                          issue.status
                        )}`}
                      >
                        {issue.status
                          ?.replace("_", " ") ||
                          "REPORTED"}
                      </span>

                    </div>


                    {/* DESCRIPTION */}

                    <p className="issue-description">
                      {issue.description ||
                        "No description available."}
                    </p>


                    {/* META */}

                    <div className="full-issue-meta">

                      <span>

                        <MapPin size={13} />

                        {issue.location?.coordinates
                          ? `${issue.location.coordinates[1].toFixed(
                              4
                            )}, ${issue.location.coordinates[0].toFixed(
                              4
                            )}`
                          : "Location unavailable"}

                      </span>

                      <span>
                        Category:{" "}
                        {issue.category ||
                          "Not classified"}
                      </span>

                      <span>
                        Priority:{" "}
                        {issue.priority ||
                          "Normal"}
                      </span>

                    </div>


                    {/* =================================================
                        MEDIA
                    ================================================= */}

                    {issue.media?.length > 0 && (

                      <div className="issue-media-section">

                        <strong>
                          Uploaded Evidence
                        </strong>

                        <div className="issue-media-grid">

                          {issue.media.map(
                            (media, index) => {

                              const mediaUrl =
                                getMediaUrl(
                                  media.url
                                );

                              console.log(
                                "MEDIA URL:",
                                mediaUrl
                              );

                              /* VIDEO */

                              if (
                                media.type ===
                                "video"
                              ) {

                                return (

                                  <div
                                    className="issue-media-item"
                                    key={index}
                                  >

                                    <video
                                      src={mediaUrl}
                                      controls
                                      crossOrigin="anonymous"
                                      onError={() => {
                                        console.error(
                                          "Video failed to load:",
                                          mediaUrl
                                        );
                                      }}
                                    />

                                    <span>

                                      <Video
                                        size={12}
                                      />

                                      Video

                                    </span>

                                  </div>

                                );
                              }


                              /* IMAGE */

                              return (

                                <div
                                  className="issue-media-item"
                                  key={index}
                                >

                                  <img
                                    src={`${mediaUrl}?v=${Date.now()}`}
                                    alt="Issue evidence"
                                    crossOrigin="anonymous"
                                    loading="lazy"

                                    onLoad={() => {
                                      console.log(
                                        "Image loaded successfully:",
                                        mediaUrl
                                      );
                                    }}

                                    onError={(e) => {

                                      console.error(
                                        "Image failed to load:",
                                        mediaUrl
                                      );

                                      e.currentTarget.style.display =
                                        "none";

                                      const parent =
                                        e.currentTarget.parentElement;

                                      if (parent) {
                                        parent.classList.add(
                                          "media-error"
                                        );
                                      }

                                    }}

                                  />

                                  <span>

                                    <ImageIcon
                                      size={12}
                                    />

                                    Image

                                  </span>

                                </div>

                              );
                            }
                          )}

                        </div>

                      </div>

                    )}


                    {/* =================================================
                        ASSIGNMENT
                    ================================================= */}

                    <div className="issue-assignment">

                      <div className="assignment-person">

                        <UserRound size={15} />

                        <div>

                          <small>
                            Assigned Officer
                          </small>

                          <strong>

                            {issue.assignedTo
                              ? "Officer assigned"
                              : "Not assigned"}

                          </strong>

                        </div>

                      </div>


                      {!issue.assignedTo && (

                        <button
                          className="assign-button"
                          onClick={() =>
                            openAssignModal(issue)
                          }
                        >

                          <UserPlus size={15} />

                          Assign Officer

                        </button>

                      )}

                    </div>


                    {/* REPORTED BY */}

                    {issue.reportedBy && (

                      <div className="issue-reported-by">

                        <small>
                          Reported by
                        </small>

                        <span>

                          {typeof issue.reportedBy ===
                          "object"
                            ? issue.reportedBy.name ||
                              issue.reportedBy.email ||
                              issue.reportedBy._id
                            : issue.reportedBy}

                        </span>

                      </div>

                    )}

                  </div>

                </article>

              ))}

            </section>

          )}

        </main>


        {/* =================================================
            ASSIGN OFFICER MODAL
        ================================================= */}

        {showAssignModal && (

          <div
            className="modal-overlay"
            onClick={closeAssignModal}
          >

            <div
              className="assign-modal"
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              <div className="modal-header">

                <div>

                  <h2>
                    Assign Officer
                  </h2>

                  <p>
                    Enter the MongoDB ID of the
                    officer you want to assign.
                  </p>

                </div>

                <button
                  onClick={closeAssignModal}
                  className="modal-close"
                >
                  <X size={17} />
                </button>

              </div>


              <div className="selected-issue">

                <small>
                  Issue
                </small>

                <strong>
                  {selectedIssue?.title}
                </strong>

                <span>
                  Department ID:{" "}
                  {selectedIssue?.departmentId ||
                    "Not available"}
                </span>

              </div>


              <label className="modal-label">
                Officer ID
              </label>

              <input
                className="officer-select"
                type="text"
                placeholder="Enter officer MongoDB ID"
                value={selectedOfficer}
                onChange={(e) =>
                  setSelectedOfficer(
                    e.target.value
                  )
                }
              />


              <p className="assignment-note">
                The backend will verify that the ID
                belongs to an officer and that the
                officer belongs to the issue department.
              </p>


              <div className="modal-actions">

                <button
                  className="cancel-button"
                  onClick={closeAssignModal}
                >
                  Cancel
                </button>

                <button
                  className="confirm-assign-button"
                  onClick={handleAssignOfficer}
                  disabled={
                    !selectedOfficer.trim() ||
                    assigning
                  }
                >

                  {assigning
                    ? "Assigning..."
                    : "Assign Officer"}

                </button>

              </div>

            </div>

          </div>

        )}

      </div>
    </>
  );
}

export default AdminIssues;

