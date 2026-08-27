import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCurrentUser } from "../services/authService";
import {
  Bell,
  ChevronRight,
  Clock3,
  CheckCircle2,
  AlertCircle,
  FileText,
  MapPin,
  Plus,
  ArrowUpRight,
  TrendingUp,
} from "lucide-react";

function Dashboard() {

const navigate = useNavigate();

const [user, setUser] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const verifyUser = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/me",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setUser(data.user);

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
if (loading) {
  return <div>Loading...</div>;
}

  const issues = [
    {
      id: "RX-1024",
      title: "Pothole on Main Road",
      category: "Roads",
      location: "MG Road, Sector 4",
      date: "Today",
      status: "In Progress",
      statusClass: "progress",
      icon: AlertCircle,
    },
    {
      id: "RX-1021",
      title: "Street Light Not Working",
      category: "Electricity",
      location: "Green Park",
      date: "2 days ago",
      status: "Resolved",
      statusClass: "resolved",
      icon: CheckCircle2,
    },
    {
      id: "RX-1018",
      title: "Garbage Collection Issue",
      category: "Sanitation",
      location: "Civil Lines",
      date: "5 days ago",
      status: "Submitted",
      statusClass: "submitted",
      icon: Clock3,
    },
  ];

  return (
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
              V
            </div>

            <div>
             <strong>{user?.name}</strong>
             <span>{user?.role} Account</span>
            </div>
          </div>

        </div>

      </header>


      {/* ================= MAIN CONTENT ================= */}

      <main className="dashboard-content">

        {/* Welcome */}

        <section className="welcome-section">

          <div>
            <p className="welcome-label">
              CITIZEN DASHBOARD
            </p>

            <h1>
              Welcome back, {user?.name}! 👋
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


        {/* ================= STATS ================= */}

        <section className="stats-grid">

          <div className="stat-card">

            <div className="stat-icon blue">
              <FileText size={22} />
            </div>

            <div className="stat-info">
              <span>Total Issues</span>
              <strong>12</strong>
              <small>
                <TrendingUp size={13} />
                3 this month
              </small>
            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon orange">
              <Clock3 size={22} />
            </div>

            <div className="stat-info">
              <span>In Progress</span>
              <strong>4</strong>
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
              <span>Resolved</span>
              <strong>7</strong>
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
              <span>Your Impact</span>
              <strong>86%</strong>
              <small>
                Resolution success rate
              </small>
            </div>

          </div>

        </section>


        {/* ================= LOWER AREA ================= */}

        <section className="dashboard-grid">


          {/* RECENT ISSUES */}

          <div className="issues-panel">

            <div className="panel-header">

              <div>
                <h2>Recent Issues</h2>
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

              {issues.map((issue) => {

                const Icon = issue.icon;

                return (
                  <div
                    className="issue-card"
                    key={issue.id}
                  >

                    <div
                      className={`issue-icon ${issue.statusClass}`}
                    >
                      <Icon size={20} />
                    </div>


                    <div className="issue-info">

                      <div className="issue-title-row">

                        <h3>{issue.title}</h3>

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
                );
              })}

            </div>

          </div>


          {/* RIGHT SIDEBAR */}

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
                  <h2>Notifications</h2>
                </div>

                <Bell size={18} />

              </div>


              <div className="notification-item">

                <div className="notification-icon green">
                  <CheckCircle2 size={15} />
                </div>

                <div>
                  <p>
                    Your street light issue was resolved.
                  </p>

                  <span>
                    2 hours ago
                  </span>
                </div>

              </div>


              <div className="notification-item">

                <div className="notification-icon blue">
                  <Clock3 size={15} />
                </div>

                <div>
                  <p>
                    Your pothole report is being reviewed.
                  </p>

                  <span>
                    Yesterday
                  </span>
                </div>

              </div>


              <div className="notification-item">

                <div className="notification-icon purple">
                  <Bell size={15} />
                </div>

                <div>
                  <p>
                    Welcome to ResolveX!
                  </p>

                  <span>
                    3 days ago
                  </span>
                </div>

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
            V
          </div>
          <span>Profile</span>
        </Link>

      </nav>

    </div>
  );
}

export default Dashboard;