/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  getFileDetail,
  decideOnFile,
} from "../services/api";
import type { FileData } from "../types/file";
import styles from "./FileDetailPage.module.css";

export default function FileDetailPage() {
  const { id: fileId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [file, setFile] = useState<FileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [updating, setUpdating] = useState(false);
  const [status, setStatus] = useState<"approved" | "denied" | "pending">("pending");

  useEffect(() => {
    if (!fileId) {
      navigate("/admin");
      return;
    }

    const fetchFileDetails = async () => {
      try {
        const resp = await getFileDetail(fileId);
        setFile(resp.data);
        setStatus(resp.data.status);
      } catch (err: any) {
        if (err.response?.status === 403) {
          alert("Access denied");
          navigate("/upload");
        } else {
          setError(err.response?.data?.detail || err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFileDetails();
  }, [fileId, navigate]);

  const updateFileStatus = async (status: "approved" | "denied") => {
    if (!file || !fileId) return;
    setUpdating(true);
    try {
      const resp = await decideOnFile(fileId, status);
      setFile(resp.data.data);
      setStatus(resp.data.data.status);
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading file details...</div>;
  }
  if (error) {
    return <div className={styles.error}>{error}</div>;
  }
  if (!file) {
    return <div className={styles.error}>File not found</div>;
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Link to="/admin" className={styles.backLink}>
            ← Back to Admin
          </Link>
          <h1>File Details</h1>
        </div>
      </header>

      <div className={styles.content}>
        <div className={styles.fileInfo}>
          <h2>{file.filename}</h2>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <h3>Status</h3>
              <span className={`${styles.status} ${styles[file.status]}`}>
                {status}
              </span>
            </div>
            <div className={styles.infoItem}>
              <h3>Upload Time</h3>
              <p>{new Date(file.upload_time).toLocaleString()}</p>
            </div>
            <div className={styles.infoItem}>
              <h3>Score</h3>
              <p>
                {file.similarity_score !== undefined
                  ? file.similarity_score.toFixed(2)
                  : "N/A"}
              </p>
            </div>
            <div className={styles.infoItem}>
              <h3>Submitter</h3>
              <p>{file.submitter_id}</p>
            </div>
            {file.decision_time && (
              <div className={styles.infoItem}>
                <h3>Decision Time</h3>
                <p>{new Date(file.decision_time).toLocaleString()}</p>
              </div>
            )}
          </div>


          <div className={styles.section}>
            <h3>Admin Notes</h3>
            <textarea
              className={styles.notesTextarea}
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Add notes..."
              disabled={file.status !== "pending" || updating}
            />
          </div>

          {file.status === "pending" && (
            <div className={styles.actions}>
              <button
                className={`${styles.actionButton} ${styles.approveButton}`}
                onClick={() => updateFileStatus("approved")}
                disabled={updating}
              >
                {updating ? "Updating..." : "Approve File"}
              </button>
              <button
                className={`${styles.actionButton} ${styles.denyButton}`}
                onClick={() => updateFileStatus("denied")}
                disabled={updating}
              >
                {updating ? "Updating..." : "Deny File"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
