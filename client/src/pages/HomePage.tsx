"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import FileUploadForm from "../components/FileUploadForm"
import styles from "./HomePage.module.css"

export default function HomePage() {
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [uploadError, setUploadError] = useState("")

  const handleUploadSuccess = () => {
    setUploadSuccess(true)
    setUploadError("")
  }

  const handleUploadError = (error: string) => {
    setUploadSuccess(false)
    setUploadError(error)
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

        {uploadError && <div className={styles.errorMessage}>Error: {uploadError}</div>}

        <FileUploadForm onSuccess={handleUploadSuccess} onError={handleUploadError} />

        <div className={styles.adminLink}>
          <Link to="/admin">Admin Portal</Link>
        </div>
      </div>
    </main>
  )
}
