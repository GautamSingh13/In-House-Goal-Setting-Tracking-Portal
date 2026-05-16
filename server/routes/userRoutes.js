const express = require('express')
const router = express.Router()

const { 
    getAllUsers, 
    getUserById, 
    getAuditLogs,
    getMe 
} = require('../controllers/userController')

const { protect, authorize } = require('../middleware/authMiddleware')

router.get('/me', protect, getMe)

router.get('/', protect, authorize('admin'), getAllUsers)

router.get('/:id', protect, authorize('admin'), getUserById)

router.get('/audit/logs', protect, authorize('admin'), getAuditLogs)

module.exports = router