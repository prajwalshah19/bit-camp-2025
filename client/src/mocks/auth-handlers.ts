import { Response } from "miragejs"
import { sign, verify } from "jsonwebtoken"
import { v4 as uuidv4 } from "uuid"

// Secret key for JWT signing (in a real app, this would be in an environment variable)
const JWT_SECRET = "your-secret-key-change-this-in-production"

// Mock users database
const users = [
    {
        id: "user-123",
        username: "admin",
        password: "admin123", // In a real app, this would be hashed
        role: "admin",
    },
    {
        id: "user-456",
        username: "user",
        password: "user123", // In a real app, this would be hashed
        role: "user",
    },
]

// Generate JWT token
const generateToken = (user: any) => {
    const payload = {
        id: user.id,
        username: user.username,
        role: user.role,
    }

    // Token expires in 24 hours
    return sign(payload, JWT_SECRET, { expiresIn: "24h" })
}

// Verify JWT token
const verifyToken = (token: string) => {
    try {
        return verify(token, JWT_SECRET)
    } catch (error) {
        return null
    }
}

// Extract token from cookie
const extractTokenFromCookie = (cookieHeader: string | null) => {
    if (!cookieHeader) return null

    const cookies = cookieHeader.split("; ")
    const tokenCookie = cookies.find((cookie) => cookie.startsWith("auth_token="))

    if (!tokenCookie) return null

    return tokenCookie.split("=")[1]
}

// Add auth routes to the mock server
export function setupAuthHandlers(server: any) {
    // Register route
    server.post("/api/auth/register", (schema: any, request: any) => {
        const { username, password } = JSON.parse(request.requestBody)

        // Check if username already exists
        if (users.some((u) => u.username === username)) {
            return new Response(400, {}, { message: "Username already exists" })
        }

        // Validate username and password
        if (!username || username.length < 3) {
            return new Response(400, {}, { message: "Username must be at least 3 characters long" })
        }

        if (!password || password.length < 6) {
            return new Response(400, {}, { message: "Password must be at least 6 characters long" })
        }

        // Create new user
        const newUser = {
            id: `user-${uuidv4()}`,
            username,
            password, // In a real app, this would be hashed
            role: "user", // Default role for new users
        }

        users.push(newUser)

        return {
            success: true,
            message: "User registered successfully",
        }
    })

    // Login route
    server.post("/api/auth/login", (schema: any, request: any) => {
        const { username, password } = JSON.parse(request.requestBody)

        const user = users.find((u) => u.username === username && u.password === password)

        if (!user) {
            return new Response(401, {}, { message: "Invalid credentials" })
        }

        const token = generateToken(user)

        // Set cookie with the token
        return new Response(
            200,
            {
                "Set-Cookie": `auth_token=${token}; HttpOnly; Path=/; Max-Age=86400; SameSite=Strict`,
            },
            {
                user: {
                    id: user.id,
                    username: user.username,
                    role: user.role,
                },
                message: "Login successful",
            },
        )
    })

    // Logout route
    server.post("/api/auth/logout", () => {
        return new Response(
            200,
            {
                "Set-Cookie": "auth_token=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict",
            },
            { message: "Logout successful" },
        )
    })

    // Verify token route
    server.get("/api/auth/verify", (schema: any, request: any) => {
        const token = extractTokenFromCookie(request.requestHeaders.cookie)

        if (!token) {
            return new Response(401, {}, { message: "Not authenticated" })
        }

        const decoded = verifyToken(token)

        if (!decoded) {
            return new Response(401, {}, { message: "Invalid or expired token" })
        }

        const user = users.find((u) => u.id === (decoded as any).id)

        if (!user) {
            return new Response(401, {}, { message: "User not found" })
        }

        return {
            user: {
                id: user.id,
                username: user.username,
                role: user.role,
            },
        }
    })

    // Protected route middleware
    server.get("/api/me", (schema: any, request: any) => {
        const token = extractTokenFromCookie(request.requestHeaders.cookie)

        if (!token) {
            return new Response(401, {}, { message: "Not authenticated" })
        }

        const decoded = verifyToken(token)

        if (!decoded) {
            return new Response(401, {}, { message: "Invalid or expired token" })
        }

        const user = users.find((u) => u.id === (decoded as any).id)

        if (!user) {
            return new Response(401, {}, { message: "User not found" })
        }

        return {
            user: {
                id: user.id,
                username: user.username,
                role: user.role,
            },
        }
    })
}
import { Response } from "miragejs"
import { sign, verify } from "jsonwebtoken"
import { v4 as uuidv4 } from "uuid"

