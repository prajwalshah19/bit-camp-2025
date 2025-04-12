import { createServer, Response } from "miragejs"
import { v4 as uuidv4 } from "uuid"

// Mock database for demo purposes
const mockFiles = [
  {
    id: "1",
    filename: "report.pdf",
    original_path: "/uploads/report.pdf",
    upload_time: new Date(Date.now() - 3600000).toISOString(),
    status: "pending",
    score: 78.5,
    matches: ["Content match 1", "Content match 2"],
    submitter_id: "user-123",
    decision_time: null,
    admin_notes: null,
  },
  {
    id: "2",
    filename: "presentation.pptx",
    original_path: "/uploads/presentation.pptx",
    upload_time: new Date(Date.now() - 86400000).toISOString(),
    status: "approved",
    score: 92.1,
    matches: ["Content match 3"],
    submitter_id: "user-456",
    decision_time: new Date(Date.now() - 43200000).toISOString(),
    admin_notes: "Approved after review",
  },
  {
    id: "3",
    filename: "document.docx",
    original_path: "/uploads/document.docx",
    upload_time: new Date(Date.now() - 172800000).toISOString(),
    status: "denied",
    score: 45.3,
    matches: ["Content match 4", "Content match 5", "Content match 6"],
    submitter_id: "user-789",
    decision_time: new Date(Date.now() - 86400000).toISOString(),
    admin_notes: "Denied due to policy violation",
  },
]

export function setupMockServer() {
  return createServer({
    routes() {
      this.namespace = "api"

      // Get all files
      this.get("/files", () => {
        return { files: mockFiles }
      })

      // Get a specific file
      this.get("/files/:id", (schema, request) => {
        const id = request.params.id
        const file = mockFiles.find((file) => file.id === id)

        if (!file) {
          return new Response(404, {}, { error: "File not found" })
        }

        return { file }
      })

      // Update a file
      this.patch("/files/:id", (schema, request) => {
        const id = request.params.id
        const attrs = JSON.parse(request.requestBody)

        const fileIndex = mockFiles.findIndex((file) => file.id === id)

        if (fileIndex === -1) {
          return new Response(404, {}, { error: "File not found" })
        }

        const updatedFile = {
          ...mockFiles[fileIndex],
          status: attrs.status || mockFiles[fileIndex].status,
          admin_notes: attrs.admin_notes || mockFiles[fileIndex].admin_notes,
          decision_time: attrs.status ? new Date().toISOString() : mockFiles[fileIndex].decision_time,
        }

        mockFiles[fileIndex] = updatedFile

        return { file: updatedFile }
      })

      // Upload a file
      this.post("/upload", (schema, request) => {
        // In a real app, this would handle the file upload
        // For the mock, we'll just return a success response with mock data

        const id = uuidv4()

        const fileData = {
          id,
          filename: "uploaded-file.pdf",
          original_path: "/uploads/uploaded-file.pdf",
          upload_time: new Date().toISOString(),
          status: "pending",
          score: Math.random() * 100,
          matches: ["Sample match 1", "Sample match 2", "Sample match 3"],
          submitter_id: uuidv4(),
          decision_time: null,
          admin_notes: null,
        }

        mockFiles.push(fileData)

        return { success: true, file: fileData }
      })
    },
  })
}
