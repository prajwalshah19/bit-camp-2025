"use client"

import { useState, type FormEvent, useEffect } from "react"
import { useNavigate, Link, useLocation } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import styles from "./LoginPage.module.css"

export default function LoginPage() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [successMessage, setSuccessMessage] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()
    const { login, user } = useAuth()

    // Check if user was redirected after registration
    useEffect(() => {
        if (location.state?.registered) {
            setSuccessMessage("Account created successfully! Please log in.")
        }
    }, [location.state])

    // Redirect if already logged in
    useEffect(() => {
        if (user) {
            const from = location.state?.from?.pathname || "/"
            navigate(from, { replace: true })
        }
    }, [user, navigate, location.state])

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setError("")
        setSuccessMessage("")
        setIsLoading(true)

        try {
            await login(username, password)
            // Navigation will happen in the useEffect above
        } catch (err) {
            setError(err instanceof Error ? err.message : "Login failed. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <main className={styles.main}>
            <div className={styles.container}>
                <h1 className={styles.title}>Login</h1>

                {error && <div className={styles.errorMessage}>{error}</div>}
                {successMessage && <div className={styles.successMessage}>{successMessage}</div>}

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label htmlFor="username" className={styles.label}>
                            Username
                        </label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className={styles.input}
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="password" className={styles.label}>
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={styles.input}
                            required
                        />
                    </div>

                    <button type="submit" className={styles.button} disabled={isLoading}>
                        {isLoading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <div className={styles.links}>
                    Don't have an account?{" "}
                    <Link to="/register" className={styles.link}>
                        Register
                    </Link>
                    <br />
                    <Link to="/" className={styles.link}>
                        Back to Home
                    </Link>
                </div>
            </div>
        </main>
    )
}
