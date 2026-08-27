import { Link } from "react-router-dom";
import {
  Bell,
  LayoutDashboard,
  ClipboardList,
  Users,
  UserCog,
  MapPin,
  Clock3,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  Plus,
} from "lucide-react";

function AdminDashboard() {
  const recentIssues = [
    {
      id: "RX-1024",
      title: "Pothole on Main Road",
      category: "Roads",
      location: "MG Road, Sector 4",
      status: "In Progress",
      statusClass: "progress",
      officer: "Amit Kumar",
    },
    {
      id: "RX-1021",
      title: "Street Light Not Working",
      category: "Electricity",
      location: "Green Park",
      status: "Submitted",
      statusClass: "submitted",
      officer: "Unassigned",
    },
    {
      id: "RX-1018",
      title: "Garbage Collection Issue",
      category: "Sanitation",
      location: "Civil Lines",
      status: "Resolved",
      statusClass: "resolved",
      officer: "Priya Singh",
    },
  ];

  return (
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
            <LayoutDashboard size={16} />
            Dashboard
          </Link>

          <Link to="/admin/issues">
            <ClipboardList size={16} />
            Issues
          </Link>

          <Link to="/admin/officers">
            <Users size={16} />
            Officers
          </Link>

          <Link to="/admin/citizens">
            <UserCog size={16} />
            Citizens
          </Link>

        </nav>


        <div className="admin-nav-right">

          <button className="admin-notification">
            <Bell size={19} />
            <span></span>
          </button>

          <div className="admin-profile">

            <div className="admin-avatar">
              A
            </div>

            <div>
              <strong>Admin</strong>
              <small>Administrator</small>
            </div>

          </div>

        </div>

      </header>


      {/* ================= MAIN ================= */}

      <main className="admin-content">

        {/* WELCOME */}

        <section className="admin-welcome">

          <div>

            <p className="admin-label">
              ADMINISTRATION
            </p>

            <h1>
              Good morning, Admin 👋
            </h1>

            <p>
              Manage civic issues, officers and
              citizen requests from one place.
            </p>

          </div>

          <Link
            to="/admin/issues"
            className="manage-button"
          >
            <ClipboardList size={18} />
            Manage Issues
          </Link>

        </section>


        {/* ================= STATS ================= */}

        <section className="admin-stats">

          <div className="admin-stat-card">

            <div className="admin-stat-icon blue">
              <ClipboardList size={21} />
            </div>

            <div>
              <span>Total Issues</span>
              <strong>128</strong>
              <small>All reported issues</small>
            </div>

          </div>


          <div className="admin-stat-card">

            <div className="admin-stat-icon orange">
              <Clock3 size={21} />
            </div>

            <div>
              <span>Pending</span>
              <strong>24</strong>
              <small>Awaiting assignment</small>
            </div>

          </div>


          <div className="admin-stat-card">

            <div className="admin-stat-icon cyan">
              <AlertCircle size={21} />
            </div>

            <div>
              <span>In Progress</span>
              <strong>36</strong>
              <small>Currently being handled</small>
            </div>

          </div>


          <div className="admin-stat-card">

            <div className="admin-stat-icon green">
              <CheckCircle2 size={21} />
            </div>

            <div>
              <span>Resolved</span>
              <strong>68</strong>
              <small>Successfully completed</small>
            </div>

          </div>

        </section>


        {/* ================= MAIN GRID ================= */}

        <section className="admin-main-grid">


          {/* RECENT ISSUES */}

          <div className="admin-issues-panel">

            <div className="admin-panel-header">

              <div>
                <h2>Recent Issues</h2>
                <p>
                  Latest civic issues reported by citizens.
                </p>
              </div>

              <Link to="/admin/issues">
                View all
                <ArrowUpRight size={15} />
              </Link>

            </div>


            <div className="admin-issues-list">

              {recentIssues.map((issue) => (

                <div
                  className="admin-issue-card"
                  key={issue.id}
                >

                  <div
                    className={`admin-issue-icon ${issue.statusClass}`}
                  >
                    {issue.statusClass === "resolved" ? (
                      <CheckCircle2 size={19} />
                    ) : issue.statusClass === "progress" ? (
                      <AlertCircle size={19} />
                    ) : (
                      <Clock3 size={19} />
                    )}
                  </div>


                  <div className="admin-issue-info">

                    <div className="admin-issue-title">

                      <h3>
                        {issue.title}
                      </h3>

                      <span
                        className={`admin-status ${issue.statusClass}`}
                      >
                        {issue.status}
                      </span>

                    </div>


                    <div className="admin-issue-meta">

                      <span>
                        {issue.category}
                      </span>

                      <span>
                        <MapPin size={12} />
                        {issue.location}
                      </span>

                    </div>


                    <div className="admin-officer">

                      <span>
                        Assigned Officer:
                      </span>

                      <strong>
                        {issue.officer}
                      </strong>

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

          </div>


          {/* RIGHT SIDE */}

          <aside className="admin-side">


            {/* QUICK ACTIONS */}

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
                  <strong>Manage Issues</strong>
                  <span>Assign and track issues</span>
                </div>

                <ArrowUpRight size={15} />
              </Link>


              <Link to="/admin/officers">
                <div className="quick-action-icon green">
                  <Users size={18} />
                </div>

                <div>
                  <strong>Manage Officers</strong>
                  <span>Promote and manage officers</span>
                </div>

                <ArrowUpRight size={15} />
              </Link>


              <Link to="/admin/citizens">
                <div className="quick-action-icon purple">
                  <UserCog size={18} />
                </div>

                <div>
                  <strong>Manage Citizens</strong>
                  <span>View registered citizens</span>
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
                <span>Issues awaiting assignment</span>
                <strong>24</strong>
              </div>

              <Link to="/admin/issues">
                <ArrowUpRight size={16} />
              </Link>

            </div>

          </aside>

        </section>

      </main>

    </div>
  );
}

export default AdminDashboard;