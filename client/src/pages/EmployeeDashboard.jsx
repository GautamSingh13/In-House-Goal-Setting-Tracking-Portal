 import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import { Link } from 'react-router-dom'

const EmployeeDashboard = () => {
    const { user } = useAuth()
    const [goals, setGoals] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchGoals = async () => {
            try {
                const { data } = await api.get('/goals/my')
                setGoals(data)
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        }
        fetchGoals()
    }, [])

    const totalGoals = goals.length
    const approvedGoals = goals.filter(g => g.status === 'approved').length
    const pendingGoals = goals.filter(g => g.status === 'submitted').length
    const totalWeightage = goals.reduce((sum, g) => sum + g.weightage, 0)

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            
            <div className="max-w-6xl mx-auto px-6 py-8">

                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    Welcome, {user?.name}! 👋
                </h1>
                <p className="text-gray-500 mb-8">Here's your goal overview</p>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <p className="text-sm text-gray-500">Total Goals</p>
                        <p className="text-3xl font-bold text-blue-600">{totalGoals}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <p className="text-sm text-gray-500">Approved</p>
                        <p className="text-3xl font-bold text-green-600">{approvedGoals}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <p className="text-sm text-gray-500">Pending Review</p>
                        <p className="text-3xl font-bold text-yellow-600">{pendingGoals}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <p className="text-sm text-gray-500">Total Weightage</p>
                        <p className="text-3xl font-bold text-purple-600">{totalWeightage}%</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <Link to="/employee/goals" className="bg-blue-600 text-white p-6 rounded-xl hover:bg-blue-700 text-center">
                        <p className="text-2xl mb-2">🎯</p>
                        <p className="font-medium">Manage Goals</p>
                    </Link>
                    <Link to="/employee/checkin" className="bg-green-600 text-white p-6 rounded-xl hover:bg-green-700 text-center">
                        <p className="text-2xl mb-2">📊</p>
                        <p className="font-medium">Quarterly Check-in</p>
                    </Link>
                    <div className="bg-purple-600 text-white p-6 rounded-xl text-center">
                        <p className="text-2xl mb-2">📈</p>
                        <p className="font-medium">My Progress</p>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">My Goals</h2>
                    
                    {loading ? (
                        <p className="text-gray-500">Loading...</p>
                    ) : goals.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-500 mb-4">No goals yet!</p>
                            <Link to="/employee/goals" className="bg-blue-600 text-white px-4 py-2 rounded-lg">
                                Create Your First Goal
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {goals.map(goal => (
                                <div key={goal._id} className="border border-gray-200 rounded-lg p-4 flex justify-between items-center">
                                    <div>
                                        <p className="font-medium text-gray-800">{goal.title}</p>
                                        <p className="text-sm text-gray-500">{goal.thrustArea} • {goal.weightage}%</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                        goal.status === 'approved' ? 'bg-green-100 text-green-700' :
                                        goal.status === 'submitted' ? 'bg-yellow-100 text-yellow-700' :
                                        goal.status === 'returned' ? 'bg-red-100 text-red-700' :
                                        'bg-gray-100 text-gray-700'
                                    }`}>
                                        {goal.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    )
}

export default EmployeeDashboard
