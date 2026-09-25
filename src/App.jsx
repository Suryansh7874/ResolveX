import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Register from "./pages/Register";
import Login from "./pages/Login";

import Dashboard from "./pages/Dashboard";
import ChallengeDetails from "./pages/ChallengeDetails";
import HEIDashboard from "./pages/HEIDashboard";

import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

import LandingPage from "./pages/LandingPage";

import AdminDashboard from "./pages/AdminDashboard";
import AdminIssues from "./pages/AdminIssues";

import OfficerDashboard from "./pages/OfficerDashboard";
import Officers from "./pages/Officers";

import ReportIssue from "./pages/ReportIssue";
import MyIssues from "./pages/MyIssues";

function App() {
  return (
    <BrowserRouter>

      <Navbar />

      <Routes>

        {/* ================= LANDING PAGE ================= */}

        <Route
          path="/"
          element={<LandingPage />}
        />

        {/* ================= PUBLIC ROUTES ================= */}

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/reset-password"
          element={<ResetPassword />}
        />

        {/* ================= CITIZEN DASHBOARD ================= */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* ================= REPORT ISSUE ================= */}

        <Route
          path="/report-issue"
          element={
            <ProtectedRoute>
              <ReportIssue />
            </ProtectedRoute>
          }
        />

        {/* ================= MY ISSUES ================= */}

        <Route
          path="/issues"
          element={
            <ProtectedRoute>
              <MyIssues />
            </ProtectedRoute>
          }
        />

        {/* ================= ADMIN DASHBOARD ================= */}

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* ================= ADMIN ISSUES ================= */}

        <Route
          path="/admin/issues"
          element={
            <ProtectedRoute>
              <AdminIssues />
            </ProtectedRoute>
          }
        />

        {/* ================= ADMIN OFFICERS ================= */}

        <Route
          path="/admin/officers"
          element={
            <ProtectedRoute>
              <Officers />
            </ProtectedRoute>
          }
        />

        {/* ================= OFFICER DASHBOARD ================= */}

        <Route
          path="/officer"
          element={
            <ProtectedRoute>
              <OfficerDashboard />
            </ProtectedRoute>
          }
        />

        {/* ================= HEI ADMIN DASHBOARD ================= */}

        <Route
          path="/hei"
          element={
            <ProtectedRoute>
              <HEIDashboard />
            </ProtectedRoute>
          }
        />

        {/* =====================================================
            CHALLENGE DETAILS
            Used by Admin Dashboard when a challenge is clicked
        ===================================================== */}

        <Route
          path="/challenges/:id"
          element={
            <ProtectedRoute>
              <ChallengeDetails />
            </ProtectedRoute>
          }
        />

        {/* =====================================================
            OPTIONAL ADMIN CHALLENGE DETAILS ALIAS

            This lets us later use:
            /admin/challenges/:id

            without creating another component.
        ===================================================== */}

        <Route
          path="/admin/challenges/:id"
          element={
            <ProtectedRoute>
              <ChallengeDetails />
            </ProtectedRoute>
          }
        />

        {/* ================= UNKNOWN ROUTES ================= */}

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;