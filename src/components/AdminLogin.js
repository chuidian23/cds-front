import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Alert, Container } from "react-bootstrap";
import "./AdminLogin.css";

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "https://cds-backend.onrender.com/api/admin/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials),
        }
      );

      if (!response.ok) throw new Error("Login failed");

      const { token } = await response.json();
      sessionStorage.setItem("adminToken", token);
      navigate("/admin/dashboard");
    } catch (err) {
      setError("Invalid admin credentials");
    }
  };

  return (
    <Container className="admin-login-container">
      <h2 className="admin-login-header">Admin Portal</h2>
      {error && (
        <Alert variant="danger" className="admin-login-alert">
          {error}
        </Alert>
      )}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-4">
          <Form.Label className="admin-login-label">Username</Form.Label>
          <Form.Control
            type="text"
            value={credentials.username}
            onChange={(e) =>
              setCredentials({ ...credentials, username: e.target.value })
            }
            required
            className="admin-login-input"
          />
        </Form.Group>
        <Form.Group className="mb-4">
          <Form.Label className="admin-login-label">Password</Form.Label>
          <Form.Control
            type="password"
            value={credentials.password}
            onChange={(e) =>
              setCredentials({ ...credentials, password: e.target.value })
            }
            required
            className="admin-login-input"
          />
        </Form.Group>
        <Button
          variant="primary"
          type="submit"
          className="admin-login-submit-btn"
        >
          Login
        </Button>
      </Form>
    </Container>
  );
};

export default AdminLogin;
