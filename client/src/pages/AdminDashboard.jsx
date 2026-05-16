 import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import GoalCard from '../components/GoalCard'
import api from '../services/api'

const AdminDashboard = () => {
    const [goals, setGoals] = useState([])
    const [users, setUsers] = useState([])
    const [logs, setLogs] = useState([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('goals')

    const fetchData = async () => {
        try {
            const [goalsRes, usersRes] = await Promise.all([
                api.get('/goals/team'),
                api.get('/users')
            ])
            setGoals(goalsRes.data)
            setUsers(usersRes.data)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const totalGoals = goals.length
    const approvedGoals = goals.filter(g => g.status === 'approved').length
    const lockedGoals = goals.filter(g => g.isLocked).length
    const totalUsers = users.length

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />

            <div className="max-w-6xl mx-auto px-6 py-8">

                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    Admin Dashboard 🛡️
                </h1>
                <p className="text-gray-500 mb-8">Manage organization goals and users</p>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <p className="text-sm text-gray-500">Total Users</p>
                        <p className="text-3xl font-bold text-blue-600">{totalUsers}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <p className="text-sm text-gray-500">Total Goals</p>
                        <p className="text-3xl font-bold text-purple-600">{totalGoals}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <p className="text-sm text-gray-500">Approved Goals</p>
                        <p className="text-3xl font-bold text-green-600">{approvedGoals}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <p className="text-sm text-gray-500">Locked Goals</p>
                        <p className="text-3xl font-bold text-yellow-600">{lockedGoals}</p>
                    </div>
                </div>
                <div className="flex gap-3 mb-6">
                    {['goals', 'users'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${
                                activeTab === tab
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            {tab === 'goals' ? '🎯 All Goals' : '👥 All Users'}
                        </button>
                    ))}
                </div>
                {activeTab === 'goals' && (
                    loading ? (
                        <p className="text-gray-500">Loading...</p>
                    ) : goals.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-xl shadow-sm">
                            <p className="text-gray-500">No goals found!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {goals.map(goal => (
                                <GoalCard key={goal._id} goal={goal} onUpdate={fetchData} />
                            ))}
                        </div>
                    )
                )}

                {activeTab === 'users' && (
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {users.map(user => (
                                    <tr key={user._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-800">{user.name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{user.email}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                                                user.role === 'manager' ? 'bg-blue-100 text-blue-700' :
                                                'bg-green-100 text-green-700'
                                            }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

            </div>
        </div>
    )
}

export default AdminDashboard
