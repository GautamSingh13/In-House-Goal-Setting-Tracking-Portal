const express = require('express')
const router = express.Router()
const {
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
} = require('../controllers/goalController')
const { protect, authorize } = require('../middleware/authMiddleware')

router.get('/my', protect, getMyGoals)
router.post('/', protect, authorize('employee'), createGoal)
router.put('/submit', protect, authorize('employee'), submitGoals)
router.put('/:id/achievement', protect, authorize('employee'), updateAchievement)
router.put('/:id/edit', protect, authorize('employee'), editGoal)
router.delete('/:id', protect, authorize('employee', 'admin'), deleteGoal)

router.get('/team', protect, authorize('manager', 'admin'), getTeamGoals)
router.put('/:id/approve', protect, authorize('manager', 'admin'), approveGoal)
router.put('/:id/manager-edit', protect, authorize('manager'), managerEditGoal)
router.put('/:id/return', protect, authorize('manager', 'admin'), returnGoal)
router.put('/:id/checkin-comment', protect, authorize('manager'), addCheckinComment)

router.put('/:id/unlock', protect, authorize('admin'), unlockGoal)

router.get('/completion', protect, authorize('admin', 'manager'), getCompletionStats)

module.exports = router