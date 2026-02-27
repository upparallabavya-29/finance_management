import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    // For this project, we'll use a mock user or handle Supabase auth logic here
    useEffect(() => {
        // Check for existing session
        const mockUser = { id: 'mock-uuid', email: 'user@example.com' }
        setUser(mockUser)
        setLoading(false)
    }, [])

    const login = async (email, password) => {
        // Supabase login logic
        const mockUser = { id: 'mock-uuid', email }
        setUser(mockUser)
    }

    const logout = () => {
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
