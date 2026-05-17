import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import GoalCard from '../components/GoalCard'
import api from '../services/api'

const ManagerDashboard = () => {
    const [goals, setGoals] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('all')
    const [activeTab, setActiveTab] = useState('goals')
    const [editingGoal, setEditingGoal] = useState(null)
    const [editData, setEditData] = useState({})
    const [checkinGoal, setCheckinGoal] = useState(null)
    const [checkinComment, setCheckinComment] = useState('')
    const [checkinQuarter, setCheckinQuarter] = useState('Q1')

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

    
    const handleManagerEdit = async (goalId) => {
        try {
            await api.put(`/goals/${goalId}/manager-edit`, editData)
            import('react-hot-toast').then(({ default: toast }) => toast.success('Goal updated!'))
            setEditingGoal(null)
            setEditData({})
            fetchGoals()
        } catch (error) {
            import('react-hot-toast').then(({ default: toast }) => toast.error('Failed to update goal'))
        }
    }

   
    const handleCheckinComment = async () => {
        if (!checkinComment.trim()) return
        try {
            await api.put(`/goals/${checkinGoal}/checkin-comment`, {
                quarter: checkinQuarter,
                managerComment: checkinComment
            })
            import('react-hot-toast').then(({ default: toast }) => toast.success('Check-in comment added!'))
            setCheckinGoal(null)
            setCheckinComment('')
            fetchGoals()
        } catch (error) {
            import('react-hot-toast').then(({ default: toast }) => toast.error(error.response?.data?.message || 'Failed to add comment'))
        }
    }

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
                    {[
                        { key: 'goals', label: 'Team Goals' },
                        { key: 'checkin', label: 'Check-in Module' }
                    ].map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className="px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
                            style={activeTab === tab.key
                                ? { background: 'var(--primary)', color: '#fff' }
                                : { background: '#fff', color: '#6b7280', border: '1px solid #e5e7eb' }}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

               
                {activeTab === 'goals' && (
                    <>
                        
                        <div className="flex gap-2 mb-6">
                            {['all', 'submitted', 'approved', 'returned'].map(f => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className="px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors"
                                    style={filter === f
                                        ? { background: 'var(--primary)', color: '#fff' }
                                        : { background: '#fff', color: '#6b7280', border: '1px solid #e5e7eb' }}
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
                            <div className="space-y-4">
                                {filteredGoals.map(goal => (
                                    <div key={goal._id} className="bg-white border border-gray-100 rounded-xl p-5">

                                        
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <p className="font-semibold text-gray-800">{goal.title}</p>
                                                <p className="text-xs text-gray-400">{goal.thrustArea} · {goal.employee?.name}</p>
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

                                       
                                        {editingGoal === goal._id ? (
                                            <div className="space-y-3 mb-3 p-4 bg-gray-50 rounded-lg">
                                                <p className="text-xs font-medium text-gray-500">Edit Goal Details</p>
                                                <div className="grid grid-cols-3 gap-3">
                                                    <div>
                                                        <label className="text-xs text-gray-400">Target</label>
                                                        <input
                                                            type="number"
                                                            defaultValue={goal.target}
                                                            onChange={(e) => setEditData({ ...editData, target: Number(e.target.value) })}
                                                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none mt-1"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-xs text-gray-400">Weightage (%)</label>
                                                        <input
                                                            type="number"
                                                            defaultValue={goal.weightage}
                                                            onChange={(e) => setEditData({ ...editData, weightage: Number(e.target.value) })}
                                                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none mt-1"
                                                            min={10}
                                                            max={100}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-xs text-gray-400">Description</label>
                                                        <input
                                                            type="text"
                                                            defaultValue={goal.description}
                                                            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                                                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none mt-1"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleManagerEdit(goal._id)}
                                                        className="flex-1 text-white py-2 rounded-lg text-sm hover:opacity-90"
                                                        style={{ background: 'var(--primary)' }}
                                                    >
                                                        Save Changes
                                                    </button>
                                                    <button
                                                        onClick={() => { setEditingGoal(null); setEditData({}) }}
                                                        className="flex-1 bg-gray-100 text-gray-600 py-2 rounded-lg text-sm"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-3 gap-2 mb-3">
                                                {[
                                                    { label: 'UoM', value: goal.uom },
                                                    { label: 'Target', value: goal.target },
                                                    { label: 'Weightage', value: `${goal.weightage}%` }
                                                ].map((item, i) => (
                                                    <div key={i} className="bg-gray-50 rounded-lg p-2 text-center">
                                                        <p className="text-xs text-gray-400">{item.label}</p>
                                                        <p className="text-sm font-medium text-gray-700">{item.value}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                       
                                        {goal.status === 'submitted' && (
                                            <div className="flex gap-2 mt-3">
                                                <button
                                                    onClick={async () => {
                                                        try {
                                                            await api.put(`/goals/${goal._id}/approve`)
                                                            import('react-hot-toast').then(({ default: toast }) => toast.success('Goal approved!'))
                                                            fetchGoals()
                                                        } catch (error) {
                                                            import('react-hot-toast').then(({ default: toast }) => toast.error(error.response?.data?.message || 'Failed'))
                                                        }
                                                    }}
                                                    className="flex-1 bg-green-600 text-white py-2 rounded-lg text-xs font-medium hover:bg-green-700"
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setEditingGoal(editingGoal === goal._id ? null : goal._id)
                                                        setEditData({})
                                                    }}
                                                    className="flex-1 text-white py-2 rounded-lg text-xs font-medium hover:opacity-90"
                                                    style={{ background: 'var(--primary)' }}
                                                >
                                                    Edit Inline
                                                </button>
                                                <button
                                                    onClick={async () => {
                                                        const comment = prompt('Enter reason for returning:')
                                                        if (!comment) return
                                                        try {
                                                            await api.put(`/goals/${goal._id}/return`, { comment })
                                                            import('react-hot-toast').then(({ default: toast }) => toast.success('Goal returned!'))
                                                            fetchGoals()
                                                        } catch (error) {
                                                            import('react-hot-toast').then(({ default: toast }) => toast.error('Failed'))
                                                        }
                                                    }}
                                                    className="flex-1 bg-red-500 text-white py-2 rounded-lg text-xs font-medium hover:bg-red-600"
                                                >
                                                    Return
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}

               
                {activeTab === 'checkin' && (
                    <div className="space-y-4">
                        <p className="text-sm text-gray-500">View team achievements and add check-in comments</p>

                        {goals.filter(g => g.status === 'approved' && g.achievements.length > 0).length === 0 ? (
                            <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
                                <p className="text-gray-400 text-sm">No check-ins submitted yet</p>
                            </div>
                        ) : (
                            goals.filter(g => g.status === 'approved' && g.achievements.length > 0).map(goal => (
                                <div key={goal._id} className="bg-white border border-gray-100 rounded-xl p-5">

                                  
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <p className="font-semibold text-gray-800">{goal.title}</p>
                                            <p className="text-xs text-gray-400">{goal.employee?.name} · Target: {goal.target}</p>
                                        </div>
                                        <span className="text-xs bg-green-50 text-green-700 px-2.5 py-1 rounded-full font-medium">
                                            approved
                                        </span>
                                    </div>

                                    
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
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
                                                    <p className="text-xs text-gray-400 mt-1 italic">"{a.managerComment}"</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                
                                    {checkinGoal === goal._id ? (
                                        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                                            <p className="text-xs font-medium text-gray-500">Add Check-in Comment</p>
                                            <div className="flex gap-3">
                                                <select
                                                    value={checkinQuarter}
                                                    onChange={(e) => setCheckinQuarter(e.target.value)}
                                                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
                                                >
                                                    {['Q1', 'Q2', 'Q3', 'Q4'].map(q => (
                                                        <option key={q} value={q}>{q}</option>
                                                    ))}
                                                </select>
                                                <input
                                                    value={checkinComment}
                                                    onChange={(e) => setCheckinComment(e.target.value)}
                                                    className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
                                                    placeholder="Write your check-in feedback..."
                                                />
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={handleCheckinComment}
                                                    className="flex-1 text-white py-2 rounded-lg text-sm hover:opacity-90"
                                                    style={{ background: 'var(--primary)' }}
                                                >
                                                    Add Comment
                                                </button>
                                                <button
                                                    onClick={() => { setCheckinGoal(null); setCheckinComment('') }}
                                                    className="flex-1 bg-gray-100 text-gray-600 py-2 rounded-lg text-sm"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setCheckinGoal(goal._id)}
                                            className="text-sm px-4 py-2 rounded-lg text-white hover:opacity-90"
                                            style={{ background: 'var(--primary)' }}
                                        >
                                            Add Check-in Comment
                                        </button>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default ManagerDashboard