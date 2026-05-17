import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'

const Progress = () => {
    const { user } = useAuth()
    const [goals, setGoals] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
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
        fetchGoals()
    }, [])
    const calculateOverallProgress = () => {
        if (goals.length === 0) return 0
        let totalScore = 0
        let totalAchievements = 0

        goals.forEach(goal => {
            goal.achievements.forEach(a => {
                totalScore += a.progressScore || 0
                totalAchievements++
            })
        })

        return totalAchievements > 0 ? Math.round(totalScore / totalAchievements) : 0
    }

    const overallProgress = calculateOverallProgress()
    const completedGoals = goals.filter(g => 
        g.achievements.some(a => a.status === 'completed')).length
    const onTrackGoals = goals.filter(g => 
        g.achievements.some(a => a.status === 'on_track')).length

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-4xl mx-auto px-6 py-8">

                
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-800">My Progress</h1>
                    <p className="text-gray-400 text-sm mt-1">Track your performance across all goals</p>
                </div>

               
                <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="bg-white rounded-xl p-5 border border-gray-100">
                        <p className="text-xs text-gray-400 mb-1">Overall Progress</p>
                        <p className="text-2xl font-bold" style={{ color: 'var(--primary)' }}>{overallProgress}%</p>
                    </div>
                    <div className="bg-white rounded-xl p-5 border border-gray-100">
                        <p className="text-xs text-gray-400 mb-1">Completed Goals</p>
                        <p className="text-2xl font-bold text-green-600">{completedGoals}</p>
                    </div>
                    <div className="bg-white rounded-xl p-5 border border-gray-100">
                        <p className="text-xs text-gray-400 mb-1">On Track</p>
                        <p className="text-2xl font-bold text-yellow-600">{onTrackGoals}</p>
                    </div>
                </div>

               
                <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
                    <div className="flex justify-between items-center mb-2">
                        <p className="text-sm font-medium text-gray-600">Overall Achievement</p>
                        <p className="text-sm font-bold" style={{ color: 'var(--primary)' }}>{overallProgress}%</p>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-3">
                        <div
                            className="h-3 rounded-full transition-all"
                            style={{ 
                                width: `${overallProgress}%`,
                                background: 'var(--primary)'
                            }}
                        />
                    </div>
                </div>

               
                <div className="bg-white rounded-xl border border-gray-100 p-6">
                    <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-4">
                        Goal wise Progress
                    </h2>

                    {loading ? (
                        <p className="text-gray-400 text-sm">Loading...</p>
                    ) : goals.length === 0 ? (
                        <p className="text-gray-400 text-sm text-center py-8">
                            No approved goals yet
                        </p>
                    ) : (
                        <div className="space-y-6">
                            {goals.map(goal => {

                                
                         const avgProgress = goal.achievements.length > 0
                            ? Math.round(goal.achievements.reduce((sum, a) => sum + (a.progressScore || 0), 0) / goal.achievements.length)
                             : 0

                         return (
                             <div key={goal._id} className="border border-gray-100 rounded-lg p-4">

                                       
                                 <div className="flex justify-between items-start mb-3">
                                     <div>
                                         <p className="font-semibold text-gray-800 text-sm">{goal.title}</p>
                                     </div>
                                     <span className="text-sm font-bold" style={{ color: 'var(--primary)' }}>
                                         {avgProgress}%
                                     </span>
                                 </div>

                                       
                                 <div className="w-full bg-gray-100 rounded-full h-2 mb-3">
                                     <div
                                         className="h-2 rounded-full"
                                         style={{ 
                                             width: `${avgProgress}%`,
                                             background: avgProgress === 100 ? '#16a34a' : 'var(--primary)'
                                         }}
                                     />
                                 </div>

                                       
                                 {goal.achievements.length === 0 ? (
                                     <p className="text-xs text-gray-400">No check-ins yet</p>
                                 ) : (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {goal.achievements.map((a, i) => (
                            <div key={i} className="bg-gray-50 rounded-lg p-3">
                                <p className="text-xs text-gray-400 font-medium">{a.quarter}</p>
                                 <p className="text-base font-bold text-gray-800">{a.actual}</p>
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
                                     <p className="text-xs text-gray-400 mt-1 italic border-t border-gray-100 pt-1">
                                         "{a.managerComment}"
                                     </p>
                                )}
                             </div>
                         ))}
                        </div>
                             )}
                        </div>
                     )
                 })}
                </div>
             )}
        </div>
        </div>
        </div>
    )
}

export default Progress