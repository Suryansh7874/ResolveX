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

function App() {
  return (
    <BrowserRouter>

      <Navbar />

      <Routes>

        <Route
          path="/"
          element={<Navigate to="/register" />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route element={<ProtectedRoute />}>
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />
        </Route>

      </Routes>

    </BrowserRouter>
  );
}

export default App;