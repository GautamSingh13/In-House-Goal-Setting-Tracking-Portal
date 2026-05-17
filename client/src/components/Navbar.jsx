import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState, useEffect } from 'react'

const Navbar = () => {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const [theme, setTheme] = useState('orange')

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || 'orange'
        setTheme(savedTheme)
        document.documentElement.setAttribute('data-theme', savedTheme)
    }, [])

    const changeTheme = (newTheme) => {
        setTheme(newTheme)
        localStorage.setItem('theme', newTheme)
        document.documentElement.setAttribute('data-theme', newTheme)
    }

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <nav style={{ background: 'var(--nav-bg)' }} className="text-white px-6 py-4 flex justify-between items-center shadow-md">

            {/* Logo */}
            <div className="text-xl font-bold tracking-tight">
                AtomQuest
            </div>

            <div className="flex gap-6 items-center">

                {user?.role === 'employee' && (
                    <>
                        <Link to="/employee/dashboard" className="text-sm hover:opacity-75">Dashboard</Link>
                        <Link to="/employee/goals" className="text-sm hover:opacity-75">My Goals</Link>
                        <Link to="/employee/checkin" className="text-sm hover:opacity-75">Check-in</Link>
                    </>
                )}

                {user?.role === 'manager' && (
                    <>
                        <Link to="/manager/dashboard" className="text-sm hover:opacity-75">Dashboard</Link>
                        <Link to="/reports" className="text-sm hover:opacity-75">Reports</Link>
                    </>
                )}

                {user?.role === 'admin' && (
                    <>
                        <Link to="/admin/dashboard" className="text-sm hover:opacity-75">Dashboard</Link>
                        <Link to="/reports" className="text-sm hover:opacity-75">Reports</Link>
                    </>
                )}

                <div className="flex items-center gap-1 ml-2">
                    <button
                        onClick={() => changeTheme('orange')}
                        title="Orange theme"
                        className={`w-5 h-5 rounded-full bg-orange-500 border-2 ${theme === 'orange' ? 'border-white' : 'border-transparent'}`}
                    />
                    <button
                        onClick={() => changeTheme('blue')}
                        title="Blue theme"
                        className={`w-5 h-5 rounded-full bg-blue-500 border-2 ${theme === 'blue' ? 'border-white' : 'border-transparent'}`}
                    />
                    <button
                        onClick={() => changeTheme('maroon')}
                        title="Maroon theme"
                        className={`w-5 h-5 rounded-full bg-rose-800 border-2 ${theme === 'maroon' ? 'border-white' : 'border-transparent'}`}
                    />
                </div>

                <div className="flex items-center gap-3 ml-2 border-l border-white border-opacity-30 pl-4">
                    <span className="text-sm opacity-80">{user?.name}</span>
                    <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full">{user?.role}</span>
                    <button
                        onClick={handleLogout}
                        className="bg-white px-3 py-1 rounded text-sm font-medium hover:opacity-90"
                        style={{ color: 'var(--primary)' }}
                    >
                        Logout
                    </button>
                </div>

            </div>
        </nav>
    )
}

export default Navbar