/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AuthPage.module.css";
import { loginUser, registerUser } from "../services/api";

const AuthPage: React.FC = () => {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);       
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (mode === "login") {
        const response = await loginUser(email, password);
        localStorage.setItem("access_token", response.access_token);
        localStorage.setItem("email", response.email);
        localStorage.setItem("access_level", response.access_level);
        navigate("/upload"); 
      } else {
        // Registration mode, now with isAdmin flag
        await registerUser(email, password, isAdmin);
        setMode("login");
      }
    } catch (err: any) {
      setError(err?.response?.data?.detail || err?.message || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>ShadowScan</h1>
      </header>
      <div className={styles.formContainer}>
        {error && <div className={styles.error}>{error}</div>}
        <form onSubmit={handleAuth} className={styles.authForm}>
          {/* email & password fields */}
          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* only show in register mode */}
          {mode === "register" && (
            <div className={styles.formGroup}>
              <label htmlFor="isAdmin">
                <input
                  id="isAdmin"
                  type="checkbox"
                  checked={isAdmin}
                  onChange={(e) => setIsAdmin(e.target.checked)}
                />
                {" "}Register as admin
              </label>
            </div>
          )}

          <button type="submit" className={styles.authButton} disabled={loading}>
            {loading
              ? mode === "login"
                ? "Logging in..."
                : "Registering..."
              : mode === "login"
              ? "Login"
              : "Register"}
          </button>
        </form>

        <div className={styles.toggleMode}>
          {mode === "login" ? (
            <p>
              Don't have an account?{" "}
              <span
                onClick={() => {
                  setMode("register");
                  setError("");
                }}
                className={styles.toggleLink}
              >
                Register here.
              </span>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <span
                onClick={() => {
                  setMode("login");
                  setError("");
                }}
                className={styles.toggleLink}
              >
                Login here.
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
