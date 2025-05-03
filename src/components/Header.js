import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/images/cds-logo.png";
import "./Header.css";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  const isAdminPage = ["/admin/dashboard", "/admin/login"].includes(
    location.pathname
  );
  const isCoursePage = ["/courses", "/enroll"].includes(location.pathname);
  const isDashboard = location.pathname === "/admin/dashboard";

  const handleSignOut = () => {
    sessionStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    if (!isAdminPage) {
      window.addEventListener("scroll", handleScroll);
    }
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled, isAdminPage]);

  if (isAdminPage) {
    return (
      <nav className="headerNav navbar navbar-expand-lg">
        <div className="headerContainer container">
          {/* Non-clickable logo for admin pages */}
          <div className="navbar-brand">
            <img
              src={logo}
              alt="Car-vinne Driving School"
              className="headerLogo"
              style={{ cursor: "default" }}
            />
          </div>

          {/* Sign Out button only on Dashboard */}
          {isDashboard && (
            <div className="ms-auto">
              <button
                onClick={handleSignOut}
                className="enrollButton"
                style={{ background: "#ffd700", color: "#000" }}
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </nav>
    );
  }

  return (
    <nav className={`headerNav navbar navbar-expand-lg sticky-top`}>
      <div className="headerContainer container">
        <Link className="navbar-brand" to="/">
          <img
            src={logo}
            alt="Car-vinne Driving School"
            className="headerLogo"
          />
        </Link>

        <div className="collapse navbar-collapse" id="navbarNav">
          <div className="navMenu navbar-nav ms-auto align-items-center">
            {isCoursePage ? (
              // Simplified navigation for course/enrollment pages
              <>
                <Link className="navLink" to="/">
                  Home
                </Link>
                <Link to="/courses" className="enrollButton ms-lg-3">
                  Enroll Now
                </Link>
              </>
            ) : (
              // Full navigation for other pages
              <>
                <Link className="navLink" to="/">
                  Home
                </Link>
                <a className="navLink" href="#about">
                  About Us
                </a>
                <a className="navLink" href="#testimonials">
                  Testimonials
                </a>
                <a className="navLink" href="#gallery">
                  Gallery
                </a>
                <Link to="/courses" className="enrollButton ms-lg-3">
                  Enroll Now
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
