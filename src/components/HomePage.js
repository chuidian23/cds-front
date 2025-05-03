import { useState, React, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./HomePage.css";
import { Container, Row, Col, Modal } from "react-bootstrap";
import {
  FaFacebook,
  FaTiktok,
  FaYoutube,
  FaQuoteLeft,
  FaUser,
  FaCalendarAlt,
  FaMoneyBillWave,
} from "react-icons/fa";
import aboutImage from "../assets/images/about-image.png";
import heroImage from "../assets/images/hero-image.png";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import testimonial1 from "../assets/images/testimonial1.jpg";
import testimonial2 from "../assets/images/testimonial2.jpg";
import testimonial3 from "../assets/images/testimonial3.jpg";
import testimonial4 from "../assets/images/testimonial4.jpg";
import testimonial5 from "../assets/images/testimonial5.jpg";
import student1 from "../assets/images/student1.jpg";
import student2 from "../assets/images/student2.jpg";
import student3 from "../assets/images/student3.jpg";
import student4 from "../assets/images/student4.jpg";
import student5 from "../assets/images/student5.jpg";
import student6 from "../assets/images/student6.jpg";

const testimonials = [
  {
    id: 1,
    name: "Maria Santos",
    role: "Student Driver",
    text: "Car-vinne helped me overcome my fear of driving. The instructors are patient and professional!",
    image: testimonial1,
  },
  {
    id: 2,
    name: "John Dela Cruz",
    role: "Working Professional",
    text: "Flexible schedules made it easy to balance work and driving lessons. Highly recommended!",
    image: testimonial2,
  },
  {
    id: 3,
    name: "Sofia Reyes",
    role: "College Student",
    text: "Passed my LTO exam on the first try thanks to their comprehensive training program.",
    image: testimonial3,
  },
  {
    id: 4,
    name: "Sofia Reyes",
    role: "College Student",
    text: "Passed my LTO exam on the first try thanks to their comprehensive training program.",
    image: testimonial4,
  },
  {
    id: 5,
    name: "Sofia Reyes",
    role: "College Student",
    text: "Passed my LTO exam on the first try thanks to their comprehensive training program.",
    image: testimonial5,
  },
];

const HomePage = () => {
  const location = useLocation();

  useEffect(() => {
    const scrollHandler = () => {
      const hash = location.hash;

      if (hash) {
        // Handle section scroll
        setTimeout(() => {
          const element = document.querySelector(hash);
          if (element) {
            element.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }
        }, 100);
      } else {
        // Handle home scroll
        window.scrollTo({
          top: 0,
          behavior: "auto",
        });
      }
    };

    scrollHandler();
  }, [location]);

  const [selectedImage, setSelectedImage] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleImageClick = (img) => {
    setSelectedImage(img);
    setShowModal(true);
  };
  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero-section">
        <Container>
          <Row className="align-items-center g-5">
            <Col md={6} className="position-relative">
              <div className="hero-content">
                <h1 className="hero-title">Start Your Driving Journey</h1>
                <p className="hero-subtitle">
                  Transform from novice to confident driver with our proven
                  training program
                </p>
                <div className="d-flex justify-content-start">
                  <Link
                    to="/courses"
                    className="enroll-button text-decoration-none"
                  >
                    Get Started
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      className="ms-2"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </Col>
            <Col md={6} className="text-center">
              <div className="hero-image-container">
                <img
                  src={heroImage}
                  alt="Happy Student Driving"
                  className="img-fluid"
                />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* About Us Section */}
      <section id="about" className="about-section">
        <Container>
          <Row className="align-items-center g-5">
            <Col md={6} className="text-center">
              <div className="about-image">
                <img
                  src={aboutImage}
                  alt="Car-vinne Team"
                  className="img-fluid"
                />
              </div>
            </Col>
            <Col md={6} className="d-flex align-items-center">
              <div className="about-content w-100">
                <h2 className="section-title">About Us</h2>
                <p className="about-text mb-4">
                  At Car-vinne Driving School, we've been shaping confident
                  drivers since 2008. Our certified instructors combine
                  expertise with patience to create a supportive learning
                  environment.
                </p>
                <div className="key-points">
                  <div className="point-item">
                    <div className="icon-box">
                      <FaUser size={28} />
                    </div>
                    <div className="text-start">
                      <h5>Personalized Training</h5>
                      <p>Tailored lessons for individual needs</p>
                    </div>
                  </div>
                  <div className="point-item">
                    <div className="icon-box">
                      <FaCalendarAlt size={28} />
                    </div>
                    <div className="text-start">
                      <h5>Flexible Scheduling</h5>
                      <p>Available 6 days a week</p>
                    </div>
                  </div>
                  <div className="point-item">
                    <div className="icon-box">
                      <FaMoneyBillWave size={28} />
                    </div>
                    <div className="text-start">
                      <h5>Affordable Packages</h5>
                      <p>Transparent pricing with no hidden fees</p>
                    </div>
                  </div>
                </div>
                <div className="social-links">
                  <a href="https://facebook.com" className="mx-3">
                    <FaFacebook />
                  </a>
                  <a href="https://tiktok.com" className="mx-3">
                    <FaTiktok />
                  </a>
                  <a href="https://youtube.com" className="mx-3">
                    <FaYoutube />
                  </a>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="testimonials-section">
        <Container>
          <h2 className="section-title text-center">Student Testimonials</h2>
          <Swiper
            modules={[Navigation, Pagination]}
            navigation={{
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            }}
            spaceBetween={30}
            slidesPerView={1}
            pagination={{ clickable: true }}
            breakpoints={{
              768: { slidesPerView: 3 },
            }}
          >
            {testimonials.map((testimonial) => (
              <SwiperSlide key={testimonial.id}>
                <div className="testimonial-card">
                  <div className="testimonial-image">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="img-fluid"
                    />
                  </div>
                  <FaQuoteLeft className="quote-icon" />
                  <p className="testimonial-text">{testimonial.text}</p>
                  <h5 className="testimonial-name">{testimonial.name}</h5>
                  <p className="testimonial-role">{testimonial.role}</p>
                </div>
              </SwiperSlide>
            ))}
            <div className="swiper-button-prev"></div>
            <div className="swiper-button-next"></div>
          </Swiper>
        </Container>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="gallery-section">
        <Container>
          <h2 className="section-title text-center">Our Students in Action</h2>
          <Row className="g-4">
            {[student1, student2, student3, student4, student5, student6].map(
              (img, index) => (
                <Col md={4} key={index}>
                  <div className="gallery-item">
                    <img
                      src={img}
                      alt={`Student ${index + 1}`}
                      className="gallery-image"
                      onClick={() => handleImageClick(img)}
                      style={{ cursor: "pointer" }}
                    />
                  </div>
                </Col>
              )
            )}
          </Row>
        </Container>
      </section>
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        size="lg"
        className="gallery-modal"
      >
        <Modal.Body className="p-0">
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Enlarged student"
              className="img-fluid w-100"
            />
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default HomePage;
