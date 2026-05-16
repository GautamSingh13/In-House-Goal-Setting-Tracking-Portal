import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import GoalForm from '../components/GoalForm'
import GoalCard from '../components/GoalCard'
import api from '../services/api'
import toast from 'react-hot-toast'

const Goals = () => {
    const [goals, setGoals] = useState([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)

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

    useEffect(() => {
        fetchGoals()
    }, [])

    const totalWeightage = goals.reduce((sum, g) => sum + g.weightage, 0)

    const handleSubmit = async () => {
        try {
            await api.put('/goals/submit')
            toast.success('Goals submitted for approval!')
            fetchGoals()
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to submit goals')
        }
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />

            <div className="max-w-6xl mx-auto px-6 py-8">

                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">My Goals</h1>
                        <p className="text-gray-500">Manage your annual goals</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setShowForm(!showForm)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                        >
                            {showForm ? 'Cancel' : '+ New Goal'}
                        </button>
                        {goals.some(g => g.status === 'draft') && (
                            <button
                                onClick={handleSubmit}
                                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                            >
                                Submit All Goals
                            </button>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                    <div className="flex justify-between items-center mb-2">
                        <p className="text-sm font-medium text-gray-700">Total Weightage</p>
                        <p className={`text-sm font-bold ${totalWeightage === 100 ? 'text-green-600' : 'text-red-600'}`}>
                            {totalWeightage}% / 100%
                        </p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                            className={`h-3 rounded-full ${totalWeightage === 100 ? 'bg-green-500' : totalWeightage > 100 ? 'bg-red-500' : 'bg-blue-500'}`}
                            style={{ width: `${Math.min(totalWeightage, 100)}%` }}
                        />
                    </div>
                    {totalWeightage !== 100 && (
                        <p className="text-xs text-red-500 mt-1">
                            Total weightage must be exactly 100% to submit
                        </p>
                    )}
                </div>

                {showForm && (
                    <div className="mb-6">
                        <GoalForm onGoalCreated={() => {
                            fetchGoals()
                            setShowForm(false)
                        }} />
                    </div>
                )}

                {loading ? (
                    <p className="text-gray-500">Loading...</p>
                ) : goals.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-xl shadow-sm">
                        <p className="text-4xl mb-4">🎯</p>
                        <p className="text-gray-500 mb-4">No goals yet! Create your first goal.</p>
                        <button
                            onClick={() => setShowForm(true)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                        >
                            Create Goal
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {goals.map(goal => (
                            <GoalCard key={goal._id} goal={goal} onUpdate={fetchGoals} />
                        ))}
                    </div>
                )}

            </div>
        </div>
    )
}

export default Goals
