import { Link } from "react-router-dom"
import type { FileData } from "../types/file"
import styles from "./FileList.module.css"

interface FileListProps {
  files: FileData[]
}

export default function FileList({ files }: FileListProps) {
  if (files.length === 0) {
    return <div className={styles.noFiles}>No files found</div>
  }

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Filename</th>
            <th>Upload Time</th>
            <th>Status</th>
            <th>Score</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file) => (
            <tr key={file.id}>
              <td>{file.filename}</td>
              <td>{new Date(file.upload_time).toLocaleString()}</td>
              <td>
                <span className={`${styles.status} ${styles[file.status]}`}>{file.status}</span>
              </td>
              <td>{file.similarity_score !== undefined ? file.similarity_score.toFixed(2) : "N/A"}</td>
              <td>
                <Link to={`/admin/file/${file.id}`} className={styles.viewButton}>
                  View Details
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
