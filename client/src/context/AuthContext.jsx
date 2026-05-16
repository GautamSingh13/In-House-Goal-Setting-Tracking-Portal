import { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import toast from 'react-hot-toast'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null)

    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const storedUser = localStorage.getItem('user')
        const storedToken = localStorage.getItem('token')

        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser))
        }
        setLoading(false)
    }, [])

    const login = async (email, password) => {
        try {
            const { data } = await api.post('/auth/login', { email, password })

            localStorage.setItem('token', data.token)
            localStorage.setItem('user', JSON.stringify(data))

            setUser(data)

            toast.success(`Welcome ${data.name}!`)

            if (data.role === 'admin') return '/admin/dashboard'
            if (data.role === 'manager') return '/manager/dashboard'
            return '/employee/dashboard'

        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed')
            return null
        }
    }

    const logout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setUser(null)
        toast.success('Logged out successfully')
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)