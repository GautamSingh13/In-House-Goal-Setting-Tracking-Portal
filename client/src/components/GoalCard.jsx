import { useState } from 'react'
import api from '../services/api'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

const GoalCard = ({ goal, onUpdate }) => {
    const { user } = useAuth()
    const [isEditing, setIsEditing] = useState(false)
    const [editData, setEditData] = useState({
        thrustArea: goal.thrustArea,
        title: goal.title,
        description: goal.description,
        uom: goal.uom,
        target: goal.target,
        weightage: goal.weightage
    })

    const handleApprove = async () => {
        try {
            await api.put(`/goals/${goal._id}/approve`)
            toast.success('Goal approved!')
            onUpdate()
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to approve goal')
        }
    }

    const handleReturn = async () => {
        const comment = prompt('Enter reason for returning:')
        if (!comment) return
        try {
            await api.put(`/goals/${goal._id}/return`, { comment })
            toast.success('Goal returned for rework!')
            onUpdate()
        } catch (error) {
            toast.error('Failed to return goal')
        }
    }

    const handleUnlock = async () => {
        try {
            await api.put(`/goals/${goal._id}/unlock`)
            toast.success('Goal unlocked!')
            onUpdate()
        } catch (error) {
            toast.error('Failed to unlock goal')
        }
    }

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this goal?')) return
        try {
            await api.delete(`/goals/${goal._id}`)
            toast.success('Goal deleted!')
            onUpdate()
        } catch (error) {
            toast.error('Failed to delete goal')
        }
    }

    const handleEdit = async () => {
        try {
            await api.put(`/goals/${goal._id}/edit`, {
                ...editData,
                target: Number(editData.target),
                weightage: Number(editData.weightage)
            })
            toast.success('Goal updated!')
            setIsEditing(false)
            onUpdate()
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update goal')
        }
    }

    return (
        <div className="bg-white border border-gray-100 rounded-xl p-5">

            <div className="flex justify-between items-start mb-3">
                <div>
                    <h3 className="font-semibold text-gray-800 text-sm">{goal.title}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">{goal.thrustArea}</p>
                </div>
                <div className="flex gap-1.5">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        goal.status === 'approved' ? 'bg-green-50 text-green-700' :
                        goal.status === 'submitted' ? 'bg-yellow-50 text-yellow-700' :
                        goal.status === 'returned' ? 'bg-red-50 text-red-700' :
                        'bg-gray-100 text-gray-500'
                    }`}>
                        {goal.status}
                    </span>
                    {goal.isLocked && (
                        <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-blue-50 text-blue-700">
                            Locked
                        </span>
                    )}
                </div>
            </div>

            {isEditing ? (
                <div className="space-y-2 mb-3">
                    <input
                        value={editData.title}
                        onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
                        placeholder="Goal Title"
                    />
                    <input
                        value={editData.thrustArea}
                        onChange={(e) => setEditData({ ...editData, thrustArea: e.target.value })}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
                        placeholder="Thrust Area"
                    />
                    <textarea
                        value={editData.description}
                        onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
                        placeholder="Description"
                        rows={2}
                    />
                    <div className="grid grid-cols-3 gap-2">
                        <select
                            value={editData.uom}
                            onChange={(e) => setEditData({ ...editData, uom: e.target.value })}
                            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
                        >
                            <option value="numeric">Numeric</option>
                            <option value="percentage">Percentage</option>
                            <option value="timeline">Timeline</option>
                            <option value="zero">Zero Based</option>
                        </select>
                        <input
                            type="number"
                            value={editData.target}
                            onChange={(e) => setEditData({ ...editData, target: e.target.value })}
                            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
                            placeholder="Target"
                        />
                        <input
                            type="number"
                            value={editData.weightage}
                            onChange={(e) => setEditData({ ...editData, weightage: e.target.value })}
                            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
                            placeholder="Weightage %"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handleEdit}
                            className="flex-1 text-white py-2 rounded-lg text-sm hover:opacity-90"
                            style={{ background: 'var(--primary)' }}
                        >
                            Save Changes
                        </button>
                        <button
                            onClick={() => setIsEditing(false)}
                            className="flex-1 bg-gray-100 text-gray-600 py-2 rounded-lg text-sm hover:bg-gray-200"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    <p className="text-xs text-gray-500 mb-3 leading-relaxed">{goal.description}</p>
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
                </>
            )}

            {goal.managerComment && (
                <div className="bg-red-50 border border-red-100 rounded-lg p-3 mb-3">
                    <p className="text-xs text-red-500 font-medium">Manager Comment</p>
                    <p className="text-xs text-red-600 mt-0.5">{goal.managerComment}</p>
                </div>
            )}

            <div className="flex gap-2 mt-3">
                {user?.role === 'manager' && goal.status === 'submitted' && (
                    <>
                        <button onClick={handleApprove}
                            className="flex-1 bg-green-600 text-white py-2 rounded-lg text-xs font-medium hover:bg-green-700">
                            Approve
                        </button>
                        <button onClick={handleReturn}
                            className="flex-1 bg-red-500 text-white py-2 rounded-lg text-xs font-medium hover:bg-red-600">
                            Return
                        </button>
                    </>
                )}

                {user?.role === 'admin' && goal.isLocked && (
                    <button onClick={handleUnlock}
                        className="flex-1 bg-blue-500 text-white py-2 rounded-lg text-xs font-medium hover:bg-yellow-600">
                        Unlock
                    </button>
                )}

                {user?.role === 'admin' && (
                    <button onClick={handleDelete}
                        className="flex-1 bg-red-500 text-white py-2 rounded-lg text-xs font-medium hover:bg-red-600">
                        Delete
                    </button>
                )}

                {user?.role === 'employee' && !goal.isLocked && (
                    <div className="flex gap-2 w-full">
                        {(goal.status === 'draft' || goal.status === 'returned') && (
                            <button onClick={() => setIsEditing(!isEditing)}
                                className="flex-1 text-white py-2 rounded-lg text-xs font-medium hover:opacity-90"
                                style={{ background: 'var(--primary)' }}>
                                Edit
                            </button>
                        )}
                        {goal.status === 'draft' && (
                            <button onClick={handleDelete}
                                className="flex-1 bg-red-500 text-white py-2 rounded-lg text-xs font-medium hover:bg-red-600">
                                Delete
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default GoalCard