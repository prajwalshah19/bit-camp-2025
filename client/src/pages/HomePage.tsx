"use client";

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import FileUploadForm from "../components/FileUploadForm";
import styles from "./HomePage.module.css";
import api from "../services/api";

export default function HomePage() {
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [verifying, setVerifying] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        console.log("No token found, redirecting to login");
        navigate("/");
        return;
      }
      try {
        // Call a lightweight protected endpoint to verify token
        await api.get("/protected");
        setAuthorized(true);
      } catch {
        // Invalid or expired token
        localStorage.clear();
        navigate("/");
      } finally {
        setVerifying(false);
      }
    };
    verifyToken();
  }, [navigate]);

  const handleUploadSuccess = () => {
    setUploadSuccess(true);
    setUploadError("");
  };

  const handleUploadError = (error: string) => {
    setUploadSuccess(false);
    setUploadError(error);
  };

  // While verifying token, disable everything
  if (verifying) {
    return (
      <main className={styles.main}>
        <div className={styles.container}>
          <h1 className={styles.title}>Verifying session…</h1>
        </div>
      </main>
    );
  }

  if (!authorized) {
    // In practice, navigate() will have redirected already
    return null;
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>File Upload System</h1>

        {uploadSuccess && (
          <div className={styles.successMessage}>
            File uploaded successfully! It will be reviewed by an administrator.
          </div>
        )}

        {uploadError && (
          <div className={styles.errorMessage}>Error: {uploadError}</div>
        )}

        <FileUploadForm
          onSuccess={handleUploadSuccess}
          onError={handleUploadError}
        />

        <div className={styles.adminLink}>
          <Link to="/admin">Admin Portal</Link>
        </div>
      </div>
    </main>
  );
}
