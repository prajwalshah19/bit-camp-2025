import { BrowserRouter, Routes, Route } from "react-router-dom"
import HomePage from "./pages/HomePage"
import AdminPage from "./pages/AdminPage"
import FileDetailPage from "./pages/FileDetailPage"
import "./App.css"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/file/:id" element={<FileDetailPage />} />
      </Routes>
    </BrowserRouter>
  )
}
