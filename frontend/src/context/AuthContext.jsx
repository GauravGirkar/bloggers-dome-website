import { createContext, useContext, useState, useEffect } from 'react'

// 1. Create the context
const AuthContext = createContext()

// 2. Provider component — wraps your entire app
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(null)

    // On app load — check if token exists in localStorage
    useEffect(() => {
        const savedToken = localStorage.getItem('token')
        if(savedToken){
            setToken(savedToken)
        }
    }, [])

    // Login function — saves token to state and localStorage
    function login(tokenReceived) {
        localStorage.setItem('token', tokenReceived)
        setToken(tokenReceived)
    }

    // Logout function — clears everything
    function logout() {
        localStorage.removeItem('token')
        setToken(null)
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

// 3. Custom hook — makes it easy to use auth anywhere
export function useAuth() {
    return useContext(AuthContext)
}