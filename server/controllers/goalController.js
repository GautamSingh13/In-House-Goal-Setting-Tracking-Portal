const Goal = require('../models/Goal')

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
        const goal = await Goal.create({
            employee: req.user._id,
            thrustArea,
            title,
            description,
            uom,
            target,
            weightage
        })

        res.status(201).json(goal)

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
const submitGoals = async (req, res) => {
    try {

        const goals = await Goal.find({ 
            employee: req.user._id,
            status: 'draft'
        })

        if (goals.length === 0) {
            return res.status(400).json({ message: 'No goals to submit' })
        }

    
        const totalWeightage = goals.reduce((sum, goal) => sum + goal.weightage, 0)

        if (totalWeightage !== 100) {
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
        const goal = await Goal.findById(req.params.id)

        if (!goal) {
            return res.status(404).json({ message: 'Goal not found' })
        }
        goal.status = 'approved'
        goal.isLocked = true
        await goal.save()

        res.json({ message: 'Goal approved and locked' })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const returnGoal = async (req, res) => {
    try {
        const goal = await Goal.findById(req.params.id)

        if (!goal) {
            return res.status(404).json({ message: 'Goal not found' })
        }
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
        const goal = await Goal.findById(req.params.id)

        if (!goal) {
            return res.status(404).json({ message: 'Goal not found' })
        }


        const existingQuarter = goal.achievements.find(a => a.quarter === quarter)

        if (existingQuarter) {
        
            existingQuarter.actual = actual
            existingQuarter.status = status
        } else {

            goal.achievements.push({ quarter, actual, status })
        }

        await goal.save()
        res.json({ message: 'Achievement updated successfully' })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
const unlockGoal = async (req, res) => {
    try {
        const goal = await Goal.findById(req.params.id)

        if (!goal) {
            return res.status(404).json({ message: 'Goal not found' })
        }

        goal.isLocked = false
        goal.status = 'draft'
        await goal.save()

        res.json({ message: 'Goal unlocked successfully' })

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
    returnGoal,
    updateAchievement,
    unlockGoal
}