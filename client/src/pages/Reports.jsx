import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import api from '../services/api'
import toast from 'react-hot-toast'

const Reports = () => {
    const [goals, setGoals] = useState([])
    const [loading, setLoading] = useState(true)

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

    const exportCSV = () => {
        const headers = ['Employee', 'Title', 'Thrust Area', 'UoM', 'Target', 'Weightage', 'Status']
        
        const rows = goals.map(goal => [
            goal.employee?.name || 'N/A',
            goal.title,
            goal.thrustArea,
            goal.uom,
            goal.target,
            goal.weightage + '%',
            goal.status
        ])

        const csvContent = [headers, ...rows]
            .map(row => row.join(','))
            .join('\n')

        const blob = new Blob([csvContent], { type: 'text/csv' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'atomquest-goals-report.csv'
        a.click()

        toast.success('Report downloaded!')
    }

    const totalGoals = goals.length
    const approvedGoals = goals.filter(g => g.status === 'approved').length
    const submittedGoals = goals.filter(g => g.status === 'submitted').length
    const completionRate = totalGoals > 0 ? Math.round((approvedGoals / totalGoals) * 100) : 0

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />

            <div className="max-w-6xl mx-auto px-6 py-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Reports 📊</h1>
                        <p className="text-gray-500">Goal completion and progress reports</p>
                    </div>
                    <button
                        onClick={exportCSV}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
                    >
                        ⬇️ Export CSV
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <p className="text-sm text-gray-500">Total Goals</p>
                        <p className="text-3xl font-bold text-blue-600">{totalGoals}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <p className="text-sm text-gray-500">Approved</p>
                        <p className="text-3xl font-bold text-green-600">{approvedGoals}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <p className="text-sm text-gray-500">Pending Review</p>
                        <p className="text-3xl font-bold text-yellow-600">{submittedGoals}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <p className="text-sm text-gray-500">Completion Rate</p>
                        <p className="text-3xl font-bold text-purple-600">{completionRate}%</p>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                    <div className="flex justify-between items-center mb-2">
                        <p className="text-sm font-medium text-gray-700">Overall Completion</p>
                        <p className="text-sm font-bold text-green-600">{completionRate}%</p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                        <div
                            className="h-4 rounded-full bg-green-500"
                            style={{ width: `${completionRate}%` }}
                        />
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-bold text-gray-800">All Goals</h2>
                    </div>
                    {loading ? (
                        <p className="text-gray-500 p-6">Loading...</p>
                    ) : (
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Goal</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thrust Area</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Weightage</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {goals.map(goal => (
                                    <tr key={goal._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm text-gray-800">
                                            {goal.employee?.name || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-800">
                                            {goal.title}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {goal.thrustArea}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {goal.weightage}%
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                goal.status === 'approved' ? 'bg-green-100 text-green-700' :
                                                goal.status === 'submitted' ? 'bg-yellow-100 text-yellow-700' :
                                                goal.status === 'returned' ? 'bg-red-100 text-red-700' :
                                                'bg-gray-100 text-gray-700'
                                            }`}>
                                                {goal.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

            </div>
        </div>
    )
}

export default Reports 
