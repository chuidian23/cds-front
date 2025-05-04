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
        {/* Logo */}
        <Link className="navbar-brand" to="/">
          <img
            src={logo}
            alt="Car-vinne Driving School"
            className="headerLogo"
          />
        </Link>

        {/* Hamburger Menu Button - ADDED HERE */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navigation Items */}
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
                <Link
                  className="navLink"
                  to="/"
                  onClick={(e) => {
                    if (location.pathname === "/") {
                      e.preventDefault();
                      window.scrollTo({
                        top: 0,
                        behavior: "smooth",
                      });
                    }
                  }}
                >
                  Home
                </Link>
                <Link
                  className="navLink"
                  to={{ pathname: "/", hash: "#about" }}
                  onClick={(e) => {
                    if (location.pathname === "/") {
                      e.preventDefault();
                      document.querySelector("#about")?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                    }
                  }}
                >
                  About Us
                </Link>
                <Link
                  className="navLink"
                  to={{ pathname: "/", hash: "#testimonials" }}
                  onClick={(e) => {
                    if (location.pathname === "/") {
                      e.preventDefault();
                      document.querySelector("#testimonials")?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                    }
                  }}
                >
                  Testimonials
                </Link>
                <Link
                  className="navLink"
                  to={{ pathname: "/", hash: "#gallery" }}
                  onClick={(e) => {
                    if (location.pathname === "/") {
                      e.preventDefault();
                      document.querySelector("#gallery")?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                    }
                  }}
                >
                  Gallery
                </Link>
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
