 import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import GoalCard from '../components/GoalCard'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'

const ManagerDashboard = () => {
    const { user } = useAuth()
    const [goals, setGoals] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('all')

    const fetchGoals = async () => {
        try {
            const { data } = await api.get('/goals/team')
            setGoals(data)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchGoals()
    }, [])

    const filteredGoals = filter === 'all' 
        ? goals 
        : goals.filter(g => g.status === filter)

    const submitted = goals.filter(g => g.status === 'submitted').length
    const approved = goals.filter(g => g.status === 'approved').length
    const returned = goals.filter(g => g.status === 'returned').length

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />

            <div className="max-w-6xl mx-auto px-6 py-8">

                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    Manager Dashboard 👋
                </h1>
                <p className="text-gray-500 mb-8">Review and approve team goals</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <p className="text-sm text-gray-500">Pending Review</p>
                        <p className="text-3xl font-bold text-yellow-600">{submitted}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <p className="text-sm text-gray-500">Approved</p>
                        <p className="text-3xl font-bold text-green-600">{approved}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <p className="text-sm text-gray-500">Returned</p>
                        <p className="text-3xl font-bold text-red-600">{returned}</p>
                    </div>
                </div>
                <div className="flex gap-3 mb-6">
                    {['all', 'submitted', 'approved', 'returned'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${
                                filter === f 
                                    ? 'bg-blue-600 text-white' 
                                    : 'bg-white text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <p className="text-gray-500">Loading...</p>
                ) : filteredGoals.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-xl shadow-sm">
                        <p className="text-gray-500">No goals found!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredGoals.map(goal => (
                            <GoalCard key={goal._id} goal={goal} onUpdate={fetchGoals} />
                        ))}
                    </div>
                )}

            </div>
        </div>
    )
}

export default ManagerDashboard