// Secret key for JWT signing (in a real app, this would be in an environment variable)
const JWT_SECRET = "your-secret-key-change-this-in-production"

// Mock users database
const users = [
    {
        id: "user-123",
        username: "admin",
        password: "admin123", // In a real app, this would be hashed
        role: "admin",
    },
    {
        id: "user-456",
        username: "user",
        password: "user123", // In a real app, this would be hashed
        role: "user",
    },
]

// Generate JWT token
const generateToken = (user: any) => {
    const payload = {
        id: user.id,
        username: user.username,
        role: user.role,
    }

    // Token expires in 24 hours
    return sign(payload, JWT_SECRET, { expiresIn: "24h" })
}

// Verify JWT token
const verifyToken = (token: string) => {
    try {
        return verify(token, JWT_SECRET)
    } catch (error) {
        return null
    }
}

// Extract token from cookie
const extractTokenFromCookie = (cookieHeader: string | null) => {
    if (!cookieHeader) return null

    const cookies = cookieHeader.split("; ")
    const tokenCookie = cookies.find((cookie) => cookie.startsWith("auth_token="))

    if (!tokenCookie) return null

    return tokenCookie.split("=")[1]
}

// Add auth routes to the mock server
export function setupAuthHandlers(server: any) {
    // Register route
    server.post("/api/auth/register", (schema: any, request: any) => {
        const { username, password } = JSON.parse(request.requestBody)

        // Check if username already exists
        if (users.some((u) => u.username === username)) {
            return new Response(400, {}, { message: "Username already exists" })
        }

        // Validate username and password
        if (!username || username.length < 3) {
            return new Response(400, {}, { message: "Username must be at least 3 characters long" })
        }

        if (!password || password.length < 6) {
            return new Response(400, {}, { message: "Password must be at least 6 characters long" })
        }

        // Create new user
        const newUser = {
            id: `user-${uuidv4()}`,
            username,
            password, // In a real app, this would be hashed
            role: "user", // Default role for new users
        }

        users.push(newUser)

        return {
            success: true,
            message: "User registered successfully",
        }
    })

    // Login route
    server.post("/api/auth/login", (schema: any, request: any) => {
        const { username, password } = JSON.parse(request.requestBody)

        const user = users.find((u) => u.username === username && u.password === password)

        if (!user) {
            return new Response(401, {}, { message: "Invalid credentials" })
        }

        const token = generateToken(user)

        // Set cookie with the token
        return new Response(
            200,
            {
                "Set-Cookie": `auth_token=${token}; HttpOnly; Path=/; Max-Age=86400; SameSite=Strict`,
            },
            {
                user: {
                    id: user.id,
                    username: user.username,
                    role: user.role,
                },
                message: "Login successful",
            },
        )
    })

    // Logout route
    server.post("/api/auth/logout", () => {
        return new Response(
            200,
            {
                "Set-Cookie": "auth_token=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict",
            },
            { message: "Logout successful" },
        )
    })

    // Verify token route
    server.get("/api/auth/verify", (schema: any, request: any) => {
        const token = extractTokenFromCookie(request.requestHeaders.cookie)

        if (!token) {
            return new Response(401, {}, { message: "Not authenticated" })
        }

        const decoded = verifyToken(token)

        if (!decoded) {
            return new Response(401, {}, { message: "Invalid or expired token" })
        }

        const user = users.find((u) => u.id === (decoded as any).id)

        if (!user) {
            return new Response(401, {}, { message: "User not found" })
        }

        return {
            user: {
                id: user.id,
                username: user.username,
                role: user.role,
            },
        }
    })

    // Protected route middleware
    server.get("/api/me", (schema: any, request: any) => {
        const token = extractTokenFromCookie(request.requestHeaders.cookie)

        if (!token) {
            return new Response(401, {}, { message: "Not authenticated" })
        }

        const decoded = verifyToken(token)

        if (!decoded) {
            return new Response(401, {}, { message: "Invalid or expired token" })
        }

        const user = users.find((u) => u.id === (decoded as any).id)

        if (!user) {
            return new Response(401, {}, { message: "User not found" })
        }

        return {
            user: {
                id: user.id,
                username: user.username,
                role: user.role,
            },
        }
    })
}
