import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const { login } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        const redirectPath = await login(email, password)
        setLoading(false)
        if (redirectPath) navigate(redirectPath)
    }

const handleDemoLogin = async (role) => {
    const demoCredentials = {
        employee: { email: 'employee@atomquest.com', password: 'employee123' },
        manager: { email: 'manager@atomquest.com', password: 'manager123' },
        admin: { email: 'admin@atomquest.com', password: 'admin123' }
    }

    const { email, password } = demoCredentials[role]
    setEmail(email)
    setPassword(password)
    setLoading(true)
    const redirectPath = await login(email, password)
    setLoading(false)
    if (redirectPath) navigate(redirectPath)
}

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 w-full max-w-md">

                <div className="mb-8">
                    <h1 className="text-2xl font-bold" style={{ color: 'var(--primary)' }}>Goal Setting & Tracking Portal</h1>
                    <p className="text-gray-400 text-sm mt-1">Plan, track, and review goals across your team</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:border-transparent"
                            style={{ '--tw-ring-color': 'var(--primary)' }}
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:border-transparent"
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full text-white py-2.5 rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
                        style={{ background: 'var(--primary)' }}
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                
        <div className="mt-6">
            <p className="text-xs font-medium text-gray-500 mb-2 text-center">Quick Demo Access</p>
            <div className="grid grid-cols-3 gap-2">
                <button
                    onClick={() => handleDemoLogin('employee')}
                    disabled={loading}
                    className="text-xs py-2 rounded-lg border border-gray-200 hover:bg-gray-50 font-medium text-gray-700 disabled:opacity-50"
                >
                    Employee
                </button>
                <button
            onClick={() => handleDemoLogin('manager')}
            disabled={loading}
            className="text-xs py-2 rounded-lg border border-gray-200 hover:bg-gray-50 font-medium text-gray-700 disabled:opacity-50"
        >
            Manager
                </button>
                <button
            onClick={() => handleDemoLogin('admin')}
            disabled={loading}
            className="text-xs py-2 rounded-lg border border-gray-200 hover:bg-gray-50 font-medium text-gray-700 disabled:opacity-50"
        >
            Admin
                </button>
            </div>
         </div>

            </div>
        </div>
    )
}

export default Login