 import { useState } from 'react'
import api from '../services/api'
import toast from 'react-hot-toast'

const GoalForm = ({ onGoalCreated }) => {
    const [formData, setFormData] = useState({
        thrustArea: '',
        title: '',
        description: '',
        uom: 'numeric',
        target: '',
        weightage: ''
    })
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (formData.weightage < 10) {
            toast.error('Minimum weightage is 10%')
            return
        }

        setLoading(true)
        try {
            await api.post('/goals', {
                ...formData,
                target: Number(formData.target),
                weightage: Number(formData.weightage)
            })
            toast.success('Goal created successfully!')

            setFormData({
                thrustArea: '',
                title: '',
                description: '',
                uom: 'numeric',
                target: '',
                weightage: ''
            })

            onGoalCreated()

        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create goal')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Create New Goal</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Thrust Area</label>
                        <input
                            name="thrustArea"
                            value={formData.thrustArea}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g. Sales, HR, Operations"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Goal Title</label>
                        <input
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g. Increase Revenue"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Describe your goal"
                        rows={3}
                        required
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Unit of Measurement</label>
                        <select
                            name="uom"
                            value={formData.uom}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="numeric">Numeric</option>
                            <option value="percentage">Percentage</option>
                            <option value="timeline">Timeline</option>
                            <option value="zero">Zero Based</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Target</label>
                        <input
                            type="number"
                            name="target"
                            value={formData.target}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g. 5000000"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                             Weightage (%)
                        </label>
                        <input
                                            type="number"
                        name="weightage"
                        value={formData.weightage}
                        onChange={(e) => {
                        const val = e.target.value

                        if (Number(val) > 100) {
                        toast.error('Weightage cannot exceed 100%, please enter a valid value!')
                        setFormData({ ...formData, weightage: '' })
                        return
                        }

                        setFormData({ ...formData, weightage: val })
                        }}
                        onBlur={(e) => {
                        const val = e.target.value

                        if (val === '') return

                        if (val.includes('.')) {
                        toast.error('Weightage should be a whole number, float values are not valid!')
                        setFormData({ ...formData, weightage: '' })
                        return
                        }

                        if (Number(val) < 10) {
                        toast.error('Weightage should be Atleast 10%, please enter a valid value!')
                        setFormData({ ...formData, weightage: '' })
                        return
                        }
                            }}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Min 10%, whole numbers only"
                        min={10}
                        max={100}
                         step={1}
                        required
                        />
                        <p className="text-xs text-gray-400 mt-1">
                         Enter whole numbers only — e.g. 10, 25, 40 (No decimals like 33.3)
                        </p>
                        </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? 'Creating...' : 'Create Goal'}
                </button>

            </form>
        </div>
    )
}

export default GoalForm
