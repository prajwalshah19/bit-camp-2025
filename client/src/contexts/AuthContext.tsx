"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

type User = {
    id: string
    username: string
    role: "user" | "admin"
}

type DecodedToken = {
    id: string
    username: string
    role: string
    exp: number
}

type AuthContextType = {
    user: User | null
    loading: boolean
    login: (username: string, password: string) => Promise<void>
    logout: () => Promise<void>
    register: (username: string, password: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    login: async () => { },
    logout: async () => { },
    register: async () => { },
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    // Check for existing token on mount
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch("/api/auth/verify", {
                    method: "GET",
                    credentials: "include", // Important for cookies
                })

                if (response.ok) {
                    const data = await response.json()
                    setUser(data.user)
                }
            } catch (error) {
                console.error("Auth verification error:", error)
                setUser(null)
            } finally {
                setLoading(false)
            }
        }

        checkAuth()
    }, [])

    const login = async (username: string, password: string) => {
        const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include", // Important for cookies
            body: JSON.stringify({ username, password }),
        })

        if (!response.ok) {
            const error = await response.json()
            throw new Error(error.message || "Login failed")
        }

        const data = await response.json()
        setUser(data.user)
        return data
    }

    const logout = async () => {
        await fetch("/api/auth/logout", {
            method: "POST",
            credentials: "include", // Important for cookies
        })
        setUser(null)
    }

    const register = async (username: string, password: string) => {
        const response = await fetch("/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        })

        if (!response.ok) {
            const error = await response.json()
            throw new Error(error.message || "Registration failed")
        }

        return await response.json()
    }

    return <AuthContext.Provider value={{ user, loading, login, logout, register }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
