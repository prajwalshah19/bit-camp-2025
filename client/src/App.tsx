import { BrowserRouter, Routes, Route } from "react-router-dom"
import HomePage from "./pages/HomePage"
import AdminPage from "./pages/AdminPage"
import FileDetailPage from "./pages/FileDetailPage"
import LoginPage from "./pages/AuthPage"
import "./App.css"

export default function App() {
  console.log(import.meta.env.VITE_API_URL);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/upload" element={<HomePage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/file/:id" element={<FileDetailPage />} />
      </Routes>
    </BrowserRouter>
  )
}
