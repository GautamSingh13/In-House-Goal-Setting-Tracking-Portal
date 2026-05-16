const mongoose = require('mongoose')

const auditLogSchema = new mongoose.Schema({

    goal: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Goal',
        required: true
    },

    changedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    action: {
        type: String,
        required: true
    },

    previousValue: {
        type: String,
        default: ''
    },

    newValue: {
        type: String,
        default: ''
    }

}, {
    timestamps: true
})

module.exports = mongoose.model('AuditLog', auditLogSchema)