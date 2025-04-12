export interface FileData {
  id: string
  filename: string
  original_path: string
  upload_time: string
  status: "pending" | "approved" | "denied"
  score?: number
  matches?: string[]
  submitter_id: string
  decision_time?: string | null
  admin_notes?: string | null
}
