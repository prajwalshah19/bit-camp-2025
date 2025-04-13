/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, type ChangeEvent, type FormEvent, useRef } from "react";
import styles from "./FileUploadForm.module.css";
import { sendFile } from "../services/api";

interface FileUploadFormProps {
  onSuccess: () => void;
  onError: (error: string) => void;
}

export default function FileUploadForm({ onSuccess, onError }: FileUploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const clearFile = () => {
    setFile(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!file) {
      onError("Please select a file to upload");
      return;
    }

    setUploading(true);
    try {
      await sendFile(file);
      clearFile();
      onSuccess();
    } catch (err: any) {
      // If your API returns JSON { detail: "..."} or similar
      const message =
        err.response?.data?.detail ||
        err.message ||
        "Failed to upload file";
      onError(message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.fileInput}>
        <label htmlFor="file" className={styles.fileLabel}>
          {file ? file.name : "Choose a file"}
        </label>
        <input
          type="file"
          id="file"
          onChange={handleFileChange}
          className={styles.hiddenInput}
          ref={inputRef}
        />
        {file && (
          <button
            type="button"
            onClick={clearFile}
            className={styles.clearButton}
            disabled={uploading}
          >
            Clear
          </button>
        )}
      </div>

      <button
        type="submit"
        disabled={!file || uploading}
        className={styles.submitButton}
      >
        {uploading ? "Uploading..." : "Upload File"}
      </button>
    </form>
  );
}
