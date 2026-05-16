import api from '../services/api'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

const GoalCard = ({ goal, onUpdate }) => {
    const { user } = useAuth()

    const handleApprove = async () => {
        try {
            await api.put(`/goals/${goal._id}/approve`)
            toast.success('Goal approved!')
            onUpdate()
        } catch (error) {
            toast.error('Failed to approve goal')
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

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">

            <div className="flex justify-between items-start mb-3">
                <div>
                    <h3 className="font-bold text-gray-800">{goal.title}</h3>
                    <p className="text-sm text-gray-500">{goal.thrustArea}</p>
                </div>
                <div className="flex gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        goal.status === 'approved' ? 'bg-green-100 text-green-700' :
                        goal.status === 'submitted' ? 'bg-yellow-100 text-yellow-700' :
                        goal.status === 'returned' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-700'
                    }`}>
                        {goal.status}
                    </span>
                    {goal.isLocked && (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                            🔒 Locked
                        </span>
                    )}
                </div>
            </div>

            <p className="text-sm text-gray-600 mb-3">{goal.description}</p>

            <div className="grid grid-cols-3 gap-3 mb-3">
                <div className="bg-gray-50 rounded-lg p-2 text-center">
                    <p className="text-xs text-gray-500">UoM</p>
                    <p className="font-medium text-gray-800 text-sm">{goal.uom}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2 text-center">
                    <p className="text-xs text-gray-500">Target</p>
                    <p className="font-medium text-gray-800 text-sm">{goal.target}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2 text-center">
                    <p className="text-xs text-gray-500">Weightage</p>
                    <p className="font-medium text-gray-800 text-sm">{goal.weightage}%</p>
                </div>
            </div>

            {goal.managerComment && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
                    <p className="text-xs text-red-600 font-medium">Manager Comment:</p>
                    <p className="text-sm text-red-700">{goal.managerComment}</p>
                </div>
            )}

            <div className="flex gap-2 mt-3">

                {user?.role === 'manager' && goal.status === 'submitted' && (
                    <>
                        <button
                            onClick={handleApprove}
                            className="flex-1 bg-green-600 text-white py-2 rounded-lg text-sm hover:bg-green-700"
                        >
                            ✅ Approve
                        </button>
                        <button
                            onClick={handleReturn}
                            className="flex-1 bg-red-500 text-white py-2 rounded-lg text-sm hover:bg-red-600"
                        >
                            🔄 Return
                        </button>
                    </>
                )}

                {user?.role === 'admin' && goal.isLocked && (
                    <button
                        onClick={handleUnlock}
                        className="flex-1 bg-yellow-500 text-white py-2 rounded-lg text-sm hover:bg-yellow-600"
                    >
                        🔓 Unlock
                    </button>
                )}

                {user?.role === 'employee' && !goal.isLocked && goal.status === 'draft' && (
                    <button
                        onClick={handleDelete}
                        className="flex-1 bg-red-500 text-white py-2 rounded-lg text-sm hover:bg-red-600"
                    >
                        🗑️ Delete
                    </button>
                )}

            </div>
        </div>
    )
}

export default GoalCard