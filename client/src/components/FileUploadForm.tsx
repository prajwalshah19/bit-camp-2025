"use client"

import { useState, type ChangeEvent, type FormEvent } from "react"
import styles from "./FileUploadForm.module.css"

interface FileUploadFormProps {
  onSuccess: () => void
  onError: (error: string) => void
}

export default function FileUploadForm({ onSuccess, onError }: FileUploadFormProps) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!file) {
      onError("Please select a file to upload")
      return
    }

    setUploading(true)

    try {
      // Create form data
      const formData = new FormData()
      formData.append("file", file)

      // Send file to API
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to upload file")
      }

      const data = await response.json()
      setFile(null)
      onSuccess()
    } catch (error) {
      onError(error instanceof Error ? error.message : "An unknown error occurred")
    } finally {
      setUploading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.fileInput}>
        <label htmlFor="file" className={styles.fileLabel}>
          {file ? file.name : "Choose a file"}
        </label>
        <input type="file" id="file" onChange={handleFileChange} className={styles.hiddenInput} />
        {file && (
          <button type="button" onClick={() => setFile(null)} className={styles.clearButton}>
            Clear
          </button>
        )}
      </div>

      <button type="submit" disabled={!file || uploading} className={styles.submitButton}>
        {uploading ? "Uploading..." : "Upload File"}
      </button>
    </form>
  )
}
