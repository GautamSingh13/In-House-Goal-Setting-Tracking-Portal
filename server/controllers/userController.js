const User = require('../models/User')
const AuditLog = require('../models/AuditLog')

const getAllUsers = async (req, res) => {
    try {

        const users = await User.find().select('-password')
        res.json(users)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password')
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }
        res.json(user)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const getAuditLogs = async (req, res) => {
    try {
        const logs = await AuditLog.find()
            .populate('goal', 'title')
            .populate('changedBy', 'name email role')
            .sort({ createdAt: -1 })
        res.json(logs)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password')
        res.json(user)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports = { getAllUsers, getUserById, getAuditLogs, getMe }