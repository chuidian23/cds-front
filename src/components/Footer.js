import React from "react";
import { FaFacebook, FaTiktok, FaYoutube } from "react-icons/fa"; // Changed from FaInstagram to FaTiktok
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer bg-black text-white py-5">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-6 text-center text-md-start mb-4 mb-md-0">
            <div className="footer-content">
              <h5 className="footer-heading text-warning mb-3">
                Car-vinne Driving School
              </h5>
              <p className="mb-1">
                © {new Date().getFullYear()} All rights reserved.
              </p>
              <p className="mb-1">
                <span className="text-warning">Email:</span>{" "}
                carvinnedrivingschool@gmail.com
              </p>
              <p className="mb-0">
                <span className="text-warning">Contact:</span> 0967 298 8130 (G)
                | 0949 724 2329 (S)
              </p>
            </div>
          </div>

          <div className="col-md-6 text-center text-md-end">
            <div className="social-icons">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
              >
                <FaFacebook size={24} />
              </a>
              {/* Changed Instagram to TikTok */}
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
              >
                <FaTiktok size={24} />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
              >
                <FaYoutube size={24} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
