

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

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

        {/* PUBLIC ROUTES */}

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/login"
          element={<Login />}
        />


        {/* CITIZEN DASHBOARD */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />


        {/* REPORT ISSUE */}

        <Route
          path="/report-issue"
          element={
            <ProtectedRoute>
              <ReportIssue />
            </ProtectedRoute>
          }
        />

{/* MY ISSUES */}

<Route
  path="/issues"
  element={
    <ProtectedRoute>
      <MyIssues />
    </ProtectedRoute>
  }
/>

        {/* ADMIN DASHBOARD */}

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />


        {/* ADMIN ISSUES */}

        <Route
          path="/admin/issues"
          element={
            <ProtectedRoute>
              <AdminIssues />
            </ProtectedRoute>
          }
        />


        {/* ADMIN OFFICERS */}

        <Route
          path="/admin/officers"
          element={
            <ProtectedRoute>
              <Officers />
            </ProtectedRoute>
          }
        />


        {/* OFFICER DASHBOARD */}

        <Route
          path="/officer"
          element={
            <ProtectedRoute>
              <OfficerDashboard />
            </ProtectedRoute>
          }
        />


        {/* DEFAULT */}

        <Route
          path="/"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />


        {/* UNKNOWN ROUTES */}

        <Route
          path="*"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;
