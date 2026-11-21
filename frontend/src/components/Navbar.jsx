import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { logoutUser } from "../services/authService";
import {
  getNotifications,
  markNotificationAsRead,
} from "../services/notificationService";
import { Bell } from "lucide-react";


function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("token");

  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      if (!token) {
        return;
      }

      const data = await getNotifications();

      setNotifications(data.notifications || []);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  // Fetch notifications when navbar loads
  useEffect(() => {
    if (!token) {
      setNotifications([]);
      return;
    }

    fetchNotifications();

    // Check for new notifications every 30 seconds
    const interval = setInterval(() => {
      fetchNotifications();
    }, 30000);

    return () => {
      clearInterval(interval);
    };
  }, [token]);

  // Count unread notifications
  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  // Mark notification as read
  const handleNotificationClick = async (notification) => {
    try {
      if (!notification.isRead) {
        await markNotificationAsRead(notification._id);

        setNotifications((previousNotifications) =>
          previousNotifications.map((item) =>
            item._id === notification._id
              ? { ...item, isRead: true }
              : item
          )
        );
      }
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  // Logout
  const handleLogout = () => {
    logoutUser();
    setNotifications([]);
    setShowNotifications(false);
    navigate("/");
  };

  // Hide normal navbar on landing page
  if (location.pathname === "/") {
    return null;
  }

  return (
    <>
      <nav className="navbar">
        {/* Logo */}
        <Link to="/" className="brand">
          <div className="brand-icon">R</div>

          <div>
            <h2>ResolveX</h2>
            <span>Report • Track • Resolve</span>
          </div>
        </Link>

        {/* Navigation Links */}
        <div className="nav-links">
          <Link to="/">Home</Link>

          <Link to="/about">About us</Link>

          <Link to="/how-it-works">How it Works</Link>

          <Link to="/contact">Contact</Link>

          {token ? (
            <>
              <Link to="/dashboard">Dashboard</Link>

              {/* Notification Bell */}
              <div className="notification-container">
                <button
                  type="button"
                  className="notification-button"
                  onClick={() =>
                    setShowNotifications((previous) => !previous)
                  }
                  aria-label="Notifications"
                >
                  <Bell size={20}/>

                  {unreadCount > 0 && (
                    <span className="notification-badge">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>

                {/* Notification Dropdown */}
                {showNotifications && (
                  <div className="notification-dropdown">
                    <div className="notification-header">
                      <h3>Notifications</h3>

                      {unreadCount > 0 && (
                        <span>
                          {unreadCount} unread
                        </span>
                      )}
                    </div>

                    {notifications.length === 0 ? (
                      <div className="no-notifications">
                        <div className="empty-bell">🔔</div>
                        <p>No notifications yet</p>
                      </div>
                    ) : (
                      <div className="notification-list">
                        {notifications.map((notification) => (
                          <div
                            key={notification._id}
                            className={`notification-item ${
                              !notification.isRead ? "unread" : ""
                            }`}
                            onClick={() =>
                              handleNotificationClick(notification)
                            }
                          >
                            <div className="notification-dot">
                              {!notification.isRead && <span />}
                            </div>

                            <div className="notification-content">
                              <p>{notification.message}</p>

                              <small>
                                {notification.createdAt
                                  ? new Date(
                                      notification.createdAt
                                    ).toLocaleString()
                                  : ""}
                              </small>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Logout */}
              <button
                type="button"
                className="nav-logout"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="login-link">
              Login
            </Link>
          )}
        </div>
      </nav>

      {/* Notification Styles */}
      <style>{`
        .notification-container {
          position: relative;
          display: flex;
          align-items: center;
        }

        .notification-button {
          position: relative;
          border: none;
          background: transparent;
          cursor: pointer;
          font-size: 21px;
          padding: 7px 9px;
          border-radius: 50%;
          transition: background 0.2s ease;
        }

        .notification-button:hover {
          background: rgba(0, 0, 0, 0.06);
        }

        .notification-badge {
          position: absolute;
          top: -2px;
          right: -2px;
          min-width: 18px;
          height: 18px;
          padding: 0 4px;
          border-radius: 10px;
          background: #ef4444;
          color: white;
          font-size: 10px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid white;
        }

        .notification-dropdown {
          position: absolute;
          top: 45px;
          right: 0;
          width: 360px;
          max-height: 450px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
          border: 1px solid #e5e7eb;
          overflow: hidden;
          z-index: 1000;
        }

        .notification-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          border-bottom: 1px solid #e5e7eb;
        }

        .notification-header h3 {
          margin: 0;
          font-size: 17px;
          color: #111827;
        }

        .notification-header span {
          font-size: 12px;
          color: #2563eb;
          font-weight: 600;
        }

        .notification-list {
          max-height: 380px;
          overflow-y: auto;
        }

        .notification-item {
          display: flex;
          gap: 10px;
          padding: 14px 16px;
          border-bottom: 1px solid #f1f5f9;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .notification-item:hover {
          background: #f8fafc;
        }

        .notification-item.unread {
          background: #eff6ff;
        }

        .notification-dot {
          width: 12px;
          padding-top: 5px;
          flex-shrink: 0;
        }

        .notification-dot span {
          display: block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #2563eb;
        }

        .notification-content {
          flex: 1;
        }

        .notification-content p {
          margin: 0 0 5px;
          font-size: 14px;
          line-height: 1.4;
          color: #1f2937;
        }

        .notification-content small {
          color: #6b7280;
          font-size: 11px;
        }

        .no-notifications {
          padding: 35px 20px;
          text-align: center;
          color: #6b7280;
        }

        .empty-bell {
          font-size: 30px;
          margin-bottom: 8px;
        }

        .no-notifications p {
          margin: 0;
          font-size: 14px;
        }

        @media (max-width: 600px) {
          .notification-dropdown {
            position: fixed;
            top: 70px;
            right: 10px;
            left: 10px;
            width: auto;
          }
        }
      `}</style>
    </>
  );
}

export default Navbar;