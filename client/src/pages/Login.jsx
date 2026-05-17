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

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 w-full max-w-md">

                <div className="mb-8">
                    <h1 className="text-2xl font-bold" style={{ color: 'var(--primary)' }}>AtomQuest</h1>
                    <p className="text-gray-400 text-sm mt-1">Goal Setting & Tracking Portal</p>
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

                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <p className="text-xs font-medium text-gray-500 mb-2">Test Credentials</p>
                    <div className="space-y-1">
                        <p className="text-xs text-gray-400">Admin: admin@atomquest.com / admin123</p>
                        <p className="text-xs text-gray-400">Manager: manager@atomquest.com / manager123</p>
                        <p className="text-xs text-gray-400">Employee: employee@atomquest.com / employee123</p>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Login