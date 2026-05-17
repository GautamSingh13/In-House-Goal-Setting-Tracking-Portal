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

    useEffect(() => { fetchGoals() }, [])

    const filteredGoals = filter === 'all' ? goals : goals.filter(g => g.status === filter)
    const submitted = goals.filter(g => g.status === 'submitted').length
    const approved = goals.filter(g => g.status === 'approved').length
    const returned = goals.filter(g => g.status === 'returned').length

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-6xl mx-auto px-6 py-8">

                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-800">Manager Dashboard</h1>
                    <p className="text-gray-400 text-sm mt-1">Review and approve team goals</p>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-8">
                    {[
                        { label: 'Pending Review', value: submitted, color: '#d97706' },
                        { label: 'Approved', value: approved, color: '#16a34a' },
                        { label: 'Returned', value: returned, color: '#dc2626' },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white rounded-xl p-5 border border-gray-100">
                            <p className="text-xs text-gray-400 mb-1">{stat.label}</p>
                            <p className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
                        </div>
                    ))}
                </div>


                <div className="flex gap-2 mb-6">
                    {['all', 'submitted', 'approved', 'returned'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className="px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors"
                            style={filter === f ? { background: 'var(--primary)', color: '#fff' } : { background: '#fff', color: '#6b7280', border: '1px solid #e5e7eb' }}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <p className="text-gray-400 text-sm">Loading...</p>
                ) : filteredGoals.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
                        <p className="text-gray-400 text-sm">No goals found</p>
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