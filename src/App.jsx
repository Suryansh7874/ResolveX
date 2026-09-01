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
return ( <BrowserRouter> <Navbar />

```
  <Routes>

    {/* Public Routes */}
    <Route
      path="/"
      element={<Navigate to="/register" replace />}
    />

    {/* Authentication */}
    <Route
      path="/register"
      element={<Register />}
    />

    <Route
      path="/login"
      element={<Login />}
    />

    {/* Protected Routes */}
    <Route element={<ProtectedRoute />}>

      {/* Citizen Routes */}
      <Route
        path="/dashboard"
        element={<Dashboard />}
      />

      <Route
        path="/report"
        element={<ReportIssue />}
      />

      <Route
        path="/report-issue"
        element={<ReportIssue />}
      />

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={<AdminDashboard />}
      />

      <Route
        path="/admin/issues"
        element={<AdminIssues />}
      />

      <Route
        path="/admin/officers"
        element={<Officers />}
      />

      {/* Officer Routes */}
      <Route
        path="/officer"
        element={<OfficerDashboard />}
      />
     <Route
       path="/my-issues"
       element={<MyIssues />}
    />

    </Route>

  </Routes>
</BrowserRouter>


);
}

export default App;
