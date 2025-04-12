"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import type { FileData } from "../types/file"
import styles from "./FileDetailPage.module.css"

export default function FileDetailPage() {
  const params = useParams()
  const navigate = useNavigate()
  const fileId = params.id

  const [file, setFile] = useState<FileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [adminNotes, setAdminNotes] = useState("")
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    const fetchFileDetails = async () => {
      try {
        const response = await fetch(`/api/files/${fileId}`)
        if (!response.ok) {
          throw new Error("Failed to fetch file details")
        }
        const data = await response.json()
        setFile(data.file)
        setAdminNotes(data.file.admin_notes || "")
      } catch (error) {
        setError(error instanceof Error ? error.message : "An unknown error occurred")
      } finally {
        setLoading(false)
      }
    }

    if (fileId) {
      fetchFileDetails()
    }
  }, [fileId])

  const updateFileStatus = async (status: "approved" | "denied") => {
    if (!file) return

    setUpdating(true)
    try {
      const response = await fetch(`/api/files/${fileId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status,
          admin_notes: adminNotes,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update file status")
      }

      const updatedFile = await response.json()
      setFile(updatedFile.file)
    } catch (error) {
      setError(error instanceof Error ? error.message : "An unknown error occurred")
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return <div className={styles.loading}>Loading file details...</div>
  }

  if (error) {
    return <div className={styles.error}>{error}</div>
  }

  if (!file) {
    return <div className={styles.error}>File not found</div>
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
              <span className={`${styles.status} ${styles[file.status]}`}>{file.status}</span>
            </div>

            <div className={styles.infoItem}>
              <h3>Upload Time</h3>
              <p>{new Date(file.upload_time).toLocaleString()}</p>
            </div>

            <div className={styles.infoItem}>
              <h3>Score</h3>
              <p>{file.score !== undefined ? file.score.toFixed(2) : "N/A"}</p>
            </div>

            <div className={styles.infoItem}>
              <h3>Submitter ID</h3>
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
            <h3>File Path</h3>
            <p className={styles.path}>{file.original_path}</p>
          </div>

          {file.matches && file.matches.length > 0 && (
            <div className={styles.section}>
              <h3>Top Matches</h3>
              <ul className={styles.matchesList}>
                {file.matches.map((match, index) => (
                  <li key={index}>{match}</li>
                ))}
              </ul>
            </div>
          )}

          <div className={styles.section}>
            <h3>Admin Notes</h3>
            <textarea
              className={styles.notesTextarea}
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Add notes about this file..."
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
  )
}
