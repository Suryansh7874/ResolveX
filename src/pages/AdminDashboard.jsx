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
} from "lucide-react";

import api from "../services/api";

function AdminDashboard() {
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchIssues();
    }, []);

    const fetchIssues = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/issues");

            setIssues(response.data?.issues || []);
        } catch (err) {
            console.error("Failed to fetch admin issues:", err);

            setError(
                err.response?.data?.message ||
                "Unable to load dashboard data."
            );
        } finally {
            setLoading(false);
        }
    };

    // =========================
    // ISSUE COUNTS
    // =========================

    const totalIssues = issues.length;

    const reportedIssues = issues.filter(
        (issue) => issue.status === "REPORTED"
    ).length;

    const verifiedIssues = issues.filter(
        (issue) => issue.status === "VERIFIED"
    ).length;

    const assignedIssues = issues.filter(
        (issue) => issue.status === "ASSIGNED"
    ).length;

    const inProgressIssues = issues.filter(
        (issue) => issue.status === "IN_PROGRESS"
    ).length;

    const resolvedIssues = issues.filter(
        (issue) => issue.status === "RESOLVED"
    ).length;

    const unassignedIssues = issues.filter(
        (issue) => !issue.assignedTo
    ).length;

    const recentIssues = [...issues]
        .sort(
            (a, b) =>
                new Date(b.createdAt || 0) -
                new Date(a.createdAt || 0)
        )
        .slice(0, 5);

    // =========================
    // STATUS HELPERS
    // =========================

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

    const formatStatus = (status) => {
        return status?.replace("_", " ") || "REPORTED";
    };

    // =========================
    // UI
    // =========================

    return (
        <>
            <style>{`
                * {
                    box-sizing: border-box;
                }

                .admin-dashboard {
                    min-height: 100vh;
                    background: #f5f8fb;
                    color: #173b59;
                    font-family:
                        Inter,
                        -apple-system,
                        BlinkMacSystemFont,
                        "Segoe UI",
                        sans-serif;
                }

                /* ================= NAVBAR ================= */

                .admin-navbar {
                    height: 82px;
                    background: #ffffff;
                    border-bottom: 1px solid #e4edf2;
                    display: flex;
                    align-items: center;
                    padding: 0 5%;
                    gap: 40px;
                    position: sticky;
                    top: 0;
                    z-index: 20;
                }

                .admin-brand {
                    display: flex;
                    align-items: center;
                    gap: 13px;
                    text-decoration: none;
                    min-width: 270px;
                }

                .admin-logo {
                    width: 44px;
                    height: 44px;
                    border-radius: 12px;
                    background: #079dcc;
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 22px;
                    font-weight: 800;
                    box-shadow: 0 5px 12px rgba(7, 157, 204, 0.18);
                }

                .admin-brand h2 {
                    margin: 0;
                    font-size: 21px;
                    color: #173b59;
                    font-weight: 750;
                    line-height: 1.1;
                }

                .admin-brand span {
                    display: block;
                    margin-top: 3px;
                    color: #8195a5;
                    font-size: 9px;
                    letter-spacing: 0.3px;
                }

                .admin-nav-links {
                    height: 100%;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    flex: 1;
                }

                .admin-nav-links a {
                    height: 100%;
                    padding: 0 16px;
                    display: flex;
                    align-items: center;
                    position: relative;
                    text-decoration: none;
                    color: #647c8e;
                    font-size: 13px;
                    font-weight: 600;
                    transition: 0.2s ease;
                }

                .admin-nav-links a:hover {
                    color: #079dcc;
                }

                .admin-nav-links a.active {
                    color: #079dcc;
                }

                .admin-nav-links a.active::after {
                    content: "";
                    position: absolute;
                    bottom: 0;
                    left: 16px;
                    right: 16px;
                    height: 3px;
                    background: #08a8dc;
                    border-radius: 3px 3px 0 0;
                }

                .admin-nav-right {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .admin-avatar {
                    width: 42px;
                    height: 42px;
                    border-radius: 50%;
                    background: #e2f5fb;
                    color: #078db9;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 15px;
                    font-weight: 750;
                }

                .admin-profile {
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                }

                .admin-profile strong {
                    font-size: 13px;
                    color: #173b59;
                }

                .admin-profile small {
                    font-size: 9px;
                    color: #8497a5;
                }

                /* ================= MAIN ================= */

                .admin-content {
                    max-width: 1380px;
                    margin: 0 auto;
                    padding: 42px 38px 60px;
                }

                /* ================= HEADER ================= */

                .admin-page-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                    margin-bottom: 28px;
                    gap: 20px;
                }

                .admin-eyebrow {
                    display: inline-block;
                    color: #079dcc;
                    font-size: 11px;
                    font-weight: 750;
                    letter-spacing: 1.5px;
                    margin-bottom: 8px;
                }

                .admin-page-header h1 {
                    margin: 0;
                    font-size: 32px;
                    line-height: 1.2;
                    color: #173b59;
                    font-weight: 750;
                }

                .admin-page-header p {
                    margin: 8px 0 0;
                    color: #728898;
                    font-size: 14px;
                }

                .admin-refresh-button {
                    border: 1px solid #d5e4eb;
                    background: white;
                    color: #087fae;
                    border-radius: 9px;
                    padding: 10px 17px;
                    font-size: 13px;
                    font-weight: 650;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    transition: all 0.2s ease;
                    box-shadow: 0 3px 10px rgba(30, 70, 100, 0.04);
                }

                .admin-refresh-button:hover:not(:disabled) {
                    border-color: #9dd9eb;
                    background: #f2fbfe;
                    transform: translateY(-1px);
                }

                .admin-refresh-button:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                }

                .spin {
                    animation: admin-spin 0.8s linear infinite;
                }

                @keyframes admin-spin {
                    to {
                        transform: rotate(360deg);
                    }
                }

                /* ================= ERROR ================= */

                .admin-error {
                    background: #fff2f2;
                    border: 1px solid #f2cccc;
                    color: #b33b3b;
                    padding: 13px 16px;
                    border-radius: 10px;
                    margin-bottom: 22px;
                    font-size: 13px;
                }

                /* ================= STAT CARDS ================= */

                .admin-stats-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 18px;
                    margin-bottom: 24px;
                }

                .admin-stat-card {
                    background: #ffffff;
                    border: 1px solid #e1eaf0;
                    border-radius: 15px;
                    padding: 22px;
                    min-height: 125px;
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    box-shadow: 0 4px 15px rgba(25, 65, 95, 0.045);
                    transition: 0.2s ease;
                }

                .admin-stat-card:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 9px 24px rgba(25, 65, 95, 0.08);
                }

                .admin-stat-icon {
                    width: 52px;
                    height: 52px;
                    min-width: 52px;
                    border-radius: 13px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .admin-stat-icon.blue {
                    background: #e4f7fd;
                    color: #08a3d5;
                }

                .admin-stat-icon.orange {
                    background: #fff3df;
                    color: #ed9808;
                }

                .admin-stat-icon.purple {
                    background: #f0eaff;
                    color: #815bd1;
                }

                .admin-stat-icon.green {
                    background: #e3f9ef;
                    color: #0aae76;
                }

                .admin-stat-card > div:last-child {
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                }

                .admin-stat-card span {
                    color: #7a8f9f;
                    font-size: 12px;
                    font-weight: 550;
                }

                .admin-stat-card strong {
                    color: #173b59;
                    font-size: 28px;
                    line-height: 1;
                    font-weight: 750;
                }

                /* ================= STATUS SUMMARY ================= */

                .admin-status-summary {
                    background: white;
                    border: 1px solid #e1eaf0;
                    border-radius: 15px;
                    padding: 23px 25px;
                    margin-bottom: 24px;
                    box-shadow: 0 4px 15px rgba(25, 65, 95, 0.04);
                }

                .admin-panel-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 15px;
                    margin-bottom: 18px;
                }

                .admin-panel-header h2 {
                    margin: 0;
                    color: #173b59;
                    font-size: 17px;
                    font-weight: 700;
                }

                .admin-panel-header p {
                    margin: 5px 0 0;
                    color: #8295a3;
                    font-size: 11px;
                }

                .status-summary-grid {
                    display: grid;
                    grid-template-columns: repeat(5, 1fr);
                    gap: 12px;
                }

                .status-summary-grid > div {
                    background: #f8fafc;
                    border: 1px solid #edf2f5;
                    border-radius: 10px;
                    padding: 14px 15px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    transition: 0.2s ease;
                }

                .status-summary-grid > div:hover {
                    background: #f3f9fc;
                    border-color: #d9edf4;
                }

                .status-summary-grid span {
                    color: #6e8495;
                    font-size: 12px;
                }

                .status-summary-grid strong {
                    color: #173b59;
                    font-size: 17px;
                }

                /* ================= MAIN GRID ================= */

                .admin-main-grid {
                    display: grid;
                    grid-template-columns: minmax(0, 1.65fr) minmax(300px, 0.75fr);
                    gap: 24px;
                    align-items: start;
                }

                .admin-panel,
                .admin-quick-panel {
                    background: white;
                    border: 1px solid #e1eaf0;
                    border-radius: 15px;
                    box-shadow: 0 4px 15px rgba(25, 65, 95, 0.04);
                }

                .admin-panel {
                    padding: 24px;
                }

                .admin-quick-panel {
                    padding: 24px;
                }

                .panel-link {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    color: #079dcc;
                    text-decoration: none;
                    font-size: 11px;
                    font-weight: 700;
                }

                .panel-link:hover {
                    text-decoration: underline;
                }

                /* ================= RECENT ISSUES ================= */

                .admin-recent-list {
                    border-top: 1px solid #edf2f5;
                }

                .admin-recent-item {
                    min-height: 78px;
                    display: flex;
                    align-items: center;
                    gap: 14px;
                    padding: 14px 4px;
                    border-bottom: 1px solid #edf2f5;
                }

                .admin-recent-item:last-child {
                    border-bottom: none;
                }

                .admin-recent-icon {
                    width: 42px;
                    height: 42px;
                    min-width: 42px;
                    border-radius: 11px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .admin-recent-icon.reported {
                    background: #fff4df;
                    color: #e39709;
                }

                .admin-recent-icon.verified {
                    background: #eaf2ff;
                    color: #427dca;
                }

                .admin-recent-icon.assigned {
                    background: #f0eaff;
                    color: #8059ce;
                }

                .admin-recent-icon.progress {
                    background: #e4f8fd;
                    color: #078caf;
                }

                .admin-recent-icon.resolved {
                    background: #e3f9ef;
                    color: #0ba875;
                }

                .admin-recent-info {
                    min-width: 0;
                    flex: 1;
                }

                .admin-recent-title-row {
                    display: flex;
                    align-items: center;
                    gap: 9px;
                    margin-bottom: 6px;
                }

                .admin-recent-title-row strong {
                    color: #25465e;
                    font-size: 13px;
                    font-weight: 650;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .admin-status {
                    flex-shrink: 0;
                    padding: 4px 8px;
                    border-radius: 20px;
                    font-size: 9px;
                    font-weight: 750;
                    letter-spacing: 0.2px;
                }

                .admin-status.reported {
                    background: #fff3dc;
                    color: #bf7800;
                }

                .admin-status.verified {
                    background: #e9f1ff;
                    color: #3970b8;
                }

                .admin-status.assigned {
                    background: #f0eaff;
                    color: #7652bf;
                }

                .admin-status.progress {
                    background: #e4f8fd;
                    color: #087c9e;
                }

                .admin-status.resolved {
                    background: #e2f8ee;
                    color: #07865b;
                }

                .admin-issue-meta {
                    display: flex;
                    align-items: center;
                    gap: 13px;
                    color: #8799a6;
                    font-size: 10px;
                }

                .admin-issue-meta span {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                }

                .admin-issue-arrow {
                    width: 32px;
                    height: 32px;
                    min-width: 32px;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #8aa1b0;
                    background: #f6f9fb;
                    text-decoration: none;
                    transition: 0.2s ease;
                }

                .admin-issue-arrow:hover {
                    color: #079dcc;
                    background: #eaf8fc;
                }

                /* ================= QUICK ACTIONS ================= */

                .admin-quick-panel > .admin-panel-header {
                    margin-bottom: 13px;
                }

                .admin-quick-panel > a {
                    display: flex;
                    align-items: center;
                    gap: 11px;
                    padding: 12px 8px;
                    border-top: 1px solid #edf2f5;
                    text-decoration: none;
                    transition: 0.2s ease;
                }

                .admin-quick-panel > a:hover {
                    background: #f8fbfd;
                    border-radius: 8px;
                }

                .quick-action-icon {
                    width: 38px;
                    height: 38px;
                    min-width: 38px;
                    border-radius: 9px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .quick-action-icon.blue {
                    background: #e5f7fc;
                    color: #079dcc;
                }

                .quick-action-icon.green {
                    background: #e4f9ef;
                    color: #0aab73;
                }

                .quick-action-icon.purple {
                    background: #f0eaff;
                    color: #8059ce;
                }

                .admin-quick-panel > a > div:nth-child(2) {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 3px;
                }

                .admin-quick-panel > a strong {
                    color: #284961;
                    font-size: 12px;
                }

                .admin-quick-panel > a span {
                    color: #8a9ba8;
                    font-size: 10px;
                }

                .admin-quick-panel > a > svg {
                    color: #9aaab5;
                }

                /* ================= UNASSIGNED ================= */

                .unassigned-panel {
                    margin-top: 15px;
                    padding: 16px;
                    border: 1px solid #f0dfbd;
                    background: #fffaf1;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    gap: 11px;
                }

                .unassigned-icon {
                    width: 39px;
                    height: 39px;
                    min-width: 39px;
                    border-radius: 10px;
                    background: #fff0d1;
                    color: #dc8b0a;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .unassigned-panel > div:nth-child(2) {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }

                .unassigned-panel span {
                    color: #92754b;
                    font-size: 10px;
                }

                .unassigned-panel strong {
                    color: #795720;
                    font-size: 20px;
                }

                .unassigned-panel > a {
                    color: #b7873c;
                    display: flex;
                }

                /* ================= LOADING / EMPTY ================= */

                .admin-loading {
                    padding: 45px 10px;
                    text-align: center;
                    color: #8194a3;
                    font-size: 13px;
                }

                .admin-empty {
                    padding: 45px 20px;
                    text-align: center;
                    color: #8194a3;
                }

                .admin-empty svg {
                    color: #9db0bd;
                    margin-bottom: 7px;
                }

                .admin-empty h3 {
                    margin: 0;
                    color: #405d72;
                    font-size: 14px;
                }

                .admin-empty p {
                    margin: 6px 0 0;
                    color: #8b9ca8;
                    font-size: 11px;
                }

                /* ================= RESPONSIVE ================= */

                @media (max-width: 1100px) {

                    .admin-navbar {
                        padding: 0 3%;
                        gap: 20px;
                    }

                    .admin-brand {
                        min-width: 210px;
                    }

                    .admin-content {
                        padding: 35px 28px 50px;
                    }

                    .admin-stats-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }

                    .admin-main-grid {
                        grid-template-columns: 1fr;
                    }

                    .status-summary-grid {
                        grid-template-columns: repeat(3, 1fr);
                    }
                }

                @media (max-width: 750px) {

                    .admin-navbar {
                        height: auto;
                        min-height: 70px;
                        padding: 12px 18px;
                        flex-wrap: wrap;
                    }

                    .admin-brand {
                        min-width: 0;
                        flex: 1;
                    }

                    .admin-nav-links {
                        order: 3;
                        width: 100%;
                        height: 45px;
                        overflow-x: auto;
                    }

                    .admin-nav-links a {
                        height: 45px;
                    }

                    .admin-profile {
                        display: none;
                    }

                    .admin-content {
                        padding: 28px 18px 45px;
                    }

                    .admin-page-header {
                        align-items: flex-start;
                        flex-direction: column;
                    }

                    .admin-page-header h1 {
                        font-size: 27px;
                    }

                    .admin-refresh-button {
                        align-self: flex-start;
                    }

                    .admin-stats-grid {
                        grid-template-columns: 1fr;
                    }

                    .status-summary-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }

                    .admin-recent-title-row {
                        align-items: flex-start;
                        flex-direction: column;
                        gap: 5px;
                    }
                }

                @media (max-width: 480px) {

                    .status-summary-grid {
                        grid-template-columns: 1fr;
                    }

                    .admin-panel,
                    .admin-quick-panel,
                    .admin-status-summary {
                        padding: 18px;
                    }

                    .admin-recent-item {
                        align-items: flex-start;
                    }

                    .admin-issue-arrow {
                        display: none;
                    }

                    .admin-issue-meta {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 4px;
                    }
                }
            `}</style>

            <div className="admin-dashboard">

                {/* ================= NAVBAR ================= */}

                <header className="admin-navbar">

                    <Link to="/admin" className="admin-brand">

                        <div className="admin-logo">
                            R
                        </div>

                        <div>
                            <h2>ResolveX</h2>
                            <span>Administration Portal</span>
                        </div>

                    </Link>

                    <nav className="admin-nav-links">

                        <Link
                            to="/admin"
                            className="active"
                        >
                            Dashboard
                        </Link>

                        <Link to="/admin/issues">
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
                            <small>Administrator</small>
                        </div>

                    </div>

                </header>


                {/* ================= MAIN ================= */}

                <main className="admin-content">

                    {/* HEADER */}

                    <section className="admin-page-header">

                        <div>

                            <span className="admin-eyebrow">
                                OVERVIEW
                            </span>

                            <h1>
                                Admin Dashboard
                            </h1>

                            <p>
                                Monitor civic issues and track their
                                resolution status.
                            </p>

                        </div>

                        <button
                            className="admin-refresh-button"
                            onClick={fetchIssues}
                            disabled={loading}
                        >

                            {loading ? (
                                <>
                                    <Loader2
                                        size={16}
                                        className="spin"
                                    />
                                    Refreshing...
                                </>
                            ) : (
                                <>
                                    ↻
                                    Refresh
                                </>
                            )}

                        </button>

                    </section>


                    {/* ERROR */}

                    {error && (
                        <div className="admin-error">
                            {error}
                        </div>
                    )}


                    {/* ================= STAT CARDS ================= */}

                    <section className="admin-stats-grid">

                        <div className="admin-stat-card">

                            <div className="admin-stat-icon blue">
                                <ClipboardList size={22} />
                            </div>

                            <div>
                                <span>Total Issues</span>
                                <strong>
                                    {loading ? "—" : totalIssues}
                                </strong>
                            </div>

                        </div>


                        <div className="admin-stat-card">

                            <div className="admin-stat-icon orange">
                                <Clock3 size={22} />
                            </div>

                            <div>
                                <span>Reported</span>
                                <strong>
                                    {loading ? "—" : reportedIssues}
                                </strong>
                            </div>

                        </div>


                        <div className="admin-stat-card">

                            <div className="admin-stat-icon purple">
                                <Users size={22} />
                            </div>

                            <div>
                                <span>Assigned</span>
                                <strong>
                                    {loading ? "—" : assignedIssues}
                                </strong>
                            </div>

                        </div>


                        <div className="admin-stat-card">

                            <div className="admin-stat-icon green">
                                <CheckCircle2 size={22} />
                            </div>

                            <div>
                                <span>Resolved</span>
                                <strong>
                                    {loading ? "—" : resolvedIssues}
                                </strong>
                            </div>

                        </div>

                    </section>


                    {/* ================= STATUS ================= */}

                    <section className="admin-status-summary">

                        <div className="admin-panel-header">

                            <div>
                                <h2>Issue Status</h2>

                                <p>
                                    Current distribution of reported issues.
                                </p>
                            </div>

                        </div>


                        <div className="status-summary-grid">

                            <div>
                                <span>Reported</span>
                                <strong>{reportedIssues}</strong>
                            </div>

                            <div>
                                <span>Verified</span>
                                <strong>{verifiedIssues}</strong>
                            </div>

                            <div>
                                <span>Assigned</span>
                                <strong>{assignedIssues}</strong>
                            </div>

                            <div>
                                <span>In Progress</span>
                                <strong>{inProgressIssues}</strong>
                            </div>

                            <div>
                                <span>Resolved</span>
                                <strong>{resolvedIssues}</strong>
                            </div>

                        </div>

                    </section>


                    {/* ================= LOWER SECTION ================= */}

                    <section className="admin-main-grid">

                        {/* RECENT ISSUES */}

                        <div className="admin-panel">

                            <div className="admin-panel-header">

                                <div>
                                    <h2>Recent Issues</h2>

                                    <p>
                                        Latest issues received by ResolveX.
                                    </p>
                                </div>

                                <Link
                                    to="/admin/issues"
                                    className="panel-link"
                                >
                                    View all
                                    <ArrowUpRight size={15} />
                                </Link>

                            </div>


                            {loading ? (

                                <div className="admin-loading">
                                    Loading issues...
                                </div>

                            ) : recentIssues.length === 0 ? (

                                <div className="admin-empty">

                                    <ClipboardList size={28} />

                                    <h3>
                                        No issues yet
                                    </h3>

                                    <p>
                                        New citizen reports will appear here.
                                    </p>

                                </div>

                            ) : (

                                <div className="admin-recent-list">

                                    {recentIssues.map((issue) => (

                                        <div
                                            className="admin-recent-item"
                                            key={issue._id}
                                        >

                                            <div
                                                className={`admin-recent-icon ${
                                                    getStatusClass(
                                                        issue.status
                                                    )
                                                }`}
                                            >

                                                {issue.status ===
                                                "RESOLVED" ? (
                                                    <CheckCircle2 size={17} />
                                                ) : issue.status ===
                                                    "IN_PROGRESS" ? (
                                                    <AlertCircle size={17} />
                                                ) : (
                                                    <Clock3 size={17} />
                                                )}

                                            </div>


                                            <div className="admin-recent-info">

                                                <div className="admin-recent-title-row">

                                                    <strong>
                                                        {issue.title ||
                                                            "Untitled Issue"}
                                                    </strong>

                                                    <span
                                                        className={`admin-status ${
                                                            getStatusClass(
                                                                issue.status
                                                            )
                                                        }`}
                                                    >
                                                        {formatStatus(
                                                            issue.status
                                                        )}
                                                    </span>

                                                </div>


                                                <div className="admin-issue-meta">

                                                    <span>
                                                        {issue.category ||
                                                            "Unclassified"}
                                                    </span>

                                                    <span>
                                                        <MapPin size={12} />

                                                        {issue.location
                                                            ?.coordinates
                                                            ? `${issue.location.coordinates[1].toFixed(
                                                                4
                                                            )}, ${issue.location.coordinates[0].toFixed(
                                                                4
                                                            )}`
                                                            : "No location"}
                                                    </span>

                                                </div>

                                            </div>


                                            <Link
                                                to="/admin/issues"
                                                className="admin-issue-arrow"
                                            >
                                                <ArrowUpRight size={17} />
                                            </Link>

                                        </div>

                                    ))}

                                </div>

                            )}

                        </div>


                        {/* ================= SIDE ================= */}

                        <aside className="admin-side">

                            <div className="admin-quick-panel">

                                <div className="admin-panel-header">

                                    <div>
                                        <h2>Quick Actions</h2>

                                        <p>
                                            Frequently used tools.
                                        </p>
                                    </div>

                                </div>


                                <Link to="/admin/issues">

                                    <div className="quick-action-icon blue">
                                        <ClipboardList size={18} />
                                    </div>

                                    <div>
                                        <strong>
                                            Manage Issues
                                        </strong>

                                        <span>
                                            Assign and track issues
                                        </span>
                                    </div>

                                    <ArrowUpRight size={15} />

                                </Link>


                                <Link to="/admin/officers">

                                    <div className="quick-action-icon green">
                                        <Users size={18} />
                                    </div>

                                    <div>
                                        <strong>
                                            Manage Officers
                                        </strong>

                                        <span>
                                            View officer management
                                        </span>
                                    </div>

                                    <ArrowUpRight size={15} />

                                </Link>


                                <Link to="/admin/citizens">

                                    <div className="quick-action-icon purple">
                                        <UserCog size={18} />
                                    </div>

                                    <div>
                                        <strong>
                                            Manage Citizens
                                        </strong>

                                        <span>
                                            View citizen information
                                        </span>
                                    </div>

                                    <ArrowUpRight size={15} />

                                </Link>

                            </div>


                            {/* UNASSIGNED */}

                            <div className="unassigned-panel">

                                <div className="unassigned-icon">
                                    <AlertCircle size={20} />
                                </div>

                                <div>

                                    <span>
                                        Issues awaiting assignment
                                    </span>

                                    <strong>
                                        {loading
                                            ? "—"
                                            : unassignedIssues}
                                    </strong>

                                </div>

                                <Link to="/admin/issues">
                                    <ArrowUpRight size={16} />
                                </Link>

                            </div>

                        </aside>

                    </section>

                </main>

            </div>
        </>
    );
}

export default AdminDashboard;