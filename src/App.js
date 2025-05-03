import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./components/HomePage";
import Courses from "./components/Courses";
import EnrollmentForm from "./components/EnrollmentForm";
import Footer from "./components/Footer";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

// ScrollToTop component moved inside App.js
const ScrollToTop = () => {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// ProtectedRoute component
const ProtectedRoute = ({ children }) => {
  const token = sessionStorage.getItem("adminToken");
  return token ? children : <Navigate to="/admin/login" replace />;
};

function App() {
  return (
    <div className="app-container">
      <Router>
        <ScrollToTop />
        <Header />
        <div className="navbar-spacer"></div>

        <main className="main-content">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/enroll" element={<EnrollmentForm />} />

            {/* Admin Routes */}
            <Route
              path="/admin/login"
              element={
                <div className="admin-route-container">
                  <AdminLogin />
                </div>
              }
            />
            <Route
              path="/admin/dashboard"
              element={
                <div className="admin-route-container">
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                </div>
              }
            />

            {/* Catch-all route */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>

        <Footer />
      </Router>
    </div>
  );
}

export default App;
