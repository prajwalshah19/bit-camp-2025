/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import FileList from "../components/FileList";
import type { FileData } from "../types/file";
import styles from "./AdminPage.module.css";
import api, { getReviewFiles } from "../services/api";

export default function AdminPage() {
  const [files, setFiles] = useState<FileData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      // Check for token and access level
      const token = localStorage.getItem("access_token");
      const accessLevel = localStorage.getItem("access_level");
      if (!token || accessLevel !== "admin") {
        alert("Access denied: Admins only");
        navigate("/upload");
        return;
      }

      // Verify token using a protected endpoint
      try {
        await api.get("/protected");
      } catch {
        localStorage.clear();
        alert("Session expired or invalid. Please log in again.");
        navigate("/upload");
        return;
      }

      // Fetch files from the review endpoint
      try {
        const response = await getReviewFiles();
        setFiles(response.data.files);
      } catch (err: any) {
        setError(
          err.response?.data?.detail ||
            err.message ||
            "Failed to fetch files"
        );
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [navigate]);

  // Filter files based on statusFilter
  const filteredFiles =
    statusFilter === "all"
      ? files
      : files.filter((file) => file.status === statusFilter);

  // Compute counts
  const counts = {
    all: files.length,
    pending: files.filter((file) => file.status === "pending").length,
    approved: files.filter((file) => file.status === "approved").length,
    denied: files.filter((file) => file.status === "denied").length,
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Admin Portal</h1>
        <Link to="/upload" className={styles.homeLink}>
          Back to Upload
        </Link>
      </header>

      <div className={styles.dashboard}>
        <div className={styles.stats}>
          {(["all", "pending", "approved", "denied"] as const).map(
            (key) => (
              <div key={key} className={styles.statCard}>
                <h3>{key.charAt(0).toUpperCase() + key.slice(1)} Files</h3>
                <p>{counts[key]}</p>
              </div>
            )
          )}
        </div>

        <div className={styles.filters}>
          <h2>File Submissions</h2>
          <div className={styles.filterButtons}>
            {(["all", "pending", "approved", "denied"] as const).map(
              (status) => (
                <button
                  key={status}
                  className={`${styles.filterButton} ${
                    statusFilter === status ? styles.active : ""
                  }`}
                  onClick={() => setStatusFilter(status)}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              )
            )}
          </div>
        </div>

        {loading ? (
          <div className={styles.loading}>Loading files...</div>
        ) : error ? (
          <div className={styles.error}>{error}</div>
        ) : (
          <FileList files={filteredFiles} />
        )}
      </div>
    </div>
  );
}
