import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { Chart, registerables } from "chart.js";
import { Button, Container, Alert, Modal, Card, Image } from "react-bootstrap";
import "./AdminDashboard.css";

Chart.register(...registerables);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "first_name", // Use actual field name from your data
      headerName: "First Name",
      width: 150,
    },
    {
      field: "last_name", // Use actual field name from your data
      headerName: "Last Name",
      width: 150,
    },
    {
      field: "course",
      headerName: "Course",
      width: 200,
    },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      renderCell: (params) => (
        <span
          style={{
            color: params?.value === "successful" ? "green" : "orange",
            fontWeight: "bold",
          }}
        >
          {params?.value || "pending"}
        </span>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      renderCell: (params) => (
        <Button
          variant="info"
          size="sm"
          onClick={() => {
            if (params?.row) {
              setSelectedEnrollment(params.row);
              setShowDetails(true);
            }
          }}
        >
          View
        </Button>
      ),
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = sessionStorage.getItem("adminToken");
        if (!token) {
          navigate("/admin/login");
          return;
        }

        const enrollRes = await fetch(
          "https://cds-backend.onrender.com/api/admin/enrollments",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!enrollRes.ok) throw new Error("Failed to fetch enrollments");

        const data = await enrollRes.json();
        setEnrollments(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate, showDetails]); // Refresh when modal closes

  const handleStatusUpdate = async () => {
    if (!selectedEnrollment?.id) return;

    try {
      const response = await fetch(
        `https://cds-backend.onrender.com/api/admin/enrollments/${selectedEnrollment.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("adminToken")}`,
          },
          body: JSON.stringify({ status: "successful" }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json(); // Get error details
        throw new Error(errorData.error || "Update failed");
      }

      // Update local state
      setEnrollments((prev) =>
        prev.map((item) =>
          item.id === selectedEnrollment.id
            ? { ...item, status: "successful" }
            : item
        )
      );
      setShowDetails(false);
    } catch (err) {
      console.error("Update error:", err);
      setError(err.message);
    }
  };

  // In the handleReject function, modify to:
  const handleReject = async () => {
    if (!selectedEnrollment?.id) return;

    try {
      const response = await fetch(
        `https://cds-backend.onrender.com/api/admin/enrollments/${selectedEnrollment.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("adminToken")}`,
          },
        }
      );

      if (!response.ok) throw new Error("Deletion failed");

      // Remove the enrollment from the list
      setEnrollments((prev) =>
        prev.filter((item) => item.id !== selectedEnrollment.id)
      );

      setShowDetails(false);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  return (
    <Container className="admin-dashboard-container flex-grow-1">
      {error && (
        <Alert variant="danger" onClose={() => setError("")} dismissible>
          {error}
        </Alert>
      )}

      <div className="data-grid-container">
        <h4 className="h5 mb-3">Enrollments</h4>
        <div style={{ height: 400 }}>
          <DataGrid
            rows={enrollments}
            columns={columns}
            pageSize={7}
            rowsPerPageOptions={[7]}
          />
        </div>
      </div>

      {/* Details Modal */}
      <Modal
        show={showDetails}
        onHide={() => setShowDetails(false)}
        size="lg"
        className="enrollment-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Enrollment Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedEnrollment ? (
            <>
              <div className="row">
                <div className="col-md-6">
                  <Card className="mb-3">
                    <Card.Body>
                      <Card.Title>Personal Information</Card.Title>
                      <p>
                        <strong>Name:</strong> {selectedEnrollment.first_name}{" "}
                        {selectedEnrollment.last_name}
                      </p>
                      <p>
                        <strong>Birthdate:</strong>{" "}
                        {selectedEnrollment.birthdate &&
                          new Date(
                            selectedEnrollment.birthdate
                          ).toLocaleDateString()}
                      </p>
                      <p>
                        <strong>Gender:</strong> {selectedEnrollment.gender}
                      </p>
                      <p>
                        <strong>Civil Status:</strong>{" "}
                        {selectedEnrollment.civil_status}
                      </p>
                      <p>
                        <strong>Email:</strong> {selectedEnrollment.email}
                      </p>
                      <p>
                        <strong>Phone:</strong>{" "}
                        {selectedEnrollment.mobile_phone}
                      </p>
                      <p>
                        <strong>Course:</strong> {selectedEnrollment.course}
                      </p>
                      <p>
                        <strong>Status:</strong> {selectedEnrollment.status}
                      </p>
                    </Card.Body>
                  </Card>
                </div>
                <div className="col-md-6">
                  <Card className="mb-3">
                    <Card.Body>
                      <Card.Title>Class Schedule</Card.Title>
                      {selectedEnrollment.schedule?.length > 0 ? (
                        selectedEnrollment.schedule.map((session, index) => (
                          <div key={index} className="mb-3">
                            {/* Add proper null checks for session properties */}
                            {session.type === "self-paced" ? (
                              <>
                                <p className="fw-bold">Self-Paced Training</p>
                                <p>
                                  Start Date:{" "}
                                  {session.start_date
                                    ? new Date(
                                        session.start_date
                                      ).toLocaleDateString()
                                    : "N/A"}
                                </p>
                                <p>
                                  End Date:{" "}
                                  {session.end_date
                                    ? new Date(
                                        session.end_date
                                      ).toLocaleDateString()
                                    : "N/A"}
                                </p>
                              </>
                            ) : (
                              <>
                                <p className="fw-bold">Session {index + 1}</p>
                                <p>
                                  Date:{" "}
                                  {session.date
                                    ? new Date(
                                        session.date
                                      ).toLocaleDateString()
                                    : "N/A"}
                                </p>
                                <p>Time: {session.time || "To be scheduled"}</p>
                              </>
                            )}
                          </div>
                        ))
                      ) : (
                        <p className="text-muted">No schedule available</p>
                      )}
                    </Card.Body>
                  </Card>
                </div>
                <div className="col-md-6">
                  <Card>
                    <Card.Body>
                      <Card.Title>Payment Details</Card.Title>
                      <p>
                        <strong>Payment Method:</strong>{" "}
                        {selectedEnrollment.payment_method}
                      </p>
                      {selectedEnrollment?.receipt ? (
                        <>
                          <Image
                            src={`https://cds-backend.onrender.com/${selectedEnrollment.receipt.replace(
                              /\\/g,
                              "/"
                            )}`}
                            fluid
                            className="mb-3"
                            style={{ maxHeight: "300px", objectFit: "contain" }}
                          />
                          <p className="text-muted small">Payment Receipt</p>
                        </>
                      ) : (
                        <p className="text-danger">Missing payment receipt!</p>
                      )}
                      <div className="action-buttons">
                        <Button variant="success" onClick={handleStatusUpdate}>
                          Accept Payment
                        </Button>
                        <Button variant="danger" onClick={handleReject}>
                          Reject Enrollment
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>

                  {/* Student Permit Section */}
                  <Card className="mt-3">
                    <Card.Body>
                      <Card.Title>Student Permit</Card.Title>
                      {selectedEnrollment?.student_permit ? (
                        <>
                          <Image
                            src={`https://cds-backend.onrender.com/${selectedEnrollment.student_permit.replace(
                              /\\/g,
                              "/"
                            )}`}
                            fluid
                            className="mb-3"
                            style={{ maxHeight: "300px", objectFit: "contain" }}
                          />
                          <p className="text-muted small">Student Permit</p>
                        </>
                      ) : (
                        <p className="text-muted">No student permit required</p>
                      )}
                    </Card.Body>
                  </Card>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-4">
              Loading enrollment details...
            </div>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default AdminDashboard;
