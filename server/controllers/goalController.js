const Goal = require('../models/Goal')
const AuditLog = require('../models/AuditLog')

const calculateProgress = (goal, actual) => {
    if (!actual && actual !== 0) return 0
    switch (goal.uom) {
        case 'numeric':
        case 'percentage':
            return Math.min(Math.round((actual / goal.target) * 100), 100)
        case 'zero':
            return actual === 0 ? 100 : 0
        case 'timeline':
            return actual <= goal.target ? 100 : 0
        default:
            return 0
    }
}

const createGoal = async (req, res) => {
    try {
        const { thrustArea, title, description, uom, target, weightage } = req.body
        const existingGoals = await Goal.find({ employee: req.user._id })
        if (existingGoals.length >= 8) {
            return res.status(400).json({ message: 'Maximum 8 goals allowed' })
        }
        if (weightage < 10) {
            return res.status(400).json({ message: 'Minimum weightage is 10%' })
        }
        if (target < 0) {
            return res.status(400).json({ message: 'Target cannot be negative' })
        }
        const goal = await Goal.create({
            employee: req.user._id,
            thrustArea, title, description, uom, target, weightage
        })
        res.status(201).json(goal)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const submitGoals = async (req, res) => {
    try {
        const draftGoals = await Goal.find({ employee: req.user._id, status: 'draft' })
        if (draftGoals.length === 0) {
            return res.status(400).json({ message: 'No goals to submit' })
        }
        const approvedGoals = await Goal.find({ employee: req.user._id, status: 'approved' })
        const approvedWeightage = approvedGoals.reduce((sum, g) => sum + g.weightage, 0)
        const draftWeightage = draftGoals.reduce((sum, g) => sum + g.weightage, 0)
        const totalWeightage = approvedWeightage + draftWeightage
        if (Math.round(totalWeightage) !== 100) {
            return res.status(400).json({
                message: `Total weightage must be 100%. Current: ${totalWeightage}%`
            })
        }
        await Goal.updateMany(
            { employee: req.user._id, status: 'draft' },
            { status: 'submitted' }
        )
        res.json({ message: 'Goals submitted successfully' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const getMyGoals = async (req, res) => {
    try {
        const goals = await Goal.find({ employee: req.user._id })
        res.json(goals)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const getTeamGoals = async (req, res) => {
    try {
        const goals = await Goal.find().populate('employee', 'name email')
        res.json(goals)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const approveGoal = async (req, res) => {
    try {
        const goal = await Goal.findById(req.params.id).populate('employee')
        if (!goal) return res.status(404).json({ message: 'Goal not found' })
        if (goal.employee._id.toString() === req.user._id.toString()) {
            return res.status(400).json({ message: 'You cannot approve your own goals!' })
        }

        await AuditLog.create({
            goal: goal._id,
            changedBy: req.user._id,
            action: 'Goal Approved',
            previousValue: 'submitted',
            newValue: 'approved'
        })

        goal.status = 'approved'
        goal.isLocked = true
        await goal.save()
        res.json({ message: 'Goal approved and locked' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const managerEditGoal = async (req, res) => {
    try {
        const goal = await Goal.findById(req.params.id)
        if (!goal) return res.status(404).json({ message: 'Goal not found' })
        if (goal.status !== 'submitted') {
            return res.status(400).json({ message: 'Only submitted goals can be edited by manager' })
        }

        const { target, weightage, description } = req.body

        await AuditLog.create({
            goal: goal._id,
            changedBy: req.user._id,
            action: 'Manager Edited Goal',
            previousValue: `Target: ${goal.target}, Weightage: ${goal.weightage}%`,
            newValue: `Target: ${target || goal.target}, Weightage: ${weightage || goal.weightage}%`
        })

        if (target) goal.target = target
        if (weightage) goal.weightage = weightage
        if (description) goal.description = description
        await goal.save()
        res.json({ message: 'Goal updated by manager', goal })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const returnGoal = async (req, res) => {
    try {
        const goal = await Goal.findById(req.params.id)
        if (!goal) return res.status(404).json({ message: 'Goal not found' })

        await AuditLog.create({
            goal: goal._id,
            changedBy: req.user._id,
            action: 'Goal Returned for Rework',
            previousValue: 'submitted',
            newValue: 'returned'
        })

        goal.status = 'returned'
        goal.managerComment = req.body.comment
        await goal.save()
        res.json({ message: 'Goal returned for rework' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const updateAchievement = async (req, res) => {
    try {
        const { quarter, actual, status } = req.body

        if (process.env.DEMO_MODE !== 'true') {
            const month = new Date().getMonth() + 1
            const allowedQuarters = {
                Q1: [7, 8, 9],
                Q2: [10, 11, 12],
                Q3: [1, 2],
                Q4: [3, 4]
            }
            const allowed = allowedQuarters[quarter]
            if (!allowed || !allowed.includes(month)) {
                return res.status(400).json({
                    message: `${quarter} check-in window is not open. Schedule: Q1→July, Q2→October, Q3→January, Q4→March/April`
                })
            }
        }

        const goal = await Goal.findById(req.params.id)
        if (!goal) return res.status(404).json({ message: 'Goal not found' })

        const progressScore = calculateProgress(goal, Number(actual))

        const existingQuarter = goal.achievements.find(a => a.quarter === quarter)
        if (existingQuarter) {
            existingQuarter.actual = actual
            existingQuarter.status = status
            existingQuarter.progressScore = progressScore
        } else {
            goal.achievements.push({ quarter, actual, status, progressScore })
        }

        await goal.save()
        res.json({ message: 'Achievement updated successfully', progressScore })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const addCheckinComment = async (req, res) => {
    try {
        const { quarter, managerComment } = req.body
        const goal = await Goal.findById(req.params.id)
        if (!goal) return res.status(404).json({ message: 'Goal not found' })

        const existingQuarter = goal.achievements.find(a => a.quarter === quarter)
        if (!existingQuarter) {
            return res.status(400).json({ message: 'No achievement found for this quarter' })
        }

        existingQuarter.managerComment = managerComment
        await goal.save()
        res.json({ message: 'Check-in comment added successfully' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const unlockGoal = async (req, res) => {
    try {
        const goal = await Goal.findById(req.params.id)
        if (!goal) return res.status(404).json({ message: 'Goal not found' })

        await AuditLog.create({
            goal: goal._id,
            changedBy: req.user._id,
            action: 'Goal Unlocked by Admin',
            previousValue: 'locked',
            newValue: 'unlocked'
        })

        goal.isLocked = false
        goal.status = 'draft'
        await goal.save()
        res.json({ message: 'Goal unlocked successfully' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const deleteGoal = async (req, res) => {
    try {
        const goal = await Goal.findById(req.params.id)
        if (!goal) return res.status(404).json({ message: 'Goal not found' })
        if (req.user.role === 'employee') {
            if (goal.isLocked || goal.status !== 'draft') {
                return res.status(400).json({ message: 'You can only delete your draft goals' })
            }
        }
        
        if (req.user.role === 'admin') {
            await AuditLog.create({
                goal: goal._id,
                changedBy: req.user._id,
                action: 'Goal Deleted by Admin',
                previousValue: goal.status,
                newValue: 'deleted'
            })
        }
        await Goal.findByIdAndDelete(req.params.id)
        res.json({ message: 'Goal deleted successfully' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const editGoal = async (req, res) => {
    try {
        const goal = await Goal.findById(req.params.id)
        if (!goal) return res.status(404).json({ message: 'Goal not found' })
        if (goal.status !== 'returned' && goal.status !== 'draft') {
            return res.status(400).json({ message: 'Only draft or returned goals can be edited' })
        }
        if (goal.isLocked) {
            return res.status(400).json({ message: 'Locked goal cannot be edited' })
        }
        const { thrustArea, title, description, uom, target, weightage } = req.body
        goal.thrustArea = thrustArea || goal.thrustArea
        goal.title = title || goal.title
        goal.description = description || goal.description
        goal.uom = uom || goal.uom
        goal.target = target || goal.target
        goal.weightage = weightage || goal.weightage
        goal.status = 'draft'
        goal.managerComment = ''
        goal.isLocked = false
        await goal.save()
        res.json({ message: 'Goal updated successfully', goal })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const getCompletionStats = async (req, res) => {
    try {
        const goals = await Goal.find().populate('employee', 'name email')


        const employeeMap = {}
        goals.forEach(goal => {
            if (!goal.employee) return
            const empId = goal.employee._id.toString()
            if (!employeeMap[empId]) {
                employeeMap[empId] = {
                    name: goal.employee.name,
                    email: goal.employee.email,
                    totalGoals: 0,
                    approvedGoals: 0,
                    checkins: { Q1: false, Q2: false, Q3: false, Q4: false }
                }
            }
            employeeMap[empId].totalGoals++
            if (goal.status === 'approved') employeeMap[empId].approvedGoals++
            goal.achievements.forEach(a => {
                employeeMap[empId].checkins[a.quarter] = true
            })
        })

        res.json(Object.values(employeeMap))
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports = {
    createGoal,
    submitGoals,
    getMyGoals,
    getTeamGoals,
    approveGoal,
    managerEditGoal,
    returnGoal,
    updateAchievement,
    addCheckinComment,
    unlockGoal,
    deleteGoal,
    editGoal,
    getCompletionStats
}