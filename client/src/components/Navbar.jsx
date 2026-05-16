 import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center shadow-md">

            <div className="text-xl font-bold">
                ⚡ AtomQuest
            </div>
            <div className="flex gap-6 items-center">

                {user?.role === 'employee' && (
                    <>
                        <Link to="/employee/dashboard" className="hover:text-blue-200">Dashboard</Link>
                        <Link to="/employee/goals" className="hover:text-blue-200">My Goals</Link>
                        <Link to="/employee/checkin" className="hover:text-blue-200">Check-in</Link>
                    </>
                )}

                {user?.role === 'manager' && (
                    <>
                        <Link to="/manager/dashboard" className="hover:text-blue-200">Dashboard</Link>
                        <Link to="/reports" className="hover:text-blue-200">Reports</Link>
                    </>
                )}

                {user?.role === 'admin' && (
                    <>
                        <Link to="/admin/dashboard" className="hover:text-blue-200">Dashboard</Link>
                        <Link to="/reports" className="hover:text-blue-200">Reports</Link>
                    </>
                )}

                <div className="flex items-center gap-3 ml-4 border-l border-blue-400 pl-4">
                    <span className="text-sm text-blue-200">{user?.name}</span>
                    <span className="text-xs bg-blue-800 px-2 py-1 rounded-full">{user?.role}</span>
                    <button
                        onClick={handleLogout}
                        className="bg-white text-blue-600 px-3 py-1 rounded text-sm font-medium hover:bg-blue-50"
                    >
                        Logout
                    </button>
                </div>

            </div>
        </nav>
    )
}

export default Navbar
