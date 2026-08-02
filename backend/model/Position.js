let mongoose = require('mongoose')

let Schema = mongoose.Schema

let PositionSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    detail: {
        type: String,
        required: false
    },
    hidden: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

module.exports = mongoose.model('Position', PositionSchema)
