import React, { useState, useEffect, useMemo } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useLocation } from "react-router-dom";
import {
  FaUser,
  FaPhone,
  FaEnvelope,
  FaCalendarAlt,
  FaMoneyBillWave,
} from "react-icons/fa";
import axios from "axios";
import "./EnrollmentForm.css";

function EnrollmentForm() {
  const location = useLocation();
  const [selectedCourse, setSelectedCourse] = useState("");
  const [scheduleInputs, setScheduleInputs] = useState([]);
  const isSunday = (date) => {
    return date.getDay() === 0;
  };
  const [currentStep, setCurrentStep] = useState(1);
  const [receiptFile, setReceiptFile] = useState(null);
  const [studentPermitFile, setStudentPermitFile] = useState(null);

  // Memoized course schedule configuration
  const courseScheduleConfig = useMemo(
    () => ({
      "TDC (Face to Face)": {
        type: "fixed-days",
        inputs: Array(2).fill(), // 2 sessions
        message: "Fixed Schedule: Saturday (8am-5pm) and Monday (8am-5pm)",
        days: [6, 1], // Saturday (6), Monday (1)
        time: "8:00-17:00",
        price: "₱1,000",
      },
      "OTDC (Self-Paced)": {
        type: "self-paced",
        inputs: Array(1).fill(), // 1 session for start date
        message: "Self-paced course to be completed within 30 days",
        time: "8:00-17:00",
        price: "₱1,500",
      },
      "Motorcycle Refresher": {
        type: "whole-day",
        inputs: Array(1).fill(),
        message: "Full day training (8am-5pm)",
        time: "8:00-17:00",
        price: "₱2,500",
      },
      "Motorcycle Beginner": {
        type: "whole-day",
        inputs: Array(2).fill(),
        message: "Two full day sessions (8am-5pm)",
        time: "8:00-17:00", // Add fixed time
        price: "₱4,000",
      },
      "MT-Refresher": {
        type: "half-day",
        inputs: Array(2)
          .fill()
          .map(() => ({ timeOptions: ["8:00-12:00", "13:00-17:00"] })),
        message: "Select your preferred time slot for each session",
        price: "₱4,000",
      },
      "MT-Intermediate": {
        type: "half-day",
        inputs: Array(3)
          .fill()
          .map(() => ({ timeOptions: ["8:00-12:00", "13:00-17:00"] })),
        message: "Select your preferred time slot for each session",
        price: "₱6,000",
      },
      "MT-Beginner": {
        type: "half-day",
        inputs: Array(5)
          .fill()
          .map(() => ({ timeOptions: ["8:00-12:00", "13:00-17:00"] })),
        message: "Select your preferred time slot for each session",
        price: "₱10,000",
      },
      "AT-Refresher": {
        type: "half-day",
        inputs: Array(2)
          .fill()
          .map(() => ({ timeOptions: ["8:00-12:00", "13:00-17:00"] })),
        message: "Select your preferred time slot for each session",
        price: "₱5,000",
      },
      "AT-Intermediate": {
        type: "half-day",
        inputs: Array(3)
          .fill()
          .map(() => ({ timeOptions: ["8:00-12:00", "13:00-17:00"] })),
        message: "Select your preferred time slot for each session",
        price: "₱7,000",
      },
      "AT-Beginner": {
        type: "half-day",
        inputs: Array(5)
          .fill()
          .map(() => ({ timeOptions: ["8:00-12:00", "13:00-17:00"] })),
        message: "Select your preferred time slot for each session",
        price: "₱12,000",
      },
    }),
    []
  );

  useEffect(() => {
    if (location.state?.selectedCourse) {
      setSelectedCourse(location.state.selectedCourse);
    }
  }, [location]);

  const [formData, setFormData] = useState({
    lastName: "",
    firstName: "",
    middleName: "",
    birthdate: "",
    gender: "",
    civilStatus: "",
    mobilePhone: "",
    email: "",
    course: selectedCourse,
    schedule: [],
    paymentMethod: "gcash",
  });

  useEffect(() => {
    const config = courseScheduleConfig[selectedCourse] || {};
    setScheduleInputs(config.inputs || []);

    const getNextDay = (dayOfWeek) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      let daysToAdd = (dayOfWeek - today.getDay() + 7) % 7;
      daysToAdd = daysToAdd === 0 ? 7 : daysToAdd;
      const nextDay = new Date(today);
      nextDay.setDate(today.getDate() + daysToAdd);
      return nextDay;
    };

    setFormData((prev) => ({
      ...prev,
      course: selectedCourse,
      schedule:
        config.type === "fixed-days"
          ? config.days.map((day) => ({
              date: getNextDay(day),
              time: config.time, // Fixed time
            }))
          : config.type === "self-paced"
          ? [
              {
                type: "self-paced",
                start_date: new Date(),
                end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                time: config.time, // Fixed time
              },
            ]
          : // Add this block for whole-day (motorcycle) courses
          config.type === "whole-day"
          ? Array(config.inputs?.length || 0).fill({
              date: null,
              time: config.time, // Fixed motorcycle time
            })
          : Array(config.inputs?.length || 0).fill({ date: null, time: "" }),
    }));
  }, [selectedCourse, courseScheduleConfig]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleScheduleChange = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      schedule: prev.schedule.map((session, i) =>
        i === index ? { ...session, [field]: value } : session
      ),
    }));
  };

  const calculateAge = (birthdate) => {
    const today = new Date();
    const birthDate = new Date(birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    // Adjust age if birthday hasn't occurred yet this year
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Step 1 validation
    if (currentStep === 1) {
      // Special handling for OTDC
      if (selectedCourse === "OTDC (Self-Paced)") {
        const isValid = formData.schedule[0]?.start_date instanceof Date;
        if (!isValid) {
          alert("Please select a start date for your self-paced course");
          return;
        }
      }
      // Validation for other courses
      else {
        const invalidSessions = formData.schedule.filter((session) => {
          if (selectedCourse.startsWith("Motorcycle")) {
            return !session.date;
          }
          return !session.date || !session.time;
        });

        if (invalidSessions.length > 0) {
          alert("Please fill in all required schedule fields");
          return;
        }
      }

      // Age validation
      if (!formData.birthdate) {
        alert("Please enter your birthdate");
        return;
      }

      const age = calculateAge(formData.birthdate);
      const minAge = ["TDC (Face to Face)", "OTDC (Self-Paced)"].includes(
        selectedCourse
      )
        ? 16
        : 17;

      if (age < minAge) {
        alert(
          `You must be at least ${minAge} years old to enroll in ${selectedCourse}`
        );
        return;
      }

      // All validations passed, move to next step
      setCurrentStep(2);
      return;
    }

    // Step 2 submission

    if (currentStep === 2) {
      // Add receipt validation
      if (!receiptFile) {
        alert("Please upload payment receipt");
        return;
      }

      try {
        const requiresStudentPermit = ![
          "TDC (Face to Face)",
          "OTDC (Self-Paced)",
        ].includes(selectedCourse);

        if (requiresStudentPermit && !studentPermitFile) {
          alert("Please upload your Student Permit");
          return;
        }
        const formDataToSend = new FormData();
        formDataToSend.append("lastName", formData.lastName);
        formDataToSend.append("firstName", formData.firstName);
        formDataToSend.append("middleName", formData.middleName);
        formDataToSend.append("birthdate", formData.birthdate);
        formDataToSend.append("gender", formData.gender);
        formDataToSend.append("civilStatus", formData.civilStatus);
        formDataToSend.append("mobilePhone", formData.mobilePhone);
        formDataToSend.append("email", formData.email);
        formDataToSend.append("course", formData.course);
        formDataToSend.append("paymentMethod", formData.paymentMethod);
        formDataToSend.append(
          "schedule",
          JSON.stringify(
            formData.schedule.map((session) => ({
              ...session,
              date:
                session.date instanceof Date
                  ? session.date.toISOString()
                  : session.date,
            }))
          )
        );

        // Then handle receipt separately
        if (receiptFile) {
          formDataToSend.append("receipt", receiptFile);
        }
        if (studentPermitFile)
          formDataToSend.append("studentPermit", studentPermitFile);

        const response = await axios.post(
          "https://cds-backend.onrender.com/api/enrollments",
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.data.success) {
          alert(
            "Thank you for enrolling in Car-vinne Driving School! Our staff will contact you to confirm the payment and the schedule."
          );
          // Reset form
          setCurrentStep(1);
          setFormData({
            lastName: "",
            firstName: "",
            middleName: "",
            birthdate: "",
            gender: "",
            civilStatus: "",
            mobilePhone: "",
            email: "",
            course: selectedCourse,
            schedule: [],
            paymentMethod: "gcash",
          });
          setReceiptFile(null);
        }
      } catch (error) {
        console.error("Submission error:", error);
        alert(
          error.response?.data?.error ||
            error.message ||
            "Enrollment failed. Please try again."
        );
      }
    }
  };

  const PaymentInstructions = ({ paymentMethod, selectedCourse }) => {
    // Course price configuration
    const coursePrices = {
      "TDC (Face to Face)": "₱1,000",
      "OTDC (Self-Paced)": "₱1,500",
      "Motorcycle Refresher": "₱2,000",
      "Motorcycle Beginner": "₱2,500",
      "MT-Refresher": "₱4,000",
      "MT-Intermediate": "₱6,000",
      "MT-Beginner": "₱10,000",
      "AT-Refresher": "₱5,000",
      "AT-Intermediate": "₱7,000",
      "AT-Beginner": "₱12,000",
    };

    const formatPaymentMethod = {
      gcash: "Gcash",
      pay_maya: "PayMaya",
      bank_transfer: "Bank Transfer",
    };

    const instructions = {
      gcash: {
        steps: [
          "1. Open GCash App",
          "2. Go to Send Money",
          `3. Send to 0912-345-6789 (Leonard Joseph Chuidian)`,
          "4. Upload screenshot of transaction below",
        ],
      },
      bank_transfer: {
        steps: [
          "1. Bank: BPI",
          "2. Account Name: Driving School",
          "3. Account Number: 1234-5678-9012",
          "4. Upload screenshot of transaction below",
        ],
      },
      pay_maya: {
        steps: [
          "1. Open Maya app",
          "2. Go to Send Money",
          "3. Send to 0912-345-6789 (Leonard Joseph Chuidian)",
          "4. Upload screenshot of transaction below",
        ],
      },
    };

    return (
      <div className="payment-instructions card mb-4">
        <div className="card-body">
          <h5 className="card-title theme-payment-title">
            {formatPaymentMethod[paymentMethod]} Payment Instructions
            <span className="text-muted ms-2">
              ({selectedCourse} - {coursePrices[selectedCourse] || "₱---"})
            </span>
          </h5>
          <ul className="list-unstyled">
            {instructions[paymentMethod]?.steps.map((step, index) => (
              <li key={index} className="mb-2">
                {step}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  return (
    <div className="enrollment-container container py-5">
      <div className="enrollment-header text-center mb-5">
        <h2 className="fw-bold mb-3 theme-heading">
          Driving Course Enrollment
        </h2>
        <p className="lead theme-subheading">
          Start your journey to becoming a confident driver
        </p>
      </div>

      {selectedCourse && (
        <div className="selected-course alert theme-alert mb-4">
          <strong>Selected Course:</strong> {selectedCourse}
          {courseScheduleConfig[selectedCourse]?.message && (
            <div className="mt-2">
              {courseScheduleConfig[selectedCourse].message}
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="enrollment-form row g-4">
        {/* Personal Information Section */}
        <div className="col-12 section-header">
          <h4 className="fw-bold theme-section-heading">
            <FaUser className="me-2 theme-icon" />
            Personal Information
          </h4>
          <hr className="theme-divider" />
        </div>

        {/* Name Fields */}
        <div className="col-md-4 form-group">
          <label className="form-label">Last Name</label>
          <div className="input-group">
            <span className="input-group-text">
              <FaUser />
            </span>
            <input
              type="text"
              className="form-control"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="col-md-4 form-group">
          <label className="form-label">First Name</label>
          <div className="input-group">
            <span className="input-group-text">
              <FaUser />
            </span>
            <input
              type="text"
              className="form-control"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="col-md-4 form-group">
          <label className="form-label">Middle Name</label>
          <div className="input-group">
            <span className="input-group-text">
              <FaUser />
            </span>
            <input
              type="text"
              className="form-control"
              name="middleName"
              value={formData.middleName}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Personal Details */}
        <div className="col-md-3 form-group">
          <label className="form-label">Birthdate</label>
          <div className="input-group">
            <span className="input-group-text">
              <FaCalendarAlt />
            </span>
            <DatePicker
              selected={
                formData.birthdate ? new Date(formData.birthdate) : null
              }
              onChange={(date) => {
                const isoDate = date ? date.toISOString().split("T")[0] : "";
                handleChange({
                  target: { name: "birthdate", value: isoDate },
                });
              }}
              dateFormat="MMMM d, yyyy"
              placeholderText="Select birthdate"
              className="form-control"
              maxDate={new Date()}
              showYearDropdown
              dropdownMode="select"
              peekNextMonth
              showMonthDropdown
              required
            />
          </div>
        </div>

        <div className="col-md-3 form-group">
          <label className="form-label">Gender</label>
          <select
            className="form-select"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="">Select...</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
            <option value="prefer-not">Prefer not to say</option>
          </select>
        </div>

        <div className="col-md-3 form-group">
          <label className="form-label">Civil Status</label>
          <select
            className="form-select"
            name="civilStatus"
            value={formData.civilStatus}
            onChange={handleChange}
            required
          >
            <option value="">Select...</option>
            <option value="single">Single</option>
            <option value="married">Married</option>
            <option value="divorced">Divorced</option>
            <option value="widowed">Widowed</option>
          </select>
        </div>

        {/* Contact Information Section */}
        <div className="col-12 section-header">
          <h4 className="fw-bold theme-section-heading">
            <FaPhone className="me-2 theme-icon" />
            Contact Information
          </h4>
          <hr className="theme-divider" />
        </div>

        <div className="col-md-3 form-group">
          <label className="form-label">Mobile Phone</label>
          <div className="input-group">
            <span className="input-group-text">
              <FaPhone />
            </span>
            <input
              type="tel"
              className="form-control"
              name="mobilePhone"
              value={formData.mobilePhone}
              onChange={handleChange}
              pattern="[0-9]{11}"
              placeholder="09123456789"
              required
            />
          </div>
        </div>

        <div className="col-md-4 form-group">
          <label className="form-label">Email Address</label>
          <div className="input-group">
            <span className="input-group-text">
              <FaEnvelope />
            </span>
            <input
              type="email"
              className="form-control"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@domain.com"
              required
            />
          </div>
        </div>

        {/* Schedule & Payment Section */}
        <div className="col-12 section-header">
          <h4 className="fw-bold theme-section-heading">
            <FaMoneyBillWave className="me-2 theme-icon" />
            Schedule & Payment
          </h4>
          <hr className="theme-divider" />
        </div>

        {scheduleInputs.map((scheduleInput, index) => (
          <div key={index} className="col-md-6 col-lg-4">
            <div className="form-group">
              <label className="form-label">
                {selectedCourse.startsWith("Motorcycle")
                  ? `Day ${index + 1}`
                  : `Session ${index + 1}`}
              </label>
              <div className="row g-2">
                <div className="col-12">
                  <DatePicker
                    selected={
                      selectedCourse === "OTDC (Self-Paced)"
                        ? formData.schedule[index]?.start_date
                        : formData.schedule[index]?.date
                    }
                    onChange={(date) => {
                      if (selectedCourse === "OTDC (Self-Paced)") {
                        const endDate = new Date(date);
                        endDate.setDate(endDate.getDate() + 30);
                        handleScheduleChange(index, "start_date", date);
                        handleScheduleChange(index, "end_date", endDate);
                      } else {
                        handleScheduleChange(index, "date", date);
                      }
                    }}
                    filterDate={(date) => {
                      if (selectedCourse === "TDC (Face to Face)") {
                        return (
                          date.getDay() ===
                          courseScheduleConfig[selectedCourse].days[index]
                        );
                      }
                      return !isSunday(date);
                    }}
                    dateFormat="MMMM d, yyyy"
                    placeholderText="Select date"
                    className="form-control"
                    minDate={new Date()}
                    showYearDropdown
                    dropdownMode="select"
                    peekNextMonth
                    showMonthDropdown
                    required
                  />
                </div>

                {/* Fixed time display */}
                {courseScheduleConfig[selectedCourse]?.inputs[index]
                  ?.timeOptions ? (
                  <div className="col-12 mt-2">
                    <select
                      className="form-select"
                      value={formData.schedule[index]?.time || ""}
                      onChange={(e) =>
                        handleScheduleChange(index, "time", e.target.value)
                      }
                      required
                    >
                      <option value="">Select Time</option>
                      {courseScheduleConfig[selectedCourse].inputs[
                        index
                      ].timeOptions.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  /* Fixed time for motorcycle courses */
                  selectedCourse.startsWith("Motorcycle") && (
                    <div className="col-12 mt-2">
                      <div
                        className="form-control"
                        style={{ background: "#e9ecef" }}
                      >
                        Time: {courseScheduleConfig[selectedCourse]?.time}
                      </div>
                      <input
                        type="hidden"
                        name={`time-${index}`}
                        value={courseScheduleConfig[selectedCourse]?.time}
                      />
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        ))}

        <div className="col-md-4 form-group">
          <label className="form-label">Payment Method</label>
          <div className="input-group">
            <span className="input-group-text">
              <FaMoneyBillWave />
            </span>
            <select
              className="form-select"
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              required
            >
              <option value="gcash">GCash</option>
              <option value="pay_maya">Pay Maya</option>
              <option value="bank_transfer">Bank Transfer</option>
            </select>
          </div>
        </div>

        {currentStep === 2 && (
          <div className="payment-step">
            <div className="col-12 section-header">
              <h4 className="fw-bold theme-section-heading">
                <FaMoneyBillWave className="me-2 theme-icon" />
                Payment Details
              </h4>
              <hr className="theme-divider" />
            </div>

            <PaymentInstructions
              paymentMethod={formData.paymentMethod}
              selectedCourse={selectedCourse}
            />

            {/* Student Permit Upload */}
            {!["TDC (Face to Face)", "OTDC (Self-Paced)"].includes(
              selectedCourse
            ) && (
              <div className="col-md-6 form-group">
                <label className="form-label">Upload Student Permit</label>
                <input
                  type="file"
                  className="form-control"
                  accept="image/*,.pdf"
                  onChange={(e) => setStudentPermitFile(e.target.files[0])}
                  required={
                    !["TDC (Face to Face)", "OTDC (Self-Paced)"].includes(
                      selectedCourse
                    )
                  }
                />
                <small className="text-muted">
                  (Accepted formats: JPG, PNG, PDF - max 5MB)
                </small>
              </div>
            )}

            {/* Receipt Upload */}
            <div className="col-md-6 form-group">
              <label className="form-label">Upload Payment Receipt</label>
              <input
                type="file"
                className="form-control"
                accept="image/*,.pdf"
                onChange={(e) => setReceiptFile(e.target.files[0])}
                required
              />
              <small className="text-muted">
                (Accepted formats: JPG, PNG, PDF - max 5MB)
              </small>
            </div>

            <div className="col-12 text-center mt-4">
              <button
                type="button"
                className="btn btn-secondary theme-btn-secondary me-3"
                onClick={() => setCurrentStep(1)}
              >
                Back
              </button>
              <button type="submit" className="btn theme-btn-primary">
                Submit Payment
              </button>
            </div>
          </div>
        )}

        {currentStep === 1 && (
          <div className="col-12 text-center mt-5">
            <button type="submit" className="btn theme-btn-primary btn-lg px-5">
              Next
            </button>
          </div>
        )}
      </form>
    </div>
  );
}

export default EnrollmentForm;
