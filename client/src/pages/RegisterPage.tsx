"use client"

import { useState, type FormEvent } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import styles from "./LoginPage.module.css"

export default function RegisterPage() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()
    const { register } = useAuth()

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setError("")

        // Validate passwords match
        if (password !== confirmPassword) {
            setError("Passwords do not match")
            return
        }

        // Validate password strength
        if (password.length < 6) {
            setError("Password must be at least 6 characters long")
            return
        }

        setIsLoading(true)

        try {
            await register(username, password)
            navigate("/login", { state: { registered: true } })
        } catch (err) {
            setError(err instanceof Error ? err.message : "Registration failed. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <main className={styles.main}>
            <div className={styles.container}>
                <h1 className={styles.title}>Create Account</h1>

                {error && <div className={styles.errorMessage}>{error}</div>}

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

                    <div className={styles.formGroup}>
                        <label htmlFor="confirmPassword" className={styles.label}>
                            Confirm Password
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className={styles.input}
                            required
                        />
                    </div>

                    <button type="submit" className={styles.button} disabled={isLoading}>
                        {isLoading ? "Creating Account..." : "Register"}
                    </button>
                </form>

                <div className={styles.links}>
                    Already have an account?{" "}
                    <Link to="/login" className={styles.link}>
                        Login
                    </Link>
                </div>
            </div>
        </main>
    )
}
