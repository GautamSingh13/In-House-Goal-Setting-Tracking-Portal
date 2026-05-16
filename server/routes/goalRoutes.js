const express = require('express')

const router = express.Router()

const {
    createGoal,
    submitGoals,
    getMyGoals,
    getTeamGoals,
    approveGoal,
    returnGoal,
    updateAchievement,
    unlockGoal,
    deleteGoal
} = require('../controllers/goalController')


const { protect, authorize } = require('../middleware/authMiddleware')

router.get('/my', protect, getMyGoals)

router.post('/', protect, authorize('employee'), createGoal)

router.put('/submit', protect, authorize('employee'), submitGoals)

router.put('/:id/achievement', protect, authorize('employee'), updateAchievement)


router.get('/team', protect, authorize('manager', 'admin'), getTeamGoals)

router.put('/:id/approve', protect, authorize('manager', 'admin'), approveGoal)

router.put('/:id/return', protect, authorize('manager', 'admin'), returnGoal)

router.put('/:id/unlock', protect, authorize('admin'), unlockGoal)

router.delete('/:id', protect, authorize('employee'), deleteGoal)

module.exports = router