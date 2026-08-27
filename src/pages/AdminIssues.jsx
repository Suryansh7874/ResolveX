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
} from "lucide-react";

import api from "../services/api";

function AdminIssues() {
  const [issues, setIssues] = useState([]);
  const [officers, setOfficers] = useState([]);

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

      setIssues(response.data.issues || []);
    } catch (err) {
      console.error("Failed to fetch issues:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load issues"
      );
    } finally {
      setLoading(false);
    }
  };


  /* =====================================================
     FETCH OFFICERS
  ===================================================== */

  const fetchOfficers = async () => {
    try {

      /*
       * TEMPORARY ENDPOINT
       *
       * We will replace this with your actual
       * officer endpoint once you show me the
       * user/admin controller + routes.
       */

      const response = await api.get("/users/officers");

      setOfficers(response.data.officers || []);

    } catch (err) {

      console.error(
        "Failed to fetch officers:",
        err
      );

    }
  };


  /* =====================================================
     INITIAL LOAD
  ===================================================== */

  useEffect(() => {
    fetchIssues();
    fetchOfficers();
  }, []);


  /* =====================================================
     OPEN ASSIGN MODAL
  ===================================================== */

  const openAssignModal = (issue) => {

    setSelectedIssue(issue);
    setSelectedOfficer("");

    setShowAssignModal(true);
  };


  /* =====================================================
     CLOSE ASSIGN MODAL
  ===================================================== */

  const closeAssignModal = () => {

    setShowAssignModal(false);

    setSelectedIssue(null);
    setSelectedOfficer("");
  };


  /* =====================================================
     ASSIGN OFFICER
  ===================================================== */

  const handleAssignOfficer = async () => {

    if (!selectedIssue || !selectedOfficer) {
      return;
    }

    try {

      setAssigning(true);

      const response = await api.put(
        `/issues/${selectedIssue._id}/assign`,
        {
          officerId: selectedOfficer,
        }
      );

      /*
       * Replace the updated issue in our local state.
       */

      const updatedIssue =
        response.data.issue;

      setIssues((currentIssues) =>
        currentIssues.map((issue) =>
          issue._id === updatedIssue._id
            ? updatedIssue
            : issue
        )
      );

      closeAssignModal();

    } catch (err) {

      console.error(
        "Assignment failed:",
        err
      );

      alert(
        err.response?.data?.message ||
          "Failed to assign officer"
      );

    } finally {

      setAssigning(false);

    }
  };


  /* =====================================================
     FILTER ISSUES
  ===================================================== */

  const filteredIssues = issues.filter(
    (issue) => {

      const searchText =
        `${issue.title || ""} ${
          issue.description || ""
        } ${issue.category || ""}`
          .toLowerCase();

      const matchesSearch =
        searchText.includes(
          search.toLowerCase()
        );

      const matchesStatus =
        statusFilter === "ALL" ||
        issue.status === statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    }
  );


  /* =====================================================
     STATUS ICON
  ===================================================== */

  const getStatusIcon = (status) => {

    switch (status) {

      case "RESOLVED":
        return <CheckCircle2 size={18} />;

      case "IN_PROGRESS":
        return <AlertCircle size={18} />;

      case "ASSIGNED":
        return <UserRound size={18} />;

      default:
        return <Clock3 size={18} />;
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


  return (
    <div className="admin-dashboard">

      {/* =================================================
          NAVBAR
      ================================================= */}

      <header className="admin-navbar">

        <Link
          to="/admin"
          className="admin-brand"
        >

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

            <strong>
              Admin
            </strong>

            <small>
              Administrator
            </small>

          </div>

        </div>

      </header>


      {/* =================================================
          CONTENT
      ================================================= */}

      <main className="admin-content">

        {/* PAGE HEADER */}

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
              Review civic issues and assign
              them to the appropriate officers.
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
                setStatusFilter(
                  e.target.value
                )
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


        {/* =================================================
            ERROR
        ================================================= */}

        {error && (

          <div className="admin-error">
            {error}
          </div>

        )}


        {/* =================================================
            LOADING
        ================================================= */}

        {loading ? (

          <div className="admin-loading">
            Loading issues...
          </div>

        ) : filteredIssues.length === 0 ? (

          <div className="no-issues">
            <ClipboardListEmpty />
            <h3>No issues found</h3>
            <p>
              There are no issues matching
              your search.
            </p>
          </div>

        ) : (

          /* =================================================
             ISSUE LIST
          ================================================= */

          <section className="admin-full-issues">

            <div className="issues-count">

              <strong>
                {filteredIssues.length}
              </strong>

              issues found

            </div>


            {filteredIssues.map(
              (issue) => (

                <article
                  className="admin-full-issue"
                  key={issue._id}
                >

                  {/* ICON */}

                  <div
                    className={`admin-full-issue-icon ${
                      getStatusClass(
                        issue.status
                      )
                    }`}
                  >
                    {getStatusIcon(
                      issue.status
                    )}
                  </div>


                  {/* DETAILS */}

                  <div className="full-issue-details">

                    <div className="full-issue-top">

                      <div>

                        <span className="issue-id">
                          #{issue._id?.slice(-6)}
                        </span>

                        <h2>
                          {issue.title}
                        </h2>

                      </div>


                      <span
                        className={`admin-status ${
                          getStatusClass(
                            issue.status
                          )
                        }`}
                      >
                        {issue.status?.replace(
                          "_",
                          " "
                        )}
                      </span>

                    </div>


                    <p className="issue-description">
                      {issue.description}
                    </p>


                    <div className="full-issue-meta">

                      <span>
                        <MapPin size={14} />

                        {issue.location
                          ?.coordinates
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


                    {/* ASSIGNED OFFICER */}

                    <div className="issue-assignment">

                      <div className="assignment-person">

                        <UserRound size={16} />

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


                      {/* ASSIGN BUTTON */}

                      {!issue.assignedTo && (

                        <button
                          className="assign-button"
                          onClick={() =>
                            openAssignModal(
                              issue
                            )
                          }
                        >
                          <UserPlus
                            size={16}
                          />

                          Assign Officer
                        </button>

                      )}

                    </div>

                  </div>

                </article>

              )
            )}

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
                  Assign an officer to this issue.
                </p>

              </div>

              <button
                onClick={closeAssignModal}
                className="modal-close"
              >
                <X size={18} />
              </button>

            </div>


            {/* ISSUE */}

            <div className="selected-issue">

              <small>
                Issue
              </small>

              <strong>
                {selectedIssue?.title}
              </strong>

              <span>
                Department:{" "}
                {selectedIssue?.departmentId
                  ? "Assigned department"
                  : "Not available"}
              </span>

            </div>


            {/* OFFICER */}

            <label className="modal-label">
              Select Officer
            </label>

            <select
              className="officer-select"
              value={selectedOfficer}
              onChange={(e) =>
                setSelectedOfficer(
                  e.target.value
                )
              }
            >

              <option value="">
                Select an officer
              </option>

              {officers.map(
                (officer) => (

                  <option
                    key={officer._id}
                    value={officer._id}
                  >
                    {officer.name}
                  </option>

                )
              )}

            </select>


            <p className="assignment-note">
              Only officers belonging to the
              issue's department can be assigned.
            </p>


            {/* ACTIONS */}

            <div className="modal-actions">

              <button
                className="cancel-button"
                onClick={closeAssignModal}
              >
                Cancel
              </button>

              <button
                className="confirm-assign-button"
                onClick={
                  handleAssignOfficer
                }
                disabled={
                  !selectedOfficer ||
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
  );
}


/* =====================================================
   EMPTY ICON
===================================================== */

function ClipboardListEmpty() {
  return (
    <div className="empty-issue-icon">
      <AlertCircle size={25} />
    </div>
  );
}


export default AdminIssues;