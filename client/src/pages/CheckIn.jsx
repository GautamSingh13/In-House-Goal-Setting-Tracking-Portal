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

    useEffect(() => { fetchGoals() }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!selectedGoal) {
            toast.error('Please select a goal')
            return
        }
        try {
            const res = await api.put(`/goals/${selectedGoal}/achievement`, {
                ...formData,
                actual: Number(formData.actual)
            })
            toast.success(`Check-in submitted! Progress Score: ${res.data.progressScore}%`)
            setFormData({ quarter: 'Q1', actual: '', status: 'not_started' })
            setSelectedGoal(null)
            fetchGoals()
        } catch (error) {
            toast.error('Failed to submit check-in')
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-4xl mx-auto px-6 py-8">

                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-800">Quarterly Check-in</h1>
                    <p className="text-gray-400 text-sm mt-1">Log your quarterly achievements</p>
                </div>

                
                <div className="bg-white rounded-xl border border-gray-100 p-6 mb-8">
                    <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-4">Submit Check-in</h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Select Goal</label>
                            <select
                                value={selectedGoal || ''}
                                onChange={(e) => setSelectedGoal(e.target.value)}
                                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none"
                                required
                            >
                                <option value="">Choose a goal...</option>
                                {goals.map(goal => (
                                    <option key={goal._id} value={goal._id}>
                                        {goal.title} — Target: {goal.target} ({goal.uom})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Quarter</label>
                            <select
                         value={formData.quarter}
                            onChange={(e) => setFormData({ ...formData, quarter: e.target.value })}
                            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none"
                             >
                            {['Q1', 'Q2', 'Q3', 'Q4'].map(q => (
                            <option key={q} value={q}>{q}</option>
                        ))}
                    </select>
                        <p className="text-xs text-gray-400 mt-1">
                        Schedule: Q1 → July, Q2 → October, Q3 → January, Q4 → March/April
                        </p>
                        </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Actual Achievement</label>
                                <input
                                    type="number"
                                    value={formData.actual}
                                    onChange={(e) => setFormData({ ...formData, actual: e.target.value })}
                                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none"
                                    placeholder="Enter actual value"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Status</label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none"
                                >
                                    <option value="not_started">Not Started</option>
                                    <option value="on_track">On Track</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full text-white py-2.5 rounded-lg text-sm font-medium hover:opacity-90"
                            style={{ background: 'var(--primary)' }}
                        >
                            Submit Check-in
                        </button>
                    </form>
                </div>

               
                <div className="bg-white rounded-xl border border-gray-100 p-6">
                    <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-4">Achievement History</h2>

                    {loading ? (
                        <p className="text-gray-400 text-sm">Loading...</p>
                    ) : goals.length === 0 ? (
                        <p className="text-gray-400 text-sm text-center py-8">No approved goals yet</p>
                    ) : (
                        <div className="space-y-4">
                            {goals.map(goal => (
                                <div key={goal._id} className="border border-gray-100 rounded-lg p-4">
                                    <div className="flex justify-between items-center mb-3">
                                        <div>
                                            <p className="font-semibold text-gray-800 text-sm">{goal.title}</p>
                                            <p className="text-xs text-gray-400">{goal.thrustArea} · Target: {goal.target} ({goal.uom})</p>
                                        </div>
                                    </div>

                                    {goal.achievements.length === 0 ? (
                                        <p className="text-xs text-gray-400">No check-ins yet</p>
                                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {goal.achievements.map((a, i) => (
                                 <div key={i} className="bg-gray-50 rounded-lg p-3">
                                     <p className="text-xs text-gray-400 font-medium">{a.quarter}</p>
                                    <p className="text-lg font-bold text-gray-800">{a.actual}</p>
                                    <div className="flex justify-between items-center mt-1">
                                         <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                                            a.status === 'completed' ? 'bg-green-50 text-green-700' :
                                             a.status === 'on_track' ? 'bg-yellow-50 text-yellow-700' :
                                             'bg-gray-100 text-gray-500'
                                        }`}>
                                             {a.status}
                                        </span>
                                         <span className="text-xs font-bold" style={{ color: 'var(--primary)' }}>
                                               {a.progressScore || 0}%
                                        </span>
                                    </div>
                                    {a.managerComment && (
                                    <p className="text-xs text-gray-400 mt-2 italic border-t border-gray-100 pt-1">
                                    "{a.managerComment}"
                                    </p>
                                    )}
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