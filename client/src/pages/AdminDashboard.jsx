import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import GoalCard from '../components/GoalCard'
import api from '../services/api'

const AdminDashboard = () => {
    const [goals, setGoals] = useState([])
    const [users, setUsers] = useState([])
    const [logs, setLogs] = useState([])
    const [completion, setCompletion] = useState([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('goals')

    const fetchData = async () => {
        try {
            const [goalsRes, usersRes, logsRes, completionRes] = await Promise.all([
                api.get('/goals/team'),
                api.get('/users'),
                api.get('/users/audit/logs'),
                api.get('/goals/completion')
            ])
            setGoals(goalsRes.data)
            setUsers(usersRes.data)
            setLogs(logsRes.data)
            setCompletion(completionRes.data)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchData() }, [])

    const totalGoals = goals.length
    const approvedGoals = goals.filter(g => g.status === 'approved').length
    const lockedGoals = goals.filter(g => g.isLocked).length
    const totalUsers = users.length

    const tabs = [
        { key: 'goals', label: 'All Goals' },
        { key: 'users', label: 'All Users' },
        { key: 'completion', label: 'Completion' },
        { key: 'audit', label: 'Audit Trail' }
    ]

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-6xl mx-auto px-6 py-8">

                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
                    <p className="text-gray-400 text-sm mt-1">Manage organization goals and users</p>
                </div>

                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: 'Total Users', value: totalUsers, color: 'var(--primary)' },
                        { label: 'Total Goals', value: totalGoals, color: '#7c3aed' },
                        { label: 'Approved', value: approvedGoals, color: '#16a34a' },
                        { label: 'Locked', value: lockedGoals, color: '#d97706' },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white rounded-xl p-5 border border-gray-100">
                            <p className="text-xs text-gray-400 mb-1">{stat.label}</p>
                            <p className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
                        </div>
                    ))}
                </div>

                
                <div className="flex gap-2 mb-6">
                    {tabs.map(tab => (
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
                    loading ? <p className="text-gray-400 text-sm">Loading...</p> : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {goals.map(goal => (
                                <GoalCard key={goal._id} goal={goal} onUpdate={fetchData} />
                            ))}
                        </div>
                    )
                )}

               
            {activeTab === 'users' && (
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-100">
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Role</th>
                        </tr>
             </thead>
                     <tbody>
                          {users.map(user => (
                             <tr key={user._id} className="border-b border-gray-50 hover:bg-gray-50">
                                 <td className="px-6 py-4 text-sm font-medium text-gray-800">{user.name}</td>
                                  <td className="px-6 py-4 text-sm text-gray-400">{user.email}</td>
                                 <td className="px-6 py-4">
                                     <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                                    user.role === 'admin' ? 'bg-purple-50 text-purple-700' :
                                    user.role === 'manager' ? 'bg-blue-50 text-blue-700' :
                                    'bg-green-50 text-green-700'
                                     }`}>
                                     {user.role}
                                     </span>
                                 </td>
                             </tr>
                         ))}
                     </tbody>
                 </table>
             </div>
                )}

                
                {activeTab === 'completion' && (
                    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Employee</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Goals</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Q1</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Q2</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Q3</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Q4</th>
                                </tr>
                            </thead>
                    <tbody>
                        {completion.map((emp, i) => (
                            <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                                  <td className="px-6 py-4">
                                      <p className="text-sm font-medium text-gray-800">{emp.name}</p>
                                       <p className="text-xs text-gray-400">{emp.email}</p>
                                  </td>
                                  <td className="px-6 py-4 text-sm text-gray-600">
                                     {emp.approvedGoals}/{emp.totalGoals} approved
                                 </td>
                                 {['Q1', 'Q2', 'Q3', 'Q4'].map(q => (
                                <td key={q} className="px-6 py-4">
                                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                     emp.checkins[q]
                                     ? 'bg-green-50 text-green-700'
                                     : 'bg-gray-100 text-gray-400'
                                         }`}>
                                     {emp.checkins[q] ? 'Done' : 'Pending'}
                                     </span>
                                      </td>
                                 ))}
                            </tr>
                          ))}
                    </tbody>
                        </table>
                    </div>
                )}

                
                {activeTab === 'audit' && (
                    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                        {logs.length === 0 ? (
                            <p className="text-gray-400 text-sm text-center py-8">No audit logs yet</p>
                        ) : (
                            <table className="w-full">
                    <thead>
                         <tr className="border-b border-gray-100">
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Action</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Goal</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Changed By</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Previous</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">New</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">When</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.map((log, i) => (
                            <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                                 <td className="px-6 py-4 text-sm font-medium text-gray-800">{log.action}</td>
                                <td className="px-6 py-4 text-sm text-gray-500">{log.goal?.title || 'N/A'}</td>
                                 <td className="px-6 py-4 text-sm text-gray-500">{log.changedBy?.name || 'N/A'}</td>
                                <td className="px-6 py-4 text-xs text-gray-400">{log.previousValue}</td>
                                <td className="px-6 py-4 text-xs text-gray-400">{log.newValue}</td>
                                 <td className="px-6 py-4 text-xs text-gray-400">
                                 {new Date(log.createdAt).toLocaleString()}
                                 </td>
                            </tr>
                         ))}
                     </tbody>
                            </table>
                        )}
                    </div>
                )}

            </div>
        </div>
    )
}

export default AdminDashboard