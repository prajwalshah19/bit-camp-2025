import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import "./index.css"

// For development purposes, we'll set up a mock server
//import { setupMockServer } from "./mocks/server"

// Only setup mock server in development
if (import.meta.env.DEV) {
  //setupMockServer()
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
