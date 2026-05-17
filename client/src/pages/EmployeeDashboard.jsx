import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import { Link, useNavigate } from 'react-router-dom'

const EmployeeDashboard = () => {
    const { user } = useAuth()
    const navigate = useNavigate()
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
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-6xl mx-auto px-6 py-8">


                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-800">Welcome back, {user?.name}</h1>
                    <p className="text-gray-400 text-sm mt-1">Here is your goal overview</p>
                </div>


                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: 'Total Goals', value: totalGoals, color: 'var(--primary)' },
                        { label: 'Approved', value: approvedGoals, color: '#16a34a' },
                        { label: 'Pending Review', value: pendingGoals, color: '#d97706' },
                        { label: 'Total Weightage', value: `${totalWeightage}%`, color: '#7c3aed' },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white rounded-xl p-5 border border-gray-100">
                            <p className="text-xs text-gray-400 mb-1">{stat.label}</p>
                            <p className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <Link to="/employee/goals"
                        className="p-5 rounded-xl text-white font-medium text-sm hover:opacity-90 transition-opacity"
                        style={{ background: 'var(--primary)' }}>
                        <p className="text-lg mb-1">My Goals</p>
                        <p className="opacity-75 text-xs">Create and manage your goals</p>
                    </Link>
                    <Link to="/employee/checkin"
                        className="p-5 rounded-xl text-white font-medium text-sm hover:opacity-90 bg-green-600">
                        <p className="text-lg mb-1">Quarterly Check-in</p>
                        <p className="opacity-75 text-xs">Log your achievements</p>
                    </Link>
                    <div 
                            onClick={() => navigate('/employee/progress')}
                            className="p-5 rounded-xl text-white font-medium text-sm bg-purple-600 hover:opacity-90 cursor-pointer">
                            <p className="text-lg mb-1">My Progress</p>
                            <p className="opacity-75 text-xs">Track your performance</p>
                            </div>
                    </div>


                <div className="bg-white rounded-xl border border-gray-100 p-6">
                    <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-4">My Goals</h2>

                    {loading ? (
                        <p className="text-gray-400 text-sm">Loading...</p>
                    ) : goals.length === 0 ? (
                        <div className="text-center py-10">
                            <p className="text-gray-400 text-sm mb-3">No goals yet</p>
                            <Link to="/employee/goals"
                                className="text-sm text-white px-4 py-2 rounded-lg"
                                style={{ background: 'var(--primary)' }}>
                                Create First Goal
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {goals.map(goal => (
                                <div key={goal._id} className="flex justify-between items-center p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">{goal.title}</p>
                                        <p className="text-xs text-gray-400">{goal.thrustArea} · {goal.weightage}%</p>
                                    </div>
                                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                                        goal.status === 'approved' ? 'bg-green-50 text-green-700' :
                                        goal.status === 'submitted' ? 'bg-yellow-50 text-yellow-700' :
                                        goal.status === 'returned' ? 'bg-red-50 text-red-700' :
                                        'bg-gray-100 text-gray-500'
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