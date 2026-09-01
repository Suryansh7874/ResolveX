import { useEffect, useState } from "react";
import api from "../services/api";

function MyIssues() {
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchIssues = async () => {
            try {
                const response = await api.get("/issues");

                const allIssues = response.data.issues || response.data;

                const storedUser = localStorage.getItem("user");

                if (!storedUser) {
                    setIssues([]);
                    return;
                }

                const user = JSON.parse(storedUser);

                const userIssues = allIssues.filter((issue) => {
                    const reportedBy =
                        typeof issue.reportedBy === "object"
                            ? issue.reportedBy?._id
                            : issue.reportedBy;

                    return reportedBy === user.id || reportedBy === user._id;
                });

                setIssues(userIssues);
            } catch (error) {
                console.error("Error fetching issues:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchIssues();
    }, []);

    const getStatus = (status) => {
        const value = status?.toLowerCase();

        if (value === "resolved") {
            return {
                label: "Resolved",
                className: "resolved",
                icon: "✓",
            };
        }

        if (value === "in progress" || value === "inprogress") {
            return {
                label: "In Progress",
                className: "in-progress",
                icon: "↻",
            };
        }

        return {
            label: "Reported",
            className: "reported",
            icon: "●",
        };
    };

    const getPriority = (priority) => {
        const value = priority?.toLowerCase();

        if (value === "high" || value === "critical") {
            return "high";
        }

        if (value === "low") {
            return "low";
        }

        return "medium";
    };

    const totalIssues = issues.length;

    const pendingIssues = issues.filter((issue) => {
        const status = issue.status?.toLowerCase();
        return (
            status === "reported" ||
            status === "pending" ||
            !status
        );
    }).length;

    const inProgressIssues = issues.filter((issue) => {
        const status = issue.status?.toLowerCase();
        return status === "in progress" || status === "inprogress";
    }).length;

    const resolvedIssues = issues.filter(
        (issue) => issue.status?.toLowerCase() === "resolved"
    ).length;

    return (
        <>
            <style>{`
                * {
                    box-sizing: border-box;
                }

                .my-issues-page {
                    min-height: calc(100vh - 70px);
                    background: #f5f7fb;
                    padding: 42px 46px 70px;
                    color: #102a43;
                }

                .my-issues-container {
                    max-width: 1500px;
                    margin: 0 auto;
                }

                /* ================= HEADER ================= */

                .issues-header {
                    background: #ffffff;
                    border: 1px solid #e1e8f0;
                    border-radius: 18px;
                    padding: 30px 34px;
                    display: flex;
                    align-items: center;
                    gap: 22px;
                    margin-bottom: 30px;
                    box-shadow: 0 5px 18px rgba(31, 60, 90, 0.06);
                }

                .header-icon {
                    width: 64px;
                    height: 64px;
                    min-width: 64px;
                    border-radius: 16px;
                    background: #eaf3ff;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 31px;
                }

                .issues-header h1 {
                    margin: 0 0 5px;
                    font-size: 32px;
                    font-weight: 750;
                    color: #0b2942;
                }

                .issues-header p {
                    margin: 0;
                    color: #60758a;
                    font-size: 15px;
                }

                /* ================= SUMMARY ================= */

                .summary-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 18px;
                    margin-bottom: 42px;
                }

                .summary-card {
                    background: #ffffff;
                    border: 1px solid #e1e8f0;
                    border-radius: 16px;
                    min-height: 100px;
                    padding: 20px;
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    box-shadow: 0 4px 15px rgba(31, 60, 90, 0.045);
                    transition: transform 0.2s ease,
                                box-shadow 0.2s ease;
                }

                .summary-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 22px rgba(31, 60, 90, 0.08);
                }

                .summary-icon {
                    width: 48px;
                    height: 48px;
                    min-width: 48px;
                    border-radius: 13px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 22px;
                }

                .summary-icon.blue {
                    background: #eaf3ff;
                }

                .summary-icon.yellow {
                    background: #fff5d9;
                }

                .summary-icon.purple {
                    background: #edf0ff;
                }

                .summary-icon.green {
                    background: #e4f7ee;
                }

                .summary-number {
                    font-size: 24px;
                    font-weight: 750;
                    color: #102a43;
                    line-height: 1;
                    margin-bottom: 6px;
                }

                .summary-label {
                    color: #71849a;
                    font-size: 13px;
                }

                /* ================= SECTION ================= */

                .issues-section-header {
                    display: flex;
                    align-items: flex-end;
                    justify-content: space-between;
                    margin-bottom: 18px;
                }

                .section-title {
                    margin: 0;
                    font-size: 24px;
                    color: #0b2942;
                    font-weight: 750;
                }

                .section-subtitle {
                    margin: 5px 0 0;
                    color: #71849a;
                    font-size: 14px;
                }

                .issue-count {
                    background: #eaf3ff;
                    color: #1769d1;
                    border-radius: 20px;
                    padding: 7px 15px;
                    font-size: 13px;
                    font-weight: 700;
                }

                /* ================= ISSUE CARD ================= */

                .issues-list {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }

                .issue-card {
                    background: #ffffff;
                    border: 1px solid #dfe7ef;
                    border-radius: 17px;
                    padding: 23px 26px;
                    box-shadow: 0 4px 15px rgba(31, 60, 90, 0.045);
                    transition: all 0.2s ease;
                }

                .issue-card:hover {
                    border-color: #c9d8e8;
                    box-shadow: 0 8px 24px rgba(31, 60, 90, 0.09);
                    transform: translateY(-2px);
                }

                .issue-top {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    gap: 20px;
                }

                .issue-main {
                    flex: 1;
                    min-width: 0;
                }

                .issue-tags {
                    display: flex;
                    align-items: center;
                    gap: 9px;
                    margin-bottom: 10px;
                    flex-wrap: wrap;
                }

                .category-badge {
                    display: inline-flex;
                    align-items: center;
                    padding: 5px 10px;
                    border-radius: 7px;
                    background: #edf4ff;
                    color: #1769d1;
                    font-size: 11px;
                    font-weight: 800;
                    letter-spacing: 0.3px;
                    text-transform: uppercase;
                }

                .status-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    padding: 5px 10px;
                    border-radius: 20px;
                    font-size: 11px;
                    font-weight: 750;
                    text-transform: uppercase;
                }

                .status-badge.reported {
                    background: #f1f3f5;
                    color: #536579;
                }

                .status-badge.in-progress {
                    background: #fff4d6;
                    color: #b77900;
                }

                .status-badge.resolved {
                    background: #e5f7ee;
                    color: #138a59;
                }

                .status-dot {
                    font-size: 9px;
                }

                .issue-title {
                    margin: 0;
                    font-size: 20px;
                    line-height: 1.35;
                    color: #102a43;
                    font-weight: 720;
                }

                .issue-description {
                    margin: 8px 0 0;
                    color: #60758a;
                    font-size: 14px;
                    line-height: 1.5;
                    max-width: 750px;
                }

                /* ================= DETAILS ================= */

                .issue-details {
                    display: flex;
                    align-items: center;
                    gap: 32px;
                    padding-left: 30px;
                    border-left: 1px solid #e7edf3;
                    min-width: 430px;
                }

                .detail-item {
                    min-width: 95px;
                }

                .detail-label {
                    display: block;
                    font-size: 10px;
                    color: #8494a7;
                    font-weight: 700;
                    letter-spacing: 0.5px;
                    text-transform: uppercase;
                    margin-bottom: 6px;
                }

                .detail-value {
                    display: block;
                    font-size: 13px;
                    font-weight: 750;
                    color: #19344d;
                }

                .priority {
                    text-transform: uppercase;
                }

                .priority.high {
                    color: #dc4b4b;
                }

                .priority.medium {
                    color: #d58200;
                }

                .priority.low {
                    color: #21895f;
                }

                .complaint-id {
                    font-family: monospace;
                    font-size: 12px;
                    color: #52677d;
                }

                /* ================= EMPTY / LOADING ================= */

                .message-box {
                    background: #ffffff;
                    border: 1px solid #e1e8f0;
                    border-radius: 17px;
                    padding: 55px 20px;
                    text-align: center;
                    color: #71849a;
                }

                .message-icon {
                    font-size: 42px;
                    margin-bottom: 12px;
                }

                .message-box h3 {
                    margin: 0 0 7px;
                    color: #19344d;
                    font-size: 19px;
                }

                .message-box p {
                    margin: 0;
                    font-size: 14px;
                }

                /* ================= RESPONSIVE ================= */

                @media (max-width: 1100px) {
                    .summary-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }

                    .issue-top {
                        flex-direction: column;
                    }

                    .issue-details {
                        width: 100%;
                        border-left: none;
                        border-top: 1px solid #e7edf3;
                        padding-left: 0;
                        padding-top: 17px;
                        min-width: 0;
                    }
                }

                @media (max-width: 700px) {
                    .my-issues-page {
                        padding: 25px 16px 50px;
                    }

                    .issues-header {
                        padding: 23px;
                    }

                    .header-icon {
                        width: 52px;
                        height: 52px;
                        min-width: 52px;
                        font-size: 25px;
                    }

                    .issues-header h1 {
                        font-size: 25px;
                    }

                    .summary-grid {
                        grid-template-columns: 1fr;
                    }

                    .issues-section-header {
                        align-items: flex-start;
                        gap: 12px;
                    }

                    .issue-card {
                        padding: 19px;
                    }

                    .issue-details {
                        display: grid;
                        grid-template-columns: repeat(2, 1fr);
                        gap: 16px;
                    }

                    .detail-item {
                        min-width: 0;
                    }
                }
            `}</style>

            <div className="my-issues-page">
                <div className="my-issues-container">

                    {/* HEADER */}
                    <div className="issues-header">
                        <div className="header-icon">
                            📋
                        </div>

                        <div>
                            <h1>My Complaints</h1>
                            <p>
                                Track the civic issues you have reported
                                and monitor their progress.
                            </p>
                        </div>
                    </div>

                    {/* SUMMARY */}
                    <div className="summary-grid">

                        <div className="summary-card">
                            <div className="summary-icon blue">
                                📋
                            </div>

                            <div>
                                <div className="summary-number">
                                    {totalIssues}
                                </div>
                                <div className="summary-label">
                                    Total Complaints
                                </div>
                            </div>
                        </div>

                        <div className="summary-card">
                            <div className="summary-icon yellow">
                                ⏳
                            </div>

                            <div>
                                <div className="summary-number">
                                    {pendingIssues}
                                </div>
                                <div className="summary-label">
                                    Pending
                                </div>
                            </div>
                        </div>

                        <div className="summary-card">
                            <div className="summary-icon purple">
                                🔄
                            </div>

                            <div>
                                <div className="summary-number">
                                    {inProgressIssues}
                                </div>
                                <div className="summary-label">
                                    In Progress
                                </div>
                            </div>
                        </div>

                        <div className="summary-card">
                            <div className="summary-icon green">
                                ✓
                            </div>

                            <div>
                                <div className="summary-number">
                                    {resolvedIssues}
                                </div>
                                <div className="summary-label">
                                    Resolved
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* SECTION HEADER */}
                    <div className="issues-section-header">
                        <div>
                            <h2 className="section-title">
                                Your Reported Issues
                            </h2>

                            <p className="section-subtitle">
                                View the latest updates on your complaints.
                            </p>
                        </div>

                        <div className="issue-count">
                            {totalIssues} {totalIssues === 1 ? "Issue" : "Issues"}
                        </div>
                    </div>

                    {/* ISSUES */}
                    {loading ? (
                        <div className="message-box">
                            <div className="message-icon">⏳</div>
                            <h3>Loading your complaints...</h3>
                            <p>Please wait while we fetch your reported issues.</p>
                        </div>
                    ) : issues.length === 0 ? (
                        <div className="message-box">
                            <div className="message-icon">📭</div>
                            <h3>No complaints yet</h3>
                            <p>
                                You haven't reported any civic issues yet.
                            </p>
                        </div>
                    ) : (
                        <div className="issues-list">

                            {issues.map((issue) => {
                                const status = getStatus(issue.status);
                                const priority = getPriority(issue.priority);

                                return (
                                    <div
                                        className="issue-card"
                                        key={issue._id}
                                    >

                                        <div className="issue-top">

                                            {/* LEFT SIDE */}
                                            <div className="issue-main">

                                                <div className="issue-tags">

                                                    <span className="category-badge">
                                                        {issue.category || "General"}
                                                    </span>

                                                    <span
                                                        className={`status-badge ${status.className}`}
                                                    >
                                                        <span className="status-dot">
                                                            {status.icon}
                                                        </span>

                                                        {status.label}
                                                    </span>

                                                </div>

                                                <h3 className="issue-title">
                                                    {issue.title || "Untitled Issue"}
                                                </h3>

                                                {issue.description && (
                                                    <p className="issue-description">
                                                        {issue.description}
                                                    </p>
                                                )}

                                            </div>

                                            {/* RIGHT SIDE */}
                                            <div className="issue-details">

                                                <div className="detail-item">
                                                    <span className="detail-label">
                                                        Priority
                                                    </span>

                                                    <span
                                                        className={`detail-value priority ${priority}`}
                                                    >
                                                        {issue.priority || "Medium"}
                                                    </span>
                                                </div>

                                                <div className="detail-item">
                                                    <span className="detail-label">
                                                        Status
                                                    </span>

                                                    <span className="detail-value">
                                                        {status.label}
                                                    </span>
                                                </div>

                                                <div className="detail-item">
                                                    <span className="detail-label">
                                                        Complaint ID
                                                    </span>

                                                    <span className="detail-value complaint-id">
                                                        #{issue._id
                                                            ? issue._id.slice(-6)
                                                            : "------"}
                                                    </span>
                                                </div>

                                            </div>

                                        </div>

                                    </div>
                                );
                            })}

                        </div>
                    )}

                </div>
            </div>
        </>
    );
}

export default MyIssues;