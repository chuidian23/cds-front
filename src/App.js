import React from "react";
import {
  HashRouter as Router,
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

const ScrollToTop = () => {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const ProtectedRoute = ({ children }) => {
  const token = sessionStorage.getItem("adminToken");
  const location = useLocation();

  if (!token) {
    // Redirect to login BUT preserve the intended location
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }
  return children;
};

function App() {
  return (
    <div className="app-container">
      <Router Router basename="/">
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
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={<Navigate to="/admin/login" replace />}
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Footer />
      </Router>
    </div>
  );
}

export default App;
