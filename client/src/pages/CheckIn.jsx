import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import api from '../services/api'
import toast from 'react-hot-toast'

const CheckIn = () => {
    const [goals, setGoals] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedGoal, setSelectedGoal] = useState(null)
    const [formData, setFormData] = useState({
        quarter: 'Q1',
        actual: '',
        status: 'not_started'
    })

    const fetchGoals = async () => {
        try {
            const { data } = await api.get('/goals/my')

            setGoals(data.filter(g => g.status === 'approved'))
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchGoals()
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!selectedGoal) {
            toast.error('Please select a goal')
            return
        }
        try {
            await api.put(`/goals/${selectedGoal}/achievement`, {
                ...formData,
                actual: Number(formData.actual)
            })
            toast.success('Check-in submitted successfully!')
            setFormData({ quarter: 'Q1', actual: '', status: 'not_started' })
            setSelectedGoal(null)
            fetchGoals()
        } catch (error) {
            toast.error('Failed to submit check-in')
        }
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />

            <div className="max-w-4xl mx-auto px-6 py-8">

                <h1 className="text-2xl font-bold text-gray-800 mb-2">Quarterly Check-in 📊</h1>
                <p className="text-gray-500 mb-8">Log your quarterly achievements</p>

                <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Submit Check-in</h2>

                    <form onSubmit={handleSubmit} className="space-y-4">

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Select Goal</label>
                            <select
                                value={selectedGoal || ''}
                                onChange={(e) => setSelectedGoal(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="">Choose a goal...</option>
                                {goals.map(goal => (
                                    <option key={goal._id} value={goal._id}>
                                        {goal.title} ({goal.weightage}%)
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Quarter</label>
                                <select
                                    value={formData.quarter}
                                    onChange={(e) => setFormData({ ...formData, quarter: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="Q1">Q1</option>
                                    <option value="Q2">Q2</option>
                                    <option value="Q3">Q3</option>
                                    <option value="Q4">Q4</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Actual Achievement</label>
                                <input
                                    type="number"
                                    value={formData.actual}
                                    onChange={(e) => setFormData({ ...formData, actual: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter actual value"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="not_started">Not Started</option>
                                    <option value="on_track">On Track</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700"
                        >
                            Submit Check-in
                        </button>
                    </form>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Achievement History</h2>

                    {loading ? (
                        <p className="text-gray-500">Loading...</p>
                    ) : goals.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">No approved goals yet!</p>
                    ) : (
                        <div className="space-y-4">
                            {goals.map(goal => (
                                <div key={goal._id} className="border border-gray-200 rounded-lg p-4">
                                    <div className="flex justify-between items-center mb-3">
                                        <h3 className="font-bold text-gray-800">{goal.title}</h3>
                                        <span className="text-sm text-gray-500">Target: {goal.target}</span>
                                    </div>

                                 
                                    {goal.achievements.length === 0 ? (
                                        <p className="text-sm text-gray-400">No check-ins yet</p>
                                    ) : (
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                            {goal.achievements.map((a, i) => (
                                                <div key={i} className="bg-gray-50 rounded-lg p-3 text-center">
                                                    <p className="text-xs text-gray-500 font-medium">{a.quarter}</p>
                                                    <p className="text-lg font-bold text-blue-600">{a.actual}</p>
                                                    <span className={`text-xs px-2 py-1 rounded-full ${
                                                        a.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                        a.status === 'on_track' ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-gray-100 text-gray-700'
                                                    }`}>
                                                        {a.status}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    )
}

export default CheckIn