const mongoose = require('mongoose')

const goalSchema = new mongoose.Schema({

    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    thrustArea: {
        type: String,
        required: true
    },

    title: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    uom: {
        type: String,
        enum: ['numeric', 'percentage', 'timeline', 'zero'],
        required: true
    },

    target: {
        type: Number,
        required: true
    },

    weightage: {
        type: Number,
        required: true,
        min: 10
    },

    status: {
        type: String,
        enum: ['draft', 'submitted', 'approved', 'returned'],
        default: 'draft'
    },

    isLocked: {
        type: Boolean,
        default: false
    },

    isShared: {
        type: Boolean,
        default: false
    },

    managerComment: {
        type: String,
        default: ''
    },

    achievements: [{
        quarter: {
            type: String,
            enum: ['Q1', 'Q2', 'Q3', 'Q4']
        },
        actual: {
            type: Number,
            default: 0
        },
        status: {
            type: String,
            enum: ['not_started', 'on_track', 'completed'],
            default: 'not_started'
        },
        managerComment: {
            type: String,
            default: ''
        }
    }]

}, {
    timestamps: true
})
module.exports = mongoose.model('Goal', goalSchema)