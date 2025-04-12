"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import FileList from "../components/FileList"
import type { FileData } from "../types/file"
import styles from "./AdminPage.module.css"

export default function AdminPage() {
  const [files, setFiles] = useState<FileData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch("/api/files")
        if (!response.ok) {
          throw new Error("Failed to fetch files")
        }
        const data = await response.json()
        setFiles(data.files)
      } catch (error) {
        setError(error instanceof Error ? error.message : "An unknown error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchFiles()
  }, [])

  const filteredFiles = statusFilter === "all" ? files : files.filter((file) => file.status === statusFilter)

  const counts = {
    all: files.length,
    pending: files.filter((file) => file.status === "pending").length,
    approved: files.filter((file) => file.status === "approved").length,
    denied: files.filter((file) => file.status === "denied").length,
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Admin Portal</h1>
        <Link to="/" className={styles.homeLink}>
          Back to Home
        </Link>
      </header>

      <div className={styles.dashboard}>
        <div className={styles.stats}>
          <div className={styles.statCard}>
            <h3>Total Files</h3>
            <p>{counts.all}</p>
          </div>
          <div className={styles.statCard}>
            <h3>Pending</h3>
            <p>{counts.pending}</p>
          </div>
          <div className={styles.statCard}>
            <h3>Approved</h3>
            <p>{counts.approved}</p>
          </div>
          <div className={styles.statCard}>
            <h3>Denied</h3>
            <p>{counts.denied}</p>
          </div>
        </div>

        <div className={styles.filters}>
          <h2>File Submissions</h2>
          <div className={styles.filterButtons}>
            <button
              className={`${styles.filterButton} ${statusFilter === "all" ? styles.active : ""}`}
              onClick={() => setStatusFilter("all")}
            >
              All
            </button>
            <button
              className={`${styles.filterButton} ${statusFilter === "pending" ? styles.active : ""}`}
              onClick={() => setStatusFilter("pending")}
            >
              Pending
            </button>
            <button
              className={`${styles.filterButton} ${statusFilter === "approved" ? styles.active : ""}`}
              onClick={() => setStatusFilter("approved")}
            >
              Approved
            </button>
            <button
              className={`${styles.filterButton} ${statusFilter === "denied" ? styles.active : ""}`}
              onClick={() => setStatusFilter("denied")}
            >
              Denied
            </button>
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
  )
}
